import { useFormikContext } from 'formik'
import { useEffect, type RefObject } from 'react'
import type { TextInput } from 'react-native'
import type { ScrollView } from 'react-native-gesture-handler'
import { useHeaderHeight } from '@react-navigation/elements'
//参考
// https://github.com/jaredpalmer/formik/issues/146
// https://codesandbox.io/s/scroll-to-input-formik-failed-submission-gnehr?file=/src/App.js:2437-2455

export const UseFocusOnError = ({
  fieldRef,
  name,
  scrollViewRef,
  canFocus,
  offsetY,
}: {
  fieldRef: RefObject<TextInput>
  name: string
  canFocus?: boolean
  offsetY: number
  scrollViewRef?: RefObject<ScrollView>
}) => {
  const { submitCount, isValid, errors } = useFormikContext()
  const headerHeight = useHeaderHeight()

  // const prevSubmitCountRef = useRef(submitCount)
  const errorKey = Object.keys(errors)[0]
  useEffect(() => {
    if (isValid) {
      return
    }
    if (!fieldRef.current || !scrollViewRef?.current) {
      return
    }
    console.log('error key', name, offsetY, headerHeight)
    // if (prevSubmitCountRef.current !== submitCount) {
    if (errorKey === name && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: offsetY - headerHeight,
        animated: true,
      })
      if (canFocus) {
        // 多种表单元素
        fieldRef.current.focus()
      }
    }

    // }
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
