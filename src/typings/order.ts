export interface Order {
  applyAmount: number
  applyDate: string
  applyId: number
  contractStatus: string
  contractStatusName: string
  displayLoanDays: number
  instalmentMark?: any
  loanAmount?: any
  loanDate?: any
  loanTerms: number
  paymentSchedules?: any
  realLoanAmount?: any
  realRepayAmount?: any
  repayAmount?: any
  repayCode?: any
  repayDate?: any
  totalRepayAmount?: any
}
