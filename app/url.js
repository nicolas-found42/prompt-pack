// View state <-> URL hash, so any view can be linked or restored.
//
// "#/Coding/Architecture Exploration?pat=Audit&q=triage"

export function encodeState(state) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.patterns.length) params.set("pat", state.patterns.join(","));
  if (state.scoped && state.q) params.set("in", "1");
  const path = state.path.map(encodeURIComponent).join("/");
  const query = params.toString();
  return query ? `#/${path}?${query}` : `#/${path}`;
}

export function decodeState(hash) {
  const raw = String(hash || "").replace(/^#/, "");
  const [pathPart, queryPart] = raw.split("?");
  const path = pathPart.replace(/^\//, "").split("/").filter(Boolean).map(decodeURIComponent);
  const params = new URLSearchParams(queryPart || "");
  return {
    path,
    patterns: (params.get("pat") || "").split(",").filter(Boolean),
    q: params.get("q") || "",
    scoped: params.get("in") === "1",
  };
}
