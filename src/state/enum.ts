export enum APPLY_STATE {
  /**
   * 	未申请 点击首页继续申请流程
   */
  EMPTY = 'EMPTY',
  /**
   * 	申请中 点击首页继续申请流程
   */
  APPLY = 'APPLY',
  /**
   * 审批中	跳转订单页面
   */
  WAIT = 'WAIT',
  /**
   * 拒绝	点击首页可再次申请
   */
  REJECTED = 'REJECTED',
  /**
   * 放款中	跳转订单页面
   */
  LOAN = 'LOAN',
  /**
   * 取消	点击首页可再次申请
   */
  CANCEL = 'CANCEL',
  /**
   * 正常状态	跳转订单页面
   */
  NORMAL = 'NORMAL',
  /**
   * 逾期	跳转订单页面
   */
  OVERDUE = 'OVERDUE',
  /**
   * 结清状态	点击首页可再次申请
   */
  SETTLE = 'SETTLE',
}

export enum API_CODE {
  /**
   * 执行成功
   */
  SUCCESS = '000',
  /**
   * 非法用户
   */
  ILLEGAL_USER = '103',
  /**
   * 短信验证码发送失败	弹出异常信息
   */
  VALIDATE_CODE_SEND_FAIL = '106',
  /**
   * 验证码发送次数超限	弹出异常信息
   */
  VALIDATE_CODE_SEND_LIMIT = '108',
  /**
   * 一分钟内不能重复获取，请稍后重试!	弹出异常信息
   */
  VALIDATE_CODE_WAIT = '109',
  /**
   * 验证码错	弹出异常信息
   */
  VALIDATE_CODE_ERROR = '110',
  /**
   * 客户已有申请在审批中或放款中或贷款尚未结清	弹出异常信息
   */
  UNDER_APPLY_OR_UNSETTLE = '303',
  /**
   * 执行失败
   */
  OPERATION_FAIL = '999',
  /**
   * 系统异常
   */
  SYSTEM_EXCEPTION = '998',
  /**
   * 会话超时	引导重新登录
   */
  SESSION_EXPIRED = '997',
  /**
   * 用户名或密码错误	弹出异常信息
   */
  INVALID_USERNAME_OR_PASSWORD = '994',
  /**
   * 用户未注册	引导客户注册
   */
  UNREGISTER_USER = '993',
  /**
   * 验证码错误	弹出异常信息
   */
  VALIDATE_CODE_SEND_FAIL2 = '992',
  /**
   * 参数为空, 客户端传参不正确	弹出异常信息
   */
  EMPTY_PARAMETE = '990',
  /**
   * 参数非法不符合约定	弹出异常信息
   */
  ILLEGAL_PARAMETE = '989',
  /**
   * 已有账号，请直接登录	引导客户登录
   */
  EXISTED_USER = '986',
  /**
   * app版本太低，请更新最新版本	引导客户更新app
   */
  LOW_APP_VERSION = '985',
}
