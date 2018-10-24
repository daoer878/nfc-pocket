cordova.define("com.none.splash.Splash", function(require, exports, module) { var exec = require('cordova/exec');

exports.hidden = function(arg0, success, error) {
    exec(success, error, "CancelSpashPlugIn", "splashHide", [arg0]);
};


exports.pushJumpToPage = function(arg0, success, error) {
    exec(success, error, "CancelSpashPlugIn", "pushJumpToPage", [arg0]);
};

});
