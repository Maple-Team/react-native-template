#!/usr/bin/env node
import { Command } from 'commander'
import { getContent, Lang, write } from './utls'

const languages: Lang[] = [
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
      await write(language, file, JSON.stringify(result))
    }
  }
})()
