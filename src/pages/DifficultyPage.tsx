import { ArrowLeft, Layers3, Sparkles, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { TeamHeader } from '../components/TeamHeader'
import { DIFFICULTY_LIST } from '../config/difficulties'
import type { DifficultyId } from '../types/difficulty'

const difficultyIcons: Record<DifficultyId, LucideIcon> = {
  easy: Sparkles,
  medium: Wrench,
  hard: Layers3,
}

type DifficultyPageProps = {
  selectedDifficulty: DifficultyId | null
  onBack: () => void
  onSelect: (difficulty: DifficultyId) => void
  onStart: () => void
}

export function DifficultyPage({
  selectedDifficulty,
  onBack,
  onSelect,
  onStart,
}: DifficultyPageProps) {
  return (
    <main className="welcome-page difficulty-page">
      <div className="ambient ambient-blue" aria-hidden="true" />
      <div className="ambient ambient-cyan" aria-hidden="true" />
      <div className="background-grid" aria-hidden="true" />

      <TeamHeader />

      <section className="difficulty-content">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>YOUR CHALLENGE STARTS HERE</span>
        </div>
        <h1 className="difficulty-title">Choose Your Difficulty</h1>
        <p className="difficulty-description">
          Pick your level and get ready to put your tech knowledge to the test.
        </p>

        <div className="difficulty-grid" aria-label="Difficulty levels">
          {DIFFICULTY_LIST.map((difficulty) => {
            const Icon = difficultyIcons[difficulty.id]
            const isSelected = selectedDifficulty === difficulty.id

            return (
              <button
                key={difficulty.id}
                className={`difficulty-card${isSelected ? ' is-selected' : ''}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(difficulty.id)}
              >
                <span className={`difficulty-card-icon icon-${difficulty.id}`}>
                  <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="difficulty-card-heading">
                  <span className="difficulty-card-name">{difficulty.name}</span>
                  <span className="question-count">
                    {difficulty.questionCount} Questions
                  </span>
                </span>
                <span className="difficulty-card-description">
                  {difficulty.description}
                </span>
              </button>
            )
          })}
        </div>

        <div className="difficulty-actions">
          <button className="back-button" type="button" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            <span>Back to Welcome</span>
          </button>
          <button
            className="challenge-button"
            type="button"
            onClick={onStart}
            disabled={!selectedDifficulty}
          >
            START CHALLENGE
          </button>
        </div>
      </section>

      <footer className="welcome-footer">
        <span className="footer-line" />
        <span>MADE FOR THE NEXT GENERATION OF TECH</span>
        <span className="footer-line" />
      </footer>
    </main>
  )
}
