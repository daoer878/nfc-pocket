package com.cordova.test.cordovatest

import android.app.Dialog
import android.os.Bundle
import android.os.Handler
import android.view.LayoutInflater
import android.view.WindowManager
import com.cordova.test.cordovatest.event.AppEvent
import org.apache.cordova.CordovaActivity
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode


class MainActivity : CordovaActivity() {

    private var sp: Dialog? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
        displaySplash()
        loadUrl("file:///android_asset/red/index.html")
        Handler().postDelayed(Runnable { disMissDialog() }, 10000)
    }


    private fun displaySplash() {
        EventBus.getDefault().register(this)
        sp = Dialog(this,
                android.R.style.Theme_Translucent_NoTitleBar)
        val m = windowManager
        val d = m.defaultDisplay
        val p = window.attributes
        p.height = (d.height * 1.0).toInt()
        p.width = (d.width * 1.0).toInt()
        p.alpha = 1.0f
        p.dimAmount = 0.0f
        sp!!.window.attributes = p
        val view = LayoutInflater.from(this).inflate(
                R.layout.sp_with_loading, null)
        sp!!.setContentView(view)
        sp!!.setCancelable(false)
        sp!!.show()
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    fun onEventMainThread(event: AppEvent) {
        if (1 == event.type) {
            disMissDialog()
        }
    }

    private fun disMissDialog() {
        if (sp != null && sp!!.isShowing) {
            sp!!.dismiss()
            sp = null
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        EventBus.getDefault().unregister(this)
    }

}
