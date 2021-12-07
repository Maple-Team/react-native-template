import React, { PureComponent } from 'react'
import { ScrollView, View, Image, AppState, NativeModules } from 'react-native'
import { Button, Toast, Portal } from '@ant-design/react-native'
import { HeaderLeft, Text, BackPressComponent, Chat } from '../../../components'
import styles from './style'
import NavigationUtil from '../../../navigation/NavigationUtil'
import { errorCaptured, Logger, handleModel, DA, I18n } from '../../../utils'
import { queryStatus, dict, suppleImageAuth } from '../../../services/apply'
import ExampleModal from '../ImageScreen/modal'
import SuppleImageForm from '../ImageScreen/form'
import Detail from './detail'
import Detail2 from './detail2'
import PeriodPay from './periodPay'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { NavigationEvents } from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage'

const PAGE_ID = 'P09'

export default class DoneScreen extends PureComponent {
  static navigationOptions = {
    title: 'Application Status',
    headerLeft: <HeaderLeft route="UserCenter" />,
    headerRight: Chat,
  }
  constructor(props) {
    super(props)
    this.state = {
      idTypeEnum: [],
      status: '',
      applyDate: '', // 申请日期
      loanTerm: '', // 借款期限
      loanAmount: '', // 申请金额，放款金额
      repayAmount: '', // 应还金额
      countractAmount: '', // 合同金额
      repayDate: '', // 应还日期
      loanPenalty: 0, // 罚息
      overDueDay: null, // 逾期天数
      loanInterest: 0,
      loanSvcFee: 0,
      statusText: '',
      canReApplyDays: 0, // 被拒若干天后可继续贷款
      suppleImageViewVisible: false, // 补件页面是否可见
      ExampleModalVisible: false, // 示例弹窗是否可见
      submitLoading: false, // 补件提交loading
      pageLoading: false, // 页面加载loading
      primaryCardType: '',
      idcard: '',
      liveFailedNum_supplement: 0,
      selfId_supplement: 0,
      isExtend: '',
      showResultPanel: 'again',
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }
  componentDidMount() {
    this.query()
    this.backPress.componentDidMount()
    DA.setEnterPageTime(`${PAGE_ID}_Enter`)
    this.initData() // 加载缓存中的数据
    AppState.addEventListener('change', this._onAppStateChange.bind(this))
    this.init()
  }
  async init() {
    const showResultPanel = await AsyncStorage.getItem('showResultPanel')
    this.setState({
      showResultPanel,
    })
  }
  // 监听子组件状态
  showResultPanel(val) {
    this.setState({
      showResultPanel: val,
    })
  }
  initData = async () => {
    const [selfId_supplement] = await Promise.all([
      AsyncStorage.getItem('selfId_supplement'),
    ]).catch(e => Logger.error(e))
    this.setState({
      selfId_supplement,
    })
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount()
    DA.setLeavePageTime(`${PAGE_ID}_Leave`)
    AsyncStorage.setItem('liveFailedNum_supplement', `${this.state.liveFailedNum_supplement}`) // 存储次数
    AppState.removeEventListener('change', () => {})
  }
  onBackPress = async () => {
    NavigationUtil.goPage('UserCenter')
    AsyncStorage.setItem('liveFailedNum_supplement', `${this.state.liveFailedNum_supplement}`) // 存储次数
    return true
  }
  async _idtype() {
    const [err, idTypeEnum] = await errorCaptured(() => dict('PRIMAARYID'))
    err && Logger.log(err)
    this.setState({
      idTypeEnum,
    })
  }
  async _onAppStateChange() {
    Logger.log(AppState.currentState)
    switch (AppState.currentState) {
      case 'active':
        Logger.log('active')
        const applyId = await AsyncStorage.getItem('applyId')
        this.query(applyId)
        break
      case 'background':
        Logger.log('background')
        break
      default:
    }
  }

  async query(_applyId) {
    const key = Toast.loading(`${I18n.t('common.loading')}...`)
    const applyId = _applyId || this.props.navigation.state.params.applyId
    const [err, res] = await errorCaptured(() => queryStatus({ params: { applyId } }))
    Portal.remove(key)
    if (err) {
      return
    }

    const statusMap = {
      APPROVE: 'APPROVE',
      REJECTED: 'REJECTED',
      SUPPLEMENT_IMAGE: 'SUPPLEMENT_IMAGE',
      LOAN: 'LOAN',
      REPAY: 'REPAY',
      SETTLE: 'SETTLE',
      OVERDUE: 'OVERDUE',
    }
    const {
      applyDate,
      loanTerm, // 借款期限
      applyAmount, // 申请金额，放款金额
      repayAmount, // 应还金额
      repayDate, // 应还日期
      applyStatus,
      countractAmount,
      canReApplyDays,
      primaryCardType,
      idcard,
      loanDate,
      loanPenalty,
      overDueDay,
      loanInterest,
      loanSvcFee,
      isExtend, //Y-已展期，N未展期，W-展期处理中
    } = res.apply
    AsyncStorage.setItem('queryData', JSON.stringify(res.apply))
    if (applyStatus === 'SUPPLEMENT_IMAGE') {
      this._idtype()
    }

    this.setState({
      status: applyStatus,
      applyDate,
      countractAmount,
      loanTerm, // 借款期限
      loanAmount: applyAmount, // 申请金额，放款金额
      repayAmount, // 应还金额
      repayDate, // 应还日期
      statusText: I18n.t(`prompt.loan.${statusMap[applyStatus]}.title`),
      applyId,
      canReApplyDays,
      primaryCardType,
      idcard,
      loanDate,
      loanPenalty,
      overDueDay,
      loanInterest,
      loanSvcFee,
      isExtend,
    })
  }
  async onOK(formObj) {
    const { applyId } = this.state
    const data = {
      ...formObj,
      currentStep: 5,
      totalSteps: 6,
      complete: 'N',
      applyId,
    }
    this.setState({ submitLoading: true })
    let [err] = await errorCaptured(() => suppleImageAuth({ data: handleModel(data) }))
    this.setState({ submitLoading: false })
    if (!err) {
      DA.send('PAGE_ID')
      await Promise.all([AsyncStorage.removeItem('selfId_supplement')]).catch(e => Logger.error(e))
      this.query(applyId)
    }
  }
  handleLiveFail() {
    let num = this.state.liveFailedNum_supplement + 1
    this.setState({
      liveFailedNum_supplement: num,
    })
  }
  handleLiveUpload(selfId_supplement) {
    this.setState({
      selfId_supplement,
    })
  }
  render() {
    const {
      status,
      submitLoading,
      ExampleModalVisible,
      idTypeEnum,
      canReApplyDays,
      applyDate,
      loanAmount,
      primaryCardType,
      idcard,
      loanDate,
      countractAmount,
      loanInterest,
      loanSvcFee,
      loanPenalty,
      overDueDay,
      repayAmount, // 应还金额
      repayDate, // 应还日期
      selfId_supplement,
      showResultPanel,
      isExtend,
    } = this.state
    const overdue = status === 'OVERDUE'
    // 审核中
    const stateApprove = (
      <>
        <View style={styles.headContainer}>
          <View style={styles.head}>
            {StatusCircle(true, 'Submitted successfully')}
            {line(true)}
            {dot(true, 'Under Verification')}
            {line(true)}
            {circle(false, 'Your application is approved')}
            {line(false)}
            {dot(false)}
          </View>
          <View style={styles.statusView}>
            <Text style={styles.statusTitle}>Submitted successfully</Text>
            <Text style={styles.statusSubtitle}>
              Congrats! Your loan application is under review. For faster processing of your loan
              application, kindly keep your lines open. One of our members will get in touch with
              you within 2 working days.
            </Text>
          </View>
        </View>
        <Detail
          dataSource={[
            [
              { name: 'Date of Application', value: applyDate.substr(0, 10).replace(/\//g, '-') },
              { name: 'Loan Amount oooo', value: loanAmount },
            ],
          ]}
        />
      </>
    )
    const stateLoanIn = (
      <>
        <View style={styles.headContainer}>
          <View style={styles.head2}>
            {circle(true, 'Submitted successfully')}
            {line(true)}
            {dot(true)}
            {line(true)}
            {StatusCircle(true)}
            {line(true)}
            {dot(true, 'Loan processing')}
            {line(true)}
            {circle(false, 'Successful disbursement')}
            {line(false)}
            {dot(false, 'waiting')}
          </View>
          <View style={styles.statusView}>
            <Text style={styles.statusTitle}>Your application is approved</Text>
          </View>
        </View>
        <Detail
          dataSource={[
            [
              { name: 'Date of Application', value: applyDate.substr(0, 10).replace(/\//g, '-') },
              { name: 'Loan Amount', value: loanAmount },
            ],
          ]}
        />
      </>
    )
    // 还款
    const stateRepayment = (
      <>
        <View style={styles.headContainer}>
          <View style={styles.head3}>
            {dot(true)}
            {line(true)}
            {circle(true, 'Your application is approved')}
            {line(true)}
            {dot(true)}
            {line(true)}
            {StatusCircle(!overdue)}
            {line(true)}
            {dot(true, 'waiting for settlement')}
            {line(true)}
            {circle(false, 'Successful disbursement')}
          </View>
          <View style={styles.statusView}>
            <Text style={[styles.statusTitle, overdue && { color: '#FF3419' }]}>
              {!overdue ? 'Successful disbursement' : 'Overdue'}
            </Text>
            <Text style={[styles.statusSubtitle, overdue && { color: '#FF3419' }]}>
              {!overdue
                ? 'Conduct your repayment before your due date will help increase your reloan amount for a period'
                : 'To avoid incurring penalties, we encourage you to make early or on-time payments. Keeping a good credit standing will qualify you for a higher loan amount with SurityCash!'}
            </Text>
          </View>
        </View>
        {showResultPanel !== 'again' || isExtend === 'Y' ? null : (
          <Detail2
            applyAmount={loanAmount}
            svcFee={loanSvcFee}
            repay={repayAmount}
            applyDate={applyDate}
            repayDate={repayDate}
            interest={loanInterest}
            loanPenalty={loanPenalty}
            status={!!overDueDay}
            applyStatus={status}
          />
        )}

        <PeriodPay isExtend={isExtend} showResultPanel={this.showResultPanel.bind(this)} />
        <View style={styles.infoRepay}>
          <Text style={styles.infoTextRepay}>
            Reminder: repay the loan to company's account, the bank booking will be delayed for 1-2
            days. If the contract state is inconsistent with the actual repayment, please wait
            patiently.If you have any questions, please contact customer service: XXXXX
          </Text>
        </View>
        <View style={[styles.operationRepay, { marginBottom: 40 }]}>
          <Button type="primary" onPress={() => this.props.navigation.navigate('Repayment')}>
            Repayment
          </Button>
        </View>
      </>
    )
    const stateSettle = (
      <>
        <View style={styles.headContainer}>
          <View style={styles.headSettle}>
            {dot(true)}
            {line(true)}
            {circle(true, 'Submitted successfully')}
            {line(true)}
            {dot(true)}
            {line(true)}
            {StatusCircle(true)}
          </View>
          <View style={styles.statusView}>
            <Text style={styles.statusTitle}>Successful disbursement(Settled)</Text>
          </View>
        </View>
        <Detail2
          applyAmount={loanAmount}
          svcFee={loanSvcFee}
          repay={repayAmount}
          applyDate={applyDate}
          repayDate={repayDate}
          interest={loanInterest}
          loanPenalty={loanPenalty}
          status={!!overDueDay}
        />
        <View style={styles.operationSettle}>
          <Button type="primary" onPress={() => this.props.navigation.navigate('Index')}>
            Apply Again
          </Button>
        </View>
        <View style={styles.infoSettle}>
          <Text style={styles.infoTextSettle}>
            Congratulation! you get a chance for higher amount of loan, Apply now!
          </Text>
        </View>
      </>
    )
    const stateFail = (
      <>
        {canReApplyDays === 0 ? (
          <>
            <View style={styles.headContainer}>
              <View style={styles.headAfterReject}>
                <Image
                  style={styles.headAfterRejectImg}
                  source={require('../../../assets/images/user/afterReject.png')}
                />
              </View>
              <View style={styles.statusView}>
                <Text style={styles.statusTitle}>Application failed</Text>
              </View>
            </View>
            <View style={styles.afterRejectView}>
              <Text style={styles.afterRejectText}>
                You can re-apply for a loan. More accurate information will help you get a faster
                approval!
              </Text>
            </View>
            <View style={styles.operationSettle}>
              <Button type="primary" onPress={() => this.props.navigation.navigate('Index')}>
                Apply Again
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={styles.headContainer}>
              <View style={styles.headFail}>
                {circle(true, 'Submitted successfully')}
                {line(true)}
                {dot(true)}
                {line(true)}
                {StatusCircle(false)}
              </View>
              <View style={styles.statusView}>
                <Text style={styles.statusTitle}>Your application is rejected</Text>
                <Text style={styles.statusSubtitle}>
                  This application has not been approved. You can apply again after
                  <Text style={styles.day}> {canReApplyDays} </Text>days
                </Text>
              </View>
            </View>
            <View style={styles.operationSettle}>
              <Button type="primary" disabled>
                Apply Again
              </Button>
            </View>
          </>
        )}
      </>
    )
    const stateSupplement = (
      <>
        <View style={styles.headContainer}>
          <View style={styles.headSupplement}>
            {circle(true, 'Submitted successfully')}
            {line(true)}
            {dot(true)}
            {line(true)}
            {StatusCircle(false)}
          </View>
          <View style={styles.statusView}>
            <Text style={styles.statusTitle}>Submitted successfully</Text>
            <Text style={styles.statusSubtitle}>
              After checking, the image of your uploaded ID does not meet the requirements. Please
              re-upload a clear and valid ID image. we will review your identity information in time
              after your successful uploading, thank you!
            </Text>
          </View>
        </View>
        <SuppleImageForm
          onOK={this.onOK.bind(this)}
          item={{ idcard, primaryCardType, isSupplement: true }}
          idTypeEnum={idTypeEnum}
          pid={PAGE_ID}
          onExampleOpen={() => this.setState({ ExampleModalVisible: true })}
          submitLoading={submitLoading}
          showSecondCard={false}
          selfId={selfId_supplement}
          handleLiveUpload={this.handleLiveUpload.bind(this)}
          handleLiveFail={this.handleLiveFail.bind(this)}
        />
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ marginBottom: 40 }}
        />
        <ExampleModal
          visible={ExampleModalVisible}
          onClose={() => this.setState({ ExampleModalVisible: false })}
        />
      </>
    )
    const componentMap = {
      APPROVE: stateApprove, // 审核中
      REJECTED: stateFail, // 失败
      SUPPLEMENT_IMAGE: stateSupplement, // 补充影像
      LOAN: stateLoanIn, // 放款中
      REPAY: stateRepayment, // 还款中
      OVERDUE: stateRepayment, // 已逾期
      SETTLE: stateSettle, // 已结清
    }
    const showStatus = componentMap[status]
    return (
      <ScrollView style={styles.container}>
        <NavigationEvents
          onWillFocus={async () => {
            const applyId = await AsyncStorage.getItem('applyId')
            this.query(applyId)
          }}
        />
        {showStatus}
      </ScrollView>
    )
  }
}

const dot = (active, txt) => (
  <View style={[styles.dot, active && styles.dotAct]}>
    <View style={styles.dotTextView}>
      <Text style={[styles.dotText, !active && styles.dotTextOff]}>{txt}</Text>
    </View>
  </View>
)
const circle = (status, txt) => {
  if (status) {
    return (
      <View style={styles.circle}>
        <AntDesign name={'checkcircleo'} size={27} color={'#00A24D'} />
        <View style={styles.circleTextView}>
          <Text style={[styles.circleText, styles.circleTextOn]}>{txt}</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={[styles.circle, styles.circleOff]}>
        <View style={styles.circleTextView}>
          <Text style={styles.circleText}>{txt}</Text>
        </View>
      </View>
    )
  }
}
const StatusCircle = status => {
  return status ? (
    <AntDesign name={'checkcircleo'} size={72} color={'#00A24D'} />
  ) : (
    <AntDesign name={'exclamationcircleo'} size={72} color={'#FF3419'} />
  )
}
const line = active => <View style={[styles.line, active && styles.lineAct]} />
