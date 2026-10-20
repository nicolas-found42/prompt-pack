// The taxonomy tree.
//
// The DOM is built once from the taxonomy and then only updated in place, so
// focus survives every re-render. Implements the ARIA tree pattern: one tab stop
// (roving tabindex), arrow keys to move, right/left to expand and collapse.

import { NODES, NODE_BY_KEY } from "./catalog.js";

let treeEl = null;
let handlers = {};
const nodeEls = new Map();

function buildItem(node) {
  const li = document.createElement("li");
  li.setAttribute("role", "treeitem");
  li.setAttribute("aria-level", String(node.level + 1));
  li.dataset.key = node.key;
  li.tabIndex = -1;

  const row = document.createElement("span");
  row.className = "node-row";

  const twisty = document.createElement("span");
  twisty.className = "twisty";
  twisty.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");
  label.className = "node-label";
  label.textContent = node.label;

  const count = document.createElement("span");
  count.className = "node-count";

  row.append(twisty, label, count);
  li.append(row);

  if (node.childKeys.length) {
    const group = document.createElement("ul");
    group.setAttribute("role", "group");
    for (const childKey of node.childKeys) {
      group.append(buildItem(NODE_BY_KEY.get(childKey)));
    }
    li.append(group);
  }

  nodeEls.set(node.key, li);
  return li;
}

/** Build the tree once and attach its interactions. */
export function buildTree(root, opts) {
  handlers = opts;
  treeEl = document.createElement("ul");
  treeEl.className = "tree";
  treeEl.setAttribute("role", "tree");
  treeEl.setAttribute("aria-label", "Prompt taxonomy");
  nodeEls.clear();

  for (const node of NODES.filter((n) => n.level === 0)) {
    treeEl.append(buildItem(node));
  }

  root.append(treeEl);
  treeEl.addEventListener("click", onClick);
  treeEl.addEventListener("keydown", onKeydown);
}

/** Items currently reachable with the arrow keys. */
function visibleItems() {
  return [...treeEl.querySelectorAll('li[role="treeitem"]')].filter((li) => {
    let parent = li.parentElement.closest('li[role="treeitem"]');
    while (parent) {
      if (parent.getAttribute("aria-expanded") === "false") return false;
      parent = parent.parentElement.closest('li[role="treeitem"]');
    }
    return true;
  });
}

function focusItem(li) {
  if (!li) return;
  for (const el of nodeEls.values()) el.tabIndex = -1;
  li.tabIndex = 0;
  li.focus();
}

function onClick(event) {
  const li = event.target.closest('li[role="treeitem"]');
  if (!li || !treeEl.contains(li)) return;
  const key = li.dataset.key;
  if (event.target.closest(".twisty")) {
    event.preventDefault();
    handlers.onToggle(key);
    return;
  }
  handlers.onSelect(key);
}

function onKeydown(event) {
  const li = event.target.closest('li[role="treeitem"]');
  if (!li) return;
  const node = NODE_BY_KEY.get(li.dataset.key);
  const items = visibleItems();
  const index = items.indexOf(li);
  const open = li.getAttribute("aria-expanded") === "true";

  switch (event.key) {
    case "ArrowDown":
      focusItem(items[Math.min(index + 1, items.length - 1)]);
      break;
    case "ArrowUp":
      focusItem(items[Math.max(index - 1, 0)]);
      break;
    case "ArrowRight":
      if (node.childKeys.length && !open) handlers.onExpand(li.dataset.key);
      else if (node.childKeys.length) focusItem(nodeEls.get(node.childKeys[0]));
      break;
    case "ArrowLeft":
      if (open) handlers.onCollapse(li.dataset.key);
      else if (node.parentKey) focusItem(nodeEls.get(node.parentKey));
      break;
    case "Home":
      focusItem(items[0]);
      break;
    case "End":
      focusItem(items[items.length - 1]);
      break;
    case "Enter":
    case " ":
      handlers.onSelect(li.dataset.key);
      break;
    default:
      return;
  }
  event.preventDefault();
}

/** Refresh counts, expansion state, selection and search hits. */
export function updateTree({ counts, expanded, selectedKey, hitKeys }) {
  for (const [key, li] of nodeEls) {
    const node = NODE_BY_KEY.get(key);
    const hasChildren = node.childKeys.length > 0;
    const isOpen = expanded.has(key);

    li.classList.toggle("leaf", !hasChildren);
    li.classList.toggle("open", hasChildren && isOpen);
    if (hasChildren) li.setAttribute("aria-expanded", isOpen ? "true" : "false");
    li.setAttribute("aria-selected", key === selectedKey ? "true" : "false");
    li.classList.toggle("selected", key === selectedKey);

    const count = counts.get(key) ?? 0;
    li.querySelector(".node-count").textContent = String(count);
    li.classList.toggle("empty", count === 0);
    li.classList.toggle("hit", hitKeys.has(key));
  }

  const selected = selectedKey ? nodeEls.get(selectedKey) : null;
  const first = nodeEls.get(NODES[0].key);
  const target = selected || first;
  for (const el of nodeEls.values()) el.tabIndex = -1;
  if (target) target.tabIndex = 0;
}
