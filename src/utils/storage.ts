import AsyncStorage from '@react-native-async-storage/async-storage'

export async function getStorageValue<T>(
  key: string
): Promise<T | null | boolean | number | string> {
  try {
    const data = await AsyncStorage.getItem(key)
    if (data) {
      try {
        return JSON.parse(data) as T
      } catch (error) {
        return data
      }
    } else {
      return null
    }
  } catch (e) {
    // TODO saving error
    return null
  }
}
export async function setStorageItem<T>(key: string, data: T) {
  try {
    let value: string
    switch (typeof data) {
      case 'object': //
        value = JSON.stringify(data)
        break
      case 'boolean': //
        value = `${data}`
        break
      case 'number':
      case 'bigint':
        value = `${data}`
        break
      case 'string':
        value = data
        break
      default:
        value = ''
        break
    }
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // TODO saving error
    return null
  }
}
