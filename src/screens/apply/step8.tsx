import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { ReactNode } from 'react'
import { View, StatusBar, ImageBackground, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'
import debounce from 'lodash.debounce'
import { Slider } from '@miblanchard/react-native-slider'

import { PageStyles, Text, Hint } from '@/components'
import { DEBOUNCE_OPTIONS, DEBOUNCE_WAIT } from '@/utils/constant'
import { ApplyButton } from '@components/form/FormItem'
import { Color } from '@/styles/color'
import type { ApplyStep8Parameter } from '@/typings/apply'
import { useLoction } from '@/hooks'

type FormModel = Omit<ApplyStep8Parameter, 'applyId' | 'currentStep' | 'totalSteps'>
export const Step8 = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
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
      <Hint
        hint="Maintaining a good repayment behavior will help you to increase your loan amount. 96% of users loan amount haveincreased subsequently."
        hintColor="rgba(255, 50, 50, 1)"
        img={require('@/assets/images/apply/loan_notice.webp')}
      />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={PageStyles.container}>
          <View style={[PageStyles.form, { paddingHorizontal: 0, paddingTop: 0 }]}>
            <ImageBackground
              source={require('@/assets/images/apply/loan_bg.webp')}
              resizeMode="stretch"
              style={{ width: '100%', height: 159 }}>
              <View style={{ alignItems: 'center', paddingTop: 23.5 }}>
                <Text fontSize={25} fontWeight="bold" color="#fff">
                  $6600
                </Text>
                <Text fontSize={13} color="#fff">
                  Loan Amount
                </Text>
                <Slider
                  containerStyle={{ width: 330, height: 34 }}
                  minimumValue={3000}
                  value={5000}
                  onValueChange={v => {
                    console.log('change', v)
                  }}
                  trackStyle={{ height: 5 }}
                  thumbStyle={{ alignItems: 'center', height: 34 }}
                  thumbTintColor="transparent"
                  thumbImage={require('@/assets/images/apply/slider_dot.webp')}
                  maximumValue={10000}
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
                <Text fontSize={11} color="#fff">
                  3000
                </Text>
                <Text fontSize={11} color="#fff">
                  10000
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
                {[7, 15, 90, 150].map(item => (
                  <Pressable
                    key={item}
                    style={{
                      backgroundColor: Color.primary,
                      borderRadius: 17.5,
                      paddingHorizontal: 33,
                      paddingVertical: 12.5,
                    }}>
                    <Text fontSize={13} color="#fff">
                      {`${item}`.padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
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
                  { name: 'Loan amount', value: '261800', type: 'money' },
                  { name: 'Loan days', value: '7', type: 'day' },
                  { name: 'Transfer amount', value: '261800', type: 'money' },
                  { name: 'Fee', value: '200', type: 'money' },
                  { name: 'Collection bank card', value: '261800', type: 'bank' },
                ]}
              />
              <View style={{ paddingTop: 13, paddingBottom: 29.5 }}>
                <Pressable style={{ alignItems: 'flex-start' }}>
                  <Text fontSize={10} color={Color.primary}>
                    {'->'}Click here to modify bank card
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text fontSize={15} color={Color.primary}>
                Bill information
              </Text>
              <ListInfo
                data={[
                  { name: 'First repayment date ', value: '261800', type: 'date' },
                  { name: 'First repayment amount', value: '7', type: 'money' },
                  { name: 'Second repayment date', value: '261800', type: 'date' },
                  {
                    name: 'Second repayment amount ',
                    value: '261800',
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
                          Free
                        </Text>
                      </View>
                    ),
                  },
                ]}
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
              <Text color="#fff" fontSize={19} fontFamily="Arial-BoldMT" fontWeight="bold">
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
  data: { name: string; value: string; type: ValueType; extra?: ReactNode }[]
}) => {
  return (
    <View style={{ width: '100%', paddingHorizontal: 17 }}>
      {data.map(item => (
        <View
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

const ValueText = ({ value, type }: { value: string; type: ValueType }) => {
  switch (type) {
    case 'bank':
      return (
        <Text fontSize={12} color="rgba(28, 37, 42, 1)">
          {value}***
        </Text>
      )
    case 'day':
      return (
        <Text fontSize={12} color="rgba(28, 37, 42, 1)">
          {value}days
        </Text>
      )
    case 'money':
      return (
        <Text fontSize={12} color="rgba(28, 37, 42, 1)">
          ${value}
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
