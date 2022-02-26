import path from 'path'
import { readFile, utils } from 'xlsx'
import { write } from './utls'

const map: Record<string, string> = {
  通用: 'common',
  字段: 'field',
  其他: 'misc',
}
/**
 * 读取xlsx文件，更新语言包
 */
;(async () => {
  const workbook = readFile(path.resolve(__dirname, '../translate/语言包.xlsx'), {})
  const sheets = workbook.Sheets
  Object.keys(map).forEach(k => {
    const sheet = sheets[k]
    const json: Record<string, string>[] = utils.sheet_to_json(sheet)

    const enMap: Record<string, string> = {}
    const cnMap: Record<string, string> = {}
    const esMap: Record<string, string> = {}
    if (json) {
      json.forEach(item => {
        const [filed, en, cn, es] = Object.values(item)
        enMap[filed] = en
        cnMap[filed] = cn
        esMap[filed] = es
      })
      write('en', `${map[k]}`, JSON.stringify(enMap))
      write('cn', `${map[k]}`, JSON.stringify(cnMap))
      write('es', `${map[k]}`, JSON.stringify(esMap))
    }
  })
})()
