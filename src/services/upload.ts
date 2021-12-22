import { errorCaptured } from '../utils/util'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNFetchBlob from 'rn-fetch-blob'
import DeviceInfo from 'react-native-device-info'

const getBaseUrl = () => {
  return ''
}
const { getUserAgent, getBuildNumber } = DeviceInfo
const inputChannel = ''

// upload files
export default async function uploadImages({
  response,
  isSupplement,
  type,
  onUploadProgress,
}: {
  response: any
  isSupplement: string
  type: string
  onUploadProgress: (sent: number, total: number) => void
}) {
  const accessToken = (await AsyncStorage.getItem('accessToken')) || ''
  const source = 'APP'
  const deviceId = (await AsyncStorage.getItem('deviceId')) || ''
  const versionId = getBuildNumber()
  const userAgent = await getUserAgent()
  const [err, res] = await errorCaptured(() =>
    RNFetchBlob.config({ timeout: 120 * 1000 })
      .fetch(
        'POST',
        `${getBaseUrl()}/smart-loan/image/v2/oneImage`,
        {
          accessToken,
          source,
          deviceId,
          requestId: deviceId,
          versionId,
          inputChannel,
          'Content-Type': 'multipart/form-data',
          'User-Agent': userAgent,
        },
        [
          {
            name: 'imageFront',
            filename: response.fileName || `img_${new Date().getTime()}`,
            type: response.type,
            data: response.data,
          },
          { name: 'isSupplement', data: isSupplement },
          { name: 'type', data: type },
        ]
      )
      // fixme 间隔调整
      .uploadProgress({ interval: 10 }, onUploadProgress)
      .then(_ => _.json())
      .then(__ => {
        const status = __.status
        if (status.code === '000') {
          return __.body
        } else {
          return Promise.reject(status.msg)
        }
      })
  )
  if (err) {
    return Promise.reject(err)
  } else {
    const { imageId } = res
    return imageId
  }
}
