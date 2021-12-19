import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Image } from 'react-native'
import { Button, Checkbox } from '@ant-design/react-native'
import { createForm } from 'rc-form'
import { errorCaptured } from '../../../utils/request'
import { payFee } from '../../../services/apply'
import { Form, Text, PhotoPicker } from '../../../components'
import { DA, I18n, Logger, Constants } from '../../../utils'
import __ from 'lodash'
import styles from './style'
import CashModal from './cashTypeModal'
import { FormStyles } from '../../../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'

const AgreeItem = Checkbox.AgreeItem
const { FloatingNormalPicker, FloatingInput } = Form
class App extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    const { item, bankCodeEnum, payOrgEnum } = props
    const { payOrg, bankCode, dFee } = item
    Logger.log({ item })
    const onlinePay = payOrg ? 'N' : 'Y' // Note 存在payOrg的情况
    this.state = {
      onlinePay,
      dFee,
      bankName: (bankCodeEnum.find(_item => _item.code === bankCode) || {}).name,
      cashModalVisible: false, // 无卡弹窗切换选项
      payOrgName: (payOrgEnum.find(_item => _item.code === payOrg) || {}).name,
      CashTypes: cashTypes.map(_item => {
        if (_item.value === onlinePay) {
          return { ..._item, isChecked: true }
        } else {
          return { ..._item, isChecked: false }
        }
      }),
    }
  }
  // 确认提交
  submit = () => {
    const { form, onOk, needWorkPicCheck } = this.props
    const { onlinePay, dFee } = this.state
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      Object.keys(values).forEach(prop => {
        values[prop] = __.trim(values[prop])
      })
      values.onlinePay = onlinePay
      if (onlinePay === 'N') {
        values.dFee = dFee
        if (needWorkPicCheck) {
          values.images = [+values.wId]
        }
      }
      onOk(values)
    })
  }
  // 银行卡支付点击事件
  onCashRadioPress(key) {
    const { onlinePay, CashTypes } = this.state
    const { pid } = this.props
    // Note 点击当前选选中的无响应
    if (onlinePay === CashTypes[key].value) {
      return
    }
    const _new = key === 1 ? 'N' : 'Y'
    DA.setModify(`${pid}_R_OnlinePay`, _new, onlinePay)
    let _CashTypes = CashTypes.map((applyDto, index) => {
      if (key === index) {
        return { ...applyDto, isChecked: true }
      } else {
        return { ...applyDto, isChecked: false }
      }
    })
    // Note 清空之前的填写的银行卡名称和账号
    this.setState({
      CashTypes: _CashTypes,
      onlinePay: key === 1 ? 'N' : 'Y',
      cashModalVisible: key === 1,
      payOrgName: null,
      bankName: null,
      dFee: 0,
    })
  }
  // Note modal点击切换到现金领取
  handleOrgPay(key) {
    const CashTypes = this.state.CashTypes.map((_item, index) => {
      if (key === index) {
        return { ..._item, isChecked: true }
      } else {
        return { ..._item, isChecked: false }
      }
    })
    const { pid } = this.props
    const onlinePay = key === 1 ? 'N' : 'Y'
    if (key === 0) {
      const _old = 'N'
      DA.setModify(`${pid}_R_OnlinePay`, onlinePay, _old)
    }
    Logger.log({ key, onlinePay })
    this.setState({
      CashTypes,
      onlinePay,
      cashModalVisible: false,
      payOrgName: null,
      bankName: null,
      dFee: 0,
    })
  }
  // 获取费用接口
  async payFee(payOrg) {
    const { applyAmount, applyId, pid } = this.props.item
    const [err, res] = await errorCaptured(() =>
      payFee({
        params: {
          payOrg,
          amount: applyAmount, // 首贷无申请金额
          applyId,
        },
      })
    )
    if (!err) {
      DA.setModify(`${pid}_S_dFee`, res, this.state.dFee)
      this.setState({
        dFee: `₱${res}`,
      })
    }
  }
  // 选择银行名称
  onBankCodeChange = obj => {
    const { name, code } = obj
    this.setState({ bankName: name })
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    DA.setModify(`${pid}_C_bankCode`, code, getFieldValue('bankCode'))
    setFieldsValue({ bankCode: code })
  }
  // 选择机构名称
  onPayOrgChange = obj => {
    const { name, code } = obj
    this.setState({ payOrgName: name })
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    DA.setModify(`${pid}_C_payOrg`, code, getFieldValue('payOrg'))
    setFieldsValue({ payOrg: code })
    if (code) {
      this.payFee(code)
    }
  }
  // 银行卡号获得焦点
  _onBankCardNoFocus = () => {
    const { pid, form } = this.props
    const { getFieldValue } = form
    DA.setStartModify(`${pid}_I_bankCardNo`, getFieldValue('bankCardNo'))
  }
  // 银行卡号输入框失焦
  _onBankCardNoBlur = () => {
    const { pid, form } = this.props
    const { getFieldValue } = form
    DA.setEndModify(`${pid}_I_bankCardNo`, getFieldValue('bankCardNo'))
  }
  // 监听银行卡号输入框
  _onBankCardNoChange = value => {
    const { form } = this.props
    const { setFieldsValue } = form
    setFieldsValue({ bankCardNo: value })
  }
  // 验证银行卡号
  getValidateInfo(cardNo, bank) {
    const validateInfo = {
      pattern: /^[0-9]{10,16}$/,
      message: '请输入正确格式的银行账号！',
    }
    // China Bank 校验6开头
    if (bank === 'China Bank' && /^6/.test(cardNo)) {
      validateInfo.message =
        'China Bank Saving is not supported, pls select another bank or offline cash pickup.'
      return validateInfo
    }
    switch (bank) {
      case 'BDO(Banco De Oro)':
      case 'China Bank':
        // 10或12位
        validateInfo.pattern = /^([0-9]{10}|[0-9]{12})$/
        validateInfo.message = 'Please input 10 or 12 digits'
        break
      case 'BPI':
      case 'Land Bank':
        // 10位
        validateInfo.pattern = /^[0-9]{10}$/
        validateInfo.message = 'Please input 10 digits'
        break
      case 'BFB':
        // 10位 (第一位为5,6,7)
        validateInfo.pattern = /^[5,6,7][0-9]{9}$/
        validateInfo.message = 'Please input 10 digits and the first digits are 5 or 6 or 7'
        break
      case 'Metro Bank':
      case 'Security Bank':
        // 13位
        validateInfo.pattern = /^[0-9]{13}$/
        validateInfo.message = 'Please input 13 digits'
        break
      case 'RCBC':
        // 10或16位
        validateInfo.pattern = /^([0-9]{10}|[0-9]{16})$/
        validateInfo.message = 'Please input 10 or 16 digits'
        break
      case 'UCPB':
      case 'Union Bank':
      case 'Eastwest Bank':
      case 'PNB':
      case 'AUB':
        // 12位
        validateInfo.pattern = /^[0-9]{12}$/
        validateInfo.message = 'Please input 12 digits'
        break
      default:
        break
    }
    return validateInfo
  }
  componentWillUnmount() {
    Logger.log('[ConfirmScreen Form] componentWillUnmount')
  }
  onWorkIdUploadSuccess = (id, cb) => {
    Logger.log('onWorkIdUploadSuccess', id)
    const { setFieldsValue } = this.props.form
    setFieldsValue({ wId: id })
    cb && cb()
  }
  reportExif = value => {
    const { pid } = this.props
    Logger.log(this.state)
    const oldExif = this.state.WORK_ID_EXIF
    this.setState({
      WORK_ID_EXIF: value,
    })
    DA.setModify(`${pid}_I_WORK_ID_EXIF`, value, oldExif)
  }
  render() {
    const {
      pid,
      bankCodeEnum,
      payOrgEnum,
      name,
      showAgreementModal,
      form,
      item,
      submitLoading,
      hasAgreeContract, // 是否同意过合同
      isNeedWuka,
      applyStatus, // 申请状态
      onExampleOpen,
      needWorkPicCheck,
    } = this.props
    const { getFieldDecorator, getFieldError, getFieldValue } = form
    const { bankCode, bankCardNo } = item
    const { dFee, bankName, payOrgName, CashTypes, cashModalVisible, onlinePay } = this.state
    // 更新校验信息
    const validateInfo = this.getValidateInfo(
      getFieldValue('bankCardNo') || bankCardNo,
      getFieldValue('bankCode') || bankCode
    )
    return (
      <>
        {isNeedWuka && (
          <>
            <View style={styles.radioContainer}>
              {CashTypes.map((_item, index) => (
                <View
                  key={index}
                  style={[
                    styles.radioItem,
                    _item.isChecked && styles.radioCheckedItem,
                    index === 0 ? styles.radioLeftItem : styles.radioRightItem,
                  ]}>
                  <Text
                    style={[styles.radioText, _item.isChecked && styles.radioCheckedText]}
                    onPress={() => this.onCashRadioPress(index)}>
                    {_item.text}
                  </Text>
                </View>
              ))}
            </View>
            <CashModal
              visible={cashModalVisible}
              onClose={() => this.setState({ cashModalVisible: false })}
              showOrgPay={this.handleOrgPay.bind(this)}
            />
          </>
        )}
        <View style={styles.container}>
          <View style={FormStyles.formitemGap}>
            <FloatingInput label={I18n.t('User.name.label')} editable={false} value={name} />
          </View>
          {onlinePay === 'Y' ? (
            <>
              <View style={FormStyles.formitemGap}>
                {getFieldDecorator('bankCode', {
                  initialValue: item.bankCode,
                  rules: [{ required: true, message: I18n.t('User.bankName.required') }],
                })(
                  <FloatingNormalPicker
                    label={I18n.t('User.bankName.label')}
                    onValueChange={this.onBankCodeChange}
                    error={getFieldError('bankCode')}
                    data={bankCodeEnum}
                    name={bankName}
                  />
                )}
              </View>
              <Text style={styles.orgTopInfo}>Notice:Don't input the 16 digits of Card number</Text>
              <View style={FormStyles.formitemGap}>
                {getFieldDecorator('bankCardNo', {
                  initialValue: item.bankCardNo,
                  rules: [
                    { required: true, message: I18n.t('User.bankCardNo.required') },
                    {
                      pattern: validateInfo.pattern,
                      message: validateInfo.message,
                    },
                  ],
                })(
                  <FloatingInput
                    label={I18n.t('User.bankCardNo.label')}
                    maxLength={19}
                    type="number"
                    error={getFieldError('bankCardNo')}
                    onFocus={this._onBankCardNoFocus}
                    onBlur={this._onBankCardNoBlur}
                    onChangeText={this._onBankCardNoChange}
                  />
                )}
              </View>
            </>
          ) : (
            <>
              {needWorkPicCheck && (
                <View style={styles.workidcardContainer}>
                  <View style={styles.workidcardHeader}>
                    <Text style={styles.worktitle}>Image of company ID</Text>
                    <TouchableOpacity onPress={onExampleOpen}>
                      <Text style={styles.example}>{I18n.t('common.example')}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.workContent}>
                    {getFieldDecorator('wId', {
                      initialValue: null,
                      rules: [{ required: true, message: 'Please take the image of Company ID' }],
                    })(
                      <PhotoPicker
                        imageType="WORK_CARD"
                        onUploadSuccess={this.onWorkIdUploadSuccess.bind(this)}
                        isSupplement="N"
                        bg={require('../../../assets/images/image/company-pic-bg.png')}
                        cameraType="back"
                        pid={pid}
                        reportExif={value => this.reportExif(value)}
                        hint={I18n.t('prompt.image.idcardHint')}
                        error={getFieldError('wId')}
                      />
                    )}
                  </View>
                  <View style={styles.workCardHint}>
                    <Image
                      style={styles.workCardHintImg}
                      source={require('../../../assets/images/home/work-card-hint.png')}
                    />
                    <View style={styles.workCardHintTextWrap}>
                      <Text style={styles.workCardHintText}>
                        Noted: Please rest assured to provide your authentic information and will be
                        kept strictly confidential under our system and also help to get your Loan.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <Text style={styles.orgTopInfo}>
                *Choose offline cash pickup, handling fee will be deducted from your disbursement
                amount
              </Text>
              <View style={FormStyles.formitemGap}>
                {getFieldDecorator('payOrg', {
                  initialValue: item.payOrg,
                  rules: [{ required: true, message: I18n.t('User.institution.required') }],
                })(
                  <FloatingNormalPicker
                    label={I18n.t('User.institution.label')}
                    onValueChange={this.onPayOrgChange.bind(this)}
                    error={getFieldError('payOrg')}
                    data={payOrgEnum}
                    name={payOrgName}
                  />
                )}
              </View>
              <View style={FormStyles.formitemGap}>
                <FloatingInput
                  label="Disbursement Handling Fee"
                  editable={false}
                  value={dFee}
                  name={dFee}
                />
              </View>
            </>
          )}
          {Constants.CONTINUE_LOAN_TAG.includes(applyStatus) && (
            <View style={styles.paddingTop20}>
              <AgreeItem
                onChange={e => showAgreementModal({ isShow: e.target.checked })}
                checked={hasAgreeContract}>
                <Text style={styles.agreeContact1}>
                  By clicking Confirm, you agree to the attached
                </Text>{' '}
                <Text
                  style={styles.agreeContact2}
                  onPress={() => showAgreementModal({ isShow: true })}>
                  Loan Agreement
                </Text>{' '}
                <Text style={styles.agreeContact1}>of SurityCash.</Text>
              </AgreeItem>
              {!hasAgreeContract && (
                <Text style={styles.agreeContactWarn}>{I18n.t('prompt.agreement.warn')}</Text>
              )}
            </View>
          )}
          <Button
            type="ghost"
            size="large"
            title={I18n.t('common.apply.submit')}
            onPress={this.submit}
            disabled={submitLoading}
            loading={submitLoading}>
            Submit
          </Button>
        </View>
      </>
    )
  }
}
export default createForm()(App)
const cashTypes = [
  {
    isChecked: true,
    text: 'Bank Transfer',
    value: 'Y',
  },
  {
    isChecked: false,
    text: 'Cash Pickup',
    value: 'N',
  },
]
