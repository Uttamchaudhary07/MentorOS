# LearnOS

A browser-based learning workspace for HTML, CSS, JavaScript, React, Node.js, Express, and Java. The seven tracks span 118 original topics in 27 modules, from foundations through applied and advanced concepts. Each topic includes a worked example, recognition cues, edge cases, and an original practice task with specific checks. Selected lessons link to matching LeetCode or publisher exercises.

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
- Passing every topic check in a module unlocks its mixed checkpoint. The profile links to searchable topic, practice, rules, and assessment views. The learning plan prioritizes the chosen track, due reviews, missed skills, and ready assessments.
- A preferred lesson format opens lessons with a worked example, a visual sequence, or a practice task first. Students can switch layouts from any lesson.
- External practice links do not report submission activity back to LearnOS.

The current build stores a single student profile in the current browser. The lab includes an HTML/CSS preview, two locally graded JavaScript exercises, and a function plotter. Java, React, Node.js, and Express use written exercises, external editors or problem links, and in-platform concept checks. Server accounts, cross-device sync, and server-side compilation and grading are outside this build.
