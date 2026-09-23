import { expect, test, type Page } from "@playwright/test"

const SAVE_KEY = "tiny-world-save-v1"

const openSave = {
  version: 1,
  happiness: 40,
  stars: 12,
  coins: 30,
  unlockedAreas: [
    "nini",
    "art",
    "aquarium",
    "ponies",
    "alien-bank",
    "nurse",
    "driving",
    "nails",
    "fruit",
    "pool",
    "shelf-revenge",
    "dreamland",
    "burger",
    "food-shrine",
    "santa",
  ],
  completedLevels: ["nini", "art"],
  achievements: ["nini-approved"],
  discoveredSecrets: ["santa-key"],
  highScores: { fruit: 12, pool: 3 },
  nailDesign: {
    length: 3,
    shape: "almond",
    baseColor: "#ff8fab",
    gradient: "#c4b0ea",
    glitter: true,
    chrome: false,
    charms: [{ id: "c1", nailIndex: 0, x: 30, y: 20, type: "star" }],
  },
  alienSavings: 1260,
  unlockedMessages: ["elite human detected"],
  settings: { sound: false, animations: true, reducedMotion: false },
  lastVisitedArea: "room",
  completedMinigames: ["nini"],
  poolScore: 3,
  poolWins: 1,
  puddingRevengeScore: 0,
  santaUnlocked: true,
  nikkiInteractions: 4,
  nikkiDiscovered: ["*tail wag*"],
  collectedFruit: ["🍓"],
  fruitStickers: ["🍓"],
  ponyAccessories: ["bow"],
  collectedFish: ["nurse", "drive"],
  artDrawn: true,
  burgerHeight: 4,
  nurseProgress: 90,
  drivingLevel: 2,
  licenceAcquired: false,
  dreamStars: 4,
  niniComfy: true,
  pcStarted: true,
  rgbMode: 1,
  finaleReady: false,
  finaleSeen: false,
  seenMessages: [],
  comedyCount: 2,
  bootDone: true,
  headphonesOn: false,
}

async function seed(page: Page, extra: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([key, data]) => {
      if (!sessionStorage.getItem("tiny-seeded")) {
        localStorage.setItem(key, JSON.stringify(data))
        sessionStorage.setItem("tiny-seeded", "1")
      }
    },
    [SAVE_KEY, { ...openSave, ...extra }] as const,
  )
}

test("home loads", async ({ page }) => {
  await page.goto("/room")
  await expect(page.getByTestId("room-stage")).toBeVisible()
  await expect(page.getByTestId("stars")).toBeVisible()
})

test("world map opens and each level opens", async ({ page }) => {
  await seed(page)
  await page.goto("/room")
  await page.getByTestId("open-map").click()
  await expect(page).toHaveURL(/\/world/)
  const ids = openSave.unlockedAreas
  for (const id of ids) {
    await page.goto(`/${id === "alien-bank" ? "alien-bank" : id}`)
    await expect(page.locator("h1")).toBeVisible()
  }
})

test("save system works and refresh preserves progress", async ({ page }) => {
  await seed(page)
  await page.goto("/alien-bank")
  const before = await page.getByTestId("savings-amount").innerText()
  await page.getByTestId("savings-jar").click()
  await page.waitForTimeout(400)
  const mid = await page.getByTestId("savings-amount").innerText()
  expect(mid).not.toEqual(before)
  await page.reload()
  await expect(page.getByTestId("savings-amount")).toHaveText(mid)
})

test("achievement unlock saves", async ({ page }) => {
  await seed(page, { niniComfy: false, achievements: [], completedLevels: [] })
  await page.goto("/nini")
  await page.getByRole("button", { name: "blanket" }).click()
  await page.getByRole("button", { name: "pillow" }).click()
  await page.getByRole("button", { name: "plushie" }).click()
  await page.getByRole("button", { name: "night light" }).click()
  await page.getByRole("button", { name: "sleeping pose" }).click()
  await page.waitForTimeout(500)
  const raw = await page.evaluate((key) => localStorage.getItem(key), SAVE_KEY)
  expect(raw).toBeTruthy()
  expect(raw as string).toContain("nini-approved")
})

test("reset progress works", async ({ page }) => {
  await seed(page, { stars: 99, coins: 99 })
  await page.goto("/room")
  await page.getByTestId("settings-btn").click()
  await page.getByTestId("reset-btn").click()
  await page.getByTestId("reset-confirm").click()
  await expect(page.getByTestId("stars")).toContainText("0")
})

test("nail design persists", async ({ page }) => {
  await seed(page)
  await page.goto("/nails")
  await page.getByTestId("save-nails").click()
  await page.reload()
  const raw = await page.evaluate((key) => localStorage.getItem(key), SAVE_KEY)
  expect(raw as string).toContain("nailDesign")
  expect(raw as string).toContain("almond")
})

test("Santa reward unlock persists", async ({ page }) => {
  await seed(page, { santaUnlocked: true, completedLevels: ["nini"] })
  await page.goto("/santa")
  await page.getByRole("button", { name: "continue" }).click()
  await page.getByRole("button", { name: "ok??" }).click()
  await page.getByTestId("santa-claim").click()
  await page.waitForTimeout(700)
  const raw = await page.evaluate((key) => localStorage.getItem(key), SAVE_KEY)
  expect(raw as string).toMatch(/"santa"/)
  await page.reload()
  await expect(page.getByText("INFINITE ROBUX ACQUIRED")).toBeVisible()
})

test("mobile navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await seed(page)
  await page.goto("/room")
  await page.getByRole("link", { name: "map" }).first().click()
  await expect(page).toHaveURL(/\/world/)
  await page.getByRole("link", { name: "trophies" }).click()
  await expect(page).toHaveURL(/\/achievements/)
})

test("emergency effects do not crash", async ({ page }) => {
  await seed(page, { happiness: 90, comedyCount: 8 })
  await page.goto("/room")
  await page.goto("/aquarium")
  await page.goto("/food-shrine")
  await expect(page.locator("h1")).toBeVisible()
})

test("no horizontal overflow at common mobile sizes", async ({ page }) => {
  const widths = [320, 360, 390, 430]
  const routes = ["/room", "/world", "/nini", "/aquarium", "/pool", "/driving"]
  await seed(page)
  for (const w of widths) {
    await page.setViewportSize({ width: w, height: 720 })
    for (const route of routes) {
      await page.goto(route)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, `${route} at ${w}`).toBeLessThanOrEqual(2)
    }
  }
})
