import { useFormikContext } from 'formik'
import { useRef, useEffect, RefObject } from 'react'
import { TextInput } from 'react-native'

//参考
// https://github.com/jaredpalmer/formik/issues/146
// https://codesandbox.io/s/scroll-to-input-formik-failed-submission-gnehr?file=/src/App.js:2437-2455

export const useFocusOnError = ({
  fieldRef,
  name,
}: {
  fieldRef: RefObject<TextInput>
  name: string
}) => {
  const formik = useFormikContext()
  const prevSubmitCountRef = useRef(formik.submitCount)
  const firstErrorKey = Object.keys(formik.errors)[0]
  useEffect(() => {
    if (prevSubmitCountRef.current !== formik.submitCount && !formik.isValid) {
      if (fieldRef.current && firstErrorKey === name) {
        fieldRef.current.focus()
      }
    }
    prevSubmitCountRef.current = formik.submitCount
  }, [formik.submitCount, formik.isValid, firstErrorKey, fieldRef, name])
}
