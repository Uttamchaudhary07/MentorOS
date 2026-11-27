import { program as p } from './program.js';

const h2 = 'https://repo.maven.apache.org/maven2/com/h2database/h2/2.3.232/h2-2.3.232.jar';
const junit = 'https://repo.maven.apache.org/maven2/org/junit/platform/junit-platform-console-standalone/1.11.4/junit-platform-console-standalone-1.11.4.jar';

const junitImports = [
  'org.junit.platform.engine.discovery.DiscoverySelectors',
  'org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder',
  'org.junit.platform.launcher.core.LauncherFactory',
  'org.junit.platform.launcher.listeners.SummaryGeneratingListener',
];

const junitMain = `var listener = new SummaryGeneratingListener();
var request = LauncherDiscoveryRequestBuilder.request()
    .selectors(DiscoverySelectors.selectClass(Main.class)).build();
LauncherFactory.create().execute(request, listener);
var result = listener.getSummary();
System.out.println("Tests passed: " + result.getTestsSucceededCount());
if (result.getTestsFailedCount() > 0) throw new AssertionError("Tests failed");`;

const withJar = (url, jar) => `curl -fLO ${url}
javac -cp "${jar}" Main.java
java -cp ".:${jar}" Main`;

const classpathNote = 'The commands use macOS/Linux classpath syntax. In PowerShell, use curl.exe to download the JAR and replace the classpath colon with a semicolon.';

export const javaPlatform = {
  'java-collections': p(
    `Map<String, Integer> counts = new HashMap<>();
for (String tag : List.of("java", "arrays", "java")) {
    counts.merge(tag, 1, Integer::sum);
}
System.out.println("java=" + counts.get("java") + ", keys=" + counts.size());`,
    'java=2, keys=2',
    [['Choose the key', 'Each tag is a map key and its value is the number of occurrences.'],
      ['Merge each occurrence', 'merge inserts 1 for a new key and adds 1 to an existing count.'],
      ['Read the result', 'The repeated tag has count two, and only two distinct keys remain.']],
    { imports: ['java.util.HashMap', 'java.util.List', 'java.util.Map'] },
  ),
  'java-ordered-collections': p(
    `NavigableMap<Integer, String> grades = new TreeMap<>();
grades.put(60, "pass");
grades.put(90, "distinction");
for (int score : new int[] {59, 75, 90}) {
    var grade = grades.floorEntry(score);
    System.out.println(score + ": " + (grade == null ? "retry" : grade.getValue()));
}`,
    '59: retry\n75: pass\n90: distinction',
    [['Store sorted thresholds', 'TreeMap keeps numeric threshold keys in ascending order.'],
      ['Find the best eligible threshold', 'floorEntry finds the greatest threshold no higher than the score.'],
      ['Handle the boundary', 'A missing floor gives retry, and an exact threshold such as 90 counts.']],
    { imports: ['java.util.NavigableMap', 'java.util.TreeMap'] },
  ),
  'java-collection-views': p(
    `List<String> original = new ArrayList<>(List.of("Loops", "", "Arrays", "Graphs"));
var view = original.subList(0, Math.min(3, original.size()));
var copy = new ArrayList<>(view);
copy.removeIf(String::isBlank);
System.out.println("Copy: " + copy);
System.out.println("Original size: " + original.size());`,
    'Copy: [Loops, Arrays]\nOriginal size: 4',
    [['Select a view', 'subList exposes up to three items from the original collection.'],
      ['Copy the selection', 'A new ArrayList owns its own structure, so removal affects only that list.'],
      ['Verify behavior', 'The blank entry is removed from the copy and the original still has four elements.']],
    { imports: ['java.util.ArrayList', 'java.util.List'] },
  ),
  'java-streams': p(
    `var topics = List.of(new Topic("Trees", true), new Topic("Graphs", false), new Topic("Arrays", true));
var names = topics.stream().filter(Topic::ready).map(Topic::name).sorted().toList();
System.out.println(names);
System.out.println(names.stream().findFirst().orElse("No topics"));`,
    '[Arrays, Trees]\nArrays',
    [['Start with records', 'Each topic carries a name and ready flag. A stream reads those records.'],
      ['Build and run the pipeline', 'filter retains ready records, map extracts names, and sorted orders them. toList is the terminal operation.'],
      ['Handle absence explicitly', 'findFirst returns an Optional. A fallback would be used if the filtered list were empty.']],
    { imports: ['java.util.List'], members: 'record Topic(String name, boolean ready) {}' },
  ),
  'java-stream-collectors': p(
    `var tracks = List.of("Java", "DSA", "Java");
var counts = tracks.stream()
    .collect(Collectors.groupingBy(track -> track, TreeMap::new, Collectors.counting()));
long points = IntStream.of(10, 20, 30).asLongStream().sum();
System.out.println(counts);
System.out.println(points);`,
    '{DSA=1, Java=2}\n60',
    [['Choose the classifier', 'The track name itself determines each group. TreeMap makes the output ordering predictable.'],
      ['Aggregate each group', 'The downstream counting collector produces one count per name.'],
      ['Reduce numeric data', 'The primitive stream widens its values to long and adds them without boxing each result.']],
    { imports: ['java.util.List', 'java.util.TreeMap', 'java.util.stream.Collectors', 'java.util.stream.IntStream'] },
  ),
  'java-numeric-api': p(
    `BigDecimal total = new BigDecimal("1.25");
BigDecimal share = total.divide(BigDecimal.valueOf(3), 2, RoundingMode.HALF_UP);
BigInteger large = BigInteger.valueOf(2).pow(70);
System.out.println("Rounded share: " + share);
System.out.println("Exact large integer: " + large);`,
    'Rounded share: 0.42\nExact large integer: 1180591620717411303424',
    [['Construct an exact decimal', 'The decimal string carries the intended value without first converting through a double.'],
      ['Specify rounding', 'A third of 1.25 repeats. The divide call explicitly chooses two places and half-up rounding.'],
      ['Use a wider integer representation', 'BigInteger computes 2 to the power of 70 exactly, beyond the range of long.']],
    { imports: ['java.math.BigDecimal', 'java.math.BigInteger', 'java.math.RoundingMode'] },
  ),
  'java-regex': p(
    `Pattern code = Pattern.compile("[A-Z]{3}-[0-9]{4}");
System.out.println(code.matcher("DSA-2026").matches());
System.out.println(code.matcher("DSA-2026-extra").matches());
System.out.println("A😀".codePoints().count());`,
    'true\nfalse\n2',
    [['Compile the reusable pattern', 'The expression expects three capital letters, a hyphen, and four digits.'],
      ['Validate the whole input', 'matches requires the whole string to fit, so the extra suffix is rejected.'],
      ['Count code points', 'The emoji uses two UTF-16 units and one code point. Together with A the count is two.']],
    { imports: ['java.util.regex.Pattern'] },
  ),
  'java-io': p(
    `Path file = Files.createTempFile("reviews", ".txt");
try {
    Files.writeString(file, "Révision", StandardCharsets.UTF_8);
    System.out.println(Files.readString(file, StandardCharsets.UTF_8));
    Instant moment = Instant.parse("2026-04-01T20:00:00Z");
    System.out.println(moment.atZone(ZoneId.of("Asia/Kolkata")).toLocalDate());
} finally {
    Files.deleteIfExists(file);
}`,
    'Révision\n2026-04-02',
    [['Use an owned temporary file', 'The program creates a file for this run and uses UTF-8 for both writing and reading.'],
      ['Convert the instant', 'The UTC timestamp becomes a local date using a named time zone, taking it past midnight.'],
      ['Clean up', 'The finally block deletes the temporary file even when a read or print fails.']],
    { imports: ['java.nio.charset.StandardCharsets', 'java.nio.file.Files', 'java.nio.file.Path', 'java.time.Instant', 'java.time.ZoneId'], throws: true },
  ),
  'java-nio': p(
    `Path log = Files.createTempFile("study", ".txt");
try {
    Files.writeString(log, "Loops\\n\\nArrays\\n");
    try (var rows = Files.lines(log)) {
        System.out.println(rows.filter(row -> !row.isBlank()).count());
    }
} finally {
    Files.deleteIfExists(log);
}`,
    '2',
    [['Create a log fixture', 'The temporary log includes a blank line between two records.'],
      ['Read lazily', 'Files.lines streams the file. Filtering skips the blank row and count consumes the stream.'],
      ['Close before deleting', 'Try-with-resources closes the stream before the outer finally removes its file.']],
    { imports: ['java.nio.file.Files', 'java.nio.file.Path'], throws: true },
  ),
  'java-http': p(
    `var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
server.createContext("/topics", exchange -> {
    byte[] body = "Arrays".getBytes(StandardCharsets.UTF_8);
    exchange.sendResponseHeaders(200, body.length);
    try (var stream = exchange.getResponseBody()) { stream.write(body); }
});
server.start();
try (var client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build()) {
    var uri = URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/topics");
    var request = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(3)).build();
    var response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println(response.statusCode() + ": " + response.body());
} finally {
    server.stop(0);
}`,
    '200: Arrays',
    [['Start a local endpoint', 'The loopback server picks a free port and returns one known body, so no external service is required.'],
      ['Send a bounded request', 'The client connects to the chosen port. Connect and request timeouts limit different parts of the operation.'],
      ['Read and close', 'The program prints the HTTP status as well as the decoded body, then closes the client and stops the server.']],
    { imports: ['com.sun.net.httpserver.HttpServer', 'java.net.InetSocketAddress', 'java.net.URI', 'java.net.http.HttpClient', 'java.net.http.HttpRequest', 'java.net.http.HttpResponse', 'java.nio.charset.StandardCharsets', 'java.time.Duration'], throws: true },
  ),
  'java-data-formats': p(
    `String row = "loops,2026-04-02T09:00:00Z";
String[] fields = row.split(",", -1);
if (fields.length != 2 || fields[0].isBlank()) throw new IllegalArgumentException("Invalid review");
ReviewDto review = new ReviewDto(fields[0], Instant.parse(fields[1]));
System.out.println(review.topicId() + " due " + review.dueAt());`,
    'loops due 2026-04-02T09:00:00Z',
    [['Define the format', 'This example uses a two-field record with a simple comma delimiter and no quoting rules.'],
      ['Validate before constructing', 'The field count and ID are checked, and Instant.parse rejects malformed dates.'],
      ['Use typed data', 'The rest of the program receives a topic ID and an Instant rather than unvalidated input text.']],
    { imports: ['java.time.Instant'], members: 'record ReviewDto(String topicId, Instant dueAt) {}' },
  ),
  'java-jdbc': p(
    `try (Connection db = DriverManager.getConnection("jdbc:h2:mem:study")) {
    try (Statement setup = db.createStatement()) {
        setup.executeUpdate("CREATE TABLE topic (id INT PRIMARY KEY, title VARCHAR(50))");
        setup.executeUpdate("INSERT INTO topic VALUES (1, 'Arrays')");
    }
    try (PreparedStatement query = db.prepareStatement("SELECT title FROM topic WHERE id = ?")) {
        query.setInt(1, 1);
        try (ResultSet rows = query.executeQuery()) {
            System.out.println(rows.next() ? rows.getString("title") : "Missing");
        }
    }
}`,
    'Arrays',
    [['Open a temporary database', 'H2 supplies a real JDBC driver. The in-memory database exists only while its connection is open.'],
      ['Create data and bind the lookup', 'Setup creates one row. setInt supplies the first placeholder value separately from the SQL text.'],
      ['Read and release resources', 'next advances to the result before reading title. Each try-with-resources block closes its resource.']],
    { imports: ['java.sql.Connection', 'java.sql.DriverManager', 'java.sql.PreparedStatement', 'java.sql.ResultSet', 'java.sql.Statement'],
      commands: withJar(h2, 'h2-2.3.232.jar'), details: classpathNote, throws: true },
  ),
  'java-security-api': p(
    `byte[] nonce = new byte[16];
new SecureRandom().nextBytes(nonce);
byte[] content = "course".getBytes(StandardCharsets.UTF_8);
MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
byte[] expected = sha256.digest(content);
byte[] changed = sha256.digest("changed".getBytes(StandardCharsets.UTF_8));
System.out.println("Random byte count: " + nonce.length);
System.out.println("Changed content matches: " + MessageDigest.isEqual(expected, changed));`,
    'Random byte count: 16\nChanged content matches: false',
    [['Generate unpredictable bytes', 'SecureRandom fills the array. The example prints only its fixed length because the bytes change every run.'],
      ['Digest two messages', 'SHA-256 maps each byte sequence to a digest. The expected value is calculated from the original message.'],
      ['Compare for integrity', 'The changed message has a different digest. In a real integrity check the expected digest also needs a trusted source.']],
    { imports: ['java.nio.charset.StandardCharsets', 'java.security.MessageDigest', 'java.security.SecureRandom'], throws: true },
  ),
  'java-thread-lifecycle': p(
    `Thread worker = Thread.ofPlatform().start(() -> {
    try {
        Thread.sleep(60_000);
    } catch (InterruptedException error) {
        Thread.currentThread().interrupt();
        System.out.println("Worker noticed interruption");
    }
});
worker.interrupt();
worker.join();
System.out.println("Worker finished: " + !worker.isAlive());`,
    'Worker noticed interruption\nWorker finished: true',
    [['Start the worker', 'The platform thread enters the task and attempts an interruptible sleep.'],
      ['Request cancellation', 'interrupt can arrive before or during sleep. Either way the sleep throws and the catch preserves the interrupt flag.'],
      ['Wait deterministically', 'join ensures that the worker has finished before the main thread reports its state.']],
    { throws: true },
  ),
  'java-locks': p(
    `Account account = new Account();
Thread first = Thread.ofPlatform().start(() -> account.debit(10));
Thread second = Thread.ofPlatform().start(() -> account.debit(20));
first.join();
second.join();
System.out.println(account.balance + " after " + account.operations + " operations");`,
    '70 after 2 operations',
    [['Share one account', 'Two threads run debit against the same balance and operation counter.'],
      ['Hold the lock across both writes', 'Only one thread modifies the fields at a time. finally releases the lock even if a write throws.'],
      ['Join before observing', 'The main thread waits for both debits before reading their combined effect.']],
    { imports: ['java.util.concurrent.locks.ReentrantLock'], throws: true,
      members: `static final class Account {
    private final ReentrantLock lock = new ReentrantLock();
    private int balance = 100, operations;
    void debit(int amount) {
        lock.lock();
        try { balance -= amount; operations++; }
        finally { lock.unlock(); }
    }
}` },
  ),
  'java-concurrency': p(
    `AtomicInteger count = new AtomicInteger();
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(() -> { count.incrementAndGet(); });
    executor.submit(() -> { count.incrementAndGet(); });
}
System.out.println(count.get());`,
    '2',
    [['Share one atomic value', 'Both tasks can update the same AtomicInteger without a data race in the increment.'],
      ['Submit virtual-thread tasks', 'The executor runs the supplied jobs. Closing it waits for the submitted jobs to finish.'],
      ['Read the final count', 'Each task contributed one increment, so the observed result is two.']],
    { imports: ['java.util.concurrent.Executors', 'java.util.concurrent.atomic.AtomicInteger'] },
  ),
  'java-futures': p(
    `var left = CompletableFuture.supplyAsync(() -> "Arrays");
var right = CompletableFuture.supplyAsync(() -> 3);
var dashboard = left.thenCombine(right, (topic, count) -> topic + ": " + count)
    .orTimeout(3, TimeUnit.SECONDS);
System.out.println(dashboard.join());`,
    'Arrays: 3',
    [['Start independent work', 'Each supplyAsync creates a future without waiting for the other result.'],
      ['Combine completed values', 'thenCombine receives both results in a single callback. The timeout attaches a deadline to the combined stage.'],
      ['Read the outcome', 'join returns the combination or reports an asynchronous failure. It does not stop any underlying timed-out external request.']],
    { imports: ['java.util.concurrent.CompletableFuture', 'java.util.concurrent.TimeUnit'] },
  ),
  'java-queues': p(
    `BlockingQueue<String> jobs = new ArrayBlockingQueue<>(1);
System.out.println(jobs.offer("Read loops"));
System.out.println(jobs.offer("Read arrays"));
System.out.println(jobs.take());
System.out.println(jobs.offer("Read arrays"));`,
    'true\nfalse\nRead loops\ntrue',
    [['Create one slot', 'The array-backed blocking queue uses a fixed capacity of one.'],
      ['Observe backpressure', 'The second immediate offer returns false while the first job occupies that slot.'],
      ['Free a slot', 'take removes the first job. Retrying the second offer then succeeds.']],
    { imports: ['java.util.concurrent.ArrayBlockingQueue', 'java.util.concurrent.BlockingQueue'], throws: true },
  ),
  'java-tools': p(
    junitMain,
    'Tests passed: 1',
    [['Write one check', 'The @Test method uses assertEquals to verify an exact passing boundary.'],
      ['Discover the class', 'The JUnit launcher builds a request selecting Main and feeds results into a listener.'],
      ['Check the summary', 'The program prints the successful count and exits with an error if JUnit reports a failure.']],
    { imports: [...junitImports, 'org.junit.jupiter.api.Test', 'static org.junit.jupiter.api.Assertions.assertEquals'],
      commands: withJar(junit, 'junit-platform-console-standalone-1.11.4.jar'), details: classpathNote,
      members: `@Test void includesThreshold() {
    assertEquals(1, countPassing(new int[] {59, 60}));
}
static long countPassing(int[] scores) {
    return java.util.Arrays.stream(scores).filter(value -> value >= 60).count();
}` },
  ),
  'java-test-design': p(
    junitMain,
    'Tests passed: 3',
    [['Supply the boundaries', 'Each CsvSource row has a candidate score and its desired boolean result.'],
      ['Reuse one assertion', 'JUnit invokes the same parameterized method three times. Each invocation compares independently.'],
      ['Read the aggregate', 'The listener counts all successful cases. A failed case makes the process fail.']],
    { imports: [...junitImports, 'org.junit.jupiter.params.ParameterizedTest', 'org.junit.jupiter.params.provider.CsvSource', 'static org.junit.jupiter.api.Assertions.assertEquals'],
      commands: withJar(junit, 'junit-platform-console-standalone-1.11.4.jar'), details: classpathNote,
      members: `@ParameterizedTest
@CsvSource({"59,false", "60,true", "61,true"})
void threshold(int score, boolean expected) {
    assertEquals(expected, score >= 60);
}` },
  ),
  'java-logging': p(
    `try {
    importRecord("");
} catch (IllegalArgumentException error) {
    LOG.log(System.Logger.Level.WARNING, "Import failed for job study-17", error);
    System.out.println("Import outcome: rejected");
}`,
    'Import outcome: rejected',
    [['Reject invalid input', 'importRecord throws because the ID is blank.'],
      ['Log at the boundary', 'The catch logs the job ID and the exception, preserving the cause without including the raw record.'],
      ['Report the outcome', 'The printed result is deterministic. The logger also writes a warning whose format depends on your JVM configuration.']],
    { members: `private static final System.Logger LOG = System.getLogger("study");
static void importRecord(String id) {
    if (id.isBlank()) throw new IllegalArgumentException("Missing topic ID");
}` },
  ),
  'java-classloading': p(
    `System.out.println("Before use");
System.out.println("Value: " + Topic.VALUE);`,
    'Before use\nTopic initialized\nValue: 42',
    [['Define a nested type', 'Topic has a static field initialized by a method call, so the value cannot be inlined as a compile-time constant.'],
      ['Trigger initialization', 'Main reaches the first active use of Topic. Initialization calls load and prints its message.'],
      ['Observe the sequence', 'Only after initialization does the field read produce 42. javap can show the field access in bytecode.']],
    { members: `static final class Topic {
    static final int VALUE = load();
    static int load() {
        System.out.println("Topic initialized");
        return 42;
    }
}`,
      details: 'After running the program, use javap -c Main to inspect its bytecode.' },
  ),
  'java-jvm': p(
    `Module current = Main.class.getModule();
Module core = String.class.getModule();
List<String> cache = new ArrayList<>(List.of("large report reference"));
System.out.println("Application module named: " + current.isNamed());
System.out.println("String module: " + core.getName());
cache.clear();
System.out.println("References retained by cache: " + cache.size());`,
    'Application module named: false\nString module: java.base\nReferences retained by cache: 0',
    [['Inspect a classpath application', 'Main was compiled and launched on the classpath, so it belongs to an unnamed module.'],
      ['Find the platform module', 'String belongs to the named java.base module.'],
      ['Drop retained references', 'Clearing the list stops this cache from retaining its entries. Whether an object is collected depends on all remaining references and the runtime.']],
    { imports: ['java.util.ArrayList', 'java.util.List'] },
  ),
  'java-gc-profiling': p(
    `try (Recording report = new Recording()) {
    report.enable("jdk.GarbageCollection");
    report.start();
    List<byte[]> samples = new ArrayList<>();
    for (int i = 0; i < 64; i++) samples.add(new byte[4096]);
    System.out.println("Retained samples: " + samples.size());
    samples.clear();
    report.stop();
    report.dump(Path.of("study.jfr"));
}
System.out.println("Recording written: " + Files.isRegularFile(Path.of("study.jfr")));`,
    'Retained samples: 64\nRecording written: true',
    [['Start a short recording', 'The JFR API enables a garbage collector event type. The program prints predictable status without relying on a collection actually occurring.'],
      ['Run a small workload', 'The list keeps references to 64 generated arrays. Clearing the list removes those references.'],
      ['Save the evidence', 'stop finishes recording and dump writes study.jfr. Inspect it with jfr summary study.jfr.']],
    { imports: ['jdk.jfr.Recording', 'java.nio.file.Files', 'java.nio.file.Path', 'java.util.ArrayList', 'java.util.List'],
      throws: true, details: 'This example writes study.jfr in the working directory. Run it in its own folder.' },
  ),
  'java-build-packaging': p(
    `System.out.println("Packaged study app");`,
    'Packaged study app',
    [['Compile the entry point', 'javac turns Main.java into Main.class.'],
      ['Package and declare the entry class', 'jar stores Main.class and records Main as the application entry point.'],
      ['Launch the archive', 'java -jar reads the archive metadata and calls main.']],
    { commands: 'javac Main.java\njar --create --file study.jar --main-class Main Main.class\njava -jar study.jar' },
  ),
  'java-services': p(
    `ReviewStore memory = id -> Optional.of("Loops".equals(id) ? "Tomorrow" : "Next week");
var useCase = new ScheduleReview(memory);
System.out.println(useCase.when("Loops"));`,
    'Tomorrow',
    [['Name the dependency', 'The ReviewStore interface is the contract for finding a scheduled review.'],
      ['Inject an implementation', 'The constructor receives an in-memory lambda. No database setup is needed by the use case.'],
      ['Request a result', 'when calls the injected store and handles absence with a default label.']],
    { imports: ['java.util.Optional'], members: `interface ReviewStore { Optional<String> due(String topic); }
record ScheduleReview(ReviewStore store) {
    String when(String topic) { return store.due(topic).orElse("No review"); }
}` },
  ),
  'java-desktop': p(
    `SwingUtilities.invokeAndWait(() -> {
    var button = new JButton("Start review");
    button.addActionListener(event -> System.out.println("Review opened"));
    button.doClick(0);
});`,
    'Review opened',
    [['Enter the event dispatch thread', 'invokeAndWait runs component creation and interaction on Swing’s designated thread.'],
      ['Wire a control to an action', 'The listener describes what to do when the button activates.'],
      ['Verify without opening a window', 'doClick exercises the same action path in a deterministic, headless-friendly demo.']],
    { imports: ['javax.swing.JButton', 'javax.swing.SwingUtilities'], throws: true },
  ),
  'java-integration-project': p(
    `List<String> incoming = List.of("loops", "arrays", "loops", " ");
Set<String> published = importTopics(incoming);
System.out.println(published.stream().sorted().toList());`,
    '[arrays, loops]',
    [['Start with a bounded batch', 'The input deliberately includes a duplicate and a blank record.'],
      ['Process and validate in parallel', 'The executor runs each normalization and returns futures. get propagates an unexpected failure before collecting a final result.'],
      ['Stage and publish together', 'A local set collects only valid unique IDs. An immutable result is returned only after all tasks finish. A persistent service would commit that staged batch in a transaction.']],
    { imports: ['java.util.ArrayList', 'java.util.HashSet', 'java.util.List', 'java.util.Set', 'java.util.concurrent.Executors', 'java.util.concurrent.Future'], throws: true,
      members: `static Set<String> importTopics(List<String> rows) throws Exception {
    List<Future<String>> jobs = new ArrayList<>();
    try (var executor = Executors.newFixedThreadPool(2)) {
        for (String row : rows) jobs.add(executor.submit(row::trim));
        Set<String> staged = new HashSet<>();
        for (var job : jobs) {
            String value = job.get();
            if (!value.isEmpty()) staged.add(value);
        }
        return Set.copyOf(staged);
    }
}` },
  ),
};
