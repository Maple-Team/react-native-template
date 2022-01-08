import React from 'react'
import { View, Text, StatusBar, ImageBackground } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import styles from './style'
import { Color } from '@/styles/color'
import { useTranslation } from 'react-i18next'
import emitter from '@/eventbus'

const slides = [
  {
    key: 'one',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('@/assets/images/splash/splash1.webp'),
  },
  {
    key: 'two',
    title: 'Title 2',
    text: 'Other cool stuff',
    image: require('@/assets/images/splash/splash2.webp'),
  },
  {
    key: 'three',
    title: 'Title 3',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: require('@/assets/images/splash/splash3.webp'),
  },
]
type Item = typeof slides[0]

export default function Init() {
  const { t } = useTranslation()
  const renderItem = ({ item: { key, image, text, title } }: { item: Item }) => {
    return (
      <ImageBackground style={styles.slide} key={key} source={image}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </ImageBackground>
    )
  }

  const keyExtractor = (item: Item) => item.title
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={slides}
        activeDotStyle={{
          backgroundColor: Color.primary,
        }}
        dotStyle={{
          backgroundColor: 'rgba(191, 193, 204, 1)',
        }}
        showDoneButton
        showNextButton={false}
        doneLabel={t('done')}
        onDone={() => emitter.emit('FIRST_INIT', true)}
      />
    </View>
  )
}
