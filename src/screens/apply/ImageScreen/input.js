import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { I18n, Logger } from '../../../utils'
import FloatingInput from '../../../components/form/FloatingInput'

export default class FormItemMaskInput extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const { value, error, label, maskType, onFocus, onBlur, ...rest } = this.props
    const { mask, type } = getMask(maskType)
    Logger.log({ mask, type, maskType })
    return (
      <FloatingInput
        mask={mask}
        type={type}
        label={I18n.t('User.idcard.label')}
        error={error}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        {...rest}
      />
    )
  }
}

function getMask(maskType) {
  let mask = ''
  let type = ''
  switch (maskType) {
    case 'PY05':
      mask = '99-9999999-9'
      type = 'number'
      break
    case 'PY06':
      mask = 'CRN-99999999999-9'
      type = 'number'
      break
    case 'PY02':
      mask = 'A-99-9999999-9'
      type = 'default'
      break
    case 'PY04':
      mask = '9999-9999-9999'
      type = 'number'
      break
    case 'PY03':
      mask = '9999-999'
      type = 'number'
      break
    case 'PY01':
      mask = 'SSSS-SSSSS'
      type = 'custom'
      break
    default:
      break
  }
  return { mask, type }
}

FormItemMaskInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.array,
}

export { getMask }
