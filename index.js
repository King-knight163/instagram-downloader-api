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

    // Detect browser (HTML) vs non-browser (JSON)
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
      --muted: rgba(255,255,255,0.75);
    }
    html,body{height:100%;margin:0;font-family:Inter, Poppins, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;}
    body{
      display:flex;
      align-items:center;
      justify-content:center;
      background:#0f1720;
      color:#fff;
      overflow:hidden;
    }

    /* Animated gradient + subtle noise */
    .bg {
      position:fixed;inset:0;z-index:0;pointer-events:none;
      background:
        radial-gradient(800px 600px at 10% 10%, rgba(45,212,191,0.07), transparent 10%),
        radial-gradient(700px 500px at 90% 90%, rgba(59,130,246,0.06), transparent 10%);
      animation: bgShift 12s linear infinite;
      mix-blend-mode: screen;
    }
    @keyframes bgShift {
      0%{transform:translateY(0) rotate(0deg)}
      50%{transform:translateY(-20px) rotate(3deg)}
      100%{transform:translateY(0) rotate(0deg)}
    }

    /* Floating blobs */
    .blob {
      position:fixed;
      width:520px;height:520px;border-radius:50%;
      filter:blur(60px);opacity:0.5;
      transform:translate3d(0,0,0);
      mix-blend-mode:screen;
      z-index:0;
    }
    .blob.a{left:-15%;top:-20%;background:linear-gradient(135deg,#ff6b6b,#f7b267);animation:floatA 18s ease-in-out infinite;}
    .blob.b{right:-10%;bottom:-25%;background:linear-gradient(135deg,#5eead4,#3b82f6);animation:floatB 20s ease-in-out infinite;}
    @keyframes floatA{0%{transform:translateY(0) scale(1)}50%{transform:translateY(40px) scale(1.03)}100%{transform:translateY(0) scale(1)}}
    @keyframes floatB{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(0.98)}100%{transform:translateY(0) scale(1)}}

    /* Container */
    .wrap{
      position:relative;z-index:2;
      width:96%;max-width:920px;padding:32px;border-radius:18px;
      background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
      box-shadow: 0 10px 40px rgba(2,6,23,0.6);
      border: 1px solid rgba(255,255,255,0.04);
      backdrop-filter: blur(10px) saturate(120%);
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
      background:linear-gradient(135deg,#0ea5a9,#7c3aed);
      display:flex;align-items:center;justify-content:center;font-weight:700;font-family:Poppins;
      box-shadow: 0 6px 18px rgba(124,58,237,0.16);
    }
    h1{font-size:1.1rem;margin:0;color:var(--accent);letter-spacing:0.2px}
    p.sub{margin:0;color:var(--muted);font-size:0.9rem}

    .card{
      display:grid;grid-template-columns: 1fr 380px; gap:20px;align-items:start;
    }
    @media (max-width:880px){ .card{grid-template-columns:1fr; } .preview{order: -1} }

    .meta{
      padding:18px;border-radius:12px;background:var(--glass-bg);border:1px solid var(--glass-border);
    }
    .preview{
      padding:18px;border-radius:12px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
      border:1px solid rgba(255,255,255,0.04);
      display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:320px;
    }
    img.preview-media, video.preview-media{
      max-width:100%;max-height:520px;border-radius:12px;box-shadow:0 8px 30px rgba(2,6,23,0.6);
      border:1px solid rgba(255,255,255,0.05);
    }
    .info-row{display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap}
    .btn{
      display:inline-block;padding:10px 14px;border-radius:10px;font-weight:600;text-decoration:none;
      background: linear-gradient(90deg,#00e0ff,#3b82f6);color:#051025;border:0;
      box-shadow: 0 8px 24px rgba(59,130,246,0.14);
    }
    .btn.ghost{background:transparent;color:var(--muted);border:1px solid rgba(255,255,255,0.06);box-shadow:none}
    .small{font-size:0.85rem;color:var(--muted)}

    footer{
      margin-top:18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
      color:rgba(255,255,255,0.75);
      font-size:0.9rem;
    }
    a.credit{color:var(--muted);text-decoration:none}
    .tag{background:rgba(255,255,255,0.03);padding:6px 8px;border-radius:8px;font-weight:600;color:#dbeafe;border:1px solid rgba(255,255,255,0.03)}

    /* subtle hover */
    .btn:hover{transform:translateY(-3px);transition:all .18s ease}
    .logo small{display:block;font-size:10px;color:rgba(255,255,255,0.85);opacity:0.95}

  </style>
</head>
<body>
  <div class="bg" aria-hidden="true"></div>
  <div class="blob a" aria-hidden="true"></div>
  <div class="blob b" aria-hidden="true"></div>

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

  <script>
    // Small helper to avoid layout shift for very long JSON blocks
    (function(){/* noop */})()
  </script>
</body>
</html>`);
    } else {
      // JSON response for bots/scripts
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

/**
 * Small helper to escape HTML inserted into template
 * (keeps things safer when reflecting input)
 */
function escapeHtml(str){
  if (!str) return '';
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
