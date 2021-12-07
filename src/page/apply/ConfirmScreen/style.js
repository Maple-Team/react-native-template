import StyleSheet from 'react-native-adaptive-stylesheet'

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: {
    paddingHorizontal: 10,
    paddingVertical: 29,
  },
  codeLayout: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  getCode: {
    width: 106,
    backgroundColor: '#296DB8',
    height: 46,
    borderColor: '#296DB8',
    position: 'absolute',
    bottom: 15,
    right: 0,
    borderRadius: 3,
  },
  commonTitle: {
    color: '#296DB8',
    fontSize: 22,
    paddingTop: 20,
    paddingBottom: 10,
  },
  registerHint: {
    flexDirection: 'row',
    paddingLeft: 15,
    marginBottom: 20,
  },
  radioContainer: {
    width: 288,
    height: 48,
    backgroundColor: '#00A24D',
    borderWidth: 1,
    borderColor: '#00A24D',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  radioItem: {
    width: 143,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  radioCheckedItem: {
    backgroundColor: '#00A24D',
  },
  radioLeftItem: {
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  radioRightItem: {
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  radioText: {
    color: '#00A24D',
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 18,
  },
  radioCheckedText: {
    color: '#fff',
  },
  paddingTop20: {
    paddingVertical: 20,
  },
  orgTopInfo: {
    color: '#1D1D1D',
    fontSize: 12,
    paddingBottom: 12.5,
    paddingLeft: 9,
    fontFamily: 'ArialRoundedMTBold',
  },
  agreeContact1: {
    color: '#1a1a1a',
    fontSize: 14,
    fontFamily: 'Metropolis',
  },
  agreeContact2: {
    fontFamily: 'ArialRoundedMTBold',
    color: '#00A24D',
    fontSize: 14,
  },
  agreeContactWarn: {
    color: 'red',
  },
  workidcardContainer: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
  },
  workidcardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 18,
  },
  worktitle: {
    color: '#1D1D1D',
    fontSize: 16,
    fontFamily: 'ArialRoundedMTBold',
  },
  workCardHint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F1',
    paddingVertical: 10,
    paddingRight: 12,
    borderRadius: 12,
  },
  workCardHintImg: {
    width: 82.45,
    height: 82,
  },
  workCardHintTextWrap: {
    width: 190,
    marginLeft: 10,
  },
  workCardHintText: {
    color: '#00A24D',
    fontSize: 11,
    fontFamily: 'ArialRoundedMTBold',
  },
  example: {
    color: '#00A24D',
    fontSize: 12,
    textTransform: 'capitalize',
    fontFamily: 'ArialRoundedMTBold',
  },
  workContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 21,
    paddingVertical: 21,
  },
})

export default styles
