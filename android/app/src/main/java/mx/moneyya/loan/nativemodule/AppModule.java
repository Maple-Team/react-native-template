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
        url = "http://218.17.185.83:9182";
        break;
    }
    return url;
  }
  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getVersionID(){
    return BuildConfig.VERSION_NAME;
  }
}
