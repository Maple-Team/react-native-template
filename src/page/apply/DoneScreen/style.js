import StyleSheet from 'react-native-adaptive-stylesheet'
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: '#CCECDB',
    paddingTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#C9C9C9',
    position: 'relative',
    alignItems: 'center',
  },
  dotAct: {
    backgroundColor: '#00A24D',
  },
  dotTextView: {
    position: 'absolute',
    width: 92,
    bottom: 13,
    alignItems: 'center',
  },
  dotText: {
    color: '#00A24D',
    fontSize: 11,
  },
  dotTextOff: {
    color: '#C9C9C9',
  },
  line: {
    width: 22,
    height: 2,
    backgroundColor: '#C9C9C9',
  },
  lineAct: {
    backgroundColor: '#00A24D',
  },
  circle: {
    position: 'relative',
    alignItems: 'center',
  },
  circleOff: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#C9C9C9',
  },
  circleTextView: {
    position: 'absolute',
    width: 105,
    bottom: -36,
    alignItems: 'center',
  },
  circleText: {
    color: '#C9C9C9',
    fontSize: 14,
    textAlign: 'center',
  },
  circleTextOn: {
    color: '#404040',
  },
  headContainer: {
    paddingTop: 5.5,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  head: {
    alignSelf: 'flex-end',
    width: 141.5 + 72,
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  head2: {
    // alignSelf: 'flex-end',
    // width: 141.5 + 72,
    paddingLeft: 26,
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  head3: {
    paddingLeft: 0,
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 38,
  },
  headSettle: {
    alignSelf: 'flex-start',
    width: 141.5 + 72,
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headFail: {
    paddingLeft: 38.5,
    alignSelf: 'flex-start',
    width: 141.5 + 72,
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusView: {
    paddingHorizontal: 26,
    alignItems: 'center',
    marginTop: 27.5,
  },
  statusTitle: {
    color: '#00A24D',
    fontSize: 14,
    marginBottom: 16,
    fontFamily: 'ArialRoundedMTBold',
  },
  statusSubtitle: {
    color: '#1d1d1d',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Metropolis',
  },
  day: {
    fontSize: 24,
    color: '#00A24D',
  },
  infoRepay: {
    paddingHorizontal: 18,
    paddingBottom: 28.5,
  },
  infoTextRepay: {
    color: '#FF201B',
    fontSize: 12,
  },
  operationRepay: {
    paddingHorizontal: 25,
  },
  infoSettle: {
    paddingHorizontal: 37,
    paddingVertical: 13,
  },
  infoTextSettle: {
    color: '#575757',
    fontSize: 12,
    textAlign: 'center',
  },
  operationSettle: {
    paddingHorizontal: 25,
    marginTop: 18.5,
  },
  headAfterReject: {
    marginTop: 11.5,
    alignItems: 'center',
  },
  headAfterRejectImg: {
    width: 116,
    height: 116,
  },
  afterRejectView: {
    paddingTop: 33.5,
    paddingBottom: 24,
    paddingHorizontal: 30,
  },
  afterRejectText: {
    color: '#1D1D1D',
    fontSize: 14,
  },
  headSupplement: {
    paddingLeft: 38.5,
    alignSelf: 'flex-start',
    width: 141.5 + 72,
    flexDirection: 'row',
    height: 72,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default styles
