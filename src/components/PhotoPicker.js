import React, { PureComponent } from 'react'
import { View, Image, TouchableOpacity, Platform } from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { Logger, errorCaptured, Constants, responsive } from '../utils'
import { Toast } from '@ant-design/react-native'
import upload from '../services/upload'
import StyleSheet from 'react-native-adaptive-stylesheet'
import DeviceInfo from 'react-native-device-info'
import { Text, PermissionModal, OpenSettingModal } from '../components'
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions'
import Exif from 'react-native-exif'
import ImageResizer from 'react-native-image-resizer'
import RNFetchBlob from 'rn-fetch-blob'

const getCameraPermissionName = () =>
  Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA
const getStoragePermissionName = () =>
  Platform.OS === 'android' ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : '' // NO for ios
const { isEmulator } = DeviceInfo
export default class PhotoPicker extends PureComponent {
  // 构造函数
  constructor(props) {
    super(props)
    this.state = {
      source: '',
      cameraPermissionVisible: false,
      storagePermissionVisible: false,
      progress: 0,
    }
  }
  _takePicture = async () => {
    const { isSupplement, imageType, cameraType, onUploadSuccess, reportExif } = this.props

    const _isEmulator = await isEmulator()
    if (_isEmulator) {
      launchImageLibrary(
        {
          quality: 0.1,
          mediaType: 'photo',
          cameraType, // 'front' | 'back' 手持证件照使用前置摄像头
          allowsEditing: false,
          storageOptions: { waitUntilSaved: true, cameraRoll: true },
        },
        response => {
          const { uri, error } = response
          // Note info from choose gallery
          // { fileSize: 4251949,
          // fileName: 'IMG_1902.JPG',
          // width: 3024,
          // origURL: 'assets-library://asset/asset.JPG?
          // id=83C3A8CF-0B72-468E-82D6-11651C3A92BE&ext=JPG',
          // type: 'image/jpeg',
          // height: 4032,
          // timestamp: '2019-09-19T10:15:13Z',
          // isVertical: true,
          // uri: 'file:///var/mobile/Containers/Data/Application/xxxx
          // /Documents/E399C8CC-A3F5-479F-853A-80281A0C4299.jpg' }
          if (error) {
            Toast.fail(`${error}`, 1)
            Logger.log(error)
            return
          }
          if (!uri) {
            return
          }
          const source = { uri }
          this.setState({ source })
          upload({ response, isSupplement, type: imageType })
            .then(imageId => onUploadSuccess(imageId))
            .catch(e => {
              Toast.fail(JSON.stringify(e), 5)
              Logger.log('upload error', e)
            })
        }
      )
    } else {
      launchCamera(
        {
          quality: 1, // Note 不能压缩,否则没有exif值
          mediaType: 'photo',
          saveToPhotos: true,
          includeBase64: true,
        },
        async response => {
          const { uri, error } = response
          // { height: 4032,
          // timestamp: '2019-09-20T06:40:24Z',
          // isVertical: true,
          // fileName: 'IMG_1915.JPG',
          // width: 3024,
          // type: 'image/jpeg',
          // fileSize: 4088266
          // uri: 'file:///var/mobile/Containers/Data/Application/xxxx
          // /Documents/4946CF22-CF03-48BF-B80A-AD83830E949B.jpg' }
          if (error) {
            Logger.log(error)
            return
          }
          if (!uri) {
            return
          }
          const source = { uri }
          this.setState({ source })
          Exif.getExif(uri)
            .then(msg => {
              reportExif(JSON.stringify({ ...msg.exif, ImageHeight: msg.exif.ImageLength }))
            })
            .catch(msg => {
              Logger.error('exif ERROR: ' + msg)
            })

          const newWidth = response.width
          const newHeight = response.height
          const [err, data] = await errorCaptured(() =>
            ImageResizer.createResizedImage(
              uri, //imageUri
              newWidth,
              newHeight,
              'JPEG', //compressFormat,
              30, //quality
              0, // Rotation to apply to the image, in degrees, for android.On iOS, rotation is limited(and rounded) to multiples of 90 degrees.
              null //outputPath
            ).then(_response => RNFetchBlob.fs.readFile(_response.path, 'base64'))
          )
          if (err) {
            Logger.error(err)
          }
          response.data = data
          upload({
            response,
            isSupplement,
            type: imageType,
            onUploadProgress: this.onUploadProgress.bind(this),
          })
            .then(imageId => {
              onUploadSuccess(imageId, () => {
                this.setState({
                  progress: 1,
                })
              })
            })
            .catch(e => {
              Logger.log('upload error', e)
              this.setState({
                progress: 0,
              })
            })
        }
      )
    }
  }
  onUploadProgress = async (written, total) => {
    this.setState({
      progress: written / total,
    })
  }
  queryNeededPermission = async () => {
    // 1.检查权限
    const [result1, result2] = await Promise.all([
      errorCaptured(() => check(getCameraPermissionName())),
      errorCaptured(() => check(getStoragePermissionName())),
    ])
    const [err1, res1] = result1
    const [err2, res2] = result2
    if (err1 || err2) {
      return // 拿权限出错
    }
    Logger.log({ result1, result2 })
    // 2. 判断结果
    switch (res2) {
      case RESULTS.UNAVAILABLE:
        Toast.fail('This feature is not available (on this device / in this context)')
        break
      case RESULTS.DENIED:
        this.setState({ storagePermissionVisible: true })
        break
      case RESULTS.GRANTED:
        if (res1 === RESULTS.GRANTED) {
          this._takePicture()
        }
        break
      case RESULTS.BLOCKED:
      default:
        this.setState({
          showSettingVisible: true,
        })
        break
    }
    if (res1 === RESULTS.GRANTED) {
      return
    }
    switch (res1) {
      case RESULTS.UNAVAILABLE:
        Toast.fail('This feature is not available (on this device / in this context)')
        break
      case RESULTS.DENIED:
        this.setState({ cameraPermissionVisible: true })
        break
      case RESULTS.GRANTED:
        if (res2 === RESULTS.GRANTED) {
          this._takePicture()
        }
        break
      case RESULTS.BLOCKED:
      default:
        this.setState({
          showSettingVisible: true,
        })
        break
    }
  }
  async _openSetting() {
    openSettings().then(() => {
      this.setState({
        showSettingVisible: false,
      })
    })
  }
  requestNeededPermission = async type => {
    this.setState({
      [type]: false,
    })
    const [result1, result2] = await Promise.all([
      errorCaptured(() => request(getCameraPermissionName())),
      errorCaptured(() => request(getStoragePermissionName())),
    ])
    const [err1, res1] = result1
    const [err2, res2] = result2
    Logger.log({ result1, result2 })
    if (err1 || err2) {
      return // 拿权限出错
    }
    if (res1 !== RESULTS.GRANTED || res2 !== RESULTS.GRANTED) {
      this.queryNeededPermission()
    } else {
      this._takePicture()
    }
  }
  showError = error => {
    const { progress } = this.state
    if (error) {
      if (progress > 0) {
        return (
          <View style={styles.error}>
            <Text style={styles.errorText}>picture is uploading</Text>
          </View>
        )
      } else {
        return (
          <View style={styles.error}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )
      }
    }
    return null
  }
  render() {
    const { error, bg, hint } = this.props
    const { cameraPermissionVisible, storagePermissionVisible, progress, showSettingVisible } =
      this.state
    const width = Math.floor((1 - progress) * 283)
    const left = Math.ceil(progress * 283)
    return (
      <>
        <View style={styles.container}>
          {this.state.source ? <Image source={this.state.source} style={styles.preview} /> : null}
          <TouchableOpacity onPress={this.queryNeededPermission.bind(this)} style={styles.add}>
            <Image source={require('../assets/images/image/camera.png')} style={styles.addIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.queryNeededPermission.bind(this)}
            style={[styles.add, styles.add2]}>
            {progress !== 1 && <Image source={bg} />}
          </TouchableOpacity>
          <View style={styles.progresContainer}>
            <Text style={styles.lineText}>
              {progress > 0 ? `${progress.toFixed(2) * 100}%` : ''}
            </Text>
            <View style={styles.line} />
            <View style={[styles.lineCurr, { width: responsive(width), left: responsive(left) }]} />
          </View>
          {this.showError(error)}
        </View>
        <View style={styles.hintWrap}>
          <Text style={styles.hint}>{hint}</Text>
        </View>
        {cameraPermissionVisible && (
          <PermissionModal
            icon={require('../assets/images/permission/camera.png')}
            title="Camera"
            visible={true}
            onPress={this.requestNeededPermission.bind(this, 'cameraPermissionVisible')}
            content={Constants.PermissionContent.camera.content}
            hint={Constants.PermissionContent.camera.hint}
          />
        )}
        {storagePermissionVisible && (
          <PermissionModal
            icon={require('../assets/images/permission/file.png')}
            title="File"
            visible={true}
            onPress={this.requestNeededPermission.bind(this, 'storagePermissionVisible')}
            content={Constants.PermissionContent.file.content}
            hint={Constants.PermissionContent.file.hint}
          />
        )}
        {showSettingVisible && <OpenSettingModal onPress={this._openSetting.bind(this)} />}
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    height: 180,
    width: 283,
    backgroundColor: '#DFDFDF',
  },
  preview: {
    height: 180,
    width: 283,
    position: 'absolute',
  },
  add: {
    position: 'absolute',
    width: 283,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 10,
  },
  addIcon: {
    width: 62.5,
    height: 62.5,
  },
  add2: {
    zIndex: 9,
  },
  error: {
    bottom: -16,
    left: 0,
    zIndex: 29,
    position: 'absolute',
  },
  errorText: {
    fontSize: 12,
    color: '#FF0F20',
  },
  hintWrap: {
    marginTop: 26,
  },
  hint: {
    color: '#00A24D',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 13,
  },
  progresContainer: {
    bottom: -28,
    left: 0,
    width: 283,
    height: 14,
    position: 'absolute',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineText: {
    fontSize: 14,
    color: '#fff',
    zIndex: 9,
  },
  line: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 283,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00A24D',
  },
  lineCurr: {
    height: 14,
    position: 'absolute',
    top: 0,
    backgroundColor: '#DFDFDF',
    borderRadius: 7,
  },
})
