/**
 * 登录页跳转逻辑
 * @param {*} param
 */
import NavigationUtil from '../navigation/NavigationUtil'
export default function redirect({ applyStatus, applyId, customerDto, navigation, from }) {
  NavigationUtil.navigation = navigation
  switch (applyStatus) {
    case 'CONTINUED_LOAN_CANCEL': // 续贷取消
    case 'CANCEL': // 取消
    case 'REPAY': // 待还款/还款中/跳转到贷款详情页
    case 'OVERDUE': // 待还款/还款中/跳转到贷款详情页
      NavigationUtil.goPage('Loandetail', {
        idNo: customerDto.idcard,
        contractNo: applyId,
        customerName: customerDto.name,
      })
      break
    case 'SIGN': // 待签约
    case 'LOAN': // 放款审核通过，待放款/放款中
    case 'APPROVE': // 信审通过，准备到放款审核步骤
    case 'REJECTED': // 信审被拒
    case 'CONTINUED_LOAN_REJECTED': // 续贷被拒
    case 'SUPPLEMENTARY': // 资料不完整，需补资料
    case 'SUPPLEMENT_IMAGE': // 影像不完整，需补影像
    case 'SUPPLEMENT_BANK_CARD': // 影像不完整，需补影像
    case 'SUPPLEMENT_IMAGE_CARD': // 影像不完整，需补影像
    case 'SETTLE': // 已结清
      NavigationUtil.goPage('Done', { applyId })
      break
    case 'SUPPLEMENT_CONTACT': // 已结清
      NavigationUtil.goPage('Contact', { applyId })
      break
    // 信息填写不完整或其他原因需要重新填写基本信息
    case 'EMPTY':
    case 'APPLY':
    default:
      NavigationUtil.goPage('Index', { from })
      break
  }
}
