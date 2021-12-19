import React, { PureComponent } from 'react'
import { View, Linking, Platform } from 'react-native'
import { Text, Form } from '../../../components'
import StyleSheet from 'react-native-adaptive-stylesheet'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Button } from '@ant-design/react-native'
import { config, Logger, errorCaptured } from '../../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import { getExtensionDay, getExtensionCalc } from '../../../services/apply'
import { TouchableOpacity } from 'react-native-gesture-handler'
const { FloatingNormalPicker } = Form

export default class PeriodPay extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      day: 7,
      hasComputeResult: {},
      showResultPanel: '',
      data: [],
    }
  }
  onPeriodChange(value) {
    this.setState({
      day: value.code,
    })
  }
  async onSubmit() {
    const applyId = await AsyncStorage.getItem('applyId')
    const { day } = this.state
    this.extensionCalc(applyId, day)
  }
  async onSubmitAgain() {
    AsyncStorage.setItem('showResultPanel', 'again')
    const showResultPanel = await AsyncStorage.getItem('showResultPanel')
    this.props.showResultPanel(showResultPanel)
    this.setState({
      showResultPanel,
    })
  }
  componentDidMount() {
    this.init()
    this.extensionDay()
  }
  async init() {
    const showResultPanel = await AsyncStorage.getItem('showResultPanel')
    this.setState({
      showResultPanel,
    })
    Logger.log(showResultPanel, 8989)
    Logger.log(this.state.hasComputeResult, 9898)
    if (showResultPanel === 'now') {
      const applyId = await AsyncStorage.getItem('applyId')
      const { day } = this.state
      this.extensionCalc(applyId, day)
    }
    if (this.props.isExtend === 'Y') {
      const query = JSON.parse(await AsyncStorage.getItem('queryData'))
      this.setState({
        showResultPanel: 'now',
        hasComputeResult: query,
      })
    }
  }
  // 展期试算
  async extensionCalc(contractNo, extendDay) {
    // eslint-disable-next-line no-unused-vars
    const [err, res] = await errorCaptured(() =>
      getExtensionCalc({
        data: {
          contractNo,
          extendDay,
        },
      })
    )
    if (res) {
      AsyncStorage.setItem('showResultPanel', 'now')
      const showResultPanel = await AsyncStorage.getItem('showResultPanel')
      this.props.showResultPanel(showResultPanel)
      this.setState({
        hasComputeResult: res,
        showResultPanel,
      })
    }
  }

  // 获取展期天数
  async extensionDay() {
    const applyId = await AsyncStorage.getItem('applyId')
    const res = await getExtensionDay(applyId)
    let map = {}
    let _data = []
    res.forEach(item => {
      map = {
        name: item,
        code: item,
      }
      _data.push(map)
    })
    this.setState({
      data: _data,
    })
  }
  render() {
    const { isExtend } = this.props
    const { hasComputeResult, showResultPanel, data, day } = this.state
    const {
      endExtendDate,
      startExtendDate,
      extendAmt,
      extendInterest,
      extendSvcFee,
      minRepayAmt,
      totalRepayAmount,

      loanAmount,
      loanSvcFee,
      loanInterest,
      extendDate,
      repayDate,
      repayAmount,
    } = hasComputeResult
    return (
      <View style={[styles.container, showResultPanel === 'now' && { backgroundColor: '#F8F8F8' }]}>
        {showResultPanel === 'now' ? (
          <>
            {isExtend === 'Y' ? (
              <View style={styles.resultTitle}>
                <Text style={styles.resultTitleText}>Extension Succeeded</Text>
                <Text style={styles.resultSubtitleText}>
                  Plesse repay on time to avoid negative impact on your credit
                </Text>
              </View>
            ) : (
              <View style={styles.resultTitle}>
                <Text style={styles.resultTitleText}>
                  Details and fees for extension are as followed:
                </Text>
              </View>
            )}
            <View style={styles.resultContainer}>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLeftText}>Loan Amount:</Text>
                <Text style={styles.resultItemRightText}>PHP {extendAmt || loanAmount}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLeftText}>Service Fee:</Text>
                <Text style={styles.resultItemRightText}>PHP {extendSvcFee || loanSvcFee}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLeftText}>Interest:</Text>
                <Text style={styles.resultItemRightText}>PHP {extendInterest || loanInterest}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLeftText}>Starting Time Of Extension:</Text>
                <Text style={styles.resultItemRightText}>{startExtendDate || extendDate}</Text>
              </View>
              <View style={styles.resultItem}>
                <Text style={styles.resultItemLeftText}>Ending Time Of Extension:</Text>
                <Text style={styles.resultItemRightText}>{endExtendDate || repayDate}</Text>
              </View>
              <View style={{ ...styles.resultItem, paddingBottom: 11 }}>
                <Text style={styles.resultItemLeftText}>Total Repayment Amount:</Text>
                <Text style={styles.resultItemRightText}>
                  PHP {totalRepayAmount || repayAmount}
                </Text>
              </View>
              {isExtend === 'Y' ? null : (
                <View style={styles.lastResultItem}>
                  <Text style={[styles.resultItemLeftText, styles.resultItemLastLeftText]}>
                    Minimum repayment for extension:
                  </Text>
                  <Text style={styles.resultItemRightText}>PHP {minRepayAmt}</Text>
                </View>
              )}
            </View>

            {/* 如果 isExtend === 'Y' 展期成功 就不展示*/}
            {isExtend !== 'Y' ? (
              <View style={styles.resultBottom}>
                <View style={styles.resultBottomWrap}>
                  <TouchableOpacity onPress={this.onSubmitAgain.bind(this)}>
                    <Text style={styles.resultBottomBtn}>Compute again</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.resultBottomHint}>
                  <AntDesign
                    name="exclamationcircle"
                    size={14}
                    color="#FFA800"
                    style={{ paddingRight: 4 }}
                  />
                  <Text style={styles.resultBottomHintText}>
                    Contact our CSR via{' '}
                    <Text style={styles.resultBottomHintStrongText}>{config.email}</Text>. if you
                    wan to apply for the extension service.
                  </Text>
                </View>
              </View>
            ) : null}
          </>
        ) : (
          <>
            <View style={styles.title}>
              <Text style={styles.titleText}>
                If extension is needed for financial emergency, kindly check computation details
                below with terms{' '}
              </Text>
            </View>
            <View style={styles.formView}>
              <FloatingNormalPicker
                value={day}
                label={'compute day'}
                onValueChange={this.onPeriodChange.bind(this)}
                data={data}
              />
              <View style={styles.formBtnWrap}>
                <TouchableOpacity onPress={this.onSubmit.bind(this)}>
                  <Text
                    style={[styles.resultBottomBtn, { backgroundColor: '#EEA930', color: '#fff' }]}>
                    Compute now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.resultBottom}>
              <View style={styles.resultFail}>
                <Text style={styles.resultFailText}>Sorry! Extension is not available so far.</Text>
              </View>
              <View style={styles.resultBottomHint}>
                <AntDesign
                  name="exclamationcircle"
                  size={14}
                  color="#FFA800"
                  style={{ paddingRight: 4 }}
                />
                <Text style={styles.resultBottomHintText}>
                  Contact our CSR via{' '}
                  <Text style={styles.resultBottomHintStrongText}>{config.email}</Text>. if you wan
                  to apply for the extension service.
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingTop: 16.5,
    paddingBottom: 8.5,
    paddingHorizontal: 9.5,
    marginTop: 11,
    marginBottom: 30,
  },
  title: {
    paddingHorizontal: 11,
    paddingBottom: 10.5,
  },
  titleText: {
    color: '#252525',
    fontSize: 13,
    textAlign: 'center',
  },
  resultTitle: {
    paddingHorizontal: 21 - 9.5,
    paddingBottom: 25.5,
    textAlign: 'center',
  },
  resultTitleText: {
    color: '#252525',
    fontSize: 13,
  },
  resultSubtitleText: {
    color: '#6F6F6F',
    fontSize: 11,
  },
  resultContainer: {
    borderRadius: 4,
    backgroundColor: '#F8F8F8',
    paddingTop: 11.5,
    marginBottom: 13,
  },
  resultItem: {
    paddingBottom: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 13,
    paddingRight: 11.5,
  },
  lastResultItem: {
    backgroundColor: '#D5EDE0',
    paddingTop: 13.5,
    paddingBottom: 14,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 13,
    paddingRight: 11.5,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
  resultItemLeftText: {
    color: '#6F6F6F',
    fontSize: 11,
  },
  resultItemLastLeftText: {
    color: '#2C2C2C',
    fontSize: 13,
  },
  resultItemRightText: {
    fontFamily: 'ArialRoundedMTBold',
    color: '#1D1D1D',
    fontSize: 14,
  },
  resultBottomWrap: {
    alignItems: 'center',
  },
  resultBottom: {},
  resultBottomBtn: {
    width: 182,
    height: 44,
    lineHeight: 44,
    color: '#EEA930',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#EEA930',
    borderRadius: 9,
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 14,
    marginBottom: 14,
  },
  resultBottomHint: {
    flexDirection: 'row',
  },
  resultBottomHintText: {
    color: '#EEA930',
    fontSize: 11,
  },
  resultBottomHintStrongText: {
    color: '#EEA930',
    fontSize: 13,
    fontFamily: 'Arial-BoldMT',
    fontWeight: 'bold',
  },
  resultFail: {
    paddingHorizontal: 52 - 9.5,
  },
  resultFailText: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 13,
    color: '#FF3333',
  },
  formView: {
    marginBottom: 12.5,
  },
  formBtnWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 17,
  },
})
