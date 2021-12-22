import getDevice from './device'
import DA from './behavior'

const toThousands = (number: number, thousandSeparator = ',') => {
  let num = (number || 0).toString()
  let result = ''
  while (num.length > 3) {
    result = thousandSeparator + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  return result
}

const getKeyboardType = (type: string) => {
  let _type = 'default'
  switch (type) {
    case 'email':
      _type = 'email-address'
      break
    case 'tel':
      _type = 'phone-pad'
      break
    case 'decimal':
    case 'number':
      _type = `${type}-pad`
      break
    default:
      break
  }
  return _type
}
export async function errorCaptured(func: Function) {
  try {
    const res = await func()
    return [null, res]
  } catch (e: unknown) {
    return [e, null]
  }
}

export { getDevice, toThousands, DA, getKeyboardType }
