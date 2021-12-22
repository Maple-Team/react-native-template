// https://github.com/developit/mitt
// https://github.com/lufinkey/react-native-events
// https://classic.yarnpkg.com/en/package/react-native-event-listeners

import mitt, { Emitter } from 'mitt'

export type Events = {
  SESSION_EXPIRED?: string
  MESSAGE: string
  LOADING: string
  LOGIN_SUCCESS?: string
  LOGOUT_SUCCESS?: string
  RESPONSE_ERROR: string
  REQUEST_ERROR: string
  REQUEST_LOADING: Boolean
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
