# ActiCheck 0.7 update (on top of 0.6)

Files changed: app.js, index.html, rules.js, sw.js. Copy them over your repo, commit and push.
sw.js is now acticheck-v32, so phones pick up the update on their next open.
To roll back, restore the previous versions of those 4 files.

## What is new
- Test results in one place. Under "Tests to consider" there is now a "Record test results" block. Tap what each test showed (for example Positive or Negative) and the possibilities update.
- Each illness card shows why: a green up arrow when a result supports it, a red down arrow when it weakens it, with the test named.
- A result is entered once and applies to every illness it touches. Once a test is recorded here, its Yes/No box inside an illness card no longer double counts.
- Some tests are record only (lumbar puncture, Lassa PCR, spine X-ray). They are saved in the file but do not change the list.
- Results are saved with the case, shown again when you reopen it, and travel with the QR or code handover to another phone.
- Fix: Yes/No exam marks and test results are now saved the moment you tap. Before, they were only saved when you left through certain buttons, so closing the app could lose them.
- Sciatica: Spine X-ray added as a test, and pregnancy now adds a little to it (from a doctor review).
- Rules are now v0.4 and the app says v0.7. The What's new sheet is updated.

## Important
- Every test effect in rules.js (the results block at the bottom) is a DRAFT written by me. None has been reviewed by a doctor. The app says so on screen, and "reviewed" is still false.
- Use the separate review sheet (acticheck-test-results-review.txt) to get doctors to confirm or change each effect. To change an effect, edit the numbers in rules.js. To remove one, delete its line.
- The bars and labels on the possibilities are relative to the top illness, so a result that weakens the top illness may not change its label. The red or green line on the card is what shows the effect.
- rules.js has a new "reviews" list that credits the one doctor who has reviewed part of the rules so far. It has no name or contact details. Remove it if you would rather not show it.

## Tested
Chromium, phone size, light and dark: recording and clearing results, reopening a case, a full page reload, a QR/code handover to a second phone, the setup flow, and sign in screens. Not tested here: real sign in, Google, and the verification email.
