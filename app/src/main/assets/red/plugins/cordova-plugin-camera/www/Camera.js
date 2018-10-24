cordova.define("cordova.plugin.camera.camera", function (require, exports, module) {
    var exec = require('cordova/exec');

    exports.textRecognition = function (arg0, success, error) {
        exec(success, error, "TextRecognition", "textRecognition", arg0);
    };

});
