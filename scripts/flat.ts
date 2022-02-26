#!/usr/bin/env node
import { isObject } from 'lodash'
import { getContent, Lang, write } from './utls'

const flat = (data: Record<string, string | Record<string, string>>) => {
  const keys = Object.keys(data)
  const newData: Record<string, string> = {}
  keys.forEach(key => {
    if (isObject(data[key])) {
      const subKeys = Object.keys(data[key])
      subKeys.forEach(subKey => {
        //@ts-ignore
        newData[`${key}.${subKey}`] = data[key][subKey] as string
      })
      delete data[key]
    }
  })
  const result = { ...data, ...newData }
  const _: Record<string, string> = {}

  Object.keys(result)
    .sort()
    .forEach((k: string) => {
      //@ts-ignore
      _[k] = result[k]
    })
  return _
}
;(async () => {
  const fileKeys = ['common', 'field', 'misc'] as const
  const languages: Lang[] = ['en', 'cn', 'es']

  languages.forEach(lang => {
    fileKeys.forEach(async file => {
      const content = await getContent(lang, file)
      write(lang, file, JSON.stringify(flat(content)))
    })
  })
})()
