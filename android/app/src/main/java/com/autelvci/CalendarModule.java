package com.autelvci;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import android.widget.Toast;

public class CalendarModule  extends ReactContextBaseJavaModule {
    private final ReactApplicationContext context;

    CalendarModule(ReactApplicationContext context) {
        super(context);
        this.context =context;
    }

    @NonNull
    @Override
    public String getName() {
        return "CalendarModule";
    }
    @ReactMethod
    public void createCalendarEvent(String name, String location) {
        Toast.makeText(context, name, Toast.LENGTH_SHORT).show();
        Log.d("CalendarModule", "Create event called with name: " + name
                + " and location: " + location);
    }
}
