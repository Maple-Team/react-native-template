import MMKVStorage, { useMMKVStorage } from 'react-native-mmkv-storage'
import API from 'react-native-mmkv-storage/dist/src/api'
// https://rnmmkv.vercel.app/#/creatinginstance
type LiteralUnion<T extends U, U = string> = T | (U & {})
type STORAGE_KEY = 'accessToken' | 'password' | 'hasInit'

export const MMKV: API = new MMKVStorage.Loader().initialize()

export const useStorage = (
  key: LiteralUnion<STORAGE_KEY>,
  defaultValue?: string | boolean | number
) => {
  const [value, setValue] = useMMKVStorage(key, MMKV, defaultValue)
  return [value, setValue]
}
