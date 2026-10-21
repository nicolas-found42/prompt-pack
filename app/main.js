// Wires the tree, the pattern facet, the search box, the card grid and the URL
// together. Every interaction mutates state, then a single render() repaints.

import { ROWS, PATTERNS, NODES, NODE_BY_KEY, PATH_BY_ID, TREE_INDEX, idsUnder } from "./catalog.js";
import { state, selectPath, togglePattern, clearPatterns, selectedKey } from "./state.js";
import { encodeState, decodeState } from "./url.js";
import { matchesQuery } from "./search.js";
import { buildTree, updateTree } from "./tree.js";
import { renderResults } from "./results.js";
import { renderFacets } from "./facets.js";
import { renderFeatured } from "./featured.js";

const $ = (selector) => document.querySelector(selector);

const els = {
  q: $("#q"),
  sort: $("#sort"),
  toggle: $("#toggle"),
  count: $("#count"),
  body: $("#body"),
  tree: $("#tree"),
  crumbs: $("#crumbs"),
  facets: $("#facets"),
  copyLink: $("#copy-link"),
  drawerOpen: $("#drawer-open"),
  drawerClose: $("#drawer-close"),
  scrim: $("#scrim"),
  featured: $("#featured"),
  scope: $("#scope"),
  scopeNarrow: $("#scope-narrow"),
  scopeReset: $("#scope-reset"),
  summary: $("#branch-summary"),
  shortcuts: $("#shortcuts-toggle"),
};

const ROWS_BY_ID = new Map(ROWS.map((row) => [row.id, row]));
const ALL_IDS = ROWS.map((row) => row.id);
const SORTS = ["tree", "title-asc", "title-desc", "pattern", "words-asc", "words-desc"];

let currentExpanded = new Set();

function applyFromUrl() {
  const parsed = decodeState(location.hash);
  const known = NODE_BY_KEY.has(parsed.path.join("/"));
  state.path = known ? parsed.path : [];
  state.patterns = parsed.patterns.filter((pattern) => PATTERNS.includes(pattern));
  state.q = parsed.q;
  state.sort = SORTS.includes(parsed.sort) ? parsed.sort : "tree";
  state.scoped = parsed.scoped && known;
  // The Start here default never fights a shared link: any URL state hides it.
  state.featured = [];
  expandPathTo(state.path);
}

/** Add a node and all of its ancestors to a set of expanded tree keys. */
function addAncestors(keys, key) {
  let current = key;
  while (current) {
    keys.add(current);
    const node = NODE_BY_KEY.get(current);
    current = node ? node.parentKey : null;
  }
}

/** Open the tree down to a selected path so the selection is always visible. */
function expandPathTo(path) {
  const node = NODE_BY_KEY.get(path.join("/"));
  if (!node) return;
  addAncestors(state.expanded, node.key);
}

function syncUrl(mode) {
  const hash = encodeState(state);
  if (hash === location.hash) return;
  if (mode === "push") history.pushState(null, "", hash);
  else history.replaceState(null, "", hash);
}

function sortRows(rows) {
  const list = [...rows];
  const byTree = (a, b) => TREE_INDEX.get(a.id) - TREE_INDEX.get(b.id);
  switch (state.sort) {
    case "title-asc":
      return list.sort((a, b) => a.title.localeCompare(b.title) || byTree(a, b));
    case "title-desc":
      return list.sort((a, b) => b.title.localeCompare(a.title) || byTree(a, b));
    case "pattern":
      return list.sort((a, b) => a.pattern.localeCompare(b.pattern) || byTree(a, b));
    case "words-asc":
      return list.sort((a, b) => a.words - b.words || byTree(a, b));
    case "words-desc":
      return list.sort((a, b) => b.words - a.words || byTree(a, b));
    default:
      return list.sort(byTree);
  }
}

function renderCrumbs() {
  const parts = [
    `<button class="crumb${state.path.length ? "" : " current"}" data-path="">All prompts</button>`,
  ];
  let acc = [];
  for (const name of state.path) {
    acc = [...acc, name];
    const current = acc.length === state.path.length;
    // The crumb path is the taxonomy key of that ancestor, so it needs no
    // separator of its own.
    parts.push(
      `<button class="crumb${current ? " current" : ""}" data-path="${acc.join("/")}">${name}</button>`,
    );
  }
  els.crumbs.innerHTML = parts.join('<span class="crumb-sep" aria-hidden="true">›</span>');
}

/** The one-line description authored on the selected taxonomy node, if any. */
function renderSummary() {
  const node = state.path.length ? NODE_BY_KEY.get(selectedKey()) : null;
  els.summary.textContent = node?.summary || "";
  els.summary.hidden = !node?.summary;
}

/** State the search scope out loud: a query searches the whole deck unless narrowed. */
function renderScope(visibleCount, branchCount) {
  if (!state.q) {
    els.scope.hidden = true;
    return;
  }
  els.scope.hidden = false;
  if (state.scoped) {
    els.scope.innerHTML = `Searching only <strong>${state.path[0]}</strong> (${visibleCount} of ${branchCount}) · <button class="linklike" id="scope-reset" type="button">search everything</button>`;
  } else {
    const narrow = state.path.length
      ? ` · <button class="linklike" id="scope-narrow" type="button">search only ${state.path[0]}</button>`
      : "";
    els.scope.innerHTML = `Searching all ${ROWS.length} prompts${narrow}`;
  }
}

/** The Start here section shows only on a completely default view. */
function isDefaultView() {
  return !state.path.length && !state.q && !state.patterns.length && state.sort === "tree";
}

function render() {
  const query = state.q.trim().toLowerCase();
  const patterns = new Set(state.patterns);
  const patternOk = (row) => !patterns.size || patterns.has(row.pattern);
  const queryOk = (row) => matchesQuery(row, query);

  const scopeRows = (state.path.length ? idsUnder(selectedKey()) : ALL_IDS).map((id) =>
    ROWS_BY_ID.get(id),
  );
  // A query searches the whole deck unless the visitor narrowed it to the
  // selected branch; without a query the tree selection scopes the view.
  const visible = query
    ? state.scoped
      ? scopeRows.filter((row) => patternOk(row) && queryOk(row))
      : ROWS.filter((row) => patternOk(row) && queryOk(row))
    : state.featured.length
      ? state.featured.map((id) => ROWS_BY_ID.get(id)).filter((row) => patternOk(row))
      : scopeRows.filter(patternOk);

  const counts = new Map();
  const hitKeys = new Set();
  for (const node of NODES) {
    let total = 0;
    for (const id of node.allIds) {
      const row = ROWS_BY_ID.get(id);
      if (patternOk(row) && queryOk(row)) total++;
    }
    counts.set(node.key, total);
    if (query && total > 0) hitKeys.add(node.key);
  }

  const chipScope = query ? ROWS.filter(queryOk) : scopeRows;
  const patternCounts = new Map(
    PATTERNS.map((pattern) => [pattern, chipScope.filter((row) => row.pattern === pattern).length]),
  );

  const expanded = new Set(state.expanded);
  if (query) {
    for (const row of visible) {
      const info = PATH_BY_ID.get(row.id);
      addAncestors(expanded, info.key);
    }
  }
  for (const key of state.closed) expanded.delete(key);
  currentExpanded = expanded;

  if (isDefaultView()) {
    // Re-render the buckets every time so aria-pressed reflects the selection,
    // and show the "Show all prompts" escape hatch only while a bucket is active.
    renderFeatured(els.featured, { selected: state.featured, total: ROWS.length });
    els.featured.hidden = false;
  } else {
    els.featured.hidden = true;
    els.featured.innerHTML = "";
  }

  renderResults(els.body, {
    rows: sortRows(visible),
    query,
    expandedCards: state.expandedCards,
    expandAll: state.expandAll,
    hasFilters: Boolean(
      query || state.patterns.length || state.path.length || state.featured.length,
    ),
  });
  renderFacets(els.facets, {
    patterns: PATTERNS,
    counts: patternCounts,
    selected: state.patterns,
  });
  renderScope(visible.length, scopeRows.length);
  renderSummary();
  updateTree({ counts, expanded, selectedKey: selectedKey(), hitKeys });
  renderCrumbs();
  els.count.textContent = `Showing ${visible.length} of ${ROWS.length}`;
}

function selectNode(key) {
  const node = NODE_BY_KEY.get(key);
  if (!node) return;
  selectPath(node.path);
  state.closed.clear();
  state.featured = [];
  state.scoped = false;
  expandPathTo(state.path);
  render();
  syncUrl("push");
  // On small screens the tree is an off-canvas drawer: close it so the
  // selected prompts are immediately visible.
  if (document.body.classList.contains("drawer-open")) setDrawer(false);
}

function toggleNode(key) {
  if (currentExpanded.has(key)) {
    state.expanded.delete(key);
    state.closed.add(key);
  } else {
    state.expanded.add(key);
    state.closed.delete(key);
  }
  render();
}

function setDrawer(open) {
  document.body.classList.toggle("drawer-open", open);
  els.drawerOpen.setAttribute("aria-expanded", open ? "true" : "false");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function updateToggleLabel() {
  els.toggle.textContent = state.expandAll ? "Collapse all" : "Expand all";
  els.toggle.setAttribute("aria-pressed", state.expandAll ? "true" : "false");
}

function announce(message) {
  els.count.textContent = message;
}

buildTree(els.tree, {
  onSelect: selectNode,
  onToggle: toggleNode,
  onExpand: (key) => {
    state.expanded.add(key);
    state.closed.delete(key);
    render();
  },
  onCollapse: (key) => {
    state.expanded.delete(key);
    state.closed.add(key);
    render();
  },
});

els.q.addEventListener("input", () => {
  state.q = els.q.value;
  state.closed.clear();
  state.featured = [];
  render();
  syncUrl("replace");
});

els.sort.addEventListener("change", () => {
  state.sort = els.sort.value;
  state.featured = [];
  render();
  syncUrl("replace");
});

els.toggle.addEventListener("click", () => {
  state.expandAll = !state.expandAll;
  if (!state.expandAll) state.expandedCards.clear();
  updateToggleLabel();
  render();
});

els.facets.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (!chip) return;
  // Re-rendering replaces the chips, which would drop focus; remember the
  // pressed chip and restore focus to it after the render.
  const pressed = chip.dataset.pat || "";
  if (chip.dataset.clear) clearPatterns();
  else togglePattern(chip.dataset.pat);
  state.featured = [];
  render();
  syncUrl("push");
  const next = els.facets.querySelector(`[data-pat="${CSS.escape(pressed)}"]`);
  (next || els.facets.querySelector(".chip-clear"))?.focus();
});

els.crumbs.addEventListener("click", (event) => {
  const crumb = event.target.closest(".crumb");
  if (!crumb) return;
  const node = crumb.dataset.path ? NODE_BY_KEY.get(crumb.dataset.path) : null;
  selectPath(node ? node.path : []);
  state.closed.clear();
  state.featured = [];
  state.scoped = false;
  expandPathTo(state.path);
  render();
  syncUrl("push");
});

els.copyLink.addEventListener("click", async () => {
  const ok = await copyText(location.href);
  els.copyLink.textContent = ok ? "Link copied" : "Copy blocked";
  announce(ok ? "Link copied to clipboard" : "Copy blocked by the browser");
  setTimeout(() => {
    els.copyLink.textContent = "Copy link";
  }, 1400);
});

els.featured.addEventListener("click", (event) => {
  const clear = event.target.closest("#clear-featured");
  if (clear) {
    state.featured = [];
    render();
    return;
  }
  const bucket = event.target.closest(".bucket");
  if (!bucket) return;
  const ids = bucket.dataset.ids.split(",");
  const same =
    state.featured.length === ids.length && ids.every((id) => state.featured.includes(id));
  state.featured = same ? [] : ids;
  render();
});

els.scope.addEventListener("click", (event) => {
  if (event.target.closest("#scope-narrow")) {
    state.scoped = true;
    render();
    syncUrl("replace");
  } else if (event.target.closest("#scope-reset")) {
    state.scoped = false;
    render();
    syncUrl("replace");
  }
});

els.shortcuts.addEventListener("change", () => {
  state.shortcuts = els.shortcuts.checked;
});

els.body.addEventListener(
  "toggle",
  (event) => {
    const details = event.target.closest("details.prompt");
    if (!details) return;
    const card = details.closest(".card");
    if (!card) return;
    const id = card.dataset.id;
    if (details.open) state.expandedCards.add(id);
    else state.expandedCards.delete(id);
    if (!details.open && state.expandAll) {
      // The other cards are open because of the global flag, not because their
      // ids are recorded. Capture them before dropping the flag, so collapsing
      // one card does not shut the rest on the next render.
      for (const open of els.body.querySelectorAll("details.prompt[open]")) {
        const openId = open.closest(".card")?.dataset.id;
        if (openId) state.expandedCards.add(openId);
      }
      state.expandAll = false;
      updateToggleLabel();
    }
  },
  true,
);

els.body.addEventListener("click", async (event) => {
  const suggest = event.target.closest(".suggest");
  if (suggest) {
    state.q = suggest.dataset.q;
    els.q.value = state.q;
    state.closed.clear();
    render();
    syncUrl("replace");
    els.q.focus();
    return;
  }
  const clear = event.target.closest("#clear-filters");
  if (clear) {
    state.q = "";
    els.q.value = "";
    clearPatterns();
    selectPath([]);
    state.closed.clear();
    state.featured = [];
    state.scoped = false;
    render();
    syncUrl("push");
    els.q.focus();
    return;
  }
  const button = event.target.closest(".copy");
  if (!button) return;
  const card = button.closest(".card");
  const row = card ? ROWS_BY_ID.get(card.dataset.id) : null;
  if (!row) return;
  const ok = await copyText(row.text);
  button.textContent = ok ? "Copied" : "Copy blocked";
  announce(ok ? "Prompt copied to clipboard" : "Copy blocked by the browser");
  setTimeout(() => {
    button.textContent = "Copy";
  }, 1400);
});
els.drawerOpen.addEventListener("click", () =>
  setDrawer(!document.body.classList.contains("drawer-open")),
);
els.drawerClose.addEventListener("click", () => setDrawer(false));
els.scrim.addEventListener("click", () => setDrawer(false));

const FOCUSABLE = new Set(["INPUT", "SELECT", "TEXTAREA"]);

document.addEventListener("keydown", (event) => {
  const inField = FOCUSABLE.has(event.target.tagName) || event.target.isContentEditable;

  // "/" or Ctrl/Cmd+K anywhere focuses search; Escape clears or steps back.
  // The shortcuts master switch (WCAG 2.1.4) gates the focus shortcut only —
  // Escape always works.
  const isFocusSearch =
    state.shortcuts &&
    ((event.key === "/" && !inField) ||
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k"));
  if (isFocusSearch) {
    event.preventDefault();
    els.q.focus();
    els.q.select();
    return;
  }
  if (event.key === "Escape") {
    if (document.body.classList.contains("drawer-open")) {
      setDrawer(false);
      els.drawerOpen.focus();
    } else if (els.q.value) {
      state.q = "";
      els.q.value = "";
      state.closed.clear();
      render();
      syncUrl("replace");
    } else if (state.path.length) {
      selectPath([]);
      state.closed.clear();
      state.featured = [];
      state.scoped = false;
      expandPathTo(state.path);
      render();
      syncUrl("push");
      els.q.focus();
    }
  }
});

window.addEventListener("popstate", () => {
  applyFromUrl();
  els.q.value = state.q;
  els.sort.value = state.sort;
  render();
});

applyFromUrl();
els.q.value = state.q;
els.sort.value = state.sort;
els.shortcuts.checked = state.shortcuts;
render();
syncUrl("replace");
