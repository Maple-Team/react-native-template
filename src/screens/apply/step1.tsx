import React from 'react'
import { View, Image, StatusBar, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ApplyStackParamList } from '@navigation/applyStack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabHeader, Text } from '@/components'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '@ant-design/react-native'
import { Color } from '@/styles/color'
import Swiper from 'react-native-swiper'
import stepStyles from './step1Style'

export function Step1() {
  const navigation = useNavigation<Step1ScreenProp>()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView
        style={{ paddingTop: 0, paddingHorizontal: 0 }}
        keyboardShouldPersistTaps="handled">
        <View>
          <ImageBackground
            source={require('@/assets/images/apply/banner.webp')}
            resizeMode="cover"
            style={{
              height: 284,
            }}>
            <TabHeader />
          </ImageBackground>
          <View style={stepStyles.loanInfo}>
            <View style={stepStyles.cashWrap}>
              <Image source={require('@/assets/images/apply/cash.webp')} resizeMode="cover" />
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
                Available balance
              </Text>
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
                  6,600
                </Text>
              </View>
              <Button
                onPress={() => navigation.navigate('Step8')}
                type="primary"
                style={{
                  marginTop: 17,
                  backgroundColor: Color.primary,
                  width: '100%',
                  borderRadius: 9,
                }}>
                <Text fontSize={18} color="#fff" fontWeight="bold">
                  Continue Loan
                </Text>
              </Button>
            </View>
          </View>
        </View>
        <View style={stepStyles.ad}>
          <View style={stepStyles.adTextWrap}>
            <Text fontSize={18}>Easy steps to get and pay for a loan:</Text>
          </View>
          <Slider />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const Slider = () => (
  <Swiper
    style={{ alignItems: 'center' }}
    autoplay={true}
    autoplayTimeout={6}
    loop={true}
    showsPagination={true}
    dot={dot}
    height={232}
    activeDot={activeDot}>
    {data.map(item => (
      <View style={stepStyles.sliderItem} key={item.title}>
        <View style={stepStyles.sliderContent}>
          <View style={stepStyles.sliderAd}>
            <Image source={item.ad} resizeMode="cover" />
          </View>
          <View style={stepStyles.textWrap}>
            <Text fontSize={16} styles={stepStyles.sliderTitle}>
              {item.title}
            </Text>
            <Text fontSize={16} styles={stepStyles.sliderSubTitle}>
              {item.text}
            </Text>
          </View>
          <View style={stepStyles.numWrap}>
            <Image source={item.num} resizeMode="cover" />
          </View>
        </View>
      </View>
    ))}
  </Swiper>
)

type Step1ScreenProp = NativeStackNavigationProp<ApplyStackParamList, 'Step1'>

const data = [
  {
    key: 'one',
    title: 'Convenient operation',
    text: 'Fill up information within 5 mins',
    ad: require('@/assets/images/apply/ad1.webp'),
    num: require('@/assets/images/apply/1.webp'),
  },
  {
    key: 'two',
    title: 'Fast Approval',
    text: 'Verification finished within 2 hours',
    ad: require('@/assets/images/apply/ad2.webp'),
    num: require('@/assets/images/apply/2.webp'),
  },
  {
    key: 'three',
    title: 'Get the disbursement',
    text: 'Disbursement within 24 hours',
    ad: require('@/assets/images/apply/ad3.webp'),
    num: require('@/assets/images/apply/2.webp'), //FIXME
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
