var V="acticheck-v25",F=["./","index.html","rules.js","app.js","demos.js","howto.js","scan.js","privacy.html","theme-init.js","auth.js","firebase-config.js","firebase-auth.min.js","ux.js","qrcode.min.js","jsQR.min.js","manifest.webmanifest","icon-light.svg","icon-dark.svg","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png","subaru-labs.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){if(e.request.method!=="GET")return;var u=new URL(e.request.url);if(u.origin!==self.location.origin&&u.hostname!=="fonts.googleapis.com"&&u.hostname!=="fonts.gstatic.com")return;
e.respondWith(caches.match(e.request).then(function(h){
var n=fetch(e.request).then(function(r){var cp=r.clone();caches.open(V).then(function(c){c.put(e.request,cp)});return r}).catch(function(){return h});
return h||n}))});
