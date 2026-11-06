# ActiCheck security rules

These rules apply to every change, now and when accounts and a server are added.

1. **No secrets in the app code.** Nothing that is secret goes in any file that is published: no API secrets, service account files, private keys, database addresses, OAuth client secrets, email or SMS service keys, admin tokens. Anything in a published file can be read by anyone.
2. **Where secrets live.** Server side only, in the host's secret store (for example Google Secret Manager for Firebase Functions). Never in GitHub, never in chat messages, never in screenshots.
3. **Firebase web config is public by design.** The web API key only identifies the project. Restrict it to the ActiCheck website address, turn on App Check, and rely on security rules, not on hiding the key.
4. **Rate limiting happens on the server.** Sign-in attempts, code requests, password resets and sign-ups are limited by the sign-in service and by server rules. Limits written only in the app are for the user's convenience and can be bypassed.
5. **Patient data stays on the device.** Accounts hold login details only. Do not add a central patient database without a lawyer, consent flow and security review.
6. **Check before every release.** Run `python3 tools/predeploy-check.py` (it also runs automatically on GitHub). Fix every FAIL.
7. **Keep GitHub safe.** Turn on two-step sign-in for your GitHub account, and in the repository settings turn on secret scanning and push protection.
8. **If a secret is ever exposed,** treat it as stolen: revoke and replace it first, then clean the history.

Report a problem by contacting the owner directly. Do not post it publicly.
