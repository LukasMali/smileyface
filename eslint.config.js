import js from "@eslint/js"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist", "playwright-report", "test-results", "node_modules", "src/components/Hero.tsx", "src/components/IceCreamScene.tsx", "src/components/FinalScene.tsx", "src/components/EmergencyHappiness.tsx", "src/components/PersonalityBadges.tsx", "src/components/StickerChat.tsx", "src/components/ArtDesk.tsx", "src/components/Aquarium.tsx", "src/components/AlienSavings.tsx", "src/components/NurseScene.tsx", "src/components/DrivingQuest.tsx", "src/components/BurgerZone.tsx", "src/components/LegendaryMeal.tsx", "src/components/PonyMeadow.tsx", "src/components/ui/PlayLayer.tsx"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
)
