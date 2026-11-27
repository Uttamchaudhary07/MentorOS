import { html, css } from './paths/html-css.js';
import { javascript, react } from './paths/javascript-react.js';
import { node, express } from './paths/backend.js';
import { advanced } from './paths/advanced.js';
import { java } from './paths/java.js';
import { javaCore } from './paths/java-core.js';
import { javaSequence } from './paths/java-sequence.js';
import { javaExamples } from './paths/java-examples/index.js';
import { foundations } from './paths/dsa/foundations.js';
import { structures } from './paths/dsa/structures.js';
import { graphs } from './paths/dsa/graphs.js';
import { optimization } from './paths/dsa/optimization.js';
import { techniques } from './paths/dsa/advanced.js';
import { specialized } from './paths/dsa/specialized.js';

const lesson = (id, title, minutes, explanation, example, cues, rule, edges, practice, questions) => ({
  id, title, minutes, explanation, example, cues, rule, edges, practice, questions,
});

const paths = [
  {
    id: 'html', name: 'HTML', label: 'Structure & accessibility', mark: 'HTML', color: 'orange',
    reference: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content',
    topics: [
      lesson('html-structure', 'Semantic page structure', 12,
        'HTML gives each part of a page a role. Put the primary content in main, major navigation in nav, and independently reusable content in article. Headings describe the structure so readers can scan it visually or jump by heading with assistive technology.',
        '<main>\n  <h1>Campus news</h1>\n  <article>\n    <h2>Lab opens Friday</h2>\n    <p>Bring your student ID.</p>\n  </article>\n</main>',
        'If you can name the purpose of a section, check whether HTML already has an element for that purpose.',
        'Choose a heading level by its place in the outline. Style it with CSS.',
        'Check pages with multiple sections and confirm there is one visible main landmark.',
        ['Build a news page with navigation, two article summaries, and a footer.'],
        [
          ['Which element marks the primary content?', 'main', 'div', 'aside'],
          ['What should heading levels represent?', 'The document hierarchy', 'The desired font size', 'The number of paragraphs'],
          ['A story can be syndicated on its own. Which element fits?', 'article', 'nav', 'footer'],
          ['What element groups the main site links?', 'nav', 'label', 'output'],
        ]),
      lesson('html-forms', 'Forms and inputs', 14,
        'A label names a form control, while the input name identifies its value when the form is submitted. Start with built-in controls and validation. On a real app, validate the submitted data on the server too.',
        '<label for="email">Email</label>\n<input id="email" name="email" type="email" required>\n<button type="submit">Join</button>',
        'When the user enters or submits data, look for native inputs, labels, and buttons first.',
        'The label for value matches the input id. The name travels with the submitted value.',
        'Try submitting an empty form, an invalid email, and a disabled field.',
        ['Build a signup form with email, a required checkbox, and clear labels.'],
        [
          ['What must a label’s for attribute match?', 'The input id', 'The input placeholder', 'The input type'],
          ['Which attribute supplies the submitted field key?', 'name', 'id', 'class'],
          ['Where must a real API validate required input?', 'On the server', 'Only in the browser', 'Only in the stylesheet'],
          ['Which element provides a persistent input name to users?', 'label', 'A placeholder', 'An empty span'],
        ]),
      lesson('html-access', 'Accessible interactions', 16,
        'A link navigates somewhere. A button performs an action. Native controls carry keyboard and accessibility behavior that generic elements lack. An image’s alternative text depends on why the image is present.',
        '<a href="/schedule">View schedule</a>\n<button type="button">Add reminder</button>\n<img src="divider.png" alt="">',
        'When a control changes local state, consider a button. When it takes you somewhere, use a link.',
        'Try the entire task using Tab, Shift+Tab, Enter, and Space.',
        'Check decorative images, icon-only buttons, and unexpected focus movement.',
        ['Build a keyboard-friendly article page with skip navigation and correctly named controls.'],
        [
          ['Which control should open a different page?', 'A link with href', 'A div with a click handler', 'An image'],
          ['What alt text fits a purely decorative image?', 'An empty string', 'The file name', 'The word decorative'],
          ['An icon-only remove button needs what?', 'An accessible name', 'A larger icon', 'A different accent color'],
          ['Which native element fits toggling a panel?', 'button', 'p', 'strong'],
        ]),
    ],
  },
  {
    id: 'css', name: 'CSS', label: 'Layout & responsive design', mark: 'CSS', color: 'blue',
    reference: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics',
    topics: [
      lesson('css-cascade', 'Cascade and box model', 13,
        'When several declarations apply, the cascade decides the winner. In simple author styles, compare specificity and then source order. A box has content, padding, border, and margin. With border-box sizing, a set width includes padding and border.',
        '.card {\n  box-sizing: border-box;\n  width: 280px;\n  padding: 16px;\n  border: 1px solid #c7ceda;\n}',
        'When a style seems ignored, inspect which declaration won. When a box overflows, inspect its computed dimensions.',
        'Padding is inside the border. Margin is outside.',
        'Test long text, conflicting selectors, and fixed widths in narrow containers.',
        ['Style two cards with the same outer width and different padding.'],
        [
          ['What does border-box width include?', 'Content, padding, and border', 'Content only', 'Content and margin'],
          ['Two otherwise equal rules differ by source order. Which wins?', 'The later one', 'The earlier one', 'The shorter one'],
          ['A card has width 200px and 20px padding on each side with content-box sizing. How wide is it before borders?', '240px', '200px', '220px'],
          ['Where is margin drawn?', 'Outside the border', 'Between content and padding', 'Inside the content box'],
        ]),
      lesson('css-layout', 'Flexbox and Grid', 18,
        'Flexbox distributes items along an axis and can wrap them. Grid defines rows and columns whose tracks line up. Use gap on the container to express spacing between items.',
        '.toolbar { display: flex; flex-wrap: wrap; gap: 12px; }\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));\n  gap: 16px;\n}',
        'Think Flexbox for a toolbar and Grid for rows and columns that must align.',
        'Flex works along an axis. Grid works with tracks.',
        'Test uneven text lengths, one item, many items, and widths smaller than a preferred column.',
        ['Recreate a wrapping toolbar and a responsive grid of six cards.'],
        [
          ['Which layout best aligns cards across rows and columns?', 'Grid', 'Absolute positioning', 'Text alignment'],
          ['Which property sets spacing between layout items?', 'gap', 'outline', 'float'],
          ['A single row of filter buttons should wrap when space runs out. What fits?', 'Flexbox with flex-wrap', 'Fixed positioning', 'A large left margin'],
          ['What changes the main axis in a flex container?', 'flex-direction', 'font-size', 'grid-auto-flow'],
        ]),
      lesson('css-responsive', 'Responsive design', 15,
        'Start with a layout that works on a narrow viewport, then make room for more columns when the content can use them. Test the layout with real text and zoom. A breakpoint should solve a layout problem you can see.',
        '.page { display: grid; gap: 1rem; }\n@media (min-width: 48rem) {\n  .page { grid-template-columns: 2fr 1fr; }\n}',
        'If a layout begins clipping or has excessive empty space as it grows, inspect where its structure should change.',
        'Start narrow, then add space-dependent rules.',
        'Check browser zoom, long words, and which content appears first on small screens.',
        ['Build a responsive article with a related-content panel that moves below it on narrow screens.'],
        [
          ['Where should a responsive breakpoint come from?', 'The point at which the content needs it', 'The number of images', 'The browser brand'],
          ['Which query adds rules at and above 48rem?', 'min-width: 48rem', 'max-width: 48rem', 'height: 48rem'],
          ['What often reveals a fragile fixed-width layout?', 'Zooming with long text', 'Renaming the stylesheet', 'Changing an image format'],
          ['What should be tested below every breakpoint?', 'Reading order and overflow', 'Only font family', 'Only the background color'],
        ]),
    ],
  },
  {
    id: 'javascript', name: 'JavaScript', label: 'Logic, data & async code', mark: 'JS', color: 'yellow',
    reference: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
    topics: [
      lesson('js-basics', 'Values, conditions, and functions', 15,
        'A function can turn inputs into a result. Use strict equality when a comparison should preserve types. A guard clause can handle invalid inputs near the top, leaving the main calculation easier to read.',
        'function admissionPrice(age) {\n  if (!Number.isInteger(age) || age < 0) return null;\n  return age < 12 ? 5 : 10;\n}',
        'If a requirement says “under 12” or “at least 12”, test the boundary explicitly.',
        'Translate the wording into a comparison, then try the value on both sides.',
        'Try 11, 12, 13, -1, and the string "12".',
        ['Build a delivery fee calculator with an explicitly tested free-delivery threshold.'],
        [
          ['What does 12 === "12" produce?', 'false', 'true', 'undefined'],
          ['Which comparison expresses “at least 12”?', 'age >= 12', 'age > 12', 'age < 12'],
          ['A discount applies to orders under 50. Does exactly 50 qualify?', 'No', 'Yes', 'Only if the order is an integer'],
          ['Why use a guard clause?', 'To handle an exceptional case before the main logic', 'To convert all inputs to strings', 'To repeat the main calculation'],
        ]),
      lesson('js-arrays', 'Arrays and traversal', 17,
        'A loop can carry state such as a count or running total. Use map for one output per item, filter for a subset, and a loop when you want to make intermediate state explicit.',
        'function runningTotals(values) {\n  let total = 0;\n  return values.map(value => {\n    total += value;\n    return total;\n  });\n}',
        'If each answer depends on what you have seen so far, think accumulator.',
        'Initialize once, update once per item, decide when to record the result.',
        'Try empty input, one element, zero, and negative numbers when allowed.',
        ['Implement a running balance from signed transactions.', ['LeetCode #1480', 'Running Sum of 1d Array', 'https://leetcode.com/problems/running-sum-of-1d-array/']],
        [
          ['What operation keeps only matching items?', 'filter', 'map', 'push'],
          ['What are the running totals for [4, -2, 3]?', '[4, 2, 5]', '[4, -2, 3]', '[5]'],
          ['Which starting total handles an empty array correctly?', '0', '1', 'The second item'],
          ['Which operation returns one transformed item per input item?', 'map', 'filter', 'find'],
        ]),
      lesson('js-async', 'Promises and async code', 18,
        'A promise represents a value that may arrive later or fail. Await pauses the current async function while the promise settles. For fetch, inspect the HTTP response status before reading the body and handle rejection where you can recover or show feedback.',
        'async function loadNotes() {\n  const response = await fetch("/notes");\n  if (!response.ok) throw new Error("Could not load notes");\n  return response.json();\n}',
        'If data becomes available later, account for waiting, success, and failure.',
        'Separate transport failure, HTTP failure, and invalid data.',
        'Check a rejected request, a 404 response, and an empty success payload.',
        ['Build a loading, success, and failure UI around a simulated delayed request.'],
        [
          ['Does fetch normally reject solely for an HTTP 404?', 'No', 'Yes', 'Only if called with await'],
          ['What does an async function return?', 'A promise', 'Always a string', 'A new thread'],
          ['A request returns HTTP 500. What check detects it?', 'response.ok', 'typeof response', 'response.url length'],
          ['Which construct can catch a rejected awaited promise?', 'try/catch', 'A CSS selector', 'Array.map alone'],
        ]),
    ],
  },
  {
    id: 'react', name: 'React', label: 'Components & state', mark: 'R', color: 'cyan',
    reference: 'https://react.dev/learn',
    topics: [
      lesson('react-components', 'Components and props', 14,
        'A component describes a piece of the UI. Props pass values from a parent. Extract a component when it represents a meaningful repeatable part, then give it a small interface.',
        'function TopicCard({ title, minutes }) {\n  return <article><h2>{title}</h2><p>{minutes} min</p></article>;\n}',
        'Look for repeated UI with the same structure and different data.',
        'Props are inputs to rendering. The parent chooses them.',
        'Check missing optional fields, empty text, and long titles.',
        ['Render the same TopicCard for three topics with different props.'],
        [
          ['What should a component do with props?', 'Read them as inputs', 'Mutate them directly', 'Store them globally'],
          ['How do you render a custom JSX component?', '<TopicCard />', '<topicCard />', 'new TopicCard'],
          ['Three identical card layouts show different names. How should each name arrive?', 'Through a prop', 'Through a window variable', 'Through a CSS selector'],
          ['Who supplies a component’s props?', 'Its parent', 'The stylesheet', 'The router in every case'],
        ]),
      lesson('react-state', 'State and events', 17,
        'State stores values that change and affect rendering. Event handlers request updates. If an update depends on the previous value, use an updater function. Derive display values during rendering when the existing state already determines them.',
        'function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(n => n + 1)}>{count}</button>;\n}',
        'If clicking must change something on screen, find the minimal state needed to represent the change.',
        'Store the choice. Derive the label for it.',
        'Check rapid clicks, reset behavior, and empty initial data.',
        ['Build a score counter with increase, decrease, and reset controls.'],
        [
          ['Which update uses the latest queued count?', 'setCount(n => n + 1)', 'count++', 'count = count + 1'],
          ['When should a value be derived during rendering?', 'When a current prop or state already determines it', 'Only after a timeout', 'Whenever it is a string'],
          ['The UI shows the count and whether it is even. What minimal state works?', 'The count', 'The count and a stored isEven value', 'Only isEven'],
          ['What should a click handler call to update state?', 'The state setter', 'A DOM selector', 'The component by name'],
        ]),
      lesson('react-lists', 'Lists, keys, and forms', 17,
        'Render collections with stable keys so React can track items across changes. A controlled input reads its value from state and updates that state through an event handler. Submit the form as one action.',
        '<input value={query} onChange={event => setQuery(event.target.value)} />\n{filteredTopics.map(topic => <TopicCard key={topic.id} title={topic.title} />)}',
        'If rows can move or disappear, look for a durable identifier before choosing a key.',
        'Keys follow the item, even when its position changes.',
        'Test deleting the first item, sorting a list, and clearing a controlled input.',
        ['Build a searchable list with stable IDs and verify that sorting preserves row identity.'],
        [
          ['What makes the best key for reorderable records?', 'A stable record ID', 'The array position', 'A newly generated random number'],
          ['What controls a controlled input’s displayed value?', 'React state or props', 'The key alone', 'The placeholder'],
          ['After deleting the first row, what must remain the same for other rows?', 'Their keys', 'Their array positions', 'Their text length'],
          ['What event can keep a controlled text field in sync?', 'onChange', 'onBlur only', 'onResize'],
        ]),
    ],
  },
  {
    id: 'node', name: 'Node.js', label: 'Runtime & server fundamentals', mark: 'N', color: 'green',
    reference: 'https://nodejs.org/en/learn',
    topics: [
      lesson('node-runtime', 'Runtime and modules', 13,
        'Node runs JavaScript outside the browser and exposes APIs for files, networking, and processes. Use ES modules to give each file an explicit interface. With type set to module in package.json, use import and export in .js files.',
        'export function slugify(title) {\n  return title.trim().toLowerCase().split(/\\s+/).join("-");\n}',
        'A shared capability used by several scripts is a candidate for a module.',
        'Export the interface. Keep local details unexported.',
        'Check explicit file extensions in relative ESM imports and test whitespace-only input.',
        ['Write a command-line slug generator with a separate module for normalization.'],
        [
          ['Which built-in API reads files in Node?', 'node:fs', 'document.querySelector', 'window.localStorage'],
          ['Which package field selects ESM for .js files?', 'type: module', 'module: true', 'target: node'],
          ['A helper is used only inside its module. What should you do?', 'Leave it unexported', 'Attach it to globalThis', 'Put it in package.json'],
          ['Which keyword exposes a named ES module binding?', 'export', 'public', 'require'],
        ]),
      lesson('node-io', 'Async file I/O', 16,
        'Promise-based file operations let applications wait for storage while other work continues. Decide how to handle missing files, invalid formats, and permissions. Avoid synchronous file reads in an HTTP request handler.',
        'import { readFile } from "node:fs/promises";\n\nconst raw = await readFile("topics.json", "utf8");\nconst topics = JSON.parse(raw);',
        'Treat reading bytes and interpreting those bytes as two operations that can fail differently.',
        'Read, decode, parse, then validate the shape.',
        'Try a missing file, malformed JSON, and valid JSON of the wrong shape.',
        ['Read a local JSON topic list and report missing files or malformed data clearly.'],
        [
          ['Which import gives promise-based readFile?', 'node:fs/promises', 'node:path', 'node:http'],
          ['Can JSON.parse fail after a successful file read?', 'Yes', 'No', 'Only on Windows'],
          ['The file contains valid JSON but an object instead of an array. What detects it?', 'A shape check', 'The file extension', 'The encoding alone'],
          ['Which encoding returns text from readFile?', 'utf8', 'json', 'text/html'],
        ]),
      lesson('node-http', 'HTTP requests and responses', 17,
        'An HTTP server reads the request method and path, then returns a status, headers, and body. Keep the response format consistent. Finish every branch so the client receives a response.',
        'import { createServer } from "node:http";\n\ncreateServer((request, response) => {\n  response.writeHead(200, { "Content-Type": "application/json" });\n  response.end(JSON.stringify({ ok: true }));\n}).listen(3000);',
        'Sketch the method, route, status, and body before filling in business logic.',
        'A request enters. One response ends it.',
        'Check unknown paths, unexpected methods, and empty response bodies.',
        ['Create a small Node server with a JSON health route and a 404 response for other paths.'],
        [
          ['Which header describes a JSON response?', 'Content-Type: application/json', 'Accept: text/css', 'Host: JSON'],
          ['What method ends a basic Node HTTP response?', 'response.end()', 'request.close()', 'serve.finish()'],
          ['What status fits an unknown resource path?', '404', '200', '201'],
          ['Where does a request tell you whether it is GET or POST?', 'Its method', 'Its body encoding', 'Its content length'],
        ]),
    ],
  },
  {
    id: 'express', name: 'Express', label: 'Routing & REST APIs', mark: 'EX', color: 'slate',
    reference: 'https://expressjs.com/en/starter/basic-routing.html',
    topics: [
      lesson('express-routes', 'Routes and parameters', 14,
        'Express matches a request by method and path. Route parameters capture named path segments. Query parameters usually modify a query, such as filtering or sorting.',
        'app.get("/topics/:id", (req, res) => {\n  const topic = topics.find(item => item.id === req.params.id);\n  if (!topic) return res.status(404).json({ error: "Topic missing" });\n  return res.json(topic);\n});',
        'Use a path segment to identify a resource and a query parameter to narrow a list.',
        'Method says what to do. Path says where.',
        'Check unknown IDs and ambiguity between fixed routes and parameter routes.',
        ['Design routes to list topics, filter by track, and retrieve one topic by ID.'],
        [
          ['Where is the value for :id in a route?', 'req.params.id', 'req.query.id always', 'res.params.id'],
          ['Which input typically fits a level filter on a list?', 'A query parameter', 'An HTML class', 'A response header'],
          ['A GET topic ID is valid in shape but absent. What should the route return?', '404', '201', '204'],
          ['What distinguishes app.get from app.post?', 'The HTTP method they match', 'Whether the response is JSON', 'The route parameter count'],
        ]),
      lesson('express-middleware', 'Middleware and validation', 17,
        'Middleware can inspect requests, reject invalid input, or pass control with next. Mount middleware before the routes that rely on it. Keep validation errors clear and consistent.',
        'app.use(express.json());\napp.post("/topics", (req, res) => {\n  if (typeof req.body?.title !== "string" || !req.body.title.trim()) {\n    return res.status(400).json({ error: "A title is required" });\n  }\n  return res.status(201).json({ title: req.body.title.trim() });\n});',
        'When several routes need the same request preparation, consider middleware.',
        'Middleware either passes control or finishes the response.',
        'Check missing bodies, malformed JSON, whitespace-only values, and oversized inputs.',
        ['Implement input validation for a topic creation endpoint and outline request test cases.'],
        [
          ['Where should JSON parsing be mounted?', 'Before the routes that need it', 'After the final response', 'Only in the browser'],
          ['How does middleware pass control onward?', 'next()', 'res.json()', 'return true'],
          ['What response fits a required title containing only spaces?', '400', '201', '304'],
          ['What should an early rejection handler do after sending its response?', 'Leave the handler', 'Send a second response', 'Call next unconditionally'],
        ]),
      lesson('express-api', 'REST responses and errors', 18,
        'Choose status codes that distinguish malformed input, a missing record, and unexpected failure. Central error middleware lets endpoints pass failures through one response policy. Return stable error details clients can act on.',
        'app.use((err, req, res, next) => {\n  if (res.headersSent) return next(err);\n  return res.status(500).json({ error: "Unexpected error" });\n});',
        'Decide whether the caller can correct the request or the server needs to recover.',
        'A 4xx asks the client to change something. A 5xx reports server failure.',
        'Test failures before and after response headers, and inspect error JSON for accidental internal details.',
        ['Specify and test success, invalid input, missing record, and unexpected-error responses for a notes API.'],
        [
          ['How many arguments does Express error middleware declare?', 'Four', 'Two', 'Zero'],
          ['What status commonly indicates successful resource creation?', '201', '404', '500'],
          ['Storage fails unexpectedly after a valid request. Which status family fits?', '5xx', '2xx', '3xx'],
          ['Where should detailed exception information go?', 'Server-side logs', 'Every client response', 'The resource URL'],
        ]),
    ],
  },
  {
    id: 'java', name: 'Java', label: 'Language, standard library & JVM', mark: 'J', color: 'rose',
    reference: 'https://dev.java/learn/',
    topics: [
      lesson('java-basics', 'Practice: apply types and control flow', 16,
        'Bring primitive types, comparisons, branches, and loops together in one calculation. Start by choosing the variable types, then trace the comparison and result for each branch. Remember that integer division truncates toward zero, so convert an operand before dividing when you need a fractional result.',
        'static double average(int a, int b) {\n    return ((double) a + b) / 2;\n}',
        'If a result needs fractions, check whether the calculation uses integer operands.',
        'Cast before division so the division itself uses floating point.',
        'Try negative values, odd sums, and values large enough to overflow an int sum.',
        ['Implement an average and ticket-price calculator with boundary examples.', ['LeetCode #2235', 'Add Two Integers', 'https://leetcode.com/problems/add-two-integers/']],
        [
          ['What does 7 / 2 evaluate to when both operands are int?', '3', '3.5', '4'],
          ['What Java type represents true or false?', 'boolean', 'bool', 'int'],
          ['Which expression preserves the fraction in 7 divided by 2?', '(double) 7 / 2', '(double) (7 / 2)', '7 / 2'],
          ['What is the last value visited by for (int i = 0; i < 3; i++)?', '2', '3', '4'],
        ]),
      lesson('java-arrays', 'Arrays and loop boundaries', 18,
        'Java arrays use indices from zero through length minus one. Use a for-each loop when you only need the items and a traditional loop when you need their positions. Derive loop limits from the input length.',
        'static int countPassing(int[] scores) {\n    int count = 0;\n    for (int score : scores) {\n        if (score >= 60) count++;\n    }\n    return count;\n}',
        'If the answer needs a position, carry an index. If it only needs values, traverse values directly.',
        'Valid indices satisfy 0 <= i and i < length.',
        'Check empty and single-item arrays, the final index, and a score exactly at the threshold.',
        ['Count values at or above a given threshold and test the equality boundary.', ['LeetCode #1480', 'Running Sum of 1d Array', 'https://leetcode.com/problems/running-sum-of-1d-array/']],
        [
          ['What is the last valid index for an array of length 5?', '4', '5', '6'],
          ['Which condition counts a score of exactly 60 as passing?', 'score >= 60', 'score > 60', 'score == 61'],
          ['Which loop is simplest when neither the index nor neighbors are needed?', 'A for-each loop', 'A loop using <= length', 'Two nested loops'],
          ['How many items does a for-each loop visit in an empty array?', 'Zero', 'One', 'It always throws an exception'],
        ]),
      lesson('java-search', 'Binary search', 22,
        'Binary search discards half of an ordered search range at each step. For an exact match, keep all plausible indices in the range and return a sentinel if the range becomes empty. To find an insertion position, keep the boundary where the answer could lie.',
        'static int indexOf(int[] nums, int target) {\n    int low = 0, high = nums.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}',
        'Sorted inputs and a logarithmic time requirement suggest binary search. Read the prompt to distinguish exact match, boundary, and insertion.',
        'Each step shrinks the search range while keeping every plausible answer inside it.',
        'Trace a one-item array, a missing target, both endpoints, and duplicates if the prompt allows them.',
        ['Trace a missing target between two values, then implement exact search and insertion position.', ['LeetCode #704', 'Binary Search', 'https://leetcode.com/problems/binary-search/'], ['LeetCode #35', 'Search Insert Position', 'https://leetcode.com/problems/search-insert-position/']],
        [
          ['What property lets exact binary search discard half the range?', 'The data is sorted', 'The array is even length', 'The values are positive'],
          ['The middle value is below the target. What is the new lower bound for exact search?', 'mid + 1', 'mid - 1', 'high + 1'],
          ['For [4, 8, 12], where would 15 be inserted?', 'At index 3', 'At index 2', 'At index 0'],
          ['When is an inclusive search range empty?', 'When low > high', 'Whenever low == high', 'Whenever high > low'],
        ]),
    ],
  },
  {
    id: 'dsa', name: 'DSA with Java', label: 'Data structures, algorithms & problem solving', mark: 'DSA', color: 'violet',
    reference: 'https://xlinux.nist.gov/dads/',
    referenceLabel: 'NIST algorithm and data structure reference',
    essentialsTitle: foundations[0].title,
    topics: foundations[0].topics,
  },
];

const originalJavaModules = [
  { id: 'essentials', title: 'Essentials', topics: paths.find(path => path.id === 'java').topics },
  ...java, ...javaCore, ...advanced.java,
];
const javaLessons = new Map(originalJavaModules.flatMap(module => module.topics).map(topic => [topic.id, topic]));

const expandedPaths = {
  html, css, node, express,
  javascript: [...javascript, ...advanced.javascript],
  react: [...react, ...advanced.react],
  dsa: [...foundations.slice(1), ...structures, ...graphs, ...optimization, ...techniques, ...specialized],
};
const moduleEntries = {
  'html-documents': 'html-structure',
  'html-interactive': 'html-tables',
  'css-styling': 'css-cascade',
  'css-layouts': 'css-responsive',
  'css-systems': 'css-motion',
  'javascript-language': 'js-basics',
  'javascript-browser': 'js-async',
  'javascript-patterns': 'js-arrays',
  'javascript-advanced': 'js-data',
  'react-composition': 'react-state',
  'react-integration': 'react-reducer',
  'react-advanced': 'react-fetch',
  'node-tooling': 'node-runtime',
  'node-production': 'node-streams',
  'express-services': 'express-api',
  'express-shipping': 'express-persistence',
  'dsa-sorting': 'dsa-arrays',
  'dsa-linear': 'dsa-frequencies',
  'dsa-trees': 'dsa-stack-queue',
  'dsa-graphs': 'dsa-traversals',
  'dsa-weighted': 'dsa-directed',
  'dsa-greedy-search': 'dsa-sorting',
  'dsa-dp': 'dsa-recursive-split',
  'dsa-strings': 'dsa-prefix-difference',
  'dsa-range-math': 'dsa-prefix-difference',
  'dsa-advanced-patterns': 'dsa-bounds',
};

export const tracks = paths.map(path => {
  let level = 0;
  const sequence = path.id === 'java'
    ? javaSequence.map(module => ({ ...module, topics: module.topics.map(id => javaLessons.get(id)) }))
    : [
      { id: 'essentials', title: path.essentialsTitle ?? 'Essentials', topics: path.topics },
      ...expandedPaths[path.id],
    ];
  const modules = sequence.map((module, moduleIndex) => {
    const id = `${path.id}-${module.id}`;
    const mixed = path.id !== 'java' && moduleIndex === 0;
    return {
      ...module,
      id,
      trackId: path.id,
      mode: mixed ? 'mixed' : 'module',
      subject: mixed ? path.id : id,
      topics: module.topics.map((topic, index) => ({
        ...topic,
        ...javaExamples[topic.id],
        trackId: path.id,
        moduleId: id,
        level: ++level,
        prerequisite: module.topics[index - 1]?.id ?? module.prerequisite ?? moduleEntries[id],
        criteria: topic.criteria ?? [topic.edges, 'Write down the expected result for each case and compare it with your implementation.'],
      })),
    };
  });
  return { ...path, modules, topics: modules.flatMap(module => module.topics) };
});

export const topics = tracks.flatMap(track => track.topics);
export const modules = tracks.flatMap(track => track.modules);
export const getTrack = id => tracks.find(track => track.id === id);
export const getTopic = id => topics.find(topic => topic.id === id);
export const getModule = id => modules.find(module => module.id === id);

// Earlier Java attempts stored answers by position, so their original question order is still used.
const originalJavaAssessments = originalJavaModules.map((module, index) => ({
  ...module,
  trackId: 'java',
  mode: index === 0 ? 'mixed' : 'module',
  subject: index === 0 ? 'java' : `java-${module.id}`,
}));

export function getAssessmentModule(mode, subject) {
  if (mode === 'mixed' || mode === 'module') {
    return modules.find(module => module.mode === mode && module.subject === subject)
      ?? originalJavaAssessments.find(module => module.mode === mode && module.subject === subject);
  }
}
