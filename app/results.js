// The result grid. Cards are compact by default: title, purpose and taxonomy
// path, with the full prompt behind a disclosure.

import { PATH_BY_ID } from "./catalog.js";
import { highlight } from "./search.js";

export function renderResults(root, { rows, query, expandedCards, expandAll, hasFilters }) {
  if (!rows.length) {
    root.innerHTML = hasFilters
      ? `<div class="empty">
  <p class="empty-title">No prompts match</p>
  <p class="empty-hint">Try a shorter query, fewer pattern chips, or another branch of the tree.</p>
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
