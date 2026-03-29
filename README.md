# 🛡 FailSafe — Stripe Payment Recovery

Stripe ödemeleri başarısız olan müşterilere otomatik email gönderir.
1., 3. ve 7. günlerde akıllı hatırlatma → müşteri kartını günceller → para kurtarılır.

---

## 🚀 KURULUM

### 1. Bağımlılıkları yükle
```
npm install
```

### 2. Environment variables ayarla
`.env` dosyası oluştur (Railway'de Variables olarak ekleyeceksin):

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
FROM_EMAIL=FailSafe <noreply@yourdomain.com>
APP_URL=https://yourdomain.com
PORT=3000
```

### 3. Çalıştır
```
npm start
```

---

## ☁️ RAILWAY DEPLOY

1. GitHub'a yükle → Railway'de repo seç
2. Railway → Variables sekmesi → yukarıdaki değerleri ekle
3. Deploy → URL al (örn: failsafe-xxx.up.railway.app)

---

## 🔗 STRİPE WEBHOOK AYARI

Deploy sonrası:
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://failsafe-xxx.up.railway.app/webhook`
3. Events: `invoice.payment_failed` ve `invoice.payment_succeeded`
4. Oluşturulan `whsec_...` secret'i Railway Variables'a ekle

---

## 🧪 TEST

Dashboard'dan test panelini kullan:
- Email, isim ve tutar gir
- "SEND TEST" tıkla
- Email geldi mi kontrol et
