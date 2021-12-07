import React, { PureComponent } from 'react'
import { View } from 'react-native'
import Form from './form'
import { dict, submit } from '../../../services/apply'
import NavigationUtil from '../../../navigation/NavigationUtil'
import {
  LoanStep,
  LoanPotential,
  HeaderLeft,
  Sensors,
  BackPressComponent,
  Chat,
} from '../../../components'
import ExampleModal from './modal'
import { DA, Logger, handleModel, errorCaptured, uploadJPushInfo } from '../../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PageStyles } from '../../../styles'
import FooterMessage from '../commonFooter'
import appsFlyer from 'react-native-appsflyer'
import { AppEventsLogger } from 'react-native-fbsdk'
const PAGE_ID = 'P05'
export default class ImageScreen extends PureComponent {
  static navigationOptions = {
    title: 'Step4',
    headerLeft: <HeaderLeft route="Job" />,
    headerRight: <Chat />,
  }
  constructor(props) {
    super(props)
    this.state = {
      applyDto: {},
      idTypeEnum: [],
      user: {},
      exampleVisible: false,
      submitLoading: false,
      // 陀螺仪数据
      angleX: '0.0,0.0',
      angleY: '0.0,0.0',
      angleZ: '0.0,0.0',
      selfId: '', //已拍照上传的活体照片id
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }

  componentDidMount() {
    this.initData()
    this.backPress.componentDidMount()
    DA.setEnterPageTime(`${PAGE_ID}_Enter`)
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
    DA.setLeavePageTime(`${PAGE_ID}_Leave`)
  }

  onBackPress = () => {
    NavigationUtil.goBack(this.props.navigation)
    return true
  }
  async initData() {
    const [applyDto, user, selfId, idTypeEnum] = await Promise.all([
      AsyncStorage.getItem('applyDto'),
      AsyncStorage.getItem('user'),
      AsyncStorage.getItem('selfId'),
      dict('PRIMAARYID'),
    ]).catch(e => Logger.error(e))
    const _applyDto = JSON.parse(applyDto)
    this.setState({
      applyDto: { ...this.state.applyDto, ..._applyDto },
      idTypeEnum,
      user: JSON.parse(user),
      selfId,
    })
  }
  render() {
    const { applyDto, idTypeEnum, exampleVisible, submitLoading, user, selfId } = this.state
    const onOK = async formObj => {
      DA.setClickTime(`${PAGE_ID}_B_SUBMIT`)
      const { applyId } = applyDto
      const data = {
        ...formObj,
        currentStep: 5,
        totalSteps: 6,
        complete: 'N',
        applyId,
      }
      this.setState({ submitLoading: true })
      let [err] = await errorCaptured(() => submit({ data: handleModel(data) }))
      this.setState({ submitLoading: false })
      if (!err) {
        const _applyDto = await AsyncStorage.getItem('applyDto')
        const string = JSON.stringify({ ...JSON.parse(_applyDto), ...formObj })
        AsyncStorage.setItem('applyDto', string)
          .then(() => Logger.log('image form storage', string))
          .catch(e => Logger.log(e))
        DA.setModify(`${PAGE_ID}_angleX`, this.state.angleX)
        DA.setModify(`${PAGE_ID}_angleY`, this.state.angleY)
        DA.setModify(`${PAGE_ID}_angleZ`, this.state.angleZ)
        DA.send(PAGE_ID)
        uploadJPushInfo(user)
        appsFlyer.trackEvent('05_event_id_card', {
          user_id: user.userId,
          '05_event_id_card': `${applyId}`,
        })
        AppEventsLogger.logEvent('05_event_id_card')
        NavigationUtil.goPage('Confirm')
      }
    }
    return (
      <KeyboardAwareScrollView style={PageStyles.container}>
        <LoanPotential progress={75} />
        <View style={PageStyles.formContainer}>
          <LoanStep total={5} current={4} />
          <Form
            onOK={onOK}
            item={applyDto}
            idTypeEnum={idTypeEnum}
            pid={PAGE_ID}
            onExampleOpen={() => this.setState({ exampleVisible: true })}
            submitLoading={submitLoading}
            showSecondCard={true}
            selfId={selfId}
          />
        </View>
        <FooterMessage />
        {exampleVisible && (
          <ExampleModal
            visible={true}
            livenessStatus="N"
            onClose={() => this.setState({ exampleVisible: false })}
          />
        )}
        <Sensors send={res => this.setState({ ...res })} />
      </KeyboardAwareScrollView>
    )
  }
}
