// The "Start here" section: a curated default view for first-time visitors.
//
// Rendered only while the view is completely default (no branch, query, chips
// or sort); any navigation hides it. Bucket selection is ephemeral and never
// enters the URL — a shared link always wins over the default view.
import { START_HERE } from "../data/featured.js";

export function renderFeatured(root, { selected, total }) {
  const isSelected = (bucket) =>
    selected.length === bucket.ids.length && bucket.ids.every((id) => selected.includes(id));
  const buckets = START_HERE.map((bucket) => {
    const count = bucket.ids.length;
    return `<button class="bucket" data-ids="${bucket.ids.join(",")}" aria-pressed="${isSelected(bucket)}">
  <span class="bucket-label">${bucket.label}</span>
  <span class="bucket-hint">${bucket.hint}</span>
  <span class="bucket-count">${count} prompt${count === 1 ? "" : "s"}</span>
</button>`;
  }).join("");
  const clear = selected.length
    ? '<button class="ghost" id="clear-featured" type="button">Show all prompts</button>'
    : "";
  root.innerHTML = `<div class="featured-head">
  <h2 class="featured-title">Start here</h2>
  <p class="featured-hint">A few curated starting points — or scroll for all ${total} prompts.</p>
  ${clear}
</div>
<div class="buckets">${buckets}</div>`;
}
