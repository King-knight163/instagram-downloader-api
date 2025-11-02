import fetch from 'node-fetch';

/**
 * Combined stylish preview + interactive web app
 * - Browser: serves ultra-stylish HTML UI (interactive if no ?url=)
 * - Bots/scripts: returns JSON (same as before)
 */
export default async function handler(req, res) {
  const { url } = req.query;

  // If a non-browser client expects JSON or if ?raw=1 is present, return JSON directly.
  const wantsJson = (req.headers.accept && req.headers.accept.includes('application/json')) || req.query.raw === '1';

  // Helper to fetch external API
  async function fetchMedia(instaUrl) {
    if (!instaUrl) return { error: 'Missing url parameter' };
    const apiUrl = `https://storebix.serv00.net/instagram?url=${encodeURIComponent(instaUrl)}`;
    try {
      const response = await fetch(apiUrl, { timeout: 15000 });
      if (!response.ok) {
        const text = await response.text().catch(()=>null);
        return { error: `External API error: ${response.status} ${response.statusText}`, body: text || null, status: response.status };
      }
      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await response.text().catch(()=>null);
        return { error: 'Invalid JSON from external API', body: text || null };
      }
      const data = await response.json();
      return { ...data };
    } catch (e) {
      return { error: 'Fetch failed', details: e.message };
    }
  }

  // If the request is from a bot/script and no HTML is expected, send JSON (fast path)
  if (wantsJson) {
    if (!url) return res.status(400).json({ error: 'Missing url parameter' });
    const data = await fetchMedia(url);
    return res.status(data?.error ? 500 : 200).json({
      success: !data?.error,
      creator: "@PLAYZ_90",
      group: "PLAY-Z HACKING",
      ...data,
    });
  }

  // Otherwise we will render the HTML UI.
  // If url param provided, pre-fetch media to render immediately; else show interactive UI.
  let fetched = null;
  if (url) {
    fetched = await fetchMedia(url);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>PLAY-Z • Instagram Downloader</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
<style>
  :root{
    --bg1:#050816;
    --glass: rgba(255,255,255,0.04);
    --glass-2: rgba(255,255,255,0.02);
    --accent1: #00f0ff;
    --accent2: #7b61ff;
    --muted: rgba(255,255,255,0.75);
  }
  html,body{height:100%;margin:0;font-family:Inter, Poppins, system-ui; -webkit-font-smoothing:antialiased;}
  body{
    background: radial-gradient(800px 500px at 10% 10%, rgba(123,97,255,0.08), transparent 8%),
                radial-gradient(700px 500px at 90% 90%, rgba(0,240,255,0.06), transparent 8%),
                var(--bg1);
    color:#eaf6ff;
    display:flex;align-items:center;justify-content:center;padding:28px;overflow:hidden;
  }

  /* Neon animated background lines */
  .neon {
    position:fixed;inset:0;z-index:0;pointer-events:none;mix-blend-mode:screen;
    background-image:
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 100% 120px;
    animation: slide 14s linear infinite;
    opacity:0.6;
  }
  @keyframes slide{0%{background-position:0 0}100%{background-position:0 -120px}}

  /* Glowing moving particles */
  .particle {position:fixed;border-radius:50%;filter:blur(30px);opacity:0.65;mix-blend-mode:screen;z-index:0;}
  .p1{width:420px;height:420px;left:-10%;top:-20%;background:linear-gradient(135deg,#ff6b6b,#f7b267);animation:move1 18s ease-in-out infinite;}
  .p2{width:480px;height:480px;right:-15%;bottom:-25%;background:linear-gradient(135deg,#5eead4,#3b82f6);animation:move2 20s ease-in-out infinite;}
  @keyframes move1{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(40px) rotate(2deg)}100%{transform:translateY(0) rotate(0)}}
  @keyframes move2{0%{transform:translateY(0) rotate(0)}50%{transform:translateY(-30px) rotate(-2deg)}100%{transform:translateY(0) rotate(0)}}

  /* Container */
  .container{position:relative;z-index:2;width:100%;max-width:1100px;border-radius:18px;padding:28px;box-shadow:0 16px 60px rgba(2,6,23,0.7);background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.03);backdrop-filter: blur(10px) saturate(120%);}

  header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;}
  .logo{display:flex;align-items:center;gap:12px}
  .badge{
    width:64px;height:64px;border-radius:14px;background:linear-gradient(135deg,var(--accent1),var(--accent2));display:flex;align-items:center;justify-content:center;font-weight:700;font-family:Poppins;color:#031023;box-shadow:0 8px 28px rgba(59,130,246,0.14)
  }
  h1{margin:0;font-size:1.15rem;color:var(--accent1);letter-spacing:0.2px}
  .subtitle{margin:0;color:var(--muted);font-size:0.92rem}

  .brand-right{text-align:right}
  .tag{display:inline-block;padding:6px 10px;border-radius:999px;background:linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));font-weight:700;font-size:0.8rem}

  /* layout */
  .main-grid{display:grid;grid-template-columns: 1fr 420px;gap:22px;align-items:start}
  @media (max-width:980px){ .main-grid{grid-template-columns:1fr} .right-col{order:-1} }

  /* left: interactive */
  .card{padding:18px;border-radius:12px;background:linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.06));border:1px solid rgba(255,255,255,0.03); }
  .input-row{display:flex;gap:10px;align-items:center}
  input[type="url"]{flex:1;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);background:transparent;color: #eaf6ff;font-size:14px;outline:none}
  .actions{display:flex;gap:10px;align-items:center;margin-top:12px}
  button.btn{
    padding:10px 14px;border-radius:10px;border:0;font-weight:700;cursor:pointer;background:linear-gradient(90deg,var(--accent1),var(--accent2));color:#031023;box-shadow: 0 12px 30px rgba(59,130,246,0.12);
  }
  button.ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted);font-weight:700}

  /* right: preview */
  .preview{
    padding:18px;border-radius:12px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.03);min-height:360px;
    display:flex;flex-direction:column;align-items:center;justify-content:flex-start;
  }
  .media{max-width:100%;border-radius:10px;box-shadow:0 12px 40px rgba(2,6,23,0.6);border:1px solid rgba(255,255,255,0.04);margin-bottom:12px}
  .meta-block{width:100%;display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px}
  .meta-left{font-size:0.92rem;color:var(--muted)}
  .meta-right{display:flex;gap:8px;align-items:center}

  .small{font-size:0.85rem;color:var(--muted)}
  pre.json{width:100%;background:rgba(0,0,0,0.25);padding:10px;border-radius:8px;color:#dbeafe;overflow:auto;font-size:13px;margin-top:10px}

  /* hover effects */
  .btn:hover{transform:translateY(-4px);transition:all .18s cubic-bezier(.2,.9,.3,1)}
  .ghost:hover{transform:translateY(-2px)}

  footer{margin-top:16px;display:flex;justify-content:space-between;align-items:center;color:rgba(255,255,255,0.75);font-size:0.9rem;flex-wrap:wrap;gap:8px}
  a.credit{color:var(--accent1);text-decoration:none;font-weight:700}

  /* fancy glowing title */
  .glow-title{
    font-weight:800;
    background:linear-gradient(90deg,var(--accent1),#7ee7ff, #9b7bff);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    text-shadow: 0 6px 32px rgba(123,97,255,0.14);
    font-family:Poppins;
  }

</style>
</head>
<body>
  <div class="neon" aria-hidden="true"></div>
  <div class="particle p1" aria-hidden="true"></div>
  <div class="particle p2" aria-hidden="true"></div>

  <div class="container" role="main">
    <header>
      <div class="logo">
        <div class="badge">PZ</div>
        <div>
          <div class="glow-title">PLAY-Z Instagram Downloader</div>
          <div class="subtitle">Ultra-stylish preview • Quick downloads • Public posts only</div>
        </div>
      </div>
      <div class="brand-right">
        <div class="tag">PLAY-Z HACKING</div>
        <div style="margin-top:8px;font-size:12px;color:var(--muted)">by <a class="credit" href="https://t.me/PLAYZ_90" target="_blank">@PLAYZ_90</a></div>
      </div>
    </header>

    <section class="main-grid">
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
          <div>
            <div style="font-weight:700">Enter Instagram URL</div>
            <div class="small">Paste a public picture/reel/post URL and press Fetch</div>
          </div>
          <div style="text-align:right">
            <div class="small">Quick tips</div>
            <div class="small" style="color:var(--muted)">Use full URL (https://...)</div>
          </div>
        </div>

        <div style="margin-top:12px" class="input-row">
          <input id="instaUrl" type="url" placeholder="https://www.instagram.com/p/..." value="${url ? escapeHtml(url) : ''}" />
          <button id="fetchBtn" class="btn">Fetch</button>
        </div>

        <div class="actions">
          <button id="copyBtn" class="ghost">Copy Media Link</button>
          <button id="openRaw" class="ghost">Open JSON</button>
          <div style="flex:1"></div>
          <div class="small">Powered • <strong>PLAY-Z HACKING</strong></div>
        </div>

        <div id="status" style="margin-top:12px" class="small">${fetched ? (fetched.error ? '⚠️ ' + escapeHtml(fetched.error) : '✅ Ready — preview loaded') : 'Paste an Instagram URL above and click Fetch'}</div>

        <pre id="jsonBlock" class="json" style="display:${fetched ? 'block' : 'none'}">${fetched ? escapeHtml(JSON.stringify({ creator: "@PLAYZ_90", group:"PLAY-Z HACKING", ...(fetched || {}) }, null, 2)) : ''}</pre>
      </div>

      <aside class="preview right-col">
        <!-- If pre-fetched server-side, show it; else placeholder -->
        <div id="mediaWrap" style="width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          ${renderPreviewHtml(fetched)}
        </div>

        <div class="meta-block" style="width:100%;margin-top:8px">
          <div class="meta-left">Source: <span class="small" id="sourceUrl">${url ? escapeHtml(url) : '—'}</span></div>
          <div class="meta-right">
            <a id="downloadImage" class="btn" style="display:none" download target="_blank">🔽 Image</a>
            <a id="downloadVideo" class="btn" style="display:none" download target="_blank">🔽 Video</a>
          </div>
        </div>

        <div style="width:100%;margin-top:12px" class="small">Note: Do not use for copyrighted/private content • Public posts only</div>
      </aside>
    </section>

    <footer>
      <div>⚡ Created by <a class="credit" href="https://t.me/PLAYZ_90" target="_blank">@PLAYZ_90</a> — <strong>PLAY-Z HACKING</strong></div>
      <div style="opacity:0.9" class="small">Tip: You can open <code>?url=POST_URL</code> to pre-load preview</div>
    </footer>
  </div>

<script>
  // Helpers (client-side)
  function qs(sel){return document.querySelector(sel)}
  function escapeHtmlClient(s){ return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll(\"'\",\"&#39;\") }

  const fetchBtn = qs('#fetchBtn');
  const copyBtn = qs('#copyBtn');
  const openRaw = qs('#openRaw');
  const instaInput = qs('#instaUrl');
  const status = qs('#status');
  const jsonBlock = qs('#jsonBlock');
  const mediaWrap = qs('#mediaWrap');
  const downloadImage = qs('#downloadImage');
  const downloadVideo = qs('#downloadVideo');
  const sourceUrl = qs('#sourceUrl');

  // If page loaded with ?url= and server pre-fetched, enable download buttons from that data
  (function initFromServer() {
    try {
      if (jsonBlock && jsonBlock.textContent.trim()) {
        const obj = JSON.parse(jsonBlock.textContent);
        applyMedia(obj);
      }
    } catch(e){}
  })();

  // Fetch handler
  fetchBtn.addEventListener('click', async () => {
    const u = instaInput.value.trim();
    if (!u) { status.textContent = '❗ Please enter a valid Instagram URL'; return; }
    status.textContent = '⏳ Fetching...';
    downloadImage.style.display = downloadVideo.style.display = 'none';
    mediaWrap.innerHTML = '';
    sourceUrl.textContent = u;

    try {
      const endpoint = '?url=' + encodeURIComponent(u);
      const r = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      const json = await r.json();
      if (!r.ok || json.error) {
        status.textContent = '⚠️ ' + (json.error || 'Failed to fetch');
        jsonBlock.style.display = 'block';
        jsonBlock.textContent = JSON.stringify(json, null, 2);
        return;
      }
      status.textContent = '✅ Loaded';
      jsonBlock.style.display = 'block';
      jsonBlock.textContent = JSON.stringify(json, null, 2);
      applyMedia(json);
    } catch (e) {
      status.textContent = '❌ Fetch error: ' + e.message;
    }
  });

  // Copy media link (copies video if exists else image)
  copyBtn.addEventListener('click', () => {
    const text = (downloadVideo.href && downloadVideo.style.display !== 'none') ? downloadVideo.href : ((downloadImage.href && downloadImage.style.display !== 'none') ? downloadImage.href : '');
    if (!text) { status.textContent = '❗ No media link to copy'; return; }
    navigator.clipboard?.writeText(text).then(()=> {
      status.textContent = '✅ Media link copied to clipboard';
    }).catch(()=> {
      status.textContent = '⚠️ Could not copy automatically — open JSON to copy';
    });
  });

  // Open raw JSON
  openRaw.addEventListener('click', () => {
    const u = instaInput.value.trim();
    if (!u) return status.textContent = '❗ Enter URL first';
    window.open('?url=' + encodeURIComponent(u) + '&raw=1', '_blank');
  });

  // Apply media data to preview area and download buttons
  function applyMedia(data) {
    if (!data) return;
    const image = data.image || null;
    const video = data.video || null;
    mediaWrap.innerHTML = '';

    if (video) {
      const videoEl = document.createElement('video');
      videoEl.className = 'media';
      videoEl.controls = true;
      videoEl.preload = 'metadata';
      videoEl.src = video;
      mediaWrap.appendChild(videoEl);
      downloadVideo.href = video;
      downloadVideo.style.display = 'inline-block';
    } else {
      downloadVideo.style.display = 'none';
    }

    if (image) {
      const img = document.createElement('img');
      img.className = 'media';
      img.src = image;
      img.alt = 'Instagram image preview';
      mediaWrap.appendChild(img);
      downloadImage.href = image;
      downloadImage.style.display = 'inline-block';
    } else {
      downloadImage.style.display = 'none';
    }

    // If neither, show placeholder
    if (!image && !video) {
      mediaWrap.innerHTML = '<div style="color:rgba(255,255,255,0.7);font-size:0.95rem">No media found for this post or post may be private.</div>';
    }
  }

</script>
</body>
</html>`);

  // ---------- helpers for server-side rendering ----------
  function escapeHtml(str){
    if (!str) return '';
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#39;');
  }

  function renderPreviewHtml(fetchedData) {
    if (!fetchedData) {
      return '<div style="color:rgba(255,255,255,0.75);text-align:center;padding:28px">No preview loaded. Paste a public Instagram URL and click Fetch.</div>';
    }
    if (fetchedData.error) {
      return '<div style="color:#ffd6d6;font-weight:700;text-align:center;padding:22px">Error: ' + escapeHtml(fetchedData.error) + '</div>';
    }
    const img = fetchedData.image ? '<img class="media" src="'+escapeHtml(fetchedData.image)+'" alt="image preview">' : '';
    const vid = fetchedData.video ? '<video class="media" controls src="'+escapeHtml(fetchedData.video)+'" preload="metadata"></video>' : '';
    if (!img && !vid) {
      return '<div style="color:rgba(255,255,255,0.75);text-align:center;padding:28px">No media found or post is private.</div>';
    }
    return (vid || img) + '<div style="width:100%;display:flex;justify-content:center;margin-top:10px"><div class="small">Preview loaded — use download buttons</div></div>';
  }
}
