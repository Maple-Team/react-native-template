import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { Text } from '../../../components'
import StyleSheet from 'react-native-adaptive-stylesheet'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Button } from '@ant-design/react-native'
import { config, Logger } from '../../../utils'
import AsyncStorage from '@react-native-community/async-storage'

export default class PeriodPaySuccess extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasComputeResult: {},
      _data: this.props.computeAgainData,
    }
  }

  componentDidMount() {
    this.init()
  }
  onTelPress() {
    Logger.log('onTelPress')
  }
  onSubmitAgain() {
    Logger.log('onSubmitAgain')
  }
  async init() {
    const hasComputeResult = await AsyncStorage.getItem('hasComputeResult') // 是否试算过
    this.setState({
      hasComputeResult,
    })
  }
  render() {
    const { hasComputeResult, _data } = this.state
    // const { } = hasComputeResult
    return (
      <View style={styles.container}>
        <View style={styles.resultTitle}>
          <Text style={styles.resultTitleText}>Extension Succeeded</Text>
          <Text style={styles.resultTitleText}>
            Plesse repay on time to avoid negative impact on your credit
          </Text>
        </View>
        <View style={styles.resultContainer}>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLeftText}>Loan Amount:</Text>
            <Text style={styles.resultItemRightText}>{_data.extendAmt}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLeftText}>Service Fee:</Text>
            <Text style={styles.resultItemRightText}>{_data.extendFee}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLeftText}>Interest:</Text>
            <Text style={styles.resultItemRightText}>{_data.extendInterest}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLeftText}>Passdued Penalty:</Text>
            <Text style={styles.resultItemRightText}>{_data.extendPenalty}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLeftText}>Total Amount Repaid:</Text>
            <Text style={styles.resultItemRightText}>{_data.totalRepayAmount}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultItemLeftText}>Starting Time Of Extension:</Text>
            <Text style={styles.resultItemRightText}>{_data.startExtendDate}</Text>
          </View>
          <View style={{ ...styles.resultItem, paddingBottom: 11 }}>
            <Text style={styles.resultItemLeftText}>Ending Time Of Extension:</Text>
            <Text style={styles.resultItemRightText}>{_data.endExtendDate}</Text>
          </View>
          <View style={styles.lastResultItem}>
            <Text style={[styles.resultItemLeftText, styles.resultItemLastLeftText]}>
              Total repayment amount:
            </Text>
            <Text style={styles.resultItemRightText}>{_data.totalRepayAmount}</Text>
          </View>
        </View>
        <View style={styles.resultBottom}>
          <View style={styles.resultBottomWrap}>
            <Button
              type="ghost"
              onPress={this.onSubmitAgain.bind(this)}
              style={[styles.resultBottomBtn]}>
              Compute again
            </Button>
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
              <Text onPress={this.onTelPress.bind(this)} style={styles.resultBottomHintStrongText}>
                {config.tel}
              </Text>
              . if you wan to apply for the extension service.
            </Text>
          </View>
        </View>
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
  },
  resultTitleText: {
    color: '#252525',
    fontSize: 13,
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
    borderColor: '#EEA930',
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
  formBtn: {
    width: 182,
    backgroundColor: '#EEA930',
    borderColor: '#EEA930',
  },
})
