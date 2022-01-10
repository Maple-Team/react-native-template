#!/usr/bin/env node
import fs from 'fs'
import beautify from 'js-beautify'
import { Command } from 'commander'
import path from 'path'

//FIXME
const languages = ['en', 'cn']

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
            const json = JSON.parse(content.toString()) as Record<string, string>
            resolve(json)
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
  console.log(process.argv)
  const files = (program.opts().files as string[] | undefined) || [
    'apply',
    'common',
    'misc',
    'user',
  ]
  console.log(files)
  for (let file in files) {
    const cn: Record<string, string | Object> = await getCNdata(file)
    for (const language of languages) {
      const langContent = await getContent(language, file)
      const result: Record<string, string | Object> = {}
      Object.keys(cn)
        .sort()
        .forEach(k => {
          if (!langContent[k]) {
            // add if not existed
            if (typeof cn[k] === 'object') {
              // @ts-ignore
              for (const v of cn[k]) {
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
