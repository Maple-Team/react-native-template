import path from 'path'
import { readFile, utils } from 'xlsx'
import { write } from './utls'

const map: Record<string, string> = {
  通用: 'common',
  // 字段: 'field',
  // 其他: 'misc',
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

    const data: string[][] = []
    if (json) {
      json.forEach(item => {
        const [filed, ] = Object.values(item)
        const [field] = keys[0]
        //          {
        //            '$': 'account', 字段
        //            '$_1': 'Account', 英文
        //            '$_2': 'Account', 中文
        //            '$_3': 'Cuenta' 西班牙文
        //          }

      })
      // Object.keys(json[0]).forEach(key => {
      //   const __ = Object.keys(sheet[key]).reduce((_: string[], curr, index) => {
      //     if (index !== 0) {
      //       _.push(sheet[key][curr])
      //     }
      //     return _
      //   }, [])
      //   data.push(__)
      // })
    }
    // write()
  })
})()
