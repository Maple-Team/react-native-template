import { REGEX_BANK_CARD, REGEX_BANK_CLABE, REGEX_USERNAME } from '../../src/utils/reg'
import Mock from 'mockjs'

function generateArray(num: number): Array<number> {
  return Array.from({ length: num }, (_, i) => i)
}
/**
 * 特定长度的[0-9]的字符串
 * @param length
 * @returns
 */
function randomNum(length: number) {
  return generateArray(length)
    .map(() => Math.floor(Math.random() * 10))
    .join('')
}

describe('reg test suits', () => {
  describe('phone reg test', () => {
    it('number test', () => {})
    it('word test', () => {})
  })
  describe('password', () => {})
  describe('company phone', () => {})
  describe('username', () => {
    expect(REGEX_USERNAME.test('asdf')).toBe(true)
  })
  describe('bank card reg test case suits', () => {
    describe('bank card type', () => {
      it("18's number should be true", () => {
        expect(REGEX_BANK_CARD.test(randomNum(18))).toBe(true)
      })
      const numCases = generateArray(17).map(item => [
        Mock.mock({
          regexp: new RegExp(`\\d{${item + 1}}`),
        }).regexp,
        false,
      ]) as unknown as any[]
      it.concurrent.each(numCases)(
        'number: %o should be %o',
        async (num: number, expected: boolean) => {
          expect(REGEX_BANK_CARD.test(`${num}`)).toBe(expected)
        }
      )
      it.concurrent.each([
        [null, false],
        [undefined, false],
        ['', false],
      ])('%o should be %o', async (char: any, expected: boolean) => {
        expect(REGEX_BANK_CARD.test(`${char}`)).toBe(expected)
      })
      const nonNumCases = generateArray(17).map(item => [
        Mock.mock({
          regexp: new RegExp(`[^\\d]{${item + 1}}`),
        }).regexp,
        false,
      ]) as unknown as any[]
      it.concurrent.each(nonNumCases)(
        'word: %o should be false',
        (char: any, expected: boolean) => {
          expect(REGEX_BANK_CARD.test(char)).toBe(expected)
        }
      )
    })
    describe('bank clabe type', () => {
      it("16's number should be true", () => {
        expect(REGEX_BANK_CLABE.test(randomNum(16))).toBe(true)
      })
      const numCases = generateArray(15).map(item => [
        Mock.mock({
          regexp: new RegExp(`\\d{${item + 1}}`),
        }).regexp,
        false,
      ]) as unknown as any[]
      it.concurrent.each(numCases)(
        'number char %i should be %o',
        async (num: number, expected: boolean) => {
          expect(REGEX_BANK_CLABE.test(`${num}`)).toBe(expected)
        }
      )
      it.concurrent.each([
        [null, false],
        [undefined, false],
        ['', false],
      ])('%o should be %o', async (a: any, expected: boolean) => {
        expect(REGEX_BANK_CLABE.test(`${a}`)).toBe(expected)
      })
      const nonNumCases = generateArray(15).map(item => [
        Mock.mock({
          regexp: new RegExp(`[^\\d]{${item + 1}}`),
        }).regexp,
        false,
      ]) as unknown as any[]
      it.concurrent.each(nonNumCases)(
        'word: %o should be false',
        (char: string, expected: boolean) => {
          expect(REGEX_BANK_CLABE.test(char)).toBe(expected)
        }
      )
    })
  })
})
