import { NativeModules } from 'react-native'

const { LivenessModule } = NativeModules

/**
 * 活体校验模块
 */
interface LivenessModuleInterface {
  /**
   * 启动活体检测与获取检测结果
   * @param onSuccess
   * @param onError
   */
  startLiveness(
    onSuccess: (
      /**
       * 本次活体检测图片的 id
       */
      livenessId: string,
      /**
       * 本次活体检测采集的 base64 格式的图片
       */
      base64Image: string,
      /**
       * 追踪本次活体检测日志的事务id
       */
      transactionId: string,
      /**
       * 本次活体检测调用是否收费
       */
      isPay: boolean
    ) => void,
    onError: (
      /**
       * 本次活体检测用户是否点击了返回键取消检测
       */
      cancel: boolean,
      /**
       * 本次活体检测失败的原因
       */
      errorMessage: string,
      /**
       * 错误码
       * https://prod-guardian-cv.oss-ap-southeast-5.aliyuncs.com/docs/liveness-detection-android/cn/document-react-native.html
       * FACE_MISSING	检测过程中人脸丢失	/
        ACTION_TIMEOUT	动作超时	/
        MULTIPLE_FACE	检测过程中出现多张人脸	/
        MUCH_MOTION	检测过程中动作幅度过大	/
        AUTH_BAD_NETWORK	授权请求网络失败	翻墙后重试
        CHECKING_BAD_NETWORK	动作结束后图像上传网络请求失败	翻墙后重试
        DEVICE_NOT_SUPPORT	该设备不支持活体检测	设备无前置摄像头或不可用
        USER_GIVE_UP	用户中途放弃检测	/
        UNDEFINED	未定义的其他错误类型	/
        AUTH_PARAMETER_ERROR	授权请求参数错误	请检查初始化方法传入的 key 是否为 SDK 的，并且确保 Market 匹配
        AUTH_IAM_FAILED	包名未备案	在 SaaS 上自主配置(Personal Management -> ApplicationId Management)或联系我们添加
       */
      errorCode: string
    ) => void
  ): void
  /**
   * 用户绑定
   * @param userid
   */
  bindUser(userid: string): void
}
export default LivenessModule as LivenessModuleInterface
