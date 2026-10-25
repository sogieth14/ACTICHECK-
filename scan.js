/* Case QR: encode, scan and share a case with no server. The QR holds the case itself (no names). */
(function(){
var PFX="ACTI1:",M=null,stream=null,onCode=null,opener=null;
function b64e(s){return btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function b64d(s){s=s.replace(/-/g,"+").replace(/_/g,"/");while(s.length%4)s+="=";return decodeURIComponent(escape(atob(s)))}
var CSS='.sm{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(8,16,24,.75)}.sm.open{display:flex}.smc{background:var(--bg);color:var(--ink);width:100%;max-width:440px;max-height:100%;overflow:auto;border-radius:28px;padding:20px;margin:12px;display:flex;flex-direction:column;gap:12px}.smc h3{margin:0;font-size:22px}.smc video{width:100%;border-radius:18px;background:#000;aspect-ratio:1/1;object-fit:cover}.smc input{font:inherit;padding:12px 14px;border-radius:14px;border:1.5px solid var(--chipb);background:var(--bg);color:var(--ink);width:100%}.smc .row2{display:flex;gap:8px}.smc button{all:unset;box-sizing:border-box;text-align:center;font-weight:700;border-radius:999px;padding:12px 18px;cursor:pointer;border:1.5px solid var(--navy);color:var(--navy)}.smc button.p{background:var(--navy);color:var(--on)}.smc button:focus-visible,.smc input:focus-visible{outline:3px solid var(--acc);outline-offset:2px}.smst{font-size:14px;font-weight:600;color:var(--mute);min-height:20px}';
function stop(){if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}}
function close(){stop();M.classList.remove("open");document.body.style.overflow="";if(opener)opener.focus()}
var pend=null;
function done(text){var cb=onCode,st=M.querySelector(".smst"),inp=M.querySelector(".smi");text=(text||"").trim();
if(text.indexOf("ACTI2:")===0){stop();pend=text;inp.value="";inp.type="password";inp.placeholder="Enter the PIN";inp.focus();st.textContent="This case is locked. Enter the PIN, then tap Open.";return}
try{var c=CASEQR.decode(text);close();cb(c)}catch(e){st.textContent="That is not an ActiCheck case code."}}
function openPin(){var cb=onCode,st=M.querySelector(".smst"),inp=M.querySelector(".smi");CASEQR.decodeAsync(pend,inp.value).then(function(c){pend=null;close();cb(c)}).catch(function(){st.textContent="Wrong PIN. Try again."})}
function build(){
var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
M=document.createElement("div");M.className="sm";M.setAttribute("role","dialog");M.setAttribute("aria-modal","true");M.setAttribute("aria-label","Scan a case QR");
M.innerHTML='<div class="smc"><h3>Scan a case QR</h3><video playsinline muted></video><div class="smst" role="status" aria-live="polite"></div><div class="row2"><input class="smi" placeholder="Or paste a case code" aria-label="Case code"><button class="p smo">Open</button></div><button class="smx">Cancel</button></div>';
M.querySelector(".smx").onclick=close;M.querySelector(".smo").onclick=function(){if(pend)openPin();else done(M.querySelector(".smi").value)};
M.addEventListener("click",function(e){if(e.target===M)close()});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&M.classList.contains("open"))close()});
document.body.appendChild(M)}
function loop(v,cv,cx){if(!stream)return;if(v.readyState>=2&&v.videoWidth){var w=Math.min(640,v.videoWidth),h=Math.round(w*v.videoHeight/v.videoWidth);cv.width=w;cv.height=h;cx.drawImage(v,0,0,w,h);var r=jsQR(cx.getImageData(0,0,w,h).data,w,h,{inversionAttempts:"dontInvert"});if(r&&r.data.indexOf("ACTI")===0){done(r.data);return}}setTimeout(function(){loop(v,cv,cx)},120)}
var enc=new TextEncoder(),dec=new TextDecoder();
function toB(u){var t="";for(var i=0;i<u.length;i++)t+=String.fromCharCode(u[i]);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function fromB(x){x=x.replace(/-/g,"+").replace(/_/g,"/");while(x.length%4)x+="=";var b=atob(x),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
function dk(pin,salt){return crypto.subtle.importKey("raw",enc.encode(pin),"PBKDF2",false,["deriveKey"]).then(function(k){return crypto.subtle.deriveKey({name:"PBKDF2",salt:salt,iterations:100000,hash:"SHA-256"},k,{name:"AES-GCM",length:256},false,["encrypt","decrypt"])})}
window.CASEQR={
canLock:function(){return!!(window.crypto&&crypto.subtle)},
encodeAsync:function(c,pin){var salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));return dk(pin,salt).then(function(k){return crypto.subtle.encrypt({name:"AES-GCM",iv:iv},k,enc.encode(JSON.stringify(c)))}).then(function(ct){var o=new Uint8Array(28+ct.byteLength);o.set(salt,0);o.set(iv,16);o.set(new Uint8Array(ct),28);return"ACTI2:"+toB(o)})},
decodeAsync:function(t,pin){var u=fromB(t.trim().slice(6));return dk(pin,u.slice(0,16)).then(function(k){return crypto.subtle.decrypt({name:"AES-GCM",iv:u.slice(16,28)},k,u.slice(28))}).then(function(p){var c=JSON.parse(dec.decode(p));if(!c||c.v!==1)throw new Error("bad");return c})},
encode:function(c){return PFX+b64e(JSON.stringify(c))},
decode:function(t){t=(t||"").trim();if(t.indexOf(PFX)!==0)throw new Error("bad");var c=JSON.parse(b64d(t.slice(PFX.length)));if(!c||c.v!==1)throw new Error("bad");return c},
svg:function(t){var q=qrcode(0,"M");q.addData(t);q.make();return q.createSvgTag({cellSize:4,margin:4,scalable:true})},
scan:function(cb){if(!M)build();onCode=cb;pend=null;opener=document.activeElement;var i0=M.querySelector(".smi");i0.type="text";i0.value="";i0.placeholder="Or paste a case code";M.classList.add("open");document.body.style.overflow="hidden";var s=M.querySelector(".smst"),v=M.querySelector("video");s.textContent="";
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){s.textContent="Camera not available. Paste the case code instead.";return}
navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(function(m){stream=m;v.srcObject=m;v.play();s.textContent="Point the camera at the case QR.";var cv=document.createElement("canvas");loop(v,cv,cv.getContext("2d",{willReadFrequently:true}))}).catch(function(){s.textContent="Camera blocked. Allow camera access, or paste the case code instead."})}
};
})();
