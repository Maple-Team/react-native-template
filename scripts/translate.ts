#!/usr/bin/env node
// import * as iconv from 'iconv-lite'
import { getContent } from './utls'
import { utils, writeFileXLSX } from 'xlsx'

/**
 * obj 2 array
 * {"a":"b", "c":{"a":"1", "b":"2"}}
 * @param map
 * @returns  data {"a":"b","c.a":"1", "c.b":"2"}
 */
//@ts-ignore
const obj2array = (map: Record<string, string>, prefix?: string) => {
  const keys = Object.keys(map)
  return keys.map(k => {
    const key = prefix ? `${prefix}.${k}` : k
    //@ts-ignore
    const value = map[k] as string
    return { [key]: value } as Record<string, string>
  })
}
;(async () => {
  const fileKeys = ['common', 'field', 'misc'] as const
  type FileKey = typeof fileKeys[number]
  const map: Record<FileKey, string> = {
    common: '通用',
    field: '字段',
    misc: '其他',
  }
  const workbook = utils.book_new()
  //@ts-ignore
  await fileKeys.reduce(async (prevOut: Promise<void>, k) => {
    return prevOut.then(async () => {
      const json_en_data = obj2array(await getContent('en', k)).reduce(
        (prev: Record<string, string>[], curr) => {
          prev.push(curr)
          return prev
        },
        []
      )
      const json_cn_data = obj2array(await getContent('cn', k)).reduce(
        (prev: Record<string, string>[], curr) => {
          prev.push(curr)
          return prev
        },
        []
      )
      const json_es_data = obj2array(await getContent('es', k)).reduce(
        (prev: Record<string, string>[], curr) => {
          prev.push(curr)
          return prev
        },
        []
      )
      const data = json_cn_data.map((item, index) => {
        const key = Object.keys(item)[0]
        return [key, json_en_data[index][key], item[key], json_es_data[index][key]]
      })
      data.unshift(['字段', '英文', '中文', '西班牙语'])
      const worksheet = utils.aoa_to_sheet(data)
      utils.book_append_sheet(workbook, worksheet, map[k])
      return
    })
  }, Promise.resolve())
  writeFileXLSX(workbook, 'translate/语言包.xlsx')
})()
