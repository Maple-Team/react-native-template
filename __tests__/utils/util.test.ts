import { filterArrayKey } from '../../src/utils/util'

describe('util', () => {
  it('filterArrayKey', () => {
    const model: Record<string, any> = {
      cityArray: [],
      company: 'ghjb',
      companyAddrCity: '',
      companyAddrCityCode: 'R80157308',
      companyAddrDetail: 'cbbnghj',
      companyAddrProvince: '',
      companyAddrProvinceCode: 'R52299',
      companyPhone: '9889888998588',
      incumbency: 'INCUMBENCY_02',
      incumbencyArray: [],
      industry: '',
      industryArray: [],
      industryCode: 'IN12',
      jobType: '',
      jobTypeArray: [],
      jobTypeCode: 'PR07',
      monthlyIncome: 'MONEY1',
      monthlyIncomeArray: [],
      provinceArray: [],
      salaryDate: 'SALARY_DATE_01',
      salaryDateArray: [],
      salaryType: 'MONTHLY',
    }
    const res = filterArrayKey(model)
    expect(res).toStrictEqual({
      company: 'ghjb',
      companyAddrCity: '',
      companyAddrCityCode: 'R80157308',
      companyAddrDetail: 'cbbnghj',
      companyAddrProvince: '',
      companyAddrProvinceCode: 'R52299',
      companyPhone: '9889888998588',
      incumbency: 'INCUMBENCY_02',
      industry: '',
      industryCode: 'IN12',
      jobType: '',
      jobTypeCode: 'PR07',
      monthlyIncome: 'MONEY1',
      salaryDate: 'SALARY_DATE_01',
      salaryType: 'MONTHLY',
    })
  })
})
