import React, { useEffect, useReducer } from 'react'
import { Image, View, Text } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import styles from './style'
import { setStorageItem, getStorageValue } from '@/utils/storage'
import { initiateState, reducer, UPDATE_IS_FIRST } from '@/state'
import App from '@/App'
import Icon from 'react-native-vector-icons/Ionicons'

const slides = [
  {
    key: 'one',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('@/assets/images/splash1.webp'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'two',
    title: 'Title 2',
    text: 'Other cool stuff',
    image: require('@/assets/images/splash2.webp'),
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: require('@/assets/images/splash3.webp'),
    backgroundColor: '#22bcb5',
  },
]
const renderItem = (data: typeof slides) =>
  data.map(({ title, text, image, key }) => (
    <View style={styles.slide} key={key}>
      <Text style={styles.title}>{title}</Text>
      <Image source={image} />
      <Text style={styles.text}>{text}</Text>
    </View>
  ))
const renderNextButton = () => {
  return (
    <View style={styles.buttonCircle}>
      <Icon name="md-arrow-round-forward" color="rgba(1, 35, 247, 1)" size={13} />
    </View>
  )
}
const renderDoneButton = () => {
  return (
    <View style={styles.buttonCircle}>
      <Icon name="md-checkmark" color="rgba(1, 35, 247, 1)" size={13} />
    </View>
  )
}
export default () => {
  const [state, dispatch] = useReducer(reducer, initiateState)
  useEffect(() => {
    const query = async () => {
      const value = (await getStorageValue('isFirst')) as boolean
      dispatch({ type: UPDATE_IS_FIRST, isFirst: value })
    }
    query()
  }, [])
  if (state.isFirst) {
    return <App />
  }
  return (
    <AppIntroSlider
      // @ts-ignore
      renderItem={() => renderItem(slides)}
      renderDoneButton={renderDoneButton}
      renderNextButton={renderNextButton}
      data={slides}
      onDone={() => {
        setStorageItem('isFirst', true)
        dispatch({ type: UPDATE_IS_FIRST, isFirst: true })
      }}
    />
  )
}
