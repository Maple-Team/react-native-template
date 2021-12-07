import React, { useEffect, useState } from 'react'
import { View, Platform } from 'react-native'
import { Toast } from '@ant-design/react-native'
import { selectContactPhone } from 'react-native-select-contact'
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions'
import { Form, PermissionModal, OpenSettingModal } from '../../../components'
import { FormStyles } from '../../../styles'
import { DA, I18n, Logger, Reg, Constants, errorCaptured } from '../../../utils'

const getContactsPermissionName = () =>
  Platform.OS === 'android' ? PERMISSIONS.ANDROID.READ_CONTACTS : PERMISSIONS.IOS.CONTACTS

const { FloatingNormalPicker, FloatingInput, FloatingPhoneInput } = Form

export default ({
  item,
  getFieldDecorator,
  getFieldError,
  setFieldsValue,
  relationShipEnum,
  getFieldValue,
  pid,
  currentRelationStep,
}) => {
  const [showSettingVisible, setSettingVisible] = useState(false)
  const [contactPermissionVisible, setContactPermissionVisible] = useState(false)
  const [contactPhoneName, setContactPhoneName] = useState(item.contactPhone)

  useEffect(() => {
    setContactPhoneName(item.contactPhone)
  }, [item.contactPhone])
  const _onContactNameChange = value => {
    setFieldsValue({ [`contactName${currentRelationStep}`]: value })
  }
  const _onContactNameFocus = () => {
    DA.setStartModify(
      `${pid}_I_contactName_${currentRelationStep}`,
      getFieldValue(`contactName${currentRelationStep}`)
    )
  }
  const _onContactNameBlur = () => {
    DA.setEndModify(
      `${pid}_I_contactName_${currentRelationStep}`,
      getFieldValue(`contactName${currentRelationStep}`)
    )
  }
  const _onContactPhoneFocus = () => {
    DA.setStartModify(
      `${pid}_I_contactPhone_${currentRelationStep}`,
      getFieldValue(`contactPhone${currentRelationStep}`)
    )
  }
  const _onContactPhoneBlur = () => {
    // DA.setEndModify(
    //   `${pid}_I_contactPhone_${currentRelationStep}`,
    //   getFieldValue(`contactPhone${currentRelationStep}`)
    // )
  }
  const queryContactPermission = async () => {
    // 1.检查权限
    const [err, res] = await errorCaptured(() => check(getContactsPermissionName()))
    Logger.log('queryContactPermission', err, res)
    if (err) {
      return // 检查权限出错
    }
    // 2. 判断结果
    switch (res) {
      case RESULTS.UNAVAILABLE:
        Toast.fail('This feature is not available (on this device / in this context)')
        break
      case RESULTS.DENIED:
        setContactPermissionVisible(true)
        break
      case RESULTS.GRANTED:
        onSelectContacts()
        break
      case RESULTS.BLOCKED:
      default:
        setSettingVisible(true)
        break
    }
  }
  const _onContactRelationChange = obj => {
    const { code } = obj
    DA.setModify(
      `${pid}_S_contactRelationCode_${currentRelationStep}`,
      code,
      getFieldValue(`contactRelationCode${currentRelationStep}`)
    )
    setFieldsValue({ [`contactRelationCode${currentRelationStep}`]: code })
  }

  const onSelectContacts = async () => {
    const selection = await selectContactPhone()
    if (!selection) {
      return
    }
    const { selectedPhone } = selection
    const contactPhone = selectedPhone.number
    const _value = contactPhone.replace(/\s/g, '')
    setContactPhoneName(_value)
    Logger.log('_onContactPhoneBlur', _value)
    DA.setEndModify(
      `${pid}_I_contactPhone_${currentRelationStep}`,
      getFieldValue(`contactPhone${currentRelationStep}`)
    )
    setFieldsValue({ [`contactPhone${currentRelationStep}`]: _value })
  }

  const _openSetting = async () => {
    openSettings().then(() => {
      setSettingVisible(false)
    })
  }
  const requestContactPermission = async () => {
    setContactPermissionVisible(false)
    const [err, res] = await errorCaptured(() => request(getContactsPermissionName()))
    Logger.log('requestContactPermission', err, res)
    if (err) {
      return // 拿权限出错
    }
    if (res !== RESULTS.GRANTED) {
      queryContactPermission()
    } else {
      onSelectContacts()
    }
  }
  Logger.log({
    item,
    currentRelationStep,
  })
  return (
    <>
      <View style={FormStyles.formitemGap}>
        {getFieldDecorator(`contactName${currentRelationStep}`, {
          initialValue: item.contactName,
          rules: [
            { required: true, message: I18n.t('User.relativeName.required') },
            { pattern: Reg.USERNAME_REGEX, message: I18n.t('User.relativeName.invalid') },
          ],
        })(
          <FloatingInput
            label={I18n.t('User.relativeName.label')}
            error={getFieldError(`contactName${currentRelationStep}`)}
            onFocus={_onContactNameFocus}
            onBlur={_onContactNameBlur}
            onChangeText={_onContactNameChange}
          />
        )}
      </View>
      <View style={FormStyles.formitemGap}>
        {getFieldDecorator(`contactPhone${currentRelationStep}`, {
          initialValue: item.contactPhone,
          rules: [{ required: true, message: I18n.t('User.relativePhone.required') }],
        })(
          <FloatingPhoneInput
            label={I18n.t('User.relativePhone.label')}
            error={getFieldError(`contactPhone${currentRelationStep}`)}
            onFocus={_onContactPhoneFocus}
            onBlur={_onContactPhoneBlur}
            onPress={() => {
              queryContactPermission()
              _onContactPhoneFocus()
            }}
            name={contactPhoneName}
            visible={contactPermissionVisible} // 箭头状态指示flag
          />
        )}
      </View>
      <View style={FormStyles.formitemGap}>
        {getFieldDecorator(`contactRelationCode${currentRelationStep}`, {
          initialValue: item.contactRelationCode,
          rules: [{ required: true, message: I18n.t('User.relationship.required') }],
        })(
          <FloatingNormalPicker
            label={I18n.t('User.relationship.label')}
            onValueChange={_onContactRelationChange}
            error={getFieldError(`contactRelationCode${currentRelationStep}`)}
            data={relationShipEnum}
          />
        )}
      </View>
      {contactPermissionVisible && (
        <PermissionModal
          title="Contacts"
          icon={require('../../../assets/images/permission/contacts.png')}
          onPress={requestContactPermission}
          onDenyPress={() => setContactPermissionVisible(false)}
          visible={true}
          content={Constants.PermissionContent.contacts.content}
          hint={Constants.PermissionContent.contacts.hint}
        />
      )}
      {showSettingVisible && <OpenSettingModal onPress={_openSetting} />}
    </>
  )
}
