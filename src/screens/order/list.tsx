import { FlatList, View } from 'react-native'
import { Text } from 'react-native-elements'
import React from 'react'

export default () => {
  return (
    <FlatList
      data={[]}
      renderItem={() => <View>1</View>}
      children={
        <View>
          <Text>1</Text>
        </View>
      }
    />
  )
}
