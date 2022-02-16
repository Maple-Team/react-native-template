import emitter from '@/eventbus'
import { MESSAGE_DURATION } from '@/utils/constant'
import { Toast } from '@ant-design/react-native'
import { useEffect } from 'react'

export const useEventListener = () => {
  // 处理事件监听
  useEffect(() => {
    emitter.on('SHOW_LOADING', () => {
      Toast.loading('', 1000)
    })
    emitter.on('REQUEST_ERROR', e => {
      console.error('axios request error', e.config?.url, e.message)
    })
    emitter.on('RESPONSE_ERROR', e => {
      console.error('axios response error', e.config?.url, e.message)
    })
    emitter.on('SHOW_MESSAGE', ({ message, type }) => {
      Toast[type](message, MESSAGE_DURATION)
    })
    // 监听请求状态
    emitter.on('NETWORK_CONNECTED', isConnected => {
      console.log('network is connected', isConnected)
      if (!isConnected) {
        emitter.emit('SHOW_MESSAGE', { type: 'info', message: '网络断开' })
      } else {
        emitter.emit('SHOW_MESSAGE', { type: 'success', message: '网络回复正常' })
      }
    })
  }, [])
  return []
}
