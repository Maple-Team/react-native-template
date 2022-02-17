import { Color } from '@/styles/color'
import { PageStyles, Text } from '@/components'
import React, { useContext, useMemo, useState } from 'react'
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  View,
  type ViewStyle,
  type ImageStyle,
  Pressable,
  TextInput,
} from 'react-native'
import { StackActions, useNavigation, useRoute } from '@react-navigation/native'
import { object, number } from 'yup'
import type { Shape } from '@/typings/common'
import { useTranslation } from 'react-i18next'
import { ErrorMessage, Formik } from 'formik'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS } from '@/utils/constant'
import debounce from 'lodash.debounce'
import { default as MoneyyaContext } from '@/state'

type FormModel = { amount: string; applyId: string }
export function Payment() {
  const { t } = useTranslation()
  const schema = object<Shape<FormModel>>({
    amount: number()
      .typeError(t('numberRequired'))
      .min(50, t('payAmount.invalid', { val: 50 }))
      .required(t('payAmount.required')),
  })
  const route = useRoute()
  const params = route.params as { applyId: string; repayAmount: number }
  const [payType, setPayType] = useState<'spei' | 'oxxo'>()
  const [visible, setVisible] = useState<boolean>(false)
  const context = useContext(MoneyyaContext)
  const initialValue: FormModel = {
    amount: `${params?.repayAmount}` || '0',
    applyId: params?.applyId || '',
  }
  const na = useNavigation()
  const onSubmit = debounce(
    (values: FormModel) => {
      if (payType) {
        na.dispatch(
          StackActions.replace('PaymentDetail', {
            ...values,
            type: payType,
          })
        )
      }
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  /**
   * FIXME
   * 逾期日期
   */
  const day = useMemo(() => {
    const repayDate = context.user?.repayDate
    if (repayDate) {
      return dayjs(repayDate).diff(dayjs(), 'days')
    }
    return '--'
  }, [context.user?.repayDate])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      {!visible ? (
        <ScrollView style={[PageStyles.scroll, { paddingHorizontal: 0, paddingTop: 26.5 }]}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={require('@/assets/compressed/additional/cash.webp')}
              resizeMode="cover"
              style={{ marginBottom: 18.5 }}
            />
            <Text fontFamily="Arial-BoldMT" fontWeight="bold" fontSize={15} color="#26272B">
              {t('repaymentAmount')}
            </Text>
            <Text
              //@ts-ignore
              styles={{ paddingTop: 21.5, paddingBottom: 16.5 }}
              fontFamily="Arial-BoldMT"
              fontWeight="bold"
              fontSize={37}
              color="#26272B">
              {t('mxn')} {toThousands(params?.repayAmount || 0)}
            </Text>
            <Text fontFamily="ArialMT" fontSize={12} color="#26272B">
              {t('overduePrompt', { day })}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#8BA2B0',
              borderRadius: 5,
              marginHorizontal: 8,
              paddingTop: 5,
              paddingBottom: 8.5,
              paddingHorizontal: 14,
              marginVertical: 16,
            }}>
            <Text color="#fff" fontSize={12}>
              {t('paymentPrompt1')}
            </Text>
            <Text color="#fff" fontSize={12}>
              {t('paymentPrompt2')}
            </Text>
          </View>
          <View style={{ backgroundColor: '#fff', paddingHorizontal: 20 }}>
            <Pressable
              key={'spei'}
              style={style.payitem}
              onPress={() => {
                setPayType('spei')
                setVisible(true)
              }}>
              <Image
                style={style.payimg}
                resizeMode="cover"
                source={require('@/assets/compressed/additional/spe.webp')}
              />
              <View style={[style.payinfo, { borderBottomColor: '#D0DEE4', borderBottomWidth: 1 }]}>
                <View style={style.payinfoText}>
                  <Text fontSize={15} color="#333230">
                    {t('paymentNumPrompt')}
                    {'  '}
                  </Text>
                  <Text fontSize={17} color="#0123F7">
                    0
                  </Text>
                  <Text fontSize={15} color="#333230">
                    {'  '}
                    {t('mxn')}
                  </Text>
                </View>
                <Image
                  style={style.payright}
                  resizeMode="cover"
                  source={require('@/assets/compressed/user-center/right.webp')}
                />
              </View>
            </Pressable>
            <Pressable
              key={'oxxo'}
              style={style.payitem}
              onPress={() => {
                setPayType('oxxo')
                setVisible(true)
              }}>
              <Image
                style={style.payimg}
                resizeMode="cover"
                source={require('@/assets/compressed/additional/oxxo.webp')}
              />
              <View style={style.payinfo}>
                <View style={style.payinfoText}>
                  <Text fontSize={15} color="#333230">
                    {t('paymentNumPrompt')}
                    {'  '}
                  </Text>
                  <Text fontSize={17} color="#0123F7">
                    27
                  </Text>
                  <Text fontSize={15} color="#333230">
                    {'  '} {t('mxn')}
                  </Text>
                </View>
                <Image
                  style={style.payright}
                  resizeMode="cover"
                  source={require('@/assets/compressed/user-center/right.webp')}
                />
              </View>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#AFAFAF',
            justifyContent: 'center',
          }}>
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 27.5,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                paddingTop: 46.5,
              }}>
              <Formik<FormModel>
                initialValues={initialValue}
                onSubmit={onSubmit}
                validateOnBlur
                validationSchema={schema}>
                {({ handleSubmit, errors, values, handleChange }) => {
                  return (
                    <>
                      <View style={{ paddingHorizontal: 25.5 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Image
                            style={{ marginRight: 18 }}
                            source={require('@/assets/compressed/additional/note.webp')}
                          />
                          <Text color="#333030" fontSize={18}>
                            {t('restRepayAmount')}{' '}
                          </Text>
                          <Text color="#333030" fontSize={18}>
                            {params?.repayAmount || 0}
                          </Text>
                          <Text
                            fontWeight="bold"
                            color="#333030"
                            fontSize={15}
                            //@ts-ignore
                            styles={{ marginLeft: 16.5 }}>
                            {t('mxn')}
                          </Text>
                        </View>
                        <View>
                          <View style={{ paddingTop: 44 }}>
                            <Text>{t('currentLoanInfoHint')}</Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderBottomColor: errors.amount ? '#f00' : '#B4CCE2',
                                borderBottomWidth: 1,
                              }}>
                              <TextInput
                                onChangeText={handleChange('amount')}
                                maxLength={10}
                                value={values.amount}
                                multiline={true}
                                placeholder={t('payAmount.placeholder')}
                                style={[errors.amount ? { borderBottomColor: 'red' } : {}]}
                                keyboardType={'number-pad'}
                                placeholderTextColor={'rgba(156, 171, 185, 1)'}
                              />
                              {values.amount ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Text>{t('mxn')}</Text>
                                  {errors.amount ? (
                                    <Pressable
                                      android_disableSound={true}
                                      focusable
                                      style={{ marginLeft: 10 }}
                                      hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
                                      <Image
                                        source={require('@assets/compressed/common/clear.webp')}
                                        resizeMode="cover"
                                      />
                                    </Pressable>
                                  ) : (
                                    <Image
                                      source={require('@assets/compressed/common/correct.webp')}
                                      resizeMode="cover"
                                    />
                                  )}
                                </View>
                              ) : (
                                <></>
                              )}
                            </View>
                            <ErrorMessage name={'amount'}>
                              {msg => <Text color="red">{msg}</Text>}
                            </ErrorMessage>
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', marginTop: 50.5 }}>
                        <Pressable
                          //@ts-ignore
                          onPress={handleSubmit}
                          style={{
                            width: '50%',
                            backgroundColor: Color.primary,
                            borderRadius: 0,
                            borderBottomLeftRadius: 14,
                            paddingVertical: 17,
                            alignItems: 'center',
                          }}>
                          <Text color="#fff" fontSize={17}>
                            {t('ok')}
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            setVisible(false)
                          }}
                          style={{
                            width: '50%',
                            backgroundColor: '#E3E3E3',
                            borderRadius: 0,
                            borderBottomRightRadius: 14,
                            paddingVertical: 17,
                            alignItems: 'center',
                          }}>
                          <Text color="#909090" fontSize={17}>
                            {t('cancel')}
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )
                }}
              </Formik>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

import StyleSheet from 'react-native-adaptive-stylesheet'
import { toThousands } from '@/utils/util'
import dayjs from 'dayjs'

const style = StyleSheet.create<{
  payitem: ViewStyle
  payinfo: ViewStyle
  payinfoText: ViewStyle
  payimg: ImageStyle & ViewStyle
  payright: ImageStyle & ViewStyle
}>({
  payitem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  payimg: {
    marginRight: 16.5,
  },
  payinfo: {
    flexDirection: 'row',
    paddingVertical: 18,
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 21,
    alignItems: 'center',
  },
  payinfoText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  payright: {
    marginLeft: 50,
  },
})
