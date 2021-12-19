export const PASSWORD_REGEX = new RegExp(
  '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$',
);
export const PHONE_REGEX = new RegExp('^9[0-9]{9}$');
export const COMPANYPHONE_REGEX = new RegExp('^[0-9]{8,11}$');
export const IDCARD_REGEX = new RegExp('(^[0-9]{9}$)|(^[0-9]{12}$)');
export const BANK_CARD_REGEX = new RegExp('^[0-9]{16,19}$');
export const BANK_ACCOUNT_REGEX = new RegExp('^[0-9]{6,18}$');
export const VALIDATE_CODE_REGEX = new RegExp('^[0-9]{6}$');
export const USERNAME_REGEX = new RegExp('^[a-zA-Z\\s]{1,80}$');
