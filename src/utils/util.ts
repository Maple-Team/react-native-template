export { default as getDevice } from './device'

export const toThousands = (number: number, thousandSeparator = ',') => {
  if (number === 0) {
    return number
  }
  return `${number}`.replace(/(?!^)(?=(\d{3})+$)/g, thousandSeparator)
}

export async function errorCaptured(func: Function) {
  try {
    const res = await func()
    return [null, res]
  } catch (e: unknown) {
    return [e, null]
  }
}
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
