/**
* 参考
- [RN 设计稿适配不同尺寸](https://www.jianshu.com/p/42c823f150f1)
- [ReactNativeScreenUtil](https://github.com/lizhuoyuan/ReactNativeScreenUtil)
- [react-native-size-matters](https://github.com/nirsky/react-native-size-matters)
- [屏幕适配](https://reactnative.520wcf.com/ping-mu-shi-pei.html)
- [dimensions](https://reactnative.dev/docs/dimensions)
- [z_fit](https://github.com/zhongmeizhi/fultter-example-app/blob/master/lib/utils/z_fit.dart)
 */

import { PixelRatio, Dimensions } from 'react-native'
// https://github.com/lizhuoyuan/ReactNativeScreenUtil/blob/master/ScreenUtil.js
export const screenW = Dimensions.get('window').width
export const screenH = Dimensions.get('window').height
const fontScale = PixelRatio.getFontScale()
export const pixelRatio = PixelRatio.get()
//像素密度
export const DEFAULT_DENSITY = 2
//px转换成dp
//以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的defaultWidth和defaultHeight为对应尺寸即可. 以下为1倍图时
const defaultWidth = 375
const defaultHeight = 667
const w2 = defaultWidth / DEFAULT_DENSITY
//px转换成dp
const h2 = defaultHeight / DEFAULT_DENSITY

//缩放比例
const _scaleWidth = screenW / defaultWidth
const _scaleHeight = screenH / defaultHeight

/**
 * 屏幕适配,缩放size , 默认根据宽度适配，纵向也可以使用此方法
 * 横向的尺寸直接使用此方法
 * 如：width ,paddingHorizontal ,paddingLeft ,paddingRight ,marginHorizontal ,marginLeft ,marginRight
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function scaleSize(size: number) {
  return size * _scaleWidth
}

/**
 * 屏幕适配 , 纵向的尺寸使用此方法应该会更趋近于设计稿
 * 如：height ,paddingVertical ,paddingTop ,paddingBottom ,marginVertical ,marginTop ,marginBottom
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function scaleHeight(size: number) {
  return size * _scaleHeight
}

/* 最初版本尺寸适配方案 也许你会更喜欢这个
export function scaleSize(size: Number) {
    let scaleWidth = screenW / w2;
    let scaleHeight = screenH / h2;
    let scale = Math.min(scaleWidth, scaleHeight);
    size = Math.round((size * scale + 0.5));
    return size / DEFAULT_DENSITY;
}*/

/**
 * 设置字体的size（单位px）
 * @param size 传入设计稿上的px , allowFontScaling 是否根据设备文字缩放比例调整，默认不会
 * @returns 返回实际sp
 */
// function setSpText(size: number, allowFontScaling = false) {
//   const scale = Math.min(_scaleWidth, _scaleHeight)
//   const fontSize = allowFontScaling ? 1 : fontScale
//   return (size * scale) / fontSize
// }

export function setSpText(size: number) {
  const sw = screenW / w2
  const sh = screenH / h2
  const scale = Math.min(sw, sh)
  size = Math.round(size * scale + 0.5)

  return (size / DEFAULT_DENSITY) * fontScale
}
