import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: '#CCECDB',
  },
  titleView: {
    paddingHorizontal: 15,
    paddingTop: 38.5,
    paddingBottom: 30,
  },
  title: {
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 16,
    color: '#333230',
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
    paddingTop: 42,
    paddingBottom: 18.5,
    borderRadius: 5,
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
  btnWrap: {
    marginTop: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: '#fff',
    fontSize: 18,
    borderStyle: 'solid',
    borderWidth: 1,
    width: 300,
  },
  buttonStyleNegative: {
    color: '#B5B5B5',
    borderColor: '#B5B5B5',
  },
  paddingTop20: {
    paddingTop: 20,
  },
})
