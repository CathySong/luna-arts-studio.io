# Registration Confirmation Email — Setup

The Fall registration form (`config/fall-enrollment.ts` → `registrationFormUrl`,
currently `https://forms.gle/AFNYCseZ74WY3zKf8`, "Luna Art Studio – 2026–2027
Art Class Registration") is a plain Google Form, not wired into this Next.js
app's backend. Google Forms has no native "send a custom confirmation email"
setting — it only supports a generic auto-reply. To send a real branded
confirmation, attach a small Google Apps Script to the form.

## What's provided

`scripts/google-apps-script/registration-confirmation.gs` — a complete,
ready-to-paste Apps Script that:
- Triggers on every form submission (`onFormSubmit`)
- Sends a branded HTML confirmation to the registrant's email (if provided)
- Sends a plain-text fallback for email clients that block HTML
- Sends an internal copy to the studio inbox (`Ninglu1088@gmail.com`) for every submission
- Pulls in the student's name, age, parent name, selected class(es), session,
  payment method, and any notes/comments directly from the form answers
- Notes when "Private Lesson" was selected and flags it for manual follow-up
- Includes a `testWithFakeData()` helper to preview the email safely

## Install (one-time, ~3 minutes)

1. Open the form (must be signed into the owner account, `shuhuaisme@gmail.com`):
   https://forms.gle/AFNYCseZ74WY3zKf8
2. Click the ⋮ menu (top right) → **Script editor** (or Extensions → Apps Script).
3. Delete any placeholder code and paste in the full contents of
   `registration-confirmation.gs`.
4. Review the `CONFIG` block at the top — update anything that's changed
   (studio email, phone, rates, etc).
5. Save (💾), then manually run `onFormSubmit`... actually run `testWithFakeData`
   first from the function dropdown → ▶ Run → approve Gmail send permissions
   when prompted.
6. Set up the real trigger: click the clock icon (Triggers, left sidebar) →
   **+ Add Trigger** → Function: `onFormSubmit`, Event source: *From form*,
   Event type: *On form submit* → Save.
7. Test end-to-end by submitting the live form with a real email address.

## Notes

- If a respondent leaves "Email Address" blank, no confirmation can be sent
  to them (Google Forms doesn't expose the submitter's email unless they
  type it in, or "Collect email addresses" is turned on in Form settings).
  The studio still gets its internal copy either way.
- To change wording/branding later, edit `buildParentEmailHtml_` /
  `buildParentEmailText_` in the script — no need to touch this repo's
  Next.js code, since the confirmation email lives entirely in the form's
  Apps Script, separate from the website.
