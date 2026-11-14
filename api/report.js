// Lesson report sender - runs free inside YOUR Google account. Emails go out from your Gmail.
// 1) Change SECRET to any long random text (the SAME text goes in Vercel as REPORT_SECRET).
var SECRET = 'PUT-A-LONG-RANDOM-TEXT-HERE';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.secret !== SECRET) return out({ ok: false, error: 'bad_secret' });
    var to = (d.to || []).slice(0, 3).join(',');
    if (!to) return out({ ok: false, error: 'no_to' });
    MailApp.sendEmail({
      to: to,
      subject: String(d.subject || 'Test report'),
      body: String(d.text || ''),
      htmlBody: String(d.html || ''),
      name: String(d.fromName || 'Lesson report'),
      replyTo: String(d.replyTo || '')
    });
    return out({ ok: true });
  } catch (err) { return out({ ok: false, error: String(err) }); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// RUN THIS ONCE from the editor (choose testSend, press Run) to give permission and check that it works.
// It sends a test email to the Gmail you are logged in with. Google will ask you to allow it: Advanced > Go to project > Allow.
function testSend() {
  var me = Session.getActiveUser().getEmail();
  MailApp.sendEmail({ to: me, subject: 'Test report', body: 'If you can read this, the report sender works.', name: 'Lesson report' });
}
