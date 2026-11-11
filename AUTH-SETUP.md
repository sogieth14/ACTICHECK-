# ACTICHECK sign-in update — free setup guide

This source bundle keeps the existing GitHub Pages app and Firebase project, adds a branded email-action page, and updates Google sign-in to use a pop-up on both phones and desktop. It uses Firebase's existing email sender and the Firebase JavaScript SDK files included in this folder; it does not require a paid email service or a new Google Cloud billing account.

## 1. Put the files into the ACTICHECK repository

1. Download and extract this bundle.
2. Make a backup of the current repository files.
3. Copy the contents of this folder into the top level of the ACTICHECK repository, allowing the updated files to replace the older copies.
4. Before publishing, open `firebase-config.js` and check that it still names the Firebase project you intend to use. This bundle currently points to `acticheck-test`, matching the supplied app source.
5. Publish the repository through the same GitHub Pages process you already use. The site must serve `auth-action.html` at:

   `https://sogieth14.github.io/ACTICHECK-/auth-action.html`

## 2. Set the email action page in Firebase

After GitHub Pages finishes publishing, open Firebase Console for the project in `firebase-config.js`:

1. Go to **Authentication → Templates**.
2. Open the **Email address verification** template and choose **Customize action URL** (or the equivalent action-URL setting shown there).
3. Set the action URL to:

   `https://sogieth14.github.io/ACTICHECK-/auth-action.html`

4. Save the template. Repeat for **Password reset** if Firebase shows a separate action-URL setting for that template. The page also handles email recovery and email-change verification.

The user-return address is provided by the app and is restricted to the ACTICHECK Pages path. The email page removes the one-time code from the address bar after reading it, and the service worker is set to bypass these action URLs so the code is not saved in its offline cache.

The Firebase Authorized domain is the hostname `sogieth14.github.io`; the `/ACTICHECK-/` repository path is not part of that setting. You confirmed that hostname is already authorized. The existing Google provider should remain enabled.

## 3. Test the whole journey

Use a test account and test on the published HTTPS site:

- Create an email/password account. Open the email link. It should confirm the address, then return to ACTICHECK.
- Request a password reset. Choose a new password on the ACTICHECK page, then sign in with it.
- Try Google sign-in on a desktop browser and on a phone. Both use a pop-up that returns to ACTICHECK when Google finishes. If the phone opens ACTICHECK inside Gmail or another app, use **Open in browser**. If the browser blocks the sign-in window, open ACTICHECK directly in Chrome or Safari and retry.
- Try again in a private/incognito session and with a different email account.

If Google sign-in reports `auth/unauthorized-domain`, check **Authentication → Settings → Authorized domains** for `sogieth14.github.io`. If it reports `auth/operation-not-allowed`, check that Google remains enabled under **Authentication → Sign-in method**. If a browser reports `auth/web-storage-unsupported`, try its regular Chrome or Safari browser rather than an embedded browser.

Firebase documents that redirect sign-in needs an extra same-site auth setup on production Chrome, Firefox, and Safari when the app and Firebase auth helper use different domains. Its documented popup option avoids that redirect requirement, so this bundle uses pop-ups on phones too. If you later want a full-page mobile redirect, plan a dedicated ACTICHECK web domain with Firebase Hosting or another supported same-site auth-helper setup; buying a Subaru SMM domain alone will not configure that flow. See [Firebase redirect sign-in guidance](https://firebase.google.com/docs/auth/web/redirect-best-practices).

## Domain and cost note

Keep the Subaru SMM-branded domain separate from ACTICHECK for now so clinicians see one consistent product identity. You can revisit a dedicated ACTICHECK domain later if it is available to you. The source changes themselves use the existing Firebase project and GitHub Pages; do not enable a paid plan just to apply this bundle. Firebase lists Authentication (most options) among no-cost products on Spark; quotas and terms still apply. See [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans).

This is source code only. It does not publish to GitHub, change Firebase Console settings, or prove that a live sign-in succeeds. After the steps above, verify the sign-in flows with test accounts before inviting clinicians.
