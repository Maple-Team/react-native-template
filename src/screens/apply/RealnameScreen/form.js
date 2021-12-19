import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import formStyles from '../../../styles/formStyles'
import StyleSheet from 'react-native-adaptive-stylesheet'
import { Button } from '@ant-design/react-native'
import { createForm } from 'rc-form'
import { Form, Text } from '../../../components'
import { DA, Reg, I18n, Logger } from '../../../utils'
import dayjs from 'dayjs'
import __ from 'lodash'
import FBLoginButton from './FBLoginButton'

const { FloatingDatePicker, FloatingNormalPicker, FloatingInput, FormItemRadio } = Form

class App extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      hasBinding: false,
    }
  }
  componentWillUnmount() {
    Logger.log('[RealnameScreen Form] componentWillUnmount')
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
      const { firstName, middleName, lastName } = values
      let name
      if (middleName) {
        name = `${firstName} ${middleName} ${lastName}`
      } else {
        name = `${firstName} ${lastName}`
      }
      values.name = name
      onOK(values)
    })
  }
  onBirhChange = value => {
    const _value = dayjs(value).format('YYYY-MM-DD')
    const {
      pid,
      form: { setFieldsValue, getFieldValue },
    } = this.props
    DA.setModify(`${pid}_S_Birth`, _value, getFieldValue('birth'))
    setFieldsValue({ birth: _value })
  }
  onGenderChange = checked => {
    const {
      pid,
      form: { setFieldsValue, getFieldValue },
    } = this.props
    DA.setModify(`${pid}_R_Gender`, checked, getFieldValue('sex'))
    setFieldsValue({ sex: checked })
  }
  onEducationChange = obj => {
    const {
      pid,
      form: { setFieldsValue, getFieldValue },
    } = this.props
    DA.setModify(`${pid}_S_educationCode`, obj.code, getFieldValue('educationCode'))
    setFieldsValue({ educationCode: obj.code })
  }
  onMaritalChange = obj => {
    const {
      pid,
      form: { setFieldsValue, getFieldValue },
    } = this.props
    DA.setModify(`${pid}_S_maritalStatus`, obj.code, getFieldValue('maritalStatus'))
    setFieldsValue({ maritalStatus: obj.code })
  }
  onReligionChange = obj => {
    const {
      pid,
      form: { setFieldsValue, getFieldValue },
    } = this.props
    DA.setModify(`${pid}_S_religionCode`, obj.code, getFieldValue('religionCode'))
    setFieldsValue({ religionCode: obj.code })
  }
  _onEmailFocus = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setStartModify(`${pid}_I_email`, getFieldValue('email'))
  }
  _onEmailBlur = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setEndModify(`${pid}_I_email`, getFieldValue('email'))
  }
  _onEmailChange = value => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({ email: value })
  }
  updateFBbindStatus = value => {
    this.setState({
      hasBinding: value,
    })
  }
  render() {
    const {
      educationEnum,
      maritalEnum,
      // religionEnum,
      item,
      form,
      submitLoading,
      pid,
      applyId,
    } = this.props
    const { getFieldDecorator, getFieldError, setFieldsValue, getFieldValue } = form
    const { hasBinding } = this.state
    return (
      <>
        <Text style={formStyles.title}>Personal Information</Text>
        <Text style={{ paddingBottom: 5 }}>Your Name</Text>
        <View style={formStyles.nameWrap}>
          {getFieldDecorator('firstName', {
            initialValue: item.firstName,
            rules: [
              { required: true, message: I18n.t('User.firstName.required') },
              {
                pattern: Reg.USERNAME_REGEX,
                message: I18n.t('User.firstName.invalid'),
              },
            ],
          })(
            <FloatingInput
              containerStyle={styles.nameForm}
              label={'First Name'}
              error={getFieldError('firstName')}
              onChangeText={value => setFieldsValue({ firstName: value })}
              onFocus={() => DA.setStartModify(`${pid}_I_FirstName`, getFieldValue('firstName'))}
              onBlur={() => DA.setEndModify(`${pid}_I_FirstName`, getFieldValue('firstName'))}
            />
          )}
          {getFieldDecorator('middleName', {
            initialValue: item.middleName,
            rules: [
              {
                pattern: Reg.USERNAME_REGEX,
                message: I18n.t('User.middleName.invalid'),
              },
            ],
          })(
            <FloatingInput
              containerStyle={styles.nameForm}
              required={false}
              label={'Middle Name'}
              error={getFieldError('middleName')}
              onChangeText={value => setFieldsValue({ middleName: value })}
              onFocus={() => DA.setStartModify(`${pid}_I_MiddleName`, getFieldValue('middleName'))}
              onBlur={() => DA.setEndModify(`${pid}_I_MiddleName`, getFieldValue('middleName'))}
            />
          )}
          {getFieldDecorator('lastName', {
            initialValue: item.lastName,
            rules: [
              { required: true, message: I18n.t('User.lastName.required') },
              {
                pattern: Reg.USERNAME_REGEX,
                message: I18n.t('User.lastName.invalid'),
              },
            ],
          })(
            <FloatingInput
              containerStyle={styles.nameForm}
              label={'Last Name'}
              error={getFieldError('lastName')}
              onChangeText={value => setFieldsValue({ lastName: value })}
              onFocus={() => DA.setStartModify(`${pid}_I_LastName`, getFieldValue('lastName'))}
              onBlur={() => DA.setEndModify(`${pid}_I_LastName`, getFieldValue('lastName'))}
            />
          )}
        </View>
        <View style={formStyles.formitemGap}>
          {getFieldDecorator('birth', {
            initialValue: item.birth,
            rules: [{ required: true, message: I18n.t('User.birthday.required') }],
          })(
            <FloatingDatePicker
              label={I18n.t('User.birthday.label')}
              dateType="birth"
              onConfirm={this.onBirhChange}
              error={getFieldError('birth')}
            />
          )}
        </View>
        <View style={formStyles.formitemGap}>
          {getFieldDecorator('sex', {
            initialValue: item.sex,
            rules: [{ required: true, message: I18n.t('User.gender.required') }],
          })(
            <FormItemRadio
              label={I18n.t('User.gender.label')}
              data={genderArr}
              onChange={this.onGenderChange}
              error={getFieldError('sex')}
            />
          )}
        </View>
        <View style={formStyles.formitemGap}>
          {getFieldDecorator('educationCode', {
            initialValue: item.educationCode,
            rules: [{ required: true, message: I18n.t('User.educationLevel.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.educationLevel.label')}
              onValueChange={this.onEducationChange}
              error={getFieldError('educationCode')}
              data={educationEnum}
            />
          )}
        </View>
        <View style={formStyles.formitemGap}>
          {getFieldDecorator('maritalStatus', {
            initialValue: item.maritalStatus,
            rules: [{ required: true, message: I18n.t('User.maritalStatus.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.maritalStatus.label')}
              onValueChange={this.onMaritalChange}
              error={getFieldError('maritalStatus')}
              data={maritalEnum}
            />
          )}
        </View>
        {/* <View style={formStyles.formitemGap}>
          {getFieldDecorator('religionCode', {
            initialValue: item.religionCode,
            rules: [{ required: true, message: I18n.t('User.religion.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.religion.label')}
              onValueChange={this.onReligionChange}
              error={getFieldError('religionCode')}
              data={religionEnum}
            />
          )}
        </View> */}
        <View style={formStyles.formitemGap}>
          {getFieldDecorator('email', {
            initialValue: item.email,
            rules: [
              { required: true, message: I18n.t('User.email.required') },
              {
                pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,7})$/,
                message: I18n.t('User.email.invalid'),
              },
            ],
          })(
            <FloatingInput
              label={I18n.t('User.email.label')}
              error={getFieldError('email')}
              type="email"
              onFocus={this._onEmailFocus}
              onBlur={this._onEmailBlur}
              onChangeText={this._onEmailChange}
            />
          )}
        </View>
        <View style={styles.fbContainer}>
          <Text style={styles.fbHint}>
            Connect with your social account will help increase your credited amount{' '}
          </Text>
          <FBLoginButton
            updateFBbindStatus={this.updateFBbindStatus.bind(this)}
            hasBinding={hasBinding}
            applyId={applyId}
          />
        </View>
        <Button
          type="ghost"
          size="large"
          onPress={this.submit.bind(this)}
          loading={submitLoading}
          disabled={submitLoading}
          title={I18n.t('common.apply.continue')}>
          Continue
        </Button>
      </>
    )
  }
}

export default createForm()(App)

const genderArr = [
  {
    label: 'Male',
    size: 22,
    value: 'male',
    color: '#7B7B7B',
    actColor: '#00A24D',
    selected: false,
    source: require('../../../assets/images/home/male.png'),
  },
  {
    label: 'Female',
    size: 22,
    value: 'female',
    color: '#7B7B7B',
    actColor: '#00A24D',
    selected: false,
    source: require('../../../assets/images/home/female.png'),
  },
]
const styles = StyleSheet.create({
  nameForm: {
    width: 100,
  },
  formFooterText: {
    color: '#323232',
    textAlign: 'center',
    paddingBottom: 16,
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 13,
  },
  fbContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 17,
    paddingHorizontal: 25,
  },
  fbHint: {
    fontFamily: 'ArialRoundedMTBold',
    color: '#323232',
    fontSize: 13,
    marginBottom: 13,
  },
})
