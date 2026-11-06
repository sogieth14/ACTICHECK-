/* UX polish: swipe down to dismiss sheets, and the phone's back button closes a sheet before leaving the page. */
(function(){
var SH=[{o:".hw",c:".hwc",h:".hwh",x:".hwx",open:function(e){return e.classList.contains("open")}},
{o:".sm",c:".smc",h:".smc",x:".smx",open:function(e){return e.classList.contains("open")}},
{o:"#phv",c:"#phvi",h:"#phv",x:"#phvx",open:function(e){return!e.hidden}}];
function bind(e,s){if(e.__ux)return;e.__ux=1;var card=e.querySelector(s.c),hd=e.querySelector(s.h)||e;if(!card)return;
var y0=null,dy=0,t0=0,sc=null;
hd.addEventListener("touchstart",function(ev){if(ev.target.closest&&ev.target.closest("button,input,textarea,a,select")&&s.o!=="#phv")return;
if(s.h===".smc"){var sx=card.scrollTop;if(sx>0)return}
y0=ev.touches[0].clientY;dy=0;t0=Date.now();card.style.transition="none"},{passive:true});
hd.addEventListener("touchmove",function(ev){if(y0===null)return;dy=Math.max(0,ev.touches[0].clientY-y0);card.style.transform="translateY("+dy+"px)";e.style.background="rgba(8,16,24,"+(.6*Math.max(.2,1-dy/500))+")"},{passive:true});
hd.addEventListener("touchend",function(){if(y0===null)return;var v=dy/Math.max(1,Date.now()-t0);y0=null;card.style.transition="transform .25s cubic-bezier(.2,.7,.2,1)";
if(dy>110||(dy>40&&v>.6)){card.style.transform="translateY(110%)";setTimeout(function(){var b=e.querySelector(s.x);if(b)b.click();card.style.transform="";card.style.transition="";e.style.background=""},220)}
else{card.style.transform="";e.style.background="";setTimeout(function(){card.style.transition=""},260)}dy=0})}
function scan(){SH.forEach(function(s){document.querySelectorAll(s.o).forEach(function(e){bind(e,s)})})}
function openSheets(){var r=[];SH.forEach(function(s){document.querySelectorAll(s.o).forEach(function(e){if(s.open(e))r.push({e:e,s:s})})});return r}
var pushed=false,skip=false;
new MutationObserver(function(){scan();var n=openSheets().length;
if(n>0&&!pushed){history.pushState({m:1},"");pushed=true}
else if(n===0&&pushed){pushed=false;if(history.state&&history.state.m){skip=true;history.back()}}
}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["class","hidden"]});
window.addEventListener("popstate",function(){if(skip){skip=false;return}if(pushed){var o=openSheets()[0];pushed=false;if(o){var b=o.e.querySelector(o.s.x);if(b)b.click()}}},true);
scan();
})();
