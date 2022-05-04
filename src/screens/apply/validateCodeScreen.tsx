import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View, StatusBar, Image, Pressable, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

import { PageStyles, Text } from '@/components'
import { Color } from '@/styles/color'
import { StackActions, useRoute } from '@react-navigation/native'
import { getValidateCode } from '@/services/user'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS } from '@/utils/constant'
import { debounce } from 'lodash'
import { default as MoneyyaContext } from '@/state'
import { useInterval } from 'usehooks-ts'
import type { SendChannel } from '@/typings/request'
import { validateValidCode } from '@/services/misc'
import { useCustomBack } from '@/hooks'
import { MMKV } from '@/utils'

export const ValidateCodeScreen = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const route = useRoute()
  const params = route.params as { phone: string; applyId: string }
  const context = useContext(MoneyyaContext)
  const maxCount = useMemo(
    () => context.brand?.smsWaitInterval || 60,
    [context.brand?.smsWaitInterval]
  )
  useCustomBack(() => {
    //@ts-ignore
    navigation.dispatch(
      StackActions.replace('BillsDetail', { applyId: MMKV.getString(params.applyId) })
    )
  })
  const [count, setCount] = useState<number>(maxCount)
  const [isPlaying, setPlaying] = useState<boolean>(false)
  const handleValidateCodePress = debounce(
    (type: SendChannel) => {
      if (params?.phone) {
        setPlaying(true)
        getValidateCode({
          sendChannel: type,
          phone: params?.phone || '',
          type: 'CONFIRM',
        }).then(code => {
          console.log({ kaptcha: code.kaptcha })
        })
      }
    },
    DEBOUNCE_WAIT,
    DEBOUNCE_OPTIONS
  )
  useEffect(() => {
    setPlaying(true)
    handleValidateCodePress('SMS')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useInterval(
    () => {
      let _count = count - 1
      if (_count <= 0) {
        setPlaying(false)
        setCount(maxCount)
      } else {
        setCount(_count)
      }
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? 1000 : null
  )
  const [code, setCode] = useState<string>('')
  useEffect(() => {
    if (code.length === 4 && params) {
      validateValidCode({
        phone: params.phone,
        appId: params.applyId,
        kaptcha: code,
        skipValidate: 'N',
        type: 'CONFIRM',
      })
        .then(() => {
          navigation.getParent()?.dispatch(
            StackActions.replace('BillsDetail', {
              applyId: params.applyId,
            })
          )
        })
        .catch(console.error)
    }
  }, [code, navigation, params])
  return (
    <SafeAreaView style={PageStyles.sav}>
      <StatusBar translucent={false} backgroundColor={Color.primary} barStyle="default" />
      <ScrollView style={PageStyles.scroll} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('@/assets/compressed/common/logo.webp')}
            style={{ width: 100, marginBottom: 20 }}
            resizeMode="center"
          />
          <Text
            fontSize={19}
            fontWeight="bold"
            color="#000"
            //@ts-ignore
            styles={{ marginBottom: 20 }}>
            {t('verify-your-phone-number')}
          </Text>
          <Text>{t('send-verify-code-prompt')}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text color={Color.primary} fontSize={16}>
              +52 <Text color="#000">{params?.phone}</Text>
              {'  '}
            </Text>
            {count !== 30 && (
              <View
                style={{
                  backgroundColor: !isPlaying ? Color.primary : '#888',
                  padding: 4,
                  borderRadius: 5,
                }}>
                <Text color={!isPlaying ? '#eee' : '#fff'}>{count}s</Text>
              </View>
            )}
          </View>
          <VerifyCodeInput onChangeText={te => setCode(te)} verifyCodeLength={4} />
          <View>
            <Text>{t('unreceived-phone-hint')}</Text>
            <View style={{ marginTop: 20 }}>
              <Pressable
                disabled={isPlaying}
                onPress={() => handleValidateCodePress('IVR')}
                style={{
                  backgroundColor: isPlaying ? '#999' : Color.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <Text color="#fff">{t('receive-code-by-call')}</Text>
              </Pressable>
              <Pressable
                disabled={isPlaying}
                onPress={() => handleValidateCodePress('SMS')}
                style={{
                  backgroundColor: isPlaying ? '#999' : Color.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                <Text color="#fff">{t('re-acquire-verfication-code')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const VerifyCodeInput = (props: {
  verifyCodeLength: number
  onChangeText: (text: string) => void
}) => {
  const { verifyCodeLength, onChangeText } = props
  const [code, setCode] = useState<string>()
  const paddedValue = code?.padEnd(verifyCodeLength, ' ') || ''
  const valueArray: string[] = paddedValue
    ? paddedValue.split('')
    : Array.from({ length: verifyCodeLength }, () => ' ')
  const textInputRef = useRef<TextInput>(null)
  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 50,
        height: 60,
        position: 'relative',
        marginBottom: 20,
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          const isFocused = textInputRef.current?.isFocused
          if (!isFocused) {
            textInputRef.current?.focus()
          }
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          height: 60,
          left: 0,
          top: 0,
          zIndex: 999,
        }}>
        {valueArray.map((digit, index) => {
          return (
            <View
              key={index}
              style={{
                width: 40,
                borderBottomWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomColor: digit === ' ' ? '#888888' : '#282828',
              }}>
              <Text fontSize={52} color={Color.primary}>
                {digit}
              </Text>
            </View>
          )
        })}
      </TouchableOpacity>
      <TextInput
        ref={textInputRef}
        underlineColorAndroid="transparent"
        caretHidden
        style={{
          height: 1,
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
        autoFocus={true}
        keyboardType={'numeric'}
        maxLength={verifyCodeLength}
        onChangeText={text => {
          if (/^[0-9]*$/.test(text)) {
            setCode(text)
            onChangeText(text)
          }
        }}
        value={code}
      />
    </View>
  )
}
