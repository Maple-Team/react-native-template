import {errorCaptured} from '../utils/request';
import {Platform} from 'react-native';
import commonConfig from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {Logger, getBaseUrl} from '../utils';
import DeviceInfo from 'react-native-device-info';

const {getUserAgent, getBuildNumber} = DeviceInfo;
const {inputChannel} = commonConfig;
let os = Platform.OS.toLowerCase();
if (os === 'android') {
  os = 'APP';
}
os = os.toUpperCase();
// upload files
export default async function uploadImages({
  response,
  isSupplement,
  type,
  onUploadProgress,
}: {
  response: any;
  isSupplement: string;
  type: string;
  onUploadProgress: (sent: number, total: number) => void;
}) {
  const accessToken = (await AsyncStorage.getItem('accessToken')) || '';
  const source = os;
  const deviceId = (await AsyncStorage.getItem('deviceId')) || '';
  const versionId = getBuildNumber();
  const userAgent = await getUserAgent();
  const [err, res] = await errorCaptured(() =>
    RNFetchBlob.config({timeout: 120 * 1000})
      .fetch(
        'POST',
        `${getBaseUrl()}/upeso-loan/apply/uploadImage`,
        {
          accessToken,
          source,
          deviceId,
          requestId: deviceId,
          versionId,
          inputChannel: `${inputChannel}_${os}`,
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
          {name: 'isSupplement', data: isSupplement},
          {name: 'type', data: type},
        ],
      )
      // fixme 间隔调整
      .uploadProgress({interval: 10}, onUploadProgress)
      .then(_ => _.json())
      .then(__ => {
        const status = __.status;
        if (status.code === '000') {
          return __.body;
        } else {
          return Promise.reject(status.msg);
        }
      }),
  );
  if (err) {
    Logger.log('upload err', err);
    return Promise.reject(err);
  } else {
    const {imageId} = res;
    Logger.log(`upload success imageId: ${imageId}`);
    return imageId;
  }
}
