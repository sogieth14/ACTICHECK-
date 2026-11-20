# ActiCheck 0.6 update

Only 5 files changed: index.html, app.js, auth.js, sw.js, and the new onboard.js.
Copy them over your repo (or unzip this whole folder over it), commit and push.
sw.js is now acticheck-v31, so phones pick up the update on their next open.
To roll back, restore the previous versions of those 5 files and delete onboard.js.

## What is new
- First time on a phone: a 3 screen intro, then your existing sign in (restyled with the real ActiCheck logo and a tinted background per screen).
- After sign in, a one time setup: role, workplace, add to home screen, prototype notice, privacy agreement (only if not already agreed), light/dark/system, done.
- Existing users see a short version once: the prototype notice, plus the privacy agreement if their account has not agreed yet.
- Soft colour wash on every screen (blue Home, teal Cases, violet Profile, a new colour per clerking step), bolder headings, a status colour edge on each case card.
- Possibilities: each illness is now a raised card with a round arrow that turns when opened, plus a small nudge on the first one so it looks tappable.
- Home: the heartbeat line now sits under the Start a case button and its note, behind everything, so it no longer crosses the text or the button.
- QR: a "Hand over this case" banner at the top of every Results page jumps to the QR card, and the card has a blue border and a larger code. If the QR ever fails to draw, a message points to Send card or Copy code instead of leaving a blank space.
- Results page no longer has an empty gap above it. The "n selected" counter in clerking now updates as you tap. Duplicate helper lines in clerking are hidden.
- What's new sheet and the version line say 0.6.

## Things to know
- Role and workplace are saved on the phone only (acticheck_profile). Nothing uses them yet.
- The old "Are you new to ActiCheck?" pop up no longer shows, because the setup replaces it. The tour for the installed app still runs.
- Storage keys added: acticheck_intro, acticheck_setup, acticheck_profile, acticheck_proto. The privacy agreement uses your existing acticheck_consent record (policy 1.0).
- privacy.html still contains the [CONFIRM...] placeholders and the Terms of Use is not written yet. Fill those in before wider release. I am not a lawyer, so get the wording reviewed.
- tools/predeploy-check.py reports the same items as before (Firebase vendor files). Nothing new was added by this update.

## Tested
Chromium, phone size, light and dark, with sign in switched off (setup, clerking, results, QR, cases, profile) and with the real Firebase config offline (intro, sign in, create account, reset screens).
Not tested here: creating a real account, Google sign in, and the verification email. Try those once on the live site after you push.
