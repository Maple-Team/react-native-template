#!/usr/bin/env node
import fs from 'fs'
import { Command } from 'commander'
import path from 'path'
import { Lang, write } from './utls'

type FieldValue = {
  label: string
  placeholder: string
  invalid: string
  required: string
}
/**
 * 读取已有的翻译文案
 * @param lang
 * @returns
 */
const getLanguagesFields = async (lang: Lang) => {
  return new Promise<Record<string, FieldValue>>((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, `../src/locales/languages/${lang}/field.json`),
      (err, content) => {
        if (err) {
          reject(err)
        } else {
          try {
            const json = JSON.parse(content.toString()) as Record<string, FieldValue>
            resolve(json)
          } catch (error) {
            reject(error)
          }
        }
      }
    )
  })
}

;(async () => {
  const program = new Command()
  program
    .option('-f, --field <fields...>', '需要增加的字段')
    .option('-l, --language <languages...>', '需要增加的语言')
  program.parse(process.argv)
  const fields = program.opts().field as string[]
  const languages = program.opts().language as Lang[]

  for (const language of languages) {
    const data: Record<string, FieldValue> = await getLanguagesFields(language)
    for (const field of fields) {
      if (!data[field]) {
        data[field] = {
          label: '',
          placeholder: '',
          invalid: '',
          required: '',
        }
      }
    }
    // 排序
    const result: Record<string, FieldValue> = {}
    Object.keys(data)
      .sort()
      .forEach(k => {
        result[k] = data[k]
      })
    await write(language, 'field', JSON.stringify(result))
  }
})()
