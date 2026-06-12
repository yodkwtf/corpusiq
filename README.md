# CorpusIQ

Understand your retirement future in 3 minutes. Turn your NPS, PF and mutual fund numbers into a plain-language story — free, private, no sign-up.

**Live:** https://corpusiq.netlify.app

![CorpusIQ screenshot](./public/og-image.png)

## What it does

- Takes your current age, retirement age, and investment balances (NPS / PF / Mutual Funds)
- Projects your corpus, monthly retirement income, and how long the money lasts
- Shows milestones, health score, peer comparison, FIRE check, and what-if scenarios
- Everything runs in the browser — nothing is sent to a server

## Stack

- React + Vite
- Tailwind CSS
- Framer Motion
- All calculations in `src/utils/calculations.js`

## Local setup

```bash
npm install
npm run dev
```

## Contributing

PRs welcome. A few things to know:

- All financial logic is in `src/utils/calculations.js` - that's the most critical file to get right
- `src/context/plannerState.js` holds the default state shape and validation
- Components are in `src/components/`, pages in `src/pages/`
- No backend, no auth, no tracking — keep it that way
