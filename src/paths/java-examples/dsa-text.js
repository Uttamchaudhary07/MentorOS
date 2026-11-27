import { program as p } from './program.js';

export const dsaText = {
  'dsa-kmp': p(`String pattern = "aba", text = "xxababa";
int[] prefix = new int[pattern.length()];
for (int i = 1, j = 0; i < pattern.length(); i++) {
    while (j > 0 && pattern.charAt(i) != pattern.charAt(j)) j = prefix[j - 1];
    if (pattern.charAt(i) == pattern.charAt(j)) j++;
    prefix[i] = j;
}
for (int i = 0, j = 0; i < text.length(); i++) {
    while (j > 0 && text.charAt(i) != pattern.charAt(j)) j = prefix[j - 1];
    if (text.charAt(i) == pattern.charAt(j)) j++;
    if (j == pattern.length()) {
        System.out.println(i - j + 1);
        j = prefix[j - 1];
    }
}`,
    '2\n4',
    [['Build the prefix table', 'Each position stores the longest proper prefix ending at that pattern position.'],
      ['Reuse a border on mismatch', 'As text advances, j falls back through prefix lengths instead of rewinding the text pointer.'],
      ['Keep overlapping matches', 'After reporting a match, restore the reusable border. This finds both starts at indices two and four.']]),
  'dsa-z-hash': p(`String text = "study study";
long[] prefix = new long[text.length() + 1], power = new long[text.length() + 1];
power[0] = 1;
for (int i = 0; i < text.length(); i++) {
    prefix[i + 1] = (prefix[i] * 257 + text.charAt(i)) % MOD;
    power[i + 1] = power[i] * 257 % MOD;
}
boolean likely = hash(prefix, power, 0, 5) == hash(prefix, power, 6, 11);
System.out.println(likely && text.regionMatches(0, text, 6, 5));`,
    'true',
    [['Build prefix summaries and powers', 'Each character extends the rolling value by multiplying by the base and adding a new code unit.'],
      ['Remove the earlier prefix', 'The helper shifts the earlier prefix to the right length and subtracts it under the modulus.'],
      ['Verify the match', 'Equal hashes only identify a candidate. regionMatches checks the five actual characters.']],
    { members: `static final long MOD = 1_000_000_007L;
static long hash(long[] prefix, long[] power, int from, int to) {
    return Math.floorMod(prefix[to] - prefix[from] * power[to - from], MOD);
}` }),
  'dsa-palindromes': p(`String text = "cabbad";
String best = "";
for (int i = 0; i < text.length(); i++) {
    String odd = expand(text, i, i), even = expand(text, i, i + 1);
    if (odd.length() > best.length()) best = odd;
    if (even.length() > best.length()) best = even;
}
System.out.println(best);`,
    'abba',
    [['Consider two centers', 'An odd palindrome starts at one character. An even palindrome starts between two.'],
      ['Expand while both sides agree', 'The loop checks bounds and equality before expanding one more step.'],
      ['Exclude the failed outer pair', 'The returned half-open substring starts at left + 1 and ends at right. Keeping the longest yields abba.']],
    { members: `static String expand(String text, int l, int r) {
    while (l >= 0 && r < text.length() && text.charAt(l) == text.charAt(r)) { l--; r++; }
    return text.substring(l + 1, r);
}` }),
  'dsa-automata': p(`Node root = new Node();
root.fail = root;
for (String pattern : List.of("he", "she")) {
    Node node = root;
    for (char c : pattern.toCharArray()) node = node.next.computeIfAbsent(c, ignored -> new Node());
    node.matches.add(pattern);
}
ArrayDeque<Node> queue = new ArrayDeque<>();
for (Node node : root.next.values()) { node.fail = root; queue.add(node); }
while (!queue.isEmpty()) {
    Node parent = queue.remove();
    for (var edge : parent.next.entrySet()) {
        char c = edge.getKey();
        Node child = edge.getValue();
        Node suffix = parent.fail;
        while (suffix != root && !suffix.next.containsKey(c)) suffix = suffix.fail;
        child.fail = suffix.next.getOrDefault(c, root);
        child.matches.addAll(child.fail.matches);
        queue.add(child);
    }
}
Node state = root;
for (char c : "she".toCharArray()) {
    while (state != root && !state.next.containsKey(c)) state = state.fail;
    state = state.next.getOrDefault(c, root);
    for (String match : state.matches) System.out.println(match);
}`,
    'she\nhe',
    [['Build a trie of patterns', 'The two words share scanning infrastructure. Pattern endpoints record what was matched.'],
      ['Build failure and output links', 'Breadth-first order lets a child reuse its parent’s fallback. It also inherits matches of the best suffix, such as he inside she.'],
      ['Scan the text once', 'Use fallback links when a direct transition is missing. Report both matches at the final character.']],
    { imports: ['java.util.ArrayDeque', 'java.util.ArrayList', 'java.util.HashMap', 'java.util.List', 'java.util.Map'],
      members: `static class Node {
    Map<Character, Node> next = new HashMap<>();
    List<String> matches = new ArrayList<>();
    Node fail;
}` }),
  'dsa-fenwick': p(`add(1, 5);
add(2, 2);
add(3, 4);
System.out.println(prefix(3) - prefix(1));
add(2, -1);
System.out.println(prefix(3) - prefix(1));`,
    '6\n5',
    [['Store values at one-based indices', 'The three additions assign positions one through three. Zero is reserved for the prefix base.'],
      ['Jump by the low bit', 'Updates visit every aggregate containing the position. Queries jump back through disjoint contributing intervals.'],
      ['Subtract to get a range', 'Subtracting prefix one isolates positions two and three. The later update reduces their sum from six to five.']],
    { members: `static final long[] tree = new long[4];
static void add(int i, long delta) {
    for (; i < tree.length; i += i & -i) tree[i] += delta;
}
static long prefix(int i) {
    long total = 0;
    for (; i > 0; i -= i & -i) total += tree[i];
    return total;
}` }),
  'dsa-segment': p(`add(1, 0, 3, 0, 3, 2);
add(1, 0, 3, 1, 2, 1);
System.out.println(query(1, 0, 3, 1, 3));`,
    '8',
    [['Start with an implicit zero array', 'The root represents indices zero through three. An update over the whole range changes its total and leaves a pending addition.'],
      ['Push before touching children', 'A partial update needs both child aggregates to reflect the parent’s accumulated addition.'],
      ['Combine the requested range', 'Fully covered nodes return their stored sums. Outside nodes contribute zero. After both edits the final three values are 3, 3, and 2.']],
    { members: `static final long[] sum = new long[16], lazy = new long[16];
static void apply(int node, int l, int r, long delta) {
    sum[node] += (r - l + 1L) * delta;
    lazy[node] += delta;
}
static void push(int node, int l, int mid, int r) {
    apply(node * 2, l, mid, lazy[node]);
    apply(node * 2 + 1, mid + 1, r, lazy[node]);
    lazy[node] = 0;
}
static void add(int node, int l, int r, int a, int b, long delta) {
    if (b < l || a > r) return;
    if (a <= l && r <= b) { apply(node, l, r, delta); return; }
    int mid = (l + r) / 2;
    push(node, l, mid, r);
    add(node * 2, l, mid, a, b, delta);
    add(node * 2 + 1, mid + 1, r, a, b, delta);
    sum[node] = sum[node * 2] + sum[node * 2 + 1];
}
static long query(int node, int l, int r, int a, int b) {
    if (b < l || a > r) return 0;
    if (a <= l && r <= b) return sum[node];
    int mid = (l + r) / 2;
    push(node, l, mid, r);
    return query(node * 2, l, mid, a, b) + query(node * 2 + 1, mid + 1, r, a, b);
}` }),
  'dsa-bit': p(`int answer = 0;
for (int value : new int[] {6, 2, 6, 7, 2}) answer ^= value;
System.out.println(answer);
int mask = 0b10110;
for (int bits = mask; bits != 0; bits &= bits - 1) {
    System.out.println(Integer.numberOfTrailingZeros(bits));
}`,
    '7\n1\n2\n4',
    [['Cancel equal pairs', 'XOR of a value with itself is zero. With exactly one singleton, that singleton remains.'],
      ['Read the lowest set bit', 'The trailing-zero count gives its zero-based position.'],
      ['Clear and repeat', 'AND with one less clears the lowest remaining bit. The loop stops when no flags are set.']]),
  'dsa-number-theory': p(`int n = 12;
boolean[] composite = new boolean[n + 1];
for (int p = 2; p <= n / p; p++) {
    if (!composite[p]) for (long m = (long) p * p; m <= n; m += p) composite[(int) m] = true;
}
List<Integer> primes = new ArrayList<>();
for (int i = 2; i <= n; i++) if (!composite[i]) primes.add(i);
System.out.println(primes);`,
    '[2, 3, 5, 7, 11]',
    [['Start with possible primes', 'The scan begins at two because zero and one are outside the prime definition.'],
      ['Mark multiples from the square', 'Smaller multiples were handled by a smaller factor. The division bound avoids overflow in the loop test.'],
      ['Collect unmarked values', 'Every composite up to twelve has a factor that marked it. The remaining values are the primes.']],
    { imports: ['java.util.ArrayList', 'java.util.List'] }),
  'dsa-mod-combinations': p(`long modulus = 13;
long result = power(5, 11, modulus);
long inverse = power(5, modulus - 2, modulus);
System.out.println(result);
System.out.println(5 * inverse % modulus);`,
    '8\n1',
    [['Process the exponent by bits', 'An odd exponent contributes the current base to the answer, then the loop squares the base and halves the exponent.'],
      ['Reuse modular power for an inverse', 'The modulus is prime and five is nonzero modulo 13, so Fermat’s theorem supplies exponent 11 for the inverse.'],
      ['Verify the identity', 'The power is eight. Multiplying five by eight gives one modulo 13.']],
    { members: `static long power(long base, long exponent, long mod) {
    long result = 1 % mod;
    while (exponent > 0) {
        if ((exponent & 1) != 0) result = result * base % mod;
        base = base * base % mod;
        exponent >>= 1;
    }
    return result;
}`, details: 'The demo uses a small modulus and nonnegative inputs so every product fits in long.' }),
};
