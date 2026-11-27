export const javaSequence = [
  {
    id: 'getting-started',
    title: 'Getting started: setup, types, and control flow',
    topics: ['java-setup', 'java-primitives', 'java-operators', 'java-branching', 'java-basics'],
  },
  {
    id: 'methods-and-arrays',
    title: 'Strings, methods, and arrays',
    prerequisite: 'java-basics',
    topics: ['java-strings', 'java-methods', 'java-arrays', 'java-matrices'],
  },
  {
    id: 'classes-and-interfaces',
    title: 'Classes, interfaces, and object design',
    prerequisite: 'java-methods',
    topics: ['java-classes', 'java-access', 'java-oop', 'java-abstract', 'java-contracts'],
  },
  {
    id: 'types-and-language-features',
    title: 'Generics, exceptions, and modern Java',
    prerequisite: 'java-contracts',
    topics: [
      'java-exceptions', 'java-boxing', 'java-generics', 'java-generic-design', 'java-nested',
      'java-modeling', 'java-pattern-matching', 'java-reflection',
    ],
  },
  {
    id: 'collections-and-streams',
    title: 'Collections, streams, and collectors',
    prerequisite: 'java-generics',
    topics: ['java-collections', 'java-ordered-collections', 'java-collection-views', 'java-streams', 'java-stream-collectors'],
  },
  {
    id: 'text-numbers-and-files',
    title: 'Numbers, text, dates, and files',
    prerequisite: 'java-exceptions',
    topics: ['java-numeric-api', 'java-regex', 'java-io', 'java-nio'],
  },
  {
    id: 'networking-and-data',
    title: 'Networking, data formats, and databases',
    prerequisite: 'java-nio',
    topics: ['java-http', 'java-data-formats', 'java-jdbc', 'java-security-api'],
  },
  {
    id: 'concurrent-programming',
    title: 'Threads, concurrency, and asynchronous programming',
    prerequisite: 'java-collections',
    topics: ['java-thread-lifecycle', 'java-locks', 'java-concurrency', 'java-futures', 'java-queues'],
  },
  {
    id: 'jvm-build-and-test',
    title: 'Build tools, testing, packaging, and the JVM',
    prerequisite: 'java-classes',
    topics: [
      'java-tools', 'java-test-design', 'java-logging', 'java-classloading', 'java-jvm',
      'java-gc-profiling', 'java-build-packaging',
    ],
  },
  {
    id: 'application-projects',
    title: 'Application design and projects',
    prerequisite: 'java-jdbc',
    topics: ['java-services', 'java-desktop', 'java-integration-project'],
  },
  {
    id: 'algorithm-practice',
    title: 'Algorithm practice: complexity, sorting, and searching',
    prerequisite: 'java-matrices',
    topics: ['java-complexity', 'java-sort', 'java-search', 'java-prefix'],
  },
  {
    id: 'advanced-algorithm-practice',
    title: 'Algorithm practice: data structures and problem-solving patterns',
    prerequisite: 'java-collections',
    topics: [
      'java-stack', 'java-linked', 'java-heaps', 'java-trees', 'java-graphs', 'java-weighted',
      'java-union', 'java-greedy', 'java-backtracking', 'java-dp', 'java-project',
    ],
  },
];
