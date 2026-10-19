/* ActiCheck exam demos. Add a demo by adding an entry keyed by the exact exam item text in rules.js.
   Kinds: front (hand moves to body points), face (eye, yellow, smile, throat, tongue), arms, leg (slr), pit. All drawn in code, work offline.
   Every demo must be checked by a doctor before real use. */
(function(){
var SK="#9C6B4B",SD="#7C533A",HD="#E5C3A0",NS="http://www.w3.org/2000/svg";
var P={ruq:[160,160],luq:[220,160],rlq:[160,192],llq:[220,192],epi:[190,152],sp:[190,200],lr:[155,92],ll:[225,92],br:[155,128],bl:[225,128],kr:[160,150],kl:[220,150]};
var BASE={
front:'<rect x="125" y="62" width="130" height="152" rx="38" fill="#5B8DB8"/><circle cx="190" cy="32" r="24" fill="'+SK+'"/><rect x="178" y="52" width="24" height="14" fill="'+SK+'"/><path d="M122 80 L86 190 M258 80 L294 190" stroke="'+SK+'" stroke-width="16" stroke-linecap="round"/><path d="M125 135 H255 M190 135 V214" stroke="#fff" stroke-opacity=".4" stroke-dasharray="3 4"/>',
face:'<circle cx="190" cy="112" r="84" fill="'+SK+'"/><path d="M110 92 Q190 28 270 92 Q250 56 190 52 Q130 56 110 92Z" fill="#2B1D16"/>',
arms:'<rect x="125" y="70" width="130" height="150" rx="38" fill="#5B8DB8"/><circle cx="190" cy="40" r="24" fill="'+SK+'"/>',
leg:'<rect x="30" y="186" width="320" height="10" rx="4" fill="#D9D6CF"/><path d="M60 140 L330 150 L332 176 L60 172Z" fill="'+SK+'"/><path d="M330 150 q18 2 16 16 q-2 12 -14 10Z" fill="'+SK+'"/>'
};
var D={};
function front(c,p,k){return{b:"front",c:c,p:p,k:k||"press"}}
D["Tender belly"]=front(["Press gently, upper right.","Upper left.","Lower left.","Lower right. Ask about pain at each spot."],["ruq","luq","llq","rlq"]);
D["Tender above the pubic bone"]=front(["Press gently just above the pubic bone.","Ask if it hurts."],["sp","sp"]);
D["Tender at the top of the belly"]=front(["Press just below the breastbone.","Ask if it hurts."],["epi","epi"]);
D["Tender in the lower right belly"]=front(["Start away from the sore spot.","Press gently in the lower right belly.","Watch the face for pain."],["llq","rlq","rlq"]);
D["Pain on quick release (rebound)"]=front(["Press slowly and deeply, lower right.","Release fast. Sudden sharp pain is positive."],["rlq","rlq"],"rebound");
D["Enlarged or tender spleen"]=front(["Start low on the left.","Move up toward the left ribs as the patient breathes in."],["llq","luq"]);
D["Tender enlarged liver"]=front(["Start low on the right.","Move up under the right ribs as the patient breathes in."],["rlq","ruq"]);
D["Belly soft, not rigid"]=front(["Press gently all over.","A soft belly gives. A rigid one stays hard."],["ruq","llq"]);
D["Crackles or bronchial breathing"]=front(["Listen at the top of the right lung.","Then the left.","Then both lung bases."],["lr","ll","br"],"listen");
D["Crackles at both lung bases"]=front(["Listen at the right base.","Then the left base."],["br","bl"],"listen");
D["Wheeze on both sides when breathing out"]=front(["Listen on the right.","Then the left. Ask the patient to breathe out fully."],["lr","ll"],"listen");
D["Dull note on tapping"]=front(["Tap over the right chest.","Tap over the left. A dull note is abnormal."],["br","bl"],"tap");
D["Tender over the back below the ribs"]=front(["Patient sits. Tap gently over the right kidney area at the back.","Then the left."],["kr","kl"],"tap");
D["Pale inside the lower eyelids"]={b:"face",k:"lid",c:["Gently pull down the lower eyelid.","Pink inside is normal. Pale or white suggests anaemia."]};
D["Pale palms or nail beds"]=D["Pale inside the lower eyelids"];
D["Yellow eyes"]={b:"face",k:"yel",c:["Look at the whites of the eyes in daylight.","Yellow whites suggest jaundice."]};
D["Face droops when smiling"]={b:"face",k:"smile",c:["Ask the patient to smile.","One side drooping is abnormal."]};
D["Red throat without pus"]={b:"face",k:"throat",c:["Ask the patient to open wide.","Look at the throat and tonsils for redness or pus."]};
D["Coated tongue"]={b:"face",k:"tongue",c:["Ask the patient to stick out the tongue.","Look for a thick white coat."]};
D["Arm drifts down when held up"]={b:"arms",c:["Ask the patient to hold both arms up, eyes closed.","Watch for 10 seconds.","One arm sinking is abnormal."]};
D["Pitting ankle swelling"]={b:"leg",k:"pit",c:["Press firmly over the shin with your thumb.","Hold for 5 seconds.","Release. A dent that stays is pitting."]};
D["Swollen ankles"]=D["Pitting ankle swelling"];
D["Pain on straight leg raise"]={b:"leg",k:"slr",c:["Patient lies flat, knee straight.","Lift the straight leg slowly.","Leg pain between 30 and 70° is positive. Back pain alone does not count.","Lower the leg slowly."]};
function el(t,a,h){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(h)e.innerHTML=h;return e}
function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
function lerp(a,b,u){return a+(b-a)*u}
window.ACTI_DEMOS={has:function(t){return!!D[t]},mount:function(box,text){
var d=D[text];if(!d)return;var n=d.c.length,S=el("svg",{viewBox:"0 0 380 230",width:"100%",role:"img","aria-label":text});
S.innerHTML=BASE[d.b==="leg"?"leg":d.b];
var dyn=el("g",{});S.appendChild(dyn);box.innerHTML="";box.appendChild(S);
var cap=document.createElement("div");cap.className="dcap";var bar=document.createElement("div");bar.className="dbar";
for(var i=0;i<n;i++)bar.appendChild(document.createElement("span"));box.appendChild(bar);box.appendChild(cap);
var t=0,last=null,run=true,TOT=2800*n,hand=el("circle",{r:10,fill:HD,stroke:"#B08A66","stroke-width":.5}),ring=el("circle",{r:6,fill:"none",stroke:"#D6453D","stroke-width":2,opacity:0});
dyn.appendChild(ring);dyn.appendChild(hand);var fx=el("g",{});dyn.appendChild(fx);
S.onclick=function(){run=!run};
function frame(now){if(!box.isConnected)return;if(last!==null&&run)t=(t+(now-last)/TOT)%1;last=now;
var s=Math.min(n-1,Math.floor(t*n)),u=t*n-s;cap.textContent=d.c[s];Array.prototype.forEach.call(bar.children,function(b,i){b.className=i===s?"on":""});
var k=d.k,e=ease(Math.min(1,u*2.5));fx.innerHTML="";hand.setAttribute("opacity",1);ring.setAttribute("opacity",0);
if(d.b==="front"){var a=P[d.p[(s+n-1)%n]],b=P[d.p[s]],x=lerp(a[0],b[0],e),y=lerp(a[1],b[1],e);
hand.setAttribute("cx",x);hand.setAttribute("cy",y);hand.setAttribute("r",k==="listen"?9:10);hand.setAttribute("fill",k==="listen"?"#555":HD);
if(k==="tap")hand.setAttribute("cy",y-4*Math.abs(Math.sin(u*Math.PI*6)));
if(k==="rebound"){if(s===0){hand.setAttribute("r",lerp(10,8,u))}else{hand.setAttribute("r",10+(u<.15?0:Math.min(6,(u-.15)*20)));if(u>.15)fx.appendChild(el("circle",{cx:x,cy:y,r:18*(u-.15)+8,fill:"none",stroke:"#D6453D","stroke-width":3,opacity:1-u}))}}
else if(u>.4){ring.setAttribute("cx",x);ring.setAttribute("cy",y);ring.setAttribute("r",8+10*(u-.4));ring.setAttribute("opacity",.8*(1-u))}}
else if(d.b==="face"){hand.setAttribute("opacity",0);var h="";
if(k==="lid"){var dn=s===1?1:ease(Math.min(1,u*1.6)),pale=s===1&&u>.5;h='<ellipse cx="150" cy="105" rx="22" ry="11" fill="#fff"/><circle cx="150" cy="103" r="7" fill="#2B1D16"/><ellipse cx="230" cy="105" rx="22" ry="11" fill="#fff"/><circle cx="230" cy="103" r="7" fill="#2B1D16"/><path d="M128 112 Q150 '+(114+14*dn)+' 172 112" fill="'+(pale?"#F1D9D2":"#E07A7A")+'" stroke="#7C533A"/><circle cx="150" cy="'+(122+8*dn)+'" r="9" fill="'+HD+'" opacity="'+(s===0?1:0)+'"/><text x="190" y="205" text-anchor="middle" font-size="13" fill="currentColor">'+(s===1?(pale?"Pale: possible anaemia":"Pink: normal"):"")+"</text>"}
if(k==="yel"){var y2=s===1&&u>.4;h='<ellipse cx="150" cy="105" rx="24" ry="12" fill="'+(y2?"#E8D44A":"#fff")+'"/><circle cx="150" cy="105" r="8" fill="#2B1D16"/><ellipse cx="230" cy="105" rx="24" ry="12" fill="'+(y2?"#E8D44A":"#fff")+'"/><circle cx="230" cy="105" r="8" fill="#2B1D16"/><text x="190" y="205" text-anchor="middle" font-size="13" fill="currentColor">'+(y2?"Yellow whites: jaundice":"White: normal")+"</text>"}
if(k==="smile"){var sm=s===1?ease(Math.min(1,u*1.5)):0;h='<circle cx="150" cy="100" r="7" fill="#2B1D16"/><circle cx="230" cy="100" r="7" fill="#2B1D16"/><path d="M140 150 Q190 '+(150+30*sm)+' 240 '+(150-(s===1&&u>.5?16:0))+'" fill="none" stroke="#2B1D16" stroke-width="5" stroke-linecap="round"/><text x="190" y="205" text-anchor="middle" font-size="13" fill="currentColor">'+(s===1&&u>.5?"Right side droops: abnormal":"")+"</text>"}
if(k==="throat"){h='<ellipse cx="190" cy="148" rx="'+(s===0?20:50)+'" ry="'+(s===0?8:34)+'" fill="#3A1414"/>'+(s===1?'<circle cx="152" cy="138" r="10" fill="#C94A4A"/><circle cx="228" cy="138" r="10" fill="#C94A4A"/>':"")}
if(k==="tongue"){h='<path d="M150 140 Q190 150 230 140 L230 170 Q190 205 150 170Z" fill="#D26A6A"/>'+(s===1?'<path d="M158 146 Q190 154 222 146 L222 168 Q190 192 158 168Z" fill="#F3F0E6"/>':"")}
fx.innerHTML=h}
else if(d.b==="arms"){var dr=s===0?0:s===1?ease(u)*16:16;
fx.innerHTML='<path d="M135 82 L95 24" stroke="'+SK+'" stroke-width="16" stroke-linecap="round"/><path d="M245 82 L285 '+(24+dr*2.4).toFixed(0)+'" stroke="'+SK+'" stroke-width="16" stroke-linecap="round" transform="rotate('+(dr*.6)+' 245 82)"/><text x="190" y="224" text-anchor="middle" font-size="13" fill="currentColor">'+(s===2?"Right arm sinks: abnormal":"")+"</text>";hand.setAttribute("opacity",0)}
else if(k==="pit"){var px=200,py=s===0?lerp(110,142,e):s===1?142:lerp(142,110,e);
fx.innerHTML=(s===2&&u>.3?'<ellipse cx="200" cy="146" rx="9" ry="3" fill="'+SD+'"/>':"")+(s===1?'<text x="200" y="100" text-anchor="middle" font-size="16" fill="currentColor">'+(5-Math.floor(u*5))+"</text>":"");hand.setAttribute("cx",px);hand.setAttribute("cy",py)}
else if(k==="slr"){var an=s===0?0:s===1?55*ease(u):s===2?55:55*(1-ease(u));
fx.innerHTML='<path d="M60 150 L'+(60+270*Math.cos(30*Math.PI/180)).toFixed(0)+' '+(150-270*Math.sin(30*Math.PI/180)).toFixed(0)+'" stroke="#C48A1A" stroke-dasharray="4 4" stroke-width=".7"/><path d="M60 150 L'+(60+270*Math.cos(70*Math.PI/180)).toFixed(0)+' '+(150-270*Math.sin(70*Math.PI/180)).toFixed(0)+'" stroke="#C48A1A" stroke-dasharray="4 4" stroke-width=".7"/><g transform="rotate('+(-an).toFixed(1)+' 60 150)"><path d="M60 140 L330 150 L332 176 L60 172Z" fill="#B9805A"/><rect x="300" y="165" width="36" height="14" rx="7" fill="'+HD+'"/>'+(an>=30&&s>=1&&s<=2?'<path d="M72 160 Q170 165 300 158" stroke="#D6453D" stroke-width="3" stroke-dasharray="4 5" fill="none"/>':"")+'</g><text x="40" y="30" font-size="14" fill="currentColor">Leg angle: '+Math.round(an)+"°</text>";hand.setAttribute("opacity",0)}
requestAnimationFrame(frame)}
requestAnimationFrame(frame)}};
})();
