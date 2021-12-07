import ApplyInfo from './ApplyInfo'
import LoanInfo from './LoanInfo'
import LoanStep from './LoanStep'
import LoanPotential from './LoanPotential'
import Form from './form'
import FormGap from './formGap'
import PhotoPicker from './PhotoPicker'
import HeaderLeft from './HeaderLeft'
import HeaderIcon from './HeaderIcon'
import HeaderRight from './HeaderRight'
import PermissionModal from './permissionModal'
import OpenSettingModal from './openSettingModal'
import NotificationModal from './notificationModal'
import Sensors from './sensors'
import Text from './Text'
import Slider from './Slider'
import BackPressComponent from './BackPressComponent'
import Chat from './chat'

import { Alert, BackHandler } from 'react-native'
import { Logger } from '../utils'
const ExitAlert = () => {
  Logger.log('onBackPress')
  Alert.alert(
    'Confirm Exit',
    'Do you want to quit the app?',
    [
      { text: 'CANCEL', style: 'cancel', onPress: () => Logger.log('Cancel Pressed') },
      { text: 'OK', onPress: () => BackHandler.exitApp() },
    ],
    { cancelable: true }
  )
}

export {
  ApplyInfo,
  LoanInfo,
  LoanStep,
  LoanPotential,
  Form,
  FormGap,
  PhotoPicker,
  PermissionModal,
  HeaderLeft,
  HeaderRight,
  Sensors,
  Text,
  HeaderIcon,
  Slider,
  ExitAlert,
  BackPressComponent,
  OpenSettingModal,
  NotificationModal,
  Chat,
}
