import React, { PureComponent } from 'react'
import { View } from 'react-native'
import Form from './form'
import AsyncStorage from '@react-native-community/async-storage'
import { dict, submit } from '../../../services/apply'
import NavigationUtil from '../../../navigation/NavigationUtil'
import {
  LoanStep,
  LoanPotential,
  HeaderLeft,
  Sensors,
  BackPressComponent,
} from '../../../components'
import { DA, Logger, handleModel, errorCaptured } from '../../../utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { PageStyles } from '../../../styles'
import FooterMessage from '../commonFooter'
import appsFlyer from 'react-native-appsflyer'
import { AppEventsLogger } from 'react-native-fbsdk'

const PAGE_ID = 'P03'
export default class AddressScreen extends PureComponent {
  static navigationOptions = {
    title: 'Step2',
    headerLeft: <HeaderLeft route="Realname" />,
  }
  constructor(props) {
    super(props)
    Logger.gap()
    this.state = {
      applyDto: {
        homeAddrProvinceCode: '',
        homeAddrCityCode: '',
        homeAddrCountyCode: '',
      },
      provinceEnum: [],
      cityEnum: [],
      countyEnum: [],
      howLongEnum: [],
      user: {},
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
    Logger.gap()
  }
  async initData() {
    const [applyDto, provinceEnum, howLongEnum] = await Promise.all([
      AsyncStorage.getItem('applyDto'),
      dict('DISTRICT'),
      dict('HOW_LONG_STAYING'),
    ]).catch(e => Logger.error(e))
    const _applyDto = JSON.parse(applyDto)
    Logger.info('address缓存', _applyDto)
    this.setState({
      applyDto: { ...this.state.applyDto, ..._applyDto },
      provinceEnum,
      howLongEnum,
    })
    const { homeAddrCityCode, homeAddrProvinceCode } = _applyDto
    // 加载已有缓存后，判断是否需要去加载省市区信息
    homeAddrProvinceCode && this._onProvinceChange(homeAddrProvinceCode, true)
    homeAddrCityCode && this._onCityChange(homeAddrCityCode, true)
  }
  onBackPress = () => {
    NavigationUtil.goBack(this.props.navigation)
    return true
  }
  async onGetCityList(province) {
    const [cityErr, cityEnum] = await errorCaptured(() => dict(province))
    if (cityErr) {
      return []
    }
    return cityEnum
  }
  async onGetCountyList(city) {
    const [countyErr, countyEnum] = await errorCaptured(() => dict(city))
    if (countyErr) {
      return []
    }
    return countyEnum
  }
  async _onProvinceChange(province, isFirst) {
    const cityEnum = await this.onGetCityList(province)
    this.setState({
      cityEnum,
    })
    if (!isFirst) {
      this.setState({
        applyDto: {
          ...this.state.applyDto,
          homeAddrProvinceCode: province,
          homeAddrCityCode: '',
          homeAddrCountyCode: '',
        },
      })
    }
  }
  async _onCityChange(city, isFirst) {
    const countyEnum = await this.onGetCountyList(city)
    this.setState({
      countyEnum,
    })
    if (!isFirst) {
      this.setState({
        applyDto: {
          ...this.state.applyDto,
          homeAddrCityCode: city,
          homeAddrCountyCode: '',
        },
      })
    }
  }
  async _onCountyChange(county) {
    this.setState({
      applyDto: {
        ...this.state.applyDto,
        homeAddrCountyCode: county,
      },
    })
  }

  render() {
    const {
      provinceEnum,
      cityEnum,
      countyEnum,
      howLongEnum,
      applyDto,
      submitLoading,
      user,
    } = this.state
    const onOK = async formObj => {
      DA.setClickTime(`${PAGE_ID}_B_SUBMIT`)
      const { applyId } = applyDto
      const data = {
        ...formObj,
        currentStep: 3,
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
          .then(() => Logger.log('缓存存储成功', string))
          .catch(e => Logger.log(e))
        DA.setModify(`${PAGE_ID}_angleX`, this.state.angleX)
        DA.setModify(`${PAGE_ID}_angleY`, this.state.angleY)
        DA.setModify(`${PAGE_ID}_angleZ`, this.state.angleZ)
        DA.send(PAGE_ID)
        appsFlyer.trackEvent('03_event_address', {
          user_id: user.userId,
          '03_event_address': `${applyId}`,
        })
        AppEventsLogger.logEvent('03_event_address')
        NavigationUtil.goPage('Job')
      }
    }
    return (
      <KeyboardAwareScrollView style={PageStyles.container}>
        <LoanPotential progress={25} />
        <View style={PageStyles.formContainer}>
          <LoanStep total={5} current={2} />
          <Form
            onOK={onOK}
            item={applyDto}
            provinceEnum={provinceEnum}
            howLongEnum={howLongEnum}
            cityEnum={cityEnum}
            countyEnum={countyEnum}
            pid={PAGE_ID}
            _onProvinceChange={this._onProvinceChange.bind(this)}
            _onCityChange={this._onCityChange.bind(this)}
            _onCountyChange={this._onCountyChange.bind(this)}
            submitLoading={submitLoading}
          />
        </View>
        <FooterMessage />
        <Sensors send={res => this.setState({ ...res })} />
      </KeyboardAwareScrollView>
    )
  }
}
