import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowLeft,
  Check,
  Compass,
  Crown,
  Home,
  RotateCcw,
  Share2,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { FullscreenToggle } from '../components/FullscreenToggle'
import { TeamHeader } from '../components/TeamHeader'
import type { DifficultyConfig } from '../types/difficulty'
import type { GameResult } from '../types/game'

type PerformanceRank = {
  id: 'rookie' | 'explorer' | 'challenger' | 'expert' | 'master'
  name: string
  message: string
  status: string
  icon: LucideIcon
}

const PERFORMANCE_RANKS: Record<number, PerformanceRank> = {
  0: {
    id: 'rookie',
    name: 'TECH ROOKIE',
    message: 'Every tech legend starts somewhere. Ready for a comeback?',
    status: 'YOUR NEXT CHALLENGE STARTS HERE',
    icon: Sparkles,
  },
  1: {
    id: 'rookie',
    name: 'TECH ROOKIE',
    message: 'Every tech legend starts somewhere. Ready for a comeback?',
    status: 'YOUR NEXT CHALLENGE STARTS HERE',
    icon: Sparkles,
  },
  2: {
    id: 'explorer',
    name: 'CODE EXPLORER',
    message: "You're getting warmed up! Your next challenge awaits.",
    status: 'SKILLS UPGRADING...',
    icon: Compass,
  },
  3: {
    id: 'challenger',
    name: 'TECH CHALLENGER',
    message: "Challenge accepted! You're leveling up.",
    status: 'NEXT LEVEL UNLOCKING...',
    icon: Zap,
  },
  4: {
    id: 'expert',
    name: 'TECH EXPERT',
    message: 'So close to legendary! One more round?',
    status: 'ALMOST LEGENDARY!',
    icon: Trophy,
  },
  5: {
    id: 'master',
    name: 'TECH MASTER',
    message: 'LEGENDARY! You conquered the FLOWGIC IT challenge!',
    status: 'TECH MASTER UNLOCKED!',
    icon: Crown,
  },
}

type ResultsPageProps = {
  difficulty: DifficultyConfig
  result: GameResult
  isMuted: boolean
  fullscreenError: string
  isFullscreen: boolean
  isFullscreenSupported: boolean
  onToggleMuted: () => void
  onToggleFullscreen: () => void
  onPlayAgain: () => void
  onChangeDifficulty: () => void
  onBackHome: () => void
}

function copyWithFallback(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch((error: unknown) => {
      console.warn('Clipboard API copy failed; trying the browser fallback.', error)
      return copyWithLegacyFallback(text)
    })
  }

  return copyWithLegacyFallback(text)
}

function copyWithLegacyFallback(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.setAttribute('readonly', '')
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    const copied = document.execCommand('copy')
    textArea.remove()

    if (copied) resolve()
    else reject(new Error('Clipboard copy was not available.'))
  })
}

export function ResultsPage({
  difficulty,
  result,
  isMuted,
  fullscreenError,
  isFullscreen,
  isFullscreenSupported,
  onToggleMuted,
  onToggleFullscreen,
  onPlayAgain,
  onChangeDifficulty,
  onBackHome,
}: ResultsPageProps) {
  const rank = PERFORMANCE_RANKS[result.correctAnswers]
  const RankIcon = rank.icon
  const [prefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [animatedScore, setAnimatedScore] = useState(0)
  const [shareMessage, setShareMessage] = useState('')
  const accuracy = Math.round((result.correctAnswers / 5) * 100)
  const displayedScore = prefersReducedMotion ? result.score : animatedScore

  useEffect(() => {
    if (prefersReducedMotion || result.score === 0) return

    let frameId = 0
    const startTime = performance.now()
    const duration = 1300

    const animateScore = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 4
      setAnimatedScore(Math.round(result.score * easedProgress))
      if (progress < 1) frameId = requestAnimationFrame(animateScore)
    }

    frameId = requestAnimationFrame(animateScore)
    return () => cancelAnimationFrame(frameId)
  }, [prefersReducedMotion, result.score])

  async function handleShare() {
    const shareText = `I scored ${result.score}/100 as ${rank.name} on ${difficulty.name} in the FLOWGIC IT Guess the Tech Logo challenge!`
    setShareMessage('')

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My FLOWGIC IT challenge result',
          text: shareText,
        })
        setShareMessage('Result shared!')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    try {
      await copyWithFallback(shareText)
      setShareMessage('Result copied to clipboard!')
    } catch (error) {
      console.error('Unable to share or copy the result.', error)
      setShareMessage('Sharing is unavailable in this browser.')
    }
  }

  return (
    <main className={`welcome-page results-page rank-${rank.id}`}>
      <div className="ambient ambient-blue" aria-hidden="true" />
      <div className="ambient ambient-cyan" aria-hidden="true" />
      <div className="background-grid" aria-hidden="true" />

      {rank.id === 'master' && (
        <div className="celebration-confetti" aria-hidden="true">
          {Array.from({ length: 48 }, (_, index) => (
            <span
              className="confetti-piece"
              key={index}
              style={{
                left: `${(index * 37) % 100}%`,
                animationDelay: `${(index % 12) * -0.23}s`,
                animationDuration: `${3.4 + (index % 6) * 0.45}s`,
              }}
            />
          ))}
        </div>
      )}

      <TeamHeader
        actions={
          <div className="header-controls">
            <FullscreenToggle
              isFullscreen={isFullscreen}
              isSupported={isFullscreenSupported}
              onToggle={onToggleFullscreen}
            />
            <button
              className="sound-toggle"
              type="button"
              onClick={onToggleMuted}
              aria-label={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
              aria-pressed={isMuted}
              title={isMuted ? 'Turn sounds on' : 'Turn sounds off'}
            >
              {isMuted ? (
                <VolumeX size={17} aria-hidden="true" />
              ) : (
                <Volume2 size={17} aria-hidden="true" />
              )}
              <span>{isMuted ? 'Sound off' : 'Sound on'}</span>
            </button>
          </div>
        }
      />

      {fullscreenError && (
        <p className="fullscreen-error" role="status">
          {fullscreenError}
        </p>
      )}

      <section className="results-content">
        <div className="rank-emblem" aria-hidden="true">
          <RankIcon size={40} strokeWidth={1.6} />
          {rank.id === 'expert' &&
            Array.from({ length: 12 }, (_, index) => (
              <span
                className="gold-particle"
                key={index}
                style={{
                  '--particle-angle': `${index * 30}deg`,
                } as CSSProperties}
              />
            ))}
        </div>

        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>CHALLENGE COMPLETE</span>
        </div>

        <h1 className="results-rank">{rank.name}</h1>
        {rank.id === 'master' && (
          <p className="legendary-label">LEGENDARY!</p>
        )}
        <p className="results-message">{rank.message}</p>
        <p className="game-selected-difficulty">
          Difficulty: <strong>{difficulty.name}</strong>
        </p>

        <div className="results-score-panel">
          <div className="results-score-heading">
            <span>FINAL SCORE</span>
            <span className="animated-score">
              {displayedScore}
              <span> / 100</span>
            </span>
          </div>
          <div
            className="results-progress-track"
            role="progressbar"
            aria-label="Final score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={displayedScore}
          >
            <span
              className="results-progress-fill"
              style={{ width: `${displayedScore}%` }}
            />
          </div>
          <div className="results-stat-grid">
            <div className="results-stat">
              <Check size={16} aria-hidden="true" />
              <span className="results-stat-label">CORRECT</span>
              <strong>{result.correctAnswers}</strong>
            </div>
            <div className="results-stat">
              <span className="results-stat-symbol incorrect-symbol">×</span>
              <span className="results-stat-label">INCORRECT</span>
              <strong>{result.incorrectAnswers}</strong>
            </div>
            <div className="results-stat">
              <span className="results-stat-symbol timeout-symbol">⌛</span>
              <span className="results-stat-label">TIMED OUT</span>
              <strong>{result.timedOutAnswers}</strong>
            </div>
            <div className="results-stat accuracy-stat">
              <span className="results-stat-label">ACCURACY</span>
              <strong>{accuracy}%</strong>
            </div>
          </div>
        </div>

        <div className="rank-status" aria-live="polite">
          {rank.status}
        </div>

        <div className="results-actions">
          {rank.id === 'rookie' && (
            <button
              className="try-again-button"
              type="button"
              onClick={onPlayAgain}
            >
              <RotateCcw size={16} aria-hidden="true" />
              TRY AGAIN
            </button>
          )}
          <button
            className="results-action-button primary-result-action"
            type="button"
            onClick={onPlayAgain}
          >
            <RotateCcw size={16} aria-hidden="true" />
            PLAY AGAIN
          </button>
          <button
            className="results-action-button"
            type="button"
            onClick={onChangeDifficulty}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            CHANGE DIFFICULTY
          </button>
          <button
            className="results-action-button"
            type="button"
            onClick={onBackHome}
          >
            <Home size={16} aria-hidden="true" />
            BACK TO HOME
          </button>
          <button
            className="results-action-button share-result-button"
            type="button"
            onClick={() => void handleShare()}
          >
            <Share2 size={16} aria-hidden="true" />
            SHARE MY RESULT
          </button>
        </div>
        <p className="share-feedback" role="status" aria-live="polite">
          {shareMessage}
        </p>
      </section>

      <footer className="welcome-footer">
        <span className="footer-line" />
        <span>MADE FOR THE NEXT GENERATION OF TECH</span>
        <span className="footer-line" />
      </footer>
    </main>
  )
}
