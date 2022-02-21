export type BOOL = 'Y' | 'N'

export type ImageType =
  | 'AUTH_VIDEO'
  | 'LIVENESS_IMAGE'
  | 'INE_OR_IFE_FRONT'
  | 'INE_OR_IFE_BACK'
  | 'HANDHELD_IDCARD'
import type { ObjectShape } from 'yup/lib/object'

export type ObjectShapeValues = ObjectShape extends Record<string, infer V> ? V : never
export type Shape<T extends Record<any, any>> = Partial<Record<keyof T, ObjectShapeValues>>
