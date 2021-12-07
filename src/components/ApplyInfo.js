import React, { Component } from 'react'
import { List } from '@ant-design/react-native'
import dayjs from 'dayjs'
const Item = List.Item
export default class ApplyInfo extends Component {
  render() {
    let {
      applyDate, // 申请日期
      loanTerm, // 借款期限
      loanAmount, // 申请金额，放款金额
      repayAmounnt, // 应还金额
      repayDate, // 应还日期
      statusText,
    } = this.props.getData
    return (
      <List style={{ marginTop: 12 }}>
        <Item extra={dayjs(applyDate).format('YYYY-MM-DD H:m:s')} wrap={true}>
          申请日期
        </Item>
        <Item extra={'PHP ' + loanAmount} wrap={true}>
          申请金额
        </Item>
        <Item extra={'PHP ' + loanAmount} wrap={true}>
          放款金额
        </Item>
        <Item extra={loanTerm + '天'} wrap={true}>
          借款期限
        </Item>
        <Item extra={!repayAmounnt ? '------' : 'PHP ' + repayAmounnt} wrap={true}>
          应还金额
        </Item>
        <Item extra={repayDate || '------'} wrap={true}>
          应还日期
        </Item>
        <Item extra={statusText} wrap={true}>
          申请状态
        </Item>
      </List>
    )
  }
}
