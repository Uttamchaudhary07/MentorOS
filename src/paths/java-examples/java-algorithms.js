import { program as p } from './program.js';
import { dsaGraphs } from './dsa-graphs.js';
import { dsaOptimization } from './dsa-optimization.js';

export const javaAlgorithms = {
  'java-complexity': p(`int[] values = {7, 2, 9, 4, 1};
boolean foundByScan = false;
for (int value : values) if (value == 4) { foundByScan = true; break; }
int[] sorted = values.clone();
Arrays.sort(sorted);
boolean foundBySearch = Arrays.binarySearch(sorted, 4) >= 0;
System.out.println("Scan: " + foundByScan + ", sorted search: " + foundBySearch);
System.out.println("Original: " + Arrays.toString(values));`,
    'Scan: true, sorted search: true\nOriginal: [7, 2, 9, 4, 1]',
    [['Run the simple scan', 'The first approach needs no preparation and can stop as soon as four is seen.'],
      ['Build a reusable sorted copy', 'Sorting belongs in the cost and uses a copy here to preserve the input.'],
      ['Run a logarithmic query', 'Arrays.binarySearch returns a nonnegative index on a match. The preparation is most useful when many queries reuse the copy.']],
    { imports: ['java.util.Arrays'] }),
  'java-sort': p(`var topics = new ArrayList<>(List.of(new Topic("graphs", 3), new Topic("loops", 1), new Topic("arrays", 1)));
topics.sort(Comparator.comparingInt(Topic::difficulty).thenComparing(Topic::id));
System.out.println(topics.stream().map(Topic::id).toList());`,
    '[arrays, loops, graphs]',
    [['Declare both sort keys', 'Difficulty is primary. The ID makes ordering explicit when difficulty ties.'],
      ['Apply the comparator', 'comparingInt compares the numeric key directly without subtracting and risking overflow.'],
      ['Inspect the tie', 'Arrays sorts before loops because both have difficulty one. Graphs follows because it has difficulty three.']],
    { imports: ['java.util.ArrayList', 'java.util.Comparator', 'java.util.List'], members: 'record Topic(String id, int difficulty) {}' }),
  'java-search': p(`int[] sorted = {3, 6, 8, 11, 14, 17, 21};
System.out.println("17 is at index " + indexOf(sorted, 17));
System.out.println("Missing value: " + indexOf(sorted, 10));`,
    '17 is at index 5\nMissing value: -1',
    [['Start with every possible index', 'low and high are inclusive. The midpoint calculation avoids adding the endpoints directly.'],
      ['Discard the impossible half', 'When the midpoint value is below the target, every value to the left is too small. A greater midpoint discards the right half.'],
      ['Stop on either outcome', 'Equality returns an index. If low becomes greater than high, the range is empty and the method returns -1.']],
    { members: `static int indexOf(int[] a, int target) {
    int low = 0, high = a.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == target) return mid;
        if (a[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}` }),
  'java-prefix': p(`int[] values = {5, -2, 4, 3};
long[] prefix = new long[values.length + 1];
for (int i = 0; i < values.length; i++) prefix[i + 1] = prefix[i] + values[i];
System.out.println(prefix[3] - prefix[1]);
System.out.println(prefix[2] - prefix[0]);`,
    '2\n3',
    [['Reserve a zero prefix', 'prefix[0] is the sum of zero elements. The array has an extra slot for it.'],
      ['Build one running total per prefix', 'At each index add the current value to the total before it. long gives extra room for accumulated int values.'],
      ['Subtract past the left boundary', 'prefix[3] minus prefix[1] keeps indices one and two. The same formula handles a range starting at zero.']]),
  'java-stack': p(`Deque<Character> opens = new ArrayDeque<>();
String input = "(()())";
boolean valid = true;
for (char token : input.toCharArray()) {
    if (token == '(') opens.push(token);
    else if (opens.poll() == null) { valid = false; break; }
}
System.out.println(valid && opens.isEmpty());`,
    'true',
    [['Push each unmatched opening token', 'The head of the deque serves as the top of the stack.'],
      ['Match each closing token', 'poll removes the newest opening token; null indicates an unmatched closing token. This example’s alphabet contains only parentheses.'],
      ['Inspect the final stack', 'A valid sequence must never close early and must leave no opening tokens behind.']],
    { imports: ['java.util.ArrayDeque', 'java.util.Deque'] }),
  'java-linked': p(`Node current = new Node(1, new Node(2, new Node(3, null)));
Node previous = null;
while (current != null) {
    Node savedNext = current.next;
    current.next = previous;
    previous = current;
    current = savedNext;
}
List<Integer> reversed = new ArrayList<>();
for (Node item = previous; item != null; item = item.next) reversed.add(item.value);
System.out.println(reversed);`,
    '[3, 2, 1]',
    [['Begin with an empty reversed prefix', 'previous starts at null and will become the head of the rewired portion.'],
      ['Protect the rest of the original list', 'Save current.next before changing it. The saved pointer keeps the unprocessed suffix reachable.'],
      ['Advance both references', 'After redirecting current to previous, grow the reversed prefix. Traversing the final prefix prints reverse order.']],
    { imports: ['java.util.ArrayList', 'java.util.List'], members: `static class Node {
    int value;
    Node next;
    Node(int value, Node next) { this.value = value; this.next = next; }
}` }),
  'java-heaps': p(`PriorityQueue<Integer> top = new PriorityQueue<>();
int k = 3;
for (int value : new int[] {5, 1, 9, 3, 7}) {
    top.add(value);
    if (top.size() > k) top.remove();
}
System.out.println("Third largest: " + top.element());`,
    'Third largest: 5',
    [['Keep just the largest three', 'The priority queue is a min-heap. Its head is the smallest retained candidate.'],
      ['Evict on overflow', 'Every insertion that grows the heap above k removes its smallest item, leaving the largest k seen so far.'],
      ['Read the threshold', 'The smallest among 5, 7, and 9 is the third largest overall.']],
    { imports: ['java.util.PriorityQueue'] }),
  'java-trees': p(`Node root = new Node(new Node(null, null), new Node(new Node(null, null), null));
System.out.println(depth(root));`,
    '3',
    [['Choose the base case', 'A missing child has depth zero and stops recursion.'],
      ['Reuse smaller answers', 'Compute the left and right depths, use the larger, then count the current node.'],
      ['Read the answer at the root', 'The longest branch contains root, its right child, and the nested child, so depth is three.']],
    { members: `record Node(Node left, Node right) {}
static int depth(Node node) {
    if (node == null) return 0;
    return 1 + Math.max(depth(node.left()), depth(node.right()));
}` }),
  'java-graphs': dsaGraphs['dsa-graph-model'],
  'java-weighted': dsaGraphs['dsa-dijkstra'],
  'java-union': dsaGraphs['dsa-unionfind'],
  'java-greedy': p(`int[][] intervals = {{4, 7}, {1, 4}, {2, 3}, {9, 10}};
Arrays.sort(intervals, Comparator.comparingInt(range -> range[0]));
List<String> merged = new ArrayList<>();
int start = intervals[0][0], end = intervals[0][1];
for (int i = 1; i < intervals.length; i++) {
    int[] next = intervals[i];
    if (next[0] <= end) end = Math.max(end, next[1]);
    else { merged.add(start + "-" + end); start = next[0]; end = next[1]; }
}
merged.add(start + "-" + end);
System.out.println(merged);`,
    '[1-7, 9-10]',
    [['Sort by start', 'Every later interval starts no earlier than the one being examined. This example merges intervals that touch.'],
      ['Expand an overlapping range', 'Use the maximum end so a contained interval cannot shorten the merged range.'],
      ['Flush when a gap appears', 'After the interval starting at nine, no future interval can close that earlier gap. Emit the last active range after the loop.']],
    { imports: ['java.util.ArrayList', 'java.util.Arrays', 'java.util.Comparator', 'java.util.List'] }),
  'java-backtracking': dsaOptimization['dsa-backtrack'],
  'java-dp': p(`System.out.println(ways(5));`,
    '8',
    [['Define two base cases', 'There is one way to stand at step zero and one way to reach step one.'],
      ['Build one step at a time', 'A final move of length one or two comes from a different earlier step. Add those two counts.'],
      ['Store only what is needed', 'After each update, move the two amounts forward. Only two previous values are needed to reach the fifth step.']],
    { members: `static long ways(int n) {
    if (n < 0 || n > 91) throw new IllegalArgumentException("Use an input from 0 to 91");
    long previous = 1, current = 1;
    for (int step = 2; step <= n; step++) {
        long next = previous + current;
        previous = current;
        current = next;
    }
    return current;
}` }),
  'java-project': p(`Instant now = Instant.parse("2026-04-02T09:00:00Z");
PriorityQueue<Review> queue = new PriorityQueue<>(Comparator.comparing(Review::due).thenComparing(Review::id));
queue.add(new Review("loops", now.plusSeconds(60)));
queue.add(new Review("arrays", now));
queue.add(new Review("graphs", now));
while (!queue.isEmpty() && !queue.element().due().isAfter(now)) {
    System.out.println(queue.remove().id());
}`,
    'arrays\ngraphs',
    [['Use a fixed clock value', 'The exact instant is data, so repeated runs evaluate the same schedule.'],
      ['Order the pending reviews', 'The priority queue uses due time first and ID as a stable secondary decision.'],
      ['Process all due entries', 'The comparison includes reviews due exactly now. Loops stays queued because it is due a minute later.']],
    { imports: ['java.time.Instant', 'java.util.Comparator', 'java.util.PriorityQueue'], members: 'record Review(String id, Instant due) {}' }),
};
