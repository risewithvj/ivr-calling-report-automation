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
 *  PARSER / AGGREGATOR
 *  Turns raw Exotel CDR rows into the per-agent summary table:
 *  Agent | Overall Calls | Answered | Missed | No Answer | Busy | Failed | Outgoing
 * =====================================================================
 */


/**
 * @param {string} rawSheetName  CONFIG.SHEETS.WEEKLY_RAW or MONTHLY_RAW
 * @return {Object} { periodStart, periodEnd, agents: [...], totals: {...}, unmapped: [...] }
 */
function buildReportData_(rawSheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const raw = ss.getSheetByName(rawSheetName);
  if (!raw) throw new Error('"' + rawSheetName + '" tab not found.');

  const values = raw.getDataRange().getValues();
  const C = CONFIG.RAW_COLUMNS;
  const mapping = loadAgentMapping_();

  // agentKey -> stats
  const byAgent = {};
  let ivrOnlyAttempts = 0; // rows that never reached an agent
  let minDate = null, maxDate = null;

  function ensureAgent(name) {
    if (!byAgent[name]) {
      byAgent[name] = { name: name, overall: 0, answered: 0, missed: 0,
                          noAnswer: 0, busy: 0, failed: 0, other: 0, outgoing: 0,
                          mapped: true };
    }
    return byAgent[name];
  }

  let skippedHeaderRows = 0;

  for (let r = 0; r < values.length; r++) {
    const row = values[r];
    // Skip fully blank rows
    if (!row || row.length < C.OUTCOME + 1) continue;

    // Skip any stray header/label row automatically -- e.g. a row that reads
    // "FromName | To | ToName | Status" pasted in by accident along with the
    // data. Detected by checking if this row's Status-column and Agent-Name
    // column values exactly match known column-label text, case-insensitive.
    // This means the sheet never needs to be manually cleaned before running.
    const statusCellRaw = String(row[C.STATUS] || '').trim().toLowerCase();
    const agentCellRaw = String(row[C.AGENT_NAME] || '').trim().toLowerCase();
    const HEADER_LABELS = ['status', 'toname', 'fromname', 'agent name', 'raw agent name', 'to', 'from'];
    if (HEADER_LABELS.indexOf(statusCellRaw) !== -1 || HEADER_LABELS.indexOf(agentCellRaw) !== -1) {
      skippedHeaderRows++;
      continue;
    }

    const rawAgentRaw = String(row[C.AGENT_NAME] || '').trim();
    if (!rawAgentRaw || rawAgentRaw === 'N/A') { ivrOnlyAttempts++; continue; }

    const direction = String(row[C.DIRECTION] || '').trim().toLowerCase();
    const outcomeRaw = String(row[C.OUTCOME] || '').trim().toLowerCase();
    const startTimeRaw = row[C.START_TIME];

    // Track period span from Start Time column, if parseable
    const dt = parseDate_(startTimeRaw);
    if (dt) {
      if (!minDate || dt < minDate) minDate = dt;
      if (!maxDate || dt > maxDate) maxDate = dt;
    }

    const mapEntry = mapping[rawAgentRaw];
    const displayName = mapEntry ? mapEntry.display : ('⚠ Unmapped: ' + rawAgentRaw);
    const agent = ensureAgent(displayName);
    if (!mapEntry) agent.mapped = false;

    if (direction === 'outbound' || direction === 'outgoing') {
      agent.outgoing++;
      continue; // outgoing calls counted separately, not in inbound Overall Calls
    }

    agent.overall++;
    const bucket = CONFIG.OUTCOME_MAP[outcomeRaw];
    if (bucket === 'answered') agent.answered++;
    else if (bucket === 'noAnswer') agent.noAnswer++;
    else if (bucket === 'busy') agent.busy++;
    else if (bucket === 'failed') agent.failed++;
    else if (bucket === 'missed') agent.missed++;
    else agent.other++; // unclassified outcome — surfaced, never silently dropped
  }

  const agents = Object.keys(byAgent).map(function(k){ return byAgent[k]; })
    .sort(function(a, b){ return b.overall - a.overall; });

  const totals = agents.reduce(function(t, a) {
    t.overall += a.overall; t.answered += a.answered; t.missed += a.missed;
    t.noAnswer += a.noAnswer; t.busy += a.busy; t.failed += a.failed;
    t.other += a.other; t.outgoing += a.outgoing;
    return t;
  }, { overall: 0, answered: 0, missed: 0, noAnswer: 0, busy: 0, failed: 0, other: 0, outgoing: 0 });

  const unmapped = agents.filter(function(a){ return !a.mapped; }).map(function(a){ return a.name; });

  return {
    periodStart: minDate,
    periodEnd: maxDate,
    agents: agents,
    totals: totals,
    ivrOnlyAttempts: ivrOnlyAttempts,
    unmapped: unmapped,
    skippedHeaderRows: skippedHeaderRows
  };
}

function loadAgentMapping_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(CONFIG.SHEETS.AGENT_MAPPING);
  const map = {};
  if (!sh) return map;
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) { // skip header row
    const rawName = String(values[i][0] || '').trim();
    const display = String(values[i][1] || '').trim();
    if (rawName && display) map[rawName] = { display: display, team: String(values[i][2] || '').trim() };
  }
  return map;
}

/** Accepts Date objects, "yyyy-MM-dd HH:mm:ss" strings, or blank. */
function parseDate_(value) {
  if (!value) return null;
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value)) return value;
  const s = String(value).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  const d = new Date(s);
  return isNaN(d) ? null : d;
}

function formatDate_(d, fmt) {
  return d ? Utilities.formatDate(d, CONFIG.TIMEZONE, fmt) : '';
}
