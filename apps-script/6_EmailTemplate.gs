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
 *  EMAIL HTML BUILDER
 *  Table-based layout for maximum email-client compatibility. Rounded
 *  boxes use <div> elements (not <table>/<td>) for reliable rendering
 *  in Gmail -- see PROJECT_BRAIN.md if curious why that matters.
 *
 *  NOTE: the attribution footer line at the bottom of the email
 *  ("Report template by ...") is intentionally part of this function's
 *  output, not a Report Config setting -- please keep it in place.
 *  See LICENSE in the repo root for the full terms.
 * =====================================================================
 */

function buildEmailHtml_(data, label, companyName, generatedBy) {
  const B = CONFIG.BRAND;
  const answerRate = data.totals.overall ? Math.round((data.totals.answered / data.totals.overall) * 1000) / 10 : 0;
  const periodText = periodLabel_(data);
  const generatedOn = formatDate_(new Date(), 'dd MMM yyyy, hh:mm a');

  const kpiCard = function(label, value, color) {
    return '' +
      '<td class="kpi-cell" style="padding:6px;" valign="top">' +
        '<div style="background:#FFFFFF;border:1px solid #E4E7EC;border-radius:14px;padding:14px 16px;">' +
          '<div style="font-size:12px;color:' + B.COLOR_GREY + ';font-family:Arial,Helvetica,sans-serif;margin-bottom:6px;">' + label + '</div>' +
          '<div style="font-size:24px;font-weight:bold;color:' + (color || B.COLOR_NAVY) + ';font-family:Arial,Helvetica,sans-serif;">' + value + '</div>' +
        '</div>' +
      '</td>';
  };

  const kpiRow1 = '<tr>' +
      kpiCard('Total Inbound Calls', data.totals.overall, B.COLOR_NAVY) +
      kpiCard('Answered', data.totals.answered, B.COLOR_GREEN) +
      kpiCard('Answer Rate', answerRate + '%', answerRate >= 70 ? B.COLOR_GREEN : (answerRate >= 50 ? B.COLOR_AMBER : B.COLOR_RED)) +
    '</tr>';
  const kpiRow2 = '<tr>' +
      kpiCard('Missed', data.totals.missed, B.COLOR_RED) +
      kpiCard('No Answer / Busy / Failed', data.totals.noAnswer + data.totals.busy + data.totals.failed, B.COLOR_AMBER) +
      kpiCard('Outgoing Calls', data.totals.outgoing, B.COLOR_BLUE) +
    '</tr>';

  const barCell = function(count, total, color) {
    const pct = total ? Math.max(2, Math.round((count / total) * 100)) : 0;
    return '' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
        '<td style="background:#EEF1F6;border-radius:6px;" height="8">' +
          '<table role="presentation" width="' + pct + '%" cellpadding="0" cellspacing="0"><tr>' +
            '<td style="background:' + color + ';border-radius:6px;" height="8">&nbsp;</td>' +
          '</tr></table>' +
        '</td>' +
      '</tr></table>';
  };

  const agentRows = data.agents.map(function(a, i) {
    const rate = a.overall ? Math.round((a.answered / a.overall) * 1000) / 10 : 0;
    const zebra = i % 2 === 0 ? '#FFFFFF' : '#F8FAFF';
    const nameColor = a.mapped ? B.COLOR_NAVY : '#B54708';
    return '' +
      '<tr style="background:' + zebra + ';">' +
        '<td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:' + nameColor + ';border-bottom:1px solid #EEF1F6;white-space:nowrap;">' + escapeHtml_(a.name) + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;border-bottom:1px solid #EEF1F6;">' + a.overall + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:' + B.COLOR_GREEN + ';font-weight:bold;border-bottom:1px solid #EEF1F6;">' + a.answered + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:' + B.COLOR_RED + ';border-bottom:1px solid #EEF1F6;">' + a.missed + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:' + B.COLOR_AMBER + ';border-bottom:1px solid #EEF1F6;">' + (a.noAnswer + a.busy + a.failed) + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;border-bottom:1px solid #EEF1F6;">' + a.outgoing + '</td>' +
        '<td style="padding:10px 12px;width:120px;min-width:120px;white-space:nowrap;border-bottom:1px solid #EEF1F6;">' + barCell(a.answered, a.overall, B.COLOR_BLUE) +
          '<div style="font-size:11px;color:' + B.COLOR_GREY + ';font-family:Arial,Helvetica,sans-serif;margin-top:3px;text-align:right;white-space:nowrap;">' + rate + '%</div></td>' +
      '</tr>';
  }).join('');

  const unmappedBanner = data.unmapped.length ? (
    '<tr><td style="padding:0 24px 12px 24px;">' +
      '<div style="background:#FFFAEB;border:1px solid #FEDF89;border-radius:12px;padding:12px 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#B54708;">' +
        '&#9888; ' + data.unmapped.length + ' raw agent name(s) are not yet mapped in the "Agent Mapping" tab: ' + escapeHtml_(data.unmapped.join(', ')) +
      '</div>' +
    '</td></tr>'
  ) : '';

  return '' +
'<!DOCTYPE html><html><head><meta charset="UTF-8">' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'<title>' + label + ' IVR Calling Report</title>' +
'<style>' +
  'body{margin:0;padding:0;background:' + B.COLOR_BG + ';}' +
  '.wrapper{width:100%;background:' + B.COLOR_BG + ';padding:24px 0;}' +
  '.container{max-width:640px;margin:0 auto;background:#FFFFFF;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(16,24,40,0.08);}' +
  'table{border-collapse:collapse;}' +
  '@media only screen and (max-width:480px){' +
    '.container{width:100% !important;border-radius:0 !important;}' +
    '.kpi-cell{display:block !important;width:100% !important;}' +
    '.stack-hide{display:none !important;}' +
    '.data-table th, .data-table td{font-size:12px !important;padding:8px 6px !important;}' +
    '.mobile-pad{padding-left:14px !important;padding-right:14px !important;}' +
  '}' +
'</style></head>' +
'<body>' +
'<div class="wrapper">' +
'<table role="presentation" class="container" width="640" cellpadding="0" cellspacing="0" align="center">' +

  // Header
  '<tr><td style="background:' + B.COLOR_NAVY + ';padding:22px 24px;" class="mobile-pad">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
      '<td valign="middle" width="150">' +
        '<div style="background:#FFFFFF;border-radius:10px;padding:8px 14px;display:inline-block;">' +
          '<img src="cid:reportLogo" width="110" alt="' + companyName + '" style="display:block;border:0;max-width:110px;">' +
        '</div>' +
      '</td>' +
      '<td valign="middle" align="right">' +
        '<div style="font-family:Arial,Helvetica,sans-serif;color:#FFFFFF;font-size:16px;font-weight:bold;">' + label + ' IVR Calling Report</div>' +
        '<div style="font-family:Arial,Helvetica,sans-serif;color:#C6D3F0;font-size:12px;margin-top:2px;">' + periodText + '</div>' +
      '</td>' +
    '</tr></table>' +
  '</td></tr>' +

  // KPI section
  '<tr><td style="padding:20px 16px 6px 16px;" class="mobile-pad">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' + kpiRow1 + kpiRow2 + '</table>' +
  '</td></tr>' +

  unmappedBanner +

  // Agent table
  '<tr><td style="padding:8px 24px 4px 24px;" class="mobile-pad">' +
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:' + B.COLOR_NAVY + ';margin-bottom:10px;">Agent-wise Performance</div>' +
  '</td></tr>' +
  '<tr><td style="padding:0 16px 20px 16px;" class="mobile-pad">' +
    '<div style="overflow-x:auto;border:1px solid #EEF1F6;border-radius:12px;">' +
    '<table role="presentation" class="data-table" width="100%" cellpadding="0" cellspacing="0" style="min-width:560px;">' +
      '<tr style="background:' + B.COLOR_BLUE + ';">' +
        '<th align="left" style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#FFFFFF;white-space:nowrap;">Agent</th>' +
        '<th style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#FFFFFF;white-space:nowrap;">Overall</th>' +
        '<th style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#FFFFFF;white-space:nowrap;">Answered</th>' +
        '<th style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#FFFFFF;white-space:nowrap;">Missed</th>' +
        '<th style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#FFFFFF;white-space:nowrap;">NA/Busy/Fail</th>' +
        '<th style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#FFFFFF;white-space:nowrap;">Outgoing</th>' +
        '<th style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#FFFFFF;white-space:nowrap;">Answer Rate</th>' +
      '</tr>' +
      agentRows +
      '<tr style="background:' + B.COLOR_BLUE_LIGHT + ';">' +
        '<td style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:' + B.COLOR_NAVY + ';white-space:nowrap;">Total</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;white-space:nowrap;">' + data.totals.overall + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;white-space:nowrap;">' + data.totals.answered + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;white-space:nowrap;">' + data.totals.missed + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;white-space:nowrap;">' + (data.totals.noAnswer + data.totals.busy + data.totals.failed) + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;white-space:nowrap;">' + data.totals.outgoing + '</td>' +
        '<td style="padding:10px 12px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;white-space:nowrap;">' + answerRate + '%</td>' +
      '</tr>' +
    '</table>' +
    '</div>' +
  '</td></tr>' +

  // Footer -- report info line (customizable via Report Config)
  '<tr><td style="padding:10px 24px 4px 24px;border-top:1px solid #EEF1F6;" class="mobile-pad">' +
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:' + B.COLOR_GREY + ';">' +
      companyName + ' IVR Reporting System &middot; ' + generatedOn +
      (generatedBy ? ' &middot; by ' + escapeHtml_(generatedBy) : '') +
    '</div>' +
  '</td></tr>' +

  // Footer -- template attribution line (please keep intact, see LICENSE)
  '<tr><td style="padding:0 24px 14px 24px;" class="mobile-pad">' +
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#B7BFCC;">' +
      'Report template by <a href="' + CREATOR.GITHUB + '" style="color:#98A2B3;text-decoration:underline;">' + CREATOR.NAME + '</a>' +
      ' &middot; <a href="' + CREATOR.GITHUB + '" style="color:#98A2B3;text-decoration:underline;">GitHub</a>' +
      ' &middot; <a href="' + CREATOR.LINKEDIN + '" style="color:#98A2B3;text-decoration:underline;">LinkedIn</a>' +
    '</div>' +
  '</td></tr>' +

'</table>' +
'</div>' +
'</body></html>';
}

function escapeHtml_(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
