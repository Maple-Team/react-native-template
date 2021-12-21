import { ToastAndroid } from 'react-native'

// TODO 判断ant-design是否符合要求 toast是否正在showing
// 开启一个新toast的当前时间，用于对比是否已经展示了足够时间
export const showToast = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT)
}

export const showToastWithGravity = (message: string) => {
  ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.CENTER)
}

export const showToastWithGravityAndOffset = (message: string) => {
  ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)
}
