import fs from 'fs'
import path from 'path'
import beautify from 'js-beautify'

export type Lang = 'en' | 'cn' | 'es'
/**
 * 读取已有的翻译文案
 * @param lang
 * @returns
 */
export const getContent = async (lang: string, filename: string) => {
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
 * @param file
 * @param data
 * @returns
 */
export const write = async (lang: Lang, file: string, data: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(
      path.resolve(__dirname, `../src/locales/languages/${lang}/${file}`),
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
