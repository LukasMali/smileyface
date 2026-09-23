import type { SoundName } from "../game/types"

let ctx: AudioContext | null = null
let unlocked = false
const master = 0.22
let enabled = true

function getCtx() {
  if (ctx) return ctx
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new AC()
  return ctx
}

export function setSoundEnabled(on: boolean) {
  enabled = on
  if (!on) stopAmbient()
}

export function unlockAudio() {
  if (unlocked) return
  try {
    const c = getCtx()
    void c.resume()
    unlocked = true
  } catch {
    /* ignore */
  }
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain = 0.12,
  delay = 0,
  slide?: number,
) {
  if (!enabled || !unlocked) return
  const c = getCtx()
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain * master, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function noiseBurst(dur: number, gain = 0.08) {
  if (!enabled || !unlocked) return
  const c = getCtx()
  const n = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const data = n.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  const g = c.createGain()
  const f = c.createBiquadFilter()
  f.type = "bandpass"
  f.frequency.value = 1400
  src.buffer = n
  g.gain.setValueAtTime(gain * master, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
  src.connect(f)
  f.connect(g)
  g.connect(c.destination)
  src.start()
}

export function playSound(name: SoundName) {
  if (!enabled) return
  unlockAudio()
  switch (name) {
    case "click":
      tone(880, 0.06, "triangle", 0.07)
      break
    case "sparkle":
      tone(1320, 0.12, "sine", 0.07)
      tone(1760, 0.16, "sine", 0.05, 0.05)
      break
    case "coin":
      tone(980, 0.08, "square", 0.05)
      tone(1320, 0.14, "square", 0.05, 0.07)
      break
    case "bubble":
      tone(420, 0.12, "sine", 0.06, 0, 180)
      break
    case "bark":
      tone(220, 0.08, "square", 0.07)
      noiseBurst(0.09, 0.05)
      break
    case "pool":
      tone(180, 0.07, "sine", 0.08)
      noiseBurst(0.05, 0.04)
      break
    case "horn":
      tone(390, 0.18, "square", 0.05)
      tone(310, 0.18, "square", 0.04, 0.02)
      break
    case "ufo":
      tone(240, 0.5, "sawtooth", 0.04, 0, 720)
      break
    case "achieve":
      tone(523, 0.12, "triangle", 0.08)
      tone(659, 0.12, "triangle", 0.08, 0.1)
      tone(784, 0.18, "triangle", 0.09, 0.2)
      break
    case "nail":
      tone(1480, 0.08, "sine", 0.05)
      break
    case "pop":
      tone(640, 0.07, "triangle", 0.06)
      break
    case "whoosh":
      noiseBurst(0.18, 0.04)
      tone(200, 0.2, "sine", 0.03, 0, 90)
      break
    case "chime":
      tone(784, 0.2, "sine", 0.07)
      tone(1175, 0.28, "sine", 0.05, 0.08)
      break
  }
}

let ambNodes: { osc: OscillatorNode; g: GainNode }[] = []
let ambTimers: number[] = []
let ambRunning = false

/** quarter-note length; ~88 bpm keeps the music box unhurried */
const Q = 60 / 88

type Hit = { f: number; q: number }

type Song = {
  pad: [number, number]
  phrases: Hit[][]
  bass: [number, number][]
}

function clearAmbTimers() {
  ambTimers.forEach((id) => {
    window.clearTimeout(id)
    window.clearInterval(id)
  })
  ambTimers = []
}

const SONGS: Song[] = [
  {
    pad: [131, 196],
    phrases: [
      [
        { f: 659, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 523, q: 0.5 },
        { f: 392, q: 1 },
        { f: 659, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 880, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 523, q: 2 },
      ],
      [
        { f: 784, q: 0.5 },
        { f: 880, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 523, q: 1 },
        { f: 587, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 523, q: 0.5 },
        { f: 0, q: 1 },
      ],
    ],
    bass: [
      [131, 196],
      [175, 131],
    ],
  },
  {
    pad: [196, 294],
    phrases: [
      [
        { f: 587, q: 0.5 },
        { f: 494, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 880, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 494, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 587, q: 2 },
      ],
      [
        { f: 784, q: 0.5 },
        { f: 880, q: 0.5 },
        { f: 988, q: 0.5 },
        { f: 880, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 494, q: 0.5 },
        { f: 440, q: 0.5 },
        { f: 494, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 494, q: 0.5 },
        { f: 392, q: 2 },
      ],
    ],
    bass: [
      [196, 294],
      [220, 196],
    ],
  },
  {
    pad: [131, 196],
    phrases: [
      [
        { f: 523, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 523, q: 0.5 },
        { f: 440, q: 0.5 },
        { f: 392, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 523, q: 2 },
      ],
      [
        { f: 440, q: 0.5 },
        { f: 523, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 880, q: 0.5 },
        { f: 784, q: 0.5 },
        { f: 659, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 523, q: 0.5 },
        { f: 392, q: 0.5 },
        { f: 440, q: 0.5 },
        { f: 523, q: 0.5 },
        { f: 587, q: 0.5 },
        { f: 659, q: 2 },
      ],
    ],
    bass: [
      [131, 165],
      [175, 196],
    ],
  },
]

const FORM = [0, 0, 1, 0]

function schedulePhrase(melody: Hit[], bass: [number, number]) {
  let t = 0
  for (const hit of melody) {
    if (hit.f > 0) {
      const dur = hit.q * Q * 0.9 + 0.05
      tone(hit.f, dur, "triangle", 0.05, t)
      if (hit.q >= 1) tone(hit.f * 2, Math.min(0.22, dur * 0.45), "sine", 0.016, t + 0.03)
    }
    t += hit.q * Q
  }
  tone(bass[0], Q * 1.7, "sine", 0.022, 0)
  tone(bass[0] * 1.5, Q * 0.85, "sine", 0.012, Q)
  tone(bass[1], Q * 1.7, "sine", 0.022, Q * 4)
  tone(bass[1] * 1.5, Q * 0.85, "sine", 0.012, Q * 5)
  return t
}

export function startAmbient() {
  if (!enabled) return
  unlockAudio()
  stopAmbient()
  ambRunning = true
  const c = getCtx()

  const pads: { osc: OscillatorNode; g: GainNode }[] = []
  SONGS[0]!.pad.forEach((f, i) => {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = "sine"
    osc.frequency.value = f
    g.gain.value = 0.005 * master
    osc.connect(g)
    g.connect(c.destination)
    osc.start()
    const lfo = c.createOscillator()
    const lg = c.createGain()
    lfo.frequency.value = 0.08 + i * 0.04
    lg.gain.value = 0.0022
    lfo.connect(lg)
    lg.connect(g.gain)
    lfo.start()
    pads.push({ osc, g }, { osc: lfo, g: lg })
  })
  ambNodes = pads

  const setPad = (root: number, fifth: number) => {
    const now = c.currentTime
    pads[0]?.osc.frequency.cancelScheduledValues(now)
    pads[2]?.osc.frequency.cancelScheduledValues(now)
    pads[0]?.osc.frequency.setValueAtTime(pads[0].osc.frequency.value, now)
    pads[2]?.osc.frequency.setValueAtTime(pads[2].osc.frequency.value, now)
    pads[0]?.osc.frequency.linearRampToValueAtTime(root, now + 0.45)
    pads[2]?.osc.frequency.linearRampToValueAtTime(fifth, now + 0.45)
  }

  let songIndex = 0
  let formIndex = 0
  setPad(...SONGS[0]!.pad)

  const next = () => {
    if (!ambRunning || !enabled) return
    const song = SONGS[songIndex] ?? SONGS[0]!
    if (formIndex === 0) setPad(...song.pad)
    const phrase = FORM[formIndex] ?? 0
    const melody = song.phrases[phrase] ?? song.phrases[0]!
    const bass = song.bass[phrase] ?? song.bass[0]!
    const dur = schedulePhrase(melody, bass)
    formIndex += 1
    if (formIndex >= FORM.length) {
      formIndex = 0
      songIndex = (songIndex + 1) % SONGS.length
      ambTimers.push(window.setTimeout(next, (dur + Q * 6) * 1000))
    } else {
      ambTimers.push(window.setTimeout(next, dur * 1000))
    }
  }
  ambTimers.push(window.setTimeout(next, 280))
}

export function stopAmbient() {
  ambRunning = false
  clearAmbTimers()
  ambNodes.forEach((n) => {
    try {
      n.osc.stop()
    } catch {
      /* already stopped */
    }
  })
  ambNodes = []
}

export function playNote(freq: number) {
  tone(freq, 0.18, "triangle", 0.07)
}
