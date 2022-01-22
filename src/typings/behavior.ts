/**
 * 提取出页面ID编号类型
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PartialWords<S extends ALL_IDS> = S extends `${infer Pre}_${infer Rest}` ? `${Pre}` : S
/**
 * 获取匹配到的类型ID
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type MatchedIDs<T extends PAGE_ID, U extends ALL_IDS> = U extends `${T}_${infer Rest}`
  ? U
  : never
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

/**
 * 输入类型的ID
 * TODO 完善
 */
export type InputTypeID =
  | 'P02_C01_I_COMPANY'
  | 'P02_C02_I_COMPANYPHONE'
  | 'P02_C03_I_COMPANYADDRDETAIL' // P02
  | 'P03_C01_I_CONTACTNAME'
  | 'P03_C02_I_CONTACTNAME'
  | 'P03_C03_I_CONTACTNAME' // P03
  | 'P05_C01_I_FIRSTNAME'
  | 'P05_C02_I_MIDDLENAME'
  | 'P05_C03_I_LASTNAME'
  | 'P05_C04_I_IDCARD'
  | 'P05_C05_I_IHOMEADDRDETAIL'
  | 'P05_C06_I_BACKUPPHONE'
  | 'P05_C07_I_SOCIALPHONE'
  | 'P05_C08_I_WHATSAPP'
  | 'P05_C09_I_EMAIL'
  | 'P05_C10_I_SECONDCARDNO' // P05
  | 'P07_C01_I_BANKCARDNO' // P07

/**
 * 非输入类型，如下拉选择、checkbox等
 */
export type SelectTypeID =
  | 'P02_C01_S_INDUSTRYCODE'
  | 'P02_C02_S_JOBTYPECODE'
  | 'P02_C03_S_MONTHLYINCOME'
  | 'P02_C04_S_SALARYTYPE'
  | 'P02_C05_S_SALARYDATE'
  | 'P02_C06_S_STATE'
  | 'P02_C07_S_CITY'
  | 'P02_C08_S_INCUMBENCY' // P02
  | 'P03_C01_S_RELATIONSHIP'
  | 'P03_C02_S_CONTACTPHONE'
  | 'P03_C03_S_RELATIONSHIP'
  | 'P03_C04_S_CONTACTPHONE'
  | 'P03_C05_S_RELATIONSHIP'
  | 'P03_C06_S_CONTACTPHONE' // P03
  | 'P04_C01_S_XX1'
  | 'P04_C02_S_XX2' // P04
  | 'P05_C01_S_BIRTH'
  | 'P05_C02_S_GENDER'
  | 'P05_C03_S_MARITALSTATUS'
  | 'P05_C04_S_HOMEADDRPROVINCECODE'
  | 'P05_C05_S_HOMEADDRCITYCODE'
  | 'P05_C06_S_DOCTYPE'
  | 'P05_C07_S_EDUCATIONCODE'
  | 'P05_C08_S_LOANPURPOSE' // P05
  | 'P07_C01_S_BANKCODE' // P07

/**
 * 点击提交类型
 */
export type ClickTypeID =
  | 'P01_C98_B_SUBMIT'
  | 'P02_C98_B_SUBMIT'
  | 'P03_C98_B_SUBMIT'
  | 'P04_C98_B_SUBMIT'
  | 'P05_C98_B_SUBMIT'
  | 'P06_C98_B_SUBMIT'
  | 'P07_C98_B_SUBMIT'
  | 'P08_C98_B_SUBMIT'

/**
 * 页面ID
 */
export type PAGE_ID = PartialWords<EnterID | LeaveID>
/**
 * 行为model
 */
export interface BehaviorModel<T extends PAGE_ID> {
  applyId: string
  outerIp: string
  internalIp: string
  screenWidth: string
  screenHeight: string
  records: BehaviorRecords<T>[]
}
type ALL_IDS = EnterID | LeaveID | InputTypeID | SelectTypeID | ClickTypeID

/**
 * 行为记录model
 * NOTE 限制每页的id都以当前页的PAGE_ID开头
 */
export interface BehaviorRecords<T extends PAGE_ID> {
  id: MatchedIDs<T, ALL_IDS>
  oldValue?: string
  newValue?: string
  startTime?: string
  endTime?: string
  value?: string
}
