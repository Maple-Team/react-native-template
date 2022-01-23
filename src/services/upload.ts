import { errorCaptured } from '@/utils/util'
import RNFetchBlob from 'rn-fetch-blob-v2'
import DeviceInfo from 'react-native-device-info'
import { MMKV } from '@/utils'
import { KEY_APPLYID, KEY_DEVICEID, KEY_TOKEN } from '@/utils/constant'
import { AppModule } from '@/modules'
import type { Asset } from 'react-native-image-picker'
import emitter from '@/eventbus'
import { t } from 'i18next'

const { getUserAgent, getBuildNumber } = DeviceInfo

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
  const [err, imageId] = await errorCaptured(() =>
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
      .uploadProgress({ interval: 2 }, onUploadProgress)
      .then(res => res.json())
      .then(({ status, body }) => {
        if (status.code === '000') {
          return body
        } else {
          emitter.emit('SHOW_MESSAGE', { type: 'fail', message: status.msg || t('upload-Failed') })
        }
      })
  )
  if (err) {
    console.error(err)
    return Promise.reject(err)
  } else {
    return imageId
  }
}
