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
  paymentSchedules?: PaymentSchedule[]
  realLoanAmount?: any
  realRepayAmount?: any
  repayAmount?: any
  repayCode?: any
  repayDate?: any
  totalRepayAmount?: any
}

interface PaymentSchedule {
  freeMark?: any
  loanPmtDueDate: string
  loanTermInterest: number
  loanTermPrin: number
  loanTermSvcFee?: any
  loanTermTotalAmt: number
  realTermExtendFee: number
  realTermInterest: number
  realTermPrin: number
  realTermSvcFee: number
  realTermTotalAmt: number
  status: string
  term: number
}
