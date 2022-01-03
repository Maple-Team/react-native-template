import React from 'react'
import { View, ImageBackground, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabHeader, Text } from '@/components'

export function UserCenter() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingTop: 0, paddingHorizontal: 0 }}>
        <View>
          <ImageBackground
            source={require('@/assets/images/user-center/bg.webp')}
            resizeMode="cover"
            style={{
              height: 309,
            }}>
            <TabHeader
              title={require('@/assets/images/common/active/moneyya.webp')}
              notice={require('@/assets/images/common/active/notice.webp')}
              help={require('@/assets/images/common/active/help.webp')}
            />
          </ImageBackground>
        </View>
        <View
          style={{
            marginBottom: 13,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 30,
            paddingVertical: 29,
            borderRadius: 13,
            backgroundColor: '#fff',
          }}>
          {[
            { img: require('@/assets/images/user-center/Payment.webp'), title: 'Payment' },
            {
              img: require('@/assets/images/user-center/History-Bills.webp'),
              title: 'History Bills',
            },
            { img: require('@/assets/images/user-center/My-Card.webp'), title: 'My Card' },
          ].map(({ img, title }) => (
            <Pressable key={title}>
              <Image source={img} resizeMode="cover" style={{ marginBottom: 14.5 }} />
              <Text fontSize={16} color="rgba(51, 50, 48, 1)">
                {title}
              </Text>
            </Pressable>
          ))}
        </View>
        <View
          style={{
            paddingLeft: 26,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderStyle: 'solid',
            borderTopColor: 'rgba(230, 241, 248, 1)',
            borderBottomColor: 'rgba(230, 241, 248, 1)',
          }}>
          {[
            { img: require('@/assets/images/user-center/Contact-Us.webp'), title: 'Contact Us' },
            {
              img: require('@/assets/images/user-center/About-Moneyya.webp'),
              title: 'About Moneyya',
            },
            { img: require('@/assets/images/user-center/Logout.webp'), title: 'Logout' },
          ].map(({ img, title }, i) => {
            const boderWidth: number = i === 2 ? 0 : 1
            return (
              <View key={title} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image resizeMode="cover" source={img} />
                <Pressable
                  style={{
                    flex: 1,
                    marginLeft: 7,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 17,
                    paddingRight: 29,
                    borderBottomWidth: boderWidth,
                    borderStyle: 'dashed',
                    borderBottomColor: 'rgba(230, 241, 248, 1)',
                  }}>
                  <Text fontSize={15} color="rgba(51, 50, 48, 1)">
                    {title}
                  </Text>
                  <Image
                    resizeMode="cover"
                    source={require('@/assets/images/user-center/right.webp')}
                  />
                </Pressable>
              </View>
            )
          })}
        </View>
      </View>
    </SafeAreaView>
  )
}
