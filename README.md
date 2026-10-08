# Thermal Engineering IC Engine Exam

A standalone, mobile-friendly 20-mark exam with a 36-minute timer, answer grading, a submission report, and monitoring notices. The report page can send each report to `kabyanilk@gmail.com` through the included Google Apps Script Web App.

## Project files

```text
.
├── index.html                      # Exam start, exam, and submission screens
├── thermal-report-mailer.html      # Receives a report and sends it to Apps Script
├── apps-script/
│   ├── Code.gs                     # Email delivery endpoint
│   └── SETUP.md                    # Apps Script deployment and authorization
├── .gitignore
└── .nojekyll
```

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder to its root.
2. In the repository, open **Settings → Pages**.
3. Choose deployment from the `main` branch and the `/ (root)` folder, then save.
4. Wait for GitHub Pages to publish the site. Open the published page and test the start screen before sharing it.

The exam opens `thermal-report-mailer.html` as a sibling page, so keep both HTML files in the repository root. The Apps Script endpoint URL is configured in the mailer page.

## Email delivery

The Apps Script backend is in [`apps-script/Code.gs`](apps-script/Code.gs). Follow [`apps-script/SETUP.md`](apps-script/SETUP.md) to deploy or replace the Web App. It emails the report to the fixed address and attaches the same report as a text file.

## Important privacy and exam limitations

- A public GitHub Pages site exposes its HTML and JavaScript to visitors. The correct answers are part of the exam page source, so this static version is suitable for practice or low-stakes exams, not a secure high-stakes assessment.
- The Apps Script endpoint is publicly reachable so students can submit from their devices. The access key in the page source is visible to students; server-side limits and duplicate-attempt checks reduce accidental or casual abuse, but this is not strong authentication.
- Submitted reports contain student names, roll numbers, responses, scores, browser details, and monitoring events. Share the site only with intended students and handle reports accordingly.
- Mobile browsers do not expose every app switch, screenshot, or overlay to a webpage. Monitoring notices are not proof of misconduct and do not change marks.

## Local use

Open `index.html` in a modern browser. For report emailing, keep `thermal-report-mailer.html` in the same directory. Browser security settings may affect local-file navigation; GitHub Pages is the intended hosted setup.
