import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { View, StatusBar, ImageBackground, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import debounce from 'lodash.debounce'
import { Slider } from '@miblanchard/react-native-slider'
import { ActivityIndicator } from '@ant-design/react-native'

import { PageStyles, Text, Hint } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import { ApplyButton } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { Calculate, Product } from '@/typings/apply'
import { useBehavior, useLocation } from '@/hooks'
import { queryProduct, scheduleCalc, submit } from '@/services/apply'
import { MMKV } from '@/utils'
import { default as MoneyyaContext } from '@/state'
import emitter from '@/eventbus'

export const Step8 = ({ navigation, route }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const params = (route.params as { bankCardNo?: string }) || {}

  const onSubmit = debounce(
    () => {
      if (!loanCode || !productCode) {
        emitter.emit('SHOW_MESSAGE', { type: 'info', message: t('choose-product-prompt') })
        return
      }
      submit<'8'>({
        // sensor: { //TODO 设备信息页, 登录成功后/最有一步签约时也提交设备信息
        gps: context.header.gps,
        loanCode,
        loanTerms: loanDay,
        displayLoanDays,
        applyAmount: loanAmt,
        maxApplyAmount: productInfo?.maxViewAmount || 0,
        productCode,
        applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
        currentStep: 8,
        totalSteps: TOTAL_STEPS,
      }).then(() => {
        // TODO 获取userinfo userStatus === 'N' 需要再次验证验证码 type: CONFIRM=>  跳转一个新的页面 -> 不强制, 点击返回-> 合同详情
        // TODO 提交/smart-loan/app/validate/kaptcha
        navigation.navigate('BottomTab', {
          screen: 'OrderDetail',
          params: {
            applyId: MMKV.getString(KEY_APPLYID),
          },
        })
      })
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  useBehavior<'P08'>('P08', 'P08_C00', 'P08_C99')
  useLocation()
  const context = useContext(MoneyyaContext)
  const [productInfo, setProductInfo] = useState<Product>()
  const [loanAmt, setLoanAmt] = useState<number>(0)
  const [loanDay, setLoanDay] = useState<number>(0)

  const [displayLoanDays, setDisplayLoanDays] = useState<number>(0)
  const [loanCode, setLoanCode] = useState<string>('')
  const [productCode, setProductCode] = useState<string>('')

  // 获取产品信息
  useEffect(() => {
    if (context.user?.phone) {
      queryProduct({ phone: context.user?.phone || '', source: 'APP' }).then(res => {
        console.log('productInfo', res)
        setProductInfo(res)
        setLoanAmt(res.maxAmount)
        const firstProduct = res.products.find(({ available }) => available === 'Y')
        if (firstProduct) {
          setLoanCode(firstProduct.loanCode)
          setProductCode(firstProduct.productCode)
          setDisplayLoanDays(firstProduct.displayLoanDays)
          setLoanDay(firstProduct.loanTerms)
        }
      })
    }
  }, [context.user?.phone])
  // 试算信息
  const [calcResult, setcalcResult] = useState<Calculate>()
  useEffect(() => {
    if (loanCode && displayLoanDays > 0) {
      scheduleCalc({
        displayLoanDays,
        loanAmt,
        loanCode,
        loanDay,
      }).then(res => {
        console.log('calc', res)
        res && setcalcResult(res)
      })
    }
  }, [loanAmt, loanDay, loanCode, displayLoanDays])
  const loanTermArray: {
    day: number
    activate: boolean
    productCode: string
    loanCode: string
    loanTerms: number
  }[] = useMemo(
    () =>
      productInfo
        ? productInfo.products.map(
            ({
              displayLoanDays: day,
              available,
              loanTerms: _loanTerms,
              loanCode: _loanCode,
              productCode: _productCode,
            }) => ({
              day,
              activate: available === 'Y',
              loanTerms: _loanTerms,
              loanCode: _loanCode,
              productCode: _productCode,
            })
          )
        : [],
    [productInfo]
  )

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <View style={{ paddingHorizontal: 12, backgroundColor: '#fff', flexDirection: 'row' }}>
        <Hint
          hint={t('promptRepayHint')}
          hintColor="rgba(255, 50, 50, 1)"
          img={require('@/assets/compressed/apply/loan_notice.webp')}
        />
      </View>
      <ActivityIndicator
        animating={context.loading.effects.PRODUCT}
        toast
        size="large"
        text={t('loading')}
      />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <View style={[PageStyles.form, { paddingHorizontal: 0, paddingTop: 0 }]}>
            <ImageBackground
              source={require('@/assets/compressed/apply/loan_bg.webp')}
              resizeMode="stretch"
              style={{ width: '100%', height: 159 }}>
              <View style={{ alignItems: 'center', paddingTop: 23.5 }}>
                <Text fontSize={25} fontWeight="bold" color="#fff">
                  ${loanAmt}
                </Text>
                <Text fontSize={13} color="#fff">
                  Loan Amount
                </Text>
                <Slider
                  containerStyle={{ width: 330, height: 34 }}
                  minimumValue={productInfo?.minAmount || 3000}
                  value={loanAmt}
                  onValueChange={v => {
                    // TODO 选不到时显示红色，并提示当前最大可选金额是多少
                    setLoanAmt(Array.isArray(v) ? v[0] : v)
                  }}
                  step={productInfo?.amountStep || 1000}
                  trackStyle={{ height: 5 }}
                  thumbStyle={{ alignItems: 'center', height: 34 }}
                  thumbTintColor="transparent"
                  thumbImage={require('@/assets/compressed/apply/slider_dot.webp')}
                  maximumValue={productInfo?.maxViewAmount || 10000}
                  minimumTrackTintColor={Color.primary}
                  maximumTrackTintColor="rgba(179, 206, 242, 1)"
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                }}>
                <Text fontSize={11} color="#fff" key="left">
                  {productInfo?.minAmount || 3000}
                </Text>
                <Text fontSize={11} color="#fff" key="right">
                  {productInfo?.maxViewAmount || 10000}
                </Text>
              </View>
            </ImageBackground>
            <View
              style={{
                borderTopColor: '#eee',
                borderBottomColor: '#eee',
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                paddingTop: 17,
                paddingBottom: 29,
              }}>
              <LeftTopDot />
              <LeftBottomDot />
              <RightBottomDot />
              <RightTopDot />
              <View style={{ alignItems: 'center', paddingBottom: 24.5 }}>
                <Text fontSize={15} color={Color.primary}>
                  Loan Days
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {loanTermArray.map(
                  ({
                    day,
                    activate,
                    loanCode: _loanCode,
                    productCode: _productCode,
                    loanTerms,
                  }) => (
                    <Pressable
                      key={`${day}`}
                      disabled={!activate}
                      onPress={() => {
                        setDisplayLoanDays(day)
                        setLoanDay(loanTerms)
                        setLoanCode(_loanCode)
                        setProductCode(_productCode)
                      }}
                      style={{
                        backgroundColor: activate
                          ? loanDay === day
                            ? Color.primary
                            : '#fff'
                          : '#eeeeee',
                        borderColor: activate ? Color.primary : '#eeeeee',
                        borderWidth: 1,
                        borderRadius: 17.5,
                        paddingHorizontal: 33,
                        paddingVertical: 12.5,
                      }}>
                      <Text
                        fontSize={13}
                        color={activate ? (loanDay === day ? '#fff' : '#333') : '#777'}>
                        {`${day}`.padStart(2, '0')}
                      </Text>
                    </Pressable>
                  )
                )}
              </View>
            </View>
            <View
              style={{
                width: '100%',
                borderBottomColor: '#eee',
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                alignItems: 'center',
              }}>
              <Text fontSize={15} color={Color.primary}>
                Loan information
              </Text>
              <LeftBottomDot />
              <RightBottomDot />
              <ListInfo
                data={[
                  { name: t('loanAmount'), value: loanAmt, type: 'money' },
                  { name: t('loanDays'), value: loanDay, type: 'day' },
                  { name: t('transferAmount'), value: productInfo?.maxAmount || 0, type: 'money' },
                  {
                    name: t('fee'),
                    value: calcResult?.svcFee ? calcResult?.svcFee : 0,
                    type: 'money',
                  },
                  {
                    name: t('bankCard'),
                    value: params.bankCardNo ? +params.bankCardNo : 0,
                    type: 'bank',
                  },
                ]}
              />
              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 20,
                  paddingVertical: 13,
                  flexDirection: 'row',
                }}>
                <Pressable
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Step71')
                  }}>
                  <Text fontSize={10} color={Color.primary}>
                    {'->'}
                    {'    '}
                    {t('tostep7')}
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text fontSize={15} color={Color.primary}>
                {t('bill-information')}
              </Text>
              <ListInfo
                data={
                  calcResult?.instalmentMark === 'Y'
                    ? [
                        { name: t('firstPaymentdate'), value: 1772832832, type: 'date' },
                        { name: t('firstPaymentAmount'), value: 7, type: 'money' },
                      ]
                    : [
                        { name: t('loanAmount'), value: loanAmt, type: 'money' },
                        { name: t('loanDays'), value: loanDay, type: 'day' },
                      ]
                }
              />
              {calcResult?.instalmentMark === 'Y' && (
                <View
                  style={{
                    height: 10,
                    width: '90%',
                    alignSelf: 'center',
                    marginVertical: 2,
                  }}
                />
              )}
              <ListInfo
                data={
                  calcResult?.instalmentMark === 'Y'
                    ? [
                        { name: t('secondPaymentDate'), value: 1772832832, type: 'date' },
                        {
                          name: t('secondPaymentAmount'),
                          value: 261800,
                          type: 'money',
                          extra: (
                            <View
                              style={{
                                paddingHorizontal: 7,
                                paddingVertical: 6,
                                backgroundColor: Color.primary,
                                borderRadius: 5,
                                marginLeft: 9,
                              }}>
                              <Text fontSize={12} fontWeight="bold" color="#fff">
                                {t('free')}
                              </Text>
                            </View>
                          ),
                        },
                      ]
                    : []
                }
              />
            </View>
          </View>

          <View style={PageStyles.btnWrap}>
            <ApplyButton
              type="primary"
              //@ts-ignore
              onPress={onSubmit}
              // loading={state}
            >
              <Text color="#fff" fontSize={19}>
                {t('submit')}
              </Text>
            </ApplyButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const LeftTopDot = () => (
  <View
    style={{
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: 'rgba(230, 241, 248, 1)',
      position: 'absolute',
      left: -8,
      top: -8,
    }}
  />
)
const RightTopDot = () => (
  <View
    style={{
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: 'rgba(230, 241, 248, 1)',
      position: 'absolute',
      right: -8,
      top: -8,
    }}
  />
)
const RightBottomDot = () => (
  <View
    style={{
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: 'rgba(230, 241, 248, 1)',
      position: 'absolute',
      right: -8,
      bottom: -8,
    }}
  />
)
const LeftBottomDot = () => (
  <View
    style={{
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: 'rgba(230, 241, 248, 1)',
      position: 'absolute',
      left: -8,
      bottom: -8,
    }}
  />
)

type ValueType = 'day' | 'money' | 'bank' | 'date'
const ListInfo = ({
  data,
}: {
  data: { name: string; value: number; type: ValueType; extra?: ReactNode }[]
}) => {
  return (
    <View style={{ width: '100%', paddingHorizontal: 17 }}>
      {data.map(item => (
        <View
          key={item.name}
          style={{
            width: '100%',
            paddingHorizontal: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: 'rgba(225, 227, 224, 1)',
            borderBottomWidth: 1,
            borderStyle: 'dashed',
            paddingVertical: 10,
          }}>
          {item.extra ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text fontSize={12} color="rgba(132, 135, 137, 1)">
                {item.name}
              </Text>
              {item.extra}
            </View>
          ) : (
            <Text fontSize={12} color="rgba(132, 135, 137, 1)">
              {item.name}
            </Text>
          )}
          <ValueText value={item.value} type={item.type} />
        </View>
      ))}
    </View>
  )
}

const ValueText = ({ value, type }: { value: number; type: ValueType }) => {
  const { t } = useTranslation()
  switch (type) {
    case 'bank':
      return (
        <Text fontSize={12} color="rgba(28, 37, 42, 1)">
          **** **** **** {`${value}`.substring(`${value}`.length - 4)}
        </Text>
      )
    case 'day':
      return (
        <Text fontSize={12} color="rgba(28, 37, 42, 1)">
          {value}
          {t('days')}
        </Text>
      )
    case 'money':
      return (
        <Text fontSize={12} color="rgba(28, 37, 42, 1)">
          {value ? t('intlCurrency', { val: value }) : '--'}
        </Text>
      )
    default:
      return (
        <Text fontSize={12} color="rgba(28, 37, 42, 1)">
          {value}
        </Text>
      )
  }
}
