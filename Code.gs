/**
 * Thermal Engineering report mailer.
 * Deploy as a web app that executes as the owner's Google account.
 * The destination is fixed to the examiner's address.
 */
const DESTINATION_EMAIL = "kabyanilk@gmail.com";
const ACCESS_KEY = "TEIC-2026-Exam-Report-Key-r9F4cT8p2Lm7Xq1B";
const MAX_REPORTS_PER_DAY = 100;
const MAX_REPORT_LENGTH = 40000;

function doGet() {
  return HtmlService.createHtmlOutput(
    "<h2>Thermal Engineering report endpoint is ready.</h2><p>Use the exam report page to submit a report.</p>"
  );
}

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    if (!constantTimeEquals_(String(params.accessKey || ""), ACCESS_KEY)) {
      return resultPage_({ ok: false, message: "The report access key was rejected." });
    }

    let payload;
    try {
      payload = JSON.parse(String(params.payload || ""));
    } catch (_) {
      return resultPage_({ ok: false, message: "The report data was not valid JSON." });
    }

    const report = String(payload.report || "").trim();
    const attemptId = String(payload.attemptId || "").trim().slice(0, 100);
    const rollNumber = String(payload.rollNumber || "").trim().slice(0, 80);
    if (!report || report.length > MAX_REPORT_LENGTH ||
        !report.includes("SECURE EXAMINATION REPORT") || !attemptId || !rollNumber) {
      return resultPage_({ ok: false, message: "The report is incomplete or exceeds the size limit." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const props = PropertiesService.getScriptProperties();
      const recent = JSON.parse(props.getProperty("recentAttempts") || "[]");
      if (recent.indexOf(attemptId) !== -1) {
        return resultPage_({ ok: true, duplicate: true, message: "This report was already received." });
      }

      const day = Utilities.formatDate(new Date(), "UTC", "yyyyMMdd");
      const countKey = "reportCount_" + day;
      const count = Number(props.getProperty(countKey) || 0);
      if (count >= MAX_REPORTS_PER_DAY) {
        return resultPage_({ ok: false, message: "The daily report limit has been reached." });
      }

      const filename = "Exam_Report_" + rollNumber.replace(/[^a-z0-9_-]/gi, "_") + ".txt";
      MailApp.sendEmail({
        to: DESTINATION_EMAIL,
        subject: "Thermal Engineering Exam Report — " + rollNumber,
        body: report,
        attachments: [Utilities.newBlob(report, "text/plain", filename)]
      });

      recent.push(attemptId);
      props.setProperty("recentAttempts", JSON.stringify(recent.slice(-500)));
      props.setProperty(countKey, String(count + 1));
      return resultPage_({ ok: true, message: "Report emailed successfully." });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return resultPage_({ ok: false, message: "Email delivery failed: " + String(err && err.message || err) });
  }
}

function resultPage_(result) {
  const safeJson = JSON.stringify(result).replace(/</g, "\\u003c");
  const html = "<!doctype html><meta charset=\"utf-8\"><script>parent.postMessage(" +
    safeJson + ", '*');</script><p>Report request processed.</p>";
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}
