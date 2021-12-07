import React, { PureComponent } from 'react'
import ModalWrapper from './ModalWrapper'
import { Picker, Platform, View, Dimensions, TouchableOpacity } from 'react-native'
import Text from '../Text'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { ScrollView } from 'react-native-gesture-handler'

const isAndroid = Platform.OS === 'android'
class NormalPicker extends PureComponent {
  render() {
    const { onValueChange, value, dataSource = [] } = this.props
    if (!dataSource || !dataSource.length) {
      return
    }
    if (isAndroid) {
      return (
        // TODO 滚轮效果
        // eslint-disable-next-line react-native/no-inline-styles
        <ScrollView style={{ height: 200 }}>
          {dataSource.map((item, index) => (
            <TouchableOpacity onPress={() => onValueChange(item)} key={index} style={styles.item}>
              <Text>{item.name}</Text>
              <View style={styles.lineGap} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )
    } else {
      return (
        <Picker
          onValueChange={(item, index) =>
            onValueChange({
              name: dataSource[index].name,
              code: item,
              attr1: dataSource[index].attr1,
            })
          }
          selectedValue={value}>
          {dataSource.map((item, index) => (
            <Picker.Item key={index} label={item.name} value={item.code} />
          ))}
        </Picker>
      )
    }
  }
}
export default ModalWrapper(NormalPicker)

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
  item: {
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineGap: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 1,
    backgroundColor: '#E8EEF0',
  },
})
