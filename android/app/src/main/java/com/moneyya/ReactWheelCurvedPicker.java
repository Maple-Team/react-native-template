package com.moneyya;


import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Shader;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.moneyya.wheelpicker.WheelPicker;

import java.util.List;

/**
 * @author <a href="mailto:lesliesam@hotmail.com"> Sam Yu </a>
 */
public class ReactWheelCurvedPicker extends WheelPicker {

  private final EventDispatcher mEventDispatcher;
  private List<Integer> mValueData;
  private Integer mLineColor = Color.BLACK; // Default line color
  private boolean isLineGradient = false;    // By default line color is not a gradient
  private Integer mLinegradientFrom = Color.BLACK; // Default starting gradient color
  private Integer mLinegradientTo = Color.WHITE; // Default end gradient color

  public ReactWheelCurvedPicker(ReactContext reactContext) {
    super(reactContext);
    mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
    setOnWheelChangeListener(new OnWheelChangeListener() {
      @Override
      public void onWheelScrolled(int offset) {

      }

      @Override
      public void onWheelSelected(int position) {
        if (mValueData != null && position < mValueData.size()) {
          mEventDispatcher.dispatchEvent(
            new ItemSelectedEvent(getId(), mValueData.get(position)));
        }
      }

      @Override
      public void onWheelScrollStateChanged(int state) {
      }
    });
  }



  public void setLineColor(Integer color) {
    this.mLineColor = color;
  }

  public void setLineGradientColorFrom (Integer color) {
    this.isLineGradient = true;
    this.mLinegradientFrom = color;
  }

  public void setLineGradientColorTo (Integer color) {
    this.isLineGradient = true;
    this.mLinegradientTo = color;
  }



  public void setValueData(List<Integer> data) {
    mValueData = data;
  }


}

class ItemSelectedEvent extends Event<ItemSelectedEvent> {

  public static final String EVENT_NAME = "wheelCurvedPickerPageSelected";

  private final int mValue;

  protected ItemSelectedEvent(int viewTag,  int value) {
    super(viewTag);
    mValue = value;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), serializeEventData());
  }

  private WritableMap serializeEventData() {
    WritableMap eventData = Arguments.createMap();
    eventData.putInt("data", mValue);
    return eventData;
  }
}