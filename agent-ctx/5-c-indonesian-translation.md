# Task 5-c: Translate Notes & Profile Pages to Indonesian

## Agent: Subagent

## Summary
Successfully updated both `/src/app/notes/page.tsx` and `/src/app/profile/page.tsx` with all required changes.

## Changes Made

### /src/app/notes/page.tsx
1. **Removed** Navbar and Footer imports and components
2. **Added** simple sticky top bar with:
   - Left: `<img src="/logo.svg" alt="SecretInk" className="h-7 pop-zoom" />` + "SecretInk" text + link to /dashboard
   - Right: "Kembali ke Dashboard" button with ArrowLeft icon
3. **Translated** all text to Indonesian:
   - StatusState values: 'Siap' | 'Terenkripsi' | 'Terdekripsi' | 'Tersimpan'
   - All labels, placeholders, buttons, validation errors, toast messages
4. **Replaced** Shield icon with `<img src="/logo.svg" alt="SecretInk Logo" className="size-5 pop-zoom" />`
5. **Added** `icon-pop` class to all interactive Lucide icons
6. **Kept** "Base64 Encoded" as technical term (unchanged)

### /src/app/profile/page.tsx
1. **Removed** Navbar and Footer imports and components
2. **Added** identical simple sticky top bar
3. **Translated** all text to Indonesian:
   - Labels, buttons, validation errors, toast messages
   - Security notice fully translated
4. **Added** `icon-pop` class to all interactive Lucide icons
5. **Updated** date locale from "en-US" to "id-ID"
6. **Replaced** hardcoded colors with theme variables

## Verification
- ESLint: 0 errors
- Both pages return HTTP 200
- Dev server compiles successfully
