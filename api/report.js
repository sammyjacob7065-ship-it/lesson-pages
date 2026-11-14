// lesson-report-v89  -  "Send my result": emails the staff member's name, email, every attempt and the overall score to the manager.
// The manager's address never reaches the browser: the page sends only the episode id; this function reads REPORT_TO from your Supabase.
// Sent through Brevo (free). Vercel settings needed: BREVO_API_KEY, SENDER_EMAIL (a sender you verified in Brevo), SUPABASE_URL, SUPABASE_KEY.
const hits = new Map();
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ord = n => ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'][n] || (n + 'th');
function build(b, cfg) {
  const A = b.attempts, last = A[A.length - 1], best = Math.max.apply(null, A.map(a => a.pct));
  const passed = last.pct >= cfg.passMark;
  const first = A.find(a => a.pct >= cfg.passMark);
  const rows = A.map(a => ord(a.n) + ' attempt: ' + a.pct + '%  (' + a.correct + '/' + a.total + ')');
  const subject = (passed ? 'PASSED' : 'NOT PASSED') + ' - ' + b.name + ' - ' + (cfg.org ? cfg.org + ' - ' : '') + b.title + ' (' + A.length + (A.length === 1 ? ' attempt' : ' attempts') + ')';
  const text = [
    (cfg.org ? cfg.org + ' - ' : '') + 'Test report', '',
    'Name: ' + b.name, 'Email: ' + b.email, 'Lesson: ' + b.title, 'Pass mark: ' + cfg.passMark + '%', '',
    'SCORES', ...rows, '',
    'Result: ' + (passed ? 'PASSED' : 'NOT PASSED'), 'Overall (final) score: ' + last.pct + '%', 'Best score: ' + best + '%', 'Attempts: ' + A.length,
    first ? 'Passed on attempt number ' + first.n + (first.n === 1 ? ' (first try)' : '') : '', '', 'Sent: ' + new Date().toUTCString(),
    '', 'Note: scores are recorded by the student page in the learner\'s browser.'
  ].filter(x => x !== null).join('\n');
  const html = '<div style="font-family:Arial,sans-serif;font-size:16px;color:#16203a;max-width:560px">' +
    '<h2 style="margin:0 0 4px">' + esc((cfg.org ? cfg.org + ' - ' : '') + 'Test report') + '</h2>' +
    '<p style="margin:0 0 14px;color:#4a5678">' + esc(b.title) + '</p>' +
    '<table style="border-collapse:collapse;width:100%">' +
    '<tr><td style="padding:6px 0"><b>Name</b></td><td>' + esc(b.name) + '</td></tr>' +
    '<tr><td style="padding:6px 0"><b>Email</b></td><td>' + esc(b.email) + '</td></tr>' +
    '<tr><td style="padding:6px 0"><b>Result</b></td><td><b style="color:' + (passed ? '#0a8f4d' : '#c62828') + '">' + (passed ? 'PASSED' : 'NOT PASSED') + '</b> (pass mark ' + cfg.passMark + '%)</td></tr>' +
    '<tr><td style="padding:6px 0"><b>Overall score</b></td><td>' + last.pct + '%</td></tr>' +
    '<tr><td style="padding:6px 0"><b>Attempts</b></td><td>' + A.length + (first ? ' (passed on attempt ' + first.n + ')' : '') + '</td></tr></table>' +
    '<h3 style="margin:18px 0 6px">Attempt by attempt</h3><table style="border-collapse:collapse;width:100%;border:1px solid #c9d2ea">' +
    A.map(a => '<tr><td style="padding:8px 10px;border-bottom:1px solid #e3e8f6">' + ord(a.n) + ' attempt</td><td style="padding:8px 10px;border-bottom:1px solid #e3e8f6"><b>' + a.pct + '%</b> (' + a.correct + '/' + a.total + ')</td></tr>').join('') +
    '</table><p style="color:#4a5678;font-size:13px;margin-top:16px">Scores are recorded by the student page in the learner\'s browser.</p></div>';
  return { subject, text, html };
}
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store');
  const out = (code, obj) => { res.statusCode = code; res.end(JSON.stringify(obj)); };
  if (req.method !== 'POST') return out(405, { error: 'post_only' });
  const U = String(process.env.SENDER_EMAIL || '').trim(), P = process.env.BREVO_API_KEY, SU = String(process.env.SUPABASE_URL || '').replace(/\/+$/, ''), SK = process.env.SUPABASE_KEY;
  if (!U || !P || !SU || !SK) return out(503, { error: 'not_configured' });
  const ip = String((req.headers['x-forwarded-for'] || '').split(',')[0] || 'x').trim(), now = Date.now();
  const h = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  if (h.length >= 6) return out(429, { error: 'slow_down' });
  h.push(now); hits.set(ip, h);
  let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b !== 'object') return out(400, { error: 'bad_request' });
  const clean = x => String(x == null ? '' : x).replace(/[\r\n\t]+/g, ' ').trim();
  const id = clean(b.id), name = clean(b.name).slice(0, 80), email = clean(b.email).slice(0, 120), title = clean(b.title).slice(0, 120) || 'Lesson';
  if (!/^[0-9a-f-]{8,64}$/i.test(id) || name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return out(400, { error: 'bad_request' });
  const A = (Array.isArray(b.attempts) ? b.attempts : []).slice(0, 30).map((a, k) => ({ n: k + 1, correct: Math.max(0, parseInt(a && a.correct, 10) || 0), total: Math.max(1, parseInt(a && a.total, 10) || 1), pct: Math.max(0, Math.min(100, parseInt(a && a.pct, 10) || 0)) }));
  if (!A.length) return out(400, { error: 'bad_request' });
  try {
    const r = await fetch(SU + '/rest/v1/episodes?id=eq.' + encodeURIComponent(id) + '&select=scenes&limit=1', { headers: { apikey: SK, Authorization: 'Bearer ' + SK } });
    const rows = await r.json();
    const sc = Array.isArray(rows) && rows[0] && Array.isArray(rows[0].scenes) ? rows[0].scenes : [];
    const s0 = sc.find(s => s && s.lesson_page) || {};
    const to = (Array.isArray(s0.report_to) ? s0.report_to : []).filter(x => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x)).slice(0, 3);
    if (!to.length) return out(404, { error: 'no_report_address' });
    const cfg = { passMark: Math.max(1, Math.min(100, parseInt(s0.pass_mark, 10) || 100)), org: clean(s0.report_org).slice(0, 80) };
    const m = build({ name, email, title, attempts: A }, cfg);
    const payload = { sender: { name: (name.replace(/[\"<>\\]/g, '') + ' (' + (cfg.org || 'Lesson report') + ')').slice(0, 120), email: U }, to: to.map(x => ({ email: x })), replyTo: { email: email, name: name.replace(/[\"<>\\]/g, '') }, subject: m.subject, htmlContent: m.html, textContent: m.text };
    if (process.env.REPORT_DRY_RUN) return out(200, { ok: true, dry: payload });
    const br = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': P, 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(payload) });
    if (!br.ok) return out(502, { error: 'send_failed' });
    return out(200, { ok: true });
  } catch (e) { return out(502, { error: 'send_failed' }); }
};
