import { useCallback, useRef, useState } from 'react'

const welcomeMessage = 'Welcome to Flow Jik Game!'
const VOICE_LOAD_TIMEOUT_MS = 700
const FEMALE_VOICE_NAME_HINTS =
  /\b(female|woman|samantha|victoria|karen|zira|aria|jenny|sara|susan|ava|june|linda)\b/i

function chooseEnglishVoice(voices: SpeechSynthesisVoice[]) {
  const englishVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith('en'),
  )
  const usVoices = englishVoices.filter((voice) =>
    voice.lang.toLowerCase().startsWith('en-us'),
  )

  return (
    usVoices.find((voice) => FEMALE_VOICE_NAME_HINTS.test(voice.name)) ??
    usVoices[0] ??
    englishVoices.find((voice) => FEMALE_VOICE_NAME_HINTS.test(voice.name)) ??
    englishVoices[0]
  )
}

function waitForVoices(speech: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const voices = speech.getVoices()
  if (voices.length > 0) return Promise.resolve(voices)

  return new Promise((resolve) => {
    let timeoutId = 0

    const finish = () => {
      window.clearTimeout(timeoutId)
      speech.removeEventListener('voiceschanged', handleVoicesChanged)
      resolve(speech.getVoices())
    }

    const handleVoicesChanged = () => {
      if (speech.getVoices().length > 0) finish()
    }

    speech.addEventListener('voiceschanged', handleVoicesChanged)
    timeoutId = window.setTimeout(finish, VOICE_LOAD_TIMEOUT_MS)
  })
}

export function useWelcomeSpeech() {
  const [isMuted, setIsMuted] = useState(false)
  const isMutedRef = useRef(false)
  const speechRequestRef = useRef(0)
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined'

  const speakWelcome = useCallback(async () => {
    if (isMutedRef.current || !isSupported) return

    const speech = window.speechSynthesis
    const requestId = ++speechRequestRef.current
    speech.cancel()

    const voices = await waitForVoices(speech)
    if (requestId !== speechRequestRef.current || isMutedRef.current) return

    const utterance = new SpeechSynthesisUtterance(welcomeMessage)
    const englishVoice = chooseEnglishVoice(voices)

    if (englishVoice) utterance.voice = englishVoice
    utterance.lang = 'en-US'
    utterance.rate = 0.92
    utterance.pitch = 1.15
    utterance.volume = 1
    speech.speak(utterance)
  }, [isSupported])

  const toggleMuted = useCallback(() => {
    const nextMuted = !isMutedRef.current
    isMutedRef.current = nextMuted
    setIsMuted(nextMuted)
    if (nextMuted) {
      speechRequestRef.current += 1
      if (isSupported) window.speechSynthesis.cancel()
    }
  }, [isSupported])

  return { isMuted, isSupported, speakWelcome, toggleMuted }
}
