import { program as p } from './program.js';

export const dsaSpecialized = {
  'dsa-rotated': p(`System.out.println(search(new int[] {7, 9, 12, 1, 3, 5}, 3));`,
    '4',
    [['Start with an inclusive range', 'The array was sorted and rotated, and all keys are distinct.'],
      ['Identify a sorted side at each midpoint', 'If the left edge is no larger than the midpoint, the left side is sorted. Otherwise use the right side.'],
      ['Keep the side that could contain the target', 'Endpoint comparisons choose which bound to move. Mid is excluded after a mismatch, and the target is found at index four.']],
    { members: `static int search(int[] a, int target) {
    int low = 0, high = a.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (a[mid] == target) return mid;
        if (a[low] <= a[mid]) {
            if (a[low] <= target && target < a[mid]) high = mid - 1;
            else low = mid + 1;
        } else {
            if (a[mid] < target && target <= a[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}` }),
  'dsa-tree-digit-dp': p(`int[] digits = {2, 7};
long[][] memo = new long[digits.length][2];
for (long[] row : memo) Arrays.fill(row, -1);
System.out.println(count(digits, 0, true, memo));`,
    '25',
    [['Encode the upper bound', 'The sample counts integers from zero through 27 without digit 3. Leading zero merely pads a shorter number.'],
      ['Carry prefix tightness', 'An equal chosen prefix keeps the next digit restricted by the bound. A smaller prefix allows any digit except 3.'],
      ['Cache equivalent suffix work', 'Whatever came before is irrelevant once position and tightness match. The base case contributes one completed number.']],
    { imports: ['java.util.Arrays'], members: `static long count(int[] digits, int pos, boolean tight, long[][] memo) {
    if (pos == digits.length) return 1;
    int state = tight ? 1 : 0;
    if (memo[pos][state] != -1) return memo[pos][state];
    int limit = tight ? digits[pos] : 9;
    long total = 0;
    for (int digit = 0; digit <= limit; digit++) {
        if (digit != 3) total += count(digits, pos + 1, tight && digit == limit, memo);
    }
    return memo[pos][state] = total;
}` }),
  'dsa-geometry': p(`Point[] points = {new Point(0, 0), new Point(1, 1), new Point(2, 0),
    new Point(2, 2), new Point(0, 2)};
Arrays.sort(points, Comparator.comparingInt(Point::x).thenComparingInt(Point::y));
List<Point> lower = chain(Arrays.asList(points));
List<Point> upper = chain(Arrays.asList(points).reversed());
lower.removeLast();
upper.removeLast();
lower.addAll(upper);
System.out.println(lower);`,
    '[Point[x=0, y=0], Point[x=2, y=0], Point[x=2, y=2], Point[x=0, y=2]]',
    [['Order by both coordinates', 'The sample has distinct points and uses one scan in each direction to form the lower and upper chains.'],
      ['Drop turns that are inside the boundary', 'A cross product of zero or less makes the middle point redundant for this policy. Collinear intermediate points are omitted.'],
      ['Join both chains', 'Remove the repeated last point from each chain before concatenating them. The interior point (1, 1) is excluded.']],
    { imports: ['java.util.ArrayList', 'java.util.Arrays', 'java.util.Comparator', 'java.util.List'], members: `record Point(int x, int y) {}
static List<Point> chain(List<Point> points) {
    List<Point> result = new ArrayList<>();
    for (Point next : points) {
        while (result.size() >= 2 && turn(result.get(result.size() - 2), result.getLast(), next) <= 0) {
            result.removeLast();
        }
        result.add(next);
    }
    return result;
}
static long turn(Point a, Point b, Point c) {
    return ((long) b.x() - a.x()) * ((long) c.y() - a.y())
        - ((long) b.y() - a.y()) * ((long) c.x() - a.x());
}`, details: 'The sample coordinates are small enough that coordinate products fit in long.' }),
  'dsa-randomized': p(`Random random = new Random(7);
List<String> stream = List.of("A", "B", "C", "D");
String selected = null;
int count = 0;
for (String value : stream) {
    if (random.nextInt(++count) == 0) selected = value;
}
System.out.println("Selected a stream item: " + stream.contains(selected));`,
    'Selected a stream item: true',
    [['Store one candidate', 'Only the count and current selection are needed during the scan. The first item must be selected.'],
      ['Give each newcomer a fair chance', 'With count items seen, nextInt(count) returns zero with probability 1/count.'],
      ['Check the result', 'Every selected value came from the input. A membership check illustrates this invariant. Assessing uniformity requires many independent runs.']],
    { imports: ['java.util.List', 'java.util.Random'] }),
  'dsa-challenge': p(`int[][] cases = {{-5, -2, -1}, {0, 0}, {4, -1, 3, -2}};
for (int[] sample : cases) {
    if (exhaustive(sample) != efficient(sample)) throw new AssertionError(Arrays.toString(sample));
}
System.out.println("Cases matched: " + cases.length);`,
    'Cases matched: 3',
    [['Define one agreement test', 'Both methods must return the maximum sum of a nonempty contiguous subarray. The cases include all-negative and zero values.'],
      ['Build an independent oracle', 'The slower method extends every start position in turn. Its direct implementation makes it easy to inspect.'],
      ['Verify the optimized recurrence', 'The faster method decides whether to extend its current range or start over. The test checks agreement case by case.']],
    { imports: ['java.util.Arrays'], members: `static long exhaustive(int[] a) {
    long best = Long.MIN_VALUE;
    for (int l = 0; l < a.length; l++) {
        long sum = 0;
        for (int r = l; r < a.length; r++) { sum += a[r]; best = Math.max(best, sum); }
    }
    return best;
}
static long efficient(int[] a) {
    long end = a[0], best = end;
    for (int i = 1; i < a.length; i++) {
        end = Math.max(a[i], end + a[i]);
        best = Math.max(best, end);
    }
    return best;
}` }),
};
