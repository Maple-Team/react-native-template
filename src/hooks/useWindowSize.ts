import { useLayoutEffect, useState } from 'react'
import { Dimensions } from 'react-native'

interface WindowSize {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  const handleSize = () => {
    const { width, height } = Dimensions.get('window')

    setWindowSize({
      width,
      height,
    })
  }

  // ('resize', handleSize) // NOTE no intention to handle this in RN app

  useLayoutEffect(() => {
    handleSize()
  }, [])

  return windowSize
}
