import { ArrowRight } from 'lucide-react'

type WelcomePageProps = {
  onStart: () => void
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  return (
    <main className="welcome-page">
      <div className="ambient ambient-blue" aria-hidden="true" />
      <div className="ambient ambient-cyan" aria-hidden="true" />
      <div className="background-grid" aria-hidden="true" />

      <header className="welcome-header">
        <a className="team-brand" href="#home" aria-label="Flowgic IT home">
          <span className="team-logo-frame">
            <img
              className="team-logo"
              src="/logos/Flowgic-Logo.png"
              alt="Flowgic IT team logo"
            />
          </span>
          <span className="team-name">
            <span>Flowgic IT</span>
            <span>STUDENT TEAM</span>
          </span>
        </a>
      </header>

      <section className="welcome-content" id="home">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          <span>THE FLOWGIC IT CHALLENGE</span>
        </div>

        <h1 className="hero-title" aria-label="GUESS THE TECH LOGO">
          <span>GUESS THE</span>
          <span className="title-highlight">TECH LOGO</span>
        </h1>

        <p className="hero-subtitle">Think you know tech? Prove it!</p>

        <div className="challenge-pill" aria-label="5 Logos, 3 Levels, 1 Challenge">
          <span>5 Logos</span>
          <span className="pill-separator" aria-hidden="true">•</span>
          <span>3 Levels</span>
          <span className="pill-separator" aria-hidden="true">•</span>
          <span>1 Challenge</span>
        </div>

        <button
          className="start-button"
          type="button"
          onClick={onStart}
        >
          <span>START GAME</span>
          <span className="start-icon">
            <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
          </span>
        </button>

        <p className="start-caption">Your tech knowledge. Your moment.</p>
      </section>

      <footer className="welcome-footer">
        <span className="footer-line" />
        <span>MADE FOR THE NEXT GENERATION OF TECH</span>
        <span className="footer-line" />
      </footer>
    </main>
  )
}
