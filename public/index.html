<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FailSafe — Payment Recovery</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--em:#10b981;--em-dim:rgba(16,185,129,0.12);--em-b:rgba(16,185,129,0.25);--red:#f43f5e;--red-dim:rgba(244,63,94,0.1);--amber:#f59e0b;--bg:#060810;--surface:#0d1117;--surface2:#111827;--border:rgba(255,255,255,0.06);--text:#f1f5f9;--muted:#64748b;--subtle:#1e293b}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;overflow-x:hidden}
body::before{content:'';position:fixed;top:-20%;left:-10%;width:600px;height:600px;background:radial-gradient(circle,rgba(16,185,129,0.06) 0%,transparent 70%);pointer-events:none;animation:drift 20s ease-in-out infinite}
body::after{content:'';position:fixed;bottom:-20%;right:-10%;width:500px;height:500px;background:radial-gradient(circle,rgba(244,63,94,0.04) 0%,transparent 70%);pointer-events:none;animation:drift 25s ease-in-out infinite reverse}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,20px)}}
.wrap{max-width:1080px;margin:0 auto;padding:40px 24px;position:relative;z-index:1}
.header{display:flex;align-items:center;justify-content:space-between;margin-bottom:48px;animation:fadeUp .6s ease both}
.brand{display:flex;align-items:center;gap:16px}
.brand-mark{width:46px;height:46px;background:var(--em-dim);border:1px solid var(--em-b);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 0 20px rgba(16,185,129,0.2)}
.brand-name{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#fff}
.brand-name span{color:var(--em)}
.brand-sub{font-size:12px;color:var(--muted);margin-top:1px}
.pill{display:flex;align-items:center;gap:8px;background:var(--em-dim);border:1px solid var(--em-b);border-radius:100px;padding:8px 16px;font-size:12px;font-weight:500;color:var(--em)}
.pulse{width:7px;height:7px;border-radius:50%;background:var(--em);animation:ping 2s cubic-bezier(0,0,.2,1) infinite}
@keyframes ping{0%{box-shadow:0 0 0 0 rgba(16,185,129,.4)}70%{box-shadow:0 0 0 8px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px;animation:fadeUp .6s .1s ease both}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;position:relative;overflow:hidden;transition:transform .2s,border-color .2s}
.stat:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.1)}
.stat::before{content:'';position:absolute;top:0;left:0;right:0;height:1px}
.stat.g::before{background:linear-gradient(90deg,transparent,var(--em),transparent)}
.stat.r::before{background:linear-gradient(90deg,transparent,var(--red),transparent)}
.stat.b::before{background:linear-gradient(90deg,transparent,#60a5fa,transparent)}
.stat-ico{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:20px}
.stat.g .stat-ico{background:var(--em-dim)}
.stat.r .stat-ico{background:var(--red-dim)}
.stat.b .stat-ico{background:rgba(96,165,250,.1)}
.stat-val{font-family:'Syne',sans-serif;font-size:36px;font-weight:700;color:#fff;line-height:1;margin-bottom:6px;letter-spacing:-1px}
.stat.g .stat-val{color:var(--em)}
.stat.r .stat-val{color:var(--red)}
.stat-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;font-weight:500}
.card{background:var(--surface);border:1px solid var(--border);border-radius:20px;overflow:hidden;margin-bottom:20px;animation:fadeUp .6s .2s ease both}
.card-head{display:flex;align-items:center;justify-content:space-between;padding:20px 28px;border-bottom:1px solid var(--border)}
.card-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#fff}
.card-sub{font-size:12px;color:var(--muted);margin-top:2px}
.btn-ref{display:flex;align-items:center;gap:6px;background:transparent;border:1px solid var(--border);border-radius:10px;padding:7px 14px;cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;color:var(--muted);transition:all .2s}
.btn-ref:hover{border-color:rgba(255,255,255,.15);color:var(--text)}
table{width:100%;border-collapse:collapse}
th{padding:12px 28px;text-align:left;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);background:rgba(255,255,255,.01);border-bottom:1px solid var(--border)}
td{padding:18px 28px;font-size:13px;color:var(--text);border-bottom:1px solid rgba(255,255,255,.03)}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.02)}
.cname{font-weight:500;color:#fff}
.cemail{font-size:11px;color:var(--muted);margin-top:2px}
.amount{font-family:'Syne',sans-serif;font-weight:700;font-size:15px;color:#fff}
.badge{display:inline-flex;align-items:center;gap:5px;border-radius:100px;padding:4px 12px;font-size:11px;font-weight:600;white-space:nowrap}
.b-ok{background:var(--em-dim);color:var(--em);border:1px solid var(--em-b)}
.b-pen{background:rgba(245,158,11,.1);color:var(--amber);border:1px solid rgba(245,158,11,.25)}
.b-fin{background:var(--red-dim);color:var(--red);border:1px solid rgba(244,63,94,.25)}
.day{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;font-size:12px;font-weight:700;background:var(--subtle);color:var(--text)}
.empty{padding:60px 28px;text-align:center}
.empty-ico{font-size:36px;margin-bottom:16px;opacity:.4}
.empty-txt{font-size:14px;color:var(--muted)}
.test-panel{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;animation:fadeUp .6s .3s ease both;position:relative;overflow:hidden}
.test-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(16,185,129,.4),transparent)}
.test-top{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.test-badge{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);border-radius:6px;padding:3px 8px;font-size:10px;font-weight:700;color:var(--amber);letter-spacing:1px}
.test-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#fff}
.test-sub{font-size:12px;color:var(--muted);margin-top:2px}
.test-fields{display:grid;grid-template-columns:1fr 1fr 140px 1fr;gap:10px}
.fw{display:flex;flex-direction:column;gap:6px}
.fl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--muted)}
input{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:11px 14px;color:var(--text);font-family:'Inter',sans-serif;font-size:13px;outline:none;width:100%;transition:border-color .2s,background .2s}
input::placeholder{color:var(--muted)}
input:focus{border-color:rgba(16,185,129,.4);background:rgba(16,185,129,.03)}
.btn-send{background:var(--em);border:none;border-radius:10px;padding:11px 24px;cursor:pointer;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#fff;letter-spacing:.5px;transition:all .2s;box-shadow:0 0 20px rgba(16,185,129,.2);width:100%;margin-top:22px}
.btn-send:hover{background:#059669;box-shadow:0 0 30px rgba(16,185,129,.35);transform:translateY(-1px)}
.toast{position:fixed;bottom:24px;right:24px;z-index:999;display:flex;align-items:center;gap:10px;padding:14px 20px;border-radius:14px;font-size:13px;font-weight:500;opacity:0;transform:translateY(10px);transition:all .3s ease;pointer-events:none}
.toast.show{opacity:1;transform:translateY(0);pointer-events:auto}
.toast.s{background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);color:var(--em)}
.toast.e{background:rgba(244,63,94,.15);border:1px solid rgba(244,63,94,.3);color:var(--red)}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="brand">
      <div class="brand-mark">🛡</div>
      <div>
        <div class="brand-name">Fail<span>Safe</span></div>
        <div class="brand-sub">Stripe Payment Recovery</div>
      </div>
    </div>
    <div class="pill"><div class="pulse"></div>Active</div>
  </div>

  <div class="stats">
    <div class="stat g"><div class="stat-ico">💚</div><div class="stat-val" id="sR">$0.00</div><div class="stat-lbl">Total Recovered</div></div>
    <div class="stat r"><div class="stat-ico">⚠️</div><div class="stat-val" id="sL">$0.00</div><div class="stat-lbl">At Risk</div></div>
    <div class="stat b"><div class="stat-ico">📊</div><div class="stat-val" id="sT">0</div><div class="stat-lbl">Total Cases</div></div>
  </div>

  <div class="card">
    <div class="card-head">
      <div><div class="card-title">Recovery Cases</div><div class="card-sub">All failed payment sequences</div></div>
      <button class="btn-ref" onclick="load()"><span>↻</span> Refresh</button>
    </div>
    <table>
      <thead><tr><th>Customer</th><th>Amount</th><th>Email Day</th><th>Status</th><th>Date</th></tr></thead>
      <tbody id="tbody">
        <tr><td colspan="5"><div class="empty"><div class="empty-ico">🛡</div><div class="empty-txt">No failed payments yet — use the test panel below</div></div></td></tr>
      </tbody>
    </table>
  </div>

  <div class="test-panel">
    <div class="test-top">
      <div class="test-badge">TEST</div>
      <div><div class="test-title">Simulate a Failed Payment</div><div class="test-sub">Sends a real recovery email to verify everything works</div></div>
    </div>
    <div class="test-fields">
      <div class="fw"><div class="fl">Email</div><input id="tE" placeholder="customer@email.com" type="email"></div>
      <div class="fw"><div class="fl">Name</div><input id="tN" placeholder="John Doe"></div>
      <div class="fw"><div class="fl">Amount ($)</div><input id="tA" placeholder="29.00" type="number"></div>
      <div class="fw"><div class="fl">&nbsp;</div><button class="btn-send" onclick="sendTest()">Send Test Email →</button></div>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
async function load(){
  try{
    const res=await fetch('/api/recoveries');
    const d=await res.json();
    document.getElementById('sR').textContent='$'+(d.totalRecovered/100).toFixed(2);
    document.getElementById('sL').textContent='$'+(d.totalLost/100).toFixed(2);
    document.getElementById('sT').textContent=d.list.length;
    const tb=document.getElementById('tbody');
    if(!d.list.length){tb.innerHTML='<tr><td colspan="5"><div class="empty"><div class="empty-ico">🛡</div><div class="empty-txt">No failed payments yet — use the test panel below</div></div></td></tr>';return;}
    tb.innerHTML=d.list.map(r=>`<tr>
      <td><div class="cname">${esc(r.customerName)}</div><div class="cemail">${esc(r.email)}</div></td>
      <td><span class="amount">$${(r.amount/100).toFixed(2)}</span> <span style="font-size:11px;color:var(--muted)">${r.currency.toUpperCase()}</span></td>
      <td><span class="day">${r.lastEmailDay||'—'}</span></td>
      <td>${r.recovered?'<span class="badge b-ok">✓ Recovered</span>':r.lastEmailDay>=7?'<span class="badge b-fin">⚠ Final Notice</span>':'<span class="badge b-pen">⏳ In Progress</span>'}</td>
      <td style="font-size:12px;color:var(--muted)">${new Date(r.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
    </tr>`).join('');
  }catch(e){console.error(e);}
}
async function sendTest(){
  const email=document.getElementById('tE').value.trim();
  const name=document.getElementById('tN').value.trim();
  const amount=parseFloat(document.getElementById('tA').value)*100;
  if(!email)return showToast('Email is required','e');
  const res=await fetch('/api/test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,name:name||'there',amount:amount||2900})});
  if(res.ok){showToast('Recovery email sent! Check your inbox ✓');document.getElementById('tE').value='';document.getElementById('tN').value='';document.getElementById('tA').value='';setTimeout(load,800);}
  else showToast('Something went wrong','e');
}
function esc(s){return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function showToast(msg,type='s'){const t=document.getElementById('toast');t.textContent=msg;t.className=`toast show ${type}`;setTimeout(()=>t.className='toast',3000);}
load();setInterval(load,30000);
</script>
</body>
</html>