import { program as p } from './program.js';

export const dsaStructures = {
  'dsa-linked': p(
    `Node first = new Node(), second = new Node(), third = new Node();
first.next = second; second.next = third; third.next = second;
System.out.println(cycleEntry(first) == second);`,
    'true',
    [['Construct a known cycle', 'The last node points to the second. All nodes are distinct objects.'],
      ['Detect a meeting', 'The fast pointer advances twice for each slow step. A missing next link would return null.'],
      ['Find the entry', 'After a meeting, restart one pointer at the head and move both one step until they meet at the second node.']],
    { members: `static class Node { Node next; }
static Node cycleEntry(Node head) {
    Node slow = head, fast = head;
    do {
        if (fast == null || fast.next == null) return null;
        slow = slow.next;
        fast = fast.next.next;
    } while (slow != fast);
    for (slow = head; slow != fast; fast = fast.next) slow = slow.next;
    return slow;
}` },
  ),
  'dsa-lru': p(
    `var cache = new Cache();
cache.put("A", 1);
cache.put("B", 2);
cache.get("A");
cache.put("C", 3);
System.out.println(cache.keySet());`,
    '[A, C]',
    [['Configure access order', 'The LinkedHashMap subclass uses an access-ordered list and caps its size at two.'],
      ['Refresh A', 'get moves A to the recent end. B is now the oldest entry.'],
      ['Insert and evict', 'Adding C briefly grows the map past capacity. The eldest removable entry is B.']],
    { imports: ['java.util.LinkedHashMap', 'java.util.Map'], members: `static final class Cache extends LinkedHashMap<String, Integer> {
    Cache() { super(16, 0.75f, true); }
    @Override protected boolean removeEldestEntry(Map.Entry<String, Integer> eldest) {
        return size() > 2;
    }
}` },
  ),
  'dsa-stack-queue': p(
    `StudyQueue queue = new StudyQueue();
queue.add("Arrays");
queue.add("Trees");
System.out.println(queue.remove());
queue.add("Graphs");
System.out.println(queue.remove());
System.out.println(queue.remove());`,
    'Arrays\nTrees\nGraphs',
    [['Collect new tasks on one stack', 'add pushes onto incoming. Its newest entry is on top.'],
      ['Reverse only when needed', 'When outgoing is empty, transfer every incoming item. The oldest item becomes the next one to remove.'],
      ['Respect arrivals', 'Graphs waits in incoming until Trees has left outgoing. Each entry transfers at most once.']],
    { imports: ['java.util.ArrayDeque', 'java.util.Deque'], members: `static final class StudyQueue {
    private final Deque<String> incoming = new ArrayDeque<>();
    private final Deque<String> outgoing = new ArrayDeque<>();
    void add(String value) { incoming.push(value); }
    String remove() {
        if (outgoing.isEmpty()) while (!incoming.isEmpty()) outgoing.push(incoming.pop());
        return outgoing.poll();
    }
}` },
  ),
  'dsa-monotonic-stack': p(
    `int[] values = {70, 70, 72, 68};
int[] wait = new int[values.length];
Deque<Integer> pending = new ArrayDeque<>();
for (int i = 0; i < values.length; i++) {
    while (!pending.isEmpty() && values[i] > values[pending.peek()]) {
        int previous = pending.pop();
        wait[previous] = i - previous;
    }
    pending.push(i);
}
System.out.println(Arrays.toString(wait));`,
    '[2, 1, 0, 0]',
    [['Store unresolved positions', 'The stack needs indices so a result can express how far away the better value is.'],
      ['Pop on a strict improvement', 'Equal 70s stay unresolved. At 72 both earlier entries are popped and receive different distances.'],
      ['Leave unmatched results at zero', 'No higher value follows 72 or 68, so those answer slots keep their initial value.']],
    { imports: ['java.util.ArrayDeque', 'java.util.Arrays', 'java.util.Deque'] },
  ),
  'dsa-monotonic-deque': p(
    `int[] a = {4, 2, 4, 1, 3};
int k = 3;
Deque<Integer> q = new ArrayDeque<>();
List<Integer> maximums = new ArrayList<>();
for (int i = 0; i < a.length; i++) {
    while (!q.isEmpty() && q.peekFirst() <= i - k) q.removeFirst();
    while (!q.isEmpty() && a[q.peekLast()] <= a[i]) q.removeLast();
    q.addLast(i);
    if (i >= k - 1) maximums.add(a[q.peekFirst()]);
}
System.out.println(maximums);`,
    '[4, 4, 4]',
    [['Remove expired positions', 'The front test discards candidates outside the current width-three window.'],
      ['Drop dominated candidates', 'A later equal or larger value stays valid longer, so it replaces earlier smaller or equal items at the back.'],
      ['Read the front', 'Once the first full window exists, the largest retained value is always at the front.']],
    { imports: ['java.util.ArrayDeque', 'java.util.ArrayList', 'java.util.Deque', 'java.util.List'] },
  ),
  'dsa-traversals': p(
    `Node root = new Node(7, new Node(3, null, null), new Node(9, null, null));
Deque<Node> q = new ArrayDeque<>();
q.add(root);
while (!q.isEmpty()) {
    int layerSize = q.size();
    List<Integer> level = new ArrayList<>();
    for (int i = 0; i < layerSize; i++) {
        Node node = q.remove();
        level.add(node.value());
        if (node.left() != null) q.add(node.left());
        if (node.right() != null) q.add(node.right());
    }
    System.out.println(level);
}`,
    '[7]\n[3, 9]',
    [['Seed the queue with the root', 'The first layer starts with one node and no null entries.'],
      ['Freeze the current layer size', 'Children added while processing the root belong to the next iteration, so the inner loop uses the size measured before adding them.'],
      ['Print each completed layer', 'The first output holds 7. Its children appear together on the second line.']],
    { imports: ['java.util.ArrayDeque', 'java.util.ArrayList', 'java.util.Deque', 'java.util.List'],
      members: 'record Node(int value, Node left, Node right) {}' },
  ),
  'dsa-bst': p(
    `Node root = new Node(10, new Node(6, null, new Node(12, null, null)), null);
System.out.println(valid(root, Long.MIN_VALUE, Long.MAX_VALUE));`,
    'false',
    [['Start with wide limits', 'Long bounds include every possible int key, even the two int extremes.'],
      ['Narrow the inherited range', 'Moving left of 10 makes 10 the exclusive upper limit. Moving right of 6 also makes 6 the lower limit.'],
      ['Find the deep violation', 'The value 12 is greater than 6 but violates the bound from 10. The whole tree is rejected.']],
    { members: `record Node(int value, Node left, Node right) {}
static boolean valid(Node node, long low, long high) {
    if (node == null) return true;
    return low < node.value() && node.value() < high
        && valid(node.left(), low, node.value())
        && valid(node.right(), node.value(), high);
}` },
  ),
  'dsa-tree-ancestors': p(
    `int[][] up = {{-1, 0, 1, 2, 3}, new int[5], new int[5]};
for (int bit = 1; bit < up.length; bit++) {
    for (int v = 0; v < up[0].length; v++) {
        int half = up[bit - 1][v];
        up[bit][v] = half < 0 ? -1 : up[bit - 1][half];
    }
}
int node = 4, distance = 3;
for (int bit = up.length - 1; bit >= 0 && node >= 0; bit--) {
    if ((distance & (1 << bit)) != 0) node = up[bit][node];
}
System.out.println(node);`,
    '1',
    [['Store immediate ancestors', 'Row zero gives the direct parent. Node zero has none and uses -1.'],
      ['Build longer jumps', 'A jump of length 2^bit combines two jumps of the previous length, if the intermediate ancestor exists.'],
      ['Apply the query bits', 'Distance three combines jumps of two and one, moving node four to node one.']],
  ),
  'dsa-priority': p(
    `PriorityQueue<Integer> lower = new PriorityQueue<>(Comparator.reverseOrder());
PriorityQueue<Integer> upper = new PriorityQueue<>();
for (int value : new int[] {6, 1, 9, 4}) {
    lower.add(value);
    upper.add(lower.remove());
    if (upper.size() > lower.size()) lower.add(upper.remove());
    double median = lower.size() == upper.size()
        ? ((long) lower.peek() + upper.peek()) / 2.0 : lower.peek();
    System.out.println(median);
}`,
    '6.0\n3.5\n6.0\n5.0',
    [['Split values between two heaps', 'lower exposes the largest of the lower half. upper exposes the smallest of the upper half.'],
      ['Insert and rebalance', 'Move the largest lower value across, then move the smallest upper value back if upper has too many items.'],
      ['Read the middle', 'Use lower’s head for an odd count and a widened average of both heads for an even count.']],
    { imports: ['java.util.Comparator', 'java.util.PriorityQueue'] },
  ),
  'dsa-trie': p(
    `Node root = new Node();
Node node = root;
for (int symbol : "graph".codePoints().toArray()) {
    node = node.children.computeIfAbsent(symbol, ignored -> new Node());
}
node.terminal = true;
Node prefix = find(root, "gra");
System.out.println("Prefix: " + (prefix != null) + ", word: " + (prefix != null && prefix.terminal));`,
    'Prefix: true, word: false',
    [['Build one edge per code point', 'The child map reuses an existing edge when another word has the same prefix.'],
      ['Mark only whole words', 'The finished path for graph has terminal set. Shorter prefixes are ordinary nodes.'],
      ['Check a lookup', 'The node for gra exists, which proves prefix membership. Its terminal marker is false.']],
    { imports: ['java.util.HashMap', 'java.util.Map'], members: `static final class Node {
    final Map<Integer, Node> children = new HashMap<>();
    boolean terminal;
}
static Node find(Node node, String text) {
    for (int symbol : text.codePoints().toArray()) {
        node = node.children.get(symbol);
        if (node == null) break;
    }
    return node;
}` },
  ),
};
