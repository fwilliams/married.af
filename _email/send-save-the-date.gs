/**
 * Send the save-the-date to every guest in a Google Sheet, one email each,
 * from the account that runs this script (use amandafrancis@married.af).
 *
 * Why not Gmail's mail merge / a pasted compose: pasting drops the <style>
 * block, the phone layout and the Outlook fixes, and mail merge is not offered
 * from secondary domains or aliases. GmailApp sends the hosted HTML verbatim,
 * adds no unsubscribe footer, and still signs with the account's SPF/DKIM.
 *
 * Setup (once):
 *   1. Sign in as amandafrancis@married.af. Make a Google Sheet with a header
 *      row:  Name | Email | Sent          (Sent stays empty; the script fills it)
 *   2. Extensions → Apps Script. Replace the contents with this file. Save.
 *   3. Run `sendTest` first; it emails only TEST_TO. Open that message, choose
 *      "Show original", and confirm SPF PASS, DKIM PASS (header.d=married.af)
 *      and DMARC PASS before going further.
 *   4. Run `sendSaveTheDates`. It skips rows already marked Sent, so you can
 *      run it in batches (e.g. family first) by filling in / clearing Sent.
 *
 * Quota: Workspace accounts can send 1,500 recipients/day via Apps Script
 * (500 while the account is in trial). Check with `remainingQuota`.
 */

const SUBJECT   = 'Save the date: Amanda & Francis, August 7th, 2027';
const HTML_URL  = 'https://married.af/email/save-the-date/';
const FROM_NAME = 'Amanda & Francis';
const REPLY_TO  = 'amandafrancis@married.af';
const TEST_TO   = 'amandafrancis@married.af';   // change to a personal Gmail to test inbox placement

const PLAIN_TEXT = [
  'SAVE THE DATE — Amanda & Francis',
  '',
  'August 7th, 2027',
  'Old Montréal',
  '',
  "We're getting married, and we'd love for you to be there. The invitation,",
  "with everything you'll need to know about the weekend, will follow.",
  'For now, please save the date.',
  '',
  'Add to Google Calendar: https://calendar.google.com/calendar/render?action=TEMPLATE&text=Amanda%20%26%20Francis%20Wedding&dates=20270807T210000Z%2F20270808T070000Z&location=Crew%20Collective%2C%20360%20Rue%20Saint-Jacques%2C%20Old%20Montr%C3%A9al%2C%20QC',
  'Add to other calendars: https://married.af/assets/amanda-francis-wedding.ics',
  '',
  'Visit married.af',
  '',
  'Questions? Write to us at amandafrancis@married.af',
].join('\n');

function fetchHtml_() {
  const res = UrlFetchApp.fetch(HTML_URL, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new Error('Could not fetch ' + HTML_URL + ' (' + res.getResponseCode() + ')');
  return res.getContentText();
}

function send_(to, html) {
  GmailApp.sendEmail(to, SUBJECT, PLAIN_TEXT, { htmlBody: html, name: FROM_NAME, replyTo: REPLY_TO });
}

/** Sends one copy to TEST_TO. */
function sendTest() {
  send_(TEST_TO, fetchHtml_());
  Logger.log('Test sent to ' + TEST_TO);
}

/** Sends to every row with an Email and an empty Sent cell; stamps Sent. */
function sendSaveTheDates() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const header = rows[0].map(h => String(h).trim().toLowerCase());
  const emailCol = header.indexOf('email'), sentCol = header.indexOf('sent');
  if (emailCol < 0 || sentCol < 0) throw new Error('Header row must contain "Email" and "Sent"');

  const html = fetchHtml_();
  let sent = 0;
  for (let i = 1; i < rows.length; i++) {
    const to = String(rows[i][emailCol] || '').trim();
    if (!to || rows[i][sentCol]) continue;
    send_(to, html);
    sheet.getRange(i + 1, sentCol + 1).setValue(new Date());
    sent++;
    Utilities.sleep(1200);   // gentle pacing; ~150 guests takes about three minutes
  }
  Logger.log('Sent ' + sent + ' emails. Remaining quota today: ' + MailApp.getRemainingDailyQuota());
}

function remainingQuota() {
  Logger.log('Remaining email quota today: ' + MailApp.getRemainingDailyQuota());
}
