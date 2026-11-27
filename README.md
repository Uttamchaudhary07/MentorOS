# LearnOS

A browser-based learning workspace for HTML, CSS, JavaScript, React, Node.js, Express, Java, and DSA with Java. The eight tracks span 207 original topics in 44 modules, from foundations through applied and advanced concepts. Each topic includes a worked example, recognition cues, edge cases, and an original practice task with specific checks. Selected lessons link to matching LeetCode or publisher exercises.

## Java curriculum

- **Java** includes 65 lessons across syntax, the type system, object design, generics, the standard library, concurrency, JVM tooling, testing, packaging, data access, and projects.
- **DSA with Java** includes 55 lessons across complexity, arrays and hashing, searching and sorting, linear structures, trees and heaps, graphs, greedy and backtracking, dynamic programming, text algorithms, range queries, and advanced patterns.

Every DSA lesson includes a Java example, a step-by-step trace, the invariant that makes the algorithm work, time and space costs, and concrete edge cases. The lessons explain when a change in the input or workload makes a different algorithm a better fit. Each module includes a complete Java program with boundary checks that you can save as `Main.java` and run with `java Main.java` on JDK 17 or later.

Choose either course as a goal in My Learning Plan. For complete API and specification references, see [Dev.java](https://dev.java/learn/), the [Java SE API](https://docs.oracle.com/en/java/javase/25/docs/api/index.html), and the [NIST algorithms dictionary](https://xlinux.nist.gov/dads/).

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
