# Monster Hunter Wilds - Skill Set Finder

<p align="center">
  A lightweight web app that suggests armor-piece combinations to reach a target skill level.
</p>

<p align="center">
  <img alt="Static site" src="https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-c98a3a">
  <img alt="No build step" src="https://img.shields.io/badge/build-none-3a9c5a">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-4a6fd0">
</p>

---

## What this project does

Given a **skill** and a **requested level**, the app computes armor sets (Head, Chest, Arms, Waist, Legs) that meet or exceed that level.

It also shows:

- the total skill level each set provides,
- each piece contribution (`+X`) for the selected skill,
- the armor variant label (`Alpha`, `Beta`, or `Gamma`).

## Features

- Fast combination search with pruning
- Sorted recommendations (closest match first)
- Responsive UI for desktop and mobile
- Clear feedback when the requested level is impossible with current data
- Easy-to-edit in-file dataset (`script.js`)

## Project structure

```text
.
├── index.html    # App layout
├── styles.css    # Visual style and responsive design
├── script.js     # Armor dataset + search algorithm + rendering
└── README.md
```

## Run locally

From the project directory:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## How recommendations are computed

1. Armor pieces are grouped by slot.
2. The app performs a depth-first search across all slot combinations.
3. Branches that cannot possibly reach the target level are skipped.
4. Valid sets are ranked to prioritize minimal overcap and cleaner builds.

## Data note

Current dataset is a **small curated sample** (30 armor pieces) for demonstration.
To improve accuracy and coverage, extend `ARMOR_PIECES` in `script.js` with full game data.

## Customize quickly

- Add/modify armor entries in `script.js`.
- Tune result cap with `MAX_RENDERED_RESULTS` in `script.js`.
- Change color theme in `styles.css` under `:root` variables.

## License

MIT - feel free to use, modify, and share.
