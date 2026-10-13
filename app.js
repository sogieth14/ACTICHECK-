(function(){
var R=window.ACTI_RULES,$=function(i){return document.getElementById(i)};
function chips(id,o){var h="";for(var k in o)h+='<label class="chp"><input type="checkbox" data-k="'+k+'"><span class="dot">&#10003;</span>'+o[k]+'</label>';$(id).innerHTML=h}
chips("sym",R.symptoms);chips("ctx",R.context);chips("tst",R.tests);
document.querySelectorAll("#tst input").forEach(function(i){if(R.defaultTests.indexOf(i.dataset.k)>-1)i.checked=true});
function sel(id){var o={};document.querySelectorAll("#"+id+" input:checked").forEach(function(i){o[i.dataset.k]=1});return o}
function num(id){var v=parseFloat($(id).value);return isNaN(v)?null:v}
function count(){[["sym","c-sym"],["tst","c-tst"]].forEach(function(p){var n=Object.keys(sel(p[0])).length,e=$(p[1]);e.textContent=n+" selected";e.classList.toggle("on",n>0)});
var vn=["v-t","v-p","v-r","v-s","v-o","v-w","v-h","v-g"].filter(function(i){return num(i)!==null}).length,ve=$("c-vit");ve.textContent=vn+" entered";ve.classList.toggle("on",vn>0)}
document.addEventListener("change",count);document.addEventListener("input",count);count();
document.querySelectorAll(".row").forEach(function(r){var b=r.querySelector(".rh");b.onclick=function(){var o=r.classList.toggle("open");b.setAttribute("aria-expanded",o)}});
$("start").onclick=function(){$("tool").scrollIntoView()};
$("how").onclick=function(){$("tool").scrollIntoView();var r=document.querySelectorAll(".row")[1];r.classList.add("open");r.querySelector(".rh").setAttribute("aria-expanded","true")};
R.conditions.map(function(d){return d.n}).concat(["Other or not listed"]).forEach(function(n){var o=document.createElement("option");o.textContent=n;$("final").appendChild(o)});
function all(clause,keys){return clause.every(function(k){return keys[k]})}
function vitals(age,keys){
var out=[],T=num("v-t"),P=num("v-p"),RR=num("v-r"),S=num("v-s"),D=num("v-d"),O=num("v-o"),W=num("v-w"),H=num("v-h"),G=num("v-g"),adult=age==="adult";
function add(l,v,s,n){out.push({l:l,v:v,s:s,n:n||""})}
if(T!==null){if(T>=38){keys["v:fever"]=1;keys.fever=1;add("Temperature",T+" °C","warn","Fever")}else if(T>=37.5)add("Temperature",T+" °C","warn","Slightly raised");else if(T<36)add("Temperature",T+" °C","warn","Low");else add("Temperature",T+" °C","ok","Normal")}
if(P!==null){if(!adult)add("Pulse",P+" /min","info","Interpret by age");else if(P>100){keys["v:tachy"]=1;add("Pulse",P+" /min","warn","Fast")}else if(P<50)add("Pulse",P+" /min","warn","Slow");else add("Pulse",P+" /min","ok","Normal")}
if(RR!==null){var th=adult?22:(age==="infant"?50:40);if(RR>=th){keys["v:tachypnea"]=1;add("Breathing rate",RR+" /min","warn","Fast breathing")}else add("Breathing rate",RR+" /min","ok","Normal range")}
if(S!==null||D!==null){var bp=(S!==null?S:"?")+"/"+(D!==null?D:"?");
if(!adult)add("Blood pressure",bp,"info","Interpret by age and height");
else if(S!==null&&S<90){keys["v:hypotension"]=1;keys["v:lowbp"]=1;add("Blood pressure",bp,"danger","Low")}
else if((S!==null&&S>=180)||(D!==null&&D>=120)){keys["v:htn"]=1;keys["v:sevhtn"]=1;add("Blood pressure",bp,"danger","Very high")}
else if((S!==null&&S>=140)||(D!==null&&D>=90)){keys["v:htn"]=1;add("Blood pressure",bp,"warn","Raised")}
else if(S!==null&&S<=100){keys["v:lowbp"]=1;add("Blood pressure",bp,"warn","Low-normal, watch")}
else add("Blood pressure",bp,"ok","Normal")}
if(O!==null){if(O<90){keys["v:hypox"]=1;add("Oxygen level",O+" %","danger","Very low")}else if(O<94){keys["v:hypox"]=1;add("Oxygen level",O+" %","warn","Low")}else add("Oxygen level",O+" %","ok","Normal")}
if(W!==null&&H!==null&&H>0){var b=W/Math.pow(H/100,2),bs=b.toFixed(1);
if(!adult)add("Weight and height",W+" kg, "+H+" cm","info","BMI not interpreted for children");
else if(b<18.5){keys["v:underwt"]=1;add("BMI",bs,"warn","Underweight")}else if(b>=30){keys["v:obese"]=1;add("BMI",bs,"warn","Obese")}else if(b>=25)add("BMI",bs,"info","Overweight");else add("BMI",bs,"ok","Normal")}
else if(W!==null)add("Weight",W+" kg","info","");else if(H!==null)add("Height",H+" cm","info","");
if(G!==null){var g=$("v-gu").value==="mg"?G/18:G,sh=G+" "+($("v-gu").value==="mg"?"mg/dL":"mmol/L");
if(g<3.9){keys["v:hypogly"]=1;add("Blood sugar",sh,"danger","Low")}else if(g>=11.1){keys["v:hyperglyc"]=1;add("Blood sugar",sh,"warn","High, confirm with repeat test")}else add("Blood sugar",sh,"ok","Not high")}
return out}
var last=null;
function store(){try{return JSON.parse(localStorage.getItem("acticheck_cases")||"[]")}catch(e){return[]}}
$("final").onchange=function(){
if(!last)return;last.final=$("final").value;
try{var a=store();a.push(last);localStorage.setItem("acticheck_cases",JSON.stringify(a));$("saved").textContent="Saved on this device ("+a.length+" cases). No names or patient details are stored."}catch(e){$("saved").textContent="Could not save on this device."}
};
$("export").onclick=function(){
var a=store();if(!a.length){$("saved").textContent="No saved cases yet.";return}
function q(v){return '"'+String(v==null?"":v).replace(/"/g,'""')+'"'}
var csv="time,age,duration,symptoms,context,vitals,suggested,final\n"+a.map(function(c){return [c.time,c.age,c.dur,c.sym,c.ctx,c.vit,c.top,c.final].map(q).join(",")}).join("\n");
var l=document.createElement("a");l.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));l.download="acticheck-cases.csv";document.body.appendChild(l);l.click();l.remove();
};
$("run").onclick=function(){
var s=sel("sym"),c=sel("ctx"),t=sel("tst"),age=$("age").value,dur=$("dur").value,keys={};
for(var k in s)keys[k]=1;for(var k2 in c)keys[k2]=1;
var vit=vitals(age,keys);keys["age:"+age]=1;keys["dur:"+dur]=1;
var flags=R.flags.filter(function(f){return f.when.some(function(cl){return all(cl,keys)})});
var res=[];
R.conditions.forEach(function(d){
if(d.requires&&!all(d.requires,keys))return;
if(d.excludes&&d.excludes.some(function(x){return keys[x]}))return;
var sc=d.base||0,hits=[],pts=0;
for(var k in d.w)if(keys[k]){sc+=d.w[k];pts+=d.w[k];hits.push(R.symptoms[k].toLowerCase())}
if(d.dur){if(d.dur.indexOf(dur)>-1){if(pts>=2)sc+=2}else sc-=2}
(d.bonus||[]).forEach(function(b){if(all(b.if,keys))sc+=b.add});
if(sc>=R.threshold)res.push({d:d,sc:sc,hits:hits})});
res.sort(function(a,b){return b.sc-a.sc});
var top=res.slice(0,6),max=top.length?top[0].sc:1;
var vh="<h2>Vitals summary</h2>";
if(vit.length){vh+='<div class="vgrid">';vit.forEach(function(v){vh+='<div class="vc '+v.s+'"><div class="vl">'+v.l+'</div><div class="vv">'+v.v+'</div><div class="vn">'+v.n+'</div></div>'});vh+="</div>"}
else vh+='<p class="why">No vitals entered. Adding them makes the list more specific.</p>';
$("vitals").innerHTML=vh;
var fh="<h2>Warning signs</h2>";
if(flags.length)flags.forEach(function(f){fh+='<div class="flag"><b>'+f.name+'</b><span class="why">'+f.msg+'</span></div>'});
else fh+='<p class="why">None triggered by what you entered. Still check vitals and examine fully.</p>';
$("flags").innerHTML=fh;
var dh="";
if(!top.length)dh='<p class="why">Not enough to rank anything. Add symptoms or vitals, or consider causes outside these rules.</p>';
top.forEach(function(r){var p=Math.round(r.sc/max*100);dh+='<div class="dx"><div class="top"><span>'+r.d.n+'</span><span>'+p+'%</span></div><div class="cat">'+r.d.cat+'</div><div class="bar"><i data-w="'+p+'"></i></div><div class="why">'+r.d.why+(r.hits.length?" Matches: "+r.hits.join(", ")+".":"")+'</div></div>'});
if(!R.reviewed)dh+='<p class="why" style="margin-top:12px">Rules v'+R.version+' have not been reviewed by a doctor yet.</p>';
$("dxs").innerHTML=dh;
var need={};top.forEach(function(r){r.d.tests.forEach(function(x){need[x]=1})});flags.forEach(function(f){f.tests.forEach(function(x){need[x]=1})});
var th="",mh=[];for(var k3 in need){if(t[k3])th+="<li>"+R.tests[k3]+"</li>";else mh.push(R.tests[k3])}
$("tests").innerHTML=th||"<li>No extra tests needed from your list</li>";
var m=$("miss");m.hidden=!mh.length;m.textContent="Not available here, consider referral: "+mh.join(", ")+".";
$("saved").textContent="";
last={time:new Date().toISOString(),age:age,dur:dur,sym:Object.keys(s).join(" "),ctx:Object.keys(c).join(" "),vit:vit.map(function(v){return v.l+" "+v.v}).join("; "),top:top.map(function(r){return r.d.n}).slice(0,3).join(" | "),final:""};
var o=$("out");o.style.display="block";
o.querySelectorAll(".card").forEach(function(c){c.style.animation="none";c.offsetWidth;c.style.animation=""});
o.scrollIntoView();
setTimeout(function(){document.querySelectorAll(".bar i").forEach(function(i){i.style.width=i.dataset.w+"%"})},250);
};
function net(){$("net").textContent=navigator.onLine?"Works offline":"Offline mode"}
window.addEventListener("online",net);window.addEventListener("offline",net);net();
if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0)navigator.serviceWorker.register("sw.js");
})();
