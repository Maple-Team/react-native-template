import React, { PureComponent } from 'react'
import { Modal as AntModal, Button, Checkbox, Toast } from '@ant-design/react-native'
import { View, ScrollView, Image } from 'react-native'
import { Slider, Form, Text } from '../../../components'
import { I18n, toThousands, errorCaptured } from '../../../utils'
import { prepareCalc, updateAmount } from '../../../services/apply'
import styles from './adjustStyle'
import LoanInfo from './_loanInfo'
import dayjs from 'dayjs'
import AsyncStorage from '@react-native-community/async-storage'

const { FloatingNormalPicker } = Form
const AgreeItem = Checkbox.AgreeItem
export default class AdjustPopup extends PureComponent {
  constructor(props) {
    super(props)
    const { maxLoanTerms, maxAmount, loanTerms: _availableTerms } = props.sliderData
    const availableTerms = _availableTerms
      .filter(item => item.available)
      .map(item => {
        return {
          name: `${item.loanTerm}`,
          code: item.loanTerm,
        }
      })
    this.state = {
      applyAmount: maxAmount,
      loanTerms: maxLoanTerms,
      availableTerms,
      loanInfo: {
        applyAmount: maxAmount,
        repay: 'N/A',
        day: maxLoanTerms,
        endDate: dayjs()
          .add(maxLoanTerms - 1, 'day')
          .format('MM.DD.YYYY'),
      },
    }
  }
  componentDidMount() {
    const { applyAmount, loanTerms } = this.state
    this.calc({ applyAmount, loanTerms })
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
  async calc({ applyAmount, loanTerms }) {
    const { maxLoanTerms, maxAmount, loanCode, productCode } = this.props.sliderData
    // if (applyAmount > maxAmount) {
    //   applyAmount = maxAmount
    // }
    // if (loanTerms > maxLoanTerms) {
    //   loanTerms = maxLoanTerms
    // }
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
    const endDate = dayjs()
      .add(loanTerms - 1, 'day')
      .format('MM.DD.YYYY')
    this.setState({
      loanInfo: {
        applyAmount,
        endDate,
        repay: res.totalAmt,
        day: loanTerms,
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
  render() {
    const {
      status,
      visible,
      msg,
      onNoModifySubmit,
      sliderData,
      onModifySubmit,
      hasAgreeContract,
      showAgreementModal,
      onChangeContract, // 调整了金额期限，合同阅读状态重置
    } = this.props
    const {
      minAmount,
      maxViewAmount,
      amountStep,
      maxAmount,
      maxLoanTerms,
      loanCode,
      productCode,
    } = sliderData

    let { applyAmount, loanTerms, availableTerms, loanInfo } = this.state
    return (
      <AntModal
        style={styles.container}
        // eslint-disable-next-line react-native/no-inline-styles
        bodyStyle={{ paddingHorizontal: 0 }}
        maskClosable
        transparent
        visible={visible}
        popup>
        <ScrollView>
          <View style={styles.titleView}>
            <Text style={styles.title}>{msg}</Text>
          </View>
          <View style={styles.loanInfo}>
            <Text style={styles.loanInfoLeft}>{I18n.t('prompt.loan.amount.label')}*</Text>
            <Text style={styles.loanInfoRight}>{applyAmount}PHP</Text>
          </View>
          <Slider
            minimumValue={minAmount}
            maximumValue={maxViewAmount}
            step={amountStep}
            value={applyAmount}
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
              this.setState({ applyAmount: value })
              const { loanTerms: _loanTerms } = this.state
              this.calc({ applyAmount: value, loanTerms: _loanTerms })
              onChangeContract()
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
            name={`${loanTerms}`}
            data={availableTerms}
            onValueChange={obj => {
              this.setState({ loanTerms: obj.code })
              const { applyAmount: _applyAmount } = this.state
              this.calc({
                applyAmount: _applyAmount,
                loanTerms: obj.code,
              })
              onChangeContract()
            }}
          />
          <LoanInfo loanInfo={loanInfo} />
          <View style={{ paddingVertical: 20 }}>
            <AgreeItem
              onChange={e =>
                showAgreementModal({
                  isShow: e.target.checked,
                  loanTerms,
                  applyAmount,
                  loanCode,
                  productCode,
                  maxAmount,
                  maxLoanTerms,
                })
              }
              checked={hasAgreeContract}>
              <Text
                style={{
                  color: '#1a1a1a',
                  fontSize: 14,
                  fontFamily: 'Metropolis',
                }}>
                By clicking Confirm, you agree to the attached
              </Text>{' '}
              <Text
                style={{
                  fontFamily: 'ArialRoundedMTBold',
                  color: '#00A24D',
                  fontSize: 14,
                }}
                onPress={() =>
                  showAgreementModal({
                    isShow: true,
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
              <Text
                style={{
                  color: '#1a1a1a',
                  fontSize: 14,
                  fontFamily: 'Metropolis',
                }}>
                of SurityCash.
              </Text>
            </AgreeItem>
            {!hasAgreeContract && (
              <Text
                style={{
                  color: 'red',
                }}>
                {I18n.t('prompt.agreement.warn')}
              </Text>
            )}
          </View>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={[styles.btnWrapper, status === '127' && { justifyContent: 'center' }]}>
            {status === '128' ? (
              <>
                <Button
                  size="large"
                  onPress={onNoModifySubmit}
                  title={I18n.t('prompt.amountModify.cancel')}
                  style={{
                    ...styles.buttonStyle,
                    ...styles.buttonStyleNegative,
                  }}>
                  Don’t change yet
                </Button>
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
                    onModifySubmit({
                      loanTerms,
                      applyAmount,
                      loanCode,
                      productCode,
                    })
                  }}
                  title={I18n.t('prompt.amountModify.confirm')}
                  style={styles.buttonStyle}>
                  {I18n.t('prompt.amountModify.confirm')}
                </Button>
              </>
            ) : (
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
                  onModifySubmit({ loanTerms, applyAmount, loanCode, productCode })
                }}
                title={I18n.t('prompt.amountModify.confirm')}
                style={styles.buttonStyle}>
                {I18n.t('prompt.amountModify.confirm')}
              </Button>
            )}
          </View>
        </ScrollView>
      </AntModal>
    )
  }
}
