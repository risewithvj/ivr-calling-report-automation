/**
 * =====================================================================
 *  IVR Calling Report Automation for Google Sheets + Apps Script
 * =====================================================================
 *  Created by   : Vijaya Kumar L
 *  Nickname     : risewithvj
 *  GitHub       : https://github.com/risewithvj
 *  LinkedIn     : https://www.linkedin.com/in/vijayakumarl/
 *  Email        : risewithvj@gmail.com
 * -----------------------------------------------------------------------
 *  TRIGGERS + MENU
 * =====================================================================
 */

function onOpen() {
  try {
    verifyIntegrity_();
  } catch (e) {
    // verifyIntegrity_ already showed the alert; still build the menu so
    // the user can see something, but every action re-checks anyway.
  }

  SpreadsheetApp.getUi().createMenu('IVR Reports')
    .addItem('1. Initialize Sheet Structure', 'initializeSheetStructure')
    .addSeparator()
    .addItem('Build Weekly Dashboard Now', 'buildWeeklyDashboardNow')
    .addItem('Send Weekly Report Now', 'sendWeeklyReport')
    .addSeparator()
    .addItem('Build Monthly Dashboard Now', 'buildMonthlyDashboardNow')
    .addItem('Send Monthly Report Now', 'sendMonthlyReport')
    .addSeparator()
    .addItem('2. Install Automatic Schedule (Sun 7PM + 1st 10AM)', 'installTriggers')
    .addItem('Remove Automatic Schedule', 'removeTriggers')
    .addSeparator()
    .addItem('About / Support', 'showAboutDialog')
    .addToUi();
}

function installTriggers() {
  verifyIntegrity_();
  removeTriggers(); // avoid duplicates if run more than once

  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(19) // 7 PM
    .nearMinute(0)
    .inTimezone(CONFIG.TIMEZONE)
    .create();

  ScriptApp.newTrigger('sendMonthlyReport')
    .timeBased()
    .onMonthDay(1)
    .atHour(10) // 10 AM
    .nearMinute(0)
    .inTimezone(CONFIG.TIMEZONE)
    .create();

  SpreadsheetApp.getUi().alert(
    'Automatic schedule installed',
    'Weekly report: every Sunday ~7:00 PM (' + CONFIG.TIMEZONE + ')\n' +
    'Monthly report: 1st of every month ~10:00 AM (' + CONFIG.TIMEZONE + ')\n\n' +
    'Reports send from your Google account\'s Gmail, using whatever is currently ' +
    'pasted in "Weekly Raw" / "Monthly Raw" at trigger time -- so make sure that ' +
    'week\'s / month\'s data is pasted in before the scheduled time.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    const fn = t.getHandlerFunction();
    if (fn === 'sendWeeklyReport' || fn === 'sendMonthlyReport') ScriptApp.deleteTrigger(t);
  });
}

function showAboutDialog() {
  const msg =
    'IVR Calling Report Automation\n\n' +
    'Created by: ' + CREATOR.NAME + ' (' + CREATOR.NICKNAME + ')\n' +
    'GitHub: ' + CREATOR.GITHUB + '\n' +
    'LinkedIn: ' + CREATOR.LINKEDIN + '\n' +
    'Email: ' + CREATOR.EMAIL + '\n\n' +
    'For setup help, customization guides, or to report an issue, visit the ' +
    'GitHub repository or reach out directly using the contacts above. ' +
    'See the "Support & Credits" tab in this sheet too.';
  SpreadsheetApp.getUi().alert('About this template', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}
