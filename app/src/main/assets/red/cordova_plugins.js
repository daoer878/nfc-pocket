cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.chromium.common/events.js",
        "id": "org.chromium.common.events",
        "clobbers": [
            "chrome.Event"
        ]
    },
    {
        "file": "plugins/org.chromium.common/errors.js",
        "id": "org.chromium.common.errors"
    },
    {
        "file": "plugins/org.chromium.common/stubs.js",
        "id": "org.chromium.common.stubs"
    },
    {
        "file": "plugins/org.chromium.common/helpers.js",
        "id": "org.chromium.common.helpers"
    },
    {
        "file": "plugins/org.chromium.storage/storage.js",
        "id": "org.chromium.storage.Storage",
        "clobbers": [
            "chrome.storage"
        ]
    },
    {
        "file": "plugins/com.none.webServer/www/WebServer.js",
        "id": "com.none.webServer.WebServer",
        "clobbers": [
            "cordova.plugins.WebServer"
        ]
    },
    {
        "file": "plugins/com.none.splash/www/Splash.js",
        "id": "com.none.splash.Splash",
        "clobbers": [
            "splash"
        ]
    },
    {
        "file": "plugins/org.cloudsky.cordovaplugins.zbar/www/zbar.js",
        "id": "org.cloudsky.cordovaplugins.zbar.zBar",
        "clobbers": [
            "cloudSky.zBar"
        ]
    },
    {
        "file": "plugins/com.none.pushJumpPage/www/com.none.pushJumpPage.js",
        "id": "com.none.pushJumpPage.com.none.pushJumpPage",
        "clobbers": [
            "pushJumpPage"
        ]
    },
    {
        "file": "plugins/com.none.PlayVideo/www/com.none.PlayVideo.js",
        "id": "com.none.PlayVideo.PlayVideo",
        "clobbers": [
            "cordova.plugins.PlayVideo"
        ]
    },
    {
        "file": "plugins/com.none.locateBeacon/www/LocateIbeaconas.js",
        "id": "com.none.locateBeacon.LocateIbeaconas",
        "clobbers": [
            "locateIbeaconas"
        ]
    },
    {
        "file": "plugins/com.none.alarmClock/www/alarmClock.js",
        "id": "com.none.alarmClock.alarmClock",
        "clobbers": [
            "alarmClock"
        ]
    },
    {
        "file": "plugins/com.none.iconupload/www/iconUpload.js",
        "id": "com.none.iconUpload.iconupload",
        "clobbers": [
            "iconUpload"
        ]
    },
    {
        "file": "plugins/com.none.eInvoiceUpload/www/eInvoiceUploadPlugin.js",
        "id": "com.none.eInvoiceUploadPlugin",
        "clobbers": [
            "eInvoiceUploadPlugin"
                     ]
    },
    {
        "file": "plugins/com.none.native_test/www/native_test.js",
        "id": "com.none.native_test.native_test",
        "clobbers": [
            "native_test"
        ]
    },
	{
	"file": "plugins/cordova-plugin-camera/www/Camera.js",
	"id": "cordova.plugin.camera.camera",
	"clobbers": [
		"navigator.camera"
	]
},
	{
	"file": "plugins/com.none.speechRecognizer/www/SpeechRecognizer.js",
	"id": "cordova.plugin.speechRecognizer.speechRecognizer",
	"clobbers": [
		"speechRecognizer"
	]
},
    {
        "file": "plugins/com.none.shakeLaisee/www/ShakeLaisee.js",
        "id": "cordova.plugin.shakeLaisee.shakeLaisee",
        "clobbers": [
            "shakeLaisee"
        ]
    },
    {
        "file": "plugins/com.none.job.share/www/jobShare.js",
        "id": "cordova.plugin.job.share",
        "clobbers": [
            "ShareJob"
        ]
    },
    {
        "file":"plugins/com.none.job.mail/www/jobMail.js",
        "id":"cordova.plugin.job.mail",
        "clobbers":[
            "MailJob"
        ]
    },
    {
        "file": "plugins/com.none.native.browser/www/nativeBrowser.js",
        "id": "cordova.plugin.native.browser",
        "clobbers": [
            "NativeBrowser"
        ]
    },
    {
        "file": "plugins/cordova-plugin-keyboard/www/keyboard.js",
        "id": "cordova-plugin-keyboard",
        "clobbers": [
            "Keyboard"
        ]
    }

];
module.exports.metadata =
// TOP OF METADATA
{
    "org.apache.cordova.console": "0.2.13",
    "org.apache.cordova.device": "0.3.0",
    "org.chromium.common": "1.0.6",
    "org.chromium.storage": "1.0.3",
    "com.none.webServer": "1.0.7",
    "com.none.splash": "0.0.1",
    "org.cloudsky.cordovaplugins.zbar": "1.3.1",
    "com.none.pushJumpPage": "0.0.3",
    "com.none.PlayVideo": "0.0.5",
    "com.none.locateBeacon": "1.1.3",
    "com.none.alarmClock": "0.0.3",
    "com.none.iconupload": "0.0.1",
    "com.none.eInvoiceUploadPlugin": "0.0.5",
	"com.none.native_test": "0.0.1",
	"cordova-plugin-camera": "0.0.1",
	"com.none.speechRecognizer": "0.0.1",
    "com.none.shakeLaisee": "0.0.1",
    "com.none.job.share":"0.0.1",
    "com.none.native.browser":"0.0.1",
    "cordova-plugin-keyboard":"0.0.1",
    "com.none.job.mail":"0.0.1"
}
// BOTTOM OF METADATA
});
