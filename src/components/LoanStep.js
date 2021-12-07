import React from 'react'
import { View } from 'react-native'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { responsive } from '../utils'
import { Text } from '../components'
export default function LoanStep({ total = 5, current = 1 }) {
  const dotArray = Array(total).fill(0)
  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <View style={styles.line} />
        <View
          style={[
            styles.line,
            styles.lineCurrent,
            { width: responsive((current - 1) * (dotWidth + gap)) },
          ]}
        />
        <View style={styles.dotWrap}>
          {dotArray.map((item, index) => (
            <View key={index} style={[styles.dot, index <= current - 1 && styles.current]}>
              <Text style={styles.dotText}>{index + 1}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
const gap = 27
const dotWidth = 24
const dotHeight = 24
const width = dotWidth * 5 + gap * 4
const lineHeight = 2
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: {
    width: width,
    height: dotHeight,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dotWrap: {
    flexDirection: 'row',
    flex: 1,
    zIndex: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dot: {
    width: dotWidth,
    height: dotHeight,
    borderRadius: dotWidth / 2,
    backgroundColor: '#D5D5D5',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  current: {
    backgroundColor: '#00A24D',
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'ArialRoundedMTBold',
  },
  currentText: {},
  line: {
    position: 'absolute',
    backgroundColor: '#D5D5D5',
    height: lineHeight,
    width: width - dotWidth,
    zIndex: 2,
    top: (dotHeight - lineHeight) / 2,
    left: dotWidth / 2,
  },
  lineCurrent: {
    backgroundColor: '#00A24D',
    zIndex: 3,
  },
})
