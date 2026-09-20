/**
 * Send the save-the-date to every household in a Google Sheet — one email per
 * row, addressed to every email in the row, greeted by name — from the account
 * that runs this script (use amandafrancis@married.af).
 *
 * Why not Gmail's mail merge / a pasted compose: pasting drops the <style>
 * block, the phone layout and the Outlook fixes, and mail merge is not offered
 * from secondary domains or aliases. GmailApp sends the hosted HTML verbatim,
 * adds no unsubscribe footer, and still signs with the account's SPF/DKIM.
 *
 * SETUP (once)
 *   1. Signed in as amandafrancis@married.af, create a blank Google Sheet.
 *   2. Extensions → Apps Script. Replace the contents with this file. Save.
 *   3. Run `setupSheet`. It writes the header row, freezes it, sizes the
 *      columns, adds email validation and one example row (grey italics —
 *      the sender ignores @example.com addresses; delete it when you like).
 *
 * FILLING IT IN — one row per household:
 *   Name 1  | Name 2  | Email 1            | Email 2           | Sent
 *   Marie   | Jean    | marie@example.com  | jean@example.com  |
 *   Alex    |         | alex@example.com   |                   |
 *   Sam     | Priya   | sam@example.com    |                   |
 *   → "Marie and Jean," to both addresses; "Alex," to one; "Sam and Priya,"
 *     to Sam's address only. Leave Sent empty; the script stamps it.
 *
 * SENDING
 *   4. Run `previewGreetings` — logs every greeting and recipient list
 *      without sending, so the sheet can be checked at a glance.
 *   5. Run `sendTest`. It emails only TEST_TO. Open that message, choose
 *      "Show original", and confirm SPF PASS, DKIM PASS (header.d=married.af)
 *      and DMARC PASS before going further.
 *   6. Run `sendSaveTheDates`. Rows already marked Sent are skipped, so it
 *      can run in batches (family first) by filling in / clearing Sent.
 *
 * Quota: Workspace accounts can send to 1,500 recipients/day via Apps Script
 * (500 while the account is in trial). Check with `remainingQuota`.
 */

var SUBJECT   = 'Save the date: Amanda & Francis, August 7th, 2027';
var HTML_URL  = 'https://married.af/email/save-the-date/';
var FROM_NAME = 'Amanda & Francis';
var REPLY_TO  = 'amandafrancis@married.af';
var TEST_TO   = 'amandafrancis@married.af';     // change to a personal Gmail to test inbox placement
var TEST_NAME = 'Amanda and Francis';
var FALLBACK_GREETING = 'Friends and family';  // used only if a row has emails but no name

var HEADER = ['Name 1', 'Name 2', 'Email 1', 'Email 2', 'Sent'];

function plainText_(greeting) {
  return [
    greeting + ',',
    '',
    "We're having our wedding and we'd love for you to be there. The invitation and",
    "everything you'll need to know about the weekend will follow. For now, please",
    'save the date.',
    '',
    'SAVE THE DATE — Amanda & Francis',
    'August 7th, 2027 · Old Montréal',
    '',
    'Add to your calendar: https://married.af/assets/amanda-francis-wedding.ics',
    '',
    'Visit married.af',
    '',
    'Questions? Write to us at amandafrancis@married.af'
  ].join('\n');
}

// ---------- Sheet ----------

function setupSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getLastRow() > 1 && sheet.getRange(1, 1).getValue() !== HEADER[0]) {
    throw new Error('This sheet already has content that is not a guest list. Run setupSheet on a blank sheet.');
  }
  sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER])
    .setFontWeight('bold').setBackground('#15110D').setFontColor('#F1E6CC');
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, 2, 150);
  sheet.setColumnWidths(3, 2, 260);
  sheet.setColumnWidth(5, 170);
  sheet.getRange('A1').setNote('One row per household. Name 2 and Email 2 are optional. The greeting reads "Name 1 and Name 2,". The email goes to every address in the row. Leave Sent empty — the script fills it in.');
  var emailRule = SpreadsheetApp.newDataValidation().requireTextIsEmail().setAllowInvalid(true).setHelpText('Must be an email address').build();
  sheet.getRange('C2:D1000').setDataValidation(emailRule);
  sheet.getRange('E2:E1000').setNumberFormat('yyyy-mm-dd hh:mm');
  if (sheet.getLastRow() < 2) {
    sheet.getRange(2, 1, 1, 4).setValues([['Marie', 'Jean', 'marie@example.com', 'jean@example.com']])
      .setFontColor('#999999').setFontStyle('italic');
  }
  Logger.log('Sheet ready. Fill in one row per household, then run previewGreetings.');
}

// Reads the sheet into households: { row, greeting, emails, sent }.
function households_() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var header = rows[0].map(function (h) { return String(h).trim().toLowerCase(); });
  var col = function (name) { var i = header.indexOf(name.toLowerCase()); if (i < 0) throw new Error('Missing column "' + name + '" — run setupSheet first'); return i; };
  var n1 = col('Name 1'), n2 = col('Name 2'), e1 = col('Email 1'), e2 = col('Email 2'), sent = col('Sent');
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    var names = [r[n1], r[n2]].map(function (v) { return String(v || '').trim(); }).filter(Boolean);
    var emails = [r[e1], r[e2]].map(function (v) { return String(v || '').trim().toLowerCase(); })
      .filter(function (v) { return v && !/@example\.com$/.test(v); });
    if (!emails.length) continue;
    out.push({ row: i + 1, sentCol: sent + 1, greeting: names.join(' and ') || FALLBACK_GREETING, names: names, emails: emails, sent: r[sent] });
  }
  return out;
}

/** Dry run: logs what each household would receive. Sends nothing. */
function previewGreetings() {
  var hs = households_();
  hs.forEach(function (h) {
    Logger.log((h.sent ? '[sent] ' : '       ') + '"' + h.greeting + '," → ' + h.emails.join(', ') + (h.names.length ? '' : '   ⚠ no name, fallback greeting'));
  });
  Logger.log(hs.length + ' households, ' + hs.filter(function (h) { return !h.sent; }).length + ' still to send.');
}

// ---------- Sending ----------

function fetchHtml_() {
  var res = UrlFetchApp.fetch(HTML_URL, { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) throw new Error('Could not fetch ' + HTML_URL + ' (' + res.getResponseCode() + ')');
  var html = res.getContentText();
  if (!/data-greeting/.test(html)) throw new Error('The hosted email has no greeting marker; it may be out of date');
  return html;
}

function escapeHtml_(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function personalize_(html, greeting) {
  return html.replace(/(<span data-greeting[^>]*>)[^<]*(<\/span>)/, '$1' + escapeHtml_(greeting) + '$2');
}

function send_(emails, greeting, html) {
  GmailApp.sendEmail(emails.join(','), SUBJECT, plainText_(greeting), {
    htmlBody: personalize_(html, greeting), name: FROM_NAME, replyTo: REPLY_TO
  });
}

/** Sends one copy to TEST_TO, greeted as TEST_NAME. */
function sendTest() {
  send_([TEST_TO], TEST_NAME, fetchHtml_());
  Logger.log('Test sent to ' + TEST_TO + ' as "' + TEST_NAME + ',"');
}

/** Sends to every household without a Sent stamp; stamps Sent. */
function sendSaveTheDates() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var html = fetchHtml_();
  var count = 0;
  households_().forEach(function (h) {
    if (h.sent) return;
    send_(h.emails, h.greeting, html);
    sheet.getRange(h.row, h.sentCol).setValue(new Date());
    count++;
    Utilities.sleep(1200);   // gentle pacing; ~150 households takes about three minutes
  });
  Logger.log('Sent ' + count + ' emails. Remaining quota today: ' + MailApp.getRemainingDailyQuota());
}

function remainingQuota() {
  Logger.log('Remaining email quota today: ' + MailApp.getRemainingDailyQuota());
}
