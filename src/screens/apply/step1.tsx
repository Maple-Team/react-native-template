import React from 'react'
import { View, Image, StatusBar, ImageBackground } from 'react-native'
// import { useNavigation } from '@react-navigation/native'
// import { useTranslation } from 'react-i18next'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ApplyStackParamList } from '@navigation/applyStack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components'
import { ScrollView } from 'react-native-gesture-handler'
import Styles from './step1Style'
import { Button } from '@ant-design/react-native'
import { Color } from '@/styles/color'
import Swiper from 'react-native-swiper'

export function Step1() {
  // const { t } = useTranslation()
  // const navigation = useNavigation<Step1ScreenProp>()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView
        style={{ paddingTop: 0, paddingHorizontal: 0 }}
        keyboardShouldPersistTaps="handled">
        <View
          style={{
            flex: 1,
          }}>
          <ImageBackground
            source={require('@/assets/images/apply/banner.webp')}
            resizeMode="cover"
            style={{
              height: 284,
            }}>
            <Header />
          </ImageBackground>
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: 10,
              width: '100%',
              top: -40,
            }}>
            <View
              style={{
                bottom: 160,
                zIndex: 99,
                backgroundColor: '#fff',
                width: 63 + 9 * 2,
                height: 63 + 9 * 2,
                borderRadius: (63 + 9 * 2) / 2,
                alignItems: 'center',
                position: 'absolute',
                justifyContent: 'center',
              }}>
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
              <Text styles={{ fontSize: 14 }}>Available balance</Text>
              <Text styles={{ fontSize: 57 }}>
                <Text styles={{ fontSize: 22 }}>$ </Text>6600
              </Text>
              <Button
                type="primary"
                style={{ backgroundColor: Color.primary, width: '100%', borderRadius: 9 }}>
                Continue Loan
              </Button>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10, paddingTop: 24.5 }}>
          <View style={{ alignItems: 'center' }}>
            <Text>Easy steps to get and pay for a loan:</Text>
          </View>
          <Slider />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type Step1ScreenProp = NativeStackNavigationProp<ApplyStackParamList, 'Step1'>
const Header = () => (
  <View style={Styles.header}>
    <View style={Styles.headerLeft}>
      <Image
        style={Styles.logo}
        source={require('@/assets/images/apply/logo.webp')}
        resizeMode="cover"
      />
      <Image
        style={Styles.moneyya}
        source={require('@/assets/images/apply/moneyya.webp')}
        resizeMode="cover"
      />
    </View>
    <View style={Styles.headerRight}>
      <Image
        style={Styles.notice}
        source={require('@/assets/images/common/notice.webp')}
        resizeMode="cover"
      />
      <Image
        style={Styles.help}
        source={require('@/assets/images/common/active/help.webp')}
        resizeMode="cover"
      />
    </View>
  </View>
)
const data = [
  {
    key: 'one',
    title: 'Convenient operation',
    text: 'Fill up information within 5 mins',
    ad: require('@/assets/images/apply/ad1.webp'),
  },
  {
    key: 'two',
    title: 'Fast Approval',
    text: 'Verification finished within 2 hours',
    ad: require('@/assets/images/apply/ad2.webp'),
  },
  {
    key: 'three',
    title: 'Get the disbursement',
    text: 'Disbursement within 24 hours',
    ad: require('@/assets/images/apply/ad3.webp'),
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
      marginBottom: 25,
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
        marginBottom: 25,
      },
      {
        backgroundColor: Color.primary,
        width: 7,
      },
    ]}
  />
)

const Slider = () => (
  <Swiper
    style={{}}
    autoplay={true}
    autoplayTimeout={6}
    loop={true}
    showsPagination={true}
    dot={dot}
    height={234}
    activeDot={activeDot}>
    {data.map(item => (
      <View
        style={{
          width: 325,
          position: 'relative',
          paddingTop: 20,
          paddingLeft: 11.5,
          paddingBottom: 20,
          marginHorizontal: 14,
          borderRadius: 5,
        }}
        key={item.title}>
        <View style={{ height: 200, paddingBottom: 20 }}>
          <View
            style={{
              zIndex: 99,
              backgroundColor: '#fff',
              width: 116 + 20.5 * 2,
              height: 116 + 20.5 * 2,
              borderRadius: (116 + 20.5 * 2) / 2,
              alignItems: 'center',
              position: 'absolute',
              justifyContent: 'center',
            }}>
            <Image source={require('@/assets/images/apply/ad1.webp')} resizeMode="cover" />
          </View>
          <View
            style={{
              borderRadius: 15,
              borderColor: 'rgba(216, 222, 236, 1)',
              borderWidth: 1,
              width: '100%',
              backgroundColor: '#fff',
              paddingBottom: 11,
            }}>
            <View
              style={{
                position: 'absolute',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                left: 29.5,
              }}>
              <Image source={require('@/assets/images/apply/1.webp')} resizeMode="cover" />
            </View>
            <View style={{ alignItems: 'center', paddingTop: 145 }}>
              <Text styles={{ color: Color.primary, fontSize: 16, fontFamily: 'Aller' }}>
                {item.title}
              </Text>
              <Text
                styles={{
                  color: 'rgba(123, 123, 123, 1)',
                  fontSize: 16,
                  fontFamily: 'Aller',
                }}>
                {item.text}
              </Text>
            </View>
          </View>
        </View>
      </View>
    ))}
  </Swiper>
)
