/**
 * Tiny procedural audio engine — everything here is synthesized with the
 * Web Audio API (noise bursts, oscillators), so there are no audio files
 * to ship. Three layers, all routed through one master gain so a single
 * mute toggle (header button + the two desk amplifiers) silences
 * everything at once:
 *   - a very quiet ambient chord pad (the "background music")
 *   - a soft "typing" tick loop, panned so it feels present
 *   - a two-note "beep" for the desk robot
 * Mute state is remembered across visits via localStorage — this is the
 * live site, not a Claude artifact, so normal browser storage is fine.
 */

type Listener = (muted: boolean) => void

let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let unlocked = false
let typingTimer: number | null = null
let padStarted = false
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

function getMaster(): GainNode | null {
  const ac = getCtx()
  if (!ac) return null
  if (!master) {
    master = ac.createGain()
    master.gain.value = muted ? 0 : 1
    master.connect(ac.destination)
  }
  return master
}

/** A single soft "tick" — a short filtered noise burst, gently panned so the
 * loop feels present/around the listener rather than flat and centered. */
function tick(pan: number) {
  const ac = getCtx()
  const out = getMaster()
  if (!ac || !out) return
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

  src.connect(filter).connect(gain).connect(panner).connect(out)
  src.start(now)
  src.stop(now + 0.05)
}

function scheduleNextTick() {
  typingTimer = window.setTimeout(() => {
    if (unlocked) {
      const pan = Math.sin(Date.now() / 850) * 0.4
      tick(pan)
    }
    scheduleNextTick()
  }, 95 + Math.random() * 170)
}

/** Long-running, very quiet chord pad — generic ambient "background music"
 * bed for the site. Three detuned sine tones with slow independent LFOs on
 * their gain so it breathes instead of droning. */
function startAmbientPad() {
  if (padStarted) return
  const ac = getCtx()
  const out = getMaster()
  if (!ac || !out) return
  padStarted = true

  const padGain = ac.createGain()
  padGain.gain.value = 0.05
  padGain.connect(out)

  const notes = [130.81, 164.81, 196.0, 261.63] // C3, E3, G3, C4 — soft major chord
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    const voiceGain = ac.createGain()
    voiceGain.gain.value = 0.5

    const lfo = ac.createOscillator()
    lfo.frequency.value = 0.045 + i * 0.011
    const lfoGain = ac.createGain()
    lfoGain.gain.value = 0.28
    lfo.connect(lfoGain).connect(voiceGain.gain)

    osc.connect(voiceGain).connect(padGain)
    osc.start()
    lfo.start()
  })
}

/** Unlocks the AudioContext (browsers require a user gesture), starts the
 * ambient pad, and starts the typing loop. Safe to call repeatedly. */
export function unlockAudio() {
  if (unlocked) return
  unlocked = true
  getMaster()
  startAmbientPad()
  if (typingTimer === null) scheduleNextTick()
}

/** Two-note "boop" for the desk robot. */
export function playBotBeep() {
  const ac = getCtx()
  const out = getMaster()
  if (!ac || !out) return
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
    osc.connect(gain).connect(out)
    osc.start(t)
    osc.stop(t + 0.15)
  })
}

export function isMuted() {
  return muted
}

export function setMuted(next: boolean) {
  muted = next
  const ac = getCtx()
  if (master && ac) {
    master.gain.setTargetAtTime(next ? 0 : 1, ac.currentTime, 0.05)
  }
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
