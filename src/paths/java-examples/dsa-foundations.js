import { program as p } from './program.js';

export const dsaFoundations = {
  'dsa-cost': p(
    `int size = 16;
int linear = 0, doubling = 0;
for (int i = 0; i < size; i++) linear++;
for (long i = 1; i < size; i *= 2) doubling++;
System.out.println("Scan: " + linear + ", doubling: " + doubling);`,
    'Scan: 16, doubling: 4',
    [['Choose a common input', 'Both loops use the same size so their iteration counts can be compared.'],
      ['Count linear work', 'The first loop visits every index from zero to 15.'],
      ['Count logarithmic work', 'The second loop visits 1, 2, 4, and 8. Each pass doubles its counter rather than adding one.']],
  ),
  'dsa-arrays': p(
    `int[] values = {0, 4, 0, 6};
int write = 0;
for (int value : values) {
    if (value != 0) values[write++] = value;
}
Arrays.fill(values, write, values.length, 0);
System.out.println(Arrays.toString(values));`,
    '[4, 6, 0, 0]',
    [['Start the output at zero', 'write marks the next free slot for a value that should be kept.'],
      ['Compact while scanning', 'Each nonzero value moves to write, then write advances. It never overwrites a future unread slot.'],
      ['Clean the unused suffix', 'After writing 4 and 6, fill replaces the remaining elements with zeros.']],
    { imports: ['java.util.Arrays'] },
  ),
  'dsa-frequencies': p(
    `System.out.println(Arrays.toString(twoSum(new int[] {3, 3, 7}, 6)));`,
    '[0, 1]',
    [['Define the answer as indices', 'The repeated value needs two different positions, so the map records values and their earlier indices.'],
      ['Check the complement first', 'At index zero no earlier 3 exists. At index one the map already contains index zero.'],
      ['Return the pair', 'The distinct indices solve the target. An empty array represents no matching pair.']],
    { imports: ['java.util.Arrays', 'java.util.HashMap', 'java.util.Map'],
      members: `static int[] twoSum(int[] values, int target) {
    Map<Long, Integer> seen = new HashMap<>();
    for (int i = 0; i < values.length; i++) {
        Integer prior = seen.get((long) target - values[i]);
        if (prior != null) return new int[] {prior, i};
        seen.put((long) values[i], i);
    }
    return new int[0];
}` },
  ),
  'dsa-two-pointers': p(
    `System.out.println(Arrays.toString(findPair(new int[] {1, 4, 6, 9}, 10)));`,
    '[0, 3]',
    [['Start outside', 'The endpoints form the widest possible remaining pair in the sorted array.'],
      ['Use the comparison', 'If the sum were too small, every pair using the left value would be too small. The too-large case similarly discards the right.'],
      ['Return distinct positions', 'The first pair sums to ten for this input. The left < right condition rules out using one element twice.']],
    { imports: ['java.util.Arrays'],
      members: `static int[] findPair(int[] a, int target) {
    int left = 0, right = a.length - 1;
    while (left < right) {
        long sum = (long) a[left] + a[right];
        if (sum == target) return new int[] {left, right};
        if (sum < target) left++; else right--;
    }
    return new int[0];
}` },
  ),
  'dsa-sliding': p(
    `String text = "abca";
Set<Character> window = new HashSet<>();
int best = 0, left = 0;
for (int right = 0; right < text.length(); right++) {
    char symbol = text.charAt(right);
    while (!window.add(symbol)) window.remove(text.charAt(left++));
    best = Math.max(best, right - left + 1);
}
System.out.println(best);`,
    '3',
    [['Track window membership', 'The set contains the UTF-16 characters currently between left and right.'],
      ['Restore uniqueness', 'The final a conflicts with the first a. Move left and remove the old occurrence before keeping the new one.'],
      ['Record a valid answer', 'Both abc and bca give length three. Update the maximum only after the window is valid.']],
    { imports: ['java.util.HashSet', 'java.util.Set'] },
  ),
  'dsa-prefix-difference': p(
    `int length = 5;
long[] diff = new long[length + 1];
add(diff, 1, 4, 3);
add(diff, 2, 5, -1);
for (int i = 1; i < length; i++) diff[i] += diff[i - 1];
System.out.println(Arrays.toString(Arrays.copyOf(diff, length)));`,
    '[0, 3, 2, 2, -1]',
    [['Record each range as endpoints', 'The first operation adds three from index 1 up to but excluding 4. The second subtracts one from indices 2 through 4.'],
      ['Leave room for cancellation', 'Index length is a valid location for an update stop because diff has one extra element.'],
      ['Rebuild with a running sum', 'Each index accumulates effects that started and have yet to be cancelled. The extra checkpoint slot is omitted from the output.']],
    { imports: ['java.util.Arrays'], members: `static void add(long[] diff, int left, int end, long amount) {
    diff[left] += amount;
    diff[end] -= amount;
}` },
  ),
  'dsa-sorting': p(
    `int[] a = {5, 2, 2, 4, 1};
for (int i = 1; i < a.length; i++) {
    int key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        j--;
    }
    a[j + 1] = key;
}
System.out.println(Arrays.toString(a));`,
    '[1, 2, 2, 4, 5]',
    [['Keep a sorted prefix', 'The first item is already a sorted prefix of length one. Save the next item as key.'],
      ['Make room for the key', 'Shift larger items to the right until the insertion position is free. The strict comparison preserves equal-key order.'],
      ['Extend the prefix', 'Write key in the gap. Repeat until the sorted prefix covers every item.']],
    { imports: ['java.util.Arrays'] },
  ),
  'dsa-noncomparison': p(
    `int[] input = {2, -1, 0, 2};
int min = -1, max = 2;
int[] counts = new int[max - min + 1];
for (int value : input) counts[value - min]++;
int write = 0;
for (int offset = 0; offset < counts.length; offset++) {
    for (int i = 0; i < counts[offset]; i++) input[write++] = min + offset;
}
System.out.println(Arrays.toString(input));`,
    '[-1, 0, 2, 2]',
    [['Set a small known range', 'The offset value - min moves the minimum value to array index zero.'],
      ['Count without comparisons', 'Each input increments the corresponding bucket. Value 2 increments its bucket twice.'],
      ['Emit ordered values', 'Reading offsets in ascending order and repeating each count reconstructs the sorted result.']],
    { imports: ['java.util.Arrays'] },
  ),
  'dsa-bounds': p(
    `int[] values = {1, 3, 3, 3, 7};
int first = bound(values, 3, false);
int end = bound(values, 3, true);
System.out.println("Equal range: [" + first + ", " + end + ")");`,
    'Equal range: [1, 4)',
    [['Use half-open bounds', 'high starts at the array length. low can reach that length without reading beyond the array.'],
      ['Choose which side is too early', 'Lower bound discards only values strictly below key. Upper bound also discards equal values.'],
      ['Read the equal range', 'The first 3 is at index one and the first larger value at index four, so all equal items lie between them.']],
    { members: `static int bound(int[] a, int key, boolean upper) {
    int low = 0, high = a.length;
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (a[mid] < key || (upper && a[mid] == key)) low = mid + 1;
        else high = mid;
    }
    return low;
}` },
  ),
  'dsa-search-answer': p(
    `int[] piles = {3, 6, 7, 11};
int low = 1, high = 11;
while (low < high) {
    int mid = low + (high - low) / 2;
    if (finishes(piles, mid, 8)) high = mid;
    else low = mid + 1;
}
System.out.println(low);`,
    '4',
    [['Define speed bounds', 'One is the smallest candidate and the largest pile fits in one hour at speed eleven.'],
      ['Check monotone feasibility', 'The helper rounds each pile’s division up. A faster rate can only reduce the hours needed.'],
      ['Keep the first feasible rate', 'If mid works it is still a candidate. Otherwise the entire lower half is too slow.']],
    { members: `static boolean finishes(int[] piles, int speed, int hours) {
    long used = 0;
    for (int pile : piles) used += (pile + (long) speed - 1) / speed;
    return used <= hours;
}` },
  ),
  'dsa-recursive-split': p(
    `int[] values = {7, 1, 4, 2, 9};
System.out.println(select(values, 2));`,
    '4',
    [['Request a zero-based rank', 'Index two in sorted order is the third smallest value. select can modify the input during partitioning.'],
      ['Partition the active range', 'Choose the value at high as pivot, move smaller values left, and place the pivot at its final position.'],
      ['Discard an irrelevant side', 'Only the side containing rank is needed. When rank equals the pivot index, its value is the answer.']],
    { members: `static int select(int[] a, int rank) {
    if (rank < 0 || rank >= a.length) throw new IllegalArgumentException("rank");
    int low = 0, high = a.length - 1;
    while (true) {
        int next = low;
        for (int i = low; i < high; i++) if (a[i] < a[high]) swap(a, next++, i);
        swap(a, next, high);
        if (next == rank) return a[next];
        if (next < rank) low = next + 1; else high = next - 1;
    }
}
static void swap(int[] a, int i, int j) {
    int value = a[i]; a[i] = a[j]; a[j] = value;
}` },
  ),
};
