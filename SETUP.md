# Automatic report delivery setup

The exam and report page are ready to use with a Google Apps Script Web App. The Web App sends each report to **kabyanilk@gmail.com** as both the email body and a `.txt` attachment. The first time it runs, Google asks the account owner to authorize sending email.

## 1. Create the script

1. Sign in to the Google account that should send the exam emails.
2. Open [Google Apps Script](https://script.google.com/home) and create a new project.
3. Replace the contents of `Code.gs` with `Gmail_Report_Apps_Script.gs` from this package.
4. Save the project.

The script's access key must match the `APPS_SCRIPT_ACCESS_KEY` value already in `thermal-report-mailer.html`:

`TEIC-2026-Exam-Report-Key-r9F4cT8p2Lm7Xq1B`

## 2. Deploy as a Web App

1. Select **Deploy → New deployment**.
2. Choose **Web app** as the deployment type.
3. Set **Execute as** to your Google account.
4. Set **Who has access** to **Anyone** so student devices can submit reports without signing into your account.
5. Select **Deploy** and complete Google's authorization prompt for sending email.
6. Copy the Web App URL ending in `/exec`. The configured deployment ID is `AKfycbxuFwlG9rtwmZz2Hp2u3y5ZdhxpdlK55gK8-ILG2l4bhGdheUrWBtte2b2DO_YHcdqq`.

**Access note:** “Anyone” makes the endpoint internet-accessible. The script only sends to the fixed examiner address, checks the report key, rejects duplicate attempt IDs, and caps delivery at 100 reports per UTC day. The key is present in the student-facing HTML, so it is a deterrent rather than a secret. Anyone who obtains the page and key could submit reports to the fixed address until the daily cap is reached.

## 3. Add the deployed URL

Open `thermal-report-mailer.html` in a text editor. Find:

`APPS_SCRIPT_ENDPOINT="PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE"`

The `/exec` URL is already set in this package. If you create a replacement deployment, update the APPS_SCRIPT_ENDPOINT value and save the file. Keep `thermal-engineering-exam.html` and `thermal-report-mailer.html` in the same folder and distribute both files to students. The Apps Script source can be kept by the examiner; students do not need it.

The submission screen downloads the local report and opens the report page. Once configured, that page automatically posts the report to the Web App, which emails it to the examiner. If automatic delivery fails, the page provides the Gmail draft fallback.

## Report contents

Each email contains the complete plain-text report and an attachment named `Exam_Report_<roll-number>.txt`, including the student's name and roll number, score, responses, anti-cheating events, and browser details.

