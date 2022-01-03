import StyleSheet from 'react-native-adaptive-stylesheet'

export default StyleSheet.create({
  buttonCircle: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(1, 35, 247, 1)',
    borderRadius: 13 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 100,
    resizeMode: 'cover',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    right: 0,
    bottom: 0,
  },
  text: {
    color: 'rgba(73, 73, 81, 1)',
    textAlign: 'center',
    fontSize: 14,
  },
  title: {
    fontSize: 19,
    color: 'rgba(1, 35, 247, 1)',
    textAlign: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
})
