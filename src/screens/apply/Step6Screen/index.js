import React, { PureComponent } from 'react'
import { View, Image, ImageBackground } from 'react-native'
import { submit, getContract, updateAmount, prepareCalc } from '../../../services/apply'
import NavigationUtil from '../../../navigation/NavigationUtil'
import ContractModal from '../ConfirmScreen/agreementModal'
import currentStyle from './style'
import Homestyles from '../HomeScreen/style'
import FooterMessage from '../commonFooter'
import { Button, Checkbox, Toast, Portal } from '@ant-design/react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { ScrollView } from 'react-native-gesture-handler'
import { Text, Slider, Sensors, HeaderLeft, Form, BackPressComponent } from '../../../components'
import {
  errorCaptured,
  handleModel,
  I18n,
  Logger,
  Constants,
  toThousands,
  DA,
  uploadJPushInfo,
} from '../../../utils'
import { uploadContacts, uploadDevice, uploadAppsInfo, uploadPermission } from '../utils'
import appsFlyer from 'react-native-appsflyer'
import { AppEventsLogger } from 'react-native-fbsdk'
import StyleSheet from 'react-native-adaptive-stylesheet'
import Storage from 'react-native-expire-storage'

const { FloatingNormalPicker } = Form
const AgreeItem = Checkbox.AgreeItem
const PAGE_ID = 'P017'

export default class Step6Screen extends PureComponent {
  static navigationOptions = {
    headerTitle: () => (
      <Image
        width={44}
        height={44}
        style={{ width: 44, height: 44 }}
        source={require('../../../assets/images/common/SurityCash.png')}
      />
    ),
    headerLeft: <HeaderLeft route="Confirm" />,
  }
  constructor(props) {
    super(props)
    const { product } = this.props.navigation.state.params
    const { maxAmount, maxLoanTerms, loanTerms: availableLoanTerms } = product
    this.state = {
      hasAgreeContract: false,
      contractModalVisible: false,
      contractHtml: '',
      applyDto: {
        loanTerms: maxLoanTerms,
        applyAmount: maxAmount,
      },
      loanInfo: {
        applyAmount: maxAmount,
        repay: 'N/A',
        day: maxLoanTerms,
        endDate: 'N/A',
      },
      submitLoading: false,
      // 陀螺仪数据
      angleX: '0.0,0.0',
      angleY: '0.0,0.0',
      angleZ: '0.0,0.0',
      user: {},
      availableTerms: availableLoanTerms
        .filter(item => item.available)
        .map(item => {
          return {
            name: `${item.loanTerm}`,
            code: item.loanTerm,
          }
        }),
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }
  componentDidMount() {
    this._getModel()
    DA.setEnterPageTime(`${PAGE_ID}_Enter`)
    this.backPress.componentDidMount()
    const { applyAmount, loanTerms } = this.state.applyDto
    this.calc({ applyAmount, loanTerms })
  }
  componentWillUnmount() {
    DA.setLeavePageTime(`${PAGE_ID}_Leave`)
    this.backPress.componentWillUnmount()
  }
  onBackPress = async () => {
    NavigationUtil.goBack(this.props.navigation)
    return true
  }
  async _calc({ loanCode, productCode, applyAmount, loanTerms }) {
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
  async calc({ applyAmount, loanTerms }) {
    const { product } = this.props.navigation.state.params
    const { loanCode, productCode } = product
    // 1.试算
    this.setState({
      applyDto: { ...this.state.applyDto, applyAmount: applyAmount, loanTerms },
    })
    const [err, res] = await errorCaptured(() =>
      this._calc({
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
    const endDate = res.loanPmtDueDate
    this.setState({
      loanInfo: {
        applyAmount,
        endDate,
        repay: res.totalAmt,
        day: loanTerms,
        svcFee: res.svcFee,
        interest: res.interest,
      },
    })
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
  async _getModel() {
    const applyDto = JSON.parse(await AsyncStorage.getItem('applyDto'))
    const user = JSON.parse(await AsyncStorage.getItem('user'))
    // 不使用前面传过来的贷款金额和期限
    delete applyDto.applyAmount
    delete applyDto.loanTerms
    this.setState({ applyDto: { ...this.state.applyDto, ...applyDto }, user })
  }
  // 加载合同
  async _contract() {
    const key = Toast.loading(`${I18n.t('common.loading')}...`)
    const { applyDto } = this.state
    const { applyId } = applyDto
    const [err, res] = await errorCaptured(() => getContract({ params: { applyId } }))
    Portal.remove(key)
    if (err) {
      return
    }
    DA.setClickTime(`${PAGE_ID}_C_Contract`)
    this.setState({ contractHtml: res, contractModalVisible: true })
  }
  // 显示
  async showContractModal({
    bool,
    loanTerms,
    applyAmount,
    loanCode,
    productCode,
    maxAmount,
    maxLoanTerms,
  }) {
    if (bool) {
      // 如果未同意，先更新贷款金额/期限再显示合同弹窗
      await this._updateAmount({
        loanTerms,
        applyAmount,
        loanCode,
        productCode,
        maxAmount,
        maxLoanTerms,
      })
      await this._contract()
    } else {
      // 不同意合同
      DA.setClickTime(`${PAGE_ID}_C_Contract_Disagree`)
      this.setState({ hasAgreeContract: false })
    }
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
    this.setState({
      applyAmount,
      loanTerms,
    })
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
  // 不同意合同
  onDisagree() {
    DA.setClickTime(`${PAGE_ID}_C_Contract_Disagree`)
    this.setState({
      contractModalVisible: false,
      hasAgreeContract: false,
    })
  }
  // Note 同意并提交
  async onAgree() {
    DA.setClickTime(`${PAGE_ID}_C_Contract_Agree`)
    this.setState({ contractModalVisible: false, hasAgreeContract: true })
    const { product } = this.props.navigation.state.params
    const { maxAmount, productCode, loanCode } = product
    const {
      applyDto: { applyId, phone, applyAmount, loanTerms },
    } = this.state
    const data = {
      currentStep: 6,
      totalSteps: 6,
      complete: 'Y',
      applyId,
      phone,
      loanCode,
      maxApplyAmount: maxAmount,
      productCode,
      applyAmount,
      loanTerms,
    }
    this._submit(data)
  }
  _submit = async data => {
    DA.setClickTime(`${PAGE_ID}_B_SUBMIT`)
    // 处理数据
    const { applyId } = data
    const { user } = this.state
    appsFlyer.trackEvent('09_event_first_Choose_period_sign', {
      user_id: user.userId,
      '09_event_first_Choose_period_sign': `${applyId}`,
    })
    AppEventsLogger.logEvent('09_event_first_Choose_period_sign')
    this.setState({ submitLoading: true })
    // Todo 提交其他信息
    const [err, res] = await errorCaptured(() => submit({ data: handleModel(data) }))
    this.setState({ submitLoading: false })
    if (err) {
      return
    }
    DA.setModify(`${PAGE_ID}_angleX`, this.state.angleX)
    DA.setModify(`${PAGE_ID}_angleY`, this.state.angleY)
    DA.setModify(`${PAGE_ID}_angleZ`, this.state.angleZ)
    DA.send(PAGE_ID)
    const {
      applyDto: { phone, idcard },
      angleX,
      angleY,
      angleZ,
    } = this.state
    uploadContacts({ applyId, phone }).then(() => {
      Storage.removeItem('contacts')
      Storage.removeItem('contactLog')
    })
    uploadPermission({ applyId, phone, idcard })
    uploadDevice({
      applyId,
      phone,
      anglex: angleX,
      angley: angleY,
      anglez: angleZ,
      idcard,
    })
    uploadAppsInfo(applyId)
    Promise.all([
      AsyncStorage.setItem('accessToken', res.accessToken),
      AsyncStorage.removeItem('applyDto'),
      // 清除活体校验相关的缓存数据
      AsyncStorage.removeItem('selfId'),
      AsyncStorage.removeItem('livenessId'),
      AsyncStorage.removeItem('liveFailedNum'),
      AsyncStorage.removeItem('base64Image_liveness'),
    ])
      .then(() => {
        uploadJPushInfo(user)
        AsyncStorage.removeItem('applyId')
        appsFlyer.trackEvent('08_event_first_loan_success', {
          user_id: user.userId,
          '08_event_first_loan_success': `${applyId}`,
        })
        AppEventsLogger.logEvent('08_event_first_loan_success')
        NavigationUtil.goPage('Done', { applyId })
      })
      .catch(e => Logger.error(e))
  }
  onModifySubmit = async ({ loanTerms, applyAmount }) => {
    const { applyDto, hasAgreeContract } = this.state
    const { product } = this.props.navigation.state.params
    const { applyId, phone } = applyDto
    const { maxAmount, productCode, loanCode } = product
    if (!hasAgreeContract) {
      // 未同意合同，弹合同弹窗
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
      this._submit({
        currentStep: 6,
        totalSteps: 6,
        complete: 'Y',
        applyId,
        phone,
        loanCode,
        maxApplyAmount: maxAmount,
        productCode,
        applyAmount,
        loanTerms,
      })
    }
  }

  render() {
    const {
      hasAgreeContract,
      contractModalVisible,
      applyDto,
      submitLoading,
      contractHtml,
      availableTerms,
      loanInfo,
    } = this.state
    let { loanTerms, applyAmount } = applyDto
    const { product, code } = this.props.navigation.state.params
    const { repay, svcFee, interest } = loanInfo
    Logger.log('step6Screen', { loanTerms, applyAmount, product, code, loanInfo })
    const {
      minAmount,
      maxViewAmount,
      amountStep,
      maxAmount,
      maxLoanTerms,
      loanCode,
      productCode,
    } = product
    return (
      <ScrollView style={currentStyle.container}>
        <View style={currentStyle.titleView}>
          <Text style={currentStyle.title}>
            {code === '128'
              ? 'Congrats! You can apply for bigger loan amount/ longer loan term now.'
              : 'Considering your personal credit situation Pls select the Loanable amount again.'}
          </Text>
        </View>
        <View style={currentStyle.content}>
          <View style={Homestyles.loanInfo}>
            <Text style={Homestyles.loanInfoLeft}>{I18n.t('prompt.loan.amount.label')}*</Text>
            <Text style={Homestyles.loanInfoRight}>{toThousands(applyAmount)} PHP</Text>
          </View>
          <Slider
            minimumValue={minAmount}
            maximumValue={maxViewAmount}
            step={amountStep}
            value={applyAmount}
            trackStyle={Homestyles.track}
            minimumTrackTintColor="#00A24D"
            maximumTrackTintColor="#Ff5001"
            thumbStyle={Homestyles.thumb}
            slot={
              <View style={Homestyles.innerSlot}>
                <Image
                  style={Homestyles.innerImg}
                  source={require('../../../assets/images/home/arrow_l.png')}
                />
                <Text style={Homestyles.innerText}>{toThousands(applyAmount)}</Text>
                <Image
                  style={Homestyles.innerImg}
                  source={require('../../../assets/images/home/arrow_r.png')}
                />
              </View>
            }
            onSlidingComplete={value => {
              const { loanTerms: _loanTerms } = this.state.applyDto
              this.setState({
                applyDto: { ...this.state.applyDto, applyAmount: value },
                hasAgreeContract: false, // 期限变化，合同状态调整
              })
              this.calc({ applyAmount: value, loanTerms: _loanTerms })
              DA.setModify(`${PAGE_ID}_S_applyAmount`, value, this.state.applyDto.applyAmount)
            }}
          />
          <View style={Homestyles.loanHint}>
            <Text style={Homestyles.loanHintText}>{minAmount}</Text>
            {applyAmount > maxAmount && (
              <View style={Homestyles.loanHintWarnContainer}>
                <View style={Homestyles.loanHintWarn}>
                  <Text style={Homestyles.loanHintWarnText}>
                    {I18n.t('prompt.loan.amount.warn', { amount: `${maxAmount}` })}
                  </Text>
                </View>
              </View>
            )}
            <Text style={Homestyles.loanHintText}>{maxViewAmount}</Text>
          </View>
          <FloatingNormalPicker
            label="Loan Period"
            value={loanTerms}
            name={`${loanTerms} ${Constants.DAYS}`}
            data={availableTerms}
            onValueChange={obj => {
              const { applyAmount: _applyAmount } = this.state.applyDto
              this.setState({
                applyDto: { ...this.state.applyDto, loanTerms: obj.code },
                hasAgreeContract: false, // 期限变化，合同状态调整
              })
              this.calc({ applyAmount: _applyAmount, loanTerms: obj.code })
              DA.setModify(`${PAGE_ID}_S_loanTerms`, obj.code, this.state.applyDto.loanTerms)
            }}
          />
          <View style={styles.loanInfo}>
            <View style={styles.titleView}>
              <Text style={styles.title}>Compute the repayment amount</Text>
            </View>
            <View style={styles.item}>
              <View style={styles.itemView}>
                <Text style={styles.itemTextLeft}>Loan Term</Text>
                <Text style={styles.itemTextRight}>{loanTerms} Days</Text>
              </View>
              <View style={styles.itemView}>
                <Text style={styles.itemTextLeft}>Loan Amount</Text>
                <Text style={styles.itemTextRight}>₱ {toThousands(applyAmount)}</Text>
              </View>
              <View style={styles.itemView}>
                <Text style={styles.itemTextLeft}>Interest</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.itemTextRight}>₱ {toThousands(interest)}</Text>
                  {interest === 0 && (
                    <ImageBackground
                      source={require('../../../assets/images/home/tag.png')}
                      style={{
                        marginLeft: 3,
                        width: 26.35,
                        height: 14,
                        paddingLeft: 5,
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{ fontSize: 9, color: '#FFFFFF', fontFamily: 'ArialRoundedMTBold' }}>
                        Free
                      </Text>
                    </ImageBackground>
                  )}
                </View>
              </View>
              <View style={styles.itemView}>
                <Text style={styles.itemTextLeft}>Service Fee</Text>
                <Text style={styles.itemTextRight}>₱ {toThousands(svcFee)}</Text>
              </View>
              <View style={styles.itemView}>
                <Text style={[styles.itemTextLeft, { fontSize: 13 }]}>Total Repayment Amount</Text>
                <Text style={styles.itemTextRight}>₱ {toThousands(repay)}</Text>
              </View>
            </View>
          </View>
          <View style={currentStyle.paddingTop20}>
            <AgreeItem
              onChange={e =>
                this.showContractModal({
                  bool: e.target.checked,
                  loanTerms,
                  applyAmount,
                  loanCode,
                  productCode,
                  maxAmount,
                  maxLoanTerms,
                })
              }
              checked={hasAgreeContract}>
              <Text style={currentStyle.agreeContact1}>
                By clicking Confirm, you agree to the attached
              </Text>{' '}
              <Text
                style={currentStyle.agreeContact2}
                onPress={() =>
                  this.showContractModal({
                    bool: true,
                    loanTerms,
                    applyAmount,
                    loanCode,
                    productCode,
                    maxAmount,
                    maxLoanTerms,
                  })
                }>
                Loan Agreement
              </Text>{' '}
              <Text style={currentStyle.agreeContact1}>of SurityCash.</Text>
            </AgreeItem>
            {!hasAgreeContract && (
              <Text style={currentStyle.agreeContactWarn}>{I18n.t('prompt.agreement.warn')}</Text>
            )}
          </View>
          <View style={currentStyle.btnWrap}>
            <Button
              type="ghost"
              size="large"
              onPress={() => {
                if (applyAmount > maxAmount) {
                  applyAmount = maxAmount
                }
                if (loanTerms > maxLoanTerms) {
                  loanTerms = maxLoanTerms
                }
                this.onModifySubmit({ loanTerms, applyAmount })
              }}
              title={I18n.t('prompt.amountModify.confirm')}
              disabled={submitLoading}
              loading={submitLoading}
              style={currentStyle.buttonStyle}>
              {I18n.t('prompt.amountModify.confirm')}
            </Button>
          </View>
        </View>
        <FooterMessage />
        <ContractModal
          visible={contractModalVisible}
          uri={contractHtml}
          onDisagree={this.onDisagree.bind(this)}
          onAgree={this.onAgree.bind(this)}
        />
        <Sensors send={res => this.setState({ ...res })} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  loanInfo: {
    paddingVertical: 18,
  },
  titleView: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  title: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 13,
    color: '#00A24D',
  },
  item: {
    borderWidth: 1,
    borderColor: '#F8F8F8',
    borderRadius: 5,
    paddingHorizontal: 30.5,
    paddingTop: 21.5,
    paddingBottom: 26.5,
    backgroundColor: '#FFFFFF',
    height: 155,
    justifyContent: 'space-between',
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextLeft: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 11,
    color: '#454545',
  },
  itemTextRight: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 11,
    color: '#454545',
  },
})
