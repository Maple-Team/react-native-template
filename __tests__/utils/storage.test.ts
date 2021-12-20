import 'react-native'
import { getStorageValue, setStorageItem } from '../../src/utils/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'

// test configuation https://react-native-async-storage.github.io/async-storage/docs/advanced/jest/
// test example https://github.com/react-native-async-storage/async-storage/blob/master/example/__tests__/App.js
describe('Promise based', () => {
  it('can read/write data to/from storage', async () => {
    const newData = Math.floor(Math.random() * 1000)
    await setStorageItem('key', newData)
    const data = await getStorageValue('key')
    expect(data).toBe(newData)
  })
  it('can read/write true data to/from storage', async () => {
    await setStorageItem('key', true)
    const data = await getStorageValue('key')
    expect(data).toBe(true)
  })
  it('can read/write false data to/from storage', async () => {
    await setStorageItem('key', false)
    const data = await getStorageValue('key')
    expect(data).toBe(false)
  })
  it('can read/write null data to/from storage', async () => {
    await setStorageItem('key', null)
    const data = await getStorageValue('key')
    expect(data).toBe(null)
  })
  it('can read/write undefined data to/from storage', async () => {
    await setStorageItem('key', undefined)
    const data = await getStorageValue('key')
    expect(data).toBe(null)
  })
  it('can read/write obj data to/from storage', async () => {
    await setStorageItem('key', { a: 1 })
    const data = await getStorageValue('key')
    expect(data).toStrictEqual({
      a: 1,
    })
  })
  it('can read/write nested obj data to/from storage', async () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
      },
    }
    await setStorageItem('key', obj)
    const data = await getStorageValue('key')
    expect(data).toStrictEqual(obj)
  })
  it('should get null after storage clear', async () => {
    const token = 'token'
    await setStorageItem(token, token)
    await AsyncStorage.clear()
    const data = await getStorageValue(token)
    expect(data).toStrictEqual(null)
  })
})
