// Query matching and hit highlighting.
//
// The haystack includes the taxonomy path, so a search for "hardening" finds the
// prompts filed under "Systemic Hardening" even when the word is in no prompt body.
//
// Matching is forgiving without a dependency: both sides are Unicode NFC
// normalized and stripped of diacritics ("resume" finds "résumé"), and a
// multi-word query requires every token somewhere in the haystack, in any order.
import { ROWS, PATH_BY_ID } from "./catalog.js";

function fold(text) {
  return text.normalize("NFC").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const HAYSTACK = new Map(
  ROWS.map((row) => {
    const path = PATH_BY_ID.get(row.id);
    const pathText = path ? path.path.join(" ") : "";
    const tagsText = Array.isArray(row.tags) ? row.tags.join(" ") : "";
    return [
      row.id,
      fold(
        `${row.title} ${row.purpose} ${row.text} ${pathText} ${row.pattern} ${row.session || ""} ${tagsText}`,
      ),
    ];
  }),
);

/** True when the row matches the query. An empty query matches everything. */
export function matchesQuery(row, query) {
  const tokens = fold(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;
  const haystack = HAYSTACK.get(row.id);
  return tokens.every((token) => haystack.includes(token));
}

/** One inline "did you mean" suggestion, or null when nothing is close. */
export function suggest(query) {
  const tokens = fold(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;
  let best = null;
  let bestDistance = Infinity;
  for (const row of ROWS) {
    const words = fold(`${row.title} ${row.purpose}`).split(/[^a-z0-9]+/);
    for (const word of words) {
      if (!word || word.length < 3) continue;
      for (const token of tokens) {
        if (token.length < 3) continue;
        const distance = editDistance(token, word);
        // Only suggest for a near miss: at most a third of the word may differ.
        if (distance <= Math.max(1, Math.floor(word.length / 3)) && distance < bestDistance) {
          best = word;
          bestDistance = distance;
        }
      }
    }
  }
  return best;
}

/** Classic Levenshtein distance, bounded by the lengths involved. */
function editDistance(a, b) {
  if (a === b) return 0;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = next;
    }
  }
  return row[b.length];
}

function escapeHtml(text) {
  return text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}

/**
 * Escape the text, then wrap query hits in <mark>.
 *
 * The split happens on the raw text, before escaping: matching against the
 * escaped string would let a query such as "a" hit the "amp" inside "&amp;"
 * and corrupt the rendered output. Tokens match the same way matchesQuery
 * does, so highlighting agrees with filtering.
 */
export function highlight(text, query) {
  const tokens = fold(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return escapeHtml(text);
  const pattern = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  return text
    .split(new RegExp(`(${pattern})`, "gi"))
    .map((part, index) => (index % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
    .join("");
}
