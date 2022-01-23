export { default as Behavior } from './behavior'
export { MMKV } from './storage'
export {
  REGEX_PHONE,
  REGEX_BANK_CARD,
  REGEX_BANK_CLABE,
  REGEX_COMPANYPHONE,
  REGEX_PASSWORD,
  REGEX_VALIDATE_CODE,
} from './reg'

/**
 * 过滤model中的Array字段
 * @param model
 * @returns
 */
export const filterArrayKey = (model: any) => {
  const val: { [key: string]: any } = {}
  Object.keys(model)
    .filter(k => k!.endsWith('Array'))
    .forEach(k => {
      val[k] = model[k]
    })
  return val
}
