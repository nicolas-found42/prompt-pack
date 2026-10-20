// The interaction-pattern facet: a row of toggle chips, orthogonal to the tree.

export function renderFacets(root, { patterns, counts, selected }) {
  const chips = patterns
    .map((pattern) => {
      const on = selected.includes(pattern);
      return `<button class="chip" data-pat="${pattern}" aria-pressed="${on}">${pattern}<span class="chip-count">${counts.get(pattern) ?? 0}</span></button>`;
    })
    .join("");
  const clear = selected.length
    ? '<button class="chip chip-clear" data-clear="1">Clear</button>'
    : "";
  root.innerHTML = `<span class="facet-label">Pattern</span>${chips}${clear}`;
}
