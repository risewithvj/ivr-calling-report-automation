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
 *  DASHBOARD BUILDER -- writes a formatted, chart-backed BI-style
 *  summary onto the Weekly Dashboard / Monthly Dashboard tabs.
 *  - Color-graded Answer Rate column (red -> amber -> green)
 *  - Native embedded column chart + pie chart
 *  - Banded (zebra-striped) agent table
 * =====================================================================
 */

function buildWeeklyDashboardNow() {
  verifyIntegrity_();
  const data = buildReportData_(CONFIG.SHEETS.WEEKLY_RAW);
  writeDashboard_(CONFIG.SHEETS.WEEKLY_DASHBOARD, data, 'Weekly');
  SpreadsheetApp.getUi().alert('Weekly Dashboard updated ✅');
  return data;
}

function buildMonthlyDashboardNow() {
  verifyIntegrity_();
  const data = buildReportData_(CONFIG.SHEETS.MONTHLY_RAW);
  writeDashboard_(CONFIG.SHEETS.MONTHLY_DASHBOARD, data, 'Monthly');
  SpreadsheetApp.getUi().alert('Monthly Dashboard updated ✅');
  return data;
}

function writeDashboard_(sheetName, data, label) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(sheetName);
  if (!sh) sh = ss.insertSheet(sheetName);
  sh.clear();
  sh.clearFormats();
  sh.getCharts().forEach(function(c) { sh.removeChart(c); }); // clear old charts before rebuilding

  const B = CONFIG.BRAND;
  const periodText = periodLabel_(data);

  let row = 1;
  sh.getRange(row, 1, 1, 9).merge().setValue('📊  ' + B.NAME + ' — ' + label + ' IVR Calling Report')
    .setFontSize(18).setFontWeight('bold').setFontColor('#FFFFFF').setBackground(B.COLOR_NAVY)
    .setHorizontalAlignment('left').setVerticalAlignment('middle');
  sh.setRowHeight(row, 40);
  row++;
  sh.getRange(row, 1, 1, 9).merge().setValue(periodText + '   ·   Generated ' + formatDate_(new Date(), 'dd MMM yyyy, hh:mm a'))
    .setFontColor(B.COLOR_GREY).setFontStyle('italic').setBackground('#F4F6FB');
  row += 2;

  // ---- KPI cards (colored left-accent bar + big number) -----------------
  const answerRate = data.totals.overall ? Math.round((data.totals.answered / data.totals.overall) * 1000) / 10 : 0;
  const kpis = [
    ['Total Inbound Calls', data.totals.overall, B.COLOR_NAVY],
    ['Answered', data.totals.answered, B.COLOR_GREEN],
    ['Answer Rate', answerRate + '%', answerRate >= 70 ? B.COLOR_GREEN : (answerRate >= 50 ? B.COLOR_AMBER : B.COLOR_RED)],
    ['Missed', data.totals.missed, B.COLOR_RED],
    ['No Answer / Busy / Failed', data.totals.noAnswer + data.totals.busy + data.totals.failed, B.COLOR_AMBER],
    ['Outgoing Calls', data.totals.outgoing, B.COLOR_BLUE]
  ];
  const kpiStartRow = row;
  kpis.forEach(function(kpi, i) {
    const c = 1 + (i % 3) * 3;
    const r = kpiStartRow + Math.floor(i / 3) * 3;
    // colored accent strip
    sh.getRange(r, c, 2, 1).merge().setBackground(kpi[2]);
    sh.getRange(r, c + 1, 1, 2).merge().setValue(kpi[0]).setFontSize(9).setFontColor(B.COLOR_GREY)
      .setBackground('#F8FAFF').setWrap(true).setVerticalAlignment('bottom');
    sh.getRange(r + 1, c + 1, 1, 2).merge().setValue(kpi[1]).setFontSize(22).setFontWeight('bold')
      .setFontColor(B.COLOR_NAVY).setBackground('#F8FAFF').setVerticalAlignment('top');
  });
  row = kpiStartRow + 7;

  if (data.unmapped.length) {
    sh.getRange(row, 1, 1, 9).merge()
      .setValue('⚠ ' + data.unmapped.length + ' agent name(s) not found in "Agent Mapping" tab — update it so these roll up correctly: ' + data.unmapped.join(', '))
      .setFontColor('#B54708').setBackground('#FFFAEB').setWrap(true);
    sh.setRowHeight(row, 34);
    row += 2;
  }

  // ---- Agent table --------------------------------------------------------
  sh.getRange(row, 1).setValue('Agent-wise Performance').setFontSize(13).setFontWeight('bold').setFontColor(B.COLOR_NAVY);
  row++;
  const headers = ['Agent', 'Overall Calls', 'Answered', 'Missed Calls', 'No Answer', 'Busy', 'Failed', 'Outgoing Calls', 'Answer Rate'];
  sh.getRange(row, 1, 1, headers.length).setValues([headers])
    .setFontWeight('bold').setFontColor('#FFFFFF').setBackground(B.COLOR_BLUE);
  row++;
  const tableStart = row;

  data.agents.forEach(function(a) {
    const rate = a.overall ? Math.round((a.answered / a.overall) * 1000) / 10 : 0;
    sh.getRange(row, 1, 1, 9).setValues([[a.name, a.overall, a.answered, a.missed, a.noAnswer, a.busy, a.failed, a.outgoing, rate / 100]]);
    if (!a.mapped) sh.getRange(row, 1).setFontColor('#B54708');
    row++;
  });
  const tableEnd = row - 1;

  sh.getRange(row, 1, 1, 9).setValues([[
    'Total', data.totals.overall, data.totals.answered, data.totals.missed, data.totals.noAnswer,
    data.totals.busy, data.totals.failed, data.totals.outgoing, data.totals.overall ? (data.totals.answered / data.totals.overall) : 0
  ]]).setFontWeight('bold').setBackground(B.COLOR_BLUE_LIGHT);
  const totalRow = row;

  // Format Answer Rate column as %, color-graded red -> amber -> green
  const rateRange = sh.getRange(tableStart, 9, tableEnd - tableStart + 1, 1);
  rateRange.setNumberFormat('0.0%');
  sh.getRange(totalRow, 9).setNumberFormat('0.0%');

  const rules = sh.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .setGradientMinpoint('#E5484D')
    .setGradientMidpointWithValue('#F5A524', SpreadsheetApp.InterpolationType.NUMBER, '0.5')
    .setGradientMaxpoint('#1B9E6B')
    .setRanges([rateRange])
    .build());
  sh.setConditionalFormatRules(rules);

  // Zebra-striped banding on the agent table (native Sheets banding)
  const tableRange = sh.getRange(tableStart - 1, 1, tableEnd - tableStart + 2, 9);
  try { tableRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_BLUE, true, false); } catch (e) { /* already banded */ }

  sh.getRange(tableStart - 1, 1, tableEnd - tableStart + 3, 9)
    .setBorder(true, true, true, true, true, true, '#D0D5DD', SpreadsheetApp.BorderStyle.SOLID);
  sh.autoResizeColumns(1, 9);
  sh.setFrozenRows(tableStart - 1);

  row = totalRow + 2;

  // ---- Native charts --------------------------------------------------
  if (data.agents.length) {
    // Column chart: Overall / Answered / Missed per agent
    const chartDataRange = sh.getRange(tableStart - 1, 1, tableEnd - tableStart + 2, 4); // Agent, Overall, Answered, Missed
    const colChart = sh.newChart()
      .asColumnChart()
      .addRange(chartDataRange)
      .setNumHeaders(1)
      .setPosition(row, 1, 0, 0)
      .setOption('title', 'Calls by Agent — Overall vs Answered vs Missed')
      .setOption('titleTextStyle', { color: B.COLOR_NAVY, fontSize: 13, bold: true })
      .setOption('colors', [B.COLOR_NAVY, B.COLOR_GREEN, B.COLOR_RED])
      .setOption('legend', { position: 'top' })
      .setOption('width', 560)
      .setOption('height', 320)
      .build();
    sh.insertChart(colChart);

    // Pie chart: outcome distribution
    const pieHelperRow = row;
    sh.getRange(pieHelperRow, 6, 6, 2).setValues([
      ['Outcome', 'Count'],
      ['Answered', data.totals.answered],
      ['Missed', data.totals.missed],
      ['No Answer', data.totals.noAnswer],
      ['Busy', data.totals.busy],
      ['Failed', data.totals.failed]
    ]);
    const pieRange = sh.getRange(pieHelperRow, 6, 6, 2);
    const pieChart = sh.newChart()
      .asPieChart()
      .addRange(pieRange)
      .setNumHeaders(1)
      .setPosition(row, 6, 0, 0)
      .setOption('title', 'Call Outcome Distribution')
      .setOption('titleTextStyle', { color: B.COLOR_NAVY, fontSize: 13, bold: true })
      .setOption('colors', [B.COLOR_GREEN, B.COLOR_RED, B.COLOR_AMBER, '#F5A524', '#B54708'])
      .setOption('pieHole', 0.45)
      .setOption('width', 400)
      .setOption('height', 320)
      .build();
    sh.insertChart(pieChart);
  }

  row += 18; // leave room below the two charts
  sh.getRange(row, 1, 1, 9).merge()
    .setValue('Powered by ' + CREATOR.NAME + ' (' + CREATOR.NICKNAME + ')  \u00B7  ' + CREATOR.GITHUB)
    .setFontSize(9).setFontColor('#98A2B3').setFontStyle('italic');
}


function periodLabel_(data) {
  if (data.periodStart && data.periodEnd) {
    return formatDate_(data.periodStart, 'dd-MM-yyyy') + '  to  ' + formatDate_(data.periodEnd, 'dd-MM-yyyy');
  }
  return 'Period could not be auto-detected from Start Time column — check raw data.';
}
