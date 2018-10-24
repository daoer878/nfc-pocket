package com.cordova.test.cordovatest.plugin;

import com.cordova.test.cordovatest.event.AppEvent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.greenrobot.eventbus.EventBus;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * 取消splash插件
 * @author willis
 *
 */
public class CancelSplashPlugin extends CordovaPlugin {


	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		if ("splashHide".equals(action)) {
			EventBus.getDefault().post(new AppEvent(1));
			callbackContext.success("hide sucdess");
			return true;
		}
		return super.execute(action, args, callbackContext);
	}
}
