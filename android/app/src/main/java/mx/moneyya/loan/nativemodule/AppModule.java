package mx.moneyya.loan.nativemodule;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import mx.moneyya.loan.BuildConfig;

public class AppModule extends ReactContextBaseJavaModule {
  AppModule(ReactApplicationContext context) {
    super(context);
  }

  @NonNull
  @Override
  public String getName() {
    return "AppModule";
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getEnv(){
    return BuildConfig.ENVIRONMENT; //
  }
  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getBaseUrl(){
    String url;
    switch (getEnv()){
      case "production":
//        url = "https://";
//        break;
      case "staging":
      case "development":
      default:
//        url = "http://94.74.68.216:8081";
        url = "http://hbpub0561.6655.la";
        break;
    }
    return url;
  }
  @ReactMethod(isBlockingSynchronousMethod = true)
  public int getVersionID(){
    return BuildConfig.VERSION_CODE;
  }
}
