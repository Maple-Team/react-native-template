import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create({
  container: {
    paddingLeft: 16.5,
    paddingRight: 10.5,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  inputWrap: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 8,
    position: 'relative',
    overflow: 'hidden',
    height: 64,
  },
  input: {
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#000',
    fontFamily: 'ArialRoundedMTBold',
    paddingTop: 13,
    flex: 1,
  },
  error: {
    bottom: -20,
    left: 16.5,
    position: 'absolute',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Metropolis',
    color: '#FF0F20',
  },
  formItem: {
    paddingVertical: 15,
    position: 'relative',
  },
  label: {
    paddingLeft: 7,
    paddingBottom: 9,
    justifyContent: 'center',
    position: 'relative',
  },
  labelText: {
    color: '#1D1D1D',
    fontSize: 16,
    left: 6,
  },
  labelPrefix: {
    color: '#DA8282',
    fontSize: 12,
    position: 'absolute',
    top: 0,
  },
  formValue: {
    height: 46,
    justifyContent: 'center',
    borderRadius: 3,
    backgroundColor: '#EEEEEE',
    paddingLeft: 12,
  },
  formValueText: {
    color: '#111111',
    fontSize: 16,
    width: 300,
  },
  formValuePlaceholder: {
    color: '#9AA7AC',
    fontSize: 16,
    width: 200,
  },
  arrow: {
    width: 14,
    height: 10,
  },
  extraIcon: {
    width: 20,
    height: 20,
  },
  selectStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 21,
  },
  title: {
    paddingTop: 29,
    paddingBottom: 20,
    fontFamily: 'ArialRoundedMTBold',
    fontSize: 22,
    color: '#1F2024',
  },
  nameWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    marginBottom: 36,
  },
  formitemGap: {
    marginBottom: 36,
  },
})
