import { Maximize2, Minimize2 } from 'lucide-react'

type FullscreenToggleProps = {
  isFullscreen: boolean
  isSupported: boolean
  onToggle: () => void
}

export function FullscreenToggle({
  isFullscreen,
  isSupported,
  onToggle,
}: FullscreenToggleProps) {
  return (
    <button
      className="fullscreen-toggle"
      type="button"
      onClick={onToggle}
      disabled={!isSupported}
      aria-label={
        !isSupported
          ? 'Fullscreen is not supported by this browser'
          : isFullscreen
            ? 'Exit fullscreen'
            : 'Enter fullscreen'
      }
      aria-pressed={isFullscreen}
      title={
        !isSupported
          ? 'Fullscreen is not supported'
          : isFullscreen
            ? 'Exit fullscreen'
            : 'Enter fullscreen'
      }
    >
      {isFullscreen ? (
        <Minimize2 size={17} aria-hidden="true" />
      ) : (
        <Maximize2 size={17} aria-hidden="true" />
      )}
      <span>
        {!isSupported ? 'Fullscreen unavailable' : isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </span>
    </button>
  )
}
