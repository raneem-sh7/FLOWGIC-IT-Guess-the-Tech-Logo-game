import { QUESTIONS_BY_DIFFICULTY } from '../data/questions'
import type { DifficultyId } from '../types/difficulty'
import type { GameQuestion } from '../types/game'
import { shuffle } from './shuffle'

export function createGameQuestions(
  difficulty: DifficultyId,
): GameQuestion[] {
  return shuffle(QUESTIONS_BY_DIFFICULTY[difficulty]).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }))
}
