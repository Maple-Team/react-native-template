export default {
  debug: function() {
    if (__DEV__) {
      console.debug(`[${new Date()}] `, ...arguments)
    }
  },
  info: function() {
    if (__DEV__) {
      console.info(`[${new Date()}] `, ...arguments)
    }
  },
  log: function() {
    if (__DEV__) {
      console.log(`[${new Date()}] `, ...arguments)
    }
  },
  error: function() {
    if (__DEV__) {
      console.error(`[${new Date()}] `, ...arguments)
    }
  },
  gap: function() {
    console.debug('------------------------------------------------------------------------------')
  },
}
