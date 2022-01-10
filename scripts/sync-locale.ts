#!/usr/bin/env node
import fs from 'fs'
import beautify from 'js-beautify'
import { Command } from 'commander'
import path from 'path'

//FIXME
const languages = [
  'en',
  // 'cn' 默认语言以此为准
]

/**
 * 读取已有的中文翻译文案
 * @param lang
 * @returns
 */
const getCNdata = async (filename: string) => {
  return getContent('cn', filename)
}
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
 * 更新翻译文案
 * @param lang
 * @param data
 * @returns
 */
const write = async (lang: string, data: string, filename: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(
      path.resolve(__dirname, `../src/locales/languages/${lang}/${filename}.json`),
      beautify(data, { indent_size: 2, space_in_empty_paren: true }),
      err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

;(async () => {
  const program = new Command()
  program.option('-f, --files [files...]', '需要同步的文件')
  program.parse(process.argv)
  const files = (program.opts().files as string[] | undefined) || [
    'apply',
    'common',
    'misc',
    'user',
  ]
  for (let file of files) {
    const cn: { [key: string]: string | Object } = await getCNdata(file)
    for (const language of languages) {
      const langContent = await getContent(language, file)
      const result: { [key: string]: string | Object } = {}
      Object.keys(cn)
        .sort()
        .forEach(k => {
          if (!langContent[k]) {
            if (typeof cn[k] === 'object') {
              for (const v in cn[k] as object) {
                if (!result[k]) {
                  result[k] = {} as { [key: string]: string }
                }
                console.log(k, v)
                //@ts-ignore
                result[k][v] = cn[k][v]
              }
            } else {
              result[k] = cn[k]
            }
          }
        })
      await write(language, JSON.stringify(result), file)
    }
  }
})()
