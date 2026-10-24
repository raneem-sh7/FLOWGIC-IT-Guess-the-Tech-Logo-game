import { ArrowRight, Volume2, VolumeX } from 'lucide-react'

type WelcomePageProps = {
  isVoiceMuted: boolean
  isVoiceSupported: boolean
  onStart: () => void
  onToggleVoice: () => void
}

export function WelcomePage({
  isVoiceMuted,
  isVoiceSupported,
  onStart,
  onToggleVoice,
}: WelcomePageProps) {
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
        <button
          className="sound-toggle welcome-voice-toggle"
          type="button"
          onClick={onToggleVoice}
          disabled={!isVoiceSupported}
          aria-label={
            !isVoiceSupported
              ? 'Welcome voice is not supported by this browser'
              : isVoiceMuted
                ? 'Unmute welcome voice'
                : 'Mute welcome voice'
          }
          aria-pressed={isVoiceMuted}
          title={
            !isVoiceSupported
              ? 'Welcome voice is not supported'
              : isVoiceMuted
                ? 'Turn welcome voice on'
                : 'Turn welcome voice off'
          }
        >
          {isVoiceMuted ? (
            <VolumeX size={17} aria-hidden="true" />
          ) : (
            <Volume2 size={17} aria-hidden="true" />
          )}
          <span>
            {!isVoiceSupported
              ? 'Voice unavailable'
              : isVoiceMuted
                ? 'Voice off'
                : 'Voice on'}
          </span>
        </button>
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
