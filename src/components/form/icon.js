import React from 'react'
import { Text } from 'react-native'
import styles from '../../styles/formStyles'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'

const _getFieldError = errors => {
  if (errors) {
    return errors.map(info => (
      <Text style={styles.errorText} key={info}>
        {info}
      </Text>
    ))
  }
  return null
}
const getSocialIcon = ({ name, size, color }) => {
  switch (name) {
    case 'wechat':
      return <AntDesign name={name} size={size} color={color} style={{ paddingHorizontal: 5 }} />
    case 'facebook-messenger':
    case 'viber':
    case 'line':
      return <FontAwesome5 name={name} size={size} color={color} style={{ paddingHorizontal: 5 }} />
    case 'whatsapp':
      return (
        <Ionicons
          name={`logo-${name}`}
          size={size}
          color={color}
          style={{ paddingHorizontal: 5 }}
        />
      )
    case 'skype':
      return (
        <Entypo
          name={`${name}-with-circle`}
          size={size}
          color={color}
          style={{ paddingHorizontal: 5 }}
        />
      )
    default:
      return null
  }
}

export { _getFieldError, getSocialIcon }
