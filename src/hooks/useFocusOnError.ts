import { useFormikContext } from 'formik'
import { useEffect, RefObject, useRef } from 'react'
import type { TextInput } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

//参考
// https://github.com/jaredpalmer/formik/issues/146
// https://codesandbox.io/s/scroll-to-input-formik-failed-submission-gnehr?file=/src/App.js:2437-2455

export const useFocusOnError = ({
  fieldRef,
  name,
  scrollViewRef,
  canFocus,
  height,
}: {
  fieldRef: RefObject<TextInput>
  name: string
  canFocus?: boolean
  height: number
  scrollViewRef?: RefObject<ScrollView>
}) => {
  const formik = useFormikContext()
  const prevSubmitCountRef = useRef(formik.submitCount)
  const errorKey = Object.keys(formik.errors)[0]
  // NOTE maskinput field ref has some problem
  useEffect(() => {
    if (prevSubmitCountRef.current !== formik.submitCount && !formik.isValid) {
      if ((fieldRef.current || fieldRef) && errorKey === name && scrollViewRef?.current) {
        if (canFocus) {
          fieldRef.current
            ? fieldRef.current.focus()
            : //@ts-ignore
              fieldRef?.focus()
        }
        scrollViewRef.current?.scrollTo({
          x: 0,
          y: height, // NOTE 这个高度还是有点问题
          animated: true,
        })
      }
    }
    prevSubmitCountRef.current = formik.submitCount
  }, [
    formik.submitCount,
    formik.isValid,
    errorKey,
    fieldRef,
    name,
    scrollViewRef,
    canFocus,
    height,
  ])
}
