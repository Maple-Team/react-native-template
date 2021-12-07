// user api
export default {
  // 登录
  loginUrl: '/upeso-loan/session',
  refreshTokenUrl: '/upeso-loan/session/sessionRefresh',
  userInfoUrl: '/upeso-loan/user/getUserInfo',
  validateCodeUrl: '/upeso-loan/app/validation/code',
  passwordUrl1: '/upeso-loan/modify/resetPassword',
  passwordUrl2: '/upeso-loan/modify/resetPasswordSubmit',
  logoutUrl: '/upeso-loan/session',
  repaymentUrl: '/upeso-loan/user/getRepaymentAccountList',
  loanlistUrl: '/upeso-loan/contract/contractList',
  loandetailUrl: '/upeso-loan/contract/contractDetail',
  myCouponUrl: '/upeso-loan/coupon/myCoupon',
  useMyCouponUrl: '/upeso-loan/coupon/useMyCoupon',
  // 抽奖
  prizeCountUrl: '/upeso-loan/prize/index',
  getPrizeUrl: '/upeso-loan/prize/luckyDraw',
  // 消息
  messageUrl: '/upeso-loan/message/getMyMessage',
  messageUpdateUrl: '/upeso-loan/message/update',
  messageCountUrl: '/upeso-loan/message/getMessageCount',
  // 是否有新版本
  versionUrl: '/upeso-loan/app/v2.0/version',
  // 通知
  notificationUrl: '/upeso-loan/config/getNotification',
}
