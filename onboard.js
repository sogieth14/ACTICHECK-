/* ActiCheck onboarding (v0.6).
   1) Intro: three screens shown once, before sign-in, on a new phone.
   2) Setup: shown once after sign-in. Role, workplace, home screen, prototype notice, privacy (only if not yet agreed), theme.
   Everything is stored on this phone only. Nothing here is sent anywhere. No secrets. Uses the app's own colours, so dark mode just works. */
(function () {
"use strict";
var K = { intro: "acticheck_intro", setup: "acticheck_setup", profile: "acticheck_profile", proto: "acticheck_proto", cons: "acticheck_consent", theme: "acticheck_theme" };
var VER = "0.6", POLICY = "1.0";
function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function rd(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
var $ = function (i) { return document.getElementById(i); };
var RULES = function () { return (window.ACTI_RULES && window.ACTI_RULES.version) || "0.3"; };
var IOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
var STANDALONE = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
function isFresh() { return !(lsGet("acticheck_guide_seen") || lsGet("acticheck_tour_seen") || lsGet("acticheck_files") || lsGet("acticheck_cases")); }

var I = {
plus: '<path d="M12 5v14M5 12h14"/>',
eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
wifix: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".7"/><path d="M3 3l18 18"/>',
badge: '<rect x="3" y="5" width="18" height="14" rx="3.5"/><circle cx="9" cy="11" r="2"/><path d="M5.8 16c.5-1.4 1.6-2 3.2-2s2.7.6 3.2 2M15 10h3M15 13.5h3"/>',
hosp: '<path d="M4 21V8l8-4.5L20 8v13M3 21h18M12 9.5v5M9.5 12h5"/>',
phone: '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v4.5M12 18v.01"/>',
lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>',
check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
arr: '<path d="M5 12h14M13 6l6 6-6 6"/>',
ext: '<path d="M7 17L17 7M8 7h9v9"/>'
};
function ic(n, s, w) { return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="' + (w || 2.2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n] + '</svg>'; }
function pl(t, n, bg, c) { return '<span class="ob-pl" style="background:' + bg + ';color:' + c + '">' + ic(n, 22, 2.4) + t + '</span>'; }

var CSS = '#acti-ob{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(var(--w,47,111,219),.2),transparent 68%),var(--page,var(--bg));color:var(--ink);font-family:Manrope,system-ui,sans-serif;overflow:hidden}' +
'#acti-ob *{box-sizing:border-box}#acti-ob button,#acti-ob a{font-family:inherit}' +
'.ob-m{flex:1;min-height:0;display:flex;flex-direction:column;width:100%;max-width:480px;margin:0 auto;position:relative}' +
'.ob-sheet{background:var(--cardbg);border:1px solid var(--hair);border-top:0;box-shadow:var(--sh);padding:calc(24px + env(safe-area-inset-top,0px)) 26px 28px;border-radius:0 0 40px 40px;flex:none;animation:ob-drop .5s ease both}' +
'@keyframes ob-drop{from{transform:translateY(-16px);opacity:.4}to{transform:none;opacity:1}}' +
'.ob-sheet svg{display:block;margin-bottom:14px}.ob-sheet h1{margin:0;font-size:clamp(1.9rem,8vw,2.2rem);line-height:1.05;letter-spacing:-.03em;font-weight:800;text-wrap:balance;max-width:none}.ob-sheet h1:focus{outline:none}' +
'.ob-st{flex:1;min-height:0;overflow:auto;padding:22px 22px 8px;display:flex;flex-direction:column;gap:11px}.ob-st>*{animation:ob-up .5s ease both}@keyframes ob-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
'.ob-mu{color:var(--mute);font-size:.9375rem;line-height:1.5;font-weight:500;margin:0}.ob-fill{flex:1}' +
'.ob-bar{display:flex;gap:10px;padding:12px 20px calc(18px + env(safe-area-inset-bottom,0px));flex:none;max-width:480px;width:100%;margin:0 auto}' +
'.ob-back{all:unset;box-sizing:border-box;width:60px;height:60px;border-radius:50%;border:1px solid var(--hair);background:var(--cardbg);box-shadow:var(--sh);display:grid;place-items:center;cursor:pointer;flex:none;color:var(--ink)}' +
'.ob-next{all:unset;box-sizing:border-box;flex:1;min-height:60px;border-radius:30px;background:var(--navy);color:var(--on);display:flex;align-items:center;justify-content:space-between;padding:0 8px 0 26px;font-weight:700;font-size:1.125rem;cursor:pointer;box-shadow:0 12px 24px -12px rgba(18,39,59,.7);transition:opacity .2s,transform .15s}' +
'.ob-next i{width:44px;height:44px;border-radius:50%;background:var(--on);color:var(--navy);display:grid;place-items:center}.ob-next[disabled]{opacity:.4;cursor:default}.ob-next:active,.ob-back:active{transform:scale(.97)}' +
'#acti-ob :focus-visible{outline:3px solid var(--acc);outline-offset:3px}' +
'.ob-skip{all:unset;position:absolute;top:calc(34px + env(safe-area-inset-top,0px));right:22px;z-index:4;font-weight:700;color:var(--acct,#1f5fbf);padding:10px 4px;cursor:pointer}' +
'.ob-segs{position:absolute;top:calc(16px + env(safe-area-inset-top,0px));left:22px;right:22px;display:flex;gap:6px;z-index:3}.ob-segs i{flex:1;height:5px;border-radius:5px;background:var(--chipb)}.ob-segs i.on{background:var(--acc)}' +
'.ob-phw{flex:1;min-height:0;overflow:hidden;display:flex;justify-content:center;align-items:flex-end;padding-bottom:18px}' +
'.ob-ph{width:262px;height:460px;flex:none;border:8px solid #12273b;border-radius:44px;background:var(--page);color:var(--ink);padding:44px 14px 0;overflow:hidden;box-shadow:0 0 0 1px var(--hair),0 22px 44px rgba(18,39,59,.28);-webkit-mask-image:linear-gradient(transparent 0,#000 24%);mask-image:linear-gradient(transparent 0,#000 24%)}' +
'.ob-pt{font-size:1.0625rem;font-weight:800;letter-spacing:-.02em;margin-bottom:10px}.ob-ps{font-size:.6875rem;font-weight:700;color:var(--mute);margin:12px 2px 6px}' +
'.ob-pc{background:var(--cardbg);border:1px solid var(--hair);border-radius:18px;padding:2px 12px}.ob-pr{display:flex;align-items:center;gap:10px;padding:11px 0;font-size:.8125rem;font-weight:700;border-bottom:1px solid var(--line)}.ob-pr:last-child{border:0}.ob-pr span{margin-left:auto;color:var(--mute);font-weight:500;font-size:.6875rem}' +
'.ob-ck{width:18px;height:18px;border-radius:50%;border:1.6px solid var(--edge);display:grid;place-items:center;color:transparent;flex:none}.ob-ck.on{border-color:var(--acc);animation:ob-fk .35s var(--d) both}@keyframes ob-fk{from{background:transparent;color:transparent}to{background:var(--acc);color:#fff}}' +
'.ob-pb{margin-top:12px;background:var(--navy);color:var(--on);border-radius:16px;text-align:center;padding:12px;font-size:.8125rem;font-weight:700}' +
'.ob-pq{padding:10px 0;border-bottom:1px solid var(--line)}.ob-pq:last-child{border:0}.ob-pq div{display:flex;justify-content:space-between;align-items:center;font-size:.8125rem;margin-bottom:7px}.ob-pq div span{font-size:.625rem;font-weight:700;background:var(--chip);border:1px solid var(--chipb);border-radius:999px;padding:2px 8px}' +
'.ob-pq u{display:block;height:7px;border-radius:7px;background:var(--line);overflow:hidden}.ob-pq s{display:block;height:100%;width:0;border-radius:7px;background:linear-gradient(90deg,#4A86E8,#2F6FDB);animation:ob-gw 1s ease forwards}@keyframes ob-gw{to{width:var(--w)}}' +
'.ob-off{display:flex;align-items:center;gap:8px;background:#DDF6E6;color:#1B7A43;border-radius:12px;padding:10px 12px;font-size:.75rem;font-weight:800}' +
'.ob-cap{margin:0;padding:0 26px 14px;font-size:clamp(1.75rem,8vw,2.1rem);font-weight:800;letter-spacing:-.035em;line-height:1.28;flex:none}' +
'.ob-pl{display:inline-flex;align-items:center;gap:7px;padding:0 12px 0 9px;border-radius:14px;transform:rotate(-3deg);box-shadow:0 5px 14px rgba(18,39,59,.12);margin-right:4px}' +
'.ob-rw{all:unset;box-sizing:border-box;width:100%;display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:24px;background:var(--cardbg);border:2px solid var(--hair);box-shadow:var(--sh);font-weight:700;font-size:1.0625rem;cursor:pointer;transition:transform .15s,border-color .2s}.ob-rw.on{border-color:var(--acc)}.ob-rw:active{transform:scale(.99)}' +
'.ob-rw small{display:block;font-weight:500;font-size:.8125rem;color:var(--mute);margin-top:2px}.ob-rc{width:30px;height:30px;border-radius:50%;border:2.5px solid var(--c);display:grid;place-items:center;color:#fff;flex:none}.ob-rc.on{background:var(--c)}' +
'.ob-tw{background:var(--cardbg);border:1px solid var(--hair);border-radius:26px;padding:16px 18px;box-shadow:var(--sh)}.ob-tr{all:unset;box-sizing:border-box;width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;font-weight:800;font-size:1.0625rem;cursor:pointer}' +
'.ob-sw{width:60px;height:34px;border-radius:17px;background:var(--chipb);position:relative;flex:none;transition:background .25s}.ob-sw::after{content:"";position:absolute;top:3px;left:3px;width:28px;height:28px;border-radius:50%;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.3);transition:transform .25s}.ob-sw.on{background:#34C759}.ob-sw.on::after{transform:translateX(26px)}.ob-tw p{margin-top:8px}' +
'.ob-pnt{display:flex;gap:14px;align-items:flex-start;font-size:1rem;line-height:1.42;font-weight:600;background:var(--cardbg);border:1px solid var(--hair);border-radius:22px;padding:14px 16px;box-shadow:var(--sh)}.ob-pnt i{width:30px;height:30px;border-radius:50%;background:#DDF6E6;color:#1B7A43;display:grid;place-items:center;flex:none}' +
'.ob-am{background:var(--aml);color:var(--am);border-radius:22px;padding:14px 18px;font-size:.9375rem;line-height:1.5;font-weight:700}' +
'.ob-ol{all:unset;box-sizing:border-box;display:inline-flex;align-items:center;gap:12px;min-height:52px;padding:0 8px 0 22px;border-radius:26px;border:2px solid var(--navy);color:var(--navy);font-weight:700;cursor:pointer;align-self:flex-start;text-decoration:none}.ob-ol i{width:36px;height:36px;border-radius:50%;background:var(--navy);color:var(--on);display:grid;place-items:center}' +
'.ob-seg{display:flex;background:var(--cardbg);border:1px solid var(--hair);border-radius:20px;padding:5px;box-shadow:var(--sh)}.ob-seg button{all:unset;box-sizing:border-box;flex:1;min-height:48px;border-radius:15px;text-align:center;font-weight:700;cursor:pointer}.ob-seg button.on{background:var(--navy);color:var(--on)}' +
'.ob-done{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;text-align:center;padding:24px}' +
'.ob-okc{width:92px;height:92px;border-radius:50%;background:#2FC25B;color:#fff;display:grid;place-items:center;animation:ob-pop .7s cubic-bezier(.2,1.4,.4,1) both;margin-bottom:24px;box-shadow:0 16px 32px rgba(47,194,91,.35)}@keyframes ob-pop{from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}}' +
'.ob-done h1{font-size:2.3rem;font-weight:800;letter-spacing:-.035em;margin:0}.ob-done .ob-mu{margin-top:8px}.ob-lk{display:block;width:min(70vw,300px);height:auto;margin-top:30px}.ob-lk.d{display:none}' +
'@media(prefers-color-scheme:dark){:root:not([data-theme="light"]) .ob-lk.l{display:none}:root:not([data-theme="light"]) .ob-lk.d{display:block}}:root[data-theme="dark"] .ob-lk.l{display:none}:root[data-theme="dark"] .ob-lk.d{display:block}' +
'body.locked>#acti-ob#acti-ob{display:flex!important}' +
'.ob-cf i{position:absolute;top:-14px;animation:ob-fall linear infinite}@keyframes ob-fall{to{transform:translateY(110vh) rotate(560deg)}}';

var root = null, ST = null;
function css() { if ($("acti-ob-css")) return; var s = document.createElement("style"); s.id = "acti-ob-css"; s.textContent = CSS; document.head.appendChild(s); }
function newState(mode, steps) { return { mode: mode, steps: steps, i: 0, role: null, work: null, off: false, hint: false, proto: false, priv: false, theme: lsGet(K.theme) || "light" }; }

function phone(x) { return '<div class="ob-ph">' + x + '</div>'; }
function card(a) { return '<div class="ob-pc">' + a + '</div>'; }
var MOCK = [
function () { return phone('<div class="ob-pt">What is the patient feeling?</div><div class="ob-ps">Tap all that apply</div>' + card(['Fever', 'Cough', 'Fast or difficult breathing', 'Headache'].map(function (x, n) { return '<div class="ob-pr"><i class="ob-ck' + (n < 3 ? ' on' : '') + '" style="--d:' + (.5 + n * .35) + 's">' + ic('check', 11, 3.6) + '</i>' + x + '</div>'; }).join('')) + '<div class="ob-pb">Show possibilities</div>'); },
function () { return phone('<div class="ob-pt">Possibilities</div>' + card([['Pneumonia', 'Most consistent', 92], ['Viral respiratory infection', 'Also consider', 64], ['Malaria', 'Also consider', 38]].map(function (x, n) { return '<div class="ob-pq"><div><b>' + x[0] + '</b><span>' + x[1] + '</span></div><u><s style="--w:' + x[2] + '%;animation-delay:' + (.4 + n * .25) + 's"></s></u></div>'; }).join('')) + '<div class="ob-ps">Tests to consider</div>' + card('<div class="ob-pr">Chest X-ray</div><div class="ob-pr">Full blood count</div>')); },
function () { return phone('<div class="ob-pt">Cases</div><div class="ob-off">' + ic('wifix', 16, 2.4) + 'Works offline</div><div class="ob-ps">Saved on this phone</div>' + card([['Bed 4, Mr A', '14:20'], ['Ward B, Mrs K', '11:05'], ['Clinic 2', 'Yesterday']].map(function (x) { return '<div class="ob-pr"><b>' + x[0] + '</b><span>' + x[1] + '</span></div>'; }).join(''))); }
];
function rows(k, a) { return a.map(function (x) { var s = ST[k] === x[0]; return '<button class="ob-rw' + (s ? ' on' : '') + '" data-k="' + k + '" data-v="' + x[0] + '" aria-pressed="' + s + '"><i class="ob-rc' + (s ? ' on' : '') + '" style="--c:' + x[2] + '">' + (s ? ic('check', 14, 3.4) : '') + '</i><span>' + x[0] + '<small>' + x[1] + '</small></span></button>'; }).join(''); }
function tg(id, l, c, on) { return '<div class="ob-tw"><button class="ob-tr" id="' + id + '" role="switch" aria-checked="' + on + '"><span>' + l + '</span><i class="ob-sw' + (on ? ' on' : '') + '"></i></button><p class="ob-mu">' + c + '</p></div>'; }
function ticks(a) { return '<div class="ob-fill" style="display:flex;flex-direction:column;justify-content:center;gap:11px">' + a.map(function (x) { return '<div class="ob-pnt"><i>' + ic('check', 16, 3) + '</i><span>' + x + '</span></div>'; }).join('') + '</div>'; }

var STEPS = {
s1: { k: "s", w: "47,111,219", cap: pl("Add", "plus", "#DCE8FA", "#1F5FD0") + " what the<br>patient tells you", m: 0 },
s2: { k: "s", w: "18,181,166", cap: pl("See", "eye", "#CFF0E3", "#0C6B40") + " what it<br>could be", m: 1 },
s3: { k: "s", w: "245,165,36", cap: pl("Work", "wifix", "#FFE2A0", "#7A4A00") + " on the ward,<br>even offline", m: 2 },
role: { k: "q", w: "139,92,246", ico: "badge", h: "What\u2019s your<br>role?", ok: function () { return !!ST.role; },
  b: function () { return '<p class="ob-mu">Pick the one that fits you best. Saved on this phone only.</p>' + rows("role", [["House officer", "Internship year", "#E5484D"], ["Medical officer", "Registered and in practice", "#2FA66A"], ["Consultant", "Specialist level", "#2F6FDB"], ["Student", "Medical student", "#8B5CF6"]]); } },
work: { k: "q", w: "18,181,166", ico: "hosp", h: "Where do you<br>work?", ok: function () { return !!ST.work; },
  b: function () { return '<p class="ob-mu">Saved on this phone only. You can use ActiCheck in any of these.</p>' + rows("work", [["Teaching hospital", "Tertiary care", "#E8890C"], ["General hospital", "Secondary care", "#2FA66A"], ["Private clinic", "Outpatient practice", "#2F6FDB"], ["Primary health centre", "Community care", "#12B5A6"]]); } },
inst: { k: "q", w: "47,111,219", ico: "phone", h: "Use it without<br>internet", ok: function () { return true; },
  b: function () { return '<div class="ob-fill" style="display:flex;align-items:center;justify-content:center"><div class="ob-pnt" style="flex-direction:column;align-items:center;text-align:center;padding:26px 22px;gap:10px"><i style="width:56px;height:56px">' + ic('wifix', 28, 2.2) + '</i><span>Add ActiCheck to your home screen. It then opens like a normal app and works without internet.</span></div></div>' + tg("ob-t1", "Add to Home Screen", ST.hint ? (IOS ? "Tap the Share button, then Add to Home Screen." : "Open the browser menu, then tap Install app or Add to Home screen.") : "You can also do this later from Profile.", ST.off); } },
proto: { k: "q", w: "245,165,36", ico: "warn", h: "Still a<br>prototype", ok: function () { return ST.proto; },
  b: function () { return '<div class="ob-am">ActiCheck is a prototype. Rules v' + RULES() + ' are drafts and have not been reviewed by a doctor.</div>' + ticks(["Results are suggestions for a qualified doctor to review.", "Every clinical decision stays with you.", "In an emergency, act first. Do not wait for a result."]) + tg("ob-t2", "I understand this is a prototype", "ActiCheck supports a doctor\u2019s judgment and never replaces it.", ST.proto); } },
priv: { k: "q", w: "47,166,106", ico: "lock", h: "Your<br>privacy", ok: function () { return ST.priv; },
  b: function () { return ticks(["Patient files stay on this phone, not in your account.", "Use initials, a nickname or a bed number. Avoid full names.", "The file name shows when you share a file."]) + '<a class="ob-ol" href="privacy.html" target="_blank" rel="noopener">Read the Privacy policy<i>' + ic("ext", 18, 2.4) + '</i></a>' + tg("ob-t3", "I agree to the Privacy policy", "You can read it again anytime from Profile.", ST.priv); } },
theme: { k: "q", w: "47,111,219", ico: "sun", h: "Light, dark<br>or system?", ok: function () { return true; },
  b: function () { return '<div class="ob-fill" style="display:flex;align-items:center;justify-content:center"><div class="ob-pnt" style="flex-direction:column;align-items:stretch;gap:4px;width:100%;box-shadow:var(--sh),inset 5px 0 0 #E8A317"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:1.0625rem">Bed 4, Mr A</b><span style="background:var(--aml);color:var(--am);border-radius:999px;padding:3px 10px;font-size:.75rem;font-weight:700">Draft</span></div><span class="ob-mu">Adult \u00b7 5 symptoms</span></div></div><div class="ob-seg" role="group" aria-label="Appearance">' + [["light", "Light"], ["dark", "Dark"], ["auto", "System"]].map(function (x) { return '<button data-t="' + x[0] + '" class="' + (ST.theme === x[0] ? "on" : "") + '" aria-pressed="' + (ST.theme === x[0]) + '">' + x[1] + '</button>'; }).join("") + '</div>'; } },
done: { k: "d", w: "47,111,219" }
};

function conf() { var c = ["#2FC25B", "#FFC83D", "#8B5CF6", "#2F6FDB", "#FF6B6B"], h = ""; for (var n = 0; n < 30; n++) h += '<i style="left:' + (Math.random() * 100) + '%;width:' + (5 + Math.random() * 6) + 'px;height:' + (5 + Math.random() * 8) + 'px;background:' + c[n % 5] + ';animation-duration:' + (3.5 + Math.random() * 3) + 's;animation-delay:' + (-Math.random() * 6) + 's;border-radius:' + (n % 3 ? "1px" : "50%") + '"></i>'; return '<div class="ob-cf" aria-hidden="true">' + h + '</div>'; }

function draw() {
  var p = ST.steps[ST.i], m = $("ob-m"), intro = ST.mode === "intro", h = "";
  root.style.setProperty("--w", p.w);
  if (p.k === "s") {
    h = '<div class="ob-segs">' + [0, 1, 2].map(function (n) { return '<i class="' + (n <= ST.i ? "on" : "") + '"></i>'; }).join("") + '</div><button class="ob-skip" data-a="skip">Skip</button><div class="ob-phw">' + MOCK[p.m]() + '</div><h1 class="ob-cap" tabindex="-1">' + p.cap + '</h1>';
  } else if (p.k === "q") {
    h = '<div class="ob-sheet">' + ic(p.ico, 36, 2.2) + '<h1 tabindex="-1">' + p.h + '</h1></div><div class="ob-st">' + p.b() + '</div>';
  } else {
    h = '<div class="ob-done">' + conf() + '<div class="ob-okc">' + ic("check", 48, 3.2) + '</div><h1 tabindex="-1">You\u2019re all set</h1><p class="ob-mu">Your ActiCheck is ready</p><img class="ob-lk l" src="logo/acticheck-lockup-for-light.svg" alt="ActiCheck Diagnosis Support"><img class="ob-lk d" src="logo/acticheck-lockup-for-dark.svg" alt="" aria-hidden="true"></div>';
  }
  m.innerHTML = h;
  var last = ST.i === ST.steps.length - 1;
  $("ob-back").style.visibility = ST.i ? "visible" : "hidden";
  $("ob-nl").textContent = last ? (intro ? "Get started" : "Open ActiCheck") : (intro && ST.i === 0 ? "Next" : "Next");
  $("ob-next").disabled = p.ok ? !p.ok() : false;
  var f = m.querySelector("h1"); if (f) f.focus({ preventScroll: true });
}
function finish() {
  var intro = ST.mode === "intro";
  if (intro) { lsSet(K.intro, "1"); }
  else {
    if (ST.role || ST.work) lsSet(K.profile, JSON.stringify({ role: ST.role, work: ST.work, t: Date.now() }));
    lsSet(K.proto, JSON.stringify({ v: VER, rules: RULES(), t: Date.now() }));
    if (ST.needConsent && ST.priv) lsSet(K.cons, JSON.stringify({ v: POLICY, t: Date.now(), uid: ST.uid || "" }));
    lsSet(K.setup, VER); lsSet("acticheck_guide_seen", "1");
  }
  close();
  if (!intro) { var b = $("start"); if (b && !document.body.classList.contains("locked")) b.focus({ preventScroll: true }); }
}
function close() { if (root) { root.remove(); root = null; } ST = null; document.body.style.overflow = ""; }
function go() { if (!ST) return; var p = ST.steps[ST.i]; if (p.ok && !p.ok()) return; if (ST.i < ST.steps.length - 1) { ST.i++; draw(); } else finish(); }
function open(mode, keys) {
  if (root) return;
  css();
  root = document.createElement("div"); root.id = "acti-ob"; root.setAttribute("role", "dialog"); root.setAttribute("aria-modal", "true"); root.setAttribute("aria-label", mode === "intro" ? "Welcome to ActiCheck" : "Set up ActiCheck");
  root.innerHTML = '<div class="ob-m" id="ob-m"></div><div class="ob-bar"><button class="ob-back" id="ob-back" aria-label="Back">' + ic("back", 24, 2.4) + '</button><button class="ob-next" id="ob-next"><span id="ob-nl">Next</span><i>' + ic("arr", 22, 2.4) + '</i></button></div>';
  ST = newState(mode, keys.map(function (k) { return STEPS[k]; }));
  document.body.appendChild(root); document.body.style.overflow = "hidden";
  root.addEventListener("click", function (e) {
    var t = e.target.closest("button,a"); if (!t || !ST) return;
    if (t.id === "ob-next") { go(); return; }
    if (t.id === "ob-back") { if (ST.i) { ST.i--; draw(); } return; }
    if (t.dataset.a === "skip") { ST.i = ST.steps.length - 1; finish(); return; }
    if (t.dataset.k) { ST[t.dataset.k] = t.dataset.v; draw(); return; }
    if (t.id === "ob-t1") { ST.off = !ST.off; ST.hint = false; if (ST.off && !STANDALONE) { if (window.__ip) { try { window.__ip.prompt(); } catch (x) {} window.__ip = null; } else ST.hint = true; } draw(); return; }
    if (t.id === "ob-t2") { ST.proto = !ST.proto; draw(); return; }
    if (t.id === "ob-t3") { ST.priv = !ST.priv; draw(); return; }
    if (t.dataset.t) { ST.theme = t.dataset.t; if (window.__setTheme) window.__setTheme(ST.theme); draw(); }
  });
  draw();
}

window.ActiCheckOnboard = {
  // called by auth.js when nobody is signed in and the sign-in screen is about to show
  intro: function () {
    if (root || lsGet(K.intro)) return;
    if (!isFresh()) { lsSet(K.intro, "1"); return; }
    open("intro", ["s1", "s2", "s3"]);
  },
  // called by auth.js once the app is unlocked. user is the signed-in account, or null when sign-in is switched off
  setup: function (user) {
    if (root || lsGet(K.setup) === VER) return;
    var c = rd(K.cons), needConsent = !(c && c.v === POLICY), fresh = isFresh(), keys = [];
    if (fresh) { keys.push("role", "work"); if (!STANDALONE) keys.push("inst"); }
    keys.push("proto"); if (needConsent) keys.push("priv"); if (fresh) keys.push("theme");
    keys.push("done");
    open("setup", keys);
    ST.needConsent = needConsent; ST.uid = (user && user.uid) || "";
  }
};
})();
