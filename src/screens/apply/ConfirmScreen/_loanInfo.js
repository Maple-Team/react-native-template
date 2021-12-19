import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { toThousands } from '../../../utils'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Text } from '../../../components'

export default class LoanInfo extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { loanInfo } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Compute the repayment amount</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.left}>
            <Text style={styles.upText}>Loan Amount</Text>
            <Text style={styles.downText}>₱ {toThousands(loanInfo.applyAmount)}</Text>
          </View>
          <View style={styles.middle}>
            <Text style={styles.upText}>Loan Term</Text>
            <Text style={styles.downText}>{loanInfo.day} Days</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.upText}>Payment Amount</Text>
            <Text style={styles.downText}>₱ {toThousands(loanInfo.repay)}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#00A24D',
  },
  header: {
    backgroundColor: '#00A24D',
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 13,
    color: '#Ffffff',
  },
  content: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 63,
    borderRadius: 5,
    paddingTop: 16,
    paddingBottom: 13,
    paddingHorizontal: 14.5,
  },
  left: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upText: {
    fontSize: 11,
    color: '#7B7B7B',
    fontFamily: 'Metropolis',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  middle: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downText: {
    fontSize: 12,
    color: '#1A1A1A',
    fontFamily: 'ArialMT',
  },
})
