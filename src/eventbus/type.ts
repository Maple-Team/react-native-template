export const DictTypeArray = [
  'INDUSTRY',
  'PROFESSION',
  'MONTHLY_INCOME',
  'SALARY_TYPE',
  'WEEKLY',
  'MONTHLY',
  'DISTRICT',
  'INCUMBENCY',
  'RELATIONSHIP',
  'OTHER_RELATIONSHIP',
  'MARITAL_STATUS',
  'PRIMAARYID',
  'EDUCATION',
  'LOAN_PURPOSE',
  'CARD_NO_TYPE',
] as const
export const NormalTypeArray = [
  'LOGIN',
  'LOGOUT',
  'REGISTER',
  'APPLY',
  'RESET',
  'USER_INFO',
  'PRODUCT',
  'CALCULATE',
  'REPAY',
  'DEVICE_INFO',
  'IMAGE',
  'VALIDATE_CODE',
  'VERSION',
  'PV',
  'BRAND',
  'ORDER_LIST',
  'ORDER_DETAIL',
] as const

type NormalType = typeof NormalTypeArray[number]
type DictType = typeof DictTypeArray[number]

/**
 * dispatch type
 */
export type DispatchMapType = DictType | NormalType

// @ts-ignore
let _dispatchMap: Record<DispatchMapType, string> = {
  LOGIN: '/smart-loan/user/login',
  LOGOUT: '/smart-loan/user/logout',
  REGISTER: '/smart-loan/user/registeredUser',
  APPLY: '/smart-loan/apply/step',
  RESET: '/smart-loan/user/modify/password',
  USER_INFO: '/smart-loan/user/getUserInfo',
  PRODUCT: '/smart-loan/product/v1/getProduct',
  CALCULATE: '/smart-loan/contract/scheduleCalc',
  REPAY: 'boolean', //TODO
  DEVICE_INFO: '/smart-loan/login/deviceInfo',
  IMAGE: '/smart-loan/image/v2/oneImage',
  VALIDATE_CODE: '/smart-loan/app/getValidateCode',
  VERSION: '/smart-loan/app/version',
  PV: '/smart-loan/app/index',
  BRAND: '/smart-loan/system/brand',
  ORDER_LIST: '/smart-loan/contract/list',
  ORDER_DETAIL: '/smart-loan/contract/detail',
}

DictTypeArray.forEach(k => {
  _dispatchMap[k] = `/smart-loan/dictionary/${k}`
})
const _DispatchRvMap: Record<string, DispatchMapType> = {}
Object.keys(_dispatchMap).forEach(key => {
  _DispatchRvMap[_dispatchMap[key as DispatchMapType]] = key as DispatchMapType
})

/**
 * dispatch type与url映射map
 */
export const DispatchMap = _dispatchMap
/**
 * url与dispatch type映射map
 */
export const DispatchRVMap = _DispatchRvMap
