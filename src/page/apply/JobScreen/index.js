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

const PAGE_ID = 'P04'
export default class JobScreen extends PureComponent {
  static navigationOptions = {
    title: 'Step3',
    headerLeft: <HeaderLeft route="Address" />,
    headerRight: <Chat />,
  }

  constructor(props) {
    super(props)
    this.state = {
      applyDto: {},
      user: {},
      industryEnum: [],
      socialStatusEnum: [],
      loanPurposeEnum: [],
      relationShipEnum: [],
      incumbencyEnum: [],
      submitLoading: false,
      // 陀螺仪数据
      angleX: '0.0,0.0',
      angleY: '0.0,0.0',
      angleZ: '0.0,0.0',
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }
  componentDidMount() {
    this.initData()
    this.backPress.componentDidMount()
    DA.setEnterPageTime(`${PAGE_ID}_Enter`)
  }
  async initData() {
    const [
      applyDto,
      user,
      industryEnum,
      socialStatusEnum,
      loanPurposeEnum,
      relationShipEnum,
      incumbencyEnum,
    ] = await Promise.all([
      AsyncStorage.getItem('applyDto'),
      AsyncStorage.getItem('user'),
      dict('INDUSTRY'),
      dict('SOCIAL_STATUS'),
      dict('LOAN_PURPOSE'),
      dict('RELATIONSHIP'),
      dict('INCUMBENCY'),
    ]).catch(e => Logger.error(e))
    const _applyDto = JSON.parse(applyDto)
    Logger.info('job缓存', _applyDto)
    this.setState({
      applyDto: { ...this.state.applyDto, ..._applyDto },
      user: JSON.parse(user),
      industryEnum,
      socialStatusEnum,
      loanPurposeEnum,
      relationShipEnum,
      incumbencyEnum,
    })
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
    DA.setLeavePageTime(`${PAGE_ID}_Leave`)
  }
  onBackPress = () => {
    NavigationUtil.goBack(this.props.navigation)
    return true
  }

  render() {
    const {
      industryEnum,
      socialStatusEnum,
      loanPurposeEnum,
      relationShipEnum,
      incumbencyEnum,
      applyDto,
      submitLoading,
      user,
    } = this.state
    const onOK = async formObj => {
      DA.setClickTime(`${PAGE_ID}_B_SUBMIT`)
      const { applyId } = applyDto
      const data = {
        ...formObj,
        currentStep: 4,
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
          .then(() => Logger.log('job form storage', string))
          .catch(e => Logger.log(e))
        DA.setModify(`${PAGE_ID}_angleX`, this.state.angleX)
        DA.setModify(`${PAGE_ID}_angleY`, this.state.angleY)
        DA.setModify(`${PAGE_ID}_angleZ`, this.state.angleZ)
        DA.send(PAGE_ID)
        appsFlyer.trackEvent('04_event_job_info', {
          user_id: user.userId,
          '04_event_job_info': `${applyId}`,
        })
        AppEventsLogger.logEvent('04_event_job_info')
        this.props.navigation.navigate('Image')
      }
    }

    return (
      <KeyboardAwareScrollView style={PageStyles.container}>
        <LoanPotential progress={50} />
        <View style={PageStyles.formContainer}>
          <LoanStep total={5} current={3} />
          <Form
            onOK={onOK}
            item={applyDto}
            industryEnum={industryEnum}
            socialStatusEnum={socialStatusEnum}
            loanPurposeEnum={loanPurposeEnum}
            relationShipEnum={relationShipEnum}
            incumbencyEnum={incumbencyEnum}
            pid={PAGE_ID}
            submitLoading={submitLoading}
          />
        </View>
        <FooterMessage />
        <Sensors send={res => this.setState({ ...res })} />
      </KeyboardAwareScrollView>
    )
  }
}
