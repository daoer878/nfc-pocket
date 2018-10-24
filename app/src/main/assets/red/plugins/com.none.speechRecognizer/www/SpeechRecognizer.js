cordova.define("cordova.plugin.speechRecognizer.speechRecognizer", function(require, exports, module) { var exec = require('cordova/exec');

    exports.startRecording = function(arg0, success, error) {
        exec(success, error, "SpeechRecognizer", "startSpeechRecognizer", [arg0]);
    };
    

});
