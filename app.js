(function(){
var R=window.ACTI_RULES,$=function(i){return document.getElementById(i)};
function chips(id,o){var h="";for(var k in o)h+='<label class="chp"><input type="checkbox" data-k="'+k+'"><span class="dot">&#10003;</span>'+o[k]+'</label>';$(id).innerHTML=h}
chips("sym",R.symptoms);chips("ctx",R.context);chips("tst",R.tests);
document.querySelectorAll("#tst input").forEach(function(i){if(R.defaultTests.indexOf(i.dataset.k)>-1)i.checked=true});
function sel(id){var o={};document.querySelectorAll("#"+id+" input:checked").forEach(function(i){o[i.dataset.k]=1});return o}
function count(){[["sym","c-sym"],["tst","c-tst"]].forEach(function(p){var n=Object.keys(sel(p[0])).length,e=$(p[1]);e.textContent=n+" selected";e.classList.toggle("on",n>0)})}
document.addEventListener("change",count);count();
document.querySelectorAll(".row").forEach(function(r){var b=r.querySelector(".rh");b.onclick=function(){var o=r.classList.toggle("open");b.setAttribute("aria-expanded",o)}});
$("start").onclick=function(){$("tool").scrollIntoView()};
$("how").onclick=function(){$("tool").scrollIntoView();var r=document.querySelectorAll(".row")[1];r.classList.add("open");r.querySelector(".rh").setAttribute("aria-expanded","true")};
R.conditions.map(function(d){return d.n}).concat(["Other or not listed"]).forEach(function(n){var o=document.createElement("option");o.textContent=n;$("final").appendChild(o)});
function all(clause,keys){return clause.every(function(k){return keys[k]})}
var last=null;
function store(){try{return JSON.parse(localStorage.getItem("acticheck_cases")||"[]")}catch(e){return[]}}
$("final").onchange=function(){
if(!last)return;last.final=$("final").value;
try{var a=store();a.push(last);localStorage.setItem("acticheck_cases",JSON.stringify(a));$("saved").textContent="Saved on this device ("+a.length+" cases). No names or patient details are stored."}catch(e){$("saved").textContent="Could not save on this device."}
};
$("export").onclick=function(){
var a=store();if(!a.length){$("saved").textContent="No saved cases yet.";return}
function q(v){return '"'+String(v).replace(/"/g,'""')+'"'}
var csv="time,age,duration,symptoms,context,suggested,final\n"+a.map(function(c){return [c.time,c.age,c.dur,c.sym,c.ctx,c.top,c.final].map(q).join(",")}).join("\n");
var l=document.createElement("a");l.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));l.download="acticheck-cases.csv";document.body.appendChild(l);l.click();l.remove();
};
$("run").onclick=function(){
var s=sel("sym"),c=sel("ctx"),t=sel("tst"),age=$("age").value,dur=$("dur").value,keys={};
for(var k in s)keys[k]=1;for(var k2 in c)keys[k2]=1;keys["age:"+age]=1;keys["dur:"+dur]=1;
var flags=R.flags.filter(function(f){return f.when.some(function(cl){return all(cl,keys)})});
var res=[];
R.conditions.forEach(function(d){
if(d.requires&&!keys[d.requires])return;
var sc=d.base||0,hits=[];
for(var k in d.w)if(keys[k]){sc+=d.w[k];hits.push(R.symptoms[k].toLowerCase())}
if(d.dur)sc+=d.dur.indexOf(dur)>-1?2:-2;
(d.bonus||[]).forEach(function(b){if(all(b.if,keys))sc+=b.add});
if(sc>=R.threshold)res.push({d:d,sc:sc,hits:hits})});
res.sort(function(a,b){return b.sc-a.sc});
var top=res.slice(0,5),max=top.length?top[0].sc:1;
var fh="<h2>Warning signs</h2>";
if(flags.length)flags.forEach(function(f){fh+='<div class="flag"><b>'+f.name+'</b><span class="why">'+f.msg+'</span></div>'});
else fh+='<p class="why">None triggered by what you entered. Still check vitals and examine fully.</p>';
$("flags").innerHTML=fh;
var dh="";
if(!top.length)dh='<p class="why">Not enough to rank anything. Add symptoms or duration, or consider causes outside these rules.</p>';
top.forEach(function(r){var p=Math.round(r.sc/max*100);dh+='<div class="dx"><div class="top"><span>'+r.d.n+'</span><span>'+p+'%</span></div><div class="bar"><i data-w="'+p+'"></i></div><div class="why">'+r.d.why+(r.hits.length?" Matches: "+r.hits.join(", ")+".":"")+'</div></div>'});
if(!R.reviewed)dh+='<p class="why" style="margin-top:12px">Rules v'+R.version+' have not been reviewed by a doctor yet.</p>';
$("dxs").innerHTML=dh;
var need={};top.forEach(function(r){r.d.tests.forEach(function(x){need[x]=1})});flags.forEach(function(f){f.tests.forEach(function(x){need[x]=1})});
var th="",mh=[];for(var k3 in need){if(t[k3])th+="<li>"+R.tests[k3]+"</li>";else mh.push(R.tests[k3])}
$("tests").innerHTML=th||"<li>No extra tests needed from your list</li>";
var m=$("miss");m.hidden=!mh.length;m.textContent="Not available here, consider referral: "+mh.join(", ")+".";
$("saved").textContent="";
last={time:new Date().toISOString(),age:age,dur:dur,sym:Object.keys(s).join(" "),ctx:Object.keys(c).join(" "),top:top.map(function(r){return r.d.n}).slice(0,3).join(" | "),final:""};
var o=$("out");o.style.display="block";
o.querySelectorAll(".card").forEach(function(c){c.style.animation="none";c.offsetWidth;c.style.animation=""});
o.scrollIntoView();
setTimeout(function(){document.querySelectorAll(".bar i").forEach(function(i){i.style.width=i.dataset.w+"%"})},250);
};
function net(){$("net").textContent=navigator.onLine?"Works offline":"Offline mode"}
window.addEventListener("online",net);window.addEventListener("offline",net);net();
if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0)navigator.serviceWorker.register("sw.js");
})();
