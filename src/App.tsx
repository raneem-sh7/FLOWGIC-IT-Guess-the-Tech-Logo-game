import { useState } from 'react'
import { DIFFICULTIES } from './config/difficulties'
import { DifficultyPage } from './pages/DifficultyPage'
import { GamePage } from './pages/GamePage'
import { ResultsPage } from './pages/ResultsPage'
import { WelcomePage } from './pages/WelcomePage'
import { useFullscreen } from './hooks/useFullscreen'
import type { DifficultyId } from './types/difficulty'
import type { GameQuestion, GameResult } from './types/game'
import { createGameQuestions } from './utils/createGameQuestions'

function App() {
  const [currentPage, setCurrentPage] = useState<
    'welcome' | 'difficulty' | 'game' | 'results'
  >('welcome')
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyId | null>(null)
  const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([])
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isSoundMuted, setIsSoundMuted] = useState(false)
  const { error: fullscreenError, isFullscreen, isSupported, toggleFullscreen } =
    useFullscreen()

  function goHome() {
    setSelectedDifficulty(null)
    setGameQuestions([])
    setGameResult(null)
    setCurrentPage('welcome')
  }

  function startChallenge() {
    if (!selectedDifficulty) return
    setGameQuestions(createGameQuestions(selectedDifficulty))
    setGameResult(null)
    setCurrentPage('game')
  }

  function completeChallenge(result: GameResult) {
    setGameResult(result)
    setCurrentPage('results')
  }

  return (
    <div className="app-shell">
      {currentPage === 'welcome' && (
        <WelcomePage onStart={() => setCurrentPage('difficulty')} />
      )}
      {currentPage === 'difficulty' && (
        <DifficultyPage
          selectedDifficulty={selectedDifficulty}
          onBack={goHome}
          onSelect={setSelectedDifficulty}
          onStart={startChallenge}
        />
      )}
      {currentPage === 'game' && selectedDifficulty && (
        <GamePage
          difficulty={DIFFICULTIES[selectedDifficulty]}
          questions={gameQuestions}
          isMuted={isSoundMuted}
          fullscreenError={fullscreenError}
          isFullscreen={isFullscreen}
          isFullscreenSupported={isSupported}
          onBack={() => setCurrentPage('difficulty')}
          onToggleMuted={() => setIsSoundMuted((muted) => !muted)}
          onToggleFullscreen={toggleFullscreen}
          onComplete={completeChallenge}
        />
      )}
      {currentPage === 'results' &&
        selectedDifficulty &&
        gameResult && (
          <ResultsPage
            difficulty={DIFFICULTIES[selectedDifficulty]}
            result={gameResult}
            isMuted={isSoundMuted}
            fullscreenError={fullscreenError}
            isFullscreen={isFullscreen}
            isFullscreenSupported={isSupported}
            onToggleMuted={() => setIsSoundMuted((muted) => !muted)}
            onToggleFullscreen={toggleFullscreen}
            onPlayAgain={startChallenge}
            onChangeDifficulty={() => setCurrentPage('difficulty')}
            onBackHome={goHome}
          />
        )}
    </div>
  )
}

export default App
