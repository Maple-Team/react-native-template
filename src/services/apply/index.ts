import { get, Logger } from '../../utils/index.ts'
import AsyncStorage from '@react-native-async-storage/async-storage'
const TIMEOUT = 2000
// 首页

// Note 字典请求，网络不好时从缓存里面取
const dictUrl = '/xxx/dictionary'
export function dict(word: string) {
  return Promise.race([
    new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, TIMEOUT)
    }),
    get({ url: `${dictUrl}/${word}` }).then((res: any) => {
      Logger.log(`get dict [${word}] from network`)
      AsyncStorage.setItem(word, JSON.stringify(res))
      return res
    }),
  ]).then(async res => {
    if (res) {
      return res
    } else {
      const data = await AsyncStorage.getItem(word)
      Logger.log(`get dict [${word}] from storage`)
      return data ? JSON.parse(data) : []
    }
  })
}
