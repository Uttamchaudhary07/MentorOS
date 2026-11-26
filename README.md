# LearnOS

A browser-based learning workspace for HTML, CSS, JavaScript, React, Node.js, Express, and Java. Each track contains three introductory topics with an original lesson, worked example, pattern cues and edge cases, and a practice exercise with an external link.

## Run locally

Use Node.js 20.19+ or 22.12+. From this directory:

```sh
npm ci
npm run dev
npm test
npm run build
```

Vite prints the development URL. The production build is in `dist/`.

## How progression works

- Lessons and reference material are always readable. A previous topic check controls access to the next assessment in each track.
- Passing each topic check schedules a Recall item. Correct reviews increase the interval, and incorrect reviews schedule another attempt in one day.
- Passing every topic check unlocks its track’s mixed test. The profile links to searchable topic, practice, rules, and assessment views.
- External practice links do not report submission activity back to LearnOS.

The current build stores a single student profile in the current browser. The lab includes an HTML/CSS preview, two locally graded JavaScript exercises, and a function plotter. Java, React, Node.js, and Express use written exercises, external editors or problem links, and in-platform concept checks. Server accounts, cross-device sync, and server-side compilation and grading are outside this build.
