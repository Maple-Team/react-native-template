import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { Button } from '@ant-design/react-native'
import { createForm } from 'rc-form'
import { DA, Logger, I18n, Constants } from '../../../utils'
import { Form, PhotoPicker, Text } from '../../../components'
import styles from './style'
import FormItemMaskInput, { getMask } from './input'
import { FormStyles } from '../../../styles'
import { MaskService } from 'react-native-masked-text'

const { FloatingNormalPicker, FormItemRadio } = Form

// Note 该页面与补件页面共用
class App extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props)
    const { secondCardNo } = props.item
    this.state = {
      hasSecondaryCardType: secondCardNo ? 'yes' : 'no',
      secondId_EXIF: '',
      selfId_EXIF: '',
      frontId_EXIF: '',
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // Logger.log('componentDidUpdate', prevProps.item, this.props.item)
    if (prevProps.item.secondCardNo !== this.props.item.secondCardNo) {
      const { secondCardNo } = this.props.item
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        hasSecondaryCardType: secondCardNo ? 'yes' : 'no',
      })
    }
  }
  submit = () => {
    const { form, onOK } = this.props
    form.validateFields((errors, values) => {
      Logger.log(values)
      if (errors) {
        return
      }
      const { frontId, selfId, secondId } = values
      values.images = [frontId, +selfId] //存储的活体照类型是string
      if (secondId) {
        values.images.push(secondId)
      } else {
        values.secondId = null // 置空之前填写的信息
      }
      Logger.log(values)
      const _idcard = values.idcard.replace(/-/g, '').replace(/CRN/g, '')
      values.idcard = _idcard
      if (values.secondCardNo) {
        const _secondCardNo = values.secondCardNo.replace(/-/g, '').replace(/CRN/g, '')
        values.secondCardNo = _secondCardNo
      }

      onOK(values)
    })
  }
  _onIdTypeChange = obj => {
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    const { code } = obj
    DA.setModify(`${pid}_S_primaryCardType`, code, getFieldValue('primaryCardType'))
    setFieldsValue({ primaryCardType: code, idcard: null })
  }
  _onIdcardFocus = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setStartModify(`${pid}_I_idcard`, getFieldValue('idcard'))
  }
  _onIdcardBlur = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setEndModify(`${pid}_I_idcard`, getFieldValue('idcard'))
  }
  _onIdcardChange = (value, rawText) => {
    Logger.debug('_onIdcardChange', { value, rawText })
    const { setFieldsValue } = this.props.form
    setFieldsValue({ idcard: value })
  }
  _onSecondIdTypeChange = obj => {
    const { pid, form } = this.props
    const { setFieldsValue, getFieldValue } = form
    const { code } = obj
    DA.setModify(`${pid}_S_secondCardType`, code, getFieldValue('secondCardType'))
    setFieldsValue({ secondCardType: code, secondCardNo: null })
  }
  _onSecondIdcardChange = (value, rawText) => {
    Logger.debug('onSecondIdcardChange', { value, rawText })
    const { setFieldsValue } = this.props.form
    setFieldsValue({ secondCardNo: value })
  }
  _onSecondIdcardFocus = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setStartModify(`${pid}_I_secondCardNo`, getFieldValue('secondCardNo'))
  }
  _onSecondIdcardBlur = () => {
    const {
      pid,
      form: { getFieldValue },
    } = this.props
    DA.setEndModify(`${pid}_I_secondCardNo`, getFieldValue('secondCardNo'))
  }
  onFrontUploadSuccess = (id, cb) => {
    Logger.log('onFrontUploadSuccess', id)
    const { setFieldsValue } = this.props.form
    setFieldsValue({ frontId: id })
    cb && cb()
  }
  onSelfieUploadSuccess = (id, cb) => {
    Logger.log('onSelfieUploadSuccess', id)
    const { setFieldsValue } = this.props.form
    setFieldsValue({ selfId: id })
    cb && cb()
  }
  onSecondFrontUploadSuccess = (id, cb) => {
    Logger.log('onSecondFrontUploadSuccess', id)
    const { setFieldsValue } = this.props.form
    setFieldsValue({ secondId: id })
    cb && cb()
  }
  onHasSecondaryCardTypeChange = value => {
    const {
      form: { setFieldsValue },
      pid,
    } = this.props
    Logger.log({ hasSecondaryCardType: value })
    setFieldsValue({ hasSecondaryCardType: value })
    DA.setModify(`${pid}_R_hasSecondaryCardType`, value, value === 'yes' ? 'no' : 'yes')
    this.setState({
      hasSecondaryCardType: value,
    })
  }
  reportExif = (value, type) => {
    const { pid } = this.props
    Logger.log(this.state)
    const oldExif = this.state[`${type}_EXIF`]
    if (type === 'frontId') {
      this.setState({
        frontId_EXIF: value,
      })
    }
    if (type === 'selfId') {
      this.setState({
        selfId_EXIF: value,
      })
    }
    if (type === 'secondId') {
      this.setState({
        secondId_EXIF: value,
      })
    }

    DA.setModify(`${pid}_I_${type}_EXIF`, value, oldExif)
  }

  render() {
    // Note showSecondCard 与补件页面共享组件，仅当前页面为true
    const { idTypeEnum, item, onExampleOpen, submitLoading, pid, form, showSecondCard } = this.props
    const { isSupplement } = item // Note 补件页面: true, 正常页面: undefined
    const { getFieldDecorator, getFieldError, getFieldValue } = form
    const primaryCardType = getFieldValue('primaryCardType') || item.primaryCardType
    const secondCardType = getFieldValue('secondCardType') || item.secondCardType
    const { hasSecondaryCardType } = this.state

    const primaryPattern = getPattern(primaryCardType)
    const secondPattern = getPattern(secondCardType)
    Logger.log({
      primaryPattern,
      secondPattern,
      hasSecondaryCardType,
    })
    const idcard = item.idcard
      ? MaskService.toMask('custom', item.idcard, {
          mask: getMask(primaryCardType).mask,
        })
      : ''
    const secondCardNo = item.idcard
      ? MaskService.toMask('custom', item.idcard, {
          mask: getMask(secondCardType).mask,
        })
      : ''
    Logger.log({ idcard, secondCardNo, p: item.primaryCardType })
    return (
      <>
        <Text style={FormStyles.title}>Upload ID Card Photo</Text>
        <View style={FormStyles.formitemGap}>
          {getFieldDecorator('primaryCardType', {
            initialValue: item.primaryCardType,
            rules: [
              {
                required: !isSupplement,
                message: I18n.t('User.idcardType.required'),
              },
            ],
          })(
            <FloatingNormalPicker
              label={I18n.t('User.idcardType.label')}
              onValueChange={this._onIdTypeChange.bind(this)}
              error={getFieldError('primaryCardType')}
              data={idTypeEnum}
              editable={!isSupplement}
            />
          )}
        </View>
        {(primaryCardType || item.idcard) && (
          <View style={FormStyles.formitemGap}>
            {getFieldDecorator('idcard', {
              initialValue: idcard,
              rules: [
                {
                  required: !isSupplement,
                  message: I18n.t('User.idcard.required'),
                },
                !isSupplement && {
                  pattern: primaryPattern,
                  message: I18n.t('User.idcard.invalid'),
                },
              ],
            })(
              <FormItemMaskInput
                label={I18n.t('User.idcard.label')}
                error={getFieldError('idcard')}
                onFocus={this._onIdcardFocus}
                onBlur={this._onIdcardBlur}
                maskType={primaryCardType}
                editable={!isSupplement}
                onChangeText={this._onIdcardChange}
              />
            )}
          </View>
        )}
        <View style={styles.idcardContainer}>
          <View style={styles.idcardHeader}>
            <Text style={styles.title}>{I18n.t('User.idcardFront.label')}*</Text>
            <Text style={styles.example} onPress={onExampleOpen}>
              {I18n.t('common.example')}
            </Text>
          </View>
          <View style={styles.selfContent}>
            {getFieldDecorator('frontId', {
              initialValue: null,
              rules: [{ required: true, message: I18n.t('User.idcardFront.required') }],
            })(
              <PhotoPicker
                imageType="IDCARD_FRONT"
                onUploadSuccess={this.onFrontUploadSuccess.bind(this)}
                isSupplement={isSupplement ? 'Y' : 'N'}
                bg={require('../../../assets/images/image/idcardSample.png')}
                cameraType="back"
                pid={pid}
                reportExif={value => this.reportExif(value, 'frontId')}
                hint={I18n.t('prompt.image.idcardHint')}
                error={getFieldError('frontId')}
              />
            )}
          </View>
        </View>
        <View style={styles.selfContainer}>
          <View style={styles.selfHeader}>
            <Text style={styles.title}>{'Take a selfie*'}</Text>
          </View>
          <View style={styles.selfContent}>
            {getFieldDecorator('selfId', {
              initialValue: null,
              rules: [{ required: true, message: I18n.t('User.selfId.required') }],
            })(
              <PhotoPicker
                imageType="HANDHELD_IDCARD"
                onUploadSuccess={this.onSelfieUploadSuccess.bind(this)}
                isSupplement={isSupplement ? 'Y' : 'N'}
                bg={require('../../../assets/images/image/selfSample.png')}
                cameraType="front"
                pid={pid}
                reportExif={value => this.reportExif(value, 'selfId')}
                hint={I18n.t('prompt.image.selfWarn')}
                error={getFieldError('selfId')}
              />
            )}
          </View>
        </View>
        {showSecondCard && (
          <>
            <View style={styles.paddingVertical20}>
              <View style={styles.paddingBottom20}>
                <Text>Provide additional document may increase the approve rate! Upload now?</Text>
              </View>
              <View>
                {getFieldDecorator('hasSecondaryCardType', {
                  initialValue: hasSecondaryCardType,
                })(
                  <FormItemRadio
                    label={'hasSecondaryCardType'}
                    data={hasSecondaryCardTypeArr}
                    onChange={this.onHasSecondaryCardTypeChange.bind(this)}
                    error={getFieldError('hasSecondaryCardType')}
                  />
                )}
              </View>
            </View>
            {hasSecondaryCardType === 'yes' && (
              <>
                <Text style={[FormStyles.title, styles.paddingTop0]}>
                  Information of other IDs*
                </Text>
                <View style={FormStyles.formitemGap}>
                  {getFieldDecorator('secondCardType', {
                    initialValue: item.secondCardType,
                    rules: [{ required: true, message: I18n.t('User.idcardType.required') }],
                  })(
                    <FloatingNormalPicker
                      label={I18n.t('User.idcardType.label')}
                      onValueChange={this._onSecondIdTypeChange.bind(this)}
                      error={getFieldError('secondCardType')}
                      data={idTypeEnum}
                    />
                  )}
                </View>
                {(secondCardType || item.secondCardNo) && (
                  <View style={FormStyles.formitemGap}>
                    {getFieldDecorator('secondCardNo', {
                      initialValue: secondCardNo,
                      rules: [
                        { required: true, message: I18n.t('User.idcard.required') },
                        { pattern: secondPattern, message: I18n.t('User.idcard.invalid') },
                      ],
                    })(
                      <FormItemMaskInput
                        label={'Other Idcard'}
                        error={getFieldError('secondCardNo')}
                        onFocus={this._onSecondIdcardFocus}
                        onBlur={this._onSecondIdcardBlur}
                        maskType={secondCardType}
                        onChangeText={this._onSecondIdcardChange}
                      />
                    )}
                  </View>
                )}
                <View style={styles.idcardContainer}>
                  <View style={styles.idcardHeader}>
                    <Text style={styles.title}>{I18n.t('User.idcardFront.label')}</Text>
                    <Text style={styles.example} onPress={onExampleOpen}>
                      {I18n.t('common.example')}
                    </Text>
                  </View>
                  <View style={styles.selfContent}>
                    {getFieldDecorator('secondId', {
                      initialValue: null,
                      rules: [{ required: true, message: I18n.t('User.idcardFront.required') }],
                    })(
                      <PhotoPicker
                        imageType="SECOND_CARD"
                        onUploadSuccess={this.onSecondFrontUploadSuccess.bind(this)}
                        isSupplement="N"
                        reportExif={value => this.reportExif(value, 'secondId')}
                        bg={require('../../../assets/images/image/idcardSample.png')}
                        cameraType="back"
                        pid={pid}
                        hint={I18n.t('prompt.image.idcardHint')}
                        error={getFieldError('secondId')}
                      />
                    )}
                  </View>
                </View>
              </>
            )}
          </>
        )}
        <Button
          type="ghost"
          disabled={submitLoading}
          loading={submitLoading}
          size="large"
          onPress={this.submit}
          title={I18n.t('common.apply.continue')}>
          {Constants.CONTINUE}
        </Button>
      </>
    )
  }
}

export default createForm()(App)

const hasSecondaryCardTypeArr = [
  {
    label: 'No',
    size: 22,
    value: 'no',
    color: '#7B7B7B',
    actColor: '#00A24D',
    selected: true,
    backgroundColor: '#F8F8F8',
  },
  {
    label: 'Yes',
    size: 22,
    value: 'yes',
    color: '#7B7B7B',
    selected: false,
    actColor: '#00A24D',
    backgroundColor: '#F8F8F8',
  },
]

const getPattern = type => {
  let pattern
  switch (type) {
    case 'PY05':
      pattern = new RegExp('^[0-9]{2}-[0-9]{7}-[0-9]$')
      break
    case 'PY06':
      pattern = new RegExp('^CRN-[0-9]{11}-[0-9]$')
      break
    case 'PY02':
      pattern = new RegExp('^[a-zA-Z]-[0-9]{2}-[0-9]{7}-[0-9]$')
      break
    case 'PY04':
      pattern = new RegExp('^[0-9]{4}-[0-9]{4}-[0-9][0]{3}$')
      break
    case 'PY03':
      pattern = new RegExp('^[0-9]{4}-[0-9]{3}$')
      break
    case 'PY01':
      pattern = new RegExp('^[0-9a-zA-Z]{4}-[0-9a-zA-Z]{5}$')
      break
    default:
      break
  }
  return pattern
}
