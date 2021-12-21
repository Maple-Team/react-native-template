import { REGEX_PHONE, REGEX_USERNAME } from '../../src/utils/reg'

describe('reg test suits', () => {
  describe('phone reg test', () => {
    test('number test', () => {
      const phone1 = '9234234422' // 9开头10位
      expect(REGEX_PHONE.test(phone1)).toBe(true)
      const phone2 = '923423442' // 9开头9位
      expect(REGEX_PHONE.test(phone2)).toBe(false)
      const phone3 = '8234234424' // 非9开头10位
      expect(REGEX_PHONE.test(phone3)).toBe(false)
      const phone4 = '92342344223' // 9开头11位
      expect(REGEX_PHONE.test(phone4)).toBe(false)
    })
    test('word test', () => {
      const phone1 = 'abcabcabca' // 10位字符
      expect(new RegExp(REGEX_PHONE).test(phone1)).toBe(false)
      const phone2 = 'abcad32324' // 10为字符
      expect(REGEX_PHONE.test(phone2)).toBe(false)
    })
  })
  describe('password', () => {})
  describe('company phone', () => {})
  describe('username', () => {
    expect(REGEX_USERNAME.test('asdf')).toBe(true)
  })
})
