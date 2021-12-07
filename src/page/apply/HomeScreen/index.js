import React, { PureComponent } from 'react'
import {
  View,
  Image,
  Animated,
  Easing,
  Platform,
  AppState,
  BackHandler,
  NativeModules,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box'
import { ScrollView } from 'react-native-gesture-handler'
import Swiper from 'react-native-swiper'
import {
  PermissionModal,
  Text,
  Slider,
  Form,
  Sensors,
  ExitAlert,
  BackPressComponent,
  HeaderIcon,
  OpenSettingModal,
  NotificationModal,
  Chat,
} from '../../../components'
import {
  errorCaptured,
  handleModel,
  I18n,
  Logger,
  Constants,
  toThousands,
  DA,
  getDevice,
  backgroundLocationConfig,
} from '../../../utils'
import styles from './style'
import { getProduct, prepareCalc, submit, trace } from '../../../services/apply'
import {
  refreshToken,
  getUser,
  getMessageCount,
  getNotificationVersion,
} from '../../../services/user'
import { Toast, Checkbox, Button, Portal } from '@ant-design/react-native'
import NavigationUtil from '../../../navigation/NavigationUtil'
import dayjs from 'dayjs'
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions'
import fakeList from './fakeList'
import appsFlyer from 'react-native-appsflyer'
import { AppEventsLogger } from 'react-native-fbsdk'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import { NavigationEvents } from 'react-navigation'

let flag = false
const AgreeItem = Checkbox.AgreeItem
const PAGE_ID = 'P01'
const { FloatingNormalPicker } = Form
const dot = <View style={styles.dot} />
const activeDot = <View style={[styles.dot, styles.activeDot]} />
const getLocationPermissionName = () =>
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE

export default class HomeScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    const number = params ? params.number : 0

    return {
      title: 'Loan',
      headerLeft: (
        <HeaderIcon
          type="notification"
          number={number}
          onPress={() => {
            navigation.navigate('Message', {
              from: 'Index',
            })
          }}
        />
      ),
      headerRight: <Chat />,
    }
  }

  constructor(props) {
    super(props)
    NavigationUtil.navigation = props.navigation // 静态工具类赋值
    this.state = {
      amountStep: 500,
      loanCode: '',
      loanStep: 7,
      maxAmount: 0,
      maxLoanTerms: 0,
      maxViewAmount: 0,
      maxViewTerms: 0,
      minAmount: 0,
      minLoanTerms: 0,
      productCode: '',
      submitLoading: false,
      LocationPermissionModalVisible: false, // 拿定位权限弹窗
      PhoneStatePermissionModalVisible: false, // 拿手机状态弹窗
      gps: '',
      applyDto: {
        loanTerms: 0,
        applyAmount: 0,
      }, // 用户填写/选择的申请信息集合
      user: {
        loanCount: 0,
      },
      availableTerms: [{ name: '7', code: 7 }],
      fadeAnimOn: new Animated.Value(1),
      fadeAnimOff: new Animated.Value(0),
      hasAgreeAgreement: false, // 是否同意服务条款
      showDisAgreeWarn: false, // 未同意服务协议
      // 陀螺仪数据
      angleX: '0.0,0.0',
      angleY: '0.0,0.0',
      angleZ: '0.0,0.0',
      productLoading: true, // 产品是否在加载
      showSettingVisible: false,
      showNotificationVisible: false, // 是否显示通知
      notification: '', // 通知内容
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }
  async componentDidMount() {
    BackgroundGeolocation.configure(backgroundLocationConfig)
    if (__DEV__) {
      Toast.info('安装了依赖后，是否根据readme.md注释掉ant-design里面的tab.js的代码?')
    }
    AsyncStorage.setItem(Constants.ISFIRSTOPEN, '1')
    Logger.log('App componentDidMount')
    await this._initState()
    this.product()
    this.startAudioAnimation()
    this.checkDevicePermissionIsGranted()
    this.checkLocationPermissionIsGranted()
    this.backPress.componentDidMount()
    DA.setEnterPageTime(`${PAGE_ID}_Enter`)
    this._trace()
    this._getUser()
    AppState.addEventListener('change', this._onAppStateChanged.bind(this))
    Logger.log('componentDidMount')
    this.getNotification()
    BackHandler.addEventListener('hardwareBackPress', () => {
      LocationServicesDialogBox.forceCloseDialog()
    })
  }
  componentWillUnmount() {
    Logger.info('componentWillUnmount')
    this.backPress.componentWillUnmount()
    BackgroundGeolocation.removeAllListeners()
    LocationServicesDialogBox.stopListener()
    DA.setLeavePageTime(`${PAGE_ID}_Leave`)
    AppState.removeEventListener('change', this._onAppStateChanged.bind(this))
  }
  async getNotification() {
    const [err, res] = await errorCaptured(getNotificationVersion)
    Logger.log(res)
    if (err) {
      return
    }
    const { notification } = res
    this.setState({
      notification,
      showNotificationVisible: !!notification,
    })
  }
  async _onAppStateChanged() {
    switch (AppState.currentState) {
      case 'active':
        await this._initState()
        this._getMessageCount()
        this._getUser()
        this.checkDevicePermissionIsGranted()
        this.checkLocationPermissionIsGranted()
        break
      case 'background':
        // Logger.log('background')
        break
      default:
    }
  }
  async _getUser() {
    const [err, user] = await errorCaptured(getUser)
    if (err) {
      return
    }
    this.setState({
      user,
    })
  }
  async _trace() {
    trace({
      headers: {
        requestId: (await AsyncStorage.getItem('deviceId')) || '',
      },
    }).catch(e => Logger.error(e, 'trace error'))
  }
  async _getMessageCount() {
    const [err, res] = await errorCaptured(getMessageCount)
    if (err) {
      return
    }
    this.props.navigation.setParams({ number: res })
  }
  onBackPress = () => {
    Logger.log('HomeScreen back')
    ExitAlert()
    return true
  }
  startAudioAnimation() {
    this.state.fadeAnimOn.setValue(1)
    this.state.fadeAnimOff.setValue(0)
    Animated.parallel([
      //通过Animated.spring等函数设定动画参数
      //可选的基本动画类型: spring, decay, timing
      Animated.timing(
        // 随时间变化而执行的动画类型
        this.state.fadeAnimOn, // 动画中的变量值
        {
          toValue: 0, // 透明度最终变为1，即完全不透明
          easing: Easing.out(Easing.linear), //线性变化，匀速旋转
        }
      ),
      Animated.timing(this.state.fadeAnimOff, {
        toValue: 1,
        easing: Easing.out(Easing.linear),
      }),
      //调用start启动动画,start可以回调一个函数,从而实现动画循环
    ]).start(() => this.startAudioAnimation())
  }
  async _initState() {
    let from
    try {
      from = this.props.navigation.state.params.from
    } catch (error) {}
    const [storage2, storage3, storage4] = await AsyncStorage.multiGet([
      'user',
      'deviceId',
      'applyDto',
    ])
    const applyDto = JSON.parse(storage4[1] || '{}')
    const user = JSON.parse(storage2[1])
    Logger.info('Home缓存', applyDto)
    this.setState({
      applyDto: { ...applyDto, ...this.state.applyDto },
      user: user || {},
      hasAgreeAgreement: applyDto.hasAgreeAgreement,
    })
    const deviceId = storage3[1] || ''
    const { gps } = this.state
    let _gps = gps || (await AsyncStorage.getItem('gps'))
    if (from !== '/login') {
      flag = true
      if (flag) {
        return
      }
      const [err, res] = await errorCaptured(() =>
        refreshToken({
          data: {
            userId: user.userId,
            deviceId,
            gps: _gps || '0,0',
          },
        })
      )
      if (err) {
        return
      }
      await AsyncStorage.setItem('accessToken', res.accessToken)
        .then(() => Logger.log('accessToken 刷新存储成功'))
        .catch(e => Logger.log('accessToken 刷新存储失败', e))
      flag = false
    }
  }
  async calc({ loanCode, productCode, applyAmount, loanTerms }) {
    const [err, res] = await errorCaptured(() =>
      prepareCalc({
        data: {
          loanAmt: applyAmount,
          loanDay: loanTerms,
          loanCode,
          productCode,
        },
      })
    )
    if (err) {
      Promise.reject(err)
    }
    return res
  }
  async checkLocationPermissionIsGranted() {
    // 1.检查权限
    const [err, res] = await errorCaptured(() => check(getLocationPermissionName()))
    Logger.log('location permission', err, res)
    if (err) {
      return // 检查权限出错
    }
    // 2. 判断结果
    switch (res) {
      case RESULTS.UNAVAILABLE:
        Toast.fail('This feature is not available (on this device / in this context)')
        break
      case RESULTS.DENIED:
        this.setState({ LocationPermissionModalVisible: true })
        break
      case RESULTS.GRANTED:
        this.getLocation()
        break
      case RESULTS.BLOCKED:
      default:
        this.setState({
          showSettingVisible: true,
        })
        break
    }
  }
  async _openSetting() {
    openSettings().then(() => {
      this.setState({
        showSettingVisible: false,
      })
    })
  }
  getLocation() {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location.",
      ok: 'YES',
      cancel: 'NO',
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
      preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
      providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
    })
      .then(() => {
        Logger.log('location enabled')
        BackgroundGeolocation.start() //triggers start on start event
      })
      .catch(e => {
        Logger.log('e', e)
        // this.getLocation()
      })
    BackgroundGeolocation.on('error', error => {
      Logger.log('[ERROR] BackgroundGeolocation error:', error)
    })
    BackgroundGeolocation.on('location', location => {
      const { longitude, latitude } = location
      Logger.log('[INFO] location', location)
      AsyncStorage.setItem('gps', `${latitude},${longitude}`)
      this.setState({
        gps: `${latitude},${longitude}`,
      })
      BackgroundGeolocation.stop()
    })
    BackgroundGeolocation.on('start', () => {
      Logger.log('[INFO] BackgroundGeolocation service has been started')
    })
    BackgroundGeolocation.on('stop', () => {
      Logger.log('[INFO] BackgroundGeolocation service has been stopped')
    })
  }
  async requestLocation() {
    this.setState({ LocationPermissionModalVisible: false })
    const [err, res] = await errorCaptured(() => request(getLocationPermissionName()))
    Logger.log('requestLocation', err, res)
    if (err) {
      return // 拿权限出错
    }
    if (res === RESULTS.GRANTED) {
      this.getLocation()
    } else {
      this.checkLocationPermissionIsGranted()
    }
  }
  async checkDevicePermissionIsGranted() {
    if (Platform.OS === 'ios') {
      getDevice()
      return
    }
    // 1.检查权限
    const [err, res] = await errorCaptured(() => check(PERMISSIONS.ANDROID.READ_PHONE_STATE))
    Logger.log('deviceInfo', err, res)
    if (err) {
      return // 检查权限出错
    }
    // 2. 判断结果
    switch (res) {
      case RESULTS.UNAVAILABLE:
        Toast.fail('This feature is not available (on this device / in this context)')
        break
      case RESULTS.DENIED:
        this.setState({ PhoneStatePermissionModalVisible: true })
        break

      case RESULTS.GRANTED:
        if (__DEV__) {
          Logger.log('getDevice')
          let s = await getDevice()
          Logger.log({ device: s })
        }
        break
      case RESULTS.BLOCKED:
      default:
        this.setState({
          showSettingVisible: true,
        })
        break
    }
  }
  async requestPhoneState() {
    this.setState({ PhoneStatePermissionModalVisible: false })
    const [err, res] = await errorCaptured(() => request(PERMISSIONS.ANDROID.READ_PHONE_STATE))
    Logger.log('requestPhoneState', err, res)
    if (err) {
      return // 拿权限出错
    }
    if (res === RESULTS.GRANTED) {
      getDevice()
    } else {
      this.checkDevicePermissionIsGranted()
    }
  }
  async product() {
    const key = Toast.loading('Loading...')
    const [err, res] = await errorCaptured(getProduct)
    Portal.remove(key)
    if (!err) {
      this.setState({
        productLoading: false,
      })
      const { maxLoanTerms, maxAmount, loanTerms: availableLoanTerms } = res
      const { applyAmount, loanTerms } = this.state.applyDto
      const terms = availableLoanTerms
        .filter(item => item.available)
        .map(item => {
          return {
            name: `${item.loanTerm}`,
            code: item.loanTerm,
          }
        })
      this.setState({
        ...this.state,
        ...res,
        applyDto: {
          applyAmount: applyAmount > 0 ? applyAmount : maxAmount,
          loanTerms: loanTerms > 0 ? loanTerms : maxLoanTerms,
        },
        availableTerms: terms,
      })
      // Note 加载产品后，如果会展示还款信息，需要立即进行试算
      // const result = await this.calc({
      //   loanCode,
      //   productCode,
      //   applyAmount: maxAmount,
      //   loanTerms: maxLoanTerms,
      // })
      // const { totalAmt } = result
      // const endDate = dayjs()
      //   .add(maxLoanTerms - 1, 'day')
      //   .format('MM.DD.YYYY')
      // AsyncStorage.setItem(
      //   'loanInfo',
      //   JSON.stringify({
      //     maxAmount,
      //     endDate,
      //     repay: totalAmt,
      //     day: maxLoanTerms,
      //   })
      // )
    }
  }
  async toJump(user) {
    const { applyStatus, applyId, idcard, name, canReApplyDays } = user
    // 首贷/续贷/查看状态
    switch (applyStatus) {
      case 'SIGN': // !fixme 不常用的状态
        await this.calcAndStore()
        this.props.navigation.navigate('Confirm', { applyId })
        break
      case 'REPAY':
      case 'OVERDUE':
      case 'LOAN':
      case 'APPROVE':
      case 'SUPPLEMENTARY':
      case 'SUPPLEMENT_IMAGE':
        this.props.navigation.navigate('Done', { applyId })
        break
      case 'SUPPLEMENT_CONTACT':
        this.props.navigation.navigate('Contact', { applyId })
        break
      case 'SETTLE': // 结清、逾期结清、提前结清
      case 'CANCEL': // 合同撤销、放款失败
      case 'CONTINUED_LOAN_CANCEL': // 续贷撤销、放款失败
        const _res = await this.calcAndStore()
        if (_res === false) {
          break
        }
        await this.onSubmit()
        break
      case 'REJECTED': // 风险类拒绝
      case 'CONTINUED_LOAN_REJECTED': // 续贷拒绝
        if (canReApplyDays === 0) {
          // Note 被拒由后台返回天数决定能否再贷
          const __res = await this.calcAndStore()
          if (__res === false) {
            break
          }
          await this.onSubmit()
        } else {
          this.props.navigation.navigate('Done', { applyId })
        }
        break
      case 'EMPTY': // 无申请单
      case 'APPLY': // 申请中
      default:
        // 重走流程
        const ___res = await this.calcAndStore()
        if (___res === false) {
          break
        }
        await this.onSubmit()
        break
    }
  }
  async calcAndStore() {
    const {
      applyDto,
      maxAmount,
      maxLoanTerms,
      loanCode,
      productCode,
      hasAgreeAgreement,
      user,
    } = this.state
    if (!hasAgreeAgreement) {
      this.setState({
        showDisAgreeWarn: true,
      })
      return false
    }
    this.setState({ submitLoading: true })
    // Note: 非续贷首页不试算
    if (!Constants.CONTINUE_LOAN_TAG.includes(user.applyStatus)) {
      return
    }
    let { applyAmount, loanTerms } = applyDto
    if (applyAmount > maxAmount) {
      applyAmount = maxAmount
    }
    if (loanTerms > maxLoanTerms) {
      loanTerms = maxLoanTerms
    }
    // 1.试算
    this.setState({
      applyDto: { ...this.state.applyDto, applyAmount: applyAmount, loanTerms },
    })
    const [err, res] = await errorCaptured(() =>
      this.calc({
        loanCode,
        productCode,
        applyAmount,
        loanTerms,
      })
    )
    if (err) {
      Toast.fail(err.message)
      return
    }
    const endDate = dayjs()
      .add(loanTerms - 1, 'day')
      .format('MM.DD.YYYY')
    AsyncStorage.setItem(
      'loanInfo',
      JSON.stringify({
        applyAmount,
        endDate,
        repay: res.totalAmt,
        day: loanTerms,
      })
    )
  }
  async onBtnPress() {
    this.setState({
      submitLoading: true,
    })
    const [err, user] = await errorCaptured(getUser)
    this.setState({
      submitLoading: false,
      user,
    })
    if (err) {
      return
    }
    this.toJump(user)
  }
  // 提交信息操作
  async onSubmit() {
    DA.setClickTime(`${PAGE_ID}_B_SUBMIT`)
    const { loanCode, productCode, gps, maxAmount, user, applyDto } = this.state
    const { applyAmount, loanTerms } = applyDto
    const data = {
      currentStep: 1,
      totalSteps: 6,
      complete: 'N',
      applyAmount,
      loanTerms,
      loanCode,
      productCode,
      gps,
      phone: user.phone,
      maxApplyAmount: maxAmount,
    }
    // 如果从签约页跳转回来的，取出applyId
    const params = this.props.navigation.state.params
    if (params && params.applyId) {
      data.applyId = params.applyId
    }
    const [err2, res2] = await errorCaptured(() => submit({ data: handleModel(data) }))
    if (err2) {
      this.setState({ submitLoading: false })
      return
    }
    const { applyId } = res2
    // 提交完存储提交信息
    const _applyDto = await AsyncStorage.getItem('applyDto')
    const string = JSON.stringify({
      ...JSON.parse(_applyDto),
      ...applyDto,
      applyId,
      name: user.name,
      phone: user.phone,
      applyAmount,
      loanTerms,
      hasAgreeAgreement: true,
    })
    DA.setModify(`${PAGE_ID}_angleX`, this.state.angleX)
    DA.setModify(`${PAGE_ID}_angleY`, this.state.angleY)
    DA.setModify(`${PAGE_ID}_angleZ`, this.state.angleZ)
    await AsyncStorage.setItem('applyDto', string).catch(e => Logger.log(e))
    await AsyncStorage.setItem('applyId', `${applyId}`)
      .then(() => DA.send(PAGE_ID)) // 从AsyncStorage读取
      .catch(e => Logger.log(e))
    this.setState({ submitLoading: false })
    // 如果从签约页跳转过来的，直接跳转回去
    if (params && params.fromPage) {
      NavigationUtil.goPage(params.fromPage)
    } else {
      appsFlyer.setCustomerUserId(`${applyId}`, res => {
        Logger.log(res)
      })
      if (!Constants.CONTINUE_LOAN_TAG.includes(user.applyStatus)) {
        appsFlyer.trackEvent('01_loan_apply', {
          user_id: user.userId,
          '01_loan_apply': `${applyId}`,
        })
        AppEventsLogger.logEvent('01_loan_apply')
        NavigationUtil.goPage('Realname')
      } else {
        appsFlyer.trackEvent('01_loan_continue', {
          user_id: user.userId,
          '01_loan_continue': `${applyId}`,
        })
        AppEventsLogger.logEvent('01_loan_continue')
        NavigationUtil.goPage('Confirm')
      }
    }
  }
  async showAgreementModal(bool) {
    this.setState({ hasAgreeAgreement: bool })
  }
  swipList = data => {
    const content = _item =>
      `Congrats to User ${_item.phone} for getting coupon worth ${
        _item.coupAmt
      } php by successfully inviting ${_item.rCount} ${_item.rCount > 1 ? 'friends' : 'friend'}.`
    return data.map((_item, index) => (
      <View style={styles.carouselContentTextWrap} key={index}>
        <Text style={styles.carouselContentText}>{content(_item)}</Text>
      </View>
    ))
  }
  startChat = () => {
    const { user } = this.state
    console.log(user)
    NativeModules.RNZendeskChat.startChat({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone,
      tags: [],
      // department: '',
      botName: 'SurityCash', //机器人名称
      chatOnly: false,
    })
  }
  render() {
    const {
      amountStep,
      minAmount,
      maxViewAmount,
      maxAmount,
      submitLoading,
      user,
      availableTerms,
      applyDto,
      hasAgreeAgreement,
      showDisAgreeWarn,
      LocationPermissionModalVisible,
      PhoneStatePermissionModalVisible,
      fadeAnimOn,
      fadeAnimOff,
      productLoading,
      showSettingVisible,
      showNotificationVisible,
      notification,
    } = this.state
    const { applyAmount, loanTerms } = applyDto
    return (
      <ScrollView style={styles.container} automaticallyAdjustContentInsets={false}>
        <NavigationEvents
          onDidFocus={async () => {
            // 聚焦后拿用户信息/用户消息数
            await this._initState()
            this._getMessageCount()
            this._getUser()
            this.getNotification()
            this.requestLocation()
            Logger.log('onDidFocus')
          }}
        />
        <View style={styles.carouselWrap}>
          <View style={styles.carouselImgWrap}>
            <Animated.Image
              style={[styles.carouselImg, { opacity: fadeAnimOn }]}
              source={require('../../../assets/images/home/audio_on.png')}
            />
            <Animated.Image
              style={[styles.carouselImg, { opacity: fadeAnimOff }]}
              source={require('../../../assets/images/home/audio_off.png')}
            />
          </View>
          <Swiper
            autoplay={true}
            autoplayTimeout={6}
            loop={true}
            showsPagination={false}
            height={40}>
            {this.swipList(fakeList)}
          </Swiper>
        </View>
        <View style={styles.bannerContainer}>
          {user.loanCount > 0 ? (
            <>
              <Text style={styles.bannerText}>Quick Online Approval !</Text>
              <Image
                style={styles.bannerImg}
                source={require('../../../assets/images/home/banner1.png')}
              />
            </>
          ) : (
            <Image
              style={styles.bannerImg}
              source={require('../../../assets/images/home/banner0.png')}
            />
          )}
        </View>
        {Constants.CONTINUE_LOAN_TAG.includes(user.applyStatus) ? (
          <>
            <View style={styles.loanContainer}>
              <Text style={styles.loanTitle}>Start your application now!</Text>
              <View style={styles.loanInfo}>
                <Text style={styles.loanInfoLeft}>{I18n.t('prompt.loan.amount.label')}*</Text>
                <Text style={styles.loanInfoRight}>{applyAmount}PHP</Text>
              </View>
              <Slider
                minimumValue={minAmount}
                maximumValue={maxViewAmount}
                step={amountStep}
                value={applyDto.applyAmount}
                trackStyle={styles.track}
                minimumTrackTintColor="#00A24D"
                maximumTrackTintColor="#Ff5001"
                thumbStyle={styles.thumb}
                slot={
                  <View style={styles.innerSlot}>
                    <Image
                      style={styles.innerImg}
                      source={require('../../../assets/images/home/arrow_l.png')}
                    />
                    <Text style={styles.innerText}>{toThousands(applyAmount)}</Text>
                    <Image
                      style={styles.innerImg}
                      source={require('../../../assets/images/home/arrow_r.png')}
                    />
                  </View>
                }
                onSlidingComplete={value => {
                  this.setState({ applyDto: { ...this.state.applyDto, applyAmount: value } })
                  DA.setModify(`${PAGE_ID}_S_applyAmount`, value, this.state.applyDto.applyAmount)
                }}
              />
              <View style={styles.loanHint}>
                <Text style={styles.loanHintText}>{minAmount}</Text>
                {applyAmount > maxAmount && (
                  <View style={styles.loanHintWarnContainer}>
                    <View style={styles.loanHintWarn}>
                      <Text style={styles.loanHintWarnText}>
                        {I18n.t('prompt.loan.amount.warn', { amount: `${maxAmount}` })}
                      </Text>
                    </View>
                  </View>
                )}
                <Text style={styles.loanHintText}>{maxViewAmount}</Text>
              </View>
              <FloatingNormalPicker
                label="Loan Period"
                value={loanTerms}
                data={availableTerms}
                onValueChange={obj => {
                  this.setState({ applyDto: { ...this.state.applyDto, loanTerms: obj.code } })
                  DA.setModify(`${PAGE_ID}_S_loanTerms`, obj.code, this.state.applyDto.loanTerms)
                }}
              />
            </View>
            <View style={styles.agreementWrap}>
              <AgreeItem
                onChange={e => {
                  DA.setClickTime(`${PAGE_ID}_B_UserService`)
                  this.showAgreementModal(e.target.checked)
                }}
                checked={hasAgreeAgreement}>
                <Text style={styles.agreementText}>
                  By clicking Apply, you agree to SurityCash’s{' '}
                </Text>
                <Text
                  style={styles.agreementTextImg}
                  onPress={() => {
                    DA.setClickTime(`${PAGE_ID}_B_UserService`)
                    this.props.navigation.navigate('UserService', {
                      from: 'Index',
                    })
                  }}>
                  Service Agreement
                </Text>
              </AgreeItem>
              {showDisAgreeWarn && !hasAgreeAgreement && (
                <Text style={styles.agreementTextWarn}>{I18n.t('prompt.agreement.warn')}</Text>
              )}
            </View>
            <View style={styles.btnWrap}>
              <Button
                type="ghost"
                size="large"
                disabled={submitLoading || productLoading}
                title={I18n.t('common.apply.submit')}
                onPress={this.onBtnPress.bind(this)}
                loading={submitLoading}>
                {Constants.APPLY}
              </Button>
            </View>
            <View style={styles.companyWrap}>
              <Text style={styles.companyText}>
                SURITY CASH LENDING INVESTORS CORP. Company Registration No.CS201910185 Certificate
                of Authority No.3013
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.fakeBanner}>
              <Text style={styles.fakeBannerTitle}>Get instant loan up to</Text>
              <Text style={styles.fakeBannerAmountTitle}>
                {toThousands(maxViewAmount)}
                <Text style={styles.fakeBannerAmountUnit}>PHP</Text>
              </Text>
              <View style={styles.agreementWrap}>
                <AgreeItem
                  onChange={e => this.showAgreementModal(e.target.checked)}
                  checked={hasAgreeAgreement}>
                  <Text style={styles.agreementText}>
                    By clicking Apply, you agree to SurityCash's{' '}
                  </Text>
                  <Text
                    style={styles.agreementTextImg}
                    onPress={() => {
                      DA.setClickTime(`${PAGE_ID}_B_UserService`)
                      this.props.navigation.navigate('UserService', {
                        from: 'Index',
                      })
                    }}>
                    Service Agreement
                  </Text>
                </AgreeItem>
                {showDisAgreeWarn && !hasAgreeAgreement && (
                  <Text style={styles.agreementTextWarn}>{I18n.t('prompt.agreement.warn')}</Text>
                )}
              </View>
              <View style={styles.btnWrap}>
                <Button
                  type="primary"
                  size="large"
                  disabled={submitLoading || productLoading}
                  title={I18n.t('common.apply.submit')}
                  onPress={this.onBtnPress.bind(this)}
                  loading={submitLoading}>
                  {Constants.APPLY}
                </Button>
              </View>
              <View style={[styles.companyWrap, { paddingTop: 17 }]}>
                <Text style={styles.companyText}>
                  SURITY CASH LENDING INVESTORS CORP. Company Registration No.CS201910185
                  Certificate of Authority No.3013
                </Text>
              </View>
            </View>
          </>
        )}
        {LocationPermissionModalVisible && (
          <PermissionModal
            visible={true}
            title="Location"
            content={Constants.PermissionContent.location.content}
            hint={Constants.PermissionContent.location.hint}
            icon={require('../../../assets/images/permission/location.png')}
            onPress={this.requestLocation.bind(this)}
            onDenyPress={() => this.setState({ LocationPermissionModalVisible: false })}
          />
        )}
        {PhoneStatePermissionModalVisible && (
          <PermissionModal
            visible={true}
            title="Phone Information"
            content={Constants.PermissionContent.phone.content}
            hint={Constants.PermissionContent.phone.hint}
            onDenyPress={() => this.setState({ PhoneStatePermissionModalVisible: false })}
            icon={require('../../../assets/images/permission/device.png')}
            onPress={this.requestPhoneState.bind(this)}
          />
        )}
        {showSettingVisible && <OpenSettingModal onPress={this._openSetting.bind(this)} />}
        {showNotificationVisible && (
          <NotificationModal
            content={notification}
            onPress={() => this.setState({ showNotificationVisible: false })}
          />
        )}
        <View style={styles.slidesWrap}>
          <View style={styles.slidesTitleWrap}>
            <Text style={styles.slidesTitle}>Easy steps to get and pay for a loan:</Text>
          </View>
          <Swiper
            style={styles.wrapper}
            autoplay={true}
            autoplayTimeout={6}
            loop={true}
            showsPagination={true}
            dot={dot}
            height={234}
            activeDot={activeDot}>
            {Steps.map((item, index) => (
              <View style={styles.swiperWrap} key={index}>
                <Image
                  source={item.img}
                  resizeMode="cover"
                  style={[styles.swiperImg, styles[`swiperImg${index + 1}`]]}
                />
                <View style={styles.swiperTextIndexWrap}>
                  <Text style={styles.swiperTextIndex}>{index + 1}</Text>
                </View>
                <Text style={styles.swiperTextTitle}>{item.title}</Text>
                <Text style={styles.swiperTextSubtitle}>{item.subTitle}</Text>
              </View>
            ))}
          </Swiper>
        </View>
        <Sensors send={res => this.setState({ ...res })} />
      </ScrollView>
    )
  }
}

const Steps = [
  {
    title: 'Convenient operation',
    subTitle: 'Fill up information within 5 mins',
    img: require('../../../assets/images/home/slide1.png'),
  },
  {
    title: 'Fast Approval',
    subTitle: 'Verification finished within 2 hours',
    img: require('../../../assets/images/home/slide2.png'),
  },
  {
    title: 'Get the disbursement',
    subTitle: 'Disbursement within 24 hours',
    img: require('../../../assets/images/home/slide3.png'),
  },
]
