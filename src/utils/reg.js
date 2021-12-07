export default {
  PASSWORD_REGEX: new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$'),
  PHONE_REGEX: new RegExp('^9[0-9]{9}$'),
  COMPANYPHONE_REGEX: new RegExp('^[0-9]{8,11}$'),
  IDCARD_REGEX: new RegExp('(^[0-9]{9}$)|(^[0-9]{12}$)'),
  BANK_CARD_REGEX: new RegExp('^[0-9]{16,19}$'),
  BANK_ACCOUNT_REGEX: new RegExp('^[0-9]{6,18}$'),
  VALIDATE_CODE_REGEX: new RegExp('^[0-9]{6}$'),
  USERNAME_REGEX: new RegExp('^[a-zA-Z\\s]{1,80}$'),
}
