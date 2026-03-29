const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Resend } = require("resend");
const cors = require("cors");
const path = require("path");

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── VERİ (in-memory, ileride Supabase eklenebilir) ───
const recoveries = {}; // { paymentIntentId: { customer, email, amount, day, recovered, createdAt } }

// ─── EMAIL ŞABLONLARI ───
function getEmailTemplate(day, customerName, amount, currency, updateUrl) {
  const templates = {
    1: {
      subject: "Action needed: Your payment didn't go through",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
          <h2 style="color:#111">Hi ${customerName},</h2>
          <p style="color:#444;line-height:1.6">We weren't able to process your payment of <strong>${amount} ${currency.toUpperCase()}</strong>.</p>
          <p style="color:#444;line-height:1.6">This can happen when a card expires or has insufficient funds. It only takes a moment to fix.</p>
          <a href="${updateUrl}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#5469d4;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">Update Payment Method</a>
          <p style="color:#888;font-size:13px">If you have any questions, just reply to this email.</p>
        </div>`
    },
    3: {
      subject: "Reminder: We still couldn't process your payment",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
          <h2 style="color:#111">Hi ${customerName},</h2>
          <p style="color:#444;line-height:1.6">This is a friendly reminder that your payment of <strong>${amount} ${currency.toUpperCase()}</strong> is still outstanding.</p>
          <p style="color:#444;line-height:1.6">To avoid any interruption to your service, please update your payment details.</p>
          <a href="${updateUrl}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#5469d4;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">Update Payment Method →</a>
          <p style="color:#888;font-size:13px">We'll try again in a few days if we don't hear from you.</p>
        </div>`
    },
    7: {
      subject: "Final notice: Payment required to keep your account active",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
          <h2 style="color:#111">Hi ${customerName},</h2>
          <p style="color:#444;line-height:1.6">We've made several attempts to process your payment of <strong>${amount} ${currency.toUpperCase()}</strong> without success.</p>
          <p style="color:#444;line-height:1.6">Your account may be suspended if payment is not received. Please update your payment method now to keep your service active.</p>
          <a href="${updateUrl}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#e53e3e;color:#fff;text-decoration:none;border-radius:6px;font-weight:600">Update Now — Keep My Account</a>
          <p style="color:#888;font-size:13px">If you believe this is an error, reply to this email and we'll help.</p>
        </div>`
    }
  };
  return templates[day];
}

// ─── EMAIL GÖNDER ───
async function sendRecoveryEmail(recoveryId, day) {
  const r = recoveries[recoveryId];
  if (!r || r.recovered) return;

  const amount = (r.amount / 100).toFixed(2);
  const updateUrl = r.updateUrl || "https://billing.stripe.com";
  const template = getEmailTemplate(day, r.customerName, amount, r.currency, updateUrl);

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "FailSafe <noreply@yourdomain.com>",
      to: r.email,
      subject: template.subject,
      html: template.html,
    });
    r.lastEmailDay = day;
    r.lastEmailAt = new Date().toISOString();
    console.log(`[EMAIL] Day ${day} sent to ${r.email}`);
  } catch (e) {
    console.error(`[EMAIL] Failed to send day ${day} to ${r.email}:`, e.message);
  }
}

// ─── ZAMANLAYICI: Her saat kontrol et ───
setInterval(() => {
  const now = Date.now();
  Object.entries(recoveries).forEach(([id, r]) => {
    if (r.recovered) return;
    const daysPassed = Math.floor((now - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysPassed >= 7 && r.lastEmailDay < 7) sendRecoveryEmail(id, 7);
    else if (daysPassed >= 3 && r.lastEmailDay < 3) sendRecoveryEmail(id, 3);
  });
}, 1000 * 60 * 60); // Her saat

// ─── STRIPE WEBHOOK ───
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error("[WEBHOOK] Signature hatası:", e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  // Ödeme başarısız
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object;
    const customerId = invoice.customer;

    try {
      const customer = await stripe.customers.retrieve(customerId);
      const recoveryId = invoice.payment_intent || invoice.id;

      // Billing portal URL oluştur
      let updateUrl = "https://billing.stripe.com";
      try {
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: process.env.APP_URL || "https://yourapp.com",
        });
        updateUrl = session.url;
      } catch {}

      recoveries[recoveryId] = {
        id: recoveryId,
        customerId,
        customerName: customer.name || "there",
        email: customer.email,
        amount: invoice.amount_due,
        currency: invoice.currency,
        updateUrl,
        recovered: false,
        lastEmailDay: 0,
        createdAt: new Date().toISOString(),
      };

      console.log(`[WEBHOOK] Başarısız ödeme: ${customer.email} — ${(invoice.amount_due/100).toFixed(2)} ${invoice.currency}`);

      // Day 1 emaili hemen gönder
      await sendRecoveryEmail(recoveryId, 1);

    } catch (e) {
      console.error("[WEBHOOK] İşlem hatası:", e.message);
    }
  }

  // Ödeme başarılı — recovery'yi kapat
  if (event.type === "invoice.payment_succeeded" || event.type === "payment_intent.succeeded") {
    const obj = event.data.object;
    const recoveryId = obj.payment_intent || obj.id;
    if (recoveries[recoveryId]) {
      recoveries[recoveryId].recovered = true;
      recoveries[recoveryId].recoveredAt = new Date().toISOString();
      console.log(`[WEBHOOK] Kurtarıldı! ${recoveries[recoveryId].email}`);
    }
  }

  res.json({ received: true });
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ─── API ───
app.get("/api/recoveries", (_, res) => {
  const list = Object.values(recoveries).sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
  const totalLost = list.filter(r => !r.recovered).reduce((a, r) => a + r.amount, 0);
  const totalRecovered = list.filter(r => r.recovered).reduce((a, r) => a + r.amount, 0);
  res.json({ list, totalLost, totalRecovered });
});

// Test endpoint (geliştirme için)
app.post("/api/test", async (req, res) => {
  const { email, name, amount } = req.body;
  const testId = "test_" + Date.now();
  recoveries[testId] = {
    id: testId,
    customerId: "test",
    customerName: name || "Test User",
    email: email || "test@example.com",
    amount: amount || 2900,
    currency: "usd",
    updateUrl: "https://billing.stripe.com",
    recovered: false,
    lastEmailDay: 0,
    createdAt: new Date().toISOString(),
  };
  await sendRecoveryEmail(testId, 1);
  res.json({ ok: true, id: testId });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n⚡ FailSafe çalışıyor → http://localhost:${PORT}\n`);
});
