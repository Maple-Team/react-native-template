import React from 'react'
import { NativeModules } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { Button } from '@ant-design/react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    fontFamily: 'ArialRoundedMTBold',
  },
})
export default () => {
  return (
    <Button
      type="primary"
      size="small"
      style={styles.button}
      onPress={async () => {
        const userStr = await AsyncStorage.getItem('user')
        let user = {}
        try {
          user = JSON.parse(userStr)
        } catch (error) {}
        NativeModules.RNZendeskChat.startChat({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          tags: [],
          // department: '',
          botName: 'SurityCash', //机器人名称
          chatOnly: true,
        })
      }}>
      Need help?
    </Button>
  )
}
