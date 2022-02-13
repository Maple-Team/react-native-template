import React, { useContext, useEffect, useMemo } from 'react'
import { View, Image, StatusBar, ImageBackground } from 'react-native'
import { StackActions, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabHeader, Text } from '@/components'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '@ant-design/react-native'
import { Color } from '@/styles/color'
import Swiper from 'react-native-swiper'
import Styles from './style'
import { pv, queryVersion, submit } from '@/services/apply'
import { default as MoneyyaContext } from '@/state'

import { MMKV } from '@/utils/storage'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT, KEY_APPLYID, TOTAL_STEPS } from '@/utils/constant'
import debounce from 'lodash.debounce'
import { useLocation } from '@/hooks'
import { toThousands } from '@/utils/util'
import { APPLY_STATE } from '@/state/enum'
import emitter from '@/eventbus'
import { queryUserinfo } from '@/services/user'
import { useTranslation } from 'react-i18next'
interface Status {
  btnText: string
  amount: number
  prompt: string
  repayDate?: string
  repayAmount?: string
}
export function Step1() {
  const navigation = useNavigation()
  const context = useContext(MoneyyaContext)

  useEffect(() => {
    queryVersion().then(res => {
      console.log('version', res)
    })
  }, [])

  useEffect(() => {
    pv({ userId: `${context.user?.userId}` || '' })
  }, [context.user?.userId])

  const location = useLocation()
  const { t } = useTranslation()
  console.log(context.user)
  console.log(context.loading.effects)
  const applyStatus = context.user?.applyStatus
  const status: Status = useMemo(() => {
    let value: Status = {
      btnText: '',
      amount: 0,
      prompt: '',
    }
    switch (applyStatus) {
      case APPLY_STATE.LOAN:
      case APPLY_STATE.WAIT:
        value = {
          btnText: t('applyState.check'),
          prompt: 'Apply amount',
          amount: context.user?.applyAmount || 0,
        }
        break
      case APPLY_STATE.NORMAL:
      case APPLY_STATE.OVERDUE:
        value = {
          btnText: t('applyState.repay'),
          prompt: '请您保持良好的还款习惯',
          repayAmount: `${context.user?.repayAmount}` || '',
          repayDate: context.user?.repayDate || '',
          amount: 0,
        }
        break
      case APPLY_STATE.SETTLE:
        value = {
          btnText: t('applyState.continueLoan'),
          prompt: 'Available balance',
          amount: context.user?.maxAmount || 0,
        }
        break
      case APPLY_STATE.EMPTY:
      case APPLY_STATE.APPLY:
        value = {
          btnText: t('applyState.apply'),
          prompt: 'The maximum amount can be borrowed',
          amount: context.user?.MaxViewAmount || 0,
        }
        break
      case APPLY_STATE.CANCEL:
      case APPLY_STATE.REJECTED:
      default:
        value = {
          btnText: t('applyState.apply'),
          prompt: 'Available balance',
          amount: context.user?.maxAmount || 0,
        }
    }
    return value
  }, [
    applyStatus,
    context.user?.MaxViewAmount,
    context.user?.applyAmount,
    context.user?.maxAmount,
    context.user?.repayAmount,
    context.user?.repayDate,
    t,
  ])

  useEffect(() => {
    queryUserinfo().then(res => {
      MMKV.setString(KEY_APPLYID, `${res.applyId}`)
      emitter.emit('USER_INFO', res)
    })
  }, [])
  const onSubmit = debounce(
    () => {
      switch (applyStatus) {
        case APPLY_STATE.LOAN:
        case APPLY_STATE.WAIT:
          navigation.getParent()?.navigate('Order')
          break
        case APPLY_STATE.NORMAL:
        case APPLY_STATE.OVERDUE:
          // TODO 待还款列表
          // navigation.getParent()?.navigate('Payment', {
          //   applyId: context.user?.applyId,
          //   amount: context.user?.repayAmount,
          // })
          break
        case APPLY_STATE.SETTLE:
        case APPLY_STATE.APPLY:
        case APPLY_STATE.EMPTY:
        case APPLY_STATE.CANCEL:
        case APPLY_STATE.REJECTED:
        default:
          submit<'1'>({
            deviceId: context.header.deviceId,
            phone: context.user?.phone || '',
            gps: `${location.latitude},${location.longitude}`,
            idcard: context.user?.idcard || '',
            applyId: +(MMKV.getString(KEY_APPLYID) || '0'),
            currentStep: 1,
            totalSteps: TOTAL_STEPS,
          }).then(res => {
            MMKV.setString(KEY_APPLYID, `${res.applyId}`)
            // NOTE 快捷通道
            if (context.user?.continuedLoan === 'Y') {
              navigation.getParent()?.dispatch(StackActions.replace('Step8'))
            } else {
              if (res?.fromOther === 'Y') {
                navigation.getParent()?.dispatch(StackActions.replace('Step3'))
              } else {
                navigation.getParent()?.dispatch(StackActions.replace('Step2'))
              }
            }
          })
      }
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView
        style={{ paddingTop: 0, paddingHorizontal: 0 }}
        keyboardShouldPersistTaps="handled">
        <View>
          <ImageBackground
            source={require('@/assets/compressed/apply/banner.webp')}
            resizeMode="cover"
            style={{
              height: 284,
            }}>
            <TabHeader />
          </ImageBackground>
          <View style={Styles.loanInfo}>
            <View style={Styles.cashWrap}>
              <Image source={require('@/assets/compressed/apply/cash.webp')} resizeMode="cover" />
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 15,
                width: '100%',
                paddingTop: 50,
                paddingHorizontal: 10,
                paddingBottom: 11,
                alignItems: 'center',
                zIndex: 9,
                borderColor: 'rgba(216, 222, 236, 1)',
                borderWidth: 1,
              }}>
              <Text fontSize={14} color="rgba(1, 0, 56, 1)">
                {status.prompt}
              </Text>

              {status.repayAmount ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{ width: '50%' }}>
                      <Text>还款日期</Text>
                      <Text>{status.repayDate}</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text>还款金额</Text>
                      <Text>{status.repayAmount}</Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                    }}>
                    <Text
                      fontSize={22}
                      fontWeight="bold"
                      color={Color.primary}
                      //@ts-ignore
                      styles={{ top: 12 }}>
                      $
                    </Text>
                    <Text fontSize={57} color={Color.primary} fontWeight="bold">
                      {toThousands(status.amount)}
                    </Text>
                  </View>
                </>
              )}
              <Button
                //@ts-ignore
                onPress={onSubmit}
                type="primary"
                loading={context.loading.effects.USER_INFO || context.loading.effects.APPLY}
                style={{
                  marginTop: 17,
                  backgroundColor: Color.primary,
                  width: '100%',
                  borderRadius: 9,
                }}>
                <Text
                  fontSize={18}
                  color="#fff"
                  fontWeight="bold"
                  //@ts-ignore
                  styles={{ textTransform: 'uppercase' }}>
                  {status.btnText}
                </Text>
              </Button>
            </View>
          </View>
        </View>
        <AD />
      </ScrollView>
    </SafeAreaView>
  )
}

const AD = () => (
  <View style={Styles.ad}>
    <View style={Styles.adTextWrap}>
      <Text fontSize={18}>Easy steps to get and pay for a loan:</Text>
    </View>
    <Slider />
  </View>
)
const Slider = () => (
  <Swiper
    style={{ alignItems: 'center', paddingHorizontal: 10 }}
    autoplay
    autoplayTimeout={6}
    loop
    showsPagination
    dot={dot}
    bounces
    height={232}
    activeDot={activeDot}>
    {ads.map(item => (
      <View style={Styles.sliderItem} key={item.title}>
        <View style={Styles.sliderContent}>
          <View style={Styles.sliderAd}>
            <Image source={item.ad} resizeMode="cover" />
          </View>
          <View style={Styles.textWrap}>
            <Text fontSize={16} styles={Styles.sliderTitle}>
              {item.title}
            </Text>
            <Text fontSize={16} styles={Styles.sliderSubTitle}>
              {item.text}
            </Text>
          </View>
          <View style={Styles.numWrap}>
            <Image source={item.num} resizeMode="cover" />
          </View>
        </View>
      </View>
    ))}
  </Swiper>
)

const ads = [
  {
    key: 'one',
    title: 'Convenient operation',
    text: 'Fill up information within 5 mins',
    ad: require('@/assets/compressed/apply/ad1.webp'),
    num: require('@/assets/compressed/apply/1.webp'),
  },
  {
    key: 'two',
    title: 'Fast Approval',
    text: 'Verification finished within 2 hours',
    ad: require('@/assets/compressed/apply/ad2.webp'),
    num: require('@/assets/compressed/apply/2.webp'),
  },
  {
    key: 'three',
    title: 'Get the disbursement',
    text: 'Disbursement within 24 hours',
    ad: require('@/assets/compressed/apply/ad3.webp'),
    num: require('@/assets/compressed/apply/3.webp'),
  },
]
const dot = (
  <View
    style={{
      backgroundColor: '#7B7B7B',
      width: 4,
      height: 4,
      borderRadius: 2,
      marginHorizontal: 4,
      zIndex: 998,
      marginBottom: -65,
    }}
  />
)
const activeDot = (
  <View
    style={[
      {
        backgroundColor: 'rgba(159, 179, 191, 1)',
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 4,
        zIndex: 998,
        marginBottom: -65,
      },
      {
        backgroundColor: Color.primary,
        width: 7,
      },
    ]}
  />
)
