// The result grid. Cards are compact by default: title, purpose and taxonomy
// path, with the full prompt behind a disclosure.
//
// A "did you mean" suggestion renders in the empty state when a query matches
// nothing but is close to a word the deck uses.
import { PATH_BY_ID } from "./catalog.js";
import { highlight, suggest } from "./search.js";

function escapeHtml(text) {
  return text.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
}

export function renderResults(root, { rows, query, expandedCards, expandAll, hasFilters }) {
  if (!rows.length) {
    const hint = suggest(query);
    const suggestion = hint
      ? `<p class="empty-hint">No prompt contains “${escapeHtml(query)}”. Did you mean <button class="suggest" type="button" data-q="${escapeHtml(hint)}">${escapeHtml(hint)}</button>?</p>`
      : '<p class="empty-hint">Try a shorter query, fewer pattern chips, or another branch of the tree.</p>';
    root.innerHTML = hasFilters
      ? `<div class="empty">
  <p class="empty-title">No prompts match</p>
  ${suggestion}
  <button class="ghost" id="clear-filters" type="button">Clear search and filters</button>
</div>`
      : '<p class="empty">No prompts in this branch yet.</p>';
    return;
  }

  root.innerHTML = rows
    .map((row) => {
      const path = PATH_BY_ID.get(row.id);
      const open = expandAll || expandedCards.has(row.id);
      return `<article class="card" data-id="${row.id}">
  <div class="top">
    <span class="num">${row.id}</span>
    <span class="path">${path ? highlight(path.path.join(" › "), query) : ""}</span>
    <span class="tag">${row.pattern}</span>
    <span class="words">${row.words} words</span>
  </div>
  <p class="title">${highlight(row.title, query)}</p>
  <p class="purpose">${highlight(row.purpose, query)}</p>
  <details class="prompt"${open ? " open" : ""}>
    <summary><span class="label-closed">Show prompt</span><span class="label-open">Hide prompt</span></summary>
    <p class="text">${highlight(row.text, query)}</p>
  </details>
  <button class="copy">Copy</button>
</article>`;
    })
    .join("");
}
