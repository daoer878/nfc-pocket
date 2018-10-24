package com.cordova.test.cordovatest.event;

import org.greenrobot.eventbus.Subscribe;
import org.intellij.lang.annotations.Subst;

public class AppEvent {

    private int type;

    public AppEvent(int type) {
        this.type = type;
    }

    public int getType() {
        return this.type;
    }
}
