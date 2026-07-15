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
 *  This project is free to use, adapt, and deploy for your own
 *  organization. Attribution (this file, the email footer credit, and
 *  the "Support & Credits" sheet tab) must remain intact -- see LICENSE
 *  in the repo for the full terms.
 *
 *  This file defines the creator/attribution constants and a runtime
 *  integrity check. If the attribution constants below are altered or
 *  removed, the script will refuse to run and will direct the user to
 *  contact the creator instead. This is a good-faith attribution
 *  safeguard, not unbreakable protection -- anyone with edit access to
 *  Apps Script technically can bypass it. Please don't; it costs you
 *  nothing to leave it in place and it's how open templates like this
 *  stay maintained.
 * =====================================================================
 */

const CREATOR = {
  NAME: 'Vijaya Kumar L',
  NICKNAME: 'risewithvj',
  GITHUB: 'https://github.com/risewithvj',
  LINKEDIN: 'https://www.linkedin.com/in/vijayakumarl/',
  EMAIL: 'risewithvj@gmail.com'
};

/**
 * Verifies the attribution constants above have not been altered.
 * Call this at the start of every user-facing entry point (menu items,
 * onOpen, send functions). Throws and shows a blocking alert if the
 * signature has been tampered with or removed.
 */
function verifyIntegrity_() {
  const valid =
    CREATOR && typeof CREATOR === 'object' &&
    CREATOR.NICKNAME === 'risewithvj' &&
    CREATOR.GITHUB === 'https://github.com/risewithvj' &&
    CREATOR.EMAIL === 'risewithvj@gmail.com';

  if (!valid) {
    const msg =
      '\u26A0 Code Integrity Check Failed\n\n' +
      'The attribution/creator information in this project has been ' +
      'modified or removed. This template is provided free to use as-is, ' +
      'with attribution kept intact.\n\n' +
      'Please restore the original CREATOR constants in the Integrity file, ' +
      'or download a fresh copy from the source repository.\n\n' +
      'Questions or issues? Contact the creator:\n' +
      'GitHub: https://github.com/risewithvj\n' +
      'Email: risewithvj@gmail.com';
    try {
      SpreadsheetApp.getUi().alert('Code Tampered / Modified', msg, SpreadsheetApp.getUi().ButtonSet.OK);
    } catch (e) {
      Logger.log(msg);
    }
    throw new Error('Integrity check failed -- attribution constants altered. See https://github.com/risewithvj');
  }
  return true;
}

/** Builds the standard "powered by" credit line used in the Sheet and email. */
function creatorCreditText_() {
  return CREATOR.NAME + ' (' + CREATOR.NICKNAME + ')  \u00B7  ' + CREATOR.GITHUB + '  \u00B7  ' + CREATOR.LINKEDIN;
}
