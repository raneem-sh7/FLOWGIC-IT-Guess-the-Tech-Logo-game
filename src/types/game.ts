import type { DifficultyId } from './difficulty'

export type LogoQuestion = {
  id: string
  technology: string
  difficulty: DifficultyId
  logoImagePath: string
  options: readonly [string, string, string, string]
  correctAnswer: string
}

export type GameQuestion = Omit<LogoQuestion, 'options'> & {
  options: string[]
}

export type GameResult = {
  score: number
  correctAnswers: number
  incorrectAnswers: number
  timedOutAnswers: number
}

export type AnswerStatus = 'playing' | 'correct' | 'incorrect' | 'timed-out'

export type GameState = {
  questionIndex: number
  remainingSeconds: number
  revealPercent: number
  status: AnswerStatus
  selectedAnswer: string | null
  score: number
  correctAnswers: number
  incorrectAnswers: number
  timedOutAnswers: number
}
