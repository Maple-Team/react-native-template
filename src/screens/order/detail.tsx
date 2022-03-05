import { queryOrderDetail } from '@/services/order'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView, StatusBar, View, Image, type ViewStyle, BackHandler } from 'react-native'
import { Loading, PageStyles, Text } from '@/components'
import { Order } from '@/typings/order'
import { useTranslation } from 'react-i18next'
import { ApplyButton } from '@components/form/FormItem'
import { ScrollView } from 'react-native-gesture-handler'

interface Status {
  showButton?: boolean
  onPress?: () => void
  text?: string
}
export default () => {
  const route = useRoute()
  const { applyId } = route.params as { applyId: string }
  const [data, setData] = useState<Order>()
  const [loading, setLoading] = useState<boolean>()
  useEffect(() => {
    if (applyId) {
      setLoading(true)
      queryOrderDetail({ applyId })
        .then(res => {
          setData(res)
        })
        .finally(() => setLoading(false))
    }
  }, [applyId])
  const { t } = useTranslation()
  const na = useNavigation()
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        //@ts-ignore
        na.navigate('BillsList')
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [na])
  )
  const status: Status = useMemo(() => {
    let value: Status = {}
    switch (data?.contractStatus) {
      case APPLY_STATE.NORMAL:
      case APPLY_STATE.OVERDUE:
        value = {
          showButton: true,
          text: t('applyState.repay'),
          onPress: () => {
            //@ts-ignore
            na.navigate('Payment', {
              applyId: data?.applyId,
              repayAmount: data?.repayAmount,
            })
          },
        }
        break
      case APPLY_STATE.SETTLE:
      case APPLY_STATE.WAIT:
      case APPLY_STATE.LOAN:
      case APPLY_STATE.CANCEL:
      case APPLY_STATE.REJECTED:
      default:
        value = { showButton: false }
        break
    }
    return value
  }, [data?.applyId, data?.contractStatus, data?.repayAmount, na, t])
  if (loading) {
    return <Loading />
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView
        style={{
          backgroundColor: '#E6F1F8',
          flex: 1,
          paddingHorizontal: 19,
          paddingTop: 20,
        }}>
        <View
          style={{
            backgroundColor: 'transparent',
            paddingTop: 47,
            paddingBottom: 140,
          }}>
          <View
            style={{ backgroundColor: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 33.5,
              }}>
              <View
                style={{
                  width: 71,
                  height: 71,
                  borderRadius: 71 / 2,
                  top: -71 / 2,
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                }}>
                <Image
                  source={require('@/assets/compressed/additional/bill.webp')}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
          <View
            style={[
              style.itemContainer,
              status.showButton
                ? data?.instalmentMark === 'Y'
                  ? {
                      paddingBottom: 0,
                      marginBottom: 20,
                    }
                  : {}
                : { paddingBottom: 10 },
            ]}>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('orderNumber')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.applyId}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('loanAmount')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.applyAmount ? `${t('mxn')} ${data?.applyAmount}` : '--'}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('loanDays')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.displayLoanDays ? `${data?.displayLoanDays} ${t('days')}` : '--'}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('fillingDate')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.applyDate ?? '--'}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('paymentDate')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.loanDate ?? '--'}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('repaymentDate')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.repayDate ?? '--'}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('serviceFee')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {/* {t('mxn')} {toThousands(0)} */}
                {'--'}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('amount-of-payment')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.repayAmount ? `${t('mxn')} ${toThousands(data?.repayAmount)}` : '--'}
              </Text>
            </View>
            <View style={style.itemWrapper}>
              <Text color="#869096" fontSize={14}>
                {t('repayment-amount')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.realRepayAmount ? `${t('mxn')}${toThousands(data?.realRepayAmount)}` : '--'}
              </Text>
            </View>
            <View style={[style.itemWrapper, { borderBottomWidth: 0 }]}>
              <Text color="#869096" fontSize={14}>
                {t('status')}
              </Text>
              <Text color="#869096" fontSize={14}>
                {data?.contractStatusName}
              </Text>
            </View>
          </View>
          {data?.instalmentMark === 'Y' && (
            <View
              style={[
                style.itemContainer,
                status.showButton ? { borderRadius: 14, paddingTop: 10 } : { paddingBottom: 10 },
              ]}>
              <>
                <View style={{ paddingBottom: 10, paddingLeft: 10 }}>
                  <Text>
                    {t('stage')} 1/{data?.paymentSchedules?.length}
                  </Text>
                </View>
                <View
                  style={{
                    borderColor: '#DDE3E8',
                    borderWidth: 1,
                    borderRadius: 14,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderStyle: 'dashed',
                    marginBottom: 10,
                  }}>
                  <View style={[style.itemWrapper]}>
                    <Text color="#869096" fontSize={14}>
                      {t('firstPaymentAmount')}
                    </Text>
                    <Text color="#869096" fontSize={14}>
                      {t('mxn')}{' '}
                      {toThousands(
                        data?.paymentSchedules ? data?.paymentSchedules[0].loanTermTotalAmt : 0
                      )}
                    </Text>
                  </View>
                  <View style={[style.itemWrapper, { borderBottomWidth: 0 }]}>
                    <Text color="#869096" fontSize={14}>
                      {t('firstPaymentdate')}
                    </Text>
                    <Text color="#869096" fontSize={14}>
                      {data?.paymentSchedules ? data?.paymentSchedules[0].loanPmtDueDate : 0}
                    </Text>
                  </View>
                </View>
              </>
              {/*NOTE 分期长度最多两期*/}
              {data?.paymentSchedules?.length === 2 && (
                <>
                  <View style={{ paddingBottom: 10, paddingLeft: 10 }}>
                    <Text>
                      {t('stage')} 1/{data?.paymentSchedules.length}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderColor: '#DDE3E8',
                      borderWidth: 1,
                      borderRadius: 14,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      borderStyle: 'dashed',
                    }}>
                    <View style={[style.itemWrapper]}>
                      <Text color="#869096" fontSize={14}>
                        {t('secondPaymentAmount')}
                      </Text>
                      <Text color="#869096" fontSize={14}>
                        {t('mxn')} {data?.paymentSchedules[1].loanTermTotalAmt}{' '}
                        {data?.paymentSchedules[1].freeMark === 'Y' && (
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
                        )}
                      </Text>
                    </View>
                    <View style={[style.itemWrapper, { borderBottomWidth: 0 }]}>
                      <Text color="#869096" fontSize={14}>
                        {t('secondPaymentDate')}
                      </Text>
                      <Text color="#869096" fontSize={14}>
                        {data?.paymentSchedules[1].loanPmtDueDate}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
          {status.showButton && (
            <View style={PageStyles.btnWrap}>
              <ApplyButton
                type={'primary'}
                //@ts-ignore
                onPress={status.onPress}>
                <Text color={'#fff'}>{status.text}</Text>
              </ApplyButton>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

import StyleSheet from 'react-native-adaptive-stylesheet'
import { Color } from '@/styles/color'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { APPLY_STATE } from '@/state/enum'
import { toThousands } from '@/utils/util'

const style = StyleSheet.create<{
  itemWrapper: ViewStyle
  itemContainer: ViewStyle
}>({
  itemContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 100,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#DDE3E8',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
})
