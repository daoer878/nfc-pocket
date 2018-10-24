cordova.define("com.none.PlayVideo.PlayVideo", function(require, exports, module) { var exec = require('cordova/exec');

exports.presentMediaMp4 = function(arg0, success, error) {
    exec(success, error, "Media", "presentMediaMp4", [arg0]);
};

});
