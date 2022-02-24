#!/usr/bin/env node
import fs from 'fs'
import { isArray, isObjectLike } from 'lodash'
import path from 'path'
import * as iconv from 'iconv-lite'

// import { utils } from 'xlsx'

/**
 * 读取已有的翻译文案
 * @param lang
 * @returns
 */
const getContent = async (lang: string, filename: string) => {
  return new Promise<Record<string, string>>((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, `../src/locales/languages/${lang}/${filename}.json`),
      (err, content) => {
        if (err) {
          reject(err)
        } else {
          try {
            resolve(JSON.parse(content.toString()))
          } catch (error) {
            reject(error)
          }
        }
      }
    )
  })
}
/**
 * obj 2 array
 * {"a":"b", "c":{"a":"1", "b":"2"}}
 * @param map
 * @returns  data {"a":"b","c.a":"1", "c.b":"2"}
 */
//@ts-ignore
const obj2array = (map: Record<string, Record<string, string> | string>, prefix?: string) => {
  const keys = Object.keys(map)
  return keys.map(k => {
    if (isArray(map[k])) {
    } else if (isObjectLike(map[k])) {
      return obj2array(map[k] as Record<string, string>, k)
    } else {
      const key = prefix ? `${prefix}.${k}` : k
      //@ts-ignore
      const value = map[k] as string
      return { [key]: value } as Record<string, string>
    }
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

  //@ts-ignore
  fileKeys.reduce(async (prev1: any[], k) => {
    const json_en_data = (obj2array(await getContent('en', k)) as Record<string, string>[]).reduce(
      (prev, curr: Record<string, string>[] | Record<string, string>) => {
        if (isArray(curr)) {
          //@ts-ignore
          prev = prev.concat(curr)
        } else {
          //@ts-ignore
          prev.push(curr)
        }
        return prev
      },
      []
    )
    const json_cn_data = (obj2array(await getContent('cn', k)) as Record<string, string>[]).reduce(
      (prev, curr: Record<string, string>[] | Record<string, string>) => {
        if (isArray(curr)) {
          //@ts-ignore
          prev = prev.concat(curr)
        } else {
          //@ts-ignore
          prev.push(curr)
        }
        return prev
      },
      []
    )
    const data1 = json_cn_data.map((item, index) => {
      const key = Object.keys(item)[0]
      return [key, json_en_data[index][key], item[key]]
    })
    data1.unshift(['字段名', '英文', '中文'])
    fs.writeFileSync(`translate/${map[k]}.csv`, iconv.encode(data1.join('\r\n'), 'gb2312'))
    // const data = iconv.convert(data1.join('\r\n'))
    // utils.book_append_sheet(workbook, worksheet, sheetName)
    return prev1
  }, [])
  // console.log(data)
  // writeFileXLSX(workbook, 'a.xlsx')
})()
