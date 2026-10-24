import type { ReactNode } from 'react'

type TeamHeaderProps = {
  actions?: ReactNode
}

export function TeamHeader({ actions }: TeamHeaderProps) {
  return (
    <header className="welcome-header">
      <div className="team-brand">
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
      </div>
      {actions}
    </header>
  )
}
