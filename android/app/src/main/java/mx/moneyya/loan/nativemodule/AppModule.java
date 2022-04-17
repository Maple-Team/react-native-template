package mx.moneyya.loan.nativemodule;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Environment;
import android.os.SystemClock;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import mx.moneyya.loan.BuildConfig;

public class AppModule extends ReactContextBaseJavaModule {
  private TelephonyManager tm;
  private final ReactApplicationContext reactContext;
  private final static String E_NO_CARRIER_NAME = "no_carrier_name";
  private final static String E_NO_ISO_COUNTRY_CODE = "no_iso_country_code";
  private final static String E_NO_MOBILE_COUNTRY_CODE = "no_mobile_country_code";
  private final static String E_NO_MOBILE_NETWORK = "no_mobile_network";
  private final static String E_NO_NETWORK_OPERATOR = "no_network_operator";

  AppModule(ReactApplicationContext context) {
    super(context);
    this.reactContext = context;
    tm = (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
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
  public String getBuildDate(){
    return BuildConfig.BUILD_TIME; //
  }
  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getBaseUrl(){
    String url;
    switch (getEnv()){
      case "production":
        url = "http://hbpub0561.6655.la";
        break;
      case "staging":
      case "development":
      default:
        url = "http://hbpub0561.6655.la";
        break;
    }
    return url;
  }
  @ReactMethod(isBlockingSynchronousMethod = true)
  public int getVersionID(){
    return BuildConfig.VERSION_CODE;
  }

  @ReactMethod
  public void getInfo(Promise promise) {
    try {
      WritableMap map = Arguments.createMap();
      DisplayMetrics displayMetrics = new DisplayMetrics();
      Activity currentActivity = getCurrentActivity();
      if (currentActivity != null) {
        currentActivity.getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        map.putString("screenSize", displayMetrics.widthPixels + "_" + displayMetrics.heightPixels);
      } else {
        map.putString("screenSize", "");
      }
      String bootTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault())
        .format(new Date(System.currentTimeMillis() - SystemClock.elapsedRealtime()));
      map.putString("bootTime", bootTime);
      map.putString("isAgent", isWifiProxy() ? "1" : "0");
      map.putString("isBreakPrison", isRoot() ? "1" : "0");
      File file = new File(
        Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath());
      int list = getList(file);
      map.putInt("photoNum", list);
      promise.resolve(map);
    } catch (Exception e) {
      promise.reject((e));
    }
  }

  /**
   * 是否代理
   */
  private boolean isWifiProxy() {
    String proxyAddress = System.getProperty("http.proxyHost");
    String portStr = System.getProperty("http.proxyPort");
    int proxyPort = Integer.parseInt((portStr != null ? portStr : "-1"));
    return (!TextUtils.isEmpty(proxyAddress)) && (proxyPort != -1);
  }

  /**
   * 是否ROOT
   */
  private boolean isRoot() {
    try {
      if ((new File("/system/bin/su").exists()) || (new File("/system/xbin/su").exists())) {
        return true;
      }
    } catch (Exception e) {
      Log.d("tag", e.getMessage());
    }
    return false;
  }

  /**
   * 获取文件夹文件个数
   *
   * @param f
   * @return
   */
  private int getList(File f) {
    try {
      int size = 0;
      File[] files = f.listFiles();
      for (File file : files) {
        if (file.isDirectory()) {
          size = size + getList(file);
        } else {
          String fileName = file.getName();
          String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
          if (TextUtils.equals(suffix, "jpg") || TextUtils.equals(suffix, "jpeg")) {
            size++;
          }
        }
      }
      Log.d("tag", size + "");
      return size;
    } catch (Exception e) {
      return -999;
    }
  }

  @ReactMethod
  public void getApps(Promise promise) {
    try {
      PackageManager pm = reactContext.getPackageManager();
      List<PackageInfo> pList = pm.getInstalledPackages(0);
      WritableArray list = Arguments.createArray();
      for (int i = 0; i < pList.size(); i++) {
        PackageInfo packageInfo = pList.get(i);
        WritableMap appInfo = Arguments.createMap();

        appInfo.putString("packageName", packageInfo.packageName);
        appInfo.putString("versionName", packageInfo.versionName);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
          appInfo.putDouble("versionCode", packageInfo.getLongVersionCode());
        } else {
          appInfo.putDouble("versionCode", packageInfo.versionCode);
        }
        appInfo.putDouble("appInstallTime", (packageInfo.firstInstallTime));
        appInfo.putDouble("lastUpdateTime", (packageInfo.lastUpdateTime));
        appInfo.putString("name", ((String) packageInfo.applicationInfo.loadLabel(pm)).trim());
        boolean isAppActive = isAppRunning(reactContext, packageInfo.packageName)
          || isProcessRunning(reactContext, getPackageUid(reactContext, packageInfo.packageName));
        appInfo.putString("isAppActive", isAppActive ? "Y":"N");
        Drawable icon = pm.getApplicationIcon(packageInfo.applicationInfo);
        // appInfo.putString("icon", Utility.convert(icon));

        String apkDir = packageInfo.applicationInfo.publicSourceDir;
        appInfo.putString("packagePath", apkDir);

        File file = new File(apkDir);
        double size = file.length();
        appInfo.putDouble("size", size);
        if ((packageInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) != 0) {
          appInfo.putString("isSystem", "Y");
        } else {
          appInfo.putString("isSystem", "N");
        }
        list.pushMap(appInfo);
      }
      promise.resolve(list);
    } catch (Exception ex) {
      promise.reject(ex);
    }
  }

  private boolean isProcessRunning(Context context, int uid) {
    ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
    List<ActivityManager.RunningServiceInfo> runningServiceInfos = am.getRunningServices(200);
    if (runningServiceInfos.size() > 0) {
      for (ActivityManager.RunningServiceInfo appProcess : runningServiceInfos) {
        if (uid == appProcess.uid) {
          return true;
        }
      }
    }
    return false;
  }

  private boolean isAppRunning(Context context, String packageName) {
    ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
    List<ActivityManager.RunningTaskInfo> list = am.getRunningTasks(100);
    if (list.size() <= 0) {
      return false;
    }
    for (ActivityManager.RunningTaskInfo info : list) {
      if (info.baseActivity.getPackageName().equals(packageName)) {
        return true;
      }
    }
    return false;
  }

  private int getPackageUid(Context context, String packageName) {
    try {
      ApplicationInfo applicationInfo = context.getPackageManager().getApplicationInfo(packageName, 0);
      if (applicationInfo != null) {
        return applicationInfo.uid;
      }
    } catch (Exception e) {
      return -1;
    }
    return -1;
  }
  @SuppressLint({"MissingPermission", "HardwareIds"})
  @ReactMethod
  public void getImei(Promise promise) {
    if (!hasPermission()) {
      promise.reject(new RuntimeException("Missing permission " + Manifest.permission.READ_PHONE_STATE));
    } else {
      if (Build.VERSION.SDK_INT >= 23) {
        int count = tm.getPhoneCount();
        String[] imei = new String[count];
        for (int i = 0; i < count; i++) {
          if (Build.VERSION.SDK_INT >= 26) {
            imei[i] = tm.getImei(i);
          } else {
            imei[i] = tm.getDeviceId(i);
          }
        }
        promise.resolve(Arguments.fromJavaArgs(imei));
      } else {
        promise.resolve(Arguments.fromJavaArgs(new String[]{tm.getDeviceId()}));
      }
    }
  }

  private boolean hasPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      return reactContext.checkSelfPermission(Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED;
    } else {
      return true;
    }
  }
  @ReactMethod
  public void setBrightnessLevel(final float brightnessLevel) {
    final Activity activity = (Activity) reactContext.getApplicationContext();
    if (activity == null) {
      return;
    }

    activity.runOnUiThread(() -> {
      WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
      lp.screenBrightness = brightnessLevel;
      activity.getWindow().setAttributes(lp);
    });
  }

  @ReactMethod
  public void getBrightnessLevel(Promise promise) {
    WindowManager.LayoutParams lp = Objects.requireNonNull(getCurrentActivity()).getWindow().getAttributes();
    promise.resolve(lp.screenBrightness);
  }

  @ReactMethod
  public void getSystemBrightnessLevel(Promise promise){
    String brightness = Settings.System.getString(reactContext.getApplicationContext().getContentResolver(), "screen_brightness");
    promise.resolve(Integer.parseInt(brightness)/255f);
  }

  @ReactMethod
  public void carrierName(Promise promise) {
    String carrierName = tm.getSimOperatorName();
    if (carrierName != null && !"".equals(carrierName)) {
      promise.resolve(carrierName);
    } else {
      promise.reject(E_NO_CARRIER_NAME, "No carrier name");
    }
  }

  @ReactMethod
  public void isoCountryCode(Promise promise) {
    String iso = tm.getSimCountryIso();
    if (iso != null && !"".equals(iso)) {
      promise.resolve(iso);
    } else {
      promise.reject(E_NO_ISO_COUNTRY_CODE, "No iso country code");
    }
  }

  // returns MCC (3 digits)
  @ReactMethod
  public void mobileCountryCode(Promise promise) {
    String plmn = tm.getSimOperator();
    if (plmn != null && !"".equals(plmn)) {
      promise.resolve(plmn.substring(0, 3));
    } else {
      promise.reject(E_NO_MOBILE_COUNTRY_CODE, "No mobile country code");
    }
  }

  // returns MNC (2 or 3 digits)
  @ReactMethod
  public void mobileNetworkCode(Promise promise) {
    String plmn = tm.getSimOperator();
    if (plmn != null && !"".equals(plmn)) {
      promise.resolve(plmn.substring(3));
    } else {
      promise.reject(E_NO_MOBILE_NETWORK, "No mobile network code");
    }
  }

  // return MCC + MNC (5 or 6 digits), e.g. 20601
  @ReactMethod
  public void mobileNetworkOperator(Promise promise) {
    String plmn = tm.getSimOperator();
    if (plmn != null && !"".equals(plmn)) {
      promise.resolve(plmn);
    } else {
      promise.reject(E_NO_NETWORK_OPERATOR, "No mobile network operator");
    }
  }

}
