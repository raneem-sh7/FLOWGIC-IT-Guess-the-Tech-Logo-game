import { useCallback, useEffect, useState } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState('')
  const isSupported =
    typeof document !== 'undefined' &&
    typeof document.documentElement.requestFullscreen === 'function' &&
    typeof document.exitFullscreen === 'function'

  useEffect(() => {
    if (!isSupported) return

    const syncFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement !== null)
    }

    document.addEventListener('fullscreenchange', syncFullscreenState)
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState)
    }
  }, [isSupported])

  const toggleFullscreen = useCallback(async () => {
    if (!isSupported) return

    setError('')
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
    } catch (fullscreenError) {
      console.error('Unable to change fullscreen mode.', fullscreenError)
      setError('Fullscreen could not be changed. Check your browser permissions.')
    }
  }, [isSupported])

  return { error, isFullscreen, isSupported, toggleFullscreen }
}
