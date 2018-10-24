cordova.define("com.none.iconUpload.iconupload", function(require, exports, module) { var exec = require('cordova/exec');

exports.iconNotes = function(arg0, success, error) {
    exec(success, error, "IconPlugin", "iconUpLoad", arg0);
};



});