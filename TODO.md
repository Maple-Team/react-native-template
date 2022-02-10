## 1.0

- [x] eventbus: mitt
- [x] screen fit: react-native-adaptive-stylesheet
- [x] style:
  - [x] color
  - [x] edge
  - [x] radius
- [x] font:
- [x] assets image: 1x 2x 3x
- [x] loading/toast
- [x] request
- [x] permission
- [x] i18n
- [ ] device
- [x] gps
- [x] 行为埋点
- [ ] button rippleColor
- [ ] 第三方埋点
- [ ] 第三方 sdk
  - [ ] 极光
    - [ ] [push_gplay](https://api.srv.jpush.cn/v1/website/downloads/sdk/push_gplay)
    - [ ] [jcore-react-native](https://github.com/jpush/jcore-react-native/blob/master/package.json)
    - [ ] [jpush-react-native](https://github.com/jpush/jpush-react-native/blob/master/index.d.ts)
  - [ ] liveness
- [ ] android build:
  - [ ] build aab release
  - [signed-apk-android](https://reactnative.dev/docs/signed-apk-android)
  - [ ] 分环境
- [x] 脚本：
  - [x] 命令行输入字段(接收多个字段)，产生对应的 field，并排序
  - [x] 资源图片重命名
- [ ] background tasks
  - [ ] fetch 站内信: [headless-js-android](https://reactnative.dev/docs/headless-js-android) || or 全局的页面做请求?
- [ ] [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/1.10.3/about-handlers/#using-native-components) 组件尝试
- [ ] functional hooks performance
  - https://github.com/facebook/react/issues/14099#thread-subscription-status
- [ ] apply progress gesture 进件页面手势
- TODO android builtin performance analysis

## 1.1

- [ ] apk size
  - https://my.oschina.net/droidwolf/blog/791552
- [ ] [release build environment](https://stackoverflow.com/questions/33117227/setting-environment-variable-in-react-native)
- 打包后的 bundle 文件分析是否除去了注释、console、类型注释等代码

## 1.2

- [ ] component test
- [ ] [theme](https://reactnavigation.org/docs/themes), 跟随系统， 处理样式问题
- [ ] dark mode

## knowledge

- hooks
- context

## Reference

- [fultter-example-app](https://github.com/zhongmeizhi/fultter-example-app), 有价值的项目结构组织
- [RN 设计稿适配不同尺寸](https://www.jianshu.com/p/42c823f150f1)
- [ReactNativeScreenUtil](https://github.com/lizhuoyuan/ReactNativeScreenUtil), 屏幕适配参考项目
- [react-native-size-matters](https://github.com/nirsky/react-native-size-matters), 屏幕适配参考项目
- [屏幕适配](https://reactnative.520wcf.com/ping-mu-shi-pei.html)
- [dimensions](https://reactnative.dev/docs/dimensions), `RN`维度介绍
- [react-native-dva-typescript-starter](https://github.com/ronffy/react-native-dva-typescript-starter), `dva`化的`react-native`框架
- [vite-vue3-admin](https://github.com/buqiyuan/vite-vue3-admin), Typescript 项目结构组织参考
- [reactnavigation](https://reactnavigation.org/docs/getting-started/), 导航框架
- [reactnativeelements](https://reactnativeelements.com/docs), 国外`UI`风格
- [Ant Design Mobile RN of React](https://rn.mobile.ant.design/docs/react/introduce-cn)
- [jestjs](https://jestjs.io/docs/getting-started), 测试框架

ERROR Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
in Step3 (at SceneView.tsx:126)
ERROR Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
in Step4 (at SceneView.tsx:126)
ERROR Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
in Step8 (at SceneView.tsx:126)
ERROR Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
in Step2 (at SceneView.tsx:126)
ERROR Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
in Step61 (at SceneView.tsx:126)
ERROR Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
in Step7 (at SceneView.tsx:126)
