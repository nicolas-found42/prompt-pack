// Prompts for one category of the deck. One record per block, one id per
// line, so two contributors adding prompts never edit the same lines.
//  is the position each prompt had in the original deck; category
// membership lives in data/taxonomy.js, the single source of truth for
// where a prompt sits in the navigation tree.
export const PROMPTS = [
  {
    order: 9,
    id: "2.1",
    title: "Outcome-First Draft Synthesis",
    purpose:
      "Stop over-engineering structural prompts; state the desired impact and let the agent assemble and elevate the piece from raw context.",
    text: "Review all the rough notes, thoughts, and context we have gathered in this workspace. Instead of following a rigid formula, focus entirely on the final outcome we want this piece to achieve for the reader. Synthesize the strongest arguments, cut every section that feels like filler or over-explanation, organize the narrative for maximum clarity and momentum, and produce a complete, publication-ready draft.",
    words: 62,
    pattern: "Execute",
  },
  {
    order: 10,
    id: "2.2",
    title: "Multi-Draft & Workstream Triage",
    purpose:
      "Programmatically audit all open writing drafts and fragments to decide what to publish, what to discard, and how to advance the rest.",
    text: "Go through all of the open drafts, outlines, and fragmentary notes in this workspace. Give me a clear triage report: identify which pieces are close enough to finish and publish right now, which ones are stale or redundant and should be closed and archived, and how the remaining drafts should be renamed, recategorized, or merged. For every draft worth keeping, write the exact follow-up instruction I should run next to finish it.",
    words: 72,
    pattern: "Triage",
  },
  {
    order: 11,
    id: "2.3",
    title: "Interactive Editorial Triage",
    purpose:
      "Have the agent dynamically interview you to extract concrete examples and resolve vague claims before rewriting.",
    text: "Act as an interactive developmental editor for the draft we are working on. Read through the current text and identify every place where the argument is vague, unsupported, or missing a concrete real-world example. Do not rewrite the whole piece yet—first ask me targeted follow-up questions to draw out what I actually mean in my own words, and ask me to drop in any screenshots, data points, or artifacts that would prove the point. Once you have extracted clear specifics from me, integrate them into a sharpened draft.",
    words: 88,
    pattern: "Interactive",
  },
  {
    order: 12,
    id: "2.4",
    title: "Ephemeral Narrative & Argument Visualizer",
    purpose:
      "Create an ad-hoc visual map of a draft’s logic, pacing, and structure to spot structural flaws instantly.",
    text: "Build a standalone visual map of our current draft that breaks down the argument flow, section proportions, tone shifts, and supporting evidence across the entire piece. Highlight any circular reasoning, repetitive paragraphs, or unsupported leaps so I can see the structural health of the writing at a glance and tell you what to restructure.",
    words: 54,
    pattern: "Visualize",
  },
  {
    order: 13,
    id: "2.5",
    title: "Parallel Angle & Voice Exploration",
    purpose:
      "Launch parallel explorations of different structural framing approaches before synthesizing the strongest version.",
    text: "Spin up two separate exploratory drafts of this material using completely different structural angles: have one lead immediately with the most counterintuitive conclusion and concrete proof, and have the other build the case chronologically from the underlying problem to the shift in thinking. Summarize the best hooks, transitions, and insights from both explorations, and combine them into one definitive version.",
    words: 60,
    pattern: "Parallel agents",
  },
  {
    order: 14,
    id: "2.6",
    title: "Style & Editorial Skill Codification",
    purpose:
      "Extract recurring editorial corrections and voice preferences from the session into a reusable style guide.",
    text: "Review all the edits, rewrites, and feedback I have given you across our recent writing sessions. Identify the recurring patterns in what I keep asking you to change—including sentence rhythm, formatting habits, words I dislike, and how I structure arguments. Distill those patterns into a clean, reusable writing skill and style instruction file so I never have to repeat these editorial corrections again.",
    words: 63,
    pattern: "Codify",
  },
  {
    order: 15,
    id: "2.7",
    title: "Reader Context & Blind-Spot Audit",
    purpose:
      "Identify implicit knowledge that exists in your head or notes but is missing from the actual page.",
    text: "Read our current draft from the perspective of an intelligent reader who has zero access to our background notes or prior conversations. Tell me what critical context, definitions, or motivating examples are currently missing from the page that make the argument hard to follow, and recommend the cleanest way to expose that information without slowing down the pacing.",
    words: 58,
    pattern: "Audit",
  },
  {
    order: 48,
    id: "2.8",
    title: "Claim & Evidence Strength Triage",
    purpose:
      "Sort every assertion in a draft by how well it is proven, cutting weak filler and flagging high-stakes claims that need real artifacts.",
    text: "Go through every claim, paragraph, and example in our current draft and run a ruthless editorial triage. Sort every section into three categories: rock-solid points backed by concrete proof that should be elevated, high-leverage claims that currently lack evidence and need a real artifact or data point from me, and lukewarm throat-clearing or repetitive commentary that should be deleted on the spot. Apply the cuts immediately and list the exact proof points you need from me.",
    words: 76,
    pattern: "Triage",
  },
  {
    order: 49,
    id: "2.9",
    title: "Audience Feedback & Comment Thread Triage",
    purpose:
      "Distill messy reviewer comments and conflicting edits across a shared draft into decisive structural changes versus bikeshedding to ignore.",
    text: "Review all the margin comments, reader notes, and conflicting feedback scattered across this draft. Triage the feedback for me: separate genuine structural confusion where multiple readers stumbled from low-leverage wordsmithing or contradictory personal preferences that would dilute the voice. Reject the noise, explain which core criticisms actually matter, and execute the exact rewrites needed to resolve them cleanly.",
    words: 58,
    pattern: "Triage",
  },
  {
    order: 50,
    id: "2.10",
    title: "Domain Lexicon & Framing Codification",
    purpose:
      "Extract the strongest metaphors, terminology, and mental models from raw transcripts and published pieces into a reusable framing playbook.",
    text: "Scan across our finished pieces, raw voice transcripts, and working notes in this workspace to identify the signature mental models, sharp phrasing, and domain definitions that make our writing distinct. Codify these framing primitives—along with the cliched industry buzzwords we deliberately avoid—into a concise markdown reference skill so any future draft automatically builds on our sharpest language.",
    words: 57,
    pattern: "Codify",
  },
  {
    order: 51,
    id: "2.11",
    title: "Cross-Format Adaptation Playbook Codification",
    purpose:
      "Turn the process of distilling a deep essay into executive briefings, launch notes, and threads into a repeatable markdown skill.",
    text: "Look at how we just adapted this core essay into shorter executive summaries, documentation updates, and announcement posts—especially what we cut, how we tightened the hooks, and how we preserved technical nuance without fluff. Distill that exact transformation logic into a reusable markdown playbook so that whenever we finish a primary piece in the future, you can generate every derivative format in one shot.",
    words: 64,
    pattern: "Codify",
  },
  {
    order: 52,
    id: "2.12",
    title: "Interactive Thesis & Counterargument Stress-Test",
    purpose:
      "Have the agent challenge your core thesis like a skeptical domain expert in a live back-and-forth before drafting.",
    text: "Before we polish this draft, act as the sharpest, most skeptical practitioner in our target audience and interrogate my thesis interactively. Push back on the weakest links in my reasoning one question at a time, ask me in my own words how this holds up against real-world failure cases, and force me to defend or sharpen every bold claim. Once my answers survive your pushback, weave the battle-tested reasoning directly into the text.",
    words: 73,
    pattern: "Interactive",
  },
  {
    order: 53,
    id: "2.13",
    title: "Interactive Voice-Note to Narrative Extraction",
    purpose:
      "Turn a rambling brain-dump into a structured piece by having the agent interview you to fill narrative gaps and capture authentic phrasing.",
    text: "I am dropping a raw, unstructured brain-dump of thoughts and half-formed stories into this chat. Do not flatten my voice into generic corporate prose—first read my notes, isolate the most compelling core insight, and ask me targeted follow-up questions to draw out the missing anecdotes, numbers, and turning points in my own words. Once we have the full story on the table, assemble a tight draft that sounds unmistakably like me.",
    words: 71,
    pattern: "Interactive",
  },
  {
    order: 54,
    id: "2.14",
    title: "Parallel Persona Reader Simulation",
    purpose:
      "Spin up parallel sub-agents representing distinct reader personas to critique a draft simultaneously and synthesize high-impact fixes.",
    text: "Spin up three parallel delegates to read our current draft through completely different lenses: a time-pressed executive looking only for the bottom-line outcome, a skeptical engineer checking for technical rigor and proof, and a newcomer with zero prior context. Have each delegate pinpoint exactly where they lost interest, doubted a claim, or got confused, then synthesize their critiques and execute a unified revision that satisfies all three.",
    words: 67,
    pattern: "Parallel agents",
  },
  {
    order: 55,
    id: "2.15",
    title: "Parallel Compression & Expansion Experiments",
    purpose:
      "Explore a ruthless 300-word distillation alongside a deeply illustrated long-form version in parallel to find the ideal density.",
    text: "Spin up two parallel delegates to rewrite this draft at opposite extremes of density: have one compress the entire argument into a razor-sharp, zero-fat briefing under three hundred words, and have the other expand it with concrete primary examples, walkthroughs, and preemptive counterarguments. Compare both outputs to see which sections gain power from brevity versus depth, and merge the strongest elements into our final piece.",
    words: 65,
    pattern: "Parallel agents",
  },
  {
    order: 56,
    id: "2.16",
    title: "Ephemeral Pacing & Information-Density Visualizer",
    purpose:
      "Generate an interactive visual heatmap of sentence complexity, claim density, and concrete examples across a draft.",
    text: "Generate a standalone, self-contained visual diagnostic of our current draft that maps pacing and information density paragraph by paragraph. Visually highlight where abstract claims pile up without a concrete example, where sentence rhythm becomes monotonous, and where the core takeaway is buried too deep, so I can inspect the energy curve of the piece at a glance and direct your cuts.",
    words: 61,
    pattern: "Visualize",
  },
  {
    order: 57,
    id: "2.17",
    title: "Ephemeral Multi-Version Narrative Diff Visualizer",
    purpose:
      "Build an ad-hoc visual comparison of multiple draft iterations showing how arguments shifted, tightened, or lost nuance over time.",
    text: "We have iterated on this piece across several drafts and fragments, and I want to make sure we did not accidentally cut our best lines. Build a standalone interactive visual comparison across our draft versions that maps how each core argument evolved, highlights vivid phrasing or proof points that were dropped along the way, and lets us cherry-pick the strongest passages into the final cut.",
    words: 65,
    pattern: "Visualize",
  },
  {
    order: 90,
    id: "2.18",
    title: "Skeptical Counter-Reader Stress Test",
    purpose:
      "Pressure-test a draft against its toughest, most informed critic to expose weak claims and preemptively answer strong objections.",
    text: "Read our current draft from the perspective of a sharp, skeptical domain expert who is predisposed to disagree with our thesis. Identify the exact sentences where our claims feel overstated, where our evidence is thin, or where an experienced reader will immediately raise an objection. Show me the strongest counterarguments against this piece, and rewrite the vulnerable sections to acknowledge and dismantle those objections cleanly without losing narrative momentum.",
    words: 69,
    pattern: "Audit",
  },
  {
    order: 91,
    id: "2.19",
    title: "Multi-Format Audience Adaptation",
    purpose:
      "Distill and reshape a finished core narrative into native versions for distinct audiences without diluting the central argument.",
    text: "Take our finished core draft and adapt it directly for the different audiences who need to act on it, without losing our voice or diluting the central insight. Produce a concise executive decision brief that leads with bottom-line impact, a detailed practitioner version that preserves the full technical nuance and examples, and a sharp short-form summary that captures the core shift in thinking in a single screen.",
    words: 67,
    pattern: "Execute",
  },
  {
    order: 100,
    id: "2.20",
    title: "Claim-to-Evidence Density Triage",
    purpose:
      "Score every paragraph by its ratio of hard proof to abstract explanation and strip out low-density filler.",
    text: "Audit every paragraph in this draft and score its ratio of concrete proof to abstract explanation. Give me a ruthless triage table separating paragraphs that carry hard evidence, numbers, or vivid examples from paragraphs that merely repeat the thesis or pad the transition. Cut the low-density filler immediately and tighten the remaining sections so every paragraph earns its space on the page.",
    words: 62,
    pattern: "Triage",
  },
  {
    order: 101,
    id: "2.21",
    title: "Parallel Precision vs. Analogy Stress-Testing",
    purpose:
      "Draft a complex technical explanation simultaneously in ultra-strict technical prose and analogy-driven narrative, then synthesize the clearest version.",
    text: "Spin up two parallel writing delegates to tackle this technical explanation from opposite extremes: have one write it with zero jargon and ultra-strict, unambiguous sentence rules, and have the other write it as an expressive, analogy-driven architectural walkthrough. Compare where each version succeeds or loses precision, and merge the clearest mechanics from both into a single definitive explanation.",
    words: 58,
    pattern: "Parallel agents",
  },
  {
    order: 113,
    id: "2.22",
    title: "Release Notes & Changelog Drafting",
    purpose:
      "Turn a merged diff pile into release notes and a changelog that users actually read, grouped by impact rather than by commit.",
    text: "We just merged a pile of changes and nobody wants to write the release notes by hand from the commit list. Read the actual diffs and the linked issues, then write the release notes and changelog entries grouped by user-facing impact—not by commit or by team. Lead with what changed for the user, call out breaking changes and migration steps in unmissable terms, keep the tone factual, and verify every claim in the notes against the merged code so we never announce a fix that is not actually in the release.",
    words: 91,
    pattern: "Execute",
  },
  {
    order: 114,
    id: "2.23",
    title: "Parallel Translation & Localization Adaptation",
    purpose:
      "Adapt a finished piece into multiple locales with parallel delegates, preserving voice and catching culture-bound phrasing.",
    text: "Our finished piece needs to work in other locales, and a literal translation would flatten the voice or embarrass us culturally. Spin up parallel delegates, one per target locale, to adapt the piece: have each preserve the argument and tone while flagging idioms, humor, date and currency formats, and culture-bound examples that do not travel. Reconcile their warnings into a localization checklist, apply the adaptations, and codify the recurring locale rules into a reusable translation playbook so the next piece starts localized, not retrofitted.",
    words: 84,
    pattern: "Parallel agents",
  },
  {
    order: 115,
    id: "2.24",
    title: "Plain-Language Translation of Dense Documents",
    purpose:
      "Rewrite a legal, medical, or technical document into plain language without losing the operative meaning, then verify nothing was dropped.",
    text: "I have a dense document—a contract, a medical report, a terms-of-service wall—that I need to actually understand before I sign or act on it. Rewrite it into plain language section by section, keeping every operative clause, number, deadline, and obligation intact, and flag anything ambiguous that I should get a human expert to look at. Then verify the rewrite against the original line by line so we can prove nothing was silently dropped, softened, or invented.",
    words: 76,
    pattern: "Execute",
  },
  {
    order: 116,
    id: "2.25",
    title: "Ephemeral Presentation & Slide Narrative Visualizer",
    purpose:
      "Generate a one-off interactive visual map of a talk or deck's narrative arc to find where the story breaks before presenting.",
    text: "I am about to give a talk or present a deck, and I want to see the narrative arc before an audience does. Build a standalone, self-contained interactive visual map of the deck: the claim each slide makes, how slides chain into each other, where the through-line breaks, and where a listener would get lost or start disagreeing. Highlight the weakest transitions and the slides that carry no argumentative weight so I can cut or reorder them before I ever open the presentation tool.",
    words: 84,
    pattern: "Visualize",
  },
];
