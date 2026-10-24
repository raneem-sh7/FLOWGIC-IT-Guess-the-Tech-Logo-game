import type { DifficultyId } from '../types/difficulty'
import type { LogoQuestion } from '../types/game'

type FiveQuestions = readonly [
  LogoQuestion,
  LogoQuestion,
  LogoQuestion,
  LogoQuestion,
  LogoQuestion,
]

const question = (
  id: string,
  technology: string,
  difficulty: DifficultyId,
  logoImagePath: string,
  options: [string, string, string, string],
): LogoQuestion => ({
  id,
  technology,
  difficulty,
  logoImagePath,
  options,
  correctAnswer: technology,
})

export const QUESTIONS_BY_DIFFICULTY: Record<DifficultyId, FiveQuestions> = {
  easy: [
    question('easy-python', 'Python', 'easy', '/logos/python.svg', [
      'Python',
      'Java',
      'JavaScript',
      'Ruby',
    ]),
    question('easy-java', 'Java', 'easy', '/logos/java.svg', [
      'Java',
      'JavaScript',
      'Python',
      'C#',
    ]),
    question('easy-html', 'HTML', 'easy', '/logos/html5.svg', [
      'HTML',
      'CSS',
      'JavaScript',
      'XML',
    ]),
    question('easy-css', 'CSS', 'easy', '/logos/css3.svg', [
      'CSS',
      'HTML',
      'JavaScript',
      'Sass',
    ]),
    question('easy-javascript', 'JavaScript', 'easy', '/logos/javascript.svg', [
      'JavaScript',
      'TypeScript',
      'HTML',
      'Python',
    ]),
  ],
  medium: [
    question('medium-vscode', 'VS Code', 'medium', '/logos/vscode.svg', [
      'VS Code',
      'GitHub',
      'Docker',
      'Figma',
    ]),
    question('medium-github', 'GitHub', 'medium', '/logos/github.svg', [
      'GitHub',
      'Git',
      'Docker',
      'VS Code',
    ]),
    question('medium-figma', 'Figma', 'medium', '/logos/figma.svg', [
      'Figma',
      'GitHub',
      'VS Code',
      'Canva',
    ]),
    question('medium-git', 'Git', 'medium', '/logos/git.svg', [
      'Git',
      'GitHub',
      'Docker',
      'Linux',
    ]),
    question('medium-docker', 'Docker', 'medium', '/logos/docker.svg', [
      'Docker',
      'Kubernetes',
      'Git',
      'GitHub',
    ]),
  ],
  hard: [
    question('hard-react', 'React', 'hard', '/logos/react.svg', [
      'React',
      'Angular',
      'GraphQL',
      'Vue.js',
    ]),
    question('hard-angular', 'Angular', 'hard', '/logos/angular.svg', [
      'Angular',
      'React',
      'GraphQL',
      'TypeScript',
    ]),
    question('hard-kubernetes', 'Kubernetes', 'hard', '/logos/kubernetes.svg', [
      'Kubernetes',
      'Docker',
      'Redis',
      'GraphQL',
    ]),
    question('hard-redis', 'Redis', 'hard', '/logos/redis.svg', [
      'Redis',
      'GraphQL',
      'Docker',
      'Kubernetes',
    ]),
    question('hard-graphql', 'GraphQL', 'hard', '/logos/graphql.svg', [
      'GraphQL',
      'React',
      'Redis',
      'Angular',
    ]),
  ],
}
