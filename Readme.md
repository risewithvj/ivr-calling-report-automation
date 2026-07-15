<div align="center">

# 📞 IVR Calling Report Automation — Exotel + Google Sheets + Apps Script

### Turn raw Exotel IVR call logs into branded, auto-emailed Weekly & Monthly reports — zero manual work, zero cost, 100% Google Sheets + Apps Script.

[![Made with Google Apps Script](https://img.shields.io/badge/Made%20with-Google%20Apps%20Script-4285F4?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/apps-script)
[![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=flat-square&logo=googlesheets&logoColor=white)](https://sheets.google.com)
[![Exotel IVR](https://img.shields.io/badge/Exotel-IVR%20Compatible-FF6B00?style=flat-square)](https://exotel.com)
[![License: MIT+Attribution](https://img.shields.io/badge/License-MIT%20%2B%20Attribution-blue?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](./SUPPORT.md)
[![Maintained by risewithvj](https://img.shields.io/badge/Maintained%20by-risewithvj-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vijayakumarl/)

**Keywords:** IVR Calling Report · Exotel IVR Report · Exotel Call Report Automation · Google Sheets IVR Dashboard · Apps Script Email Automation · Call Center Analytics · HR Tech Automation · Agent Performance Dashboard

<br>

<!-- REPLACE THE LINK BELOW with your own ready-to-copy Google Sheet template link -->
[![Get the Ready-Built Google Sheet](https://img.shields.io/badge/📊_Get_the_Ready--Built_Google_Sheet-Click_to_Copy_Template-1657FF?style=for-the-badge)](#)
<!-- Paste your published Google Sheet template link in place of the # above -->

[![Star this repo](https://img.shields.io/github/stars/risewithvj/ivr-calling-report-automation?style=for-the-badge&color=FFD700)](https://github.com/risewithvj)
[![Report an Issue](https://img.shields.io/badge/Report_an_Issue-Contact_Creator-E5484D?style=for-the-badge)](https://github.com/risewithvj)
[![Email Support](https://img.shields.io/badge/Email_Support-risewithvj%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:risewithvj@gmail.com)

</div>

---

## What this is

If your team pulls **Exotel IVR call logs** every week and manually builds a summary table (Agent / Overall Calls / Answered / Missed / No Answer / Busy / Failed) to email leadership — this replaces that entire manual process.

Paste the raw Exotel export into a Google Sheet. This system does the rest:

- Auto-aggregates raw call-detail rows into per-agent stats
- Auto-skips stray header rows pasted in by accident — no data cleanup needed
- Builds an in-sheet dashboard with real charts, color-graded performance, banded rows
- Sends a branded, mobile-responsive HTML email report automatically
- Runs itself on schedule — **every Sunday** (weekly) and **the 1st of every month** (monthly)
- Handles agent roster changes automatically — no code edits when staff join or leave
- 100% Google Sheets + Apps Script — no paid tools, no external hosting, no servers

---

## Preview

> Add screenshots of your own dashboard/email here once you've customized it —
> a picture converts way better than a wall of text.

| In-Sheet Dashboard | Emailed HTML Report |
|---|---|
| _add screenshot_ | _add screenshot_ |

---

## Table of Contents

- [Features](#features)
- [How it works](#how-it-works)
- [Quick Start](#quick-start)
- [Customizing your branding](#customizing-your-branding)
- [Understanding the Exotel raw export](#understanding-the-exotel-raw-export)
- [Agent Mapping — handling roster changes](#agent-mapping--handling-roster-changes)
- [FAQ & Troubleshooting](#faq--troubleshooting)
- [Tech stack](#tech-stack)
- [Roadmap](#roadmap)
- [Support & Contact](#support--contact)
- [License](#license)

---

## Features

| Feature | Details |
|---|---|
| **Raw data ingestion** | Paste Exotel's raw CDR export directly — no reformatting, no manual summarizing |
| **Automatic classification** | Maps Exotel's outcome codes (`completed`, `no-answer`, `busy`, `failed`, `canceled`) to clean report buckets |
| **Self-healing parser** | Automatically detects and skips stray header rows accidentally pasted with the data |
| **Agent name mapping** | Translate raw Exotel agent identifiers into clean display names — maintained in-sheet, no code edits |
| **New/departed agent handling** | New agents are flagged (not dropped); departed agents simply stop appearing — fully automatic |
| **Native charts** | Column chart + donut chart embedded directly in the Sheet dashboard |
| **Color-graded scoring** | Answer Rate column auto-shades red → amber → green |
| **Branded HTML email** | Rounded KPI cards, color-coded stats, progress bars, your logo, your brand colors |
| **Mobile-responsive email** | Table-based HTML built for Gmail/Outlook/Apple Mail compatibility, tested down to phone width |
| **Fully automatic scheduling** | Time-based triggers — Sunday 7 PM weekly, 1st-of-month 10 AM monthly |
| **Zero cost, zero hosting** | Runs entirely inside your own Google account — no external server or subscription |

---

## How it works

```
Exotel Dashboard
      |  (export raw CDR as CSV)
      v
Google Sheet "Weekly Raw" / "Monthly Raw" tab
      |  (you paste it in -- that's the only manual step)
      v
Apps Script Parser  --->  per-agent aggregation, using "Agent Mapping" tab
      |
      +--->  "Weekly/Monthly Dashboard" tab   (native charts, color grading)
      |
      +--->  Branded HTML email  --->  sent via Gmail to "Report Config" recipients
                                        (automatically, on schedule)
```

---

## Quick Start

### 1. Create your Google Sheet
Go to [sheets.google.com](https://sheets.google.com) → Blank spreadsheet.

### 2. Add the Apps Script code
In the Sheet: **Extensions ▸ Apps Script**. Delete the default file content.

Create each of these files (drop the leading number and `.gs` when naming — e.g. `1_Config.gs` becomes a file literally named `Config`), and paste in the matching content from the [`apps-script/`](./apps-script) folder, **in this order**:

| # | File name to create | Source file |
|---|---|---|
| 0 | `Integrity` | [`0_Integrity.gs`](./apps-script/0_Integrity.gs) |
| 1 | `Config` | [`1_Config.gs`](./apps-script/1_Config.gs) |
| 2 | `Logo` | [`2_Logo.gs`](./apps-script/2_Logo.gs) |
| 3 | `SetupSheets` | [`3_SetupSheets.gs`](./apps-script/3_SetupSheets.gs) |
| 4 | `Parser` | [`4_Parser.gs`](./apps-script/4_Parser.gs) |
| 5 | `Dashboard` | [`5_Dashboard.gs`](./apps-script/5_Dashboard.gs) |
| 6 | `EmailTemplate` | [`6_EmailTemplate.gs`](./apps-script/6_EmailTemplate.gs) |
| 7 | `Send` | [`7_Send.gs`](./apps-script/7_Send.gs) |
| 8 | `Triggers` | [`8_Triggers.gs`](./apps-script/8_Triggers.gs) |

**Tip:** paste and save (Ctrl+S) one file at a time, checking for a red error marker before moving to the next — this makes any copy/paste issue instantly obvious instead of hunting through all 9 files at the end.

### 3. Authorize the script
In the Apps Script editor, select `onOpen` from the function dropdown at the top → click **Run**. Approve the permissions prompt (click through "Advanced" → "Go to project (unsafe)" → "Allow" — this is normal for your own private script).

### 4. Initialize the sheet structure
Back in the Sheet, refresh the page. A new **IVR Reports** menu appears.
Click **IVR Reports ▸ 1. Initialize Sheet Structure**.

This creates 7 tabs: `Weekly Raw`, `Weekly Dashboard`, `Monthly Raw`, `Monthly Dashboard`, `Agent Mapping`, `Report Config`, `Support & Credits`.

### 5. Configure it
- **Report Config** tab: set your Company Name, recipient emails, sender display name.
- **Agent Mapping** tab: replace the example rows with your real agents (raw Exotel name → display name).

### 6. Test it
- Paste a raw Exotel export into `Weekly Raw`.
- **IVR Reports ▸ Build Weekly Dashboard Now** — check the dashboard tab.
- **IVR Reports ▸ Send Weekly Report Now** — check your inbox for the real email.

### 7. Turn on autopilot
**IVR Reports ▸ 2. Install Automatic Schedule** — from now on it sends itself every Sunday ~7 PM and the 1st of every month ~10 AM, using whatever is currently pasted into the Raw tabs.

---

## Customizing your branding

Everything visual lives in one place — edit the `BRAND` block at the top of `Config.gs`:

```javascript
BRAND: {
  NAME: 'Your Company Name',
  TAGLINE: 'Your Tagline Here',
  COLOR_NAVY:   '#0A2A55',
  COLOR_BLUE:   '#1657FF',
  ...
}
```

**To use your own logo:** convert your logo PNG to base64 ([base64-image.de](https://www.base64-image.de/) or any base64 encoder), then replace the `LOGO_BASE64` constant in `Logo.gs` with your string. The email embeds it as an inline attachment (`cid:`), so it works with no external image hosting.

---

## Understanding the Exotel raw export

Exotel's raw CDR export has no header row and a fixed column order. The relevant columns (0-indexed) are configured in `Config.gs` under `RAW_COLUMNS` — if Exotel changes their export format, this is the only place that needs updating:

| Column index | Field |
|---|---|
| 1 | Direction (`inbound` / `outbound`) |
| 7 | Agent Name |
| 8 | Status |
| 9 | Start Time |
| 19 | Outcome (`completed` / `no-answer` / `busy` / `failed` / `canceled`) |

Full reasoning and how each outcome maps to a report bucket is documented in [`PROJECT_BRAIN.md`](./PROJECT_BRAIN.md).

---

## Agent Mapping — handling roster changes

- **Agent leaves the team:** disappears from future reports automatically — no manual removal needed.
- **New agent added:** shows up automatically with real numbers, flagged as `Unmapped: <raw name>` until you add a row to `Agent Mapping` translating their raw Exotel name into a display name. Nothing is ever silently dropped.

---

## FAQ & Troubleshooting

<details>
<summary><b>Apps Script says "No functions" in the dropdown</b></summary>
<br>
A syntax error somewhere broke parsing for the whole project. Paste and save each file one at a time, checking for a red error marker before moving to the next.
</details>

<details>
<summary><b>"An unknown error has occurred, please try again later." when clicking a menu item</b></summary>
<br>
Usually a permissions issue — menu items can't trigger the OAuth consent screen the first time. Run the function directly from the Apps Script editor's Run button once to authorize, then the menu works normally.
</details>

<details>
<summary><b>Same error, but I already authorized</b></summary>
<br>
Check the browser tab URL. If your Apps Script project is a standalone project (created from script.google.com directly, title says "Untitled project," no spreadsheet icon), it can't access the Sheet. Always open Apps Script via <b>Extensions ▸ Apps Script</b> from inside the target Sheet.
</details>

<details>
<summary><b>A stray header row is showing up as an "agent"</b></summary>
<br>
This is already handled automatically — the parser detects and skips rows matching known Exotel column-label text (e.g. a literal "ToName" or "Status" cell). No manual sheet editing needed.
</details>

<details>
<summary><b>Email corners look sharp instead of rounded</b></summary>
<br>
This template uses <code>&lt;div&gt;</code>-based boxes specifically because <code>border-radius</code> on <code>&lt;table&gt;</code>/<code>&lt;td&gt;</code> elements renders inconsistently in Gmail. If you've customized <code>EmailTemplate.gs</code> and lost the rounded corners, check that box styling is on a <code>&lt;div&gt;</code>, not a table cell.
</details>

<details>
<summary><b>I get a "Code Tampered / Modified" popup</b></summary>
<br>
The creator attribution constants in <code>Integrity.gs</code> were changed or removed. Restore the original <code>CREATOR</code> object, or re-download a fresh copy of that file from this repo.
</details>

More detail on every one of these (including root causes) in [`PROJECT_BRAIN.md`](./PROJECT_BRAIN.md).

---

## Tech stack

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat-square&logo=google&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=flat-square&logo=googlesheets&logoColor=white)
![Gmail API](https://img.shields.io/badge/Gmail%20API-D14836?style=flat-square&logo=gmail&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

- Google Sheets — data store + in-sheet dashboard
- Google Apps Script (V8 runtime) — all logic, no external server
- `GmailApp` — email sending via the account owner's own Gmail
- Native Sheets Charts API — column + donut charts
- Pure table-based HTML/CSS — no JS, no external assets (logo is base64-embedded)

---

## Roadmap

- [ ] Week-over-week / month-over-month trend comparison in the email
- [ ] Direct Exotel API integration (auto-fetch instead of manual paste)
- [ ] Slack/Teams delivery option alongside email
- [ ] Multi-department support (separate dashboards per queue/group)

Have an idea? [Open an issue](https://github.com/risewithvj) or reach out directly — see below.

---

## Support & Contact

<div align="center">

**Built and maintained by Vijaya Kumar L**

[![GitHub](https://img.shields.io/badge/GitHub-risewithvj-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/risewithvj)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-vijayakumarl-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vijayakumarl/)
[![Email](https://img.shields.io/badge/Email-risewithvj%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:risewithvj@gmail.com)

Found a bug, need help setting this up, or want a custom version for your own IVR platform?
Reach out — see [`SUPPORT.md`](./SUPPORT.md) for the full support guide.

If this saved you time, a star on the repo goes a long way.

</div>

---

## License

MIT License with an attribution requirement — free to use and customize for your own organization, with creator attribution kept intact. Full terms in [`LICENSE`](./LICENSE).

---

<div align="center">

*Built for teams who'd rather automate a Sunday-night report than write one.*

</div>
