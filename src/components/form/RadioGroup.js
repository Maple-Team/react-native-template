import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Image } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import Text from '../Text'
import { Logger } from '../../utils'

export default class RadioGroup extends PureComponent {
  constructor(props) {
    super(props)
  }
  onPress = value => {
    this.props.onPress(value)
  }

  render() {
    const { radioButtons, value } = this.props
    const _radioButtons = radioButtons.map(item => {
      if (value) {
        return { ...item, selected: item.value === value }
      } else {
        return item
      }
    })
    return (
      <View style={styles.container}>
        {_radioButtons.map(item => (
          <TouchableOpacity
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {
                opacity: item.disabled ? 0.2 : 1,
              },
              styles.to,
            ]}
            onPress={() => {
              item.disabled ? null : this.onPress(item.value)
            }}
            key={item.label}>
            <View
              style={[
                styles.btnWrap,
                item.backgroundColor && { backgroundColor: item.backgroundColor },
              ]}>
              <View
                style={[
                  styles.border,
                  {
                    borderColor: item.selected ? item.actColor : item.color,
                    width: item.size,
                    height: item.size,
                    borderRadius: item.size / 2,
                  },
                ]}>
                {item.selected && (
                  <View
                    style={{
                      backgroundColor: item.actColor,
                      width: item.size / 2,
                      height: item.size / 2,
                      borderRadius: item.size / 2,
                    }}
                  />
                )}
              </View>
              <View style={styles.lableWrap}>
                <Text
                  style={[
                    styles.labelText,
                    {
                      color: !item.selected ? item.color : item.actColor,
                    },
                  ]}>
                  {item.label}
                </Text>
                {item.source && <Image source={item.source} style={styles.img} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    width: 150,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  border: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginHorizontal: 22,
  },
  lableWrap: {
    alignItems: 'center',
  },
  labelText: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 13,
    alignSelf: 'center',
  },
  img: {
    width: 26,
    height: 38,
  },
  to: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
