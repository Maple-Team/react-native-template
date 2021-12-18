import {CommonHeader} from '../typings/request'
import {LoginUser} from '../typings/user'

interface State {
  token?: string
  req?: CommonHeader
}
const initialState: State = {}

export type ActionType = 'updateToken'

export interface Action<T> {
  type: ActionType
  paremter: T
}

export function reducer<T>(state: State, action: Action<T>): State {
  switch (action.type) {
    case 'updateToken':
      return {...state, token: action.paremter.type}
    default:
      throw new Error()
  }
}
