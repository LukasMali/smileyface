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

const SCALE = [392, 440, 494, 523, 587, 659, 698, 784, 880, 988]
const PADS = [174, 196, 220, 247, 262, 294]

function clearAmbTimers() {
  ambTimers.forEach((id) => {
    window.clearTimeout(id)
    window.clearInterval(id)
  })
  ambTimers = []
}

function ambPick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)] as T
}

export function startAmbient() {
  if (!enabled) return
  unlockAudio()
  stopAmbient()
  ambRunning = true
  const c = getCtx()

  const pads: { osc: OscillatorNode; g: GainNode }[] = []
  const padNotes = [ambPick(PADS), ambPick(PADS)]
  padNotes.forEach((f, i) => {
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
    lfo.frequency.value = 0.09 + i * 0.05 + Math.random() * 0.04
    lg.gain.value = 0.0025
    lfo.connect(lg)
    lg.connect(g.gain)
    lfo.start()
    pads.push({ osc, g }, { osc: lfo, g: lg })
  })
  ambNodes = pads

  const driftPad = () => {
    if (!ambRunning || !enabled) return
    pads[0]?.osc.frequency.setValueAtTime(ambPick(PADS), c.currentTime)
    if (pads[2]) pads[2].osc.frequency.setValueAtTime(ambPick(PADS), c.currentTime)
    ambTimers.push(window.setTimeout(driftPad, 7000 + Math.random() * 6000))
  }
  ambTimers.push(window.setTimeout(driftPad, 8000))

  let walk = 3 + Math.floor(Math.random() * 4)
  const next = () => {
    if (!ambRunning || !enabled) return
    const roll = Math.random()

    if (roll < 0.18) {
      ambTimers.push(window.setTimeout(next, 420 + Math.random() * 1100))
      return
    }

    if (roll < 0.34) {
      const kind = Math.random()
      if (kind < 0.45) {
        tone(380 + Math.random() * 260, 0.13 + Math.random() * 0.08, "sine", 0.026, 0, 140 + Math.random() * 80)
      } else if (kind < 0.75) {
        const f = ambPick(SCALE)
        tone(f * 2, 0.09, "sine", 0.02)
        tone(f * 3, 0.11, "sine", 0.014, 0.07 + Math.random() * 0.06)
      } else {
        tone(200 + Math.random() * 90, 0.18, "triangle", 0.018)
      }
      ambTimers.push(window.setTimeout(next, 360 + Math.random() * 980))
      return
    }

    const notes = Math.random() < 0.42 ? 1 : Math.random() < 0.78 ? 2 : 1 + Math.floor(Math.random() * 3)
    let delay = 0
    for (let n = 0; n < notes; n++) {
      const jump = ambPick([-2, -1, -1, 0, 1, 1, 1, 2])
      walk = Math.max(0, Math.min(SCALE.length - 1, walk + jump))
      const octave = Math.random() < 0.1 ? 0.5 : Math.random() < 0.08 ? 2 : 1
      const f = (SCALE[walk] ?? 659) * octave
      const dur = 0.1 + Math.random() * 0.22
      tone(f, dur, Math.random() < 0.3 ? "sine" : "triangle", 0.028 + Math.random() * 0.022, delay)
      delay += 0.08 + Math.random() * 0.2
    }
    ambTimers.push(window.setTimeout(next, delay * 1000 + 180 + Math.random() * 820))
  }
  ambTimers.push(window.setTimeout(next, 160 + Math.random() * 400))
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
