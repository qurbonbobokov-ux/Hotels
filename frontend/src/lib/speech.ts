// Speech synthesis and recognition utilities using Web Speech API

export interface SpeechOptions {
    lang?: string
    rate?: number
    pitch?: number
    volume?: number
}

const synth = window.speechSynthesis
const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition

/**
 * Speak text using browser's text-to-speech
 */
export function speak(text: string, options?: SpeechOptions) {
    return new Promise<void>((resolve, reject) => {
        if (!synth) {
            reject(new Error('Speech synthesis not supported'))
            return
        }

        // Cancel any ongoing speech
        synth.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = options?.lang || 'en-US'
        utterance.rate = options?.rate || 1
        utterance.pitch = options?.pitch || 1
        utterance.volume = options?.volume || 1

        utterance.onend = () => resolve()
        utterance.onerror = () => reject(new Error('Speech synthesis failed'))

        synth.speak(utterance)
    })
}

/**
 * Stop speaking
 */
export function stopSpeaking() {
    if (synth) {
        synth.cancel()
    }
}

/**
 * Get available voices
 */
export function getVoices() {
    if (!synth) return []
    return synth.getVoices()
}

/**
 * Listen for speech input and return recognized text
 */
export function startListening(options?: {
    lang?: string
    continuous?: boolean
    interimResults?: boolean
    onResult?: (text: string, isFinal: boolean) => void
    onError?: (error: string) => void
}): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!SpeechRecognition) {
            reject(new Error('Speech recognition not supported'))
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = options?.lang || 'en-US'
        recognition.continuous = options?.continuous || false
        recognition.interimResults = options?.interimResults || true

        let interimTranscript = ''

        recognition.onstart = () => {
            interimTranscript = ''
        }

        recognition.onresult = (event) => {
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript

                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' '
                } else {
                    interimTranscript += transcript
                }
            }

            if (options?.onResult) {
                options.onResult(finalTranscript || interimTranscript, finalTranscript !== '')
            }

            if (finalTranscript) {
                resolve(finalTranscript.trim())
            }
        }

        recognition.onerror = (event) => {
            const errorMessage = event.error || 'Unknown error'
            if (options?.onError) {
                options.onError(errorMessage)
            }
            reject(new Error(errorMessage))
        }

        recognition.onend = () => {
            if (!interimTranscript && !options?.continuous) {
                reject(new Error('No speech detected'))
            }
        }

        recognition.start()
    })
}

/**
 * Check if speech synthesis is supported
 */
export function isSpeechSynthesisSupported(): boolean {
    return !!synth
}

/**
 * Check if speech recognition is supported
 */
export function isSpeechRecognitionSupported(): boolean {
    return !!SpeechRecognition
}
