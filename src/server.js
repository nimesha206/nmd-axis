const express = require('express');
const path = require('path');
const fs = require('fs');
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
const packageInfo = require('../package.json');

global.nimaInstance = null;

// ── Menu Card Image Generator & Server ───────────────────────────────────────
const MENU_CARDS_DIR = path.join(__dirname, '../database/menucards');
if (!fs.existsSync(MENU_CARDS_DIR)) fs.mkdirSync(MENU_CARDS_DIR, { recursive: true });

async function generateMenuCards(botInfo = {}) {
    try {
        const sharp = require('sharp');
        const moment = require('moment-timezone');
        const now = moment.tz('Asia/Colombo');
        const timeStr = now.format('HH:mm');
        const dateStr = now.format('DD/MM/YYYY');

        const botName   = botInfo.botName   || '🧬🌐『 𝖭𝖬𝖣 𝖠𝖷𝖨𝖲 』🌐🧬';
        const ownerName = botInfo.ownerName || 'Nimesha Madhushan';
        const botNumber = botInfo.botNumber || '94726800969';
        const ownerNum  = botInfo.ownerNum  || '94726800969';
        const prefix    = botInfo.prefix    || '.';

        const CATS = [
            { id:'bot',      title:'බොට් (BOT)',           siTitle:'🤖 බොට් විධාන',       color:'#cc0000', cmds:['.alive','.bot','.ping','.speed','.runtime','.info','.owner','.vv','.jid','.github','.groupinfo','.staff'] },
            { id:'group',    title:'සමූහ (GROUP)',          siTitle:'👥 සමූහ විධාන',        color:'#9900cc', cmds:['.tagall','.hidetag','.totag','.add','.kick','.promote','.demote','.warn','.setname','.setdesc','.welcome','.goodbye'] },
            { id:'download', title:'බාගැනීම (DOWNLOAD)',    siTitle:'⬇️ බාගත කිරීම',        color:'#0066cc', cmds:['.song','.mp3','.play','.ytmp3','.video','.mp4','.ytmp4'] },
            { id:'ai',       title:'AI (කෘතිම බුද්ධිය)',    siTitle:'🤖 AI විධාන',          color:'#00aa44', cmds:['.gpt','.gemini','.llama3','.ai','.chatai','.imagine','.flux','.sora'] },
            { id:'sticker',  title:'ස්ටිකර් (STICKER)',     siTitle:'🎨 ස්ටිකර් සහ රූප',    color:'#cc6600', cmds:['.sticker','.s','.simage','.attp','.removebg','.blur','.ss','.tts','.trt'] },
            { id:'fun',      title:'විනෝදය (FUN)',           siTitle:'😂 විනෝදාත්මක',         color:'#cc0066', cmds:['.joke','.quote','.fact','.8ball','.compliment','.insult','.hack','.ship','.flirt','.shayari'] },
            { id:'games',    title:'ක්‍රීඩා (GAMES)',         siTitle:'🎮 ක්‍රීඩා විධාන',      color:'#006699', cmds:['.tictactoe','.suit','.chess','.akinator','.slot','.math','.blackjack'] },
            { id:'search',   title:'සෙවුම (SEARCH)',         siTitle:'🔍 සෙවුම් විධාන',       color:'#449900', cmds:['.google','.ytsearch','.define','.weather','.news','.lyrics','.fact'] },
        ];

        function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

        for (const cat of CATS) {
            const W = 420;
            const CMD_H = 28;
            const INFO_H = 152;
            const TITLE_H = 74;
            const half = Math.ceil(cat.cmds.length / 2);
            const CMDS_H = half * CMD_H + 34;
            const FOOT_H = 46;
            const H = TITLE_H + INFO_H + CMDS_H + FOOT_H;

            let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '">';
            svg += '<rect width="' + W + '" height="' + H + '" fill="#060606"/>';
            for(let y=0; y<H; y+=3)
                svg += '<line x1="0" y1="' + y + '" x2="' + W + '" y2="' + y + '" stroke="#ff000005" stroke-width="1"/>';

            svg += '<rect x="0" y="0" width="' + W + '" height="' + TITLE_H + '" fill="' + cat.color + '" opacity="0.18"/>';
            svg += '<rect x="0" y="0" width="' + W + '" height="5" fill="' + cat.color + '"/>';
            const b=12,bs=16;
            [[b,b,1,1],[W-b,b,-1,1],[b,TITLE_H-b,1,-1],[W-b,TITLE_H-b,-1,-1]].forEach(function(p){
                svg += '<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+(p[0]+p[2]*bs)+'" y2="'+p[1]+'" stroke="'+cat.color+'" stroke-width="2"/>';
                svg += '<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+p[0]+'" y2="'+(p[1]+p[3]*bs)+'" stroke="'+cat.color+'" stroke-width="2"/>';
            });
            svg += '<text x="' + (W/2) + '" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" font-weight="700" fill="' + cat.color + '">' + esc(cat.title) + '</text>';
            svg += '<text x="' + (W/2) + '" y="60" text-anchor="middle" font-family="Arial,sans-serif" font-size="13" fill="#ffaaaa">' + esc(cat.siTitle) + '</text>';

            const infoY = TITLE_H;
            svg += '<rect x="0" y="' + infoY + '" width="' + W + '" height="' + INFO_H + '" fill="#0f0000"/>';
            svg += '<line x1="0" y1="' + infoY + '" x2="' + W + '" y2="' + infoY + '" stroke="' + cat.color + '" stroke-width="1"/>';
            const col1=20, col2=W/2+8, lh=24;
            let iy = infoY + 22;

            svg += '<text x="'+col1+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="11" fill="#886666">🤖 බොට් නම</text>';
            svg += '<text x="'+col2+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="11" fill="#886666">👑 හිමිකරු</text>';
            iy += lh-4;
            svg += '<text x="'+col1+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#ff9999">' + esc(botName) + '</text>';
            svg += '<text x="'+col2+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#ff9999">' + esc(ownerName) + '</text>';
            iy += lh;

            svg += '<text x="'+col1+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="11" fill="#886666">📱 බොට් අංකය</text>';
            svg += '<text x="'+col2+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="11" fill="#886666">📱 හිමිකරු අංකය</text>';
            iy += lh-4;
            svg += '<text x="'+col1+'" y="'+iy+'" font-family="Courier New,monospace" font-size="12" fill="#ffaaaa">+' + esc(botNumber) + '</text>';
            svg += '<text x="'+col2+'" y="'+iy+'" font-family="Courier New,monospace" font-size="12" fill="#ffaaaa">+' + esc(ownerNum) + '</text>';
            iy += lh;

            svg += '<text x="'+col1+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="11" fill="#886666">📅 දිනය</text>';
            svg += '<text x="'+col2+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="11" fill="#886666">🕐 වේලාව</text>';
            iy += lh-4;
            svg += '<text x="'+col1+'" y="'+iy+'" font-family="Courier New,monospace" font-size="13" fill="#ffaaaa">' + esc(dateStr) + '</text>';
            svg += '<text x="'+col2+'" y="'+iy+'" font-family="Courier New,monospace" font-size="13" fill="#ffaaaa">' + esc(timeStr) + '</text>';
            iy += lh;

            svg += '<text x="'+col1+'" y="'+iy+'" font-family="Arial,sans-serif" font-size="11" fill="#886666">🔧 Prefix</text>';
            iy += lh-4;
            svg += '<text x="'+col1+'" y="'+iy+'" font-family="Courier New,monospace" font-size="14" font-weight="700" fill="'+cat.color+'">' + esc(prefix) + '</text>';

            const cmdY = infoY + INFO_H;
            svg += '<line x1="0" y1="' + cmdY + '" x2="' + W + '" y2="' + cmdY + '" stroke="' + cat.color + '" stroke-width="1"/>';
            svg += '<text x="' + (W/2) + '" y="' + (cmdY+16) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#884444">▼ විධාන ලැයිස්තුව ▼</text>';

            cat.cmds.forEach(function(cmd, i) {
                const isRight = i >= half;
                const row = isRight ? i - half : i;
                const cx = isRight ? (W/2 + 10) : 16;
                const cy = cmdY + 26 + row * CMD_H;
                svg += '<text x="'+cx+'" y="'+cy+'" font-family="Courier New,monospace" font-size="13" fill="'+cat.color+'">&gt;</text>';
                svg += '<text x="'+(cx+14)+'" y="'+cy+'" font-family="Courier New,monospace" font-size="13" fill="#ffcccc">' + esc(cmd) + '</text>';
            });

            const footY = cmdY + 26 + half * CMD_H + 8;
            svg += '<rect x="0" y="' + footY + '" width="' + W + '" height="' + FOOT_H + '" fill="#0a0000"/>';
            svg += '<line x1="0" y1="' + footY + '" x2="' + W + '" y2="' + footY + '" stroke="' + cat.color + '" stroke-width="1.5"/>';
            svg += '<text x="' + (W/2) + '" y="' + (footY+18) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#663333">🧬🌐『 𝖭𝖬𝖣 𝖠𝖷𝖨𝖲 』🌐🧬 | 👑 Nimesha Madhushan</text>';
            svg += '<text x="' + (W/2) + '" y="' + (footY+34) + '" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" fill="#441111">tap කරල command run කරන්න</text>';
            svg += '<rect x="0" y="' + (footY+FOOT_H-3) + '" width="' + W + '" height="3" fill="' + cat.color + '"/>';
            svg += '</svg>';

            const buf = await sharp(Buffer.from(svg)).jpeg({quality: 93}).toBuffer();
            fs.writeFileSync(path.join(MENU_CARDS_DIR, cat.id + '.jpg'), buf);
        }
        console.log('✅ Menu card images generated!');
    } catch(e) {
        console.log('⚠️ Menu card generation skipped:', e.message);
    }
}
global.generateMenuCards = generateMenuCards;
generateMenuCards();

// Serve menu card images
app.get('/menucard/:id', (req, res) => {
    const imgPath = path.join(MENU_CARDS_DIR, req.params.id + '.jpg');
    if (fs.existsSync(imgPath)) {
        res.setHeader('Content-Type', 'image/jpeg');
        res.sendFile(imgPath);
    } else {
        res.status(404).send('Not found');
    }
});


// ── Web Dashboard ──────────────────────────────────────────────────────────────
app.get('/dashboard', (req, res) => {
	res.send(`<!DOCTYPE html>
<html lang="si">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${packageInfo.name} · Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #05080f;
    --surface:   #0c1120;
    --border:    rgba(255,255,255,0.06);
    --accent:    #00e5a0;
    --accent2:   #0af;
    --accent3:   #f0c040;
    --text:      #e8edf5;
    --muted:     #5a6a82;
    --danger:    #ff4d6d;
    --radius:    14px;
    --glow:      0 0 32px rgba(0,229,160,0.18);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Background mesh ── */
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background:
      radial-gradient(ellipse 60% 50% at 10% 10%, rgba(0,229,160,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 90% 80%, rgba(0,170,255,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 50% 50%, rgba(240,192,64,0.03) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ── Noise grain ── */
  body::after {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    background-size: 200px;
    pointer-events: none;
    opacity: 0.5;
  }

  .wrap { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }

  /* ── Header ── */
  header {
    display: flex; align-items: center; gap: 1.2rem;
    padding: 2.5rem 0 2rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 2.5rem;
    animation: fadeDown 0.6s ease both;
  }

  .logo-ring {
    width: 56px; height: 56px; flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid var(--accent);
    box-shadow: var(--glow), inset 0 0 20px rgba(0,229,160,0.08);
    display: grid; place-items: center;
    font-size: 1.5rem;
    animation: pulse 3s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { box-shadow: var(--glow), inset 0 0 20px rgba(0,229,160,0.08); }
    50%       { box-shadow: 0 0 48px rgba(0,229,160,0.35), inset 0 0 20px rgba(0,229,160,0.14); }
  }

  .header-text h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.4rem, 4vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 60%, var(--accent3) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header-text p { font-size: 0.75rem; color: var(--muted); margin-top: 0.3rem; letter-spacing: 0.05em; }

  .badge {
    margin-left: auto;
    background: rgba(0,229,160,0.1);
    border: 1px solid rgba(0,229,160,0.3);
    color: var(--accent);
    font-size: 0.65rem;
    font-weight: 500;
    padding: 0.3rem 0.8rem;
    border-radius: 999px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    animation: fadeDown 0.6s 0.2s ease both;
  }

  /* ── Status cards row ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.2rem 1.4rem;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.5s ease both;
    transition: border-color 0.3s, transform 0.2s;
  }
  .stat-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
  .stat-card:nth-child(2) { animation-delay: 0.1s; }
  .stat-card:nth-child(3) { animation-delay: 0.2s; }
  .stat-card:nth-child(4) { animation-delay: 0.3s; }

  .stat-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    border-radius: var(--radius) var(--radius) 0 0;
  }
  .stat-card.green::before  { background: linear-gradient(90deg, var(--accent), transparent); }
  .stat-card.blue::before   { background: linear-gradient(90deg, var(--accent2), transparent); }
  .stat-card.yellow::before { background: linear-gradient(90deg, var(--accent3), transparent); }
  .stat-card.red::before    { background: linear-gradient(90deg, var(--danger), transparent); }

  .stat-label { font-size: 0.65rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.5rem; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; }
  .stat-value.green  { color: var(--accent); }
  .stat-value.blue   { color: var(--accent2); }
  .stat-value.yellow { color: var(--accent3); }
  .stat-value.red    { color: var(--danger); }
  .stat-sub { font-size: 0.7rem; color: var(--muted); margin-top: 0.2rem; }

  /* ── Pair section ── */
  .section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2rem;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.5s 0.35s ease both;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1.4rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .section-title::after {
    content: '';
    flex: 1; height: 1px;
    background: var(--border);
  }

  /* ── Pair form ── */
  .pair-row { display: flex; gap: 0.8rem; flex-wrap: wrap; }

  .input-wrap { position: relative; flex: 1; min-width: 200px; }

  .input-prefix {
    position: absolute; left: 1rem; top: 50%; transform: translateY(-50%);
    font-size: 0.8rem; color: var(--accent); user-select: none;
    pointer-events: none;
  }

  input[type="text"] {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.85rem 1rem 0.85rem 3.2rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    color: var(--text);
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  input[type="text"]:focus {
    border-color: rgba(0,229,160,0.5);
    box-shadow: 0 0 0 3px rgba(0,229,160,0.1);
  }
  input[type="text"]::placeholder { color: var(--muted); }

  button {
    background: var(--accent);
    color: #020c07;
    border: none;
    border-radius: 10px;
    padding: 0.85rem 1.8rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: transform 0.15s, box-shadow 0.25s, background 0.2s;
    white-space: nowrap;
  }
  button:hover  { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,229,160,0.3); }
  button:active { transform: translateY(0); }
  button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* ── Result box ── */
  .result-box {
    margin-top: 1.2rem;
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.2rem 1.4rem;
    font-size: 0.82rem;
    line-height: 1.6;
    display: none;
    animation: fadeUp 0.3s ease both;
  }
  .result-box.show { display: block; }
  .result-box.success { border-color: rgba(0,229,160,0.35); }
  .result-box.error   { border-color: rgba(255,77,109,0.35); }

  .code-chip {
    display: inline-block;
    background: rgba(0,229,160,0.12);
    border: 1px solid rgba(0,229,160,0.4);
    color: var(--accent);
    font-family: 'DM Mono', monospace;
    font-size: 1.4rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    margin: 0.6rem 0;
    user-select: all;
  }

  /* ── Endpoints list ── */
  .endpoint-list { display: flex; flex-direction: column; gap: 0.6rem; }

  .endpoint-row {
    display: flex; align-items: center; gap: 0.8rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
    transition: background 0.2s, border-color 0.2s;
  }
  .endpoint-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }

  .method {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.2rem 0.55rem;
    border-radius: 5px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }
  .method.get  { background: rgba(0,229,160,0.15); color: var(--accent); }
  .method.post { background: rgba(0,170,255,0.15); color: var(--accent2); }
  .method.all  { background: rgba(240,192,64,0.15); color: var(--accent3); }

  .ep-path { color: var(--text); font-family: 'DM Mono', monospace; flex: 1; }
  .ep-desc { color: var(--muted); font-size: 0.72rem; text-align: right; }

  /* ── Instructions ── */
  .steps { counter-reset: step; display: flex; flex-direction: column; gap: 0.8rem; }

  .step {
    display: flex; gap: 1rem; align-items: flex-start;
    font-size: 0.82rem; color: var(--muted); line-height: 1.5;
  }
  .step-num {
    counter-increment: step;
    flex-shrink: 0;
    width: 24px; height: 24px;
    border-radius: 50%;
    background: rgba(0,229,160,0.1);
    border: 1px solid rgba(0,229,160,0.3);
    display: grid; place-items: center;
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--accent);
  }

  /* ── Footer ── */
  footer {
    text-align: center;
    font-size: 0.7rem;
    color: var(--muted);
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    letter-spacing: 0.05em;
    animation: fadeUp 0.5s 0.5s ease both;
  }
  footer span { color: var(--accent); }

  /* ── Animations ── */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Spinner ── */
  .spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(2,12,7,0.3);
    border-top-color: #020c07;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle; margin-right: 6px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Live dot ── */
  .live-dot {
    display: inline-block; width: 8px; height: 8px;
    border-radius: 50%; background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: blink 1.4s ease-in-out infinite;
    margin-right: 6px;
    vertical-align: middle;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }

  @media (max-width: 560px) {
    .pair-row { flex-direction: column; }
    .ep-desc  { display: none; }
    .badge    { display: none; }
  }
</style>
</head>
<body>
<div class="wrap">

  <!-- Header -->
  <header>
    <div class="logo-ring">🤖</div>
    <div class="header-text">
      <h1>${packageInfo.name}</h1>
      <p>v${packageInfo.version} · by ${packageInfo.author}</p>
    </div>
    <div class="badge"><span class="live-dot"></span>Online</div>
  </header>

  <!-- Stats row -->
  <div class="stats-row" id="statsRow">
    <div class="stat-card green">
      <div class="stat-label">Bot Name</div>
      <div class="stat-value green" style="font-size:1rem">${packageInfo.name}</div>
      <div class="stat-sub">WhatsApp Bot</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-label">Version</div>
      <div class="stat-value blue">${packageInfo.version}</div>
      <div class="stat-sub">Current Build</div>
    </div>
    <div class="stat-card yellow">
      <div class="stat-label">Uptime</div>
      <div class="stat-value yellow" id="uptimeVal">—</div>
      <div class="stat-sub">Live from server</div>
    </div>
    <div class="stat-card green">
      <div class="stat-label">Status</div>
      <div class="stat-value green">Active</div>
      <div class="stat-sub">Running</div>
    </div>
  </div>

  <!-- Pair Code -->
  <div class="section">
    <div class="section-title">📱 WhatsApp Pair</div>

    <div class="steps" style="margin-bottom:1.4rem">
      <div class="step"><div class="step-num">1</div><div>WhatsApp → Linked Devices → Link with phone number තෝරන්න</div></div>
      <div class="step"><div class="step-num">2</div><div>පහතින් ඔබේ දුරකථන අංකය ඇතුළු කරන්න (country code සහිතව)</div></div>
      <div class="step"><div class="step-num">3</div><div>ලැබෙන Pair Code WhatsApp හි ඇතුළු කරන්න (60 sec ඇතුළත)</div></div>
    </div>

    <div class="pair-row">
      <div class="input-wrap">
        <span class="input-prefix">📞</span>
        <input type="text" id="phoneInput" placeholder="947XXXXXXXX" maxlength="15"/>
      </div>
      <button id="pairBtn" onclick="getPairCode()">Get Pair Code</button>
    </div>

    <div class="result-box" id="resultBox"></div>
  </div>

  <!-- Endpoints -->
  <div class="section" style="animation-delay:0.45s">
    <div class="section-title">🔌 API Endpoints</div>
    <div class="endpoint-list">
      <div class="endpoint-row">
        <span class="method all">ALL</span>
        <span class="ep-path">/</span>
        <span class="ep-desc">Bot info &amp; uptime</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="ep-path">/pair?number=94700000000</span>
        <span class="ep-desc">Get pairing code</span>
      </div>
      <div class="endpoint-row">
        <span class="method all">ALL</span>
        <span class="ep-path">/process?send=restart</span>
        <span class="ep-desc">Send process signal</span>
      </div>
      <div class="endpoint-row">
        <span class="method all">ALL</span>
        <span class="ep-path">/chat?message=hi&amp;to=94700000000</span>
        <span class="ep-desc">Send message (WIP)</span>
      </div>
      <div class="endpoint-row">
        <span class="method get">GET</span>
        <span class="ep-path">/dashboard</span>
        <span class="ep-desc">This dashboard</span>
      </div>
    </div>
  </div>

  <footer>
    Built with ❤️ by <span>${packageInfo.author}</span> · ${packageInfo.name} ${packageInfo.version}
  </footer>
</div>

<script>
  // Fetch uptime on load
  async function fetchStatus() {
    try {
      const r = await fetch('/');
      const d = await r.json();
      if (d.uptime) {
        document.getElementById('uptimeVal').textContent = d.uptime;
      }
    } catch {}
  }
  fetchStatus();
  setInterval(fetchStatus, 10000);

  // Pair code
  async function getPairCode() {
    const btn   = document.getElementById('pairBtn');
    const input = document.getElementById('phoneInput');
    const box   = document.getElementById('resultBox');
    const num   = input.value.trim().replace(/[^0-9]/g, '');

    if (!num || num.length < 7) {
      showResult('error', '⚠️ වලංගු දුරකථන අංකයක් ඇතුළු කරන්න.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>ලබා ගැනීම...';
    box.className = 'result-box'; box.style.display = 'none';

    try {
      const r = await fetch('/pair?number=' + num);
      const d = await r.json();
      if (d.status) {
        showResult('success',
          '<div style="color:var(--accent);font-family:Syne,sans-serif;font-size:0.9rem;font-weight:700;margin-bottom:0.5rem">✅ Pair Code ලැබුණා!</div>' +
          '<div class="code-chip">' + d.code + '</div>' +
          '<div style="color:var(--muted);font-size:0.75rem;margin-top:0.5rem">⏱ expires: ' + (d.expires || '60 seconds') + '</div>'
        );
      } else {
        showResult('error', '❌ ' + (d.message || 'Pair code ගැනීමට අසමත් විය.'));
      }
    } catch (e) {
      showResult('error', '❌ සේවාදායකයට සම්බන්ධ නොවිය හැකි විය.');
    }

    btn.disabled = false;
    btn.innerHTML = 'Get Pair Code';
  }

  function showResult(type, html) {
    const box = document.getElementById('resultBox');
    box.className = 'result-box show ' + type;
    box.innerHTML = html;
    box.style.display = 'block';
  }

  // Enter key
  document.getElementById('phoneInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') getPairCode();
  });
</script>
</body>
</html>`);
});

// ── API Routes ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
	res.setHeader('Content-Type','text/html');
	res.send(`<!DOCTYPE html>
<html lang="si">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>NMD AXIS · Connect Panel</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#000;--s1:#0a0a0a;--s2:#111;
  --g:#00ff88;--b:#00c4ff;--p:#bf5fff;--r:#ff3c6e;--y:#ffe000;
  --text:#d0ffe8;--muted:#3a6650;
}
html,body{width:100%;height:100%;overflow-x:hidden;}
body{background:var(--bg);color:var(--text);font-family:'Share Tech Mono',monospace;min-height:100vh;}

/* ── Snow canvas ── */
#snow{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;}

/* ── Animated color lines ── */
.line-wrap{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden;}
.cline{position:absolute;left:0;width:100%;height:1px;opacity:0;animation:lineFall 6s linear infinite;}
.cline:nth-child(1){top:15%;background:linear-gradient(90deg,transparent,var(--g),transparent);animation-delay:0s;animation-duration:5s;}
.cline:nth-child(2){top:32%;background:linear-gradient(90deg,transparent,var(--b),transparent);animation-delay:1.5s;animation-duration:7s;}
.cline:nth-child(3){top:55%;background:linear-gradient(90deg,transparent,var(--p),transparent);animation-delay:3s;animation-duration:6s;}
.cline:nth-child(4){top:72%;background:linear-gradient(90deg,transparent,var(--r),transparent);animation-delay:4.5s;animation-duration:8s;}
.cline:nth-child(5){top:88%;background:linear-gradient(90deg,transparent,var(--y),transparent);animation-delay:2s;animation-duration:5.5s;}
@keyframes lineFall{0%{opacity:0;transform:scaleX(0)}20%{opacity:0.6}50%{opacity:0.3}100%{opacity:0;transform:scaleX(1.2)}}

/* ── Scan lines overlay ── */
body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,136,0.015) 2px,rgba(0,255,136,0.015) 4px);pointer-events:none;z-index:2;}

/* ── Main wrap ── */
.wrap{position:relative;z-index:10;max-width:480px;margin:0 auto;padding:1.5rem 1rem 4rem;}

/* ── Header ── */
.hdr{text-align:center;padding:2rem 0 1.5rem;animation:fadeD .8s ease both;}
.logo-ring{width:80px;height:80px;border-radius:50%;border:2px solid var(--g);display:inline-flex;align-items:center;justify-content:center;font-size:2rem;box-shadow:0 0 30px rgba(0,255,136,.3),0 0 60px rgba(0,255,136,.1);animation:pulse 3s ease-in-out infinite;margin-bottom:1rem;}
@keyframes pulse{0%,100%{box-shadow:0 0 30px rgba(0,255,136,.3)}50%{box-shadow:0 0 60px rgba(0,255,136,.6),0 0 120px rgba(0,255,136,.2)}}
.logo-title{font-family:'Orbitron',sans-serif;font-size:1.6rem;font-weight:900;letter-spacing:.2em;background:linear-gradient(135deg,var(--g),var(--b),var(--p));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.logo-sub{font-size:.65rem;letter-spacing:.3em;color:var(--muted);margin-top:.4rem;}
.live-badge{display:inline-flex;align-items:center;gap:.4rem;background:rgba(0,255,136,.08);border:1px solid rgba(0,255,136,.25);border-radius:999px;padding:.25rem .8rem;font-size:.6rem;letter-spacing:.15em;color:var(--g);margin-top:.6rem;}
.live-dot{width:6px;height:6px;border-radius:50%;background:var(--g);box-shadow:0 0 6px var(--g);animation:blink 1.2s ease-in-out infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}

/* ── Status bar ── */
.status-bar{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1rem;animation:fadeU .6s .2s ease both;}
.stat{background:var(--s1);border:1px solid #1a1a1a;border-radius:10px;padding:.8rem;text-align:center;}
.stat-label{font-size:.55rem;letter-spacing:.15em;color:var(--muted);margin-bottom:.3rem;}
.stat-val{font-family:'Orbitron',sans-serif;font-size:.9rem;font-weight:700;}
.stat-val.g{color:var(--g);} .stat-val.b{color:var(--b);} .stat-val.p{color:var(--p);}

/* ── Card ── */
.card{background:var(--s1);border:1px solid #1c1c1c;border-radius:16px;overflow:hidden;margin-bottom:1rem;animation:fadeU .6s ease both;}
.card:nth-child(2){animation-delay:.1s;} .card:nth-child(3){animation-delay:.2s;} .card:nth-child(4){animation-delay:.3s;}
.card-top{height:3px;background:linear-gradient(90deg,var(--g),var(--b));}
.card-top.p{background:linear-gradient(90deg,var(--p),var(--r));}
.card-top.y{background:linear-gradient(90deg,var(--y),var(--g));}
.card-body{padding:1.4rem;}
.card-title{font-size:.6rem;letter-spacing:.2em;color:var(--muted);margin-bottom:1.2rem;display:flex;align-items:center;gap:.6rem;}
.card-title::after{content:'';flex:1;height:1px;background:#1c1c1c;}

/* ── Tabs ── */
.tabs{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #1c1c1c;}
.tab{padding:.75rem;text-align:center;font-family:'Orbitron',sans-serif;font-size:.6rem;letter-spacing:.12em;cursor:pointer;color:var(--muted);border:none;background:none;transition:all .2s;position:relative;}
.tab.active{color:var(--g);}
.tab.active::after{content:'';position:absolute;bottom:0;left:15%;right:15%;height:2px;background:var(--g);box-shadow:0 0 8px var(--g);border-radius:2px;}

/* ── Input ── */
.inp-wrap{position:relative;margin-bottom:.8rem;}
.inp-icon{position:absolute;left:.9rem;top:50%;transform:translateY(-50%);font-size:.9rem;color:var(--muted);pointer-events:none;}
input[type=tel],input[type=text]{width:100%;background:#0a0a0a;border:1px solid #1c1c1c;color:var(--text);padding:.8rem 1rem .8rem 2.8rem;border-radius:8px;font-family:'Share Tech Mono',monospace;font-size:.9rem;outline:none;transition:border .2s,box-shadow .2s;}
input:focus{border-color:var(--g);box-shadow:0 0 0 2px rgba(0,255,136,.15);}
input::placeholder{color:var(--muted);}

/* ── Buttons ── */
.btn{width:100%;padding:.85rem;border:none;border-radius:8px;font-family:'Orbitron',sans-serif;font-size:.7rem;font-weight:700;letter-spacing:.15em;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
.btn-g{background:linear-gradient(135deg,#00ff88,#00c4ff);color:#000;}
.btn-g:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,255,136,.3);}
.btn-b{background:linear-gradient(135deg,var(--b),var(--p));color:#000;margin-top:.5rem;}
.btn-b:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,196,255,.3);}
.btn:disabled{opacity:.35;cursor:not-allowed;transform:none!important;}

/* ── Status msg ── */
.status-msg{text-align:center;font-size:.75rem;min-height:1rem;margin:.6rem 0;color:var(--muted);}
.status-msg.ok{color:var(--g);} .status-msg.err{color:var(--r);}

/* ── Code chip ── */
.code-box{display:none;margin-top:1rem;background:#0a0a0a;border:1px dashed rgba(0,255,136,.3);border-radius:12px;padding:1.2rem;text-align:center;animation:fadeU .4s ease both;}
.code-lbl{font-size:.55rem;letter-spacing:.2em;color:var(--muted);margin-bottom:.5rem;}
.code-val{font-family:'Orbitron',sans-serif;font-size:1.8rem;font-weight:900;color:var(--g);letter-spacing:.3em;text-shadow:0 0 20px rgba(0,255,136,.5);}
.code-steps{margin-top:.8rem;font-size:.7rem;color:var(--muted);line-height:1.8;text-align:left;}
.code-steps b{color:var(--g);}

/* ── QR box ── */
.qr-box{display:none;text-align:center;padding:1rem 0;}
.qr-box img{border-radius:12px;max-width:220px;border:2px solid var(--g);}
.qr-note{font-size:.65rem;color:var(--muted);margin-top:.6rem;}

/* ── Connected box ── */
.conn-box{display:none;text-align:center;padding:.5rem 0;animation:fadeU .4s ease both;}
.conn-tick{font-size:2.5rem;}
.conn-title{font-family:'Orbitron',sans-serif;font-size:.85rem;color:var(--g);margin:.4rem 0 .2rem;}
.conn-num{font-size:.75rem;color:var(--muted);}

/* ── Toggle settings ── */
.toggle-list{display:flex;flex-direction:column;gap:.5rem;}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:.6rem .8rem;background:#0a0a0a;border:1px solid #1c1c1c;border-radius:8px;transition:border-color .2s;}
.toggle-row:hover{border-color:#2a2a2a;}
.toggle-label{font-size:.72rem;letter-spacing:.05em;}
.toggle-sub{font-size:.55rem;color:var(--muted);margin-top:.1rem;}
.toggle-sw{position:relative;width:38px;height:20px;flex-shrink:0;}
.toggle-sw input{opacity:0;width:0;height:0;}
.slider{position:absolute;inset:0;background:#1c1c1c;border-radius:10px;cursor:pointer;transition:.3s;}
.slider:before{content:'';position:absolute;width:14px;height:14px;left:3px;bottom:3px;background:#555;border-radius:50%;transition:.3s;}
input:checked+.slider{background:rgba(0,255,136,.25);border:1px solid var(--g);}
input:checked+.slider:before{transform:translateX(18px);background:var(--g);box-shadow:0 0 6px var(--g);}

/* ── Contact ── */
.contact-list{display:flex;flex-direction:column;gap:.5rem;}
.contact-row{display:flex;align-items:center;gap:.8rem;padding:.7rem .9rem;background:#0a0a0a;border:1px solid #1c1c1c;border-radius:8px;text-decoration:none;color:var(--text);transition:all .2s;}
.contact-row:hover{border-color:var(--g);background:rgba(0,255,136,.04);}
.contact-icon{font-size:1.2rem;width:28px;text-align:center;}
.contact-info{}
.contact-name{font-size:.75rem;}
.contact-val{font-size:.6rem;color:var(--muted);}

/* ── Footer ── */
.footer{text-align:center;font-size:.6rem;color:var(--muted);margin-top:1.5rem;letter-spacing:.1em;}
.footer span{color:var(--g);}

/* ── Spinner ── */
.spin{display:inline-block;width:12px;height:12px;border:2px solid rgba(0,0,0,.3);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:5px;}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── Anims ── */
@keyframes fadeD{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeU{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<canvas id="snow"></canvas>
<div class="line-wrap">
  <div class="cline"></div><div class="cline"></div><div class="cline"></div>
  <div class="cline"></div><div class="cline"></div>
</div>

<div class="wrap">

  <!-- Header -->
  <div class="hdr">
    <div class="logo-ring">⚡</div>
    <div class="logo-title">NMD · AXIS</div>
    <div class="logo-sub">WHATSAPP BOT · CONNECT PANEL · V3.0</div>
    <div class="live-badge"><span class="live-dot"></span>ONLINE</div>
  </div>

  <!-- Status bar -->
  <div class="status-bar">
    <div class="stat"><div class="stat-label">BOT</div><div class="stat-val g" id="stBot">—</div></div>
    <div class="stat"><div class="stat-label">UPTIME</div><div class="stat-val b" id="stUp">—</div></div>
    <div class="stat"><div class="stat-label">VERSION</div><div class="stat-val p" id="stVer">—</div></div>
  </div>

  <!-- Connect card -->
  <div class="card">
    <div class="card-top"></div>
    <div class="tabs">
      <button class="tab active" id="tabPair" onclick="switchTab('pair')">🔑 PAIR CODE</button>
      <button class="tab" id="tabQR" onclick="switchTab('qr')">📱 QR CODE</button>
    </div>
    <div class="card-body">

      <!-- Pair panel -->
      <div id="panelPair">
        <div class="inp-wrap">
          <span class="inp-icon">📞</span>
          <input type="tel" id="numInput" placeholder="94771234567" inputmode="numeric" maxlength="15"/>
        </div>
        <button class="btn btn-g" id="pairBtn" onclick="getPairCode()">⚡ GENERATE PAIR CODE</button>
        <div class="status-msg" id="pairMsg"></div>
        <div class="code-box" id="codeBox">
          <div class="code-lbl">YOUR PAIR CODE</div>
          <div class="code-val" id="codeVal">——</div>
          <div class="code-steps">
            <b>1.</b> WhatsApp විවෘත කරන්න<br>
            <b>2.</b> ⋮ › Linked Devices › Link a Device<br>
            <b>3.</b> "Link with phone number" select<br>
            <b>4.</b> Code ඇතුළත් කරන්න
          </div>
        </div>
        <div class="conn-box" id="connBox">
          <div class="conn-tick">✅</div>
          <div class="conn-title">CONNECTED!</div>
          <div class="conn-num" id="connNum"></div>
        </div>
      </div>

      <!-- QR panel -->
      <div id="panelQR" style="display:none">
        <button class="btn btn-b" onclick="getQR()">📱 GENERATE QR CODE</button>
        <div class="status-msg" id="qrMsg"></div>
        <div class="qr-box" id="qrBox">
          <img id="qrImg" src="" alt="QR Code"/>
          <div class="qr-note">WhatsApp → Linked Devices → Link a Device → Scan</div>
        </div>
      </div>

    </div>
  </div>

  <!-- Settings card -->
  <div class="card">
    <div class="card-top p"></div>
    <div class="card-body">
      <div class="card-title">⚙️ BOT SETTINGS</div>
      <div class="toggle-list" id="toggleList">
        <div style="text-align:center;color:var(--muted);font-size:.7rem;padding:.5rem;">Bot connect කළාට පස්සේ settings load වෙනවා...</div>
      </div>
    </div>
  </div>

  <!-- Contact card -->
  <div class="card">
    <div class="card-top y"></div>
    <div class="card-body">
      <div class="card-title">📬 CONTACT</div>
      <div class="contact-list">
        <a class="contact-row" href="https://wa.me/94784134577" target="_blank">
          <span class="contact-icon">💬</span>
          <div class="contact-info"><div class="contact-name">WhatsApp</div><div class="contact-val">+94 784 134 577</div></div>
        </a>
        <a class="contact-row" href="https://github.com/nima-axis" target="_blank">
          <span class="contact-icon">🐙</span>
          <div class="contact-info"><div class="contact-name">GitHub</div><div class="contact-val">github.com/nima-axis</div></div>
        </a>
        <a class="contact-row" href="https://www.youtube.com/@nmdaxis" target="_blank">
          <span class="contact-icon">▶️</span>
          <div class="contact-info"><div class="contact-name">YouTube</div><div class="contact-val">@nmdaxis</div></div>
        </a>
        <a class="contact-row" href="https://www.tiktok.com/@nmd.axis" target="_blank">
          <span class="contact-icon">🎵</span>
          <div class="contact-info"><div class="contact-name">TikTok</div><div class="contact-val">@nmd.axis</div></div>
        </a>
        <a class="contact-row" href="https://whatsapp.com/channel/0029Vb68g1c3LdQLQDkbAQ3M" target="_blank">
          <span class="contact-icon">📢</span>
          <div class="contact-info"><div class="contact-name">WhatsApp Channel</div><div class="contact-val">NMD AXIS Updates</div></div>
        </a>
      </div>
    </div>
  </div>

  <div class="footer">⚡ NMD AXIS V3.0 · By <span>Nimesha Madhushan</span></div>
</div>

<script>
// ── Snow ───────────────────────────────────────────────────────────────
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');
let W, H, flakes = [];
function resizeSnow() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resizeSnow();
window.addEventListener('resize', resizeSnow);
const COLORS = ['#00ff88','#00c4ff','#bf5fff','#ff3c6e','#ffe000','#ffffff'];
for (let i = 0; i < 120; i++) {
  flakes.push({ x: Math.random()*1000, y: Math.random()*1000, r: Math.random()*2.5+.5,
    speed: Math.random()*.8+.2, drift: Math.random()*.4-.2,
    color: COLORS[Math.floor(Math.random()*COLORS.length)], opacity: Math.random()*.7+.3 });
}
(function animSnow() {
  ctx.clearRect(0,0,W,H);
  flakes.forEach(f => {
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
    ctx.fillStyle = f.color; ctx.globalAlpha = f.opacity; ctx.fill(); ctx.globalAlpha = 1;
    f.y += f.speed; f.x += f.drift;
    if (f.y > H) { f.y = -5; f.x = Math.random()*W; }
    if (f.x > W) f.x = 0; if (f.x < 0) f.x = W;
  });
  requestAnimationFrame(animSnow);
})();

// ── Tabs ──────────────────────────────────────────────────────────────
function switchTab(t) {
  document.getElementById('tabPair').classList.toggle('active', t==='pair');
  document.getElementById('tabQR').classList.toggle('active', t==='qr');
  document.getElementById('panelPair').style.display = t==='pair'?'block':'none';
  document.getElementById('panelQR').style.display = t==='qr'?'block':'none';
}

// ── Status ─────────────────────────────────────────────────────────────
async function fetchStatus() {
  try {
    const r = await fetch('/api/status'); const d = await r.json();
    document.getElementById('stBot').textContent = d.connected ? 'ONLINE' : 'OFFLINE';
    document.getElementById('stBot').style.color = d.connected ? 'var(--g)' : 'var(--r)';
    document.getElementById('stUp').textContent = d.uptime || '—';
    document.getElementById('stVer').textContent = 'v' + (d.version||'2.0');
    if (d.connected) loadSettings();
  } catch {}
}
fetchStatus(); setInterval(fetchStatus, 8000);

// ── Pair Code ─────────────────────────────────────────────────────────
let pollTimer = null;
async function getPairCode() {
  const num = document.getElementById('numInput').value.trim().replace(/\D/g,'');
  if (num.length < 7) { setMsg('pairMsg', 'Country code සමඟ number ඇතුළත් කරන්න.', 'err'); return; }
  const btn = document.getElementById('pairBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spin"></span>GENERATING...';
  setMsg('pairMsg', 'Pair code ජනනය කරමින්...', 'ok');
  document.getElementById('codeBox').style.display = 'none';
  document.getElementById('connBox').style.display = 'none';
  try {
    const r = await fetch('/api/pair?number='+num); const d = await r.json();
    if (d.alreadyConnected) { showConnected(num); }
    else if (d.status && d.code) {
      document.getElementById('codeVal').textContent = d.code;
      document.getElementById('codeBox').style.display = 'block';
      setMsg('pairMsg', '✓ Code ලැබුණා — 60s ඇතුළත WhatsApp හි enter කරන්න', 'ok');
      startPoll(num);
    } else { setMsg('pairMsg', '❌ ' + (d.message||'Error. නැවත try කරන්න.'), 'err'); }
  } catch { setMsg('pairMsg', '❌ Server error. නැවත try කරන්න.', 'err'); }
  btn.disabled = false; btn.innerHTML = '⚡ GENERATE PAIR CODE';
}

// ── QR Code ─────────────────────────────────────────────────────────
async function getQR() {
  setMsg('qrMsg', 'QR Code ජනනය කරමින්...', 'ok');
  document.getElementById('qrBox').style.display = 'none';
  try {
    const r = await fetch('/qr');
    if (r.ok && r.headers.get('content-type')?.includes('image')) {
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      document.getElementById('qrImg').src = url;
      document.getElementById('qrBox').style.display = 'block';
      setMsg('qrMsg', '✓ QR Code scan කරන්න (20s ඇතුළත)', 'ok');
    } else {
      // Try via API
      const d = await r.json().catch(()=>null);
      setMsg('qrMsg', '❌ QR Code ලැබෙන්නෙ නෑ — Pair Code tab use කරන්න', 'err');
    }
  } catch { setMsg('qrMsg', '❌ QR ජනනය අසාර්ථකයි', 'err'); }
}

function showConnected(num) {
  document.getElementById('codeBox').style.display = 'none';
  document.getElementById('connBox').style.display = 'block';
  document.getElementById('connNum').textContent = '+' + num + ' · Active ✓';
  setMsg('pairMsg','','');
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  loadSettings();
}
function startPoll(num) {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    try { const r = await fetch('/api/session?number='+num); const d = await r.json(); if (d.connected) showConnected(num); } catch {}
  }, 4000);
  setTimeout(()=>{ if(pollTimer){clearInterval(pollTimer);pollTimer=null;} }, 120000);
}
function setMsg(id, msg, type) {
  const el = document.getElementById(id); el.textContent = msg;
  el.className = 'status-msg' + (type?' '+type:'');
}

// ── Settings ──────────────────────────────────────────────────────────
const SETTINGS_META = [
  {key:'mode',       label:'Bot Mode',        sub:'Public / Self'},
  {key:'anticall',   label:'Anti Call',        sub:'Incoming calls block'},
  {key:'antidelete', label:'Anti Delete',      sub:'Deleted msg recover'},
  {key:'autostatus', label:'Auto Status View', sub:'Status auto view'},
  {key:'autostatusreact',label:'Status React', sub:'Status auto react'},
  {key:'autorecording',label:'Auto Recording', sub:'Recording indicator'},
  {key:'autobio',    label:'Auto Bio',         sub:'Bio auto update'},
  {key:'autoread',   label:'Auto Read',        sub:'Messages auto read'},
  {key:'autotyping', label:'Auto Typing',      sub:'Typing indicator'},
  {key:'readsw',     label:'Read Status',      sub:'Own status auto read'},
  {key:'antilink',   label:'Anti Link',        sub:'Group link filter'},
  {key:'antispam',   label:'Anti Spam',        sub:'Spam protection'},
  {key:'welcome',    label:'Welcome Msg',      sub:'New member welcome'},
  {key:'leave',      label:'Leave Msg',        sub:'Member leave message'},
  {key:'nsfw',       label:'NSFW Filter',      sub:'Adult content filter'},
  {key:'grouponly',  label:'Group Only',       sub:'Group commands only'},
  {key:'privateonly',label:'Private Only',     sub:'Private commands only'},
];

async function loadSettings() {
  try {
    const r = await fetch('/api/settings'); const d = await r.json();
    if (!d.status) return;
    const list = document.getElementById('toggleList');
    list.innerHTML = '';
    SETTINGS_META.forEach(s => {
      let val = s.key==='mode' ? d.settings.mode==='public' : !!d.settings[s.key];
      list.innerHTML += \`
        <div class="toggle-row">
          <div><div class="toggle-label">\${s.label}</div><div class="toggle-sub">\${s.sub}</div></div>
          <label class="toggle-sw">
            <input type="checkbox" \${val?'checked':''} onchange="toggleSetting('\${s.key}',this.checked)"/>
            <span class="slider"></span>
          </label>
        </div>\`;
    });
  } catch {}
}

async function toggleSetting(feature, value) {
  try {
    await fetch('/api/toggle', { method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ feature, value: feature==='mode'?(value?'public':'self'):value })
    });
  } catch {}
}

// ── Enter key ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('numInput');
  if (inp) inp.addEventListener('keydown', e => { if(e.key==='Enter') getPairCode(); });
});
</script>
</body>
</html>
`);
});


app.all('/process', (req, res) => {
	const { send } = req.query;
	if (!send) return res.status(400).json({ error: 'යොමු කිරීමට අවශ්‍ය විමසුම (query) ඇතුළත් කර නැත' });
	if (process.send) {
		process.send(send)
		res.json({ status: 'යවන ලදී (Sent)', data: send });
	} else res.json({ error: 'ක්‍රියාවලිය (Process) IPC සමඟ ධාවනය නොවේ' });
});

app.all('/chat', (req, res) => {
	const { message, to } = req.query;
	if (!message || !to) return res.status(400).json({ error: 'පණිවිඩය හෝ යොමු කළ යුතු ලිපිනය ඇතුළත් කර නැත' });
	res.json({ status: 200, mess: 'තවමත් ආරම්භ වී නොමැත' })
});

app.get('/pair', async (req, res) => {
	const { number } = req.query;
	if (!number) return res.status(400).json({ status: false, message: 'අංකය (number) ඇතුළත් කර නැත. උදා: /pair?number=947xxxxxxxx' });

	const nima = global.nimaInstance;
	if (!nima) return res.status(503).json({ status: false, message: 'Bot තවම සූදානම් නැත. ටිකක් රැඳෙන්න.' });

	if (nima.authState?.creds?.registered) {
		return res.status(400).json({ status: false, message: 'Bot දැනටමත් registered. Pair code අවශ්‍ය නැත.' });
	}

	try {
		const cleanNumber = number.replace(/[^0-9]/g, '');
		const code = await nima.requestPairingCode(cleanNumber);
		const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
		return res.json({
			status: true,
			message: 'Pair code ලැබුණා! WhatsApp > Linked Devices > Link with phone number හි ඇතුළත් කරන්න.',
			number: cleanNumber,
			code: formatted,
			expires: '60 seconds'
		});
	} catch (e) {
		return res.status(500).json({ status: false, message: 'Pair code ගැනීමට අසමත් විය.', error: e.message });
	}
});

// ══════════════════════════════════════════════════════════════════════════════
// 🌐 NMD-AXIS WEB PANEL API — Netlify Panel Integration
// ══════════════════════════════════════════════════════════════════════════════

// CORS middleware — Netlify panel access සඳහා
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-panel-key');
	if (req.method === 'OPTIONS') return res.sendStatus(200);
	next();
});

// Panel auth disabled — open access
const panelAuth = (req, res, next) => next();

// ── Bot Status ────────────────────────────────────────────────────────────────
app.get('/api/status', panelAuth, (req, res) => {
	const nima = global.nimaInstance;
	const connected = !!(nima && nima.authState?.creds?.registered);
	const botNumber = connected ? nima.decodeJid(nima.user.id).replace('@s.whatsapp.net', '') : null;
	const botName = connected ? (nima.user?.name || global.botname || 'NMD AXIS') : null;

	const uptime = process.uptime();
	const h = Math.floor(uptime / 3600);
	const m = Math.floor((uptime % 3600) / 60);
	const s = Math.floor(uptime % 60);

	// Bot settings read
	let settings = {};
	if (connected && global.db?.set?.[nima.decodeJid(nima.user.id)]) {
		const set = global.db.set[nima.decodeJid(nima.user.id)];
		settings = {
			mode: set.public ? 'public' : 'self',
			anticall: !!set.anticall,
			antidelete: !!set.antidelete,
			autostatus: !!set.autostatus,
			autostatusreact: !!set.autostatusreact,
			autorecording: !!set.autorecording,
			autobio: !!set.autobio,
			autoread: !!set.autoread,
			autotyping: !!set.autotyping,
			readsw: !!set.readsw,
			multiprefix: !!set.multiprefix,
			antispam: !!set.antispam,
			antilink: !!set.antilink,
			antivirtex: !!set.antivirtex,
			antihidetag: !!set.antihidetag,
			antitagsw: !!set.antitagsw,
			welcome: !!set.welcome,
			leave: !!set.leave,
			promote: !!set.promote,
			demote: !!set.demote,
			nsfw: !!set.nsfw,
			grouponly: !!set.grouponly,
			privateonly: !!set.privateonly,
			didyoumean: !!set.didyoumean,
			autobackup: !!set.autobackup,
		};
	}

	res.json({
		status: true,
		connected,
		botNumber,
		botName,
		ownerName: global.ownerName || global.author || 'Nimesha Madhushan',
		uptime: `${h}h ${m}m ${s}s`,
		uptimeSeconds: Math.floor(uptime),
		version: (() => { try { return require('../package.json').version; } catch { return '2.0.0'; } })(),
		settings,
		readyForPair: !connected,
	});
});

// ── Get All Settings ──────────────────────────────────────────────────────────
app.get('/api/settings', panelAuth, (req, res) => {
	const nima = global.nimaInstance;
	if (!nima || !nima.authState?.creds?.registered) {
		return res.status(503).json({ status: false, message: 'Bot connect වී නොමැත.' });
	}
	const botJid = nima.decodeJid(nima.user.id);
	const set = global.db?.set?.[botJid] || {};

	res.json({
		status: true,
		botNumber: botJid.replace('@s.whatsapp.net', ''),
		settings: {
			mode: set.public ? 'public' : 'self',
			anticall: !!set.anticall,
			antidelete: !!set.antidelete,
			autostatus: !!set.autostatus,
			autostatusreact: !!set.autostatusreact,
			autorecording: !!set.autorecording,
			autobio: !!set.autobio,
			autoread: !!set.autoread,
			autotyping: !!set.autotyping,
			readsw: !!set.readsw,
			multiprefix: !!set.multiprefix,
			antispam: !!set.antispam,
			antilink: !!set.antilink,
			antivirtex: !!set.antivirtex,
			antihidetag: !!set.antihidetag,
			antitagsw: !!set.antitagsw,
			welcome: !!set.welcome,
			leave: !!set.leave,
			promote: !!set.promote,
			demote: !!set.demote,
			nsfw: !!set.nsfw,
			grouponly: !!set.grouponly,
			privateonly: !!set.privateonly,
			didyoumean: !!set.didyoumean,
			autobackup: !!set.autobackup,
		}
	});
});

// ── Toggle / Update Setting ───────────────────────────────────────────────────
app.post('/api/toggle', panelAuth, (req, res) => {
	const { number, feature, value } = req.body;
	const clean = (number||'').replace(/[^0-9]/g,'');
	const botJid = clean ? clean+'@s.whatsapp.net' : (() => {
		const n=global.nimaInstance; return n?.authState?.creds?.registered ? n.decodeJid(n.user.id) : null;
	})();
	if (!botJid) return res.status(503).json({ status: false, message: 'Session not found.' });
	if (!global.db) global.db = { set:{} };
	if (!global.db.set[botJid]) global.db.set[botJid] = {};
	const set = global.db.set[botJid];
	const boolF = ['anticall','antidelete','autostatus','autostatusreact','autorecording','autobio','autoread','autotyping','readsw','multiprefix','antispam','antilink','antivirtex','antihidetag','antitagsw','welcome','leave','promote','demote','nsfw','grouponly','privateonly','didyoumean','autobackup'];
	if (feature === 'mode') {
		set.public = (value === 'public');
		const sock = global.botSessions?.[clean] || global.nimaInstance;
		if (sock) sock.public = set.public;
		return res.json({ status: true, feature: 'mode', value: set.public ? 'public' : 'self' });
	} else if (boolF.includes(feature)) {
		const newVal = typeof value === 'boolean' ? value : !set[feature];
		set[feature] = newVal;
		return res.json({ status: true, feature, value: newVal });
	} else {
		return res.status(400).json({ status: false, message: 'Unknown feature: '+feature });
	}
});
app.get('/api/info', (req, res) => {
	const nima = global.nimaInstance;
	const connected = !!(nima && nima.authState?.creds?.registered);
	res.json({
		status: true,
		connected,
		botName: global.botname || 'NMD AXIS',
		version: (() => { try { return require('../package.json').version; } catch { return '2.0.0'; } })(),
	});
});

// ── Multi-Session Pair (JadiBot system) ──────────────────────────────────────
const pino_s = require('pino');
const NodeCache_s = require('node-cache');
const _retryCache = new NodeCache_s();
if (!global.pairSessions) global.pairSessions = {};
if (!global.botSessions) global.botSessions = {};

app.get('/api/pair', async (req, res) => {
	const { number } = req.query;
	if (!number) return res.status(400).json({ status: false, message: '?number=94xxxxxxxxx' });
	const cleanNumber = number.replace(/[^0-9]/g, '');
	if (cleanNumber.length < 7) return res.status(400).json({ status: false, message: 'Country code සමඟ ඇතුළත් කරන්න. Ex: 94xxxxxxxxx' });

	// Already fully connected
	if (global.botSessions[cleanNumber]?.authState?.creds?.registered) {
		return res.json({ status: false, alreadyConnected: true, message: 'Bot දැනටමත් connected!' });
	}
	// Return cached code if still pending
	if (global.pairSessions[cleanNumber]?.code) {
		return res.json({ status: true, code: global.pairSessions[cleanNumber].code, number: cleanNumber });
	}
	// Kill any stale session for this number before starting fresh
	if (global.pairSessions[cleanNumber]?.sock) {
		try { global.pairSessions[cleanNumber].sock.ev.removeAllListeners(); global.pairSessions[cleanNumber].sock.ws?.close?.(); } catch(_) {}
		delete global.pairSessions[cleanNumber];
	}

	try {
		// Try baileys first, fallback to @whiskeysockets/baileys
		let baileysMod;
		try { baileysMod = require('baileys'); } catch(_) { baileysMod = require('@whiskeysockets/baileys'); }
		const makeWASocket_s = baileysMod.default || baileysMod.makeWASocket || baileysMod;
		const { useMultiFileAuthState: uMFAS, makeCacheableSignalKeyStore: mCSKS, fetchLatestWaWebVersion: fLWWV, DisconnectReason: DR, Browsers } = baileysMod;
		const { Boom: Boom_s } = require('@hapi/boom');

		const sessDir = './database/jadibot/' + cleanNumber;
		require('child_process').execSync('rm -rf ' + sessDir); // fresh session every time
		const { state, saveCreds } = await uMFAS(sessDir);
		const { version } = await fLWWV();
		const level_s = pino_s({ level: 'silent' });

		const sock = makeWASocket_s({
			version,
			logger: level_s,
			syncFullHistory: false,
			maxMsgRetryCount: 3,
			msgRetryCounterCache: _retryCache,
			retryRequestDelayMs: 250,
			connectTimeoutMs: 60000,
			keepAliveIntervalMs: 30000,
			printQRInTerminal: false,
			defaultQueryTimeoutMs: undefined,
			browser: Browsers ? Browsers.macOS('Chrome') : ['Mac OS', 'Chrome', '120.0.0'],
			auth: { creds: state.creds, keys: mCSKS(state.keys, level_s) },
		});

		global.pairSessions[cleanNumber] = { sock, code: null };
		sock.ev.on('creds.update', saveCreds);

		let _codeRequested = false;
		sock.ev.on('connection.update', async (update) => {
			const { connection, lastDisconnect, qr } = update;

			// Official Baileys docs: request on "connecting" OR qr event — whichever comes first
			if ((connection === 'connecting' || !!qr) && !_codeRequested && !sock.authState.creds.registered) {
				_codeRequested = true;
				// Small delay to let WS handshake settle
				await new Promise(r => setTimeout(r, 1500));
				for (let attempt = 1; attempt <= 5; attempt++) {
					try {
						const code = await sock.requestPairingCode(cleanNumber);
						const fmt = code?.match(/.{1,4}/g)?.join('-') || code;
						if (global.pairSessions[cleanNumber]) {
							global.pairSessions[cleanNumber].code = fmt;
							console.log('[pair] ✅ Code: ' + fmt);
						}
						break;
					} catch(e) {
						console.log('[pair attempt ' + attempt + '] ' + e.message);
						if (attempt < 5) await new Promise(r => setTimeout(r, attempt * 3000));
					}
				}
			}

			if (connection === 'open') {
				global.botSessions[cleanNumber] = sock;
				delete global.pairSessions[cleanNumber];
				console.log('[pair] Connected: +' + cleanNumber);
				try {
					const { MessagesUpsert, GroupParticipantsUpdate } = require('./message');
					sock.ev.on('messages.upsert', async (msg) => {
						try { await MessagesUpsert(sock, msg, global.store || {}); } catch(_) {}
					});
					sock.ev.on('group-participants.update', async (upd) => {
						try { await GroupParticipantsUpdate(sock, upd, global.store || {}); } catch(_) {}
					});
				} catch(_) {}
			}

			if (connection === 'close') {
				const reason = new Boom_s(lastDisconnect?.error)?.output?.statusCode;
				if (reason === DR.loggedOut || reason === 401) {
					delete global.botSessions[cleanNumber];
					delete global.pairSessions[cleanNumber];
					require('child_process').exec('rm -rf ' + sessDir);
				} else {
					delete global.botSessions[cleanNumber];
				}
			}
		});

		// Wait up to 40s for code
		let waited = 0;
		while (!global.pairSessions[cleanNumber]?.code && waited < 40000) {
			await new Promise(r => setTimeout(r, 500));
			waited += 500;
		}
		const code = global.pairSessions[cleanNumber]?.code;
		if (!code) return res.status(504).json({ status: false, message: 'Timeout — නැවත Generate කරන්න.' });
		return res.json({ status: true, code, number: cleanNumber });
	} catch(e) {
		console.log('[/api/pair error]', e.message);
		return res.status(500).json({ status: false, message: e.message });
	}
});

app.get('/api/session', (req, res) => {
	const clean = (req.query.number||'').replace(/[^0-9]/g,'');
	if (!clean) return res.status(400).json({ status: false });
	res.json({ status: true, connected: !!(global.botSessions?.[clean]?.authState?.creds?.registered), number: clean });
});

app.get('/api/sessions', (req, res) => {
	const sessions = Object.keys(global.botSessions||{}).map(n => ({
		number: n, connected: !!(global.botSessions[n]?.authState?.creds?.registered), name: global.botSessions[n]?.user?.name||null
	}));
	res.json({ status: true, count: sessions.length, sessions });
});

app.get('/api/stream', (req, res) => {
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders();

	const send = () => {
		const nima = global.nimaInstance;
		const connected = !!(nima && nima.authState?.creds?.registered);
		const data = JSON.stringify({ connected, ts: Date.now() });
		res.write(`data: ${data}\n\n`);
	};

	send();
	const interval = setInterval(send, 5000);
	req.on('close', () => clearInterval(interval));
});

// Start listening immediately - don't rely on index.js
if (!server.listening) {
	server.listen(PORT, '0.0.0.0', () => {
		console.log(`🌐 NMD AXIS Web Panel running on port ${PORT}`);
	});
	server.on('error', (err) => {
		if (err.code === 'EADDRINUSE') {
			console.log(`⚠️ Port ${PORT} already in use`);
		} else {
			console.error('Server error:', err);
		}
	});
}

module.exports = { app, server, PORT };
