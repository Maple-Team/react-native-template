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
