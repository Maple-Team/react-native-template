import React from 'react'
import { View, Image, ImageBackground } from 'react-native'
import { responsive } from '../utils'
import { Text } from '../components'
import StyleSheet from 'react-native-adaptive-stylesheet'
const marginHorizontal = 5
const dotWidth = 24
const parentPadding = 10 // 父容器的padding
// TODO gif https://stackoverflow.com/questions/35594783/how-do-i-display-an-animated-gif-in-react-native
export default function LoanPotential({ progress }) {
  const width = Math.floor((1 - progress / 100) * (375 - (marginHorizontal + parentPadding) * 2))
  const left = Math.floor(
    (progress / 100) * (375 - (marginHorizontal + parentPadding) * 2 - dotWidth)
  )
  const left2 = Math.ceil((progress / 100) * (375 - (marginHorizontal + parentPadding) * 2))
  const hasTipDom = (
    <View style={styles.tipWarp}>
      <ImageBackground
        source={require('../assets/images/common/tip-cont.png')}
        style={styles.tipContainer}>
        <View style={styles.tipInfoContainer}>
          <Text style={styles.greenText}>
            {progress === 75 ? 'You are closed to join' : 'Last step to go and join'}
          </Text>
          <Text style={styles.strongText}>Lucky Spin </Text>
          <Text style={styles.greenText}>{progress === 100 ? '!' : ''}</Text>
          {progress === 75 && (
            <Text style={styles.greenText}>
              just left <Text style={styles.strongText}> 2 </Text>
              more steps !
            </Text>
          )}
        </View>
      </ImageBackground>
      <Image style={styles.tipIcon} source={require('../assets/images/common/disc.png')} />
    </View>
  )
  return (
    <View style={styles.wrap}>
      <View style={styles.container}>
        <View style={styles.line} />
        <View style={[styles.lineCurr, { width: responsive(width), left: responsive(left2) }]} />
        <View style={[styles.dot, { left: responsive(left) }]}>
          <Text style={styles.dotText}>{`${progress}%`}</Text>
        </View>
      </View>
      {(progress === 75 || progress === 100) && hasTipDom}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: marginHorizontal,
    paddingVertical: 29.5,
  },
  dot: {
    width: dotWidth,
    height: 24,
    backgroundColor: '#00A24D',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -6,
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontFamily: 'ArialRoundedMTBold',
  },
  container: {
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 375 - (marginHorizontal + parentPadding) * 2,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00A24D',
  },
  lineCurr: {
    height: 8,
    position: 'absolute',
    top: 0,
    backgroundColor: '#E5FAEF',
    borderRadius: 4,
  },
  tipWarp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 55.5,
    paddingRight: 10,
    position: 'relative',
    marginTop: 27,
  },
  tipContainer: {
    height: 47.5,
    paddingTop: 10,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 35.5,
  },
  tipInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  greenText: {
    color: '#00A24D',
    fontSize: 11,
    fontFamily: 'ArialRoundedMTBold',
  },
  strongText: {
    color: '#FF9601',
    fontSize: 13,
    fontFamily: 'ArialRoundedMTBold',
    paddingHorizontal: 2,
  },
  tipIcon: {
    width: 59,
    height: 76,
    position: 'absolute',
    right: 0,
  },
})
