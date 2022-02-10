import React, { useContext } from 'react'
import { View, ImageBackground, Image, Pressable, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabHeader, Text } from '@/components'
import emitter from '@/eventbus'
import { default as MoneyyaContext } from '@/state'

export function UserCenter() {
  const context = useContext(MoneyyaContext)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent={true} barStyle="default" />
      <View style={{ paddingTop: 0, paddingHorizontal: 0 }}>
        <View>
          <ImageBackground
            source={require('@/assets/compressed/user-center/bg.webp')}
            resizeMode="cover"
            style={{
              height: 309,
            }}>
            <TabHeader
              title={require('@/assets/compressed/common/active/moneyya.webp')}
              notice={require('@/assets/compressed/common/active/notice.webp')}
              help={require('@/assets/compressed/common/active/help.webp')}
            />
            <View style={{ alignItems: 'center', paddingTop: 190 }}>
              <Text color="#fff" fontSize={18}>
                {context.user?.name}
              </Text>
              <Text color="rgba(214, 220, 254, 1)" fontSize={13}>
                {context.user?.phone}
              </Text>
            </View>
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
            { img: require('@/assets/compressed/user-center/Payment.webp'), title: 'Payment' },
            {
              img: require('@/assets/compressed/user-center/History-Bills.webp'),
              title: 'History Bills',
            },
            { img: require('@/assets/compressed/user-center/My-Card.webp'), title: 'My Card' },
          ].map(({ img, title }) => (
            <Pressable key={title} style={{ alignItems: 'center' }}>
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
            {
              img: require('@/assets/compressed/user-center/Contact-Us.webp'),
              title: 'Contact Us',
              onPress: () => {},
            },
            {
              img: require('@/assets/compressed/user-center/About-Moneyya.webp'),
              title: 'About Moneyya',
              onPress: () => {},
            },
            {
              img: require('@/assets/compressed/user-center/Logout.webp'),
              title: 'Logout',
              onPress: () => {
                emitter.emit('LOGOUT_SUCCESS')
              },
            },
          ].map(({ img, title, onPress }, i) => {
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
                  }}
                  onPress={onPress}>
                  <Text fontSize={15} color="rgba(51, 50, 48, 1)">
                    {title}
                  </Text>
                  <Image
                    resizeMode="cover"
                    source={require('@/assets/compressed/user-center/right.webp')}
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
