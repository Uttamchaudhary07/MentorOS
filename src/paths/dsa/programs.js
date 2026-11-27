export const dsaPrograms = {
  'dsa-cost': `import java.util.HashSet;
import java.util.Set;

class Main {
    static int doublingSteps(int n) {
        int steps = 0;
        for (long i = 1; i < n; i *= 2) steps++;
        return steps;
    }

    static int scanHits(int[] values, int[] queries) {
        int hits = 0;
        for (int query : queries) {
            for (int value : values) {
                if (value == query) {
                    hits++;
                    break;
                }
            }
        }
        return hits;
    }

    static int indexedHits(int[] values, int[] queries) {
        Set<Integer> membership = new HashSet<>();
        for (int value : values) membership.add(value); // Pay the build cost once.
        int hits = 0;
        for (int query : queries) if (membership.contains(query)) hits++;
        return hits;
    }

    public static void main(String[] args) {
        int[] values = {4, 8, 15, 16};
        int[] queries = {16, 3, 8, 8};
        if (doublingSteps(0) != 0 || doublingSteps(Integer.MAX_VALUE) != 31
                || scanHits(values, queries) != 3 || indexedHits(values, queries) != 3) {
            throw new AssertionError("Workload check failed");
        }
        System.out.println(doublingSteps(10)); // 4
    }
}`,
  'dsa-arrays': `import java.util.Arrays;

class Main {
    static void moveZeros(int[] values) {
        int write = 0;
        for (int read = 0; read < values.length; read++) {
            if (values[read] != 0) values[write++] = values[read];
        }
        // All kept values are already in [0, write).
        Arrays.fill(values, write, values.length, 0);
    }

    public static void main(String[] args) {
        int[] values = {0, 3, 0, 2};
        int[] allZero = {0, 0};
        moveZeros(values);
        moveZeros(allZero);
        moveZeros(new int[0]);
        if (!Arrays.equals(values, new int[] {3, 2, 0, 0})
                || !Arrays.equals(allZero, new int[] {0, 0})) {
            throw new AssertionError("Compaction check failed");
        }
        System.out.println(Arrays.toString(values)); // [3, 2, 0, 0]
    }
}`,
  'dsa-frequencies': `import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

class Main {
    static int[] twoSum(int[] values, int target) {
        Map<Long, Integer> seen = new HashMap<>();
        for (int i = 0; i < values.length; i++) {
            long current = values[i];
            Integer prior = seen.get((long) target - current);
            // Checking first prevents using the same position twice.
            if (prior != null) return new int[] {prior, i};
            seen.put(current, i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] pair = twoSum(new int[] {3, 3}, 6);
        if (!Arrays.equals(pair, new int[] {0, 1})
                || twoSum(new int[] {3}, 6).length != 0
                || twoSum(new int[] {Integer.MAX_VALUE, 1}, Integer.MIN_VALUE).length != 0) {
            throw new AssertionError("Two sum check failed");
        }
        System.out.println(Arrays.toString(pair)); // [0, 1]
    }
}`,
  'dsa-sliding': `import java.util.HashSet;
import java.util.Set;

class Main {
    static int longestUnique(String text) {
        int[] symbols = text.codePoints().toArray();
        Set<Integer> window = new HashSet<>();
        int left = 0;
        int best = 0;
        for (int right = 0; right < symbols.length; right++) {
            while (window.contains(symbols[right])) {
                window.remove(symbols[left++]);
            }
            window.add(symbols[right]);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        int length = longestUnique("abba");
        if (length != 2 || longestUnique("") != 0 || longestUnique("😀a😀") != 2) {
            throw new AssertionError("Window check failed");
        }
        System.out.println(length); // 2, measured in Unicode code points
    }
}`,
  'dsa-bounds': `import java.util.Arrays;

class Main {
    static int bound(int[] values, int key, boolean upper) {
        int low = 0;
        int high = values.length;
        while (low < high) {
            int mid = low + (high - low) / 2;
            boolean tooSmall = values[mid] < key || (upper && values[mid] == key);
            if (tooSmall) low = mid + 1;
            else high = mid; // mid can still be the first qualifying index.
        }
        return low;
    }

    static int[] equalRange(int[] values, int key) {
        return new int[] {bound(values, key, false), bound(values, key, true)};
    }

    public static void main(String[] args) {
        int[] values = {1, 2, 2, 4};
        int[] range = equalRange(values, 2);
        if (!Arrays.equals(range, new int[] {1, 3})
                || !Arrays.equals(equalRange(values, 5), new int[] {4, 4})
                || bound(new int[0], 2, false) != 0) {
            throw new AssertionError("Boundary check failed");
        }
        System.out.println(Arrays.toString(range)); // [1, 3], end exclusive
    }
}`,
  'dsa-monotonic-deque': `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

class Main {
    static int[] windowMax(int[] values, int width) {
        if (width < 1 || width > values.length) {
            throw new IllegalArgumentException("Invalid window width");
        }
        Deque<Integer> candidates = new ArrayDeque<>();
        int[] result = new int[values.length - width + 1];

        for (int i = 0; i < values.length; i++) {
            while (!candidates.isEmpty() && candidates.peekFirst() <= i - width) {
                candidates.removeFirst();
            }
            // A larger or equal new value will outlast these candidates.
            while (!candidates.isEmpty() && values[candidates.peekLast()] <= values[i]) {
                candidates.removeLast();
            }
            candidates.addLast(i);
            if (i >= width - 1) result[i - width + 1] = values[candidates.peekFirst()];
        }
        return result;
    }

    public static void main(String[] args) {
        int[] values = {1, 3, 3, 2};
        int[] result = windowMax(values, 2);
        if (!Arrays.equals(result, new int[] {3, 3, 3})
                || !Arrays.equals(windowMax(values, 1), values)
                || !Arrays.equals(windowMax(new int[] {5, 1, 2}, 2), new int[] {5, 2})) {
            throw new AssertionError("Window maximum check failed");
        }
        System.out.println(Arrays.toString(result)); // [3, 3, 3]
    }
}`,
  'dsa-bst': `class Main {
    record Node(int value, Node left, Node right) {}

    static boolean valid(Node node, long low, long high) {
        if (node == null) return true;
        int value = node.value();
        // Carry ancestor bounds into both recursive calls.
        return low < value && value < high
            && valid(node.left(), low, value)
            && valid(node.right(), value, high);
    }

    static boolean isBst(Node root) {
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    public static void main(String[] args) {
        Node invalid = new Node(10, new Node(5, null, new Node(12, null, null)), null);
        if (isBst(invalid) || !isBst(null)
                || !isBst(new Node(Integer.MIN_VALUE, null, null))) {
            throw new AssertionError("BST check failed");
        }
        System.out.println(isBst(invalid)); // false: 12 is inside the left subtree of 10
    }
}`,
  'dsa-directed': `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

class Main {
    static List<Integer> topologicalOrder(List<List<Integer>> edges) {
        int[] indegree = new int[edges.size()];
        for (List<Integer> outgoing : edges) {
            for (int to : outgoing) indegree[to]++;
        }

        Deque<Integer> ready = new ArrayDeque<>();
        for (int v = 0; v < indegree.length; v++) {
            if (indegree[v] == 0) ready.addLast(v);
        }

        List<Integer> order = new ArrayList<>();
        while (!ready.isEmpty()) {
            int from = ready.removeFirst();
            order.add(from);
            for (int to : edges.get(from)) {
                if (--indegree[to] == 0) ready.addLast(to);
            }
        }
        if (order.size() != edges.size()) {
            throw new IllegalArgumentException("The graph contains a cycle");
        }
        return order;
    }

    public static void main(String[] args) {
        var graph = List.of(List.of(2), List.of(2), List.<Integer>of());
        var order = topologicalOrder(graph);
        if (!order.equals(List.of(0, 1, 2)) || !topologicalOrder(List.of()).isEmpty()) {
            throw new AssertionError("Topological order check failed");
        }
        try {
            topologicalOrder(List.of(List.of(0)));
            throw new AssertionError("A self-loop should be rejected");
        } catch (IllegalArgumentException expected) {
            System.out.println(order); // [0, 1, 2]
        }
    }
}`,
  'dsa-dijkstra': `import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

class Main {
    record Edge(int to, int weight) {}
    record State(int vertex, long distance) {}

    static long[] distances(List<List<Edge>> graph, int source) {
        long[] dist = new long[graph.size()];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[source] = 0;

        PriorityQueue<State> queue = new PriorityQueue<>(Comparator.comparingLong(State::distance));
        queue.add(new State(source, 0));
        while (!queue.isEmpty()) {
            State current = queue.remove();
            if (current.distance() != dist[current.vertex()]) continue;
            for (Edge edge : graph.get(current.vertex())) {
                if (edge.weight() < 0) throw new IllegalArgumentException("Negative edge");
                long candidate = current.distance() + edge.weight();
                if (candidate < dist[edge.to()]) {
                    dist[edge.to()] = candidate;
                    queue.add(new State(edge.to(), candidate));
                }
            }
        }
        return dist;
    }

    public static void main(String[] args) {
        List<List<Edge>> graph = List.of(
            List.of(new Edge(1, 5), new Edge(2, 1)),
            List.of(),
            List.of(new Edge(1, 1)),
            List.of()
        );
        long[] result = distances(graph, 0);
        if (!Arrays.equals(result, new long[] {0, 2, 1, Long.MAX_VALUE})) {
            throw new AssertionError("Dijkstra check failed");
        }
        System.out.println(result[1]); // 2, through vertex 2
    }
}`,
  'dsa-backtrack': `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Main {
    static List<List<Integer>> subsets(int[] values) {
        int[] sorted = values.clone();
        Arrays.sort(sorted);
        List<List<Integer>> output = new ArrayList<>();
        search(sorted, 0, new ArrayList<>(), output);
        return output;
    }

    static void search(int[] values, int start, List<Integer> path, List<List<Integer>> output) {
        output.add(List.copyOf(path));
        for (int i = start; i < values.length; i++) {
            // Skip equivalent siblings, but allow equal elements deeper in the path.
            if (i > start && values[i] == values[i - 1]) continue;
            path.add(values[i]);
            search(values, i + 1, path, output);
            path.remove(path.size() - 1);
        }
    }

    public static void main(String[] args) {
        var result = subsets(new int[] {1, 1});
        if (!result.equals(List.of(List.of(), List.of(1), List.of(1, 1)))
                || !subsets(new int[0]).equals(List.of(List.of()))) {
            throw new AssertionError("Subset check failed");
        }
        System.out.println(result); // [[], [1], [1, 1]]
    }
}`,
  'dsa-knapsack': `class Main {
    static boolean subsetSum(int[] weights, int limit) {
        if (limit < 0) throw new IllegalArgumentException("Negative target");
        boolean[] reachable = new boolean[limit + 1];
        reachable[0] = true;
        for (int weight : weights) {
            if (weight < 0) throw new IllegalArgumentException("Negative weight");
            // Descending capacities preserve the state from before this item.
            for (int capacity = limit; capacity >= weight; capacity--) {
                reachable[capacity] |= reachable[capacity - weight];
            }
        }
        return reachable[limit];
    }

    public static void main(String[] args) {
        if (subsetSum(new int[] {2}, 4) || !subsetSum(new int[] {2, 2}, 4)
                || !subsetSum(new int[0], 0) || subsetSum(new int[] {0}, 1)) {
            throw new AssertionError("0–1 subset sum check failed");
        }
        System.out.println(subsetSum(new int[] {2, 2}, 4)); // true
    }
}`,
  'dsa-kmp': `import java.util.ArrayList;
import java.util.List;

class Main {
    static int[] prefix(String pattern) {
        int[] pi = new int[pattern.length()];
        for (int i = 1; i < pattern.length(); i++) {
            int matched = pi[i - 1];
            while (matched > 0 && pattern.charAt(i) != pattern.charAt(matched)) {
                matched = pi[matched - 1];
            }
            if (pattern.charAt(i) == pattern.charAt(matched)) matched++;
            pi[i] = matched;
        }
        return pi;
    }

    static List<Integer> matches(String text, String pattern) {
        if (pattern.isEmpty()) throw new IllegalArgumentException("Empty pattern");
        int[] pi = prefix(pattern);
        List<Integer> output = new ArrayList<>();
        int matched = 0;
        for (int i = 0; i < text.length(); i++) {
            while (matched > 0 && text.charAt(i) != pattern.charAt(matched)) {
                matched = pi[matched - 1];
            }
            if (text.charAt(i) == pattern.charAt(matched)) matched++;
            if (matched == pattern.length()) {
                output.add(i - matched + 1);
                matched = pi[matched - 1]; // Retain a prefix for overlapping matches.
            }
        }
        return output;
    }

    public static void main(String[] args) {
        var result = matches("ababa", "aba");
        if (!result.equals(List.of(0, 2)) || !matches("", "a").isEmpty()
                || !matches("aaaa", "aa").equals(List.of(0, 1, 2))) {
            throw new AssertionError("KMP check failed");
        }
        System.out.println(result); // [0, 2], UTF-16 indices
    }
}`,
  'dsa-fenwick': `class Main {
    static class Fenwick {
        private final long[] tree;

        Fenwick(int size) {
            tree = new long[size + 1];
        }

        void add(int index, long delta) {
            if (index < 0 || index >= tree.length - 1) {
                throw new IndexOutOfBoundsException(index);
            }
            // The public index is zero-based. The tree is one-based.
            for (int i = index + 1; i < tree.length; i += i & -i) tree[i] += delta;
        }

        long prefix(int end) {
            if (end < 0 || end >= tree.length) throw new IndexOutOfBoundsException(end);
            long total = 0;
            for (int i = end; i > 0; i -= i & -i) total += tree[i];
            return total;
        }

        long range(int left, int right) {
            if (right < left) throw new IllegalArgumentException("Reversed range");
            return prefix(right) - prefix(left);
        }
    }

    public static void main(String[] args) {
        int[] values = {3, 1, 4, 2};
        Fenwick tree = new Fenwick(values.length);
        for (int i = 0; i < values.length; i++) tree.add(i, values[i]);
        if (tree.prefix(3) != 8 || tree.prefix(0) != 0) throw new AssertionError("Initial sum");
        tree.add(1, 5);
        if (tree.prefix(3) != 13 || tree.range(1, 3) != 10 || tree.range(2, 2) != 0) {
            throw new AssertionError("Updated sum");
        }
        System.out.println(tree.range(1, 3)); // 10
    }
}`,
  'dsa-challenge': `import java.util.HashMap;
import java.util.Map;
import java.util.Random;

class Main {
    static long slow(int[] values, int target) {
        long count = 0;
        for (int left = 0; left < values.length; left++) {
            long sum = 0;
            for (int right = left; right < values.length; right++) {
                sum += values[right];
                if (sum == target) count++;
            }
        }
        return count;
    }

    static long fast(int[] values, int target) {
        Map<Long, Long> frequency = new HashMap<>();
        frequency.put(0L, 1L); // Prefix before the first value.
        long prefix = 0;
        long count = 0;
        for (int value : values) {
            prefix += value;
            count += frequency.getOrDefault(prefix - target, 0L);
            frequency.merge(prefix, 1L, Long::sum);
        }
        return count;
    }

    public static void main(String[] args) {
        Random random = new Random(0);
        for (int trial = 0; trial < 300; trial++) {
            int[] values = random.ints(random.nextInt(9), -3, 4).toArray();
            int target = random.nextInt(9) - 4;
            if (slow(values, target) != fast(values, target)) {
                throw new AssertionError("Optimized count disagrees with the oracle");
            }
        }
        long answer = fast(new int[] {2, -2, 0}, 0);
        if (answer != 3 || fast(new int[100_000], 0) != 5_000_050_000L) {
            throw new AssertionError("Subarray count check failed");
        }
        System.out.println(answer); // 3
    }
}`,
};
