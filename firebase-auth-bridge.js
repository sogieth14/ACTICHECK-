/* Firebase JS SDK compat adapter. The official SDK files are pinned locally to 12.19.0. */
(function (window) {
  "use strict";
  var firebase = window.firebase;
  if (!firebase || !firebase.auth) throw new Error("Load firebase-app-compat.js and firebase-auth-compat.js before this adapter.");

  window.FB = {
    initializeApp: function (config) { return firebase.initializeApp(config); },
    getAuth: function (app) { return firebase.auth(app); },
    onAuthStateChanged: function (auth, next, error) { return auth.onAuthStateChanged(next, error); },
    signInWithPopup: function (auth, provider) { return auth.signInWithPopup(provider); },
    signInWithRedirect: function (auth, provider) { return auth.signInWithRedirect(provider); },
    getRedirectResult: function (auth) { return auth.getRedirectResult(); },
    GoogleAuthProvider: firebase.auth.GoogleAuthProvider,
    createUserWithEmailAndPassword: function (auth, email, password) { return auth.createUserWithEmailAndPassword(email, password); },
    signInWithEmailAndPassword: function (auth, email, password) { return auth.signInWithEmailAndPassword(email, password); },
    sendEmailVerification: function (user, settings) { return user.sendEmailVerification(settings); },
    sendPasswordResetEmail: function (auth, email, settings) { return auth.sendPasswordResetEmail(email, settings); },
    applyActionCode: function (auth, code) { return auth.applyActionCode(code); },
    verifyPasswordResetCode: function (auth, code) { return auth.verifyPasswordResetCode(code); },
    confirmPasswordReset: function (auth, code, password) { return auth.confirmPasswordReset(code, password); },
    signOut: function (auth) { return auth.signOut(); },
    deleteUser: function (user) { return user.delete(); },
    reauthenticateWithPopup: function (user, provider) { return user.reauthenticateWithPopup(provider); },
    reauthenticateWithCredential: function (user, credential) { return user.reauthenticateWithCredential(credential); },
    EmailAuthProvider: firebase.auth.EmailAuthProvider
  };
})(window);
