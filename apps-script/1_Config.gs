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
 *  CONFIGURATION
 *  Edit the BRAND section below to match your own company. Everything
 *  else (recipient emails, agent-name mapping) is managed inside the
 *  spreadsheet itself, in the "Report Config" and "Agent Mapping" tabs
 *  -- no code editing needed for day-to-day use.
 * =====================================================================
 */

const CONFIG = {

  // ---- Sheet (tab) names ------------------------------------------------
  SHEETS: {
    WEEKLY_RAW:        'Weekly Raw',
    WEEKLY_DASHBOARD:  'Weekly Dashboard',
    MONTHLY_RAW:       'Monthly Raw',
    MONTHLY_DASHBOARD: 'Monthly Dashboard',
    AGENT_MAPPING:     'Agent Mapping',
    REPORT_CONFIG:     'Report Config',
    SUPPORT:           'Support & Credits'
  },

  // ---- Brand -- EDIT THIS SECTION FOR YOUR OWN COMPANY -------------------
  BRAND: {
    NAME: 'Your Company Name',
    TAGLINE: 'Your Tagline Here',
    COLOR_NAVY:   '#0A2A55',   // dark accent (icon / headers)
    COLOR_BLUE:   '#1657FF',   // primary brand blue
    COLOR_BLUE_LIGHT: '#EAF1FF',
    COLOR_GREEN:  '#1B9E6B',   // answered / positive
    COLOR_RED:    '#E5484D',   // missed / negative
    COLOR_AMBER:  '#F5A524',   // no-answer / busy
    COLOR_GREY:   '#667085',
    COLOR_BG:     '#F4F6FB'
  },

  // ---- Raw Exotel export column layout (0-indexed) -----------------------
  // Exotel's CDR export has no header row and a fixed column order.
  // If Exotel changes their export format, only these numbers need updating.
  RAW_COLUMNS: {
    DIRECTION:      1,   // "inbound" / "outbound"
    AGENT_NUMBER:   6,
    AGENT_NAME:     7,   // blank / "N/A" for pure IVR call-attempt rows
    STATUS:         8,   // "completed" / "missed-call" / "call-attempt"
    START_TIME:     9,
    END_TIME:       10,
    DURATION:       11,
    GROUP:          15,  // queue / department name
    OUTCOME:        19,  // "completed" / "no-answer" / "busy" / "failed" / "canceled"
    TALK_DURATION:  20
  },

  // ---- Outcome bucket mapping ---------------------------------------------
  // Maps Exotel's raw "outcome" value -> the report column it feeds.
  OUTCOME_MAP: {
    'completed': 'answered',
    'no-answer': 'noAnswer',
    'busy':      'busy',
    'failed':    'failed',
    'canceled':  'missed'
  },

  // ---- Report subject lines -------------------------------------------
  WEEKLY_SUBJECT_PREFIX:  'Weekly IVR Calling Report',
  MONTHLY_SUBJECT_PREFIX: 'Monthly IVR Calling Report',

  TIMEZONE: Session.getScriptTimeZone() || 'Asia/Kolkata'
};
