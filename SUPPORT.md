# Support

## Get help

- **Issues / bugs:** [Open an issue on GitHub](https://github.com/risewithvj) describing what happened, which step you were on, and a screenshot if possible.
- **Setup questions:** Check [`README.md`](./README.md) first (Setup, FAQ, and Troubleshooting sections) -- most first-time issues are covered there.
- **Deep dive on why something was built a certain way:** See [`PROJECT_BRAIN.md`](./PROJECT_BRAIN.md) -- a full build log of every design decision and bug fix from the original build.
- **Direct contact:** risewithvj@gmail.com

## Before opening an issue, please check

1. Did you paste all script files into an Apps Script project opened **from inside the Sheet** (Extensions > Apps Script), not a standalone project at script.google.com? (Standalone projects can't access the spreadsheet and most functions will fail.)
2. Did you run `onOpen` (or any menu item) once directly from the Apps Script editor's Run button first, to grant permissions? Menu items can't trigger the authorization popup themselves the first time.
3. Is the "Agent Mapping" tab filled in with your real agent names?
4. Is "Report Config" filled in with real recipient email addresses?

## Found this useful?

- Star the repo -- it helps others find it.
- Connect on [LinkedIn](https://www.linkedin.com/in/vijayakumarl/) or follow on [GitHub](https://github.com/risewithvj).
- Consider leaving the attribution footer/credit intact when you deploy your own copy (see [`LICENSE`](./LICENSE)) -- it's how a free, maintained template like this stays worth maintaining.

## Maintainer

**Vijaya Kumar L** (risewithvj)
[GitHub](https://github.com/risewithvj) - [LinkedIn](https://www.linkedin.com/in/vijayakumarl/) - risewithvj@gmail.com
