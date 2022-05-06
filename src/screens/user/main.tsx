import React, { useCallback, useContext, useState } from 'react'
import { View, ImageBackground, Image, Pressable, Dimensions, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabHeader, Text, ToastLoading, Update } from '@/components'
import emitter from '@/eventbus'
import { default as MoneyyaContext } from '@/state'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { Modal } from '@ant-design/react-native'
import { useTranslation } from 'react-i18next'
import { queryUserinfo } from '@/services/user'
import { useCustomBack, UserFocusStatusBar } from '@/hooks'
import { Color } from '@/styles/color'

export function UserCenter() {
  const context = useContext(MoneyyaContext)
  const na = useNavigation()
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>()
  const width = Dimensions.get('window').width
  useCustomBack(() => {
    //@ts-ignore
    na.navigate('BottomTab')
  })
  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      queryUserinfo()
        .then(user => {
          emitter.emit('USER_INFO', user)
        })
        .finally(() => setLoading(false))
      return () => {}
    }, [])
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <UserFocusStatusBar
        animated={false}
        translucent={true}
        barStyle={'light-content'}
        showHideTransition="fade"
        backgroundColor={Color.primary}
      />
      <ToastLoading animating={loading} />
      <Update />
      <View style={{ paddingTop: 0, paddingHorizontal: 0 }}>
        <View>
          <ImageBackground
            source={require('@/assets/compressed/user-center/bg.webp')}
            resizeMode="cover"
            style={{
              height: 220,
            }}>
            <TabHeader
              title={require('@/assets/compressed/common/active/moneyya.webp')}
              notice={require('@/assets/compressed/common/active/notice.webp')}
              help={require('@/assets/compressed/common/active/help.webp')}
            />
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 26,
              }}>
              <Image
                source={require('@/assets/compressed/user-center/avatar.webp')}
                resizeMode="cover"
              />
              <Text color="#fff" fontSize={18}>
                {context.user?.name || 'moneyya'}
              </Text>
              <Text color="#D6DCFE" fontSize={13}>
                {context.user?.phone.replace(/(\d{3})\d{3}(\d{4})/, '$1****$2')}
              </Text>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            marginBottom: 13,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // paddingHorizontal: 30,
            paddingVertical: 29,
            borderRadius: 13,
            backgroundColor: '#fff',
          }}>
          {[
            {
              img: require('@/assets/compressed/user-center/Payment.webp'),
              title: t('screenTitle.payment'),
              onPress: () => {
                //@ts-ignore
                na.navigate('Order', { type: 'payment' })
              },
            },
            {
              img: require('@/assets/compressed/user-center/History-Bills.webp'),
              title: t('screenTitle.historyBills'),
              onPress: () => {
                //@ts-ignore
                na.navigate('Order', { type: 'order' })
              },
            },
            {
              img: require('@/assets/compressed/user-center/about-us1.webp'),
              title: t('screenTitle.aboutUs'),
              onPress: () => {
                //@ts-ignore
                na.navigate('About')
              },
            },
          ].map(({ img, title, onPress }) => (
            <Pressable
              key={title}
              style={{ alignItems: 'center', width: width / 3 }}
              onPress={onPress}>
              <Image
                source={img}
                resizeMode="cover"
                style={{ marginBottom: 14.5 }}
                width={39}
                height={39}
              />
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
              title: t('screenTitle.contactUs'),
              onPress: () => {
                context.brand?.serviceInfo.ccphone &&
                  Linking.openURL(`tel:${context.brand?.serviceInfo.ccphone}`)
              },
            },
            {
              img: require('@/assets/compressed/user-center/Logout.webp'),
              title: t('logout'),
              onPress: () => {
                Modal.alert(t('logoutPrompt'), t('logoutPromptContent'), [
                  {
                    text: t('cancel'),
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: t('ok'),
                    onPress: () => emitter.emit('LOGOUT_SUCCESS'),
                  },
                ])
              },
            },
          ].map(({ img, title, onPress }, i) => {
            const boderWidth: number = i === 1 ? 0 : 1
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
