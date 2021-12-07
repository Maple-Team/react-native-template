// 进件api
export default {
  // 首页
  prepareCalcUrl: '/upeso-loan/schedule/scheduleCalc',
  productUrl: '/upeso-loan/product/getProduct',
  userInfoUrl: '/upeso-loan/user/getUserInfo',
  applyUrl: '/upeso-loan/apply/step',
  dictUrl: '/upeso-loan/dictionary',
  // 影像
  imageUploadUrl: '/upeso-loan/apply/uploadImage',
  // 银行卡
  contractUrl: '/upeso-loan/apply/viewContract',
  //
  progressUrl: '/upeso-loan/user/apply/',
  // 补件
  suppleImageAuthUrl: '/upeso-loan/apply/supplementSubmit',
  // 邀请
  inviteValidateUrl: '/upeso-loan/recommend/captcha',
  inviteRegisterUrl: '/upeso-loan/recommend/register',
  // 详情
  queryStatusUrl: '/upeso-loan/apply/queryStatus',
  // 获取费用
  payFeeUrl: '/upeso-loan/payFee/getPayFee',
  // 是否需要无卡
  needWukaUrl: '/upeso-loan/payFee/getPayType',
  // 认证方式 FB/短信验证码
  authTypeUrl: '/upeso-loan/validate/getcodeType',
  // 更新申请金额
  updateAmountUrl: '/upeso-loan/apply/updateAmount',
  // 注册
  registerUrl: '/upeso-loan/session/registeredUser',
  // 上传联系人接口
  phoneContactUrl: '/upeso-loan/app/customer/Contacts',
  // 设备信息接口
  deviceInfoUrl: '/upeso-loan/app/login/deviceInfo',
  // 设备信息接口
  appsUrl: '/upeso-loan/app/customer/appInfo',
  // fb用户信息上传接口
  fbUrl: '/upeso-loan/apply/saveAuthInfo',
  // trace
  traceUrl: '/upeso-loan/app/index',
  // permission auth
  authUrl: '/upeso-loan/app/auth/list',
  // contact auth
  contactSubmitUrl: '/upeso-loan/apply/supplementContact',
  contactSubmitUrl2: '/upeso-loan/apply/submitSupplementContact',
  //活体校验开关
  livenessSwitchUrl: '/upeso-loan/config/getConfigValue/LIVENESS_DETECTION',

  // 获取展期天数
  extensionDayUrl: '/upeso-loan/contract/getExtensionDay/',
  // 获取展期试算
  extensionCalcUrl: '/upeso-loan/contract/extensionCalc',
  // 获取fb登录
  fbLoginUrl: '/upeso-loan/session/facebook/login',

  // FB绑定
  fbBindingUrl: '/upeso-loan/session/facebook/binding',
}
