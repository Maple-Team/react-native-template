import type { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View, StatusBar, Image, Pressable, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

import { PageStyles, Text } from '@/components'
import { Color } from '@/styles/color'
import { useRoute } from '@react-navigation/native'
import { getValidateCode } from '@/services/user'
import { DEBOUNCE_WAIT, DEBOUNCE_OPTIONS } from '@/utils/constant'
import { debounce } from 'lodash'
import { default as MoneyyaContext } from '@/state'
import { useInterval } from 'usehooks-ts'

export const ValidateCode = ({ navigation }: NativeStackHeaderProps) => {
  const { t } = useTranslation()
  const route = useRoute()
  const params = route.params as { phone: string }
  const context = useContext(MoneyyaContext)
  const maxCount = useMemo(
    () => context.brand?.smsWaitInterval || 60,
    [context.brand?.smsWaitInterval]
  )
  const [count, setCount] = useState<number>(maxCount)
  // FIXME
  // const [times, setTimtes] = useState<number>(context.brand?.codeValidatecount || 5) // Brand info
  const [isPlaying, setPlaying] = useState<boolean>(false)
  const handlePress = debounce(
    () => {
      if (params?.phone) {
        setPlaying(true)
        getValidateCode({
          sendChannel: 'SMS',
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
    if (params?.phone) {
      setPlaying(true)
      getValidateCode({
        sendChannel: 'SMS',
        phone: params?.phone || '',
        type: 'CONFIRM',
      }).then(code => {
        console.log({ kaptcha: code.kaptcha })
      })
    }
  }, [params?.phone])
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
            Verify Your Phone Number
          </Text>
          <Text>please type the verfication code sent to: </Text>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text color={Color.primary} fontSize={16}>
              +52 <Text color="#000">{params?.phone}</Text>
              {'  '}
            </Text>
            <View
              style={{
                backgroundColor: !isPlaying ? Color.primary : '#888',
                padding: 4,
                borderRadius: 5,
              }}>
              <Text color={!isPlaying ? '#eee' : '#fff'}>{count}s</Text>
            </View>
          </View>
          <VerifyCode
            onChangeText={te => {
              console.log(te, t('account'))
              navigation.navigate('')
              if (te) {
              } else {
              }
            }}
            verifyCodeLength={4}
          />
          <View>
            <Text>
              can't receive the verification code? Your can also check your Mobile Phone signal or
              try the following ways!
            </Text>
            <View style={{ marginTop: 20 }}>
              <Pressable
                style={{
                  backgroundColor: Color.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <Text color="#fff">Receive code by call</Text>
              </Pressable>
              <Pressable
                onPress={handlePress}
                style={{
                  backgroundColor: Color.primary,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                <Text color="#fff">Re-acquire verfication code</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const VerifyCode = (props: { verifyCodeLength: number; onChangeText: (text: string) => void }) => {
  const { verifyCodeLength, onChangeText } = props
  const [code, setCode] = useState<string>()
  const paddedValue = code?.padEnd(verifyCodeLength, ' ') || ''
  const valueArray: string[] = paddedValue.split('')
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
        {valueArray.map((digit, index) => (
          <View
            key={index}
            style={
              digit === ' '
                ? {
                    width: 40,
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomColor: '#888888',
                  }
                : {
                    width: 40,
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomColor: '#282828',
                  }
            }>
            <Text fontSize={52} color={Color.primary}>
              {digit}
            </Text>
          </View>
        ))}
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
