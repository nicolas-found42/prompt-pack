// Joins the two data files into the lookup structures the UI needs:
// a flat depth-first node list, a prompt-id -> path map, and the tree order index.

import { PROMPTS } from "../data/prompts.js";
import { TAXONOMY } from "../data/taxonomy.js";

export const ROWS = PROMPTS;
export const PATTERNS = [...new Set(ROWS.map((r) => r.pattern))].sort();
export const CATEGORIES = TAXONOMY.categories.map((c) => c.category);

/** Every taxonomy node, in depth-first order. */
export const NODES = [];
/** key -> node, where the key is the slash-joined path ("Coding/Architecture Exploration"). */
export const NODE_BY_KEY = new Map();
/** prompt id -> { key, category, path }. */
export const PATH_BY_ID = new Map();
/** prompt id -> position in tree order. */
export const TREE_INDEX = new Map();

function addGroup(group, parent) {
  const key = `${parent.key}/${group.name}`;
  const node = {
    key,
    level: 2,
    label: group.name,
    summary: group.summary,
    parentKey: parent.key,
    childKeys: [],
    ids: [...group.ids],
    allIds: [...group.ids],
    category: parent.category,
    path: [...parent.path, group.name],
  };
  NODES.push(node);
  NODE_BY_KEY.set(key, node);
  for (const id of node.ids) {
    PATH_BY_ID.set(id, { key, category: parent.category, path: [...node.path] });
    TREE_INDEX.set(id, TREE_INDEX.size);
  }
  return node;
}

for (const cat of TAXONOMY.categories) {
  const catNode = {
    key: cat.category,
    level: 0,
    label: cat.category,
    summary: cat.summary,
    parentKey: null,
    childKeys: [],
    ids: [],
    allIds: [],
    category: cat.category,
    path: [cat.category],
  };
  NODES.push(catNode);
  NODE_BY_KEY.set(catNode.key, catNode);

  for (const sub of cat.subcategories) {
    const subKey = `${cat.category}/${sub.name}`;
    const subNode = {
      key: subKey,
      level: 1,
      label: sub.name,
      summary: sub.summary,
      parentKey: catNode.key,
      childKeys: [],
      ids: [],
      allIds: [],
      category: cat.category,
      path: [cat.category, sub.name],
    };
    NODES.push(subNode);
    NODE_BY_KEY.set(subKey, subNode);
    catNode.childKeys.push(subKey);

    for (const group of sub.groups) {
      const groupNode = addGroup(group, subNode);
      subNode.childKeys.push(groupNode.key);
      subNode.allIds.push(...groupNode.allIds);
    }
    catNode.allIds.push(...subNode.allIds);
  }
}

/** Prompt ids in tree order. */
export const CATALOG_IDS = [...TREE_INDEX.keys()];

/** Node for a slash-joined path, or null when the path is not in the taxonomy. */
export function nodeForPath(path) {
  return NODE_BY_KEY.get(path.join("/")) || null;
}

/** Prompt ids belonging to a node, including the ids of its descendants. */
export function idsUnder(key) {
  const node = NODE_BY_KEY.get(key);
  return node ? node.allIds : [];
}
