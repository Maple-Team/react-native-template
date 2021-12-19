import React from 'react'
import { View, ImageBackground } from 'react-native'
import { Text } from '../../../components'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { toThousands } from '../../../utils'

const Detail2 = ({
  applyAmount,
  svcFee,
  repay,
  applyDate,
  repayDate,
  interest,
  status,
  loanPenalty,
  applyStatus,
}) => (
  <View style={styles.loanInfo}>
    <View style={styles.item}>
      <View style={styles.itemView}>
        <Text style={styles.itemTextLeft}>Date of Application:</Text>
        <View style={styles.itemTextRightView}>
          <Text style={styles.itemTextRight}>{applyDate.substr(0, 10)}</Text>
        </View>
      </View>
      <View style={styles.itemView}>
        <Text style={styles.itemTextLeft}>Repayment Date:</Text>
        <View style={styles.itemTextRightView}>
          <Text style={styles.itemTextRight}>{repayDate}</Text>
        </View>
      </View>
      <View style={styles.itemView}>
        <Text style={styles.itemTextLeft}>Loan Amount:</Text>
        <View style={styles.itemTextRightView}>
          <Text style={styles.itemTextRight}>PHP {toThousands(applyAmount)}</Text>
        </View>
      </View>
      <View style={styles.itemView}>
        <Text style={styles.itemTextLeft}>Interest</Text>
        <View style={styles.itemTextRightView}>
          <Text style={styles.itemTextRight}>PHP {toThousands(interest)}</Text>
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
              <Text style={{ fontSize: 9, color: '#FFFFFF', fontFamily: 'ArialRoundedMTBold' }}>
                Free
              </Text>
            </ImageBackground>
          )}
        </View>
      </View>
      <View style={styles.itemView}>
        <Text style={styles.itemTextLeft}>Service Fee:</Text>
        <View style={styles.itemTextRightView}>
          <Text style={styles.itemTextRight}>PHP {toThousands(svcFee)}</Text>
        </View>
      </View>
      {applyStatus === 'OVERDUE' && (
        <View style={styles.itemView}>
          <Text style={styles.itemTextLeft}>Late Charge:</Text>
          <View style={styles.itemTextRightView}>
            <Text style={[styles.itemTextRight, { color: '#FF3419' }]}>
              PHP {toThousands(loanPenalty)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.itemView}>
        <Text style={[styles.itemTextLeft, { fontSize: 13 }]}>Repayment Amount:</Text>
        <View style={styles.itemTextRightView}>
          <Text style={styles.itemTextRight}>PHP {toThousands(repay)}</Text>
        </View>
      </View>
    </View>
  </View>
)
export default Detail2

const styles = StyleSheet.create({
  loanInfo: {
    marginTop: 16.5,
  },
  item: {
    borderRadius: 10,
    paddingLeft: 35.5,
    paddingRight: 55,
    paddingTop: 22.5,
    paddingBottom: 26.5,
    backgroundColor: '#FFFFFF',
    height: 189,
    justifyContent: 'space-between',
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTextLeft: {
    fontFamily: 'Aller',
    fontWeight: 'normal',
    fontSize: 13,
    color: '#6F6F6F',
  },
  itemTextRightView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: 85,
  },
  itemTextRight: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 14,
    color: '#1D1D1D',
  },
})
