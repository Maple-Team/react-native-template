import {NativeStackHeaderProps} from '@react-navigation/native-stack'
import React from 'react'
import {View} from 'react-native'
import {Button, Text} from 'react-native-elements'
import {SafeAreaView} from 'react-native-safe-area-context'

const SigninScreen = ({navigation}: NativeStackHeaderProps) => {
  return (
    <SafeAreaView>
      <View>
        <Text>1</Text>
        <Button onPress={() => navigation.navigate('Profile', {name: 'Jane'})}>
          Go to Jane's profile
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default SigninScreen
