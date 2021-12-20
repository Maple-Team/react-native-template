import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * 取出存储的数据
 * @param key
 * @returns
 */
export async function getStorageValue<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value) {
      try {
        return JSON.parse(value) as T
      } catch (error) {
        return value as unknown as T // 调用处去恢复原始数据类型
      }
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}
/**
 * 存储数据
 * @param key
 * @param value
 * @returns
 */
export async function setStorageItem<T>(key: string, value: T): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    return false
  }
}
