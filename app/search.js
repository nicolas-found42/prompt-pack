// Query matching and hit highlighting.
//
// The haystack includes the taxonomy path, so a search for "hardening" finds the
// prompts filed under "Systemic Hardening" even when the word is in no prompt body.

import { ROWS, PATH_BY_ID } from "./catalog.js";

const HAYSTACK = new Map(
  ROWS.map((row) => {
    const path = PATH_BY_ID.get(row.id);
    const pathText = path ? path.path.join(" ") : "";
    return [row.id, `${row.title} ${row.purpose} ${row.text} ${pathText}`.toLowerCase()];
  }),
);

/** True when the row matches the query. An empty query matches everything. */
export function matchesQuery(row, query) {
  if (!query) return true;
  return HAYSTACK.get(row.id).includes(query);
}

export function escapeHtml(text) {
  return text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}

/** Escape, then wrap query hits in <mark>. */
export function highlight(text, query) {
  const safe = escapeHtml(text);
  if (!query) return safe;
  const pattern = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safe.replace(new RegExp(`(${pattern})`, "gi"), "<mark>$1</mark>");
}
