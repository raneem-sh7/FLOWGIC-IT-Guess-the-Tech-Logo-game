export type GameSound =
  | 'correct'
  | 'incorrect'
  | 'encouraging'
  | 'progress'
  | 'achievement'
  | 'victory'

let activeContext: AudioContext | null = null

const soundSequences: Record<GameSound, number[]> = {
  correct: [523.25, 659.25],
  incorrect: [246.94, 196],
  encouraging: [392, 493.88],
  progress: [440, 554.37, 659.25],
  achievement: [523.25, 659.25, 783.99],
  victory: [523.25, 659.25, 783.99, 1046.5],
}

export function playAnswerSound(sound: GameSound): void {
  if (typeof window === 'undefined' || !window.AudioContext) return

  if (activeContext && activeContext.state !== 'closed') {
    void activeContext.close().catch((error) => {
      console.warn('Unable to stop the previous game sound.', error)
    })
  }

  let context: AudioContext

  try {
    context = new AudioContext()
    activeContext = context
  } catch (error) {
    console.warn('Unable to create the game sound audio context.', error)
    return
  }

  const notes = soundSequences[sound]
  const noteLength = sound === 'victory' ? 0.2 : 0.16
  const noteSpacing = sound === 'victory' ? 0.13 : 0.14

  if (context.state === 'suspended') {
    void context.resume().catch((error) => {
      console.warn('Unable to resume the game sound audio context.', error)
    })
  }

  notes.forEach((frequency, index) => {
    const startAt = context.currentTime + index * noteSpacing
    const oscillator = context.createOscillator()
    const volume = context.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, startAt)
    volume.gain.setValueAtTime(0.0001, startAt)
    volume.gain.exponentialRampToValueAtTime(0.11, startAt + 0.02)
    volume.gain.exponentialRampToValueAtTime(0.0001, startAt + noteLength)
    oscillator.connect(volume)
    volume.connect(context.destination)
    oscillator.start(startAt)
    oscillator.stop(startAt + noteLength)
  })

  window.setTimeout(() => {
    if (activeContext !== context) return
    void context.close().then(
      () => {
        if (activeContext === context) activeContext = null
      },
      (error: unknown) => {
        console.warn('Unable to close the game sound audio context.', error)
      },
    )
  }, notes.length * noteSpacing * 1000 + 250)
}
