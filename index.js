import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const apiUrl = `https://storebix.serv00.net/instagram?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: `API error: ${response.statusText}` });
    }

    const data = await response.json();

    const acceptsHTML = req.headers.accept && req.headers.accept.includes('text/html');

    if (acceptsHTML) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>PLAY-Z Instagram Downloader</title>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    :root{
      --glass-bg: rgba(255,255,255,0.06);
      --glass-border: rgba(255,255,255,0.12);
      --accent: #00e0ff;
      --accent-2: #3b82f6;
      --accent-3: #7c3aed;
      --muted: rgba(255,255,255,0.75);
    }
    html,body{height:100%;margin:0;font-family:Inter, Poppins, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;}
    body{
      display:flex;
      align-items:center;
      justify-content:center;
      background:#050a14;
      color:#fff;
      overflow:hidden;
      position:relative;
    }

    /* Enhanced animated gradient background */
    .bg {
      position:fixed;inset:0;z-index:0;pointer-events:none;
      background:
        radial-gradient(circle at 20% 20%, rgba(0,224,255,0.08), transparent 25%),
        radial-gradient(circle at 80% 80%, rgba(124,58,237,0.08), transparent 25%),
        radial-gradient(circle at 40% 60%, rgba(59,130,246,0.06), transparent 30%);
      animation: bgPulse 15s ease-in-out infinite alternate;
    }
    @keyframes bgPulse {
      0%{opacity:0.5; transform:scale(1) rotate(0deg)}
      50%{opacity:0.8; transform:scale(1.05) rotate(2deg)}
      100%{opacity:0.5; transform:scale(1) rotate(0deg)}
    }

    /* Animated grid overlay */
    .grid-overlay {
      position:fixed;inset:0;z-index:1;pointer-events:none;
      background-image:
        linear-gradient(rgba(0,224,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,224,255,0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridMove 20s linear infinite;
      opacity:0.4;
    }
    @keyframes gridMove {
      0%{transform:translateY(0) translateX(0)}
      100%{transform:translateY(50px) translateX(50px)}
    }

    /* Multiple floating animated blobs */
    .blob {
      position:fixed;
      border-radius:50%;
      filter:blur(70px);
      opacity:0.6;
      mix-blend-mode:screen;
      z-index:0;
      will-change:transform;
    }
    .blob.a{
      width:600px;height:600px;
      left:-15%;top:-20%;
      background:linear-gradient(135deg,#ff6b6b 0%,#f7b267 50%, #f06292 100%);
      animation:floatA 20s ease-in-out infinite;
    }
    .blob.b{
      width:550px;height:550px;
      right:-10%;bottom:-25%;
      background:linear-gradient(135deg,#5eead4 0%,#3b82f6 50%, #7c3aed 100%);
      animation:floatB 25s ease-in-out infinite;
    }
    .blob.c{
      width:500px;height:500px;
      left:50%;top:50%;
      transform:translate(-50%,-50%);
      background:linear-gradient(135deg,#00e0ff 0%,#667eea 50%, #764ba2 100%);
      animation:floatC 18s ease-in-out infinite;
    }
    .blob.d{
      width:450px;height:450px;
      right:20%;top:10%;
      background:linear-gradient(135deg,#f093fb 0%,#f5576c 50%, #feca57 100%);
      animation:floatD 22s ease-in-out infinite;
    }
    
    @keyframes floatA{
      0%{transform:translate(0,0) scale(1) rotate(0deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%}
      33%{transform:translate(50px,-30px) scale(1.1) rotate(120deg); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%}
      66%{transform:translate(-30px,40px) scale(0.9) rotate(240deg); border-radius: 40% 50% 60% 50% / 70% 50% 40% 60%}
      100%{transform:translate(0,0) scale(1) rotate(360deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%}
    }
    @keyframes floatB{
      0%{transform:translate(0,0) scale(1) rotate(0deg); border-radius: 50% 60% 40% 50% / 40% 70% 60% 50%}
      33%{transform:translate(-40px,50px) scale(1.05) rotate(-120deg); border-radius: 70% 30% 50% 50% / 30% 50% 70% 50%}
      66%{transform:translate(30px,-40px) scale(0.95) rotate(-240deg); border-radius: 50% 40% 60% 40% / 60% 40% 50% 60%}
      100%{transform:translate(0,0) scale(1) rotate(-360deg); border-radius: 50% 60% 40% 50% / 40% 70% 60% 50%}
    }
    @keyframes floatC{
      0%{transform:translate(-50%,-50%) scale(1) rotate(0deg); border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%}
      50%{transform:translate(calc(-50% + 40px),calc(-50% + 40px)) scale(1.15) rotate(180deg); border-radius: 60% 40% 40% 60% / 40% 60% 40% 60%}
      100%{transform:translate(-50%,-50%) scale(1) rotate(360deg); border-radius: 40% 60% 50% 50% / 50% 40% 60% 50%}
    }
    @keyframes floatD{
      0%{transform:translate(0,0) scale(1) rotate(0deg); border-radius: 55% 45% 60% 40% / 45% 55% 45% 55%}
      50%{transform:translate(-50px,30px) scale(1.08) rotate(180deg); border-radius: 45% 55% 40% 60% / 55% 45% 55% 45%}
      100%{transform:translate(0,0) scale(1) rotate(360deg); border-radius: 55% 45% 60% 40% / 45% 55% 45% 55%}
    }

    /* Floating particles */
    .particles {
      position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden;
    }
    .particle {
      position:absolute;
      width:4px;height:4px;
      background:rgba(0,224,255,0.6);
      border-radius:50%;
      box-shadow: 0 0 10px rgba(0,224,255,0.8);
      animation: particleFloat 15s infinite ease-in-out;
    }
    .particle:nth-child(1){left:10%;top:20%;animation-delay:0s;animation-duration:12s}
    .particle:nth-child(2){left:20%;top:80%;animation-delay:2s;animation-duration:14s;background:rgba(124,58,237,0.6);box-shadow: 0 0 10px rgba(124,58,237,0.8)}
    .particle:nth-child(3){left:60%;top:30%;animation-delay:4s;animation-duration:16s}
    .particle:nth-child(4){left:80%;top:70%;animation-delay:1s;animation-duration:13s;background:rgba(59,130,246,0.6);box-shadow: 0 0 10px rgba(59,130,246,0.8)}
    .particle:nth-child(5){left:40%;top:60%;animation-delay:3s;animation-duration:15s}
    .particle:nth-child(6){left:90%;top:20%;animation-delay:5s;animation-duration:17s;background:rgba(0,224,255,0.6);box-shadow: 0 0 10px rgba(0,224,255,0.8)}
    .particle:nth-child(7){left:30%;top:40%;animation-delay:2.5s;animation-duration:14.5s;background:rgba(124,58,237,0.6);box-shadow: 0 0 10px rgba(124,58,237,0.8)}
    .particle:nth-child(8){left:70%;top:90%;animation-delay:4.5s;animation-duration:16.5s}
    
    @keyframes particleFloat {
      0%{transform:translateY(0) translateX(0) scale(1);opacity:0}
      10%{opacity:1}
      50%{transform:translateY(-100px) translateX(50px) scale(1.5);opacity:0.8}
      90%{opacity:0.5}
      100%{transform:translateY(-200px) translateX(-30px) scale(0.5);opacity:0}
    }

    /* Shooting stars effect */
    .star {
      position:absolute;
      width:2px;height:2px;
      background:#fff;
      border-radius:50%;
      box-shadow: 0 0 6px rgba(255,255,255,0.8);
      animation: shootingStar 3s linear infinite;
    }
    .star:nth-child(9){left:15%;top:10%;animation-delay:1s}
    .star:nth-child(10){left:70%;top:5%;animation-delay:3s}
    .star:nth-child(11){left:40%;top:15%;animation-delay:5s}
    .star:nth-child(12){left:85%;top:8%;animation-delay:7s}
    
    @keyframes shootingStar {
      0%{transform:translateY(0) translateX(0);opacity:1}
      70%{opacity:1}
      100%{transform:translateY(100px) translateX(-100px);opacity:0}
    }

    /* Enhanced container with glow */
    .wrap{
      position:relative;z-index:2;
      width:96%;max-width:920px;padding:32px;border-radius:20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
      box-shadow: 
        0 8px 32px 0 rgba(2,6,23,0.7),
        inset 0 0 0 1px rgba(255,255,255,0.05),
        0 0 40px rgba(0,224,255,0.1);
      border: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(20px) saturate(180%);
      animation: containerGlow 4s ease-in-out infinite alternate;
    }
    @keyframes containerGlow {
      0%{box-shadow: 0 8px 32px 0 rgba(2,6,23,0.7), inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 40px rgba(0,224,255,0.1)}
      100%{box-shadow: 0 8px 32px 0 rgba(2,6,23,0.7), inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 60px rgba(124,58,237,0.15)}
    }

    header{
      display:flex;align-items:center;justify-content:space-between;gap:16px;
      margin-bottom:18px;
    }
    .brand{
      display:flex;align-items:center;gap:12px;
    }
    .logo{
      width:56px;height:56px;border-radius:12px;
      background:linear-gradient(135deg,#0ea5a9,#3b82f6,#7c3aed);
      background-size:200% 200%;
      display:flex;align-items:center;justify-content:center;font-weight:700;font-family:Poppins;
      box-shadow: 0 6px 20px rgba(59,130,246,0.3), 0 0 20px rgba(0,224,255,0.2);
      animation: logoShine 3s ease-in-out infinite;
    }
    @keyframes logoShine {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    h1{
      font-size:1.1rem;margin:0;
      background:linear-gradient(90deg,var(--accent),var(--accent-2),var(--accent-3));
      background-size:200% auto;
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      background-clip:text;
      animation: textShine 3s linear infinite;
      letter-spacing:0.2px;
    }
    @keyframes textShine {
      to{background-position:200% center}
    }
    p.sub{margin:0;color:var(--muted);font-size:0.9rem}

    .card{
      display:grid;grid-template-columns: 1fr 380px; gap:20px;align-items:start;
    }
    @media (max-width:880px){ .card{grid-template-columns:1fr; } .preview{order: -1} }

    .meta{
      padding:18px;border-radius:12px;
      background:linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
      border:1px solid rgba(255,255,255,0.08);
      box-shadow: inset 0 0 20px rgba(0,224,255,0.05);
    }
    .preview{
      padding:18px;border-radius:12px;
      background:linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
      border:1px solid rgba(255,255,255,0.06);
      box-shadow: inset 0 0 15px rgba(124,58,237,0.05);
      display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:320px;
    }
    img.preview-media, video.preview-media{
      max-width:100%;max-height:520px;border-radius:12px;
      box-shadow:0 10px 40px rgba(0,224,255,0.2);
      border:1px solid rgba(255,255,255,0.08);
    }
    .info-row{display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap}
    .btn{
      display:inline-block;padding:10px 14px;border-radius:10px;font-weight:600;text-decoration:none;
      background: linear-gradient(90deg,#00e0ff,#3b82f6,#7c3aed);
      background-size:200% auto;
      color:#051025;border:0;
      box-shadow: 0 8px 24px rgba(59,130,246,0.2);
      transition:all 0.3s ease;
      position:relative;
      overflow:hidden;
    }
    .btn::before{
      content:'';
      position:absolute;inset:0;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);
      transform:translateX(-100%);
      transition:transform 0.6s;
    }
    .btn:hover::before{transform:translateX(100%)}
    .btn:hover{
      transform:translateY(-3px);
      box-shadow: 0 12px 30px rgba(0,224,255,0.3);
      background-position:right center;
    }
    .btn.ghost{
      background:rgba(255,255,255,0.05);
      color:var(--muted);
      border:1px solid rgba(255,255,255,0.1);
      box-shadow:none;
    }
    .btn.ghost:hover{
      background:rgba(255,255,255,0.1);
      border-color:rgba(0,224,255,0.3);
    }
    .small{font-size:0.85rem;color:var(--muted)}

    footer{
      margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
      color:rgba(255,255,255,0.75);
      font-size:0.9rem;
    }
    a.credit{
      color:var(--accent);text-decoration:none;
      transition:color 0.3s ease;
    }
    a.credit:hover{color:var(--accent-2)}
    .tag{
      background:linear-gradient(135deg,rgba(0,224,255,0.1),rgba(124,58,237,0.1));
      padding:6px 8px;border-radius:8px;font-weight:600;color:#dbeafe;
      border:1px solid rgba(0,224,255,0.2);
      box-shadow: 0 0 10px rgba(0,224,255,0.1);
      animation: tagPulse 2s ease-in-out infinite;
    }
    @keyframes tagPulse {
      0%,100%{box-shadow: 0 0 10px rgba(0,224,255,0.1)}
      50%{box-shadow: 0 0 20px rgba(124,58,237,0.2)}
    }

    .logo small{display:block;font-size:10px;color:rgba(255,255,255,0.85);opacity:0.95}

  </style>
</head>
<body>
  <div class="bg" aria-hidden="true"></div>
  <div class="grid-overlay" aria-hidden="true"></div>
  <div class="blob a" aria-hidden="true"></div>
  <div class="blob b" aria-hidden="true"></div>
  <div class="blob c" aria-hidden="true"></div>
  <div class="blob d" aria-hidden="true"></div>
  
  <div class="particles" aria-hidden="true">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
  </div>

  <main class="wrap" role="main">
    <header>
      <div class="brand">
        <div class="logo">PZ</div>
        <div>
          <h1>PLAY-Z Instagram Downloader</h1>
          <p class="sub">Quick preview + direct downloads — public posts only</p>
        </div>
      </div>
      <div style="text-align:right">
        <div class="tag">PLAY-Z HACKING</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px">by <a class="credit" href="https://t.me/PLAYZ_90" target="_blank">@PLAYZ_90</a></div>
      </div>
    </header>

    <section class="card">
      <div class="meta">
        <strong class="small">Source URL</strong>
        <div style="word-break:break-all;margin-top:6px;color:#e6eef8;font-weight:600">${escapeHtml(url)}</div>

        <div style="margin-top:14px">
          <div class="small">Detected media</div>
          <div class="info-row" style="margin-top:8px">
            ${data.image ? `<a class="btn" href="${data.image}" download target="_blank" rel="noopener">🔽 Download Image</a>` : ''}
            ${data.video ? `<a class="btn" href="${data.video}" download target="_blank" rel="noopener">🔽 Download Video</a>` : ''}
            <a class="btn ghost" href="?url=${encodeURIComponent(url)}" target="_self">🔁 Refresh</a>
          </div>
        </div>

        <div style="margin-top:14px" class="small">Raw JSON (for bots)</div>
        <pre style="background:rgba(0,0,0,0.25);padding:10px;border-radius:8px;margin-top:8px;overflow:auto;color:#dbeafe;font-size:13px">
${escapeHtml(JSON.stringify({ creator: "@PLAYZ_90", image: data.image || null, video: data.video || null }, null, 2))}
        </pre>
      </div>

      <div class="preview">
        ${data.image ? `<img class="preview-media" src="${data.image}" alt="Instagram image preview">` : ''}
        ${data.video ? `<video class="preview-media" controls src="${data.video}" preload="metadata"></video>` : ''}
        ${!data.image && !data.video ? `<div style="color:var(--muted)">No media found for this post or post may be private.</div>` : ''}
      </div>
    </section>

    <footer>
      <div>⚡ Created by <a class="credit" href="https://t.me/PLAYZ_90" target="_blank">@PLAYZ_90</a> — <strong>PLAY-Z HACKING</strong></div>
      <div style="opacity:0.9" class="small">Do not use for copyrighted/private content • Public posts only</div>
    </footer>
  </main>
</body>
</html>`);
    } else {
      res.status(200).json({
        success: true,
        creator: "@PLAYZ_90",
        group: "PLAY-Z HACKING",
        image: data.image || null,
        video: data.video || null,
      });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
}

function escapeHtml(str){
  if (!str) return '';
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
          }
