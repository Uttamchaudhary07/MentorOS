import { program as p } from './program.js';

export const dsaGraphs = {
  'dsa-graph-model': p(
    `var graph = List.of(List.of(1, 2), List.of(3), List.of(3), List.<Integer>of(), List.<Integer>of());
boolean[] visited = new boolean[graph.size()];
var queue = new ArrayDeque<Integer>();
queue.add(0); visited[0] = true;
var order = new ArrayList<Integer>();
while (!queue.isEmpty()) {
    int from = queue.remove();
    order.add(from);
    for (int to : graph.get(from)) {
        if (!visited[to]) { visited[to] = true; queue.add(to); }
    }
}
System.out.println(order);`,
    '[0, 1, 2, 3]',
    [['Model outgoing edges', 'Each list at index v shows the vertices we can reach in one directed step from v.'],
      ['Schedule each vertex once', 'Mark vertices on enqueue. The two edges into vertex 3 still result in one scheduled visit.'],
      ['Observe the reachable component', 'The FIFO queue prints breadth-first order. Vertex 4 remains unreachable.']],
    { imports: ['java.util.ArrayDeque', 'java.util.ArrayList', 'java.util.List'] },
  ),
  'dsa-grid-bfs': p(
    `int[] distance = {0, -1, -1, -1, -1, 0};
var queue = new ArrayDeque<Integer>();
queue.add(0); queue.add(5);
while (!queue.isEmpty()) {
    int cell = queue.remove();
    for (int next : new int[] {cell - 1, cell + 1}) {
        if (next >= 0 && next < distance.length && distance[next] < 0) {
            distance[next] = distance[cell] + 1;
            queue.add(next);
        }
    }
}
System.out.println(Arrays.toString(distance));`,
    '[0, 1, 2, 2, 1, 0]',
    [['Use a one-row grid', 'The two end cells are sources at distance zero. Every other cell is unvisited.'],
      ['Expand from both sources', 'The FIFO queue interleaves layers from the left and right. A neighbor receives distance one greater than the current cell.'],
      ['Keep first discoveries', 'The first assigned distance is the shortest from either source. Later visits leave it unchanged.']],
    { imports: ['java.util.ArrayDeque', 'java.util.Arrays'] },
  ),
  'dsa-directed': p(
    `var graph = List.of(List.of(2), List.of(2), List.of(3), List.<Integer>of());
int[] incoming = new int[graph.size()];
for (var outgoing : graph) for (int v : outgoing) incoming[v]++;
var queue = new ArrayDeque<Integer>();
for (int v = 0; v < incoming.length; v++) if (incoming[v] == 0) queue.add(v);
var order = new ArrayList<Integer>();
while (!queue.isEmpty()) {
    int v = queue.remove();
    order.add(v);
    for (int next : graph.get(v)) if (--incoming[next] == 0) queue.add(next);
}
System.out.println(order.size() == graph.size() ? order : "Cycle");`,
    '[0, 1, 2, 3]',
    [['Count unfinished prerequisites', 'Each outgoing edge contributes one incoming dependency to its destination.'],
      ['Take ready vertices', 'Vertices zero and one start without dependencies. Completing both drops vertex two’s count to zero.'],
      ['Verify completion', 'If a cycle kept some vertices from being scheduled, the order would be shorter than the graph.']],
    { imports: ['java.util.ArrayDeque', 'java.util.ArrayList', 'java.util.List'] },
  ),
  'dsa-unionfind': p(
    `int[] parent = {0, 1, 2, 3};
int[] size = {1, 1, 1, 1};
int components = 4;
for (int[] edge : new int[][] {{0, 1}, {1, 2}, {0, 2}}) {
    int a = find(parent, edge[0]), b = find(parent, edge[1]);
    if (a == b) continue;
    if (size[a] < size[b]) { int temp = a; a = b; b = temp; }
    parent[b] = a;
    size[a] += size[b];
    components--;
}
System.out.println(components);`,
    '2',
    [['Start with separate sets', 'Every parent initially points to itself. Its component has one member.'],
      ['Join different roots', 'find shortens paths. Union attaches the smaller set to the larger and updates its size.'],
      ['Ignore a redundant edge', 'The last edge joins two vertices that are already connected. Three connected vertices and one isolated vertex remain.']],
    { members: `static int find(int[] parent, int v) {
    while (parent[v] != v) { parent[v] = parent[parent[v]]; v = parent[v]; }
    return v;
}` },
  ),
  'dsa-scc-bridges': p(
    `int[][] graph = {{1, 2}, {0, 2}, {0, 1, 3}, {2}};
for (int v = 0; v < graph.length; v++) if (seen[v] == 0) dfs(graph, v, -1);`,
    '2-3',
    [['Assign DFS times', 'seen receives the first-visit time. low starts at that same time. This sample is a simple undirected graph.'],
      ['Propagate back paths', 'A visited nonparent neighbor can lower low. A child returns its own earliest reachable time.'],
      ['Identify the bridge', 'The triangle reaches earlier ancestors by another route. Vertex 3 can return only through the edge from 2, so that edge is printed.']],
    { members: `static final int[] seen = new int[4], low = new int[4];
static int time;
static void dfs(int[][] graph, int v, int parent) {
    seen[v] = low[v] = ++time;
    for (int next : graph[v]) {
        if (next == parent) continue;
        if (seen[next] == 0) {
            dfs(graph, next, v);
            low[v] = Math.min(low[v], low[next]);
            if (low[next] > seen[v]) System.out.println(v + "-" + next);
        } else {
            low[v] = Math.min(low[v], seen[next]);
        }
    }
}` },
  ),
  'dsa-dijkstra': p(
    `var graph = List.of(List.of(new Edge(1, 7), new Edge(2, 2)),
    List.<Edge>of(), List.of(new Edge(1, 1)));
long[] dist = {0, Long.MAX_VALUE, Long.MAX_VALUE};
var pending = new PriorityQueue<State>(Comparator.comparingLong(State::cost));
pending.add(new State(0, 0));
while (!pending.isEmpty()) {
    State current = pending.remove();
    if (current.cost() != dist[current.vertex()]) continue;
    for (Edge edge : graph.get(current.vertex())) {
        long next = current.cost() + edge.cost();
        if (next < dist[edge.to()]) {
            dist[edge.to()] = next;
            pending.add(new State(edge.to(), next));
        }
    }
}
System.out.println(Arrays.toString(dist));`,
    '[0, 3, 2]',
    [['Start with one known distance', 'The source costs zero. Other vertices begin at the sentinel for unreachable.'],
      ['Process the smallest waiting cost', 'Reaching vertex two for cost two gives a cheaper route to one than the direct edge.'],
      ['Skip superseded work', 'The queue still contains the earlier cost for one. The distance check discards it.']],
    { imports: ['java.util.Arrays', 'java.util.Comparator', 'java.util.List', 'java.util.PriorityQueue'],
      members: 'record Edge(int to, int cost) {}\nrecord State(int vertex, long cost) {}' },
  ),
  'dsa-bellman': p(
    `int[][] edges = {{0, 1, 5}, {1, 2, -2}, {0, 2, 8}};
long inf = Long.MAX_VALUE;
long[] distances = {0, inf, inf};
for (int step = 1; step <= 2; step++) {
    long[] next = distances.clone();
    for (int[] edge : edges) {
        int from = edge[0], to = edge[1];
        if (distances[from] != inf) next[to] = Math.min(next[to], distances[from] + edge[2]);
    }
    distances = next;
    System.out.println("At most " + step + " edges: " + distances[2]);
}`,
    'At most 1 edges: 8\nAt most 2 edges: 3',
    [['Set an edge budget per pass', 'Only the source is reachable before any edges are used.'],
      ['Relax using the previous array', 'The first pass only finds direct routes. A copied next array prevents two hops in that pass.'],
      ['Allow one more edge', 'The second pass can reach 2 through 1, using the negative edge to reduce the total from eight to three.']],
  ),
  'dsa-floyd': p(
    `int inf = 1_000_000;
int[][] dist = {{0, 2, 9}, {inf, 0, 3}, {inf, inf, 0}};
for (int k = 0; k < dist.length; k++) {
    for (int from = 0; from < dist.length; from++) {
        for (int to = 0; to < dist.length; to++) {
            if (dist[from][k] != inf && dist[k][to] != inf) {
                dist[from][to] = Math.min(dist[from][to], dist[from][k] + dist[k][to]);
            }
        }
    }
}
System.out.println(dist[0][2]);`,
    '5',
    [['Initialize direct costs', 'The matrix begins with known direct edges and zeros on its diagonal. Missing edges use a sentinel.'],
      ['Add one allowed intermediate', 'For each k, test routes through k using costs already established. Both segments must exist.'],
      ['Read the improved route', 'The path from zero through one to two costs five, beating the direct cost of nine.']],
  ),
  'dsa-mst': p(
    `int[][] edges = {{0, 2, 5}, {0, 1, 1}, {1, 2, 2}};
Arrays.sort(edges, Comparator.comparingInt(edge -> edge[2]));
int[] parent = {0, 1, 2};
int total = 0;
for (int[] edge : edges) {
    int a = root(parent, edge[0]), b = root(parent, edge[1]);
    if (a != b) { parent[b] = a; total += edge[2]; }
}
System.out.println(total);`,
    '3',
    [['Sort edges by cost', 'Kruskal considers cheap options before expensive ones.'],
      ['Join separate components', 'The first two edges connect all three sites. Updating parent tracks the connection.'],
      ['Skip the cycle edge', 'The two ends of the last edge have the same root, so its cost does not enter the spanning tree.']],
    { imports: ['java.util.Arrays', 'java.util.Comparator'], members: `static int root(int[] parent, int v) {
    while (parent[v] != v) v = parent[v];
    return v;
}` },
  ),
  'dsa-flow': p(
    `int[][] capacity = {{0, 2, 1, 0}, {0, 0, 1, 1}, {0, 0, 0, 2}, {0, 0, 0, 0}};
System.out.println(maxFlow(capacity, 0, 3));`,
    '3',
    [['Store remaining capacity', 'Every entry is initially the given directed capacity. The source is 0 and the sink is 3.'],
      ['Find and size an augmenting path', 'BFS tracks each predecessor. The minimum residual capacity on the path is how much can be added.'],
      ['Update both directions', 'Forward residual capacity shrinks and reverse capacity grows. When BFS cannot reach the sink, the flow is maximal.']],
    { imports: ['java.util.ArrayDeque', 'java.util.Arrays'], members: `static int maxFlow(int[][] residual, int source, int sink) {
    int total = 0;
    while (true) {
        int[] parent = new int[residual.length];
        Arrays.fill(parent, -1);
        var queue = new ArrayDeque<Integer>();
        parent[source] = source;
        queue.add(source);
        while (!queue.isEmpty() && parent[sink] == -1) {
            int from = queue.remove();
            for (int to = 0; to < parent.length; to++) {
                if (parent[to] == -1 && residual[from][to] > 0) {
                    parent[to] = from;
                    queue.add(to);
                }
            }
        }
        if (parent[sink] == -1) return total;
        int amount = Integer.MAX_VALUE;
        for (int to = sink; to != source; to = parent[to]) {
            amount = Math.min(amount, residual[parent[to]][to]);
        }
        for (int to = sink; to != source; to = parent[to]) {
            int from = parent[to];
            residual[from][to] -= amount;
            residual[to][from] += amount;
        }
        total += amount;
    }
}` },
  ),
};
