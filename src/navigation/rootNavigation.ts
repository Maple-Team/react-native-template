import { createNavigationContainerRef } from '@react-navigation/native'

export const navigationRef = createNavigationContainerRef()

export function navigate(name: string, params: any) {
  if (navigationRef.isReady()) {
    // FIXME
    navigationRef.navigate(name as unknown as never, params as unknown as never)
  }
}
