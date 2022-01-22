import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo } from 'react'
import { useWindowSize } from 'usehooks-ts'
import type { BehaviorModel, EnterID, LeaveID, MatchedIDs, PAGE_ID } from '@/typings/behavior'
import { MMKV, Behavior } from '@/utils'
import { KEY_APPLYID, KEY_BEHAVIOR_DATA, KEY_INTERIP, KEY_OUTERIP } from '@/utils/constant'

export const useBehavior = <T extends PAGE_ID>(
  id: T,
  enterId: MatchedIDs<T, EnterID>,
  leaveId: MatchedIDs<T, LeaveID>
) => {
  const windowSize = useWindowSize()
  const behavior = useMemo(() => {
    const initModel: BehaviorModel<T> = {
      screenHeight: `${windowSize.height}`,
      screenWidth: `${windowSize.width}`,
      applyId: MMKV.getString(KEY_APPLYID) || '',
      outerIp: MMKV.getString(KEY_INTERIP) || '',
      internalIp: MMKV.getString(KEY_OUTERIP) || '',
      records: MMKV.getArray(KEY_BEHAVIOR_DATA) || [],
    }
    return new Behavior<T>(initModel)
  }, [windowSize])

  useFocusEffect(
    useCallback(() => {
      behavior.setEnterPageTime(enterId)
      return () => {
        behavior.setLeavePageTime(leaveId)
        setTimeout(() => {
          behavior.send(id)
        }, 0)
      }
    }, [behavior, enterId, id, leaveId])
  )
  return behavior
}
