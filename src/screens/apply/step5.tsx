import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useMemo } from 'react'
import { View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import { Formik } from 'formik'
import * as Yup from 'yup'
import debounce from 'lodash.debounce'

import { PageStyles, Text } from '@/components'
import { REGEX_PHONE } from '@/utils/reg'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { ApplyButton, IdcardPhotoPicker } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import { ApplyStep5Parameter } from '@/typings/apply'
import { useLoction } from '@/hooks/useLocation'

type FormModel = Omit<ApplyStep5Parameter, 'applyId' | 'currentStep' | 'totalSteps'>
export const Step5 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const schema = Yup.object().shape({
    phone: Yup.string()
      .min(10, t('field.short', { field: 'Phone' }))
      .max(10, t('field.long', { field: 'Phone' }))
      .matches(REGEX_PHONE, t('phone.invalid'))
      .required(t('phone.required')),
  })
  const initialValue = useMemo<FormModel>(
    () => ({
      firstName: '',
      educationCode: '',
      email: '',
      homeAddrCity: '',
      homeAddrCityCode: '',
      homeAddrDetail: '',
      homeAddrProvince: '',
      homeAddrProvinceCode: '',
      backupPhone: '',
      birth: '',
      docType: '',
      idcard: '',
      lastName: '',
      loanPurpose: '',
      maritalStatus: '',
      middleName: '',
      name: '',
      secondCardNo: '',
      sex: 'male',
      thirdInfos: [],
    }),
    []
  )
  const onSubmit = debounce(
    (values: FormModel) => {
      console.log(values)
      navigation.navigate('SignIn')
      //TODO
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )

  const location = useLoction()
  console.log(location)

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <Formik<FormModel>
            initialValues={initialValue}
            onSubmit={onSubmit}
            validationSchema={schema}>
            {({ handleChange, handleSubmit, isValid }) => (
              <>
                <View style={PageStyles.form}>
                  <IdcardPhotoPicker
                    onChange={handleChange('')}
                    field={'ss'}
                    label={'El frente de tu ID'}
                    bg={require('@assets/images/apply/id1.webp')}
                  />
                  <IdcardPhotoPicker
                    onChange={handleChange('')}
                    field={'ss'}
                    label={'La parte trasera de tu ID'}
                    bg={require('@assets/images/apply/id2.webp')}
                  />
                </View>
                <View style={PageStyles.btnWrap}>
                  <ApplyButton
                    type={isValid ? 'primary' : undefined}
                    handleSubmit={handleSubmit}
                    // loading={state}
                  >
                    <Text fontSize={18} color="#fff">
                      {t('submit')}
                    </Text>
                  </ApplyButton>
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
