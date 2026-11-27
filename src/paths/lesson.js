export function unit(id, title, explanation, example, cues, rule, edges, task, criteria, questions, links = []) {
  return {
    id, title, explanation, example, cues, rule, edges,
    minutes: 18, practice: [task, ...links], criteria, questions,
  };
}

export function leetcode(number, title, slug, difficulty = 'Easy') {
  return [`LeetCode #${number}`, title, `https://leetcode.com/problems/${slug}/`, difficulty];
}
