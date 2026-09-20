import { useEffect, useState } from "react"
import { chatLines } from "../data/messages"
import { useWorld } from "../hooks/WorldContext"
import { pick } from "../lib/random"
import { KawaiiBlob, type BlobMood } from "./characters/KawaiiBlob"
import { Scene, Wave } from "./ui/Floating"

const stickers: { mood: BlobMood; line: string }[] = [
  { mood: "cry", line: "😭" },
  { mood: "shock", line: "WHAT" },
  { mood: "stare", line: "fish." },
  { mood: "yay", line: "so true" },
  { mood: "hide", line: "mr alien pls" },
  { mood: "confused", line: "HELLO??" },
  { mood: "thumb", line: "real" },
  { mood: "scream", line: "WHAT IS HAPPENING" },
]

export function StickerChat() {
  const { addFun, notify } = useWorld()
  const [items, setItems] = useState(stickers.slice(0, 3))

  const send = (item: { mood: BlobMood; line: string }) => {
    setItems((prev) => [...prev.slice(-5), item])
    addFun(2)
    notify(item.line)
  }

  useEffect(() => {
    const t = window.setInterval(() => {
      const next = pick(stickers)
      setItems((prev) => [...prev.slice(-5), { ...next, line: pick(chatLines) }])
    }, 4200)
    return () => window.clearInterval(t)
  }, [])

  return (
    <Scene className="bg-cream pb-10">
      <Wave fill="#fff8e7" />
      <div className="relative mx-auto max-w-md px-4">
        <p className="label-sticker mb-4 text-sm">tiny chat energy · tap a sticker to send</p>
        <div className="min-h-80 rounded-[1.8rem] border-2 border-ink/10 bg-[#efe7ff] p-3 shadow-[6px_8px_0_rgba(74,63,85,0.08)]">
          <div className="mb-3 flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2">
            <KawaiiBlob mood="yay" size={36} />
            <p className="font-hand text-sm">sticker chaos</p>
          </div>
          <ul className="mb-3 flex min-h-48 flex-col gap-3">
            {items.map((item, i) => (
              <li
                key={`${item.mood}-${item.line}-${i}`}
                className={`flex items-end gap-2 ${i % 2 ? "flex-row-reverse" : ""}`}
              >
                <button
                  type="button"
                  className="border-0 bg-transparent p-0"
                  aria-label={`sticker ${item.mood}`}
                  onClick={() => send({ mood: item.mood, line: pick(chatLines) })}
                >
                  <KawaiiBlob mood={item.mood} size={58} className="anim-bob" />
                </button>
                <span className="rounded-2xl bg-white px-3 py-1 font-hand text-sm shadow-sm">
                  {item.line}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-1 rounded-2xl bg-white/70 p-2">
            {stickers.map((s) => (
              <button
                key={s.mood}
                type="button"
                className="hit-area border-0 bg-transparent p-0"
                aria-label={`send ${s.mood} sticker`}
                onClick={() => send(s)}
              >
                <KawaiiBlob mood={s.mood} size={44} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Scene>
  )
}
