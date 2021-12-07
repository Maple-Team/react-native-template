import React, { PureComponent } from 'react'
import { View } from 'react-native'
import Form from './form'
import {
  dict,
  needWuka,
  authType,
  submit,
  getContract,
  updateAmount,
} from '../../../services/apply'
import NavigationUtil from '../../../navigation/NavigationUtil'
import {
  LoanInfo,
  LoanStep,
  LoanPotential,
  Sensors,
  Text,
  BackPressComponent,
  Chat,
} from '../../../components'
import { PageStyles, FormStyles } from '../../../styles'
import ContractModal from './agreementModal'
import AdjustModal from './adjustPopup'
import {
  DA,
  handleModel,
  Logger,
  I18n,
  errorCaptured,
  Constants,
  uploadJPushInfo,
} from '../../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Toast, Portal } from '@ant-design/react-native'
import FooterMessage from '../commonFooter'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { uploadContacts, uploadDevice, uploadAppsInfo, uploadPermission } from '../utils'
import appsFlyer from 'react-native-appsflyer'
import { AppEventsLogger } from 'react-native-fbsdk'
import ExampleModal from './modal'
import Storage from 'react-native-expire-storage'
const PAGE_ID = 'P06'

export default class ConfirmScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Step5',
      headerLeft: (
        <EvilIcons
          name="chevron-left"
          size={40}
          color="#00A24D"
          onPress={async () => navigation.goBack()}
        />
      ),
      headerRight: <Chat />,
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      bankCodeEnum: [],
      payOrgEnum: [],
      isNeedWuka: true,
      authType: 'SMS',
      applyDto: {},
      amountStatus: '',
      contractModalVisible: false, // 合同弹窗是否可见
      amountAdjustVisible: false, // 额度调整弹窗是否可见
      hasAgreeContract: false, // 是否同意了合同
      amountAdjustMsg: '', // 额度调整信息
      canDirectSubmit: false, // 直接提交合同标记
      contractHtml: '', // 合同地址
      sliderData: {}, // 调整额度相关
      // 陀螺仪数据
      angleX: '0.0,0.0',
      angleY: '0.0,0.0',
      angleZ: '0.0,0.0',
      user: {},
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }
  componentDidMount() {
    this._needWuka()
    this._getAuthType()
    this.initData()
    this.backPress.componentDidMount()
    DA.setEnterPageTime(`${PAGE_ID}_Enter`)
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
    DA.setLeavePageTime(`${PAGE_ID}_Leave`)
  }
  onBackPress = async () => {
    const { amountAdjustVisible } = this.state
    if (!amountAdjustVisible) {
      NavigationUtil.goBack(this.props.navigation)
    }
    return true
  }
  async initData() {
    const [applyDto, user, bankCodeEnum, payOrgEnum] = await Promise.all([
      AsyncStorage.getItem('applyDto'),
      AsyncStorage.getItem('user'),
      dict('BANK'),
      dict('PAY_ORG'),
    ]).catch(e => Logger.error(e))
    const _applyDto = JSON.parse(applyDto)
    Logger.info('confirm缓存', _applyDto)
    this.setState({
      applyDto: { ...this.state.applyDto, ..._applyDto },
      bankCodeEnum,
      payOrgEnum,
      user: JSON.parse(user),
    })
  }
  async _needWuka() {
    let [err, res] = await errorCaptured(needWuka)
    if (!err) {
      this.setState({ isNeedWuka: res === 'Y' })
    }
  }
  async _getAuthType() {
    let [err, res] = await errorCaptured(() => authType({ params: { type: 'register' } }))
    if (!err) {
      this.setState({ authType: res })
    }
  }
  // 加载合同
  async _contract() {
    DA.setClickTime(`${PAGE_ID}_B_CONTRACT`)
    const key = Toast.loading(`${I18n.t('common.loading')}...`)
    const {
      applyDto: { applyId },
    } = this.state
    const [err, res] = await errorCaptured(() => getContract({ params: { applyId } }))
    Portal.remove(key)
    if (err) {
      return
    }
    this.setState({ contractHtml: res, contractModalVisible: true })
  }
  // Note 更新贷款金额期限
  async _updateAmount({ loanTerms, applyAmount, loanCode, productCode, maxAmount, maxLoanTerms }) {
    const { applyDto } = this.state
    const { applyId } = applyDto
    // 校正金额
    if (applyAmount > maxAmount) {
      applyAmount = maxAmount
    }
    if (loanTerms > maxLoanTerms) {
      loanTerms = maxLoanTerms
    }
    this.setState({ applyAmount, loanTerms })
    await errorCaptured(() =>
      updateAmount({
        data: {
          applyAmount,
          loanTerms,
          applyId,
          loanCode,
          productCode,
        },
      })
    )
  }
  // 是否显示合同弹窗
  async showContractModal({
    isShow,
    loanTerms,
    applyAmount,
    loanCode,
    productCode,
    maxAmount,
    maxLoanTerms,
  }) {
    if (isShow) {
      // 如果未同意，显示合同弹窗
      if (loanTerms) {
        await this._updateAmount({
          loanTerms,
          applyAmount,
          loanCode,
          productCode,
          maxAmount,
          maxLoanTerms,
        })
      }
      await this._contract()
    } else {
      // 不同意合同
      this.setState({ hasAgreeContract: false })
    }
  }
  // Note 不提额度提交，使用首页选择的额度
  // //不用判断是否同意过合同
  _onNoModifySubmit = async () => {
    const { data, sliderData, applyDto, hasAgreeContract } = this.state
    this.setState({ amountAdjustVisible: false })
    const { applyAmount, loanTerms } = applyDto
    const { maxAmount, productCode, loanCode } = sliderData
    // TODO 未同意合同先同意合同？
    if (!hasAgreeContract) {
      await this._contract()
    } else {
      await this._submit({
        ...data,
        loanCode,
        maxApplyAmount: maxAmount,
        productCode,
        applyAmount,
        loanTerms,
      })
    }
  }
  // Note 调额度确认按钮事件
  _onModifySubmit = async ({ loanTerms, applyAmount, loanCode, productCode }) => {
    const {
      applyDto: { applyId },
      hasAgreeContract,
    } = this.state
    this.setState({
      canDirectSubmit: true, // 点击同意可立即提交
    })
    if (!hasAgreeContract) {
      await errorCaptured(() =>
        updateAmount({
          data: {
            applyAmount,
            loanTerms,
            applyId,
            loanCode,
            productCode,
          },
        })
      )
      await this._contract()
    } else {
      this.setState({
        amountAdjustVisible: false,
      })
      const {
        data,
        sliderData: { maxAmount },
      } = this.state
      this._submit({ ...data, maxApplyAmount: maxAmount })
    }
  }
  // Note 不同意合同,调整金额弹窗状态不变
  onDisagree() {
    DA.setClickTime(`${PAGE_ID}_C_Contract_Disagree`)
    this.setState({
      contractModalVisible: false,
      hasAgreeContract: false,
      amountAdjustVisible: this.state.amountAdjustVisible,
    })
  }
  // Note 同意合同
  async onAgree(canDirectSubmit) {
    DA.setClickTime(`${PAGE_ID}_C_Contract_Agree`)
    if (canDirectSubmit) {
      //可直接提交
      this.setState({
        contractModalVisible: false,
        hasAgreeContract: true,
        amountAdjustVisible: false,
      })

      const {
        data,
        sliderData: { maxAmount },
      } = this.state
      this._submit({ ...data, maxApplyAmount: maxAmount })
    } else {
      this.setState({ contractModalVisible: false, hasAgreeContract: true })
    }
  }
  // Note 最终提交
  _submit = async data => {
    DA.setClickTime(`${PAGE_ID}_B_SUBMIT`)
    const { user, applyDto } = this.state
    if (Constants.CONTINUE_LOAN_TAG.includes(user.applyStatus)) {
      appsFlyer.trackEvent('07_event_continue_sign', {
        user_id: user.userId,
        '07_event_continue_sign': `${applyDto.applyId}`,
      })
      AppEventsLogger.logEvent('07_event_continue_sign')
    }
    // 处理数据
    const { applyId } = data
    let { idcard, phone } = user
    idcard = idcard || applyDto.idcard
    this.setState({ submitLoading: true })
    Logger.log('handleModel(data)', handleModel(data))
    // this.setState({ submitLoading: false })
    // return
    const [err, res] = await errorCaptured(() => submit({ data: handleModel(data) }))
    this.setState({ submitLoading: false })
    if (err) {
      const { status, body, code } = err
      if (code) {
        return
      }
      const { code: _code, msg, msgCn } = status
      if (_code === '128' || _code === '127') {
        if (!Constants.CONTINUE_LOAN_TAG.includes(user.applyStatus)) {
          DA.send(PAGE_ID)
          appsFlyer.trackEvent('06_event_pay_info', {
            user_id: user.userId,
            '06_event_pay_info': `${applyId}`,
          })
          AppEventsLogger.logEvent('06_event_pay_info')
          const _applyDto = await AsyncStorage.getItem('applyDto')
          const string = JSON.stringify({ ...JSON.parse(_applyDto), ...data })
          AsyncStorage.setItem('applyDto', string)
          // 首贷用户去选金额和期限
          NavigationUtil.goPage('Step6', { code: _code, product: body.product })
        } else {
          // 续贷用户调整金额
          if (_code === '127') {
            //降额一定为false
            this.setState({
              hasAgreeContract: false,
            })
          }
          this.setState({
            amountAdjustVisible: true,
            amountStatus: _code,
            amountAdjustMsg: __DEV__ ? msgCn : msg,
            sliderData: body.product,
          })
          return
        }
      }
    } else {
      uploadContacts({ applyId, phone }).then(() => {
        Storage.removeItem('contacts')
        Storage.removeItem('contactLog')
      })
      uploadPermission({ applyId, phone, idcard })
      uploadDevice({
        applyId,
        phone,
        anglex: this.state.angleX,
        angley: this.state.angleY,
        anglez: this.state.angleZ,
        idcard,
      })
      uploadAppsInfo(applyId)
      DA.setModify(`${PAGE_ID}_angleX`, this.state.angleX)
      DA.setModify(`${PAGE_ID}_angleY`, this.state.angleY)
      DA.setModify(`${PAGE_ID}_angleZ`, this.state.angleZ)
      appsFlyer.trackEvent('09_event_loan_success', {
        user_id: user.userId,
        '09_event_loan_success': `${applyId}`,
      })
      AppEventsLogger.logEvent('09_event_loan_success')
      Promise.all([
        DA.send(PAGE_ID),
        AsyncStorage.setItem('accessToken', res.accessToken),
        AsyncStorage.removeItem('applyDto'),
        // 清除活体校验相关的缓存数据
        AsyncStorage.removeItem('selfId'),
        AsyncStorage.removeItem('livenessId'),
        AsyncStorage.removeItem('liveFailedNum'),
        AsyncStorage.removeItem('base64Image_liveness'),
      ])
        .then(() => {
          // todo 上传通讯录/设备信息
          AsyncStorage.removeItem('applyId')
          uploadJPushInfo(user)
          NavigationUtil.goPage('Done', { applyId })
        })
        .catch(e => Logger.error(e))
    }
  }
  // Note 页面提交按钮事件
  onOk = async formObj => {
    const { hasAgreeContract, applyDto, user } = this.state
    // Note 首贷点击提交不在这个页面校验合同
    if (Constants.CONTINUE_LOAN_TAG.includes(user.applyStatus)) {
      if (!hasAgreeContract) {
        await this._contract()
        return
      }
    }
    const { applyId, phone } = applyDto
    const data = {
      ...formObj,
      currentStep: 6,
      totalSteps: 6,
      complete: 'Y',
      applyId,
      phone,
    }
    this.setState({ data }) // Note 存储填写的支付信息
    this._submit(data)
  }
  render() {
    const {
      bankCodeEnum,
      payOrgEnum,
      applyDto,
      isNeedWuka,
      contractModalVisible,
      exampleVisible, // 示例弹窗
      // authType,
      submitLoading,
      amountStatus,
      amountAdjustVisible,
      amountAdjustMsg,
      hasAgreeContract,
      contractHtml,
      sliderData,
      canDirectSubmit,
      user,
    } = this.state
    const { applyStatus } = user
    const TAG = Constants.CONTINUE_LOAN_TAG.includes(applyStatus)
    return (
      <>
        <KeyboardAwareScrollView style={PageStyles.container}>
          {TAG && <LoanInfo />}
          {!TAG && <LoanPotential progress={100} />}
          <View
            style={[
              PageStyles.formContainer,
              // eslint-disable-next-line react-native/no-inline-styles
              TAG && {
                paddingTop: 0,
                marginTop: 24.5,
              },
            ]}>
            {!TAG && <LoanStep total={5} current={5} />}
            <Text style={FormStyles.title}>{TAG ? 'Payment Method' : 'Payment Option'}</Text>
            <Form
              onOk={this.onOk.bind(this)}
              bankCodeEnum={bankCodeEnum}
              payOrgEnum={payOrgEnum}
              pid={PAGE_ID}
              phone={applyDto.phone}
              name={applyDto.name}
              isNeedWuka={isNeedWuka}
              // authType={authType}
              item={applyDto}
              applyStatus={applyStatus}
              submitLoading={submitLoading}
              hasAgreeContract={hasAgreeContract}
              showAgreementModal={this.showContractModal.bind(this)}
              onExampleOpen={() => this.setState({ exampleVisible: true })}
              needWorkPicCheck={!TAG}
            />
          </View>
          <FooterMessage />
        </KeyboardAwareScrollView>
        {contractModalVisible && (
          <ContractModal
            visible={true}
            uri={contractHtml}
            onDisagree={this.onDisagree.bind(this)}
            onAgree={this.onAgree.bind(this)}
            canDirectSubmit={canDirectSubmit}
          />
        )}
        {amountAdjustVisible && (
          <AdjustModal
            visible={true}
            status={amountStatus}
            msg={amountAdjustMsg}
            sliderData={sliderData}
            onNoModifySubmit={this._onNoModifySubmit.bind(this)}
            onModifySubmit={this._onModifySubmit.bind(this)}
            hasAgreeContract={hasAgreeContract}
            showAgreementModal={this.showContractModal.bind(this)}
            onChangeContract={() =>
              this.setState({
                hasAgreeContract: false,
              })
            }
          />
        )}
        {exampleVisible && (
          <ExampleModal visible={true} onClose={() => this.setState({ exampleVisible: false })} />
        )}
        <Sensors send={res => this.setState({ ...res })} />
      </>
    )
  }
}
