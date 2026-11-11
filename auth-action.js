(function (window, document) {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(window.location.search);
  var mode = params.get("mode") || "";
  var code = params.get("oobCode") || "";
  var continueUrl = params.get("continueUrl") || "";
  var resetState = mode === "resetPassword" ? "password-reset" : "verified";
  var returnUrl = window.ActiCheckActionCore.safeContinueUrl(continueUrl, window.location.href, resetState);
  var form = $("reset-form");
  var status = $("status");
  var statusText = $("status-text");
  var title = $("title");
  var description = $("description");
  var returnLink = $("return-link");
  var auth;

  returnLink.href = returnUrl;

  // The one-time code must not remain visible in the address bar or be copied into later navigation.
  try { window.history.replaceState(null, document.title, window.location.pathname); } catch (_) {}

  function setStatus(text, kind) {
    statusText.textContent = text;
    status.className = "status-line" + (kind ? " " + kind : "");
    if (kind) {
      var spinner = status.querySelector(".spinner");
      if (spinner) spinner.hidden = true;
    }
  }

  function showReturn() {
    returnLink.hidden = false;
    form.hidden = true;
  }

  function failure(error) {
    var codeValue = error && error.code || "";
    console.warn("ACTICHECK email action failed", codeValue || "unknown");
    title.textContent = "This link could not be completed";
    if (codeValue === "auth/expired-action-code" || codeValue === "auth/invalid-action-code") {
      description.textContent = "The link may have expired or already been used. Return to ACTICHECK and request a fresh email.";
      setStatus("This secure link is no longer valid.", "error");
    } else if (codeValue === "auth/network-request-failed") {
      description.textContent = "Reconnect to the internet and open the link again, or return to ACTICHECK to request another one.";
      setStatus("Connection interrupted.", "error");
    } else if (codeValue === "auth/operation-not-allowed") {
      description.textContent = "This account action is not enabled for the current Firebase project.";
      setStatus("Account action unavailable.", "error");
    } else if (codeValue) {
      description.textContent = "Return to ACTICHECK and try again. If the problem continues, share the Firebase code shown below with support.";
      setStatus("Firebase: " + codeValue, "error");
    } else {
      description.textContent = "Return to ACTICHECK and request a fresh link.";
      setStatus("The link is missing or incomplete.", "error");
    }
    showReturn();
    title.focus();
  }

  function success(kind) {
    if (kind === "recovered") {
      title.textContent = "Your email address is restored";
      description.textContent = "Your account email has been restored. Returning you to ACTICHECK now.";
    } else if (kind === "reset") {
      title.textContent = "Your password is updated";
      description.textContent = "Your new password is ready. Returning you to ACTICHECK now.";
    } else {
      title.textContent = "Your email is confirmed";
      description.textContent = "Your account is ready. Returning you to ACTICHECK now.";
    }
    setStatus("Complete", "success");
    returnLink.textContent = "Continue to ACTICHECK";
    returnLink.hidden = false;
    window.setTimeout(function () { window.location.replace(returnUrl); }, 850);
  }

  function init() {
    if (!window.ACTI_FB || !window.ACTI_FB.config || !window.FB || !window.ActiCheckActionCore) {
      failure({ code: "auth/initialization-error" });
      return;
    }
    try {
      var app = window.FB.initializeApp(window.ACTI_FB.config);
      auth = window.FB.getAuth(app);
    } catch (error) {
      failure(error);
      return;
    }

    if (!code) {
      failure({ code: "auth/missing-action-code" });
      return;
    }

    window.ActiCheckActionCore.complete(window.FB, auth, mode, code).then(function (result) {
      if (result.kind === "reset") {
        title.textContent = "Choose a new password";
        description.textContent = "Set a strong password to finish securing your ACTICHECK account.";
        $("reset-email").textContent = result.email;
        setStatus("Reset link confirmed", "success");
        form.hidden = false;
        returnLink.hidden = false;
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          var password = $("new-password").value;
          var confirmation = $("confirm-password").value;
          if (!window.ActiCheckPasswordPolicy.valid(password, result.email)) {
            setStatus("Use at least 10 characters, avoid common passwords, and include a number or symbol.", "error");
            $("new-password").focus();
            return;
          }
          if (password !== confirmation) {
            setStatus("Those passwords do not match yet.", "error");
            $("confirm-password").focus();
            return;
          }
          var submit = form.querySelector("button[type=submit]");
          submit.disabled = true;
          window.FB.confirmPasswordReset(auth, code, password).then(function () {
            success("reset");
          }, function (error) {
            submit.disabled = false;
            failure(error);
          });
        });
        return;
      }
      success(result.kind);
    }).catch(failure);
  }

  init();
})(window, document);
