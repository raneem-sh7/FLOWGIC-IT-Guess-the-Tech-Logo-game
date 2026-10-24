import { useState } from 'react'

type LogoRevealProps = {
  questionId: string
  imagePath: string
  technology: string
  revealPercent: number
}

export function LogoReveal({
  questionId,
  imagePath,
  technology,
  revealPercent,
}: LogoRevealProps) {
  const [failedImageId, setFailedImageId] = useState<string | null>(null)
  const imageFailed = failedImageId === questionId
  const hiddenPercent = (100 - revealPercent) / 2

  return (
    <div className="logo-image-window">
      {imageFailed ? (
        <span className="logo-unavailable">Logo unavailable</span>
      ) : (
        <img
          key={questionId}
          className="logo-clue"
          src={imagePath}
          alt={
            revealPercent === 100
              ? 'Technology logo fully revealed'
              : 'Partially revealed technology logo'
          }
          style={{
            clipPath: `inset(${hiddenPercent}% 0)`,
          }}
          onError={() => setFailedImageId(questionId)}
        />
      )}
      <span className="logo-question-label" aria-live="polite">
        {revealPercent}% revealed
      </span>
      {imageFailed && (
        <span className="sr-only">{technology} logo image could not be loaded.</span>
      )}
    </div>
  )
}
