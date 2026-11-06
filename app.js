(function(){
var R=window.ACTI_RULES,$=function(i){return document.getElementById(i)};
function chips(id,o){var h="";for(var k in o)h+='<label class="chp"><input type="checkbox" data-k="'+k+'"><span class="dot">&#10003;</span>'+o[k]+'</label>';$(id).innerHTML=h}
chips("sym",R.symptoms);chips("ctx",R.context);chips("tst",R.tests);
function sel(id){var o={};document.querySelectorAll("#"+id+" input:checked").forEach(function(i){o[i.dataset.k]=1});return o}

// ---- vitals limits: impossible numbers are blocked, unusual ones are flagged
var LIM={"v-t":{n:"Temperature",u:"\u00b0C",lo:25,hi:45,wl:35,wh:41,tip:"Adults are usually 36 to 38."},
"v-p":{n:"Pulse",u:"per min",lo:20,hi:300,wl:40,wh:180,i:1,tip:"Count beats in one minute."},
"v-r":{n:"Breathing rate",u:"per min",lo:4,hi:90,wl:8,wh:40,i:1,tip:"Count breaths in one minute."},
"v-s":{n:"BP top number",u:"mmHg",lo:40,hi:300,wl:80,wh:200,i:1,tip:"Adults are often 90 to 140."},
"v-d":{n:"BP bottom number",u:"mmHg",lo:20,hi:200,wl:40,wh:120,i:1,tip:"It must be lower than the top number."},
"v-o":{n:"Oxygen level",u:"%",lo:50,hi:100,wl:85,wh:100,i:1,tip:"Usually 95 to 100."},
"v-w":{n:"Weight",u:"kg",lo:0.3,hi:400,wl:1,wh:200,tip:"Weight is in kilograms."},
"v-h":{n:"Height",u:"cm",lo:20,hi:250,wl:45,wh:215,tip:"Height is in centimetres, not feet or inches. Adults are usually 140 to 200."},
"v-g":{n:"Blood sugar",lo:.5,hi:60,wl:2,wh:33,tip:""}};
var VAGE={"v-h":{infant:[40,100],child:[60,185]},"v-w":{infant:[1,15],child:[5,90]}};
function vcheck(id){var L=LIM[id],el=$(id),raw=(el.value||"").trim();if(raw==="")return{l:"ok"};
if(!/^\d*\.?\d+$/.test(raw))return{l:"err",m:"Enter a number only."};var v=Number(raw),lo=L.lo,hi=L.hi,wl=L.wl,wh=L.wh,u=L.u;
if(id==="v-g"){var gu=$("v-gu").value;if(!gu)return{l:"ok"};if(gu==="mg"){lo=10;hi=1100;wl=40;wh=600;u="mg/dL"}else{u="mmol/L"}}
if(v<lo||v>hi)return{l:"err",m:L.n+" must be between "+lo+" and "+hi+" "+(u||"")+". "+(L.tip||"")};
if(L.i&&v%1!==0)return{l:"err",m:"Use a whole number."};
if(id==="v-d"){var s=Number($("v-s").value);if(s&&v>=s)return{l:"err",m:"The bottom number must be lower than the top number."}}
if(id==="v-s"){var dd=Number($("v-d").value);if(dd&&dd>=v)return{l:"err",m:"The top number must be higher than the bottom number."}}
var ag=$("age").value,r=VAGE[id]&&VAGE[id][ag];if(r){wl=Math.max(wl,r[0]);wh=Math.min(wh,r[1])}
if(v<wl||v>wh)return{l:"warn",m:"This looks unusual"+(ag&&r?" for this age group":"")+". Check the number."};return{l:"ok"}}
function vshow(id){var r=vcheck(id),el=$(id),e=$("e-"+id);if(!e){e=document.createElement("div");e.id="e-"+id;e.className="verr";e.setAttribute("role","status");el.closest("label").appendChild(e)}
e.textContent=r.m||"";e.className="verr "+(r.l==="ok"?"":r.l);el.setAttribute("aria-invalid",r.l==="err");el.setAttribute("aria-describedby",e.id);return r}
function vall(){var bad=null;Object.keys(LIM).forEach(function(id){var r=vshow(id);if(r.l==="err"&&!bad)bad=id});return bad}
Object.keys(LIM).forEach(function(id){$(id).addEventListener("input",function(){vshow(id);if(id==="v-s"||id==="v-d")vshow(id==="v-s"?"v-d":"v-s")});$(id).addEventListener("blur",function(){vshow(id)})});
$("v-gu").addEventListener("change",function(){vshow("v-g")});$("age").addEventListener("change",function(){vall()});
function num(id){var v=parseFloat($(id).value);if(isNaN(v))return null;if(LIM[id]&&vcheck(id).l==="err")return null;return v}
function count(){[["sym","c-sym"],["tst","c-tst"]].forEach(function(p){var n=Object.keys(sel(p[0])).length,e=$(p[1]);e.textContent=n+" selected";e.classList.toggle("on",n>0)});
var vn=["v-t","v-p","v-r","v-s","v-o","v-w","v-h","v-g"].filter(function(i){return num(i)!==null}).length,ve=$("c-vit");ve.textContent=vn+" entered";ve.classList.toggle("on",vn>0)}
document.addEventListener("change",count);document.addEventListener("input",count);count();
document.querySelectorAll(".row").forEach(function(r){var b=r.querySelector(".rh");b.onclick=function(){var o=r.classList.toggle("open");b.setAttribute("aria-expanded",o)}});
$("start").onclick=function(){$("tool").scrollIntoView()};
$("how").onclick=function(){HOW.open()};
(function(){var p=document.createElement("option");p.value="";p.disabled=true;p.selected=true;p.textContent="Choose the confirmed diagnosis";$("final").appendChild(p)})();
R.conditions.map(function(d){return d.n}).concat(["Other or not listed","Not confirmed yet"]).forEach(function(n){var o=document.createElement("option");o.textContent=n;$("final").appendChild(o)});
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
if(G!==null&&!$("v-gu").value)add("Blood sugar",G,"info","Choose a unit to interpret");else if(G!==null){var g=$("v-gu").value==="mg"?G/18:G,sh=G+" "+($("v-gu").value==="mg"?"mg/dL":"mmol/L");
if(g<3.9){keys["v:hypogly"]=1;add("Blood sugar",sh,"danger","Low")}else if(g>=11.1){keys["v:hyperglyc"]=1;add("Blood sugar",sh,"warn","High, confirm with repeat test")}else add("Blood sugar",sh,"ok","Not high")}
return out}
var last=null;
function store(){try{return JSON.parse(localStorage.getItem("acticheck_cases")||"[]")}catch(e){return[]}}
$("final").onchange=function(){
if(!last)return;last.final=$("final").value;
try{var a=store();if(last.idx==null){a.push(last);last.idx=a.length-1}else a[last.idx]=last;localStorage.setItem("acticheck_cases",JSON.stringify(a));$("saved").textContent="Saved on this device ("+a.length+" cases).";saveFile()}catch(e){$("saved").textContent="Could not save on this device."}
};
$("export").onclick=function(){
var a=store();if(!a.length){$("saved").textContent="No saved cases yet.";return}
function q(v){return '"'+String(v==null?"":v).replace(/"/g,'""')+'"'}
var csv="time,age,duration,symptoms,context,vitals,suggested,findings,final\n"+a.map(function(c){return [c.time,c.age,c.dur,c.sym,c.ctx,c.vit,c.top,c.chk,c.final].map(q).join(",")}).join("\n");
var l=document.createElement("a");l.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));l.download="acticheck-cases.csv";document.body.appendChild(l);l.click();l.remove();
};
var ST=null;
function item(id,t,how,v,dis,nm){var dk=nm+"|"+id,hd=nm&&window.ACTI_DEMOS&&ACTI_DEMOS.has(t);return '<div class="it'+(dis?" dis":"")+'"><div class="itt">'+t+'<small>'+how+'</small>'+(hd?'<button class="dm" data-dk="'+dk+'">'+(ST.dm[dk]?"Hide demo":"Show demo")+'</button>':"")+'</div><div class="seg" role="group" aria-label="'+esc(t)+'"><button data-id="'+id+'" data-a="1" aria-pressed="'+(v===1)+'" class="'+(v===1?"on":"")+'"'+(dis?" disabled":"")+'>Yes</button><button data-id="'+id+'" data-a="-1" aria-pressed="'+(v===-1)+'" class="'+(v===-1?"on no":"")+'"'+(dis?" disabled":"")+'>No</button></div>'+(hd&&ST.dm[dk]?'<div class="demo" data-dk="'+dk+'" data-t="'+t+'"></div>':"")+'</div>'}
function score(r){var sc=r.sc,a=ST.adj[r.d.n]||{};(R.checks[r.d.n]||[]).forEach(function(it,i){var v=a["e"+i];if(v===1)sc+=it[2];else if(v===-1&&it[2]>0)sc-=it[2]});r.d.tests.forEach(function(t,i){var v=a["t"+i],w=i===0?3:1;if(v===1)sc+=w;else if(v===-1)sc-=w});return sc}
function renderDx(){
var rows=ST.top.map(function(r){return{r:r,s:score(r)}}).sort(function(a,b){return b.s-a.s}),max=Math.max.apply(null,rows.map(function(x){return x.s}).concat([1])),h="",found=[];
if(!rows.length)h='<p class="why">Not enough to rank anything. Add symptoms or vitals, or consider causes outside these rules.</p>';
rows.forEach(function(x){var r=x.r,d=r.d,a=ST.adj[d.n]||{},open=ST.open[d.n],low=x.s<R.threshold,lab=low?"Less likely now":(x.s>=0.75*max?"Most consistent":"Also consider");
h+='<div class="dx'+(low?" low":"")+'" data-n="'+d.n+'"><button class="dxh" aria-expanded="'+!!open+'"><span class="top"><span>'+esc(d.n)+'</span><span class="lp">'+lab+'</span></span><span class="cat">'+d.cat+(open?" · tap to close":" · tap to examine and test")+'</span></button><div class="bar"><i style="width:'+Math.max(4,Math.round(Math.max(x.s,0)/max*100))+'%"></i></div><div class="why">'+d.why+(r.hits.length?" Matches: "+r.hits.join(", ")+".":"")+'</div>';
(R.checks[d.n]||[]).forEach(function(it,i){if(it[3]&&a["e"+i]===1)h+='<div class="flag"><b>Urgent</b><span class="why">'+it[3]+'</span></div>'});
if(open){h+='<div class="ck"><div class="ckh">Examine</div>';
(R.checks[d.n]||[]).forEach(function(it,i){h+=item("e"+i,it[0],it[1],a["e"+i],false,d.n)});
h+='<div class="ckh">Tests</div>';
d.tests.forEach(function(t,i){var av=ST.avail[t];h+=item("t"+i,R.tests[t]+(av?"":" (not available here)"),av?"Is the result positive or abnormal?":"Consider referral.",a["t"+i],!av)});
if(!d.tests.length)h+='<p class="why">No tests needed.</p>';h+='</div>'}
h+='</div>';
(R.checks[d.n]||[]).forEach(function(it,i){if(a["e"+i])found.push(d.n+": "+it[0]+" "+(a["e"+i]===1?"yes":"no"))});
d.tests.forEach(function(t,i){if(a["t"+i])found.push(d.n+": "+R.tests[t]+" "+(a["t"+i]===1?"positive":"negative"))})});
if(!R.reviewed)h+='<p class="why" style="margin-top:12px">Rules v'+R.version+' have not been reviewed by a doctor yet. Labels show how well the findings fit, not a probability.</p>';
$("dxs").innerHTML=h;updQR();document.querySelectorAll("#dxs .demo").forEach(function(b){ACTI_DEMOS.mount(b,b.dataset.t)});if(last)last.chk=found.join("; ")}
$("dxs").addEventListener("click",function(e){if(!ST)return;var sg=e.target.closest(".seg button"),hd=e.target.closest(".dxh"),dm=e.target.closest(".dm");
if(dm){ST.dm[dm.dataset.dk]=!ST.dm[dm.dataset.dk];renderDx()}else if(sg){var n=sg.closest(".dx").dataset.n,id=sg.dataset.id,v=+sg.dataset.a,a=ST.adj[n]=ST.adj[n]||{};if(a[id]===v)delete a[id];else a[id]=v;renderDx()}
else if(hd){var m=hd.closest(".dx").dataset.n;ST.open[m]=!ST.open[m];renderDx()}});
var CID=null,KEEP=false,DRY=false,tmP,tmS;
function newId(){var c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789",s="";for(var i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return s}
var OWN=function(o,k){return Object.prototype.hasOwnProperty.call(o,k)};
function cleanCase(c){if(!c||typeof c!=="object"||Array.isArray(c))return null;var o={v:1},num=/^\d{1,4}(\.\d{1,3})?$/;
o.id=/^[A-Z0-9]{6}$/.test(c.id)?c.id:newId();o.n=String(c.n==null?"":c.n).slice(0,60);o.w=String(c.w==null?"":c.w).slice(0,40);
o.fi=(c.fi==="Other or not listed"||c.fi==="Not confirmed yet"||R.conditions.some(function(x){return x.n===c.fi}))?c.fi:"";
o.a=["adult","child","infant"].indexOf(c.a)>-1?c.a:"";o.d=["short","mid","long"].indexOf(c.d)>-1?c.d:"";
function keep(arr,map){return(Array.isArray(arr)?arr:[]).filter(function(k,i,r){return typeof k==="string"&&OWN(map,k)&&r.indexOf(k)===i})}
o.s=keep(c.s,R.symptoms);o.c=keep(c.c,R.context);o.t=keep(c.t,R.tests);o.x={};var x=c.x&&typeof c.x==="object"?c.x:{};
["t","p","r","s","d","o","w","h","g"].forEach(function(k){if(OWN(x,k)&&(typeof x[k]==="string"||typeof x[k]==="number")&&num.test(String(x[k])))o.x[k]=String(x[k])});
if(x.gu==="mmol"||x.gu==="mg")o.x.gu=x.gu;o.f={};
if(c.f&&typeof c.f==="object")R.conditions.forEach(function(d){if(OWN(c.f,d.n)&&c.f[d.n]&&typeof c.f[d.n]==="object"){var m={};Object.keys(c.f[d.n]).forEach(function(k){var v=c.f[d.n][k];if(/^[et]\d{1,2}$/.test(k)&&(v===1||v===-1))m[k]=v});o.f[d.n]=m}});
var rv=parseInt(c.rv,10),ts=Number(c.ts),pn=parseInt(c.pn,10);o.rv=rv>0&&rv<100000?rv:1;o.ts=isFinite(ts)&&ts>0&&ts<4102444800000?ts:0;o.pn=pn>0&&pn<100?pn:0;return o}
function gatherRaw(){var v={};["t","p","r","s","d","o","w","h","g"].forEach(function(k){var x=$("v-"+k).value;if(x!==""&&vcheck("v-"+k).l!=="err")v[k]=x});if($("v-gu").value)v.gu=$("v-gu").value;
return{v:1,id:CID,n:$("fname").value.trim(),w:$("fward").value.trim(),fi:last?last.final:"",a:$("age").value,d:$("dur").value,s:Object.keys(sel("sym")),c:Object.keys(sel("ctx")),t:Object.keys(sel("tst")),x:v,f:ST?ST.adj:{},pn:Math.max(PHN,RPN)}}
var REV=0,TS=0,SIG=null,FREEZE=false,QP=0,PHN=0,RPN=0,PHFOR=null;
function gather(){var d=gatherRaw();if(!FREEZE){var g=JSON.stringify(d);if(g!==SIG){SIG=g;REV++;TS=Date.now()}}d.rv=REV;d.ts=TS;return d}
function fmt(t){return t?new Date(t).toLocaleString([],{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}):"unknown time"}
function esc(x){return String(x==null?"":x).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function split(t,d){if(t.length<=520)return[t];var n=Math.ceil(t.length/480),o=[];for(var i=0;i<n;i++)o.push("ACTIP:"+CID+":"+d.rv+":"+(i+1)+"/"+n+":"+t.slice(i*480,(i+1)*480));return o}
function drawQR(){var n=ST.parts.length;$("qrbox").innerHTML=CASEQR.svg(ST.parts[QP]);$("qrpg").hidden=n<2;$("qrpn").textContent="Part "+(QP+1)+" of "+n}
function setCode(t,d){ST.code=t;ST.parts=split(t,d);if(QP>=ST.parts.length)QP=0;drawQR();$("qrts").textContent="Made "+fmt(d.ts)+" \u00b7 version "+d.rv+(ST.parts.length>1?" \u00b7 "+ST.parts.length+" QR codes":"")}
$("qrprev").onclick=function(){if(ST&&ST.parts){QP=(QP+ST.parts.length-1)%ST.parts.length;drawQR()}};$("qrnext").onclick=function(){if(ST&&ST.parts){QP=(QP+1)%ST.parts.length;drawQR()}};
function updQR(){if(!ST)return;if(!CID)CID=newId();if(PHFOR!==CID){PHFOR=CID;renderPh()}var d=gather(),pin=$("pinon").checked?$("pin").value:"",nm=d.n;$("qrid").textContent=(nm?nm+" \u00b7 ":"")+"Case "+CID;
if($("pinon").checked&&pin.length<4){ST.code="";ST.parts=null;$("qrbox").innerHTML="";$("qrpg").hidden=true;$("qrts").textContent="";$("pinmsg").textContent="Enter a PIN of 4 to 8 digits to create the locked QR.";return}
$("pinmsg").textContent=$("pinon").checked?"Locked. Share the PIN separately, never with the QR.":"";
(pin?CASEQR.encodeAsync(d,pin):Promise.resolve(CASEQR.encode(d))).then(function(t){setCode(t,d)}).catch(function(){$("pinmsg").textContent="Could not lock. Try again."})}
$("pinon").onchange=function(){if(!CASEQR.canLock()){this.checked=false;$("pinmsg").textContent="Locking needs the secure https site.";return}$("pin").hidden=!this.checked;updQR()};$("pin").oninput=function(){this.value=this.value.replace(/\D/g,"").slice(0,8);updQR()};
function fname(){var n=$("fname").value.trim();return(n||"case-"+CID).replace(/[^\w\-]+/g,"-")}
function svgPng(code,cb){var im=new Image();im.onload=function(){var c=document.createElement("canvas");c.width=c.height=600;var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,600,600);x.drawImage(im,0,0,600,600);c.toBlob(cb)};im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(CASEQR.svg(code))}
function msg(){return($("fname").value.trim()?$("fname").value.trim()+"\n":"")+"ActiCheck case "+CID+"\nIn ActiCheck tap Scan a case QR, then paste this code:\n"+ST.code}
$("qrwa").onclick=function(){if(ST&&ST.code)window.open("https://wa.me/?text="+encodeURIComponent(msg()),"_blank")};

// files
function fstore(){try{return JSON.parse(localStorage.getItem("acticheck_files")||"[]")}catch(e){return[]}}
function saveFile(){if(!$("fname").value.trim())return;if(!CID)CID=newId();var d=gather(),a=fstore(),r={id:CID,t:Date.now(),st:(d.fi&&d.fi!=="Not confirmed yet")?"Confirmed":"Draft",d:d},i=a.map(function(x){return x.id}).indexOf(CID);if(i<0)a.push(r);else a[i]=r;try{localStorage.setItem("acticheck_files",JSON.stringify(a))}catch(e){}renderFiles()}
function renderFiles(){var q=$("fsearch").value.toLowerCase(),a=fstore().filter(function(r){return!q||(r.d.n||"").toLowerCase().indexOf(q)>-1}).sort(function(x,y){return y.t-x.t}),h="";
if(!a.length)h='<p class="ew">'+(q?"No files match.":"No files yet. Name a file below to save it here.")+'</p>';
a.forEach(function(r){var d=r.d;h+='<button class="fc" data-id="'+esc(r.id)+'"><div class="fct"><span>'+esc(d.n)+'</span><span class="st'+(r.st==="Confirmed"?" cf":"")+'">'+r.st+'</span></div><div class="fcs">'+(d.w?esc(d.w)+" \u00b7 ":"")+({adult:"Adult",child:"Child",infant:"Infant"}[d.a]||"Age not set")+" \u00b7 "+(d.s||[]).length+" symptoms"+(d.pn?" \u00b7 "+d.pn+" photos":"")+(d.fi?" \u00b7 "+esc(d.fi):"")+'</div><div class="fcs">'+new Date(r.t).toLocaleString([],{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})+'</div></button><button class="fx" data-del="'+esc(r.id)+'">Delete file</button>'});
$("flist").innerHTML=h}
$("flist").addEventListener("click",function(e){var dl=e.target.closest("[data-del]"),fc=e.target.closest(".fc");
if(dl){var all=fstore(),gone=all.filter(function(r){return r.id===dl.dataset.del})[0];if(!gone)return;localStorage.setItem("acticheck_files",JSON.stringify(all.filter(function(r){return r.id!==gone.id})));renderFiles();
toast("Deleted "+(gone.d.n||"file"),function(){var cur=fstore();cur.push(gone);localStorage.setItem("acticheck_files",JSON.stringify(cur));renderFiles()},7000,function(){phAll(gone.id).then(function(rs){rs.forEach(function(r){phDel(r.id)})})})}
else if(fc){var r=fstore().filter(function(x){return x.id===fc.dataset.id})[0];if(r){applyCase(r.d);$("fname").scrollIntoView()}}});
$("fsearch").oninput=renderFiles;
function resetForm(){document.querySelectorAll("#sym input,#ctx input,#tst input").forEach(function(i){i.checked=false});["age","dur","v-gu"].forEach(function(i){$(i).value=""});["v-t","v-p","v-r","v-s","v-d","v-o","v-w","v-h","v-g","fname","fward"].forEach(function(i){$(i).value=""});REV=0;TS=0;SIG=null;QP=0;PHN=0;RPN=0;PHFOR=null;CID=null;ST=null;last=null;$("out").style.display="none";$("peek").hidden=true;count()}
$("fnew").onclick=function(){resetForm();__wz.start(0)};
function later(){clearTimeout(tmP);tmP=setTimeout(peekNow,250);clearTimeout(tmS);tmS=setTimeout(saveFile,700)}
document.querySelector("#tool").addEventListener("input",later);document.querySelector("#tool").addEventListener("change",later);
function peek(top){var p=$("peek");if(!top.length){p.hidden=true;return}top=top.slice().sort(function(x,y){return y.sc-x.sc}).slice(0,2);p.hidden=false;p.innerHTML='<div class="pkh">Leaning toward so far<span>updates as you tap</span></div>'+top.map(function(r,i){return'<div class="pkr"><b>'+r.d.n+'</b><span class="lp">'+(i?"Also consider":"Most consistent")+'</span></div>'}).join("")}
function peekNow(){if(!$("age").value||!Object.keys(sel("sym")).length){$("peek").hidden=true;return}DRY=true;try{$("run").onclick()}finally{DRY=false}}
var SV=function(p){return'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'},TI={light:SV('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>'),dark:SV('<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>'),auto:SV('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 010 16z" fill="currentColor"/>')};var TH=["light","dark","auto"];function setTheme(t){try{localStorage.setItem("acticheck_theme",t)}catch(e){}if(t==="auto")document.documentElement.removeAttribute("data-theme");else document.documentElement.setAttribute("data-theme",t);$("theme").innerHTML=TI[t];$("theme").setAttribute("aria-label","Appearance: "+t+". Tap to switch light, dark or auto.");$("theme").title="Appearance: "+t}
var cur="light";try{cur=localStorage.getItem("acticheck_theme")||"light"}catch(e){}setTheme(cur);$("theme").onclick=function(){cur=TH[(TH.indexOf(cur)+1)%3];setTheme(cur)};
renderFiles();
function applyCase(c){var sb=$("scb");if(sb)sb.hidden=true;RPN=c.pn||0;PHFOR=null;FREEZE=true;REV=c.rv||0;TS=c.ts||0;document.querySelectorAll("#sym input,#ctx input,#tst input").forEach(function(i){i.checked=false});
(c.s||[]).forEach(function(k){var e=document.querySelector('#sym input[data-k="'+k+'"]');if(e)e.checked=true});
(c.c||[]).forEach(function(k){var e=document.querySelector('#ctx input[data-k="'+k+'"]');if(e)e.checked=true});
(c.t||[]).forEach(function(k){var e=document.querySelector('#tst input[data-k="'+k+'"]');if(e)e.checked=true});
$("age").value=c.a||"";$("dur").value=c.d||"";var x=c.x||{};["t","p","r","s","d","o","w","h","g"].forEach(function(k){$("v-"+k).value=x[k]!==undefined?x[k]:""});$("v-gu").value=x.gu||"";
$("fname").value=String(c.n||"").slice(0,60);$("fward").value=String(c.w||"").slice(0,40);count();CID=c.id||newId();if(c.a){KEEP=true;$("run").click();if(c.fi){$("final").value=c.fi;if(last)last.final=c.fi}if(ST){ST.adj=c.f||{};renderDx()}}else{ST=null;$("out").style.display="none";__wz.start(0)}saveFile();FREEZE=false;SIG=JSON.stringify(gatherRaw())}
function onScanned(c){c=cleanCase(c);if(!c){toast("That case could not be read.",null,4000);return}var loc=fstore().filter(function(x){return x.id===c.id})[0];
if(loc&&(loc.d.ts||0)>(c.ts||0)){if(confirm("You already have a newer copy of "+(loc.d.n||"this case")+" on this phone (made "+fmt(loc.d.ts)+", version "+(loc.d.rv||1)+"). The QR is from "+fmt(c.ts)+" (version "+(c.rv||1)+").\n\nOK: open your newer copy.\nCancel: open the QR copy as a separate file.")){applyCase(loc.d);shown(loc.d," (you already had a newer copy)");return}c=JSON.parse(JSON.stringify(c));c.id=newId();c.n=(c.n||"Case")+" (older copy)"}
applyCase(c);shown(c,c.n.slice(-12)==="(older copy)"?" (saved as a separate file)":"")}
var tmT,tfin=null;
function toast(msg,undo,ms,fin){var t=$("toast");if(tfin){var f0=tfin;tfin=null;f0()}clearTimeout(tmT);t.innerHTML="";var s=document.createElement("span");s.textContent=msg;t.appendChild(s);
if(undo){var b=document.createElement("button");b.className="tu";b.textContent="Undo";b.onclick=function(){clearTimeout(tmT);tfin=null;t.classList.remove("on");undo()};t.appendChild(b)}
tfin=fin||null;t.classList.add("on");tmT=setTimeout(function(){t.classList.remove("on");var f=tfin;tfin=null;if(f)f()},ms||4000)}
function shown(c,note){document.body.classList.remove("onhome");if(!c.a){try{__wz.start(0)}catch(e){}}var m="Opened from QR: "+(c.n||"case "+c.id)+" \u00b7 version "+(c.rv||1)+(note||"");if(vall())m+=" \u00b7 fix the highlighted vitals";toast(m,null,5500);var b=$("scb");if(b){b.textContent=m;b.hidden=false}}
$("scan").onclick=function(){CASEQR.scan(onScanned)};
$("qrcopy").onclick=function(){if(!ST)return;var t=ST.code;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){$("qrmsg").textContent="Code copied."},function(){window.prompt("Copy this case code",t)})};
$("qrdl").onclick=function(){if(!ST)return;var l=document.createElement("a");l.href=URL.createObjectURL(new Blob([CASEQR.svg(ST.code)],{type:"image/svg+xml"}));l.download="acticheck-case-"+CID+".svg";document.body.appendChild(l);l.click();l.remove()};
function link(){return location.origin+location.pathname}
function pimg(svg){return new Promise(function(ok){var im=new Image();im.onload=function(){ok(im)};im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)})}
function cardPng(){var P=ST.parts,d=gather(),W=720,m=P.length>1,pw=m?300:420,rows=m?Math.ceil(P.length/2):1,H=250+rows*(pw+60)+150;
return Promise.all(P.map(function(p){return pimg(CASEQR.svg(p))})).then(function(ims){var c=document.createElement("canvas");c.width=W;c.height=H;var x=c.getContext("2d"),F=" Manrope,Arial,sans-serif";x.fillStyle="#fff";x.fillRect(0,0,W,H);x.fillStyle="#12273b";x.font="800 30px"+F;x.fillText("ACTICHECK PATIENT CARD",40,60);x.font="800 40px"+F;x.fillText(d.n||("Case "+CID),40,118,640);x.font="600 22px"+F;x.fillStyle="#4d6178";x.fillText((d.w?d.w+" \u00b7 ":"")+"Case "+CID,40,156,640);x.fillText("Made "+fmt(d.ts)+" \u00b7 version "+d.rv,40,190);
ims.forEach(function(im,i){var xx=m?40+(i%2)*340:(W-pw)/2,yy=220+(m?Math.floor(i/2):0)*(pw+60);x.drawImage(im,xx,yy,pw,pw);if(m){x.font="700 20px"+F;x.fillStyle="#12273b";x.fillText("Part "+(i+1)+" of "+P.length,xx,yy+pw+28)}});
x.fillStyle="#4d6178";x.font="600 20px"+F;var y0=H-110;x.fillText("Scan in ActiCheck, even offline: Scan a case QR.",40,y0,640);x.fillText(link(),40,y0+32,640);x.fillText("Holds symptoms, vitals and findings. Treat as patient data.",40,y0+64,640);
return new Promise(function(ok){c.toBlob(ok)})})}
function shareText(){var d=gather();return(d.n?d.n+"\n":"")+"ActiCheck patient card, made "+fmt(d.ts)+" (version "+d.rv+")\nOpen ActiCheck: "+link()+"\nScan the QR in the image, or tap Scan a case QR and paste:\n"+ST.parts.map(function(p,i){return(ST.parts.length>1?"Part "+(i+1)+":\n":"")+p}).join("\n")}
function dl(b,n){var l=document.createElement("a");l.href=URL.createObjectURL(b);l.download=n;document.body.appendChild(l);l.click();l.remove()}
$("qrdl").onclick=function(){if(ST&&ST.parts)cardPng().then(function(b){dl(b,"acticheck-"+fname()+".png")})};
$("qrwa").onclick=function(){if(!ST||!ST.parts)return;cardPng().then(function(b){var f=new File([b],"acticheck-"+fname()+".png",{type:"image/png"});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"ActiCheck patient card",text:shareText()}).catch(function(){});else{dl(b,"acticheck-"+fname()+".png");window.open("https://wa.me/?text="+encodeURIComponent(shareText()),"_blank")}})};
$("qrpr").onclick=function(){if(!ST||!ST.parts)return;var d=gather();$("pc").innerHTML="<h1>ACTICHECK PATIENT CARD</h1><h2>"+esc(d.n||"Case "+CID)+"</h2><p>"+(d.w?esc(d.w)+" &middot; ":"")+"Case "+CID+" &middot; Made "+esc(fmt(d.ts))+" &middot; version "+d.rv+'</p><div class="pcq">'+ST.parts.map(function(p,i){return"<div>"+CASEQR.svg(p)+(ST.parts.length>1?"<b>Part "+(i+1)+" of "+ST.parts.length+"</b>":"")+"</div>"}).join("")+"</div><p>Scan in ActiCheck, even offline: Scan a case QR.<br>"+esc(link())+"</p><p>Holds symptoms, vitals and findings. Treat as patient data.</p>";window.print()};

// ---- test result photos (stored on the phone, travel in a full file)
var DB=null;
function idb(){return DB||(DB=new Promise(function(ok,no){var r=indexedDB.open("acticheck",1);r.onupgradeneeded=function(){r.result.createObjectStore("ph",{keyPath:"id"}).createIndex("cid","cid")};r.onsuccess=function(){ok(r.result)};r.onerror=no}))}
function phAll(cid){return idb().then(function(d){return new Promise(function(ok){var q=d.transaction("ph").objectStore("ph").index("cid").getAll(cid);q.onsuccess=function(){ok(q.result.sort(function(x,y){return x.t-y.t}))};q.onerror=function(){ok([])}})}).catch(function(){return[]})}
function phPut(r){return idb().then(function(d){return new Promise(function(ok){var t=d.transaction("ph","readwrite");t.objectStore("ph").put(r);t.oncomplete=ok;t.onerror=ok})})}
function phDel(id){return idb().then(function(d){return new Promise(function(ok){var t=d.transaction("ph","readwrite");t.objectStore("ph").delete(id);t.oncomplete=ok})})}
function squeeze(f){return new Promise(function(ok){var im=new Image(),u=URL.createObjectURL(f),done=false;function fin(b){if(!done){done=true;ok(b||f)}}
im.onload=function(){try{var m=1280,s=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);var x=c.getContext("2d");if(!x)return fin();x.drawImage(im,0,0,c.width,c.height);c.toBlob(function(b){fin(b&&b.size<f.size?b:f)},"image/jpeg",.72)}catch(e){fin()}};im.onerror=function(){fin()};setTimeout(fin,8000);im.src=u})}
var PU=[],PD={};
function renderPh(){if(!CID){PHN=0;$("phgrid").innerHTML="";return}var cid=CID;if(!$("phgrid").children.length)$("phgrid").innerHTML='<div class="sk"></div><div class="sk"></div><div class="sk"></div>';phAll(cid).then(function(rs){if(cid!==CID)return;rs=rs.filter(function(r){return!PD[r.id]});PHN=rs.length;PU.forEach(function(u){URL.revokeObjectURL(u)});PU=[];
$("phgrid").innerHTML=rs.map(function(r){var u=URL.createObjectURL(r.blob);PU.push(u);return'<div class="pht"><button class="phb" data-id="'+esc(r.id)+'" aria-label="View photo"><img src="'+u+'" alt="'+esc(r.l||"Test result photo")+'"></button><span>'+esc(r.l||"Photo")+'</span><button class="phx" data-x="'+esc(r.id)+'" aria-label="Delete photo">&times;</button></div>'}).join("");
$("phmsg").textContent=RPN>PHN?"This case came with "+RPN+" photo"+(RPN>1?"s":"")+" that are not on this phone. Ask the sender for the full file.":""})}
function addPh(files){if(!files.length)return;if(!$("fname").value.trim()){$("phmsg").textContent="Name the file first (Patient step), so the photos stay with it.";return}if(!CID)CID=newId();var lab=(prompt("What are these? For example: Malaria test, blood count (optional)")||"").slice(0,60);$("phmsg").textContent="Saving...";
var cid=CID;Promise.all([].map.call(files,function(f){return squeeze(f).then(function(b){return phPut({id:newId()+newId(),cid:cid,l:lab.trim(),t:Date.now(),blob:b})})})).then(function(){$("phmsg").textContent="";renderPh();setTimeout(function(){updQR();saveFile()},400)})}
$("phcam").onchange=function(){addPh(this.files);this.value=""};$("phgal").onchange=function(){addPh(this.files);this.value=""};
$("phgrid").addEventListener("click",function(e){var x=e.target.closest("[data-x]"),b=e.target.closest(".phb");
if(x){var pid=x.dataset.x;PD[pid]=true;renderPh();setTimeout(function(){updQR();saveFile()},400);toast("Photo deleted",function(){delete PD[pid];renderPh();setTimeout(function(){updQR();saveFile()},400)},6500,function(){if(PD[pid])phDel(pid).then(function(){delete PD[pid]})})}
else if(b){var im=b.querySelector("img");$("phvi").src=im.src;$("phvc").textContent=im.alt;$("phv").hidden=false}});
$("phgrid").addEventListener("load",function(e){if(e.target&&e.target.tagName==="IMG")e.target.classList.add("ld")},true);
$("phvx").onclick=function(){$("phv").hidden=true};$("phv").onclick=function(e){if(e.target===this)this.hidden=true};
// full file: case plus photos in one file, optionally locked with the PIN
function blobData(b){return new Promise(function(ok){var r=new FileReader();r.onload=function(){ok(r.result)};r.readAsDataURL(b)})}
function dataBlob(u){var p=u.split(","),m=/data:([^;]+)/.exec(p[0]),bs=atob(p[1]),n=new Uint8Array(bs.length);for(var i=0;i<bs.length;i++)n[i]=bs.charCodeAt(i);return new Blob([n],{type:m?m[1]:"image/jpeg"})}
$("qrfull").onclick=function(){if(!ST)return;var d=gather(),pin=$("pinon").checked?$("pin").value:"",cid=CID;if($("pinon").checked&&pin.length<4){$("qrmsg").textContent="Enter a PIN of 4 to 8 digits first.";return}$("qrmsg").textContent="Preparing the full file...";
phAll(cid).then(function(rs){return Promise.all(rs.map(function(r){return blobData(r.blob).then(function(u){return{id:r.id,l:r.l,t:r.t,u:u}})}))}).then(function(ps){var bun={v:1,fmt:"acticheck-file",c:d,p:ps};return pin?CASEQR.encodeAsync(bun,pin):JSON.stringify(bun)}).then(function(txt){var n="acticheck-"+fname()+".acticheck",f=new File([txt],n,{type:"application/octet-stream"});$("qrmsg").textContent="";
if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"ActiCheck full file",text:"ActiCheck full file for "+(d.n||"a patient")+" with "+ps0(txt)+". Open ActiCheck, go to Patient files, tap Open a full file."}).catch(function(){});else dl(f,n)})};
function ps0(t){return"photos included"}
$("fimp").onchange=function(){var f=this.files[0];this.value="";if(!f)return;if(f.size>40*1024*1024){alert("That file is too large to open.");return}var r=new FileReader();r.onload=function(){var t=String(r.result).trim();
(t.indexOf("ACTI2:")===0?CASEQR.decodeAsync(t,prompt("This file is locked. Enter the PIN")||""):Promise.resolve(JSON.parse(t))).then(function(b){if(!b||b.fmt!=="acticheck-file"||!b.c)throw 0;var cc=cleanCase(b.c);if(!cc)throw 0;var ps=(Array.isArray(b.p)?b.p:[]).slice(0,60).filter(function(p){return p&&/^[A-Za-z0-9]{1,24}$/.test(p.id)&&typeof p.u==="string"&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(p.u)&&p.u.length<9000000});
return Promise.all(ps.map(function(p){return phPut({id:p.id,cid:cc.id,l:String(p.l==null?"":p.l).slice(0,60),t:Number(p.t)||0,blob:dataBlob(p.u)})})).then(function(){cc.pn=ps.length;onScanned(cc)})}).catch(function(){alert("That file could not be opened. Check the PIN and try again.")})};r.readAsText(f)};
// welcome for new users, then the home screen guide
function welcome(){var w=document.createElement("div");w.className="wl";w.setAttribute("role","dialog");w.setAttribute("aria-modal","true");w.setAttribute("aria-label","Welcome");
w.innerHTML='<div class="wlc"><h3>Hello. Are you new to ActiCheck?</h3><p>If you are, I will show you how to add it to your home screen. Then it opens like a normal app and works without internet.</p><button class="b b1" id="wly">Yes, I am new<i>&#8594;</i></button><button class="b b2" id="wln">No, I know it<i>&#8594;</i></button></div>';document.body.appendChild(w);
function cl(){w.remove()}$("wly").onclick=function(){cl();HOW.open(ios?"ios":"and")};$("wln").onclick=function(){try{localStorage.setItem("acticheck_guide_seen","1")}catch(e){}cl()};$("wly").focus();
document.addEventListener("keydown",function k(e){if(e.key==="Escape"){cl();document.removeEventListener("keydown",k)}})}
$("run").onclick=function(){if(!DRY){var vb2=vall();if(vb2){toast("Some vitals are not possible. Fix them first.",null,4000);try{__wz.start(2)}catch(e){}return}}
if(!DRY){if(last&&last.final&&!KEEP)CID=null;KEEP=false}var s=sel("sym"),c=sel("ctx"),t=sel("tst"),age=$("age").value,dur=$("dur").value,keys={};
$("age-err").hidden=!!age;if(!age){if(window.__wz)__wz.start(0);$("age-err").scrollIntoView();return}
for(var k in s)keys[k]=1;for(var k2 in c)keys[k2]=1;
var vit=vitals(age,keys);keys["age:"+age]=1;if(dur)keys["dur:"+dur]=1;
var flags=R.flags.filter(function(f){return f.when.some(function(cl){return all(cl,keys)})});
var res=[];
R.conditions.forEach(function(d){
if(d.requires&&!all(d.requires,keys))return;
if(d.excludes&&d.excludes.some(function(x){return keys[x]}))return;
var sc=d.base||0,hits=[],pts=0;
for(var k in d.w)if(keys[k]){sc+=d.w[k];pts+=d.w[k];hits.push(R.symptoms[k].toLowerCase())}
if(d.dur&&dur){if(d.dur.indexOf(dur)>-1){if(pts>=2)sc+=2}else sc-=2}
(d.bonus||[]).forEach(function(b){if(all(b.if,keys))sc+=b.add});
if(sc>=R.threshold)res.push({d:d,sc:sc,hits:hits})});
res.sort(function(a,b){return b.sc-a.sc});
var top=res.slice(0,6),max=top.length?top[0].sc:1;
if(DRY){peek(top);return}
var vh="<h2>Vitals summary</h2>";
if(vit.length){vh+='<div class="vgrid">';vit.forEach(function(v){vh+='<div class="vc '+v.s+'"><div class="vl">'+v.l+'</div><div class="vv">'+v.v+'</div><div class="vn">'+v.n+'</div></div>'});vh+="</div>"}
else vh+='<p class="why">No vitals entered. Adding them makes the list more specific.</p>';
$("vitals").innerHTML=vh;
var fh="<h2>Warning signs</h2>";
if(flags.length)flags.forEach(function(f){fh+='<div class="flag"><b>'+f.name+'</b><span class="why">'+f.msg+'</span></div>'});
else fh+='<p class="why">None triggered by what you entered. Still check vitals and examine fully.</p>';
$("flags").innerHTML=fh;
ST={top:top,adj:{},open:{},dm:{},avail:t};renderDx();
var need={};top.forEach(function(r){r.d.tests.forEach(function(x){need[x]=1})});flags.forEach(function(f){f.tests.forEach(function(x){need[x]=1})});
var th="",mh=[];for(var k3 in need){if(t[k3])th+="<li>"+R.tests[k3]+"</li>";else mh.push(R.tests[k3])}
$("tests").innerHTML=th||"<li>No extra tests needed from your list</li>";
var m=$("miss");m.hidden=!mh.length;m.textContent="Not available here, consider referral: "+mh.join(", ")+".";
$("saved").textContent="";$("final").selectedIndex=0;
last={time:new Date().toISOString(),age:age,dur:dur,sym:Object.keys(s).join(" "),ctx:Object.keys(c).join(" "),vit:vit.map(function(v){return v.l+" "+v.v}).join("; "),top:top.map(function(r){return r.d.n}).slice(0,3).join(" | "),chk:"",final:""};
var o=$("out");o.style.display="block";$("fhome").hidden=true;$("wiz").hidden=true;
o.querySelectorAll(".card").forEach(function(c){c.style.animation="none";c.offsetWidth;c.style.animation=""});
o.scrollIntoView();

};
function net(){$("net").textContent=navigator.onLine?"Works offline":"Offline mode"}
window.addEventListener("online",net);window.addEventListener("offline",net);net();
if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0)navigator.serviceWorker.register("sw.js");
var WR=[],WP=0,WT=[["Name this file","So you can find it again and not mix up patients.","Next: Symptoms"],["What is the patient feeling?","Tap all that apply. Nothing is filled in for you.","Next: Vitals"],["Any measurements?","All optional. Enter what you measured.","Next: Tests"],["Which tests can you do?","Tick what your clinic can do. Nothing is assumed.","Review"],["Check before you continue","Tap Edit to change anything. Then see the possibilities.","Show possibilities"]];
(function(){var rows=[].slice.call(document.querySelectorAll("#wiz .row"));rows[1].parentNode.insertBefore(rows[2],rows[1]);WR=[rows[0],rows[2],rows[1],rows[3]];
WR.forEach(function(r,i){r.classList.add("open");var d=document.createElement("div");d.innerHTML='<h2 class="wt" tabindex="-1">'+WT[i][0]+'</h2><p class="ws">'+WT[i][1]+'</p>';r.insertBefore(d,r.firstChild)});
var rv=document.createElement("div");rv.id="rvw";rv.className="row";rv.innerHTML='<div class="rvbody"></div>';WR.push(rv);$("wiz").insertBefore(rv,$("wiz").querySelector(".go"));
var hd=document.createElement("div");hd.className="wzh";hd.id="wzh";hd.innerHTML='<button class="ib" id="wzback" aria-label="Back"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button><div class="wzs" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div><span class="wzn"></span>';
$("wiz").insertBefore(hd,$("wiz").firstChild);
var ft=document.createElement("div");ft.className="wzf";ft.innerHTML='<div class="st2" id="wzst"></div><button class="b b1" id="wznext"></button>';$("wiz").appendChild(ft)})();
function wzGo(i){WP=i;WR.forEach(function(r){r.classList.remove("cur")});WR[i].classList.add("cur");[].forEach.call(document.querySelectorAll(".wzs span"),function(s,k){s.className=k<=i?"on":""});document.querySelector(".wzn").textContent=(i+1)+" of 5";
$("wznext").innerHTML=WT[i][2]+'<i>&#8594;</i>';$("wzst").textContent=($("fname").value.trim()||"New file")+(i===1?" \u00b7 "+Object.keys(sel("sym")).length+" selected":"");
if(i===4)wzReview();var t=WR[i].querySelector(".wt");if(t){t.focus({preventScroll:true})}$("tool").scrollIntoView()}
function wzReview(){var L=function(o,m){return Object.keys(o).map(function(k){return m[k]}).join(", ")||"None"},vt=[["v-t","Temperature","\u00b0C"],["v-p","Pulse",""],["v-r","Breathing",""],["v-o","Oxygen","%"],["v-w","Weight","kg"],["v-h","Height","cm"],["v-g","Sugar",""]].filter(function(x){return $(x[0]).value!==""&&vcheck(x[0]).l!=="err"}).map(function(x){return x[1]+" "+$(x[0]).value+x[2]});if($("v-s").value||$("v-d").value)vt.unshift("BP "+($("v-s").value||"?")+"/"+($("v-d").value||"?"));
var ag={adult:"Adult",child:"Child under 12",infant:"Infant under 1"}[$("age").value]||"",du=$("dur").value?{short:"symptoms under 3 days",mid:"symptoms 3 to 14 days",long:"symptoms over 14 days"}[$("dur").value]:"",cx=L(sel("ctx"),R.context);
function S(t,b,p){return'<div class="rv"><div class="rvh"><b>'+t+'</b><button class="ed" data-pg="'+p+'" aria-label="Edit '+t+'">Edit</button></div><div class="rvb">'+b+'</div></div>'}
WR[4].innerHTML='<h2 class="wt" tabindex="-1">'+WT[4][0]+'</h2><p class="ws">'+WT[4][1]+'</p>'+S("Patient",esc($("fname").value.trim()||"Unnamed")+(esc($("fward").value.trim())?", "+esc($("fward").value.trim()):"")+"<br>"+ag+(du?", "+du:"")+(cx!=="None"?"<br>"+cx:""),0)+S("Symptoms ("+Object.keys(sel("sym")).length+")",L(sel("sym"),R.symptoms),1)+S("Vitals",esc(vt.join(", ")||"None entered"),2)+S("Tests available",L(sel("tst"),R.tests),3)+'<div class="ws" style="margin-top:6px">Draft saved on this device.</div>'}
$("wiz").addEventListener("click",function(e){var ed=e.target.closest(".ed");if(ed)wzGo(+ed.dataset.pg)});
$("wznext").onclick=function(){if(WP===0){var er=$("age-err");if(!$("fname").value.trim()){er.textContent="Give this file a name, like Bed 4.";er.hidden=false;$("fname").focus();return}if(!$("age").value){er.textContent="Choose an age group first.";er.hidden=false;$("age").focus();return}er.hidden=true}
if(WP===2){var vb=vall();if(vb){toast("Fix the highlighted numbers first",null,3500);$(vb).focus();return}}if(WP===4){$("run").click();return}wzGo(WP+1);if(WP===4)saveFile()};
$("wzback").onclick=function(){if(WP===0){saveFile();wzHome()}else wzGo(WP-1)};
function wzHome(){$("wiz").hidden=true;$("out").style.display="none";$("fhome").hidden=false;renderFiles();$("tool").scrollIntoView()}
window.__wz={start:function(i){$("fhome").hidden=true;$("out").style.display="none";$("wiz").hidden=false;wzGo(i||0)}};
$("edit").onclick=function(){$("out").style.display="none";__wz.start(4)};$("tofiles").onclick=function(){saveFile();wzHome()};
var standalone=(window.matchMedia&&matchMedia("(display-mode: standalone)").matches)||navigator.standalone,ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__ip=e});
$("inst").onclick=function(){HOW.open(ios?"ios":"and")};if(standalone)$("inst").hidden=true;
try{if(!standalone&&!localStorage.getItem("acticheck_guide_seen"))setTimeout(welcome,1200);else if(standalone&&!localStorage.getItem("acticheck_tour_seen"))setTimeout(function(){HOW.open()},1200)}catch(e){}

// ---- pages: home is its own first page; files, clerking and results follow it
var CURV="home",SILENT=false,TT={files:"Patient files",wiz:"Clerking",out:"Results"};
function viewNow(){if(document.body.classList.contains("onhome"))return"home";if(!$("fhome").hidden)return"files";if(!$("wiz").hidden)return"wiz";return $("out").style.display==="block"?"out":"files"}
function paint(){var v=CURV;$("ptitle").textContent=TT[v]||"";window.scrollTo(0,0)}
function applyView(v){SILENT=true;if(v==="home")document.body.classList.add("onhome");else{document.body.classList.remove("onhome");
$("fhome").hidden=v!=="files";$("wiz").hidden=v!=="wiz";$("out").style.display=(v==="out"&&ST)?"block":"none";if(v==="out"&&!ST){$("fhome").hidden=false;v="files"}}
CURV=v;paint();setTimeout(function(){SILENT=false},0)}
new MutationObserver(function(){if(SILENT)return;var v=viewNow();if(v!==CURV){CURV=v;history.pushState({v:v},"","#"+v);paint()}}).observe(document.body,{attributes:true,subtree:true,attributeFilter:["hidden","class","style"]});
window.addEventListener("popstate",function(e){var v=(e.state&&e.state.v)||"home";if(v==="wiz"&&$("wiz").hidden&&!fstore().length&&!$("fname").value)v="home";applyView(v)});
history.replaceState({v:"home"},"","#home");
$("back").onclick=function(){if(history.state&&history.state.v&&history.state.v!=="home")history.back();else applyView("home")};
$("start").onclick=function(){if(fstore().length){document.body.classList.remove("onhome");wzHome()}else{resetForm();document.body.classList.remove("onhome");__wz.start(0)}};
})();