import { errorCaptured } from '@/utils/util'
import RNFetchBlob from 'rn-fetch-blob-v2'
import DeviceInfo from 'react-native-device-info'
import { MMKV } from '@/utils'
import { KEY_APPLYID, KEY_DEVICEID, KEY_TOKEN } from '@/utils/constant'
import { AppModule } from '@/modules'
import type { Asset } from 'react-native-image-picker'

const { getUserAgent, getBuildNumber } = DeviceInfo

// upload files
export default async function uploadImages({
  response,
  isSupplement,
  type,
  onUploadProgress,
}: {
  response: Partial<Asset>
  isSupplement: string
  type: string
  onUploadProgress: (sent: number, total: number) => void
}) {
  const accessToken = MMKV.getString(KEY_TOKEN) || ''
  const source = 'APP'
  const deviceId = MMKV.getString(KEY_DEVICEID) || ''
  const versionId = getBuildNumber()
  const userAgent = await getUserAgent()
  const [err, res] = await errorCaptured(() =>
    RNFetchBlob.config({ timeout: 120 * 1000 })
      .fetch(
        'POST',
        `${AppModule.getBaseUrl()}/smart-loan/image/v2/oneImage`,
        {
          accessToken,
          source,
          deviceId,
          requestId: deviceId,
          versionId,
          inputChannel: 'MONEYYA',
          'Content-Type': 'multipart/form-data',
          'User-Agent': userAgent,
        },
        [
          {
            name: 'image',
            filename: response.fileName || `img_${new Date().getTime()}`,
            type: response.type,
            data: response.base64,
          },
          { name: 'isSupplement', data: isSupplement },
          { name: 'type', data: type },
          { name: 'deviceId', data: deviceId },
          { name: 'applyId', data: MMKV.getString(KEY_APPLYID) || '' },
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
    console.error(err)
    return Promise.reject(err)
  } else {
    const { imageId } = res
    return imageId
  }
}
