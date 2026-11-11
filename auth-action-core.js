(function (window) {
  "use strict";

  function safeContinueUrl(rawUrl, pageUrl, state) {
    var page = new URL(pageUrl);
    var appBase = new URL("./", page);
    var fallback = new URL(appBase.href);
    fallback.searchParams.set("auth", state === "password-reset" ? "password-reset" : "verified");
    fallback.hash = "home";

    if (!rawUrl) return fallback.href;
    try {
      var candidate = new URL(rawUrl);
      if (
        candidate.protocol === "https:" &&
        candidate.origin === appBase.origin &&
        candidate.pathname.indexOf(appBase.pathname) === 0 &&
        !candidate.username &&
        !candidate.password
      ) return candidate.href;
    } catch (_) {
      // Use the safe in-app destination below when Firebase state is malformed.
    }
    return fallback.href;
  }

  function complete(FB, auth, mode, code) {
    if (!code) return Promise.reject({ code: "auth/missing-action-code" });
    if (mode === "verifyEmail") {
      return FB.applyActionCode(auth, code).then(function () { return { kind: "verified" }; });
    }
    if (mode === "recoverEmail") {
      return FB.applyActionCode(auth, code).then(function () { return { kind: "recovered" }; });
    }
    if (mode === "verifyAndChangeEmail") {
      return FB.applyActionCode(auth, code).then(function () { return { kind: "verified" }; });
    }
    if (mode === "resetPassword") {
      return FB.verifyPasswordResetCode(auth, code).then(function (email) {
        return { kind: "reset", email: email };
      });
    }
    return Promise.reject({ code: "auth/unsupported-action" });
  }

  window.ActiCheckActionCore = {
    complete: complete,
    safeContinueUrl: safeContinueUrl
  };
})(window);
