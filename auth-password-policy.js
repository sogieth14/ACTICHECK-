(function (window) {
  "use strict";

  var common = "password,password1,password12,password123,passw0rd,p@ssword,p@ssw0rd,1234567890,12345678910,123456789012,qwertyuiop,qwerty12345,qwerty123456,asdfghjkl1,iloveyou123,letmein1234,welcome1234,admin12345,administrator,changeme123,acticheck,acticheck1,acticheck123,nigeria123,nigeria2024,nigeria2025,nigeria2026,lagos12345,abc1234567,abcd123456,1q2w3e4r5t,0987654321,11111111111,00000000000,doctor12345,hospital123,medicine123,football123,monkey12345,dragon12345".split(",");

  function check(password, email) {
    var value = String(password || "");
    var localPart = String(email || "").split("@")[0].toLowerCase();
    var lower = value.toLowerCase();
    return {
      len: value.length >= 10,
      common: common.indexOf(lower) < 0 && !(localPart.length >= 4 && lower.indexOf(localPart) > -1),
      mix: /[0-9]|[^A-Za-z0-9\s]/.test(value)
    };
  }

  window.ActiCheckPasswordPolicy = {
    check: check,
    valid: function (password, email) {
      var result = check(password, email);
      return result.len && result.common && result.mix;
    }
  };
})(window);
