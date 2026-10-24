export type DifficultyId = 'easy' | 'medium' | 'hard'

export type DifficultyConfig = {
  id: DifficultyId
  name: string
  description: string
  questionCount: 5
  icon: 'sparkles' | 'wrench' | 'layers'
  technologies: readonly string[]
}
