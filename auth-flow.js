(function (window) {
  "use strict";

  function codeOf(error) {
    return error && typeof error.code === "string" ? error.code : "";
  }

  function start(FB, auth, provider) {
    // GitHub Pages and the default Firebase authDomain are cross-site. Firebase
    // requires additional hosting/proxy work for production redirect sign-in in
    // browsers that partition third-party storage, so use the popup flow here.
    return FB.signInWithPopup(auth, provider);
  }

  function resolveRedirect(FB, auth) {
    return FB.getRedirectResult(auth);
  }

  function message(error) {
    var code = codeOf(error);
    if (code === "auth/unauthorized-domain") {
      return "This app address is not authorized for Google sign-in. Confirm sogieth14.github.io is listed in Firebase Auth settings.";
    }
    if (code === "auth/operation-not-allowed") {
      return "Google sign-in is turned off for this Firebase project.";
    }
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request" || code === "auth/redirect-cancelled-by-user") {
      return "Google sign-in was closed before it finished. Tap to try again.";
    }
    if (code === "auth/network-request-failed") {
      return "Check your internet connection, then try Google sign-in again.";
    }
    if (code === "auth/account-exists-with-different-credential") {
      return "An account already exists for this email. Sign in with that method first, then try Google again.";
    }
    if (code === "auth/web-storage-unsupported" || code === "auth/operation-not-supported-in-this-environment" || code === "auth/popup-operation-not-supported-in-this-environment") {
      return "This browser cannot complete Google sign-in. Open ACTICHECK in a regular Chrome or Safari tab, not inside another app, and try again.";
    }
    if (code === "auth/popup-blocked") {
      return "Your browser blocked the Google sign-in window. Open ACTICHECK in a regular browser tab and allow sign-in windows for this site, then try again.";
    }
    return code
      ? "Google sign-in could not finish (Firebase: " + code + "). Check your connection and try again."
      : "Google sign-in could not finish. Check your connection and try again.";
  }

  window.ActiCheckAuthFlow = {
    start: start,
    resolveRedirect: resolveRedirect,
    message: message,
    codeOf: codeOf
  };
})(window);
