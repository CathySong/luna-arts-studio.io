/**
 * Luna Art Studio — Registration Confirmation Email
 * -------------------------------------------------
 * Sends an automatic confirmation email to the registrant (and a copy to the
 * studio) whenever someone submits the "Luna Art Studio – 2026–2027 Art Class
 * Registration" Google Form.
 *
 * INSTALL (one-time):
 *  1. Open the Google Form → ⋮ menu → Script editor
 *  2. Delete placeholder code, paste this entire file, Save (💾)
 *  3. Run testWithFakeData() once to grant Gmail permissions
 *  4. Triggers (clock icon) → + Add Trigger →
 *       Function: onFormSubmit | Event source: From form | Event type: On form submit
 *  5. Test by submitting the live form with a real email address
 */

// ─── CONFIG ────────────────────────────────────────────────────────────────
var CONFIG = {
  studioName:    "Luna Art Studio",
  studioEmail:   "Ninglu1088@gmail.com",
  studioPhone:   "+1 732-718-0639",
  studioWeChat:  "happyevan999",
  studioAddress: "258 King George Rd (2nd floor, middle door), Warren, NJ 07059",
  zellePayTo:    "7327180639",
  session1:      { label: "Session 1: Sep 9 – Nov 7",   rate: 360 },
  session2:      { label: "Session 2: Nov 11 – Feb 6",  rate: 400 },
  privateLessonRate: "$85/hour",
  replyTo:       "Ninglu1088@gmail.com",
};

// ─── MAIN TRIGGER ──────────────────────────────────────────────────────────
function onFormSubmit(e) {
  // Build a namedValues-style map from e.response (most reliable)
  // e.namedValues can be undefined if the trigger fires from a linked sheet
  // or when run manually — e.response.getItemResponses() always works.
  var v = {};

  if (!e) {
    Logger.log("No event object — run testWithFakeData() to test manually.");
    return;
  }

  if (e.response) {
    // Primary: use FormResponse (always present in form-bound onFormSubmit)
    var itemResponses = e.response.getItemResponses();
    for (var i = 0; i < itemResponses.length; i++) {
      var ir = itemResponses[i];
      var title  = ir.getItem().getTitle();
      var answer = ir.getResponse();
      // Checkbox questions return arrays; all others return strings
      v[title] = Array.isArray(answer) ? answer : [String(answer)];
    }
  } else if (e.namedValues) {
    // Fallback: namedValues object
    v = e.namedValues;
  } else {
    Logger.log("Event has neither .response nor .namedValues — cannot proceed.");
    return;
  }

  // ── Pull answers ──────────────────────────────────────────────────────────
  function get(label)    { return (v[label] && v[label][0]) ? String(v[label][0]).trim() : ""; }
  function getAll(label) { return v[label] ? v[label].filter(function(x){ return !!x; }) : []; }

  var studentName   = get("Student Name");
  var age           = get("Age");
  var parentName    = get("Parent/Guardian Name");
  var phone         = get("Phone Number");
  var email         = get("Email Address");
  var classes       = getAll("Select a Class");
  var sessionChoice = get("Select Session");
  var paymentMethod = get("Payment Method") || ("Zelle — Pay to " + CONFIG.zellePayTo);
  var notes         = get("Allergies or Special Notes");
  var comments      = get("Additional Comments or Questions");

  var hasPrivateLesson = classes.some(function(c){ return c.indexOf("Private Lesson") !== -1; });
  var groupClasses     = classes.filter(function(c){ return c.indexOf("Private Lesson") === -1; });

  var data = {
    studentName: studentName, age: age, parentName: parentName, phone: phone,
    email: email, groupClasses: groupClasses, hasPrivateLesson: hasPrivateLesson,
    sessionChoice: sessionChoice, paymentMethod: paymentMethod, notes: notes, comments: comments,
  };

  var html = buildHtml_(data);
  var text = buildText_(data);

  // 1) Confirmation to registrant (only if email provided)
  if (email) {
    MailApp.sendEmail({
      to:       email,
      replyTo:  CONFIG.replyTo,
      subject:  "You're Registered! " + CONFIG.studioName + " – " + (studentName || "New Student"),
      htmlBody: html,
      body:     text,
      name:     CONFIG.studioName,
    });
  }

  // 2) Internal copy to studio (always)
  MailApp.sendEmail({
    to:       CONFIG.studioEmail,
    replyTo:  email || CONFIG.replyTo,
    subject:  "New Registration: " + (studentName || "Unnamed") + " (" + (parentName || "no parent name") + ")",
    htmlBody: "<p><b>New form submission received.</b></p>" + html,
    body:     text,
    name:     CONFIG.studioName + " Website",
  });

  Logger.log("Emails sent. Student: " + studentName + " | Email: " + (email || "none provided"));
}

// ─── HTML EMAIL ────────────────────────────────────────────────────────────
function buildHtml_(d) {
  var classListHtml = d.groupClasses.length
    ? '<ul style="margin:0 0 12px 20px;padding:0;">' +
        d.groupClasses.map(function(c){
          return '<li style="margin-bottom:4px;">' + esc_(c) + '</li>';
        }).join("") + '</ul>'
    : '<p style="margin:0 0 12px;color:#666;">No group class selected.</p>';

  var privateLessonHtml = d.hasPrivateLesson
    ? '<p style="margin:0 0 12px;">📌 <b>Private Lesson requested</b> — our team will contact you to schedule (' + CONFIG.privateLessonRate + ').</p>'
    : "";

  var paymentHtml = (d.paymentMethod.indexOf("Zelle") !== -1)
    ? '<p style="margin:0 0 4px;"><b>Payment:</b> Zelle to <b>' + CONFIG.zellePayTo + '</b></p>'
    : '<p style="margin:0 0 4px;"><b>Payment:</b> Cash — pay in person at the studio</p>';

  return '\
<div style="font-family:Georgia,\'Times New Roman\',serif;max-width:560px;margin:0 auto;color:#2b2b2b;">\
  <div style="background:#c4785a;color:#fff;padding:24px 28px;border-radius:8px 8px 0 0;">\
    <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:.85;">' + CONFIG.studioName + '</p>\
    <h1 style="margin:6px 0 0;font-size:24px;font-weight:600;">Registration Confirmed 🎨</h1>\
  </div>\
  <div style="border:1px solid #eee;border-top:none;padding:28px;border-radius:0 0 8px 8px;">\
    <p style="margin:0 0 16px;font-size:15px;">Hi ' + esc_(d.parentName || "there") + ',</p>\
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;">\
      Thank you for registering <b>' + esc_(d.studentName || "your student") + '</b>\
      for classes at ' + CONFIG.studioName + '! We\'ve received your submission and this email confirms the details below.\
    </p>\
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;">\
      <tr><td style="padding:6px 0;color:#888;width:150px;">Student</td><td style="padding:6px 0;"><b>' + esc_(d.studentName) + '</b> (Age ' + esc_(d.age) + ')</td></tr>\
      <tr><td style="padding:6px 0;color:#888;">Parent/Guardian</td><td style="padding:6px 0;">' + esc_(d.parentName) + '</td></tr>\
      <tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;">' + esc_(d.phone) + '</td></tr>\
      <tr><td style="padding:6px 0;color:#888;vertical-align:top;">Class(es)</td><td style="padding:6px 0;">' + classListHtml + '</td></tr>\
      <tr><td style="padding:6px 0;color:#888;">Session</td><td style="padding:6px 0;">' + esc_(d.sessionChoice) + '</td></tr>\
    </table>\
    ' + privateLessonHtml + '\
    <div style="background:#faf7f2;border-radius:6px;padding:14px 18px;margin-bottom:20px;">\
      <p style="margin:0 0 4px;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:1px;">Tuition Rates</p>\
      <p style="margin:0 0 2px;font-size:14px;">' + CONFIG.session1.label + ' — $' + CONFIG.session1.rate + '/class</p>\
      <p style="margin:0 0 8px;font-size:14px;">' + CONFIG.session2.label + ' — $' + CONFIG.session2.rate + '/class</p>\
      <p style="margin:0;font-size:13px;color:#666;">Multiple classes are billed separately. Our team will confirm your total.</p>\
    </div>\
    ' + paymentHtml + '\
    <p style="margin:16px 0 0;font-size:14px;">📍 <b>Location:</b> ' + CONFIG.studioAddress + '</p>\
    ' + (d.notes    ? '<p style="margin:16px 0 0;font-size:14px;"><b>Allergies/Notes:</b> ' + esc_(d.notes)    + '</p>' : '') + '\
    ' + (d.comments ? '<p style="margin:8px 0 0;font-size:14px;"><b>Your comments:</b> '    + esc_(d.comments) + '</p>' : '') + '\
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />\
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;">If anything above looks incorrect, or you\'d like to make a change, just reply to this email or reach us directly:</p>\
    <p style="margin:0;font-size:14px;line-height:1.8;">📞 ' + CONFIG.studioPhone + ' &nbsp;|&nbsp; 💬 WeChat: ' + CONFIG.studioWeChat + ' &nbsp;|&nbsp; ✉️ ' + CONFIG.studioEmail + '</p>\
    <p style="margin:24px 0 0;font-size:15px;">We can\'t wait to see ' + esc_(d.studentName || "your student") + ' in class!</p>\
    <p style="margin:6px 0 0;font-size:15px;">— The ' + CONFIG.studioName + ' Team</p>\
  </div>\
</div>';
}

// ─── PLAIN TEXT EMAIL ──────────────────────────────────────────────────────
function buildText_(d) {
  var classList   = d.groupClasses.length ? d.groupClasses.join("; ") : "No group class selected";
  var privateNote = d.hasPrivateLesson
    ? "\nPrivate Lesson requested — we'll contact you to schedule (" + CONFIG.privateLessonRate + ").\n"
    : "";
  return [
    "Hi " + (d.parentName || "there") + ",",
    "",
    "Thank you for registering " + (d.studentName || "your student") + " for classes at " + CONFIG.studioName + "!",
    "This confirms the details below:",
    "",
    "Student:         " + d.studentName + " (Age " + d.age + ")",
    "Parent/Guardian: " + d.parentName,
    "Phone:           " + d.phone,
    "Class(es):       " + classList,
    "Session:         " + d.sessionChoice,
    privateNote,
    "Tuition Rates:",
    CONFIG.session1.label + " — $" + CONFIG.session1.rate + "/class",
    CONFIG.session2.label + " — $" + CONFIG.session2.rate + "/class",
    "(Multiple classes are billed separately. We'll confirm your total.)",
    "",
    "Payment: " + d.paymentMethod,
    "",
    "Location: " + CONFIG.studioAddress,
    (d.notes    ? "\nAllergies/Notes: " + d.notes    : ""),
    (d.comments ? "\nYour comments:   " + d.comments : ""),
    "",
    "Questions? Reply to this email or reach us:",
    "Phone:  " + CONFIG.studioPhone,
    "WeChat: " + CONFIG.studioWeChat,
    "Email:  " + CONFIG.studioEmail,
    "",
    "We can't wait to see " + (d.studentName || "your student") + " in class!",
    "— The " + CONFIG.studioName + " Team",
  ].join("\n");
}

// ─── HELPER ────────────────────────────────────────────────────────────────
function esc_(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── TEST HELPER ───────────────────────────────────────────────────────────
// Run this from the Apps Script editor to preview emails without a real submission.
// Select "testWithFakeData" in the function dropdown → ▶ Run
function testWithFakeData() {
  // Simulate what e.response.getItemResponses() builds
  var fakeNamedValues = {
    "Student Name":                    ["Emma Chen"],
    "Age":                             ["9"],
    "Parent/Guardian Name":            ["Lisa Chen"],
    "Phone Number":                    ["732-555-0123"],
    "Email Address":                   [CONFIG.studioEmail],
    "Select a Class":                  ["Fri 3:30–5:00 PM — Creative Art (Ages 4-6)", "Saturday 2:30–4:00 PM — Mixed Media (Ages 8+)"],
    "Select Session":                  ["Session 1: Sep 9 – Nov 7"],
    "Payment Method":                  ["Zelle — Pay to 7327180639"],
    "Allergies or Special Notes":      ["None"],
    "Additional Comments or Questions":["Looking forward to it!"],
  };

  // Wrap as fake event with namedValues
  var fakeEvent = { namedValues: fakeNamedValues };
  onFormSubmit(fakeEvent);
  Logger.log("testWithFakeData complete — check " + CONFIG.studioEmail + " inbox.");
}
