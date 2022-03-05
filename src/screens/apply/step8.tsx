import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { View, StatusBar, ImageBackground, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import debounce from 'lodash.debounce'
import { Slider } from '@miblanchard/react-native-slider'
import { isEmulator } from 'react-native-device-info'
import { PageStyles, Text, Hint, ToastLoading } from '@/components'
import {
  DEBOUNCE_OPTIONS,
  DEBOUNCE_WAIT,
  KEY_APPLYID,
  KEY_DEVICEID,
  KEY_GPS,
  KEY_INTERIP,
  KEY_LIVENESS,
  KEY_OUTERIP,
  TOTAL_STEPS,
} from '@/utils/constant'
import { ApplyButton } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { Calculate, Product, ProductItem } from '@/typings/apply'
import { useBehavior, useLocation, useSensor } from '@/hooks'
import {
  queryProduct,
  scheduleCalc,
  submit,
  uploadAllApp,
  uploadDeviceInfo,
} from '@/services/apply'
import { MMKV } from '@/utils'
import { default as MoneyyaContext } from '@/state'
import emitter from '@/eventbus'
import { Toast } from '@ant-design/react-native'
import { uploadJpush } from '@/services/misc'
import { AppModule } from '@/modules'
import { getDeviceInfo } from '@/utils/device'
import { StackActions } from '@react-navigation/native'

const WARN_COLOR = '#f00'
export const Step8 = ({ navigation, route }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const params = (route.params as { bankCardNo?: string }) || {}
  const [productLoading, setProductLoading] = useState<boolean>()
  const sensor = useSensor()
  const onSubmit = debounce(
    () => {
      if (!product) {
        emitter.emit('SHOW_MESSAGE', { type: 'info', message: t('choose-product-prompt') })
        return
      }
      const applyId = +(MMKV.getString(KEY_APPLYID) || '0')
      const key = Toast.loading(t('loading'), 0)
      submit<'8'>({
        gps: MMKV.getString(KEY_GPS) || '0,0',
        loanCode: product.loanCode,
        loanTerms: loanDay,
        displayLoanDays: product.displayLoanDays,
        applyAmount: loanAmt,
        maxApplyAmount: productInfo?.maxViewAmount || 0,
        productCode: product.productCode,
        applyId,
        currentStep: 8,
        totalSteps: TOTAL_STEPS,
      }).then(async () => {
        // NOTE JPUSH 签约
        const userStatus = context.user?.userAuthStatus
        const step5Data = MMKV.getMap('step5Data') as { idcard: string }
        const idcard = step5Data.idcard.replace(/\s/g, '')
        const phone = context?.user?.phone || ''
        uploadJpush({
          phone,
          custId: idcard || '',
        })
          .then(r => console.log('---------------uploadJpush--------------', r))
          .catch(console.error)
        ;['step2Data', 'step3Data', 'step5Data', 'step7Data'].forEach(k => {
          MMKV.removeItem(k)
        })
        const apps = await AppModule.getApps()
        const deviceId = MMKV.getString(KEY_DEVICEID) || ''
        uploadAllApp({ appInfos: apps, applyId, deviceId })
        const device = await getDeviceInfo()
        const _isEmulator = await isEmulator()
        uploadDeviceInfo({
          ...device,
          anglex: sensor?.angleX || '',
          angley: sensor?.angleY || '',
          anglez: sensor?.angleZ || '',
          applyId: `${applyId}`,
          deviceId,
          googleAdvertisingId: deviceId,
          gpsInfo: MMKV.getString(KEY_GPS) || '0,0',
          idcard,
          intranetIP: MMKV.getString(KEY_INTERIP) || '',
          isSimulator: _isEmulator ? 'Y' : 'N',
          phone,
          requestIp: MMKV.getString(KEY_OUTERIP) || '',
        })
        MMKV.removeItem(KEY_LIVENESS)
        Toast.remove(key)
        if (userStatus === 'N') {
          // 二次验证码校验 validateCode
          navigation.getParent()?.navigate('ValidateCode', {
            phone,
            applyId,
          })
        } else {
          navigation.getParent()?.dispatch(
            StackActions.replace('BillsDetail', {
              applyId: MMKV.getString(KEY_APPLYID),
            })
          )
        }
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
  const [product, setProduct] = useState<ProductItem>()

  // 获取产品信息
  useEffect(() => {
    if (context.user?.phone) {
      setProductLoading(true)
      queryProduct({ phone: context.user?.phone || '', source: 'APP' })
        .then(res => {
          console.log('productInfo', res)
          setProductInfo(res)
          setLoanAmt(res.maxAmount)
          const defaultProduct = res.products.find(({ available }) => available === 'Y')
          if (defaultProduct) {
            setProduct(defaultProduct)
            setLoanDay(defaultProduct.loanTerms)
          }
        })
        .finally(() => setProductLoading(false))
    }
  }, [context.user?.phone])
  // 试算信息
  const [calcResult, setcalcResult] = useState<Calculate>()
  const [isWarnging, setWarn] = useState<boolean>()

  useEffect(() => {
    if (product && loanAmt <= product.maxAmount) {
      scheduleCalc({
        displayLoanDays: product.displayLoanDays,
        loanAmt,
        loanCode: product.loanCode,
        loanDay,
      }).then(res => {
        console.log('calc', res)
        res && setcalcResult(res)
      })
    }
  }, [loanAmt, loanDay, product])
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

  useEffect(() => {
    if (product) {
      if (loanAmt > product.maxAmount || 0) {
        setWarn(true)
      } else {
        setWarn(false)
      }
    }
  }, [loanAmt, product])

  useEffect(() => {
    if (isWarnging) {
      Toast.info(t('exceedMaxAmount'))
    }
  }, [isWarnging, t])

  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ToastLoading animating={productLoading} />
      <View style={{ paddingHorizontal: 12, backgroundColor: '#fff', flexDirection: 'row' }}>
        <Hint
          hint={t('promptRepayHint')}
          hintColor="rgba(255, 50, 50, 1)"
          img={require('@/assets/compressed/apply/loan_notice.webp')}
        />
      </View>
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <View style={[PageStyles.form, { paddingHorizontal: 0, paddingTop: 0 }]}>
            <ImageBackground
              source={require('@/assets/compressed/apply/loan_bg.webp')}
              resizeMode="stretch"
              style={{ width: '100%', height: 159 }}>
              <View style={{ alignItems: 'center', paddingTop: 23.5 }}>
                <Text fontSize={25} fontWeight="bold" color={isWarnging ? WARN_COLOR : '#fff'}>
                  {t('$')}
                  {loanAmt}
                </Text>
                <Text fontSize={13} color={isWarnging ? WARN_COLOR : '#fff'}>
                  {t('loanAmount')}
                </Text>
                <Slider
                  containerStyle={{ width: 330, height: 34 }}
                  minimumValue={product?.minAmount || 3000}
                  value={loanAmt}
                  onValueChange={v => {
                    const amount = Array.isArray(v) ? v[0] : v
                    setLoanAmt(amount)
                  }}
                  step={productInfo?.amountStep || 1000}
                  trackStyle={{ height: 5, backgroundColor: isWarnging ? WARN_COLOR : '#B3CEF2' }}
                  thumbStyle={{ alignItems: 'center', height: 34 }}
                  thumbTintColor="transparent"
                  thumbImage={require('@/assets/compressed/apply/slider_dot.webp')}
                  maximumValue={product?.maxViewAmount || 10000}
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
                  {t('loanDays')}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {loanTermArray.map(
                  (
                    { day, activate, loanCode: _loanCode, productCode: _productCode, loanTerms },
                    index
                  ) => (
                    <Pressable
                      key={`${day}`}
                      disabled={!activate}
                      onPress={() => {
                        setLoanDay(loanTerms)
                        setProduct(productInfo?.products[index])
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
                {t('loanInfoHint')}
              </Text>
              <LeftBottomDot />
              <RightBottomDot />
              <ListInfo
                data={[
                  {
                    name: t('loanAmount'),
                    value:
                      loanAmt > (product ? product.maxAmount : 0)
                        ? product
                          ? product.maxAmount
                          : 0
                        : loanAmt,
                    type: 'money',
                  },
                  { name: t('loanDays'), value: product?.displayLoanDays || 0, type: 'day' },
                  {
                    name: t('transferAmount'),
                    value: calcResult?.actualAmount || 0,
                    type: 'money',
                  },
                  {
                    name: t('fee'),
                    value: calcResult?.svcFee ? calcResult?.svcFee : 0,
                    type: 'money',
                  },
                  {
                    name: t('bankCard'),
                    value: params.bankCardNo ? params.bankCardNo : 0,
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
                        {
                          name: t('firstPaymentdate'),
                          value: calcResult.termSchedules[0].loanPmtDueDate,
                          type: 'date',
                        },
                        {
                          name: t('firstPaymentAmount'),
                          value: calcResult.termSchedules[0].totalAmt,
                          type: 'money',
                        },
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
                        {
                          name: t('secondPaymentDate'),
                          value: calcResult.termSchedules[1].loanPmtDueDate,
                          type: 'date',
                        },
                        {
                          name: t('secondPaymentAmount'),
                          value: calcResult.termSchedules[1].totalAmt,
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
  data: { name: string; value: number | string; type: ValueType; extra?: ReactNode }[]
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

const ValueText = ({ value, type }: { value: number | string; type: ValueType }) => {
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
