import { TECHNOLOGIES_BY_DIFFICULTY } from '../data/technologies'
import type { DifficultyConfig, DifficultyId } from '../types/difficulty'

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Easy',
    description: 'Popular programming languages and web technologies.',
    questionCount: 5,
    icon: 'sparkles',
    technologies: TECHNOLOGIES_BY_DIFFICULTY.easy,
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    description: 'Developer tools and platforms.',
    questionCount: 5,
    icon: 'wrench',
    technologies: TECHNOLOGIES_BY_DIFFICULTY.medium,
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    description: 'Advanced frameworks and technologies.',
    questionCount: 5,
    icon: 'layers',
    technologies: TECHNOLOGIES_BY_DIFFICULTY.hard,
  },
}

export const DIFFICULTY_LIST = Object.values(DIFFICULTIES)
