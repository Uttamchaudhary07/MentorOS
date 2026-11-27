import { program as p } from './program.js';

export const dsaOptimization = {
  'dsa-intervals': p(`int[][] slots = {{0, 4}, {1, 2}, {2, 3}, {3, 6}};
Arrays.sort(slots, Comparator.comparingInt(slot -> slot[1]));
var selected = new ArrayList<String>();
int end = Integer.MIN_VALUE;
for (int[] slot : slots) {
    if (slot[0] >= end) {
        selected.add(slot[0] + "-" + slot[1]);
        end = slot[1];
    }
}
System.out.println(selected);`,
    '[1-2, 2-3, 3-6]',
    [['Sort by finish time', 'Choosing the earliest finish leaves at least as much room as any other first choice.'],
      ['Check compatibility', 'A meeting starting at the last end is allowed by this half-open interval policy.'],
      ['Advance the boundary', 'Accepting a meeting shifts end forward. The long 0–4 interval is skipped after the earlier slots.']],
    { imports: ['java.util.ArrayList', 'java.util.Arrays', 'java.util.Comparator'] }),
  'dsa-greedy': p(`var weights = new PriorityQueue<Long>(List.of(2L, 3L, 7L, 8L));
long cost = 0;
while (weights.size() > 1) {
    long combined = weights.remove() + weights.remove();
    cost += combined;
    weights.add(combined);
}
System.out.println(cost);`,
    '37',
    [['Keep the cheapest weights accessible', 'The heap starts with one entry per symbol.'],
      ['Merge the two smallest', 'The first merge produces weight five. Reinsert it because the combined branch can participate again.'],
      ['Accumulate all merges', 'Costs five, twelve, and twenty add to 37. Each merge increases the depth of everything it contains.']],
    { imports: ['java.util.List', 'java.util.PriorityQueue'] }),
  'dsa-backtrack': p(`int[] values = {2, 1, 2};
Arrays.sort(values);
var subsets = new ArrayList<List<Integer>>();
visit(values, 0, new ArrayList<>(), subsets);
System.out.println(subsets);`,
    '[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]',
    [['Group duplicates', 'Sorting puts equal values together. The same value can still appear at different depths.'],
      ['Save a snapshot', 'Each recursive state is a valid subset. List.copyOf protects saved answers from later path edits.'],
      ['Explore and undo', 'Skip duplicate siblings, append one decision, recurse with the next index, then remove it.']],
    { imports: ['java.util.ArrayList', 'java.util.Arrays', 'java.util.List'], members: `static void visit(int[] a, int start, List<Integer> path, List<List<Integer>> result) {
    result.add(List.copyOf(path));
    for (int i = start; i < a.length; i++) {
        if (i > start && a[i] == a[i - 1]) continue;
        path.add(a[i]);
        visit(a, i + 1, path, result);
        path.remove(path.size() - 1);
    }
}` }),
  'dsa-constraint-search': p(`int n = 4;
System.out.println(count(0, new boolean[n], new boolean[2 * n - 1], new boolean[2 * n - 1]));`,
    '2',
    [['Index the conflicts', 'Use one boolean per column and one per diagonal in each direction. Shifting row − col gives a nonnegative index.'],
      ['Place one queen per row', 'Skip occupied lines, mark all three lines, and continue to the next row.'],
      ['Count and backtrack', 'Reaching row n means a complete board. Clear the marks before trying another column.']],
    { members: `static int count(int row, boolean[] columns, boolean[] down, boolean[] up) {
    if (row == columns.length) return 1;
    int total = 0;
    for (int col = 0; col < columns.length; col++) {
        int a = row - col + columns.length - 1, b = row + col;
        if (columns[col] || down[a] || up[b]) continue;
        columns[col] = down[a] = up[b] = true;
        total += count(row + 1, columns, down, up);
        columns[col] = down[a] = up[b] = false;
    }
    return total;
}` }),
  'dsa-dp-state': p(`int[] scores = {2, 7, 9, 3, 1};
int twoBack = 0, oneBack = 0;
for (int score : scores) {
    int best = Math.max(oneBack, twoBack + score);
    twoBack = oneBack;
    oneBack = best;
}
System.out.println(oneBack);`,
    '12',
    [['Start from empty prefixes', 'Before choosing anything, both safe base totals are zero.'],
      ['Compare two choices', 'Skip the current score and keep oneBack, or take it and add it to twoBack to avoid adjacent selections.'],
      ['Roll the states forward', 'Once the current best is computed, retain only the two numbers needed by later decisions.']]),
  'dsa-knapsack': p(`int[] tasks = {2, 3, 7};
int target = 5;
boolean[] reachable = new boolean[target + 1];
reachable[0] = true;
for (int weight : tasks) {
    for (int total = target; total >= weight; total--) {
        reachable[total] |= reachable[total - weight];
    }
}
System.out.println(reachable[target]);`,
    'true',
    [['Seed the empty subset', 'With no selected tasks, zero is the only reachable duration.'],
      ['Update descending totals', 'When processing a task, lower totals still represent the previous item layer. The new task cannot be selected twice.'],
      ['Check the target', 'Tasks two and three fill five. Task seven is larger than the target and updates no entries.']]),
  'dsa-grid-dp': p(`boolean[][] blocked = {{false, false, false}, {false, true, false}, {false, false, false}};
long[] ways = new long[3];
ways[0] = 1;
for (boolean[] row : blocked) {
    for (int col = 0; col < row.length; col++) {
        if (row[col]) ways[col] = 0;
        else if (col > 0) ways[col] += ways[col - 1];
    }
}
System.out.println(ways[2]);`,
    '2',
    [['Seed the first cell', 'One empty path enters the start and the row begins with zero other options.'],
      ['Combine predecessors', 'Before update, ways[col] represents the cell above. ways[col - 1] is the updated current row’s left neighbor.'],
      ['Reset blocked paths', 'The center contributes zero, leaving only the paths around its upper/right and lower/left sides.']]),
  'dsa-sequences': p(`String left = "cab", right = "acb";
int[][] length = new int[left.length() + 1][right.length() + 1];
for (int i = 1; i <= left.length(); i++) {
    for (int j = 1; j <= right.length(); j++) {
        length[i][j] = left.charAt(i - 1) == right.charAt(j - 1)
            ? 1 + length[i - 1][j - 1]
            : Math.max(length[i - 1][j], length[i][j - 1]);
    }
}
System.out.println(length[left.length()][right.length()]);`,
    '2',
    [['Make the dimensions prefix lengths', 'Row zero and column zero are empty-sequence base cases.'],
      ['Compare the trailing symbols', 'If they match, extend the answer with that symbol. Otherwise skip either trailing symbol and keep the better result.'],
      ['Read the complete answer', 'Two is the best length, for example ab or cb. A subsequence may skip elements.']]),
  'dsa-interval-dp': p(`int[] weights = {3, 5, 2};
int[] prefix = {0, 3, 8, 10};
int n = weights.length;
int[][] best = new int[n][n];
for (int len = 2; len <= n; len++) {
    for (int l = 0; l + len <= n; l++) {
        int r = l + len - 1;
        best[l][r] = Integer.MAX_VALUE;
        for (int split = l; split < r; split++) {
            int cost = best[l][split] + best[split + 1][r] + prefix[r + 1] - prefix[l];
            best[l][r] = Math.min(best[l][r], cost);
        }
    }
}
System.out.println(best[0][n - 1]);`,
    '17',
    [['Define one state per interval', 'best[l][r] is the cheapest total to merge the items in that inclusive range. An already single item costs nothing.'],
      ['Try each last split', 'Both halves are already solved because they are shorter. The final merge adds the entire range sum.'],
      ['Compare the alternatives', 'Merging 5 and 2 first costs seven, then ten to finish. This beats merging 3 and 5 first.']]),
  'dsa-bitmask': p(`int[][] costs = {{4, 1, 6}, {2, 5, 3}, {8, 4, 2}};
int n = costs.length;
int[] dp = new int[1 << n];
Arrays.fill(dp, 1_000_000);
dp[0] = 0;
for (int mask = 0; mask < dp.length; mask++) {
    int person = Integer.bitCount(mask);
    if (person == n) continue;
    for (int task = 0; task < n; task++) {
        int bit = 1 << task;
        if ((mask & bit) == 0) {
            int next = mask | bit;
            dp[next] = Math.min(dp[next], dp[mask] + costs[person][task]);
        }
    }
}
System.out.println(dp[dp.length - 1]);`,
    '5',
    [['Encode chosen tasks', 'Each bit marks a task that has already been assigned. Its bit count determines which person is next.'],
      ['Try each free task', 'Only an unset bit can be assigned. Adding its cost creates a candidate for the next mask.'],
      ['Read the full set', 'The all-ones mask represents all people assigned. The cheapest choices cost one, two, and two.']],
    { imports: ['java.util.Arrays'] }),
};
