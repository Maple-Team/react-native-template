import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { Button } from '@ant-design/react-native'
import { createForm } from 'rc-form'
import { Form, Text } from '../../../components'
import { DA, I18n, Logger, Constants } from '../../../utils'
import __ from 'lodash'
import { FormStyles } from '../../../styles'
const { FloatingNormalPicker, FloatingInput } = Form
class App extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      detail: '',
    }
  }

  componentDidMount() {
    Logger.debug('address form componentDidMount')
  }
  componentWillUnmount() {
    Logger.log('[AddressScreen Form] componentWillUnmount')
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
      onOK(values)
    })
  }
  // 省份发生变化，引起城市和县区信息变化
  onProvinceChange = (obj, from) => {
    const {
      pid,
      form: { getFieldValue },
      _onProvinceChange,
    } = this.props
    const { code } = obj
    const homeAddrProvinceCode = getFieldValue('homeAddrProvinceCode')
    if (code === homeAddrProvinceCode && from === 'confirm') {
      return
    }
    DA.setModify(`${pid}_S_homeAddrProvinceCode`, code, homeAddrProvinceCode)
    _onProvinceChange(code)
  }
  // 城市发生变化，引起县区信息变化
  onCityChange = (obj, from) => {
    const {
      pid,
      form: { getFieldValue },
      _onCityChange,
    } = this.props
    const homeAddrCityCode = getFieldValue('homeAddrCityCode')
    const { code } = obj
    if (code === homeAddrCityCode && from === 'confirm') {
      return
    }
    DA.setModify(`${pid}_S_homeAddrCityCode`, code, homeAddrCityCode)
    _onCityChange(code)
  }
  onCountyChange = obj => {
    const {
      pid,
      form: { getFieldValue },
      _onCountyChange,
    } = this.props
    const { code } = obj
    DA.setModify(`${pid}_S_homeAddrCountyCode`, code, getFieldValue('homeAddrCountyCode'))
    _onCountyChange(code)
  }
  _onHowlongChange = obj => {
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    const { code, name } = obj
    DA.setModify(`${pid}_S_howLongStaying`, code, getFieldValue('howLongStaying'))
    setFieldsValue({ howLongStaying: code })
    this.setState({ howLongStayingName: name })
  }
  _onDetailFocus = () => {
    const { pid } = this.props
    DA.setStartModify(`${pid}_I_homeAddrDetail`, this.state.detail)
  }
  _onDetailBlur = () => {
    const { pid } = this.props
    DA.setEndModify(`${pid}_I_homeAddrDetail`, this.state.detail)
  }
  _onDetailChange = value => {
    this.setState({ detail: value })
    const { setFieldsValue } = this.props.form
    setFieldsValue({ homeAddrDetail: value })
  }
  render() {
    const {
      provinceEnum,
      cityEnum,
      countyEnum,
      howLongEnum,
      item,
      submitLoading,
      form,
    } = this.props
    const { getFieldDecorator, getFieldError } = form
    const { homeAddrProvinceCode, homeAddrCityCode, homeAddrCountyCode } = item
    Logger.info(countyEnum.length, { homeAddrCountyCode })
    return (
      <>
        <Text style={FormStyles.title}>Current (Present) Address</Text>
        <View style={FormStyles.formitemGap}>
          {getFieldDecorator('homeAddrProvinceCode', {
            initialValue: homeAddrProvinceCode,
            rules: [{ required: true, message: I18n.t('User.province.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.province.label')}
              onValueChange={this.onProvinceChange}
              error={getFieldError('homeAddrProvinceCode')}
              data={provinceEnum}
            />
          )}
        </View>
        <View style={FormStyles.formitemGap}>
          {getFieldDecorator('homeAddrCityCode', {
            initialValue: homeAddrCityCode,
            rules: [{ required: true, message: I18n.t('User.city.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.city.label')}
              onValueChange={this.onCityChange}
              error={getFieldError('homeAddrCityCode')}
              data={cityEnum}
            />
          )}
        </View>
        <View style={FormStyles.formitemGap}>
          {getFieldDecorator('homeAddrCountyCode', {
            initialValue: homeAddrCountyCode,
            rules: [{ required: true, message: I18n.t('User.county.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.county.label')}
              onValueChange={this.onCountyChange}
              error={getFieldError('homeAddrCountyCode')}
              data={countyEnum}
            />
          )}
        </View>
        <View style={FormStyles.formitemGap}>
          {getFieldDecorator('homeAddrDetail', {
            initialValue: item.homeAddrDetail,
            rules: [{ required: true, message: I18n.t('User.detailAddress.required') }],
          })(
            <FloatingInput
              label={I18n.t('User.detailAddress.label')}
              error={getFieldError('homeAddrDetail')}
              onFocus={this._onDetailFocus}
              onBlur={this._onDetailBlur}
              onChangeText={this._onDetailChange}
            />
          )}
        </View>
        <View style={FormStyles.formitemGap}>
          {getFieldDecorator('howLongStaying', {
            initialValue: item.howLongStaying,
            rules: [{ required: true, message: I18n.t('User.livingTime.required') }],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.livingTime.label')}
              onValueChange={this._onHowlongChange}
              error={getFieldError('howLongStaying')}
              data={howLongEnum}
            />
          )}
        </View>
        <Button
          type="ghost"
          loading={submitLoading}
          activeStyle={FormStyles.buttonActivityStyle}
          size="large"
          disabled={submitLoading}
          onPress={this.submit.bind(this)}
          title={I18n.t('common.apply.continue')}>
          {Constants.CONTINUE}
        </Button>
      </>
    )
  }
}

export default createForm()(App)
