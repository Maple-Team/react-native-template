package mx.moneyya.loan;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;

import cn.jiguang.plugins.push.JPushModule;

import com.wheelpicker.WheelPickerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.ammarahmed.mmkv.RNMMKVJSIModulePackage;
import com.facebook.react.bridge.JSIModulePackage;
import com.facebook.soloader.SoLoader;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

import ai.advance.liveness.lib.GuardianLivenessDetectionSDK;
import ai.advance.liveness.lib.Market;
import ai.advance.liveness.sdk.rn.LivenessReactPackage;
import mx.moneyya.loan.nativemodule.MoneyyaPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
    new ReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected JSIModulePackage getJSIModulePackage() {
        return new RNMMKVJSIModulePackage();
      }

      @Override
      protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();
        // Packages that cannot be autolinked yet can be added manually here, for example:
        // packages.add(new MyReactNativePackage());
        packages.add(new MoneyyaPackage());
        packages.add(new WheelPickerPackage());
        packages.add(new LivenessReactPackage());
        return packages;
      }

      @Override
      protected String getJSMainModuleName() {
        return "index";
      }
    };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    GuardianLivenessDetectionSDK.init(this, "5e6112f28a09254b", "c827b638b749e602", Market.Mexico);
    GuardianLivenessDetectionSDK.letSDKHandleCameraPermission();
    GuardianLivenessDetectionSDK.isDetectOcclusion(true);
    //调用此方法：点击通知让应用从后台切到前台
    JPushModule.registerActivityLifecycle(this);
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
    Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.loan.ReactNativeFlipper");
        aClass
          .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
          .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
