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
let ambStep = 0
let ambRunning = false

const TUNE = [659, 784, 880, 784, 988, 880, 784, 659, 523, 659, 784, 988]

function clearAmbTimers() {
  ambTimers.forEach((id) => {
    window.clearTimeout(id)
    window.clearInterval(id)
  })
  ambTimers = []
}

export function startAmbient() {
  if (!enabled) return
  unlockAudio()
  stopAmbient()
  ambRunning = true
  ambStep = 0
  const c = getCtx()

  const pads: { osc: OscillatorNode; g: GainNode }[] = []
  ;[196, 294].forEach((f, i) => {
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = "sine"
    osc.frequency.value = f
    g.gain.value = 0.006 * master
    osc.connect(g)
    g.connect(c.destination)
    osc.start()
    const lfo = c.createOscillator()
    const lg = c.createGain()
    lfo.frequency.value = 0.11 + i * 0.04
    lg.gain.value = 0.003
    lfo.connect(lg)
    lg.connect(g.gain)
    lfo.start()
    pads.push({ osc, g }, { osc: lfo, g: lg })
  })
  ambNodes = pads

  const step = () => {
    if (!ambRunning || !enabled) return
    const i = ambStep % TUNE.length
    const f = TUNE[i] ?? 659
    tone(f, i % 4 === 3 ? 0.28 : 0.16, "triangle", 0.05)
    if (i % 4 === 0) tone(262, 0.22, "sine", 0.018)
    if (i === 5 || i === 11) tone(1318, 0.12, "sine", 0.028)
    ambStep += 1
    const wait = i === TUNE.length - 1 ? 640 : 240
    ambTimers.push(window.setTimeout(step, wait))
  }
  ambTimers.push(window.setTimeout(step, 180))

  const blub = () => {
    if (!ambRunning || !enabled) return
    tone(420 + Math.random() * 180, 0.14, "sine", 0.03, 0, 160)
    ambTimers.push(window.setTimeout(blub, 4200 + Math.random() * 3800))
  }
  ambTimers.push(window.setTimeout(blub, 2800))
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
