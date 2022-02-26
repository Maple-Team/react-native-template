#!/usr/bin/env node
import fs from 'fs'
import { Command } from 'commander'
import path from 'path'
import { write } from './utls'

type Lang = 'en' | 'cn'

/**
 * 读取已有的翻译文案
 * @param lang
 * @returns
 */
const getLanguagesFields = async (lang: Lang, file: string) => {
  return new Promise<Record<string, any>>((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, `../src/locales/languages/${lang}/${file}`),
      (err, content) => {
        if (err) {
          reject(err)
        } else {
          try {
            const json = JSON.parse(content.toString()) as Record<string, any>
            resolve(json)
          } catch (error) {
            reject(error)
          }
        }
      }
    )
  })
}
const getfiles = async (lang: Lang) => {
  return new Promise<Record<string, any>>((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, `../src/locales/languages/${lang}`), (err, files) => {
      if (err) {
        reject(err)
      } else {
        try {
          resolve(files)
        } catch (error) {
          reject(error)
        }
      }
    })
  })
}

;(async () => {
  const program = new Command()
  program.option('-l, --language <languages...>', 'locale需要排序的语言')
  program.parse(process.argv)
  const languages = (program.opts().language as Lang[]) || ['en', 'cn']

  for (const language of languages) {
    const files: string[] = (await getfiles(language)) as string[]
    files
      .filter(file => file !== 'index.ts')
      .forEach(async file => {
        const data: Record<string, any> = await getLanguagesFields(language, file)

        // 排序
        const result: Record<string, any> = {}
        Object.keys(data)
          .sort()
          .forEach(k => {
            result[k] = data[k]
          })
        await write(language, file, JSON.stringify(result))
      })
  }
})()
