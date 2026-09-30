/**
 * Tiny procedural audio engine — everything here is synthesized with the
 * Web Audio API (noise bursts + oscillators), so there are no audio files
 * to ship. Two sounds: a soft ambient "typing" loop, and a two-note robot
 * "beep" for the desk mascot. Mute state is shared globally (header button
 * + the two desk amplifiers all toggle the same thing) and remembered
 * across visits via localStorage — this is the live site, not a Claude
 * artifact, so normal browser storage is the right tool here.
 */

type Listener = (muted: boolean) => void

let ctx: AudioContext | null = null
let muted = false
let unlocked = false
let typingTimer: number | null = null
const listeners = new Set<Listener>()

if (typeof window !== 'undefined') {
  try {
    muted = window.localStorage.getItem('bpl-muted') === '1'
  } catch {
    muted = false
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** A single soft "tick" — a short filtered noise burst, gently panned so the
 * loop feels present/around the listener rather than flat and centered
 * (the desk scene faces away from the viewer, so the sound leans toward
 * you rather than sitting behind the screens). */
function tick(pan: number) {
  const ac = getCtx()
  if (!ac || muted) return
  const now = ac.currentTime
  const length = Math.floor(0.02 * ac.sampleRate)
  const buffer = ac.createBuffer(1, length, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length)

  const src = ac.createBufferSource()
  src.buffer = buffer

  const filter = ac.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 1800

  const gain = ac.createGain()
  gain.gain.setValueAtTime(0.05, now)
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.035)

  const panner = ac.createStereoPanner()
  panner.pan.value = Math.max(-1, Math.min(1, pan))

  src.connect(filter).connect(gain).connect(panner).connect(ac.destination)
  src.start(now)
  src.stop(now + 0.05)
}

function scheduleNextTick() {
  typingTimer = window.setTimeout(() => {
    if (unlocked && !muted) {
      const pan = Math.sin(Date.now() / 850) * 0.4
      tick(pan)
    }
    scheduleNextTick()
  }, 95 + Math.random() * 170)
}

/** Unlocks the AudioContext (browsers require a user gesture) and starts
 * the ambient typing loop. Safe to call repeatedly. */
export function unlockAudio() {
  if (unlocked) return
  unlocked = true
  getCtx()
  if (typingTimer === null) scheduleNextTick()
}

/** Two-note "boop" for the desk robot. */
export function playBotBeep() {
  const ac = getCtx()
  if (!ac || muted) return
  const now = ac.currentTime
  ;[660, 900].forEach((freq, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const gain = ac.createGain()
    const t = now + i * 0.085
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.14, t + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13)
    osc.connect(gain).connect(ac.destination)
    osc.start(t)
    osc.stop(t + 0.15)
  })
}

export function isMuted() {
  return muted
}

export function setMuted(next: boolean) {
  muted = next
  try {
    window.localStorage.setItem('bpl-muted', next ? '1' : '0')
  } catch {
    // ignore — storage may be unavailable (private mode etc.)
  }
  listeners.forEach((l) => l(muted))
}

export function toggleMuted() {
  setMuted(!muted)
  return muted
}

export function subscribeMuted(fn: Listener) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
