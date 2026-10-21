// The "Start here" set: the default view a first-time visitor sees when no
// tree branch is selected. Plain-language buckets, roughly a dozen prompts
// total; "Browse all" (the empty tree selection) is always one click away.
// The URL hash always wins over this default. Keep ids in sync with
// data/prompts/ — `npm run check` fails on unknown ids.
export const START_HERE = [
  {
    label: "Get a direct answer",
    hint: "Skip building anything — ask for the finished outcome",
    ids: ["4.1", "1.1"],
  },
  {
    label: "Triage your workload",
    hint: "Sort active tasks, messages, and drafts into next actions",
    ids: ["4.2", "2.2"],
  },
  {
    label: "Unblock a problem",
    hint: "Walk through a messy issue conversationally",
    ids: ["4.5"],
  },
  {
    label: "Research a question",
    hint: "Gather evidence and verify every claim",
    ids: ["3.1", "3.7"],
  },
  {
    label: "Write or rewrite a draft",
    hint: "From rough notes to a publication-ready piece",
    ids: ["2.1", "2.3"],
  },
  {
    label: "Review your own prompting",
    hint: "Find where you are thinking too small",
    ids: ["5.8"],
  },
  {
    label: "Bootstrap a fresh session",
    hint: "Zero-context repo diagnostics, golden masters, and health audits",
    ids: ["13.1", "11.1", "12.1"],
  },
];
