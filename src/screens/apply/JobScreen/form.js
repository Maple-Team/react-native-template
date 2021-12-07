import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableHighlight } from 'react-native'
import { Button, Toast } from '@ant-design/react-native'
import { createForm } from 'rc-form'
import { Form, FormGap, Text } from '../../../components'
import { FormStyles } from '../../../styles'
import { DA, I18n, Logger, toThousands, Reg, Constants } from '../../../utils'
import __ from 'lodash'
import MultiRelation from './multi-relations-form'
import StyleSheet from 'react-native-adaptive-stylesheet'

const { FloatingNormalPicker, FloatingInput } = Form

class App extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      isSpecial: false,
      contactPermissionVisible: false,
      attr1: 'N',
      contactPhoneName: '',
      contactName: '',
      showSettingVisible: false,
      currentRelationStep: 1,
      contacts: props.item.contacts || [],
    }
  }
  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.item) !== JSON.stringify(this.props.item)) {
      const {
        item: { socialStatus, contactPhone, firstName, middleName, lastName },
      } = this.props
      const selected = this.props.socialStatusEnum.find(i => i.code === socialStatus) || {}
      const attr1 = selected.attr1
      Logger.log({ selected })
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isSpecial: attr1 === 'Y',
        attr1,
        contactPhoneName: contactPhone,
        contactName: `${firstName ? firstName : ''}${middleName ? middleName : ''}${
          lastName ? lastName : ''
        }`,
      })
    }
  }
  componentWillUnmount() {
    Logger.log('[JobScreen Form] componentWillUnmount')
  }
  submit = () => {
    const { form, onOK } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      Object.keys(values).forEach(prop => {
        values[prop] = __.trim(values[prop])
      })
      if (values.monthlyIncome) {
        values.monthlyIncome = Number(values.monthlyIncome.replace(/[^0-9]/g, '')).toString()
      }
      const { contacts, contactName, contactPhoneName } = this.state

      const {
        contactName1,
        contactPhone1,
        contactRelationCode1,
        contactName2,
        contactPhone2,
        contactRelationCode2,
        contactName3,
        contactPhone3,
        contactRelationCode3,
      } = values
      if (contactName1) {
        contacts[0] = {
          contactName: contactName1,
          contactPhone: contactPhone1,
          contactRelationCode: contactRelationCode1,
        }
      }
      if (contactName2) {
        contacts[1] = {
          contactName: contactName2,
          contactPhone: contactPhone2,
          contactRelationCode: contactRelationCode2,
        }
      }
      if (contactName3) {
        contacts[2] = {
          contactName: contactName3,
          contactPhone: contactPhone3,
          contactRelationCode: contactRelationCode3,
        }
      }
      values.contacts = contacts
      if (values.contacts.length < 3) {
        Toast.fail("Plz provide three relation's contact info")
        return
      }
      const names = Array.from(
        new Set([
          contactName,
          contacts[0].contactName.replace(/\s/g, ''),
          contacts[1].contactName.replace(/\s/g, ''),
          contacts[2].contactName.replace(/\s/g, ''),
        ])
      )

      const phones = Array.from(
        new Set([
          contactPhoneName,
          contacts[0].contactPhone,
          contacts[1].contactPhone,
          contacts[2].contactPhone,
        ])
      )
      if (names.length < 4 || phones.length < 4) {
        Toast.fail('Contacts cannot be the same.')
        return
      }
      delete values.contactName1
      delete values.contactName2
      delete values.contactName3
      delete values.contactPhone1
      delete values.contactPhone2
      delete values.contactPhone3
      delete values.contactRelationCode1
      delete values.contactRelationCode2
      delete values.contactRelationCode3
      onOK(values)
    })
  }
  _onLoanPurposeChange = obj => {
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    const { code } = obj
    DA.setModify(`${pid}_S_loanPurpose`, code, getFieldValue('loanPurpose'))
    setFieldsValue({ loanPurpose: code })
  }
  _onSocialStatusChange = obj => {
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    const { code, attr1 } = obj
    DA.setModify(`${pid}_S_socialStatus`, code, getFieldValue('socialStatus'))
    setFieldsValue({ socialStatus: code })
    this.setState({ isSpecial: attr1 === 'Y' })
  }
  _onIndustryChange = obj => {
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    const { code } = obj
    DA.setModify(`${pid}_S_industry`, code, getFieldValue('industry'))
    setFieldsValue({ industry: code })
  }
  _onCompanyFocus = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setStartModify(`${pid}_I_Company`, getFieldValue('company'))
  }
  _onCompanyBlur = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setEndModify(`${pid}_I_Company`, getFieldValue('company'))
  }
  _onCompanyChange = value => {
    this.setState({ company: value })
    const { setFieldsValue } = this.props.form
    setFieldsValue({ company: value })
  }
  _onJobPositionFocus = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setStartModify(`${pid}_I_jobPosition`, getFieldValue('jobPosition'))
  }
  _onJobPositionBlur = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setEndModify(`${pid}_I_jobPosition`, getFieldValue('jobPosition'))
  }
  _onJobPositionChange = value => {
    this.setState({ jobPosition: value })
    const { setFieldsValue } = this.props.form
    setFieldsValue({ jobPosition: value })
  }
  _onMonthlyIncomeFocus = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setStartModify(`${pid}_I_monthlyIncome`, getFieldValue('monthlyIncome'))
  }
  _onMonthlyIncomeBlur = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setEndModify(`${pid}_I_monthlyIncome`, getFieldValue('monthlyIncome'))
  }
  _onMonthlyIncomeChange = value => {
    value = value.replace(/[^0-9]/g, '')
    const _value = toThousands(+value)
    Logger.log(_value)
    this.setState({ monthlyIncome: _value })
    const { setFieldsValue } = this.props.form
    setFieldsValue({ monthlyIncome: `PHP ${_value}` })
  }
  _onCompanyPhoneFocus = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setStartModify(`${pid}_I_companyPhone`, getFieldValue('companyPhone'))
  }
  _onCompanyPhoneBlur = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setEndModify(`${pid}_I_companyPhone`, getFieldValue('companyPhone'))
  }
  _onCompanyPhoneChange = value => {
    this.setState({ companyPhone: value })
    const { setFieldsValue } = this.props.form
    setFieldsValue({ companyPhone: value })
  }
  _onIncumbencyChange = obj => {
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    const { code } = obj
    DA.setModify(`${pid}_S_incumbency`, code, getFieldValue('incumbency'))
    setFieldsValue({ incumbency: code })
  }
  handleMultiRelationFormChange = () => {
    const { form } = this.props
    const { getFieldValue } = form
    const contactName1 = getFieldValue('contactName1')
    const contactName2 = getFieldValue('contactName2')
    const contactName3 = getFieldValue('contactName3')
    const contactPhone1 = getFieldValue('contactPhone1')
    const contactPhone2 = getFieldValue('contactPhone2')
    const contactPhone3 = getFieldValue('contactPhone3')
    const contactRelationCode1 = getFieldValue('contactRelationCode1')
    const contactRelationCode2 = getFieldValue('contactRelationCode2')
    const contactRelationCode3 = getFieldValue('contactRelationCode3')
    const _contacts = this.state.contacts

    if (contactName1) {
      _contacts[0] = {
        contactName: contactName1,
        contactPhone: contactPhone1,
        contactRelationCode: contactRelationCode1,
      }
    }
    if (contactName2) {
      _contacts[1] = {
        contactName: contactName2,
        contactPhone: contactPhone2,
        contactRelationCode: contactRelationCode2,
      }
    }
    if (contactName3) {
      _contacts[2] = {
        contactName: contactName3,
        contactPhone: contactPhone3,
        contactRelationCode: contactRelationCode3,
      }
    }
    this.setState({
      contacts: _contacts,
    })
  }

  render() {
    const {
      industryEnum,
      socialStatusEnum,
      loanPurposeEnum,
      relationShipEnum,
      incumbencyEnum,
      item = {},
      submitLoading,
      form,
      pid,
    } = this.props

    const { isSpecial, attr1, contactPhoneName, currentRelationStep, contacts } = this.state
    const { getFieldDecorator, getFieldError, setFieldsValue, getFieldValue } = form
    item.contacts = item.contacts ? item.contacts : contacts
    Logger.log('item.contacts', item.contacts, contacts)
    return (
      <>
        <Text style={FormStyles.title}>Employment Details</Text>
        <View>
          {getFieldDecorator('loanPurpose', {
            initialValue: item.loanPurpose,
            rules: [{ required: true, message: I18n.t('User.loanPurpose.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.loanPurpose.label')}
              onValueChange={this._onLoanPurposeChange}
              error={getFieldError('loanPurpose')}
              data={loanPurposeEnum}
            />
          )}
        </View>
        <FormGap title={I18n.t('prompt.job')} />
        <View style={FormStyles.formitemGap}>
          {getFieldDecorator('socialStatus', {
            initialValue: item.socialStatus,
            rules: [{ required: true, message: I18n.t('User.socialStatus.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.socialStatus.label')}
              onValueChange={this._onSocialStatusChange}
              attr1={attr1}
              error={getFieldError('socialStatus')}
              data={socialStatusEnum}
            />
          )}
        </View>
        {!isSpecial && (
          <>
            <View style={FormStyles.formitemGap}>
              {getFieldDecorator('industry', {
                initialValue: item.industry,
                rules: [{ required: true, message: I18n.t('User.industry.required') }],
              })(
                <FloatingNormalPicker
                  label={I18n.t('User.industry.label')}
                  onValueChange={this._onIndustryChange}
                  error={getFieldError('industry')}
                  data={industryEnum}
                />
              )}
            </View>
            <View style={FormStyles.formitemGap}>
              {getFieldDecorator('company', {
                initialValue: item.company,
                rules: [{ required: true, message: I18n.t('User.companyName.required') }],
              })(
                <FloatingInput
                  label={I18n.t('User.companyName.label')}
                  error={getFieldError('company')}
                  onFocus={this._onCompanyFocus}
                  onBlur={this._onCompanyBlur}
                  onChangeText={this._onCompanyChange}
                />
              )}
            </View>
            <View style={FormStyles.formitemGap}>
              {getFieldDecorator('jobPosition', {
                initialValue: item.jobPosition,
                rules: [{ required: true, message: I18n.t('User.jobPosition.required') }],
              })(
                <FloatingInput
                  label={I18n.t('User.jobPosition.label')}
                  error={getFieldError('jobPosition')}
                  onFocus={this._onJobPositionFocus}
                  onBlur={this._onJobPositionBlur}
                  onChangeText={this._onJobPositionChange}
                />
              )}
            </View>
            <View style={FormStyles.formitemGap}>
              {getFieldDecorator('monthlyIncome', {
                initialValue: item.monthlyIncome,
                rules: [{ required: true, message: I18n.t('User.monthlyIncome.placeholder') }],
              })(
                <FloatingInput
                  label={I18n.t('User.monthlyIncome.label')}
                  error={getFieldError('monthlyIncome')}
                  type="number"
                  onFocus={this._onMonthlyIncomeFocus}
                  onBlur={this._onMonthlyIncomeBlur}
                  onChangeText={this._onMonthlyIncomeChange.bind(this)}
                />
              )}
            </View>
            <View style={FormStyles.formitemGap}>
              {getFieldDecorator('incumbency', {
                initialValue: item.incumbency,
                rules: [{ required: true, message: I18n.t('User.incumbency.required') }],
              })(
                <FloatingNormalPicker
                  label={I18n.t('User.incumbency.label')}
                  error={getFieldError('incumbency')}
                  onValueChange={this._onIncumbencyChange}
                  data={incumbencyEnum}
                />
              )}
            </View>
            <View>
              {getFieldDecorator('companyPhone', {
                initialValue: item.companyPhone,
                rules: [
                  { required: true, message: I18n.t('User.companyPhone.required') },
                  { pattern: Reg.COMPANYPHONE_REGEX, message: I18n.t('User.companyPhone.invalid') },
                ],
              })(
                <FloatingInput
                  label={I18n.t('User.companyPhone.label')}
                  type="tel"
                  maxLength={11}
                  error={getFieldError('companyPhone')}
                  onFocus={this._onCompanyPhoneFocus}
                  onBlur={this._onCompanyPhoneBlur}
                  onChangeText={this._onCompanyPhoneChange}
                />
              )}
            </View>
          </>
        )}
        <FormGap title={I18n.t('prompt.relation')} />
        <View style={styles.container}>
          <TouchableHighlight
            onPress={() => {
              this.handleMultiRelationFormChange()
              this.setState({
                currentRelationStep: 1,
              })
            }}>
            <View style={currentRelationStep >= 1 ? styles.textWrapActive : styles.textWrap}>
              <Text style={currentRelationStep >= 1 ? styles.textActive : styles.text}>1</Text>
            </View>
          </TouchableHighlight>
          <View style={currentRelationStep > 1 ? styles.gapActive : styles.gap} />
          <TouchableHighlight
            onPress={() => {
              this.handleMultiRelationFormChange()
              this.setState({
                currentRelationStep: 2,
              })
            }}>
            <View style={currentRelationStep >= 2 ? styles.textWrapActive : styles.textWrap}>
              <Text style={currentRelationStep >= 2 ? styles.textActive : styles.text}>2</Text>
            </View>
          </TouchableHighlight>
          <View style={currentRelationStep > 2 ? styles.gapActive : styles.gap} />
          <TouchableHighlight
            onPress={() => {
              this.handleMultiRelationFormChange()
              this.setState({
                currentRelationStep: 3,
              })
            }}>
            <View style={currentRelationStep >= 3 ? styles.textWrapActive : styles.textWrap}>
              <Text style={currentRelationStep >= 3 ? styles.textActive : styles.text}>3</Text>
            </View>
          </TouchableHighlight>
        </View>
        {currentRelationStep === 1 && (
          <MultiRelation
            relationShipEnum={relationShipEnum}
            contactPhoneName={contactPhoneName}
            item={item.contacts[0] || {}} // FIXME 老用户一个联系人
            getFieldDecorator={getFieldDecorator}
            getFieldError={getFieldError}
            setFieldsValue={setFieldsValue}
            getFieldValue={getFieldValue}
            pid={pid}
            currentRelationStep={currentRelationStep}
          />
        )}
        {currentRelationStep === 2 && (
          <MultiRelation
            relationShipEnum={relationShipEnum}
            contactPhoneName={contactPhoneName}
            item={item.contacts[1] || {}}
            getFieldDecorator={getFieldDecorator}
            getFieldError={getFieldError}
            setFieldsValue={setFieldsValue}
            getFieldValue={getFieldValue}
            pid={pid}
            currentRelationStep={currentRelationStep}
          />
        )}
        {currentRelationStep === 3 && (
          <MultiRelation
            relationShipEnum={relationShipEnum}
            contactPhoneName={contactPhoneName}
            item={item.contacts[2] || {}}
            getFieldDecorator={getFieldDecorator}
            getFieldError={getFieldError}
            setFieldsValue={setFieldsValue}
            getFieldValue={getFieldValue}
            pid={pid}
            currentRelationStep={currentRelationStep}
          />
        )}
        <Button
          type="ghost"
          disabled={submitLoading}
          loading={submitLoading}
          size="large"
          onPress={this.submit.bind(this)}
          title={I18n.t('common.apply.continue')}>
          {Constants.CONTINUE}
        </Button>
      </>
    )
  }
}

export default createForm()(App)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 36,
    alignItems: 'center',
  },
  textWrap: {
    borderColor: '#D5D5D5',
    borderWidth: 3 / 2,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 67 / 3,
    paddingVertical: 45 / 3,
  },
  textWrapActive: {
    borderWidth: 3 / 2,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 67 / 3,
    paddingVertical: 45 / 3,
    borderColor: '#00A24D',
  },
  textActive: {
    fontSize: 24,
    fontFamily: 'ArialRoundedMTBold',
    color: '#00A24D',
  },
  text: {
    fontSize: 24,
    color: '#D5D5D5',
    fontFamily: 'ArialRoundedMTBold',
  },
  gap: {
    width: 18,
    height: 1.5,
    backgroundColor: '#D5D5D5',
    borderRadius: 1,
  },
  gapActive: {
    width: 18,
    height: 1.5,
    backgroundColor: '#00A24D',
    borderRadius: 1,
  },
})
