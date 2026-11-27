import { program } from './program.js';

export const javaBasics = {
  'java-setup': program(
    'System.out.println("Hello, Java!");',
    'Hello, Java!',
    [['Name the file', 'The public Main class belongs in Main.java. The class gives Java a name to launch.'],
      ['Enter main', 'The launcher calls main. Its String array would hold command-line arguments. This program has no inputs.'],
      ['Print the greeting', 'println writes the text followed by a newline. When main returns, the program finishes.']],
  ),
  'java-primitives': program(
    `int seats = Integer.MAX_VALUE;
long next = (long) seats + 1;
char label = 'A';
boolean available = next > seats;
System.out.println(label + ": " + next + ", " + available);`,
    'A: 2147483648, true',
    [['Set the boundary', 'Integer.MAX_VALUE is the largest int. Adding one as an int would wrap around.'],
      ['Widen before adding', 'Casting seats to long changes the arithmetic to long, which can hold 2147483648.'],
      ['Label and verify', 'The char supplies one code unit. The comparison produces a boolean, and the expression combines both with the number as text.']],
  ),
  'java-operators': program(
    `int completed = 8;
int assigned = 10;
boolean eligible = assigned > 0 && completed * 100 / assigned >= 75;
String message = switch (completed) {
    case 0 -> "Start practising";
    case 10 -> "Finished";
    default -> eligible ? "On track" : "Keep practising";
};
System.out.println(message);`,
    'On track',
    [['Protect the calculation', 'The left side of && checks assigned. A zero value stops evaluation before division.'],
      ['Compute eligibility', 'With 8 of 10 complete, multiplication before division yields 80, which meets the threshold.'],
      ['Choose the message', 'Eight matches neither exact case, so default uses the boolean to choose the output.']],
  ),
  'java-branching': program(
    `int sum = 0;
for (int i = 1; i <= 5; i++) {
    if (i % 2 != 0) continue;
    sum += i;
}
System.out.println(sum);`,
    '6',
    [['Initialize the loop', 'The running total starts at zero and i begins at one. The loop includes five because it uses <=.'],
      ['Skip odd values', 'The remainder test is true for 1, 3, and 5. continue goes directly to the increment, leaving sum alone.'],
      ['Accumulate and stop', 'The loop adds 2 and 4. When i becomes 6, the condition fails and the program prints the total.']],
  ),
  'java-basics': program(
    `int morning = 7;
int evening = 8;
double average = ((double) morning + evening) / 2;
if (average >= 7.5) {
    System.out.println("Target met: " + average);
} else {
    System.out.println("Keep practising: " + average);
}`,
    'Target met: 7.5',
    [['Make the inputs integers', 'The morning and evening values count completed exercises, so each is an int.'],
      ['Preserve the fraction', 'Casting before division produces 7.5. Dividing two ints first would lose the fraction.'],
      ['Apply the boundary', 'The comparison uses >=, so meeting the target exactly takes the first branch.']],
  ),
  'java-methods': program(
    `StringBuilder name = new StringBuilder("Ada");
rename(name);
replace(name);
System.out.println(name);`,
    'Ada!',
    [['Pass a reference value', 'The argument gives rename a copy of the reference to the same builder held by main.'],
      ['Mutate the shared object', 'rename calls append, so both references observe the added exclamation mark.'],
      ['Reassign locally', 'replace points only its parameter at a new builder. The caller still has its original builder.']],
    { members: `static void rename(StringBuilder name) { name.append("!"); }
static void replace(StringBuilder name) { name = new StringBuilder("New"); }` },
  ),
  'java-arrays': program(
    `int[] scores = {59, 60, 78};
System.out.println("Passing: " + countPassing(scores));`,
    'Passing: 2',
    [['Create the input', 'scores holds three integers. The value 60 is included to test the exact pass boundary.'],
      ['Scan once', 'The for-each loop visits each value in order. 59 is below the boundary, so count stays at zero.'],
      ['Count matching values', 'Both 60 and 78 satisfy >= 60. The method returns two after the last item.']],
    { members: `static int countPassing(int[] scores) {
    int count = 0;
    for (int score : scores) {
        if (score >= 60) count++;
    }
    return count;
}` },
  ),
  'java-matrices': program(
    `int[][] original = {{4, 8}, {15}};
int[][] copy = new int[original.length][];
for (int row = 0; row < original.length; row++) {
    copy[row] = original[row].clone();
}
copy[0][0] = 99;
System.out.println(original[0][0] + " -> " + copy[0][0]);`,
    '4 -> 99',
    [['Create a ragged matrix', 'The outer array holds two row references. The second row has just one value.'],
      ['Allocate new rows', 'The loop clones each row separately. That preserves row lengths without sharing their storage.'],
      ['Verify independence', 'Changing the first cell in copy leaves the original cell at four.']],
  ),
  'java-classes': program(
    `Score score = new Score(72);
System.out.println(score.points());
try {
    new Score(-1);
} catch (IllegalArgumentException error) {
    System.out.println(error.getMessage());
}`,
    '72\nNegative score',
    [['Create a valid object', 'The constructor checks its input and stores it in a private, final field.'],
      ['Read through the interface', 'points() exposes the value without allowing a caller to assign a new one.'],
      ['Reject invalid state', 'The negative input throws before the new object can be used. The caller catches and prints the reason.']],
    { members: `static final class Score {
    private final int points;
    Score(int points) {
        if (points < 0) throw new IllegalArgumentException("Negative score");
        this.points = points;
    }
    int points() { return points; }
}` },
  ),
  'java-access': program(
    `Ticket first = new Ticket(15);
Ticket second = new Ticket(16);
System.out.println(first.allowed() + ", " + second.allowed());`,
    'false, true',
    [['Share the threshold', 'MIN_AGE is static, so both tickets read the same class-level value. final keeps that constant fixed.'],
      ['Keep ages independent', 'Each constructor stores its own argument in the private instance field age.'],
      ['Expose a decision', 'allowed() compares the particular ticket’s age with the shared threshold. The boundary ticket passes.']],
    { members: `static final class Ticket {
    private static final int MIN_AGE = 16;
    private final int age;
    Ticket(int age) { this.age = age; }
    boolean allowed() { return age >= MIN_AGE; }
}` },
  ),
  'java-oop': program(
    `Summary plain = new Summary(score -> "Score: " + score);
Summary result = new Summary(score -> score >= 60 ? "Pass" : "Retry");
System.out.println(plain.line(72));
System.out.println(result.line(72));`,
    'Score: 72\nPass',
    [['Define a common contract', 'Formatter accepts an int and returns text, so each lambda can provide a different implementation.'],
      ['Compose the summary', 'Each Summary stores a formatter. line delegates through the interface without deciding how to display the score.'],
      ['Compare implementations', 'Both receive 72. One returns the numeric label and the other returns the pass decision.']],
    { members: `interface Formatter { String format(int score); }
record Summary(Formatter formatter) {
    String line(int score) { return formatter.format(score); }
}` },
  ),
  'java-abstract': program(
    `Result result = new Retry("Review loops");
String label = switch (result) {
    case Pass pass -> "Passed at " + pass.score();
    case Retry retry -> retry.reason();
};
System.out.println(label);`,
    'Review loops',
    [['Define allowed variants', 'The sealed Result interface permits just Pass and Retry. They carry different fields.'],
      ['Create one concrete result', 'Runtime selection sees a Retry even though the variable is declared as Result.'],
      ['Handle the known cases', 'The exhaustive switch binds the Retry value and reads its reason. A new permitted type would require another case.']],
    { members: `sealed interface Result permits Pass, Retry {}
record Pass(int score) implements Result {}
record Retry(String reason) implements Result {}` },
  ),
  'java-contracts': program(
    `List<String> input = new ArrayList<>(List.of("Loops"));
Plan plan = new Plan(input);
input.add("Arrays");
System.out.println(plan.topics());
System.out.println(plan.equals(new Plan(List.of("Loops"))));`,
    '[Loops]\ntrue',
    [['Give the plan a mutable input', 'The caller owns input and will later add a second lesson.'],
      ['Copy in the constructor', 'List.copyOf records the original contents in an unmodifiable list. The mutation of input does not alter the plan.'],
      ['Compare by value', 'The record compares its components. Separate plans with the same topic list compare equal and have equal hash codes.']],
    { imports: ['java.util.ArrayList', 'java.util.List'], members: `record Plan(List<String> topics) {
    Plan { topics = List.copyOf(topics); }
}` },
  ),
  'java-exceptions': program(
    `try (BufferedReader reader = new BufferedReader(new StringReader("Loops"))) {
    System.out.println(reader.readLine());
    if (reader.readLine() == null) throw new EOFException("No second line");
} catch (EOFException error) {
    System.out.println(error.getMessage());
}`,
    'Loops\nNo second line',
    [['Open the resource', 'The reader reads a one-line in-memory input. It is registered in the try-with-resources header.'],
      ['Detect an incomplete input', 'The first read produces Loops. The second read returns null, so the program raises a specific EOFException.'],
      ['Close and report', 'The reader closes automatically as control leaves the try. The catch handles the expected missing line.']],
    { imports: ['java.io.BufferedReader', 'java.io.EOFException', 'java.io.StringReader'], throws: true },
  ),
  'java-boxing': program(
    `Map<String, Integer> counts = Map.of("loops", 0);
Integer saved = counts.get("loops");
Integer missing = counts.get("arrays");
int fallback = missing == null ? 0 : missing;
System.out.println("Stored zero: " + Objects.equals(saved, 0));
System.out.println("Missing: " + (missing == null) + ", fallback: " + fallback);`,
    'Stored zero: true\nMissing: true, fallback: 0',
    [['Use a reference type in the map', 'The generic map stores Integer wrappers. The compiler boxes the literal zero.'],
      ['Read before unboxing', 'One lookup finds an actual zero and the other returns null. The conditional guards the unboxing of missing.'],
      ['Keep the cases distinct', 'Objects.equals verifies the stored value. The separate missing check records the fact that the other value was absent.']],
    { imports: ['java.util.Map', 'java.util.Objects'] },
  ),
  'java-generics': program(
    `System.out.println(total(List.of(1, 2)));
System.out.println(total(List.of(1.5, 2.25)));`,
    '3.0\n3.75',
    [['Supply two numeric types', 'The first list contains Integer values and the second contains Double values.'],
      ['Accept a producer', 'List<? extends Number> admits both lists. The method can read each item as a Number.'],
      ['Accumulate using one common operation', 'doubleValue converts each item to the representation the method accumulates and returns.']],
    { imports: ['java.util.List'], members: `static double total(List<? extends Number> values) {
    double sum = 0;
    for (Number value : values) sum += value.doubleValue();
    return sum;
}` },
  ),
  'java-generic-design': program(
    `String label = firstOr(List.of("Loops"), "Unknown");
int count = firstOr(List.<Integer>of(), 0);
System.out.println(label + ": " + count);`,
    'Loops: 0',
    [['Let the call establish T', 'List.of("Loops") and the fallback establish String. In the second call the arguments establish Integer.'],
      ['Return through the same type', 'firstOr returns a T from either the list or fallback, so neither call needs a cast.'],
      ['Exercise both branches', 'The populated list supplies Loops. The empty numeric list supplies zero, which Java unboxes to int.']],
    { imports: ['java.util.List'], members: `static <T> T firstOr(List<T> values, T fallback) {
    return values.isEmpty() ? fallback : values.get(0);
}` },
  ),
  'java-nested': program(
    `int threshold = 60;
Predicate<Score> passing = score -> score.points() >= threshold;
var names = List.of(new Score("Ada", 72), new Score("Bea", 58))
    .stream().filter(passing).map(Score::name).toList();
System.out.println(names);`,
    '[Ada]',
    [['Capture a local', 'The lambda uses threshold. The local is effectively final because it is assigned once.'],
      ['Choose records', 'The predicate retains Ada’s score and rejects Bea’s score.'],
      ['Extract names', 'Score::name calls the same record accessor that a score -> score.name() lambda would call.']],
    { imports: ['java.util.List', 'java.util.function.Predicate'], members: 'record Score(String name, int points) {}' },
  ),
  'java-modeling': program(
    `Topic topic = new Topic("Loops", Status.READY);
String label = switch (topic.status()) {
    case READY -> "Start now";
    case BLOCKED -> "Review prerequisites";
};
System.out.println(topic.name() + ": " + label);`,
    'Loops: Start now',
    [['Declare the allowed states', 'The enum admits READY and BLOCKED. The record groups one status with a topic name.'],
      ['Read the components', 'The generated accessors return the name and status supplied at construction.'],
      ['Map the current state', 'Switch covers both enum constants and supplies the READY label for this record.']],
    { members: `enum Status { READY, BLOCKED }
record Topic(String name, Status status) {}` },
  ),
  'java-pattern-matching': program(
    `Object result = new Retry("Review loops");
if (result instanceof Retry(String reason)) {
    String message = """
        Next step
        %s
        """;
    System.out.print(message.formatted(reason));
}`,
    'Next step\nReview loops',
    [['Create a record behind a broad type', 'The value is a Retry record even though the reference type is Object.'],
      ['Match and unpack', 'The record pattern checks the type and binds the reason component inside the branch.'],
      ['Format the text block', 'The text block supplies two lines. formatted substitutes the bound reason for %s.']],
    { members: 'record Retry(String reason) {}' },
  ),
  'java-reflection': program(
    `Class<Task> type = Task.class;
Tracked tracked = type.getAnnotation(Tracked.class);
System.out.println(tracked.value());`,
    'review',
    [['Make metadata visible', 'RUNTIME retention keeps the annotation available to reflection while the program runs.'],
      ['Annotate a known class', 'Task declares the Tracked annotation and supplies review as its value.'],
      ['Read the declared metadata', 'getAnnotation returns the annotation instance for this class. Reading value prints its configured text.']],
    { imports: ['java.lang.annotation.Retention', 'java.lang.annotation.RetentionPolicy'],
      members: `@Retention(RetentionPolicy.RUNTIME)
@interface Tracked { String value(); }
@Tracked("review") static class Task {}` },
  ),
};
