import React, { useContext, useEffect } from 'react'
import { View, Image, StatusBar, ImageBackground } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabHeader, Text } from '@/components'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '@ant-design/react-native'
import { Color } from '@/styles/color'
import Swiper from 'react-native-swiper'
import Styles from './style'
// import { useSensor } from '@/hooks/useSensors'
import { pv, queryBrand, queryVersion } from '@/services/apply'
import { queryUserinfo } from '@/services/user'
import { MoneyyaContext } from '@/state'
import emitter from '@/eventbus'
import { MMKV } from '@/utils/storage'

export function Step1() {
  const navigation = useNavigation()
  const context = useContext(MoneyyaContext)
  console.log(context)
  // const sensor = useSensor()
  useEffect(() => {
    queryBrand().then(res => {
      console.log('brand', res)
    })
    queryVersion().then(res => {
      console.log('vesion', res)
    })
    pv()
    queryUserinfo().then(res => {
      console.log('userinfo', res)
      MMKV.setInt('applyId', res.applyId)
      emitter.emit('USER_INFO', res)
    })
  }, [])

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
          <View style={Styles.loanInfo}>
            <View style={Styles.cashWrap}>
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
                onPress={() => {
                  // TODO
                  navigation.getParent()?.navigate('Step2')
                }}
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
    style={{ alignItems: 'center' }}
    autoplay={true}
    autoplayTimeout={6}
    loop={true}
    showsPagination={true}
    dot={dot}
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
    num: require('@/assets/images/apply/3.webp'),
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