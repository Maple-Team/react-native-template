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
import { PageStyles } from '../../../styles'
import AsyncStorage from '@react-native-community/async-storage'
import { DA, Logger, handleModel, errorCaptured } from '../../../utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FooterMessage from '../commonFooter'
import appsFlyer from 'react-native-appsflyer'
import { AppEventsLogger } from 'react-native-fbsdk'

const PAGE_ID = 'P02'
export default class RealnameScreen extends PureComponent {
  static navigationOptions = {
    title: 'Step1',
    headerLeft: <HeaderLeft route="Index" />,
    headerRight: <Chat />,
  }
  constructor(props) {
    super(props)
    this.state = {
      applyDto: {},
      user: {},
      enums: { educationEnum: [], maritalEnum: [] },
      submitLoading: false,
      // 陀螺仪数据
      angleX: '0.0,0.0',
      angleY: '0.0,0.0',
      angleZ: '0.0,0.0',
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }
  componentDidMount() {
    this.backPress.componentDidMount()
    DA.setEnterPageTime(`${PAGE_ID}_Enter`)
    this.initData()
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
    DA.setLeavePageTime(`${PAGE_ID}_Leave`)
  }
  async initData() {
    const [applyDto, user, maritalEnum, educationEnum] = await Promise.all([
      AsyncStorage.getItem('applyDto'),
      AsyncStorage.getItem('user'),
      dict('MARITAL_STATUS'),
      dict('EDUCATION'),
    ]).catch(e => Logger.error(e))
    Logger.info('realname缓存', JSON.parse(applyDto))
    this.setState({
      applyDto: { ...this.state.applyDto, ...JSON.parse(applyDto) },
      user: JSON.parse(user),
      enums: { ...this.state.enums, educationEnum, maritalEnum },
    })
  }
  onBackPress = () => {
    NavigationUtil.goBack(this.props.navigation)
    return true
  }
  render() {
    const { applyDto, enums, submitLoading, user } = this.state
    const onOK = async formObj => {
      DA.setClickTime(`${PAGE_ID}_B_SUBMIT`)
      const { applyId } = applyDto
      const data = {
        ...formObj,
        currentStep: 2,
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
        DA.setModify(`${PAGE_ID}_angleX`, this.state.angleX)
        DA.setModify(`${PAGE_ID}_angleY`, this.state.angleY)
        DA.setModify(`${PAGE_ID}_angleZ`, this.state.angleZ)
        DA.send(PAGE_ID)
        appsFlyer.trackEvent('02_event_identity', {
          user_id: user.userId,
          '02_event_identity': `${applyId}`,
        })
        AppEventsLogger.logEvent('02_event_identity')
        NavigationUtil.goPage('Address')
      }
    }
    const { educationEnum, maritalEnum } = enums
    return (
      <KeyboardAwareScrollView style={PageStyles.container}>
        <LoanPotential progress={0} />
        <View style={PageStyles.formContainer}>
          <LoanStep total={5} current={1} />
          <Form
            onOK={onOK}
            item={applyDto}
            applyId={applyDto.applyId}
            educationEnum={educationEnum}
            maritalEnum={maritalEnum}
            pid={PAGE_ID}
            submitLoading={submitLoading}
          />
        </View>
        <Sensors send={res => this.setState({ ...res })} />
        <FooterMessage />
      </KeyboardAwareScrollView>
    )
  }
}
