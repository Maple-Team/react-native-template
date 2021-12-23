// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PartialWords<S extends string> = S extends `${infer Pre}_${infer Rest}` ? `${Pre}` : S
/**
 * 进入页面ID
 */
export type EnterID =
  | 'P01_C00'
  | 'P02_C00'
  | 'P03_C00'
  | 'P04_C00'
  | 'P05_C00'
  | 'P06_C00'
  | 'P07_C00'
  | 'P08_C00'
/**
 * 离开页面ID
 */
export type LeaveID =
  | 'P01_C99'
  | 'P02_C99'
  | 'P03_C99'
  | 'P04_C99'
  | 'P05_C99'
  | 'P06_C99'
  | 'P07_C99'
  | 'P08_C99'

P01_C01_I_FIRSTNAME
P01_C02_I_MIDDLENAME
P01_C03_I_LASTNAME
P01_C04_I_EMAIL
P01_C05_I_DATEBIRTH
P01_C06_S_GENDER
P01_C07_S_EDUCATION
P01_C08_S_MARITALSTATUS
P01_C09_S_RELIGION
P01_C10_S_STATE
P01_C11_S_CITY
P01_C12_I_DATAILEDADDRESS 
P01_C13_I_BACKUPPHONE
P01_C14_I_WHATSAPP
P01_C15_I_FACEBOOK
P01_C98_B_SUBMIT

P02_C01_S_MONTHLYINCOME
P02_C02_I_COMPANYNAME
P02_C03_I_COMPANYPHONE
P02_C04_S_STATE
P02_C05_S_CITY
P02_C06_S_COMPANYADDRESS
P02_C07_S_SALARYTYPE
P02_C08_S_PAYDATE
P02_C98_B_SUBMIT

P03_C01_S_RELATIONSHIP
P03_C02_I_CONTACTPHONE
P03_C03_S_RELATIONSHIP
P03_C04_I_CONTACTPHONE
P03_C05_S_RELATIONSHIP
P03_C06_I_CONTACTPHONE
P03_C98_B_SUBMIT

P04_C01_S_BANKNAME
P04_C02_I_BANKACCOUNTNO
P04_C03_I_ATMBANKCARDNO
P04_C98_B_MODIFY
P04_C98_B_SUBMIT
P05_C01_B_IDCARD
P05_C01_E_EXIF
P05_C02_B_HOLDIDCARD
P05_C02_E_EXIF
P05_C03_B_EMPLOYEEIDCARD
P05_C03_E_EXIF
P05_C04_B_VOTERCARD
P05_C04_E_EXIF
P05_C05_B_DRIVERLICENSE
P05_C05_E_EXIF
P05_C06_B_PASSPORT
P05_C06_E_EXIF
P05_C07_B_TAXCARD
P05_C07_E_EXIF
P05_C98_B_SUBMIT
P06_C01_S_LOANAMT
P06_C01_S_LOANDAYS
P06_C98_B_SUBMIT
/**
 * 输入类型的ID
 */
export type InputTypeId = 'P01_C00_I_USERNAME' | 'P01_C00_I_USERNAME'
/**
 * 非输入类型，如下拉选择、checkbox等
 */
export type SelectTypeId = 'P02_C04_S_STATE' | 'P02_C05_S_CITY'
/**
 * 页面ID
 */
export type PAGE_ID = PartialWords<EnterID | LeaveID>
/**
 * 行为model
 */
export interface BehaviorModel {
  applyId: string
  outerIp: string
  internalIp: string
  screenWidth: string
  screenHeight: string
  records: BehaviorRecords[]
}
/**
 * 行为记录model
 */
export interface BehaviorRecords {
  id: EnterID | LeaveID | InputTypeId | SelectTypeId
  oldValue?: string
  newValue?: string
  startTime?: string
  endTime?: string
  value?: string
}
