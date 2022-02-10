import { useFormikContext } from 'formik'
import { useEffect, type RefObject } from 'react'
import type { TextInput } from 'react-native'
import type { ScrollView } from 'react-native-gesture-handler'
import { useHeaderHeight } from '@react-navigation/elements'
interface UseFocusOnErrorProps {
  fieldRef: RefObject<TextInput>
  name: string
  canFocus?: boolean
  offsetY: number
  scrollViewRef?: RefObject<ScrollView>
}
//参考
// https://github.com/jaredpalmer/formik/issues/146
// https://codesandbox.io/s/scroll-to-input-formik-failed-submission-gnehr?file=/src/App.js:2437-2455
/**
 * 聚焦错误字段所在的表单位置
 *
 * 点击提交时，自动滚动到第一个错误的字段位置处
 * @param {UseFocusOnErrorProps}
 * @returns
 */
export const UseFocusOnError = ({
  fieldRef,
  name,
  scrollViewRef,
  canFocus,
  offsetY,
}: UseFocusOnErrorProps) => {
  const { submitCount, isValid, errors } = useFormikContext()
  const headerHeight = useHeaderHeight()

  /**
   * 上一次提交次数 FIXME
   */
  // const prevSubmitCountRef = useRef(submitCount)
  const errorKey = Object.keys(errors)[0]
  useEffect(() => {
    if (isValid || !fieldRef.current || !scrollViewRef?.current) {
      return
    }
    console.log('first error key', errorKey, 'name', name, { offsetY }, { submitCount })
    // if (prevSubmitCountRef.current !== submitCount) {
    if (errorKey === name) {
      if (canFocus) {
        // fieldRef.current.focus() // 多种表单元素
      }
      submitCount >= 1 &&
        scrollViewRef.current.scrollTo({
          y: offsetY - headerHeight,
        })
    }

    // prevSubmitCountRef.current = submitCount
  }, [
    submitCount,
    isValid,
    errorKey,
    fieldRef,
    name,
    scrollViewRef,
    canFocus,
    offsetY,
    headerHeight,
  ])
  return null
}
