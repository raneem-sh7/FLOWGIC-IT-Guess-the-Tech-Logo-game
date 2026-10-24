import type { DifficultyId } from '../types/difficulty'

type FiveTechnologies = readonly [string, string, string, string, string]

export const TECHNOLOGIES_BY_DIFFICULTY: Record<
  DifficultyId,
  FiveTechnologies
> = {
  easy: ['Python', 'Java', 'HTML', 'CSS', 'JavaScript'],
  medium: ['VS Code', 'GitHub', 'Figma', 'Git', 'Docker'],
  hard: ['React', 'Angular', 'Kubernetes', 'Redis', 'GraphQL'],
}
