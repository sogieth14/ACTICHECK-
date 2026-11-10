#!/usr/bin/env python3
"""ActiCheck pre-deploy safety check. Run before every release:  python3 tools/predeploy-check.py
Fails (exit code 1) if it finds secrets, source maps, sensitive files, inline scripts or unexpected network hosts
in the files that will be published. Uses only the Python standard library."""
import os, re, sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
SKIP_DIRS = {".git", "node_modules", "tools", ".github"}
BINARY = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".zip", ".woff", ".woff2")
ALLOWED_SUFFIX = ("googleapis.com", "firebaseapp.com", "gstatic.com", "google.com", "firebase.google.com")
ALLOWED_HOSTS = {"fonts.googleapis.com", "fonts.gstatic.com", "wa.me", "www.w3.org", "github.com", "raw.githubusercontent.com", "cdnjs.cloudflare.com", "ndpc.gov.ng"}
SECRETS = {
    "Google API key": r"AIza[0-9A-Za-z_\-]{30,}",
    "Private key block": r"-----BEGIN [A-Z ]*PRIVATE KEY-----",
    "GitHub token": r"gh[pousr]_[A-Za-z0-9]{30,}",
    "AWS access key": r"AKIA[0-9A-Z]{16}",
    "Slack token": r"xox[baprs]-[0-9A-Za-z-]{10,}",
    "Secret-style key (sk-...)": r"\bsk[-_](live|test)?[-_]?[A-Za-z0-9]{20,}",
    "JWT": r"eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}",
    "Database URL": r"(mongodb(\+srv)?|postgres(ql)?|mysql|redis)://[^\s\"']+",
    "Bearer token": r"Bearer\s+[A-Za-z0-9._\-]{20,}",
    "Hard-coded secret": r"(?i)(client[_-]?secret|service[_-]?account|private[_-]?key|api[_-]?secret|password|passwd)[\"']?\s*[:=]\s*[\"'][^\"'\s]{8,}[\"']",
}
BAD_NAMES = re.compile(r"(\.env|\.pem$|\.key$|\.p12$|\.keystore$|id_rsa|credentials|serviceaccount|firebase-adminsdk|\.map$)", re.I)
fails, warns = [], []

for d, dirs, files in os.walk(ROOT):
    dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
    for f in files:
        p = os.path.join(d, f)
        if BAD_NAMES.search(f):
            fails.append(f"Sensitive or debug file would be published: {p}")
        if f.lower().endswith(BINARY):
            continue
        try:
            t = open(p, encoding="utf-8", errors="ignore").read()
        except OSError:
            continue
        is_lib = f.endswith(".min.js")
        for name, rx in SECRETS.items():
            if is_lib and name in ("Hard-coded secret",):
                continue
            for m in re.finditer(rx, t):
                if name == "Google API key" and f == "firebase-config.js" and "authDomain" in t:
                    warns.append("Firebase WEB key found in firebase-config.js. Public by design, but make sure the key is restricted to your website in Google Cloud.")
                    continue
                fails.append(f"{name} in {p}: {m.group(0)[:40]}...")
        if "sourceMappingURL" in t:
            fails.append(f"Source map reference in {p}")
        for m in re.finditer(r"https?://([A-Za-z0-9.\-]+)", t):
            if m.group(1) not in ALLOWED_HOSTS and not m.group(1).endswith(ALLOWED_SUFFIX):
                warns.append(f"Unexpected host {m.group(1)} in {p}")
        if "[CONFIRM" in t:
            warns.append(f"Unfilled placeholder text [CONFIRM...] in {p}: finish before publishing")
        if f.endswith(".html"):
            if re.search(r"<script(?![^>]*\bsrc=)[^>]*>\s*\S", t):
                fails.append(f"Inline script in {p} (breaks the Content Security Policy)")
            if re.search(r"\son[a-z]+=\"", t):
                fails.append(f"Inline event handler in {p}")
            if "Content-Security-Policy" not in t:
                warns.append(f"No Content-Security-Policy in {p}")
        if f.endswith(".js") and not is_lib:
            if re.search(r"\beval\(|new Function\(|document\.write\(", t):
                fails.append(f"eval, new Function or document.write in {p}")
            if "console.log" in t:
                warns.append(f"console.log left in {p}")

for w in sorted(set(warns)):
    print("WARN ", w)
for x in sorted(set(fails)):
    print("FAIL ", x)
print(f"\n{len(set(fails))} problem(s), {len(set(warns))} warning(s).")
sys.exit(1 if fails else 0)
