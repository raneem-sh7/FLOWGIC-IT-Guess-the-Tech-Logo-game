import { useEffect, useReducer, useRef } from 'react'
import {
  ArrowLeft,
  Check,
  Clock3,
  Lightbulb,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { LogoReveal } from '../components/LogoReveal'
import { FullscreenToggle } from '../components/FullscreenToggle'
import { TeamHeader } from '../components/TeamHeader'
import type { DifficultyConfig } from '../types/difficulty'
import type { GameQuestion, GameResult, GameState } from '../types/game'
import { playAnswerSound, type GameSound } from '../utils/playAnswerSound'

const QUESTION_TIME_SECONDS = 15
const INITIAL_REVEAL_PERCENT = 25
const MAX_HINT_REVEAL_PERCENT = 90

type GameAction =
  | { type: 'tick' }
  | { type: 'reveal' }
  | { type: 'answer'; answer: string; correctAnswer: string }
  | { type: 'next' }

const initialGameState: GameState = {
  questionIndex: 0,
  remainingSeconds: QUESTION_TIME_SECONDS,
  revealPercent: INITIAL_REVEAL_PERCENT,
  status: 'playing',
  selectedAnswer: null,
  score: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  timedOutAnswers: 0,
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'tick') {
    if (state.status !== 'playing') return state
    if (state.remainingSeconds <= 1) {
      return {
        ...state,
        remainingSeconds: 0,
        status: 'timed-out',
        timedOutAnswers: state.timedOutAnswers + 1,
      }
    }
    return { ...state, remainingSeconds: state.remainingSeconds - 1 }
  }

  if (action.type === 'reveal') {
    if (
      state.status !== 'playing' ||
      state.revealPercent >= MAX_HINT_REVEAL_PERCENT
    ) {
      return state
    }
    return {
      ...state,
      revealPercent: Math.min(
        state.revealPercent + 20,
        MAX_HINT_REVEAL_PERCENT,
      ),
    }
  }

  if (action.type === 'answer') {
    if (state.status !== 'playing') return state
    const isCorrect = action.answer === action.correctAnswer
    return {
      ...state,
      status: isCorrect ? 'correct' : 'incorrect',
      selectedAnswer: action.answer,
      score: state.score + (isCorrect ? 20 : 0),
      correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: state.incorrectAnswers + (isCorrect ? 0 : 1),
    }
  }

  if (state.status === 'playing') return state

  return {
    ...state,
    questionIndex: state.questionIndex + 1,
    remainingSeconds: QUESTION_TIME_SECONDS,
    revealPercent: INITIAL_REVEAL_PERCENT,
    status: 'playing',
    selectedAnswer: null,
  }
}

type GamePageProps = {
  difficulty: DifficultyConfig
  questions: GameQuestion[]
  isMuted: boolean
  fullscreenError: string
  isFullscreen: boolean
  isFullscreenSupported: boolean
  onBack: () => void
  onToggleMuted: () => void
  onToggleFullscreen: () => void
  onComplete: (result: GameResult) => void
}

export function GamePage({
  difficulty,
  questions,
  isMuted,
  fullscreenError,
  isFullscreen,
  isFullscreenSupported,
  onBack,
  onToggleMuted,
  onToggleFullscreen,
  onComplete,
}: GamePageProps) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState)
  const answerLock = useRef(false)
  const continueLock = useRef(false)
  const soundPlayedForQuestion = useRef<number | null>(null)
  const answerGridRef = useRef<HTMLDivElement>(null)
  const currentQuestion = questions[state.questionIndex]
  const isAnswered = state.status !== 'playing'
  const revealPercent = isAnswered ? 100 : state.revealPercent
  const isLastQuestion = state.questionIndex === questions.length - 1

  useEffect(() => {
    answerLock.current = false
    continueLock.current = false
    if (state.questionIndex > 0) answerGridRef.current?.focus()
  }, [state.questionIndex])

  useEffect(() => {
    if (state.status !== 'correct' && state.status !== 'incorrect') return
    if (soundPlayedForQuestion.current === state.questionIndex) return

    soundPlayedForQuestion.current = state.questionIndex
    if (!isMuted) {
      playAnswerSound(state.status)
    }
  }, [isMuted, state.questionIndex, state.status])

  useEffect(() => {
    if (state.status !== 'playing') return

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'tick' })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [state.questionIndex, state.status])

  function handleAnswer(answer: string) {
    if (state.status !== 'playing' || answerLock.current) return
    answerLock.current = true

    dispatch({
      type: 'answer',
      answer,
      correctAnswer: currentQuestion.correctAnswer,
    })
  }

  function handleContinue() {
    if (!isAnswered || continueLock.current) return
    continueLock.current = true
    if (isLastQuestion) {
      const result: GameResult = {
        score: state.score,
        correctAnswers: state.correctAnswers,
        incorrectAnswers: state.incorrectAnswers,
        timedOutAnswers: state.timedOutAnswers,
      }
      const endingSound: GameSound =
        state.correctAnswers <= 1
          ? 'encouraging'
          : state.correctAnswers <= 3
            ? 'progress'
            : state.correctAnswers === 4
              ? 'achievement'
              : 'victory'

      if (!isMuted) playAnswerSound(endingSound)
      onComplete(result)
      return
    }
    dispatch({ type: 'next' })
  }

  const feedbackMessage =
    state.status === 'correct'
      ? 'Correct! Great job!'
      : state.status === 'incorrect'
        ? `Not quite! The correct answer is ${currentQuestion.correctAnswer}.`
        : state.status === 'timed-out'
          ? `Time's up! The correct answer is ${currentQuestion.correctAnswer}.`
          : ''

  return (
    <main className="welcome-page game-page">
      <div className="ambient ambient-blue" aria-hidden="true" />
      <div className="ambient ambient-cyan" aria-hidden="true" />
      <div className="background-grid" aria-hidden="true" />

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

      <section className="game-content">
        <div className="game-heading">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>{difficulty.name.toUpperCase()} CHALLENGE</span>
          </div>
          <h1 className="difficulty-title">Guess the Tech Logo</h1>
        </div>

        <div className="game-hud">
          <div className="game-hud-item">
            <span className="game-hud-label">QUESTION</span>
            <span className="game-hud-value">
              {state.questionIndex + 1} <span>/ {questions.length}</span>
            </span>
          </div>
          <div
            className={`game-timer${state.remainingSeconds <= 5 ? ' is-warning' : ''}`}
            role="timer"
            aria-label={`${state.remainingSeconds} seconds remaining`}
          >
            <Clock3 size={18} aria-hidden="true" />
            <span>00:{String(state.remainingSeconds).padStart(2, '0')}</span>
            <span
              className="timer-progress"
              aria-hidden="true"
              style={{ width: `${(state.remainingSeconds / QUESTION_TIME_SECONDS) * 100}%` }}
            />
          </div>
          <div className="game-hud-item game-score">
            <span className="game-hud-label">SCORE</span>
            <span className="game-hud-value">
              {state.score} <span>/ 100</span>
            </span>
          </div>
        </div>

        <div
          className="game-progress-track"
          role="progressbar"
          aria-label="Game progress"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={state.questionIndex + 1}
        >
          <span
            className="game-progress-fill"
            style={{
              width: `${((state.questionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <section
          className="game-question-card"
          aria-label="Logo question"
          key={currentQuestion.id}
        >
          <p className="game-prompt">Which technology does this logo belong to?</p>
          <LogoReveal
            questionId={currentQuestion.id}
            imagePath={currentQuestion.logoImagePath}
            technology={currentQuestion.technology}
            revealPercent={revealPercent}
          />

          <button
            className="reveal-button"
            type="button"
            onClick={() => dispatch({ type: 'reveal' })}
            disabled={isAnswered || state.revealPercent >= MAX_HINT_REVEAL_PERCENT}
          >
            <Lightbulb size={17} aria-hidden="true" />
            <span>
              {isAnswered
                ? 'Logo fully revealed'
                : state.revealPercent >= MAX_HINT_REVEAL_PERCENT
                  ? 'Maximum reveal'
                  : 'Reveal More'}
            </span>
            {!isAnswered && state.revealPercent < MAX_HINT_REVEAL_PERCENT && (
              <span className="reveal-amount">+20%</span>
            )}
          </button>
        </section>

        <div
          className="answer-grid"
          role="group"
          aria-label="Answer choices"
          tabIndex={-1}
          ref={answerGridRef}
        >
          {currentQuestion.options.map((option) => {
            const isCorrectAnswer = option === currentQuestion.correctAnswer
            const isSelectedAnswer = option === state.selectedAnswer
            const answerClass =
              isAnswered && isCorrectAnswer
                ? ' is-correct'
                : isAnswered && isSelectedAnswer && state.status === 'incorrect'
                  ? ' is-incorrect'
                  : ''

            return (
              <button
                className={`answer-button${answerClass}`}
                type="button"
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                aria-pressed={isSelectedAnswer}
                aria-label={`Answer ${option}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrectAnswer && (
                  <Check size={19} aria-hidden="true" />
                )}
                {isAnswered &&
                  isSelectedAnswer &&
                  state.status === 'incorrect' && (
                    <X size={19} aria-hidden="true" />
                  )}
              </button>
            )
          })}
        </div>

        {isAnswered && (
          <div
            className={`answer-feedback feedback-${state.status}`}
            role="status"
            aria-live="polite"
          >
            {feedbackMessage}
          </div>
        )}

        <div className="game-actions">
          <button className="back-button" type="button" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            <span>Back to Difficulty Selection</span>
          </button>
          {isAnswered && (
            <button
              className="challenge-button"
              type="button"
              onClick={handleContinue}
            >
              {isLastQuestion ? 'SEE RESULTS' : 'NEXT QUESTION'}
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
