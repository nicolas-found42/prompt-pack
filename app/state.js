// The single mutable view state. Every mutation goes through here so the URL,
// the tree, the facet chips and the card grid never disagree.

export const state = {
  /** Selected path as names, e.g. ["Coding", "Architecture Exploration"]. Empty = all prompts. */
  path: [],
  /** Active interaction patterns. Empty = no pattern filter. */
  patterns: [],
  /** Search query. Non-empty queries search the whole deck, ignoring the selected path. */
  q: "",
  /** Sort key: tree | title-asc | title-desc | pattern | words-asc | words-desc. */
  sort: "tree",
  /** Taxonomy nodes the user opened by hand. */
  expanded: new Set(),
  /** Taxonomy nodes closed by hand while a search is running. */
  closed: new Set(),
  /** Prompt ids whose prompt body is expanded. */
  expandedCards: new Set(),
  /** Whether every prompt body is expanded. */
  expandAll: false,
};

/** The taxonomy key of the selected path, or "" when nothing is selected. */
export function selectedKey() {
  return state.path.join("/");
}

/** Replace the selected path. */
export function selectPath(path) {
  state.path = [...path];
  state.closed.clear();
}

/** Toggle one interaction pattern on or off. */
export function togglePattern(pattern) {
  const at = state.patterns.indexOf(pattern);
  if (at === -1) state.patterns.push(pattern);
  else state.patterns.splice(at, 1);
}

/** Clear every pattern chip. */
export function clearPatterns() {
  state.patterns = [];
}
