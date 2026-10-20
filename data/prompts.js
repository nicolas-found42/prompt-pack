// The 107 prompt records that make up the deck.
//
// `order` is the position each prompt had in the original deck. Category
// membership is not stored here: it lives in data/taxonomy.js, which is the
// single source of truth for where a prompt sits in the navigation tree.
export const PROMPTS = [
  {
    order: 1,
    id: "1.1",
    title: "Outcome Over Feature Implementation",
    purpose:
      "Ask for the underlying outcome or a lightweight agent playbook instead of writing complex application code for a feature that only surfaces information or guides a workflow.",
    text: "Before we write any application code for what we are discussing, step back and evaluate whether this actually needs to be a built feature at all. Determine if the goal is really just retrieving information, generating a report, or guiding a dynamic workflow that an agent can execute directly on demand. If this can be solved entirely by asking you for the outcome, or by replacing hundreds of lines of rigid logic with a tiny entrypoint and a markdown playbook, show me that approach first and execute the outcome directly.",
    words: 90,
    pattern: "Execute",
  },
  {
    order: 2,
    id: "1.2",
    title: "Observability & Blind-Spot Audit",
    purpose:
      "Ask the agent what historical data it can and cannot see when debugging an issue, and have it design the exact instrumentation needed for future self-diagnosis.",
    text: "If I asked you right now to diagnose and debug intermittent or historical issues in the part of the system we are working on, do you currently have access to enough logs, state history, and diagnostic data to see what actually happened in the past? Inspect our current logging and telemetry setup. Tell me clearly what you can see right now, what blind spots exist, and how you recommend we introduce and expose the missing data so that you can automatically diagnose and verify these issues in the future.",
    words: 89,
    pattern: "Audit",
  },
  {
    order: 3,
    id: "1.3",
    title: "Ephemeral Problem & State Visualizer",
    purpose:
      "Generate a one-off interactive visual tool to reason through a complex bug, state machine, or data flow without building a permanent product feature.",
    text: "I want to understand the exact state flow, bottlenecks, and behavior of the problem we are currently working on without building a permanent dashboard into the product. Generate a standalone, self-contained, interactive visual breakdown that maps out the current data, execution flow, and failure points so we can inspect it visually right now.",
    words: 53,
    pattern: "Visualize",
  },
  {
    order: 4,
    id: "1.4",
    title: "Interactive Triage Playbook Conversion",
    purpose:
      "Replace brittle, multi-step troubleshooting code with a single conversational playbook that dynamically guides users, checks upstream fixes, and files clean issues.",
    text: "Instead of building a rigid, multi-stage troubleshooting workflow in code with custom input routing for every edge case, turn this entire diagnostic flow into a concise markdown playbook that an agent can run interactively. Structure the playbook so the agent first asks the user to describe what went wrong in their own words, asks them to paste screenshots or logs directly if helpful, asks targeted follow-up questions when descriptions are vague until clear reproduction steps are established, inspects local environment facts, checks the source code and upstream issue tracker to see if the problem is already known or fixed, scrubs all secrets and personal data, and either resolves the local configuration issue or drafts a clean report on an existing issue rather than creating a duplicate.",
    words: 126,
    pattern: "Interactive",
  },
  {
    order: 5,
    id: "1.5",
    title: "Primitive & Agent-Surface Architecture Audit",
    purpose:
      "Shift engineering effort away from static one-off buttons toward primitives, data pipes, and programmatic interfaces that let agents dynamically build what is needed.",
    text: "Review our current codebase, planned features, and open backlog items. Separate them into two categories: first, surface-level features or static views that a user or agent could simply prompt for on demand; second, core primitives, data pipelines, programmatic tool interfaces, and inline rendering capabilities that we must build so agents can dynamically access, control, and visualize the system. Recommend how we can strip away the unnecessary static features and refocus our engineering on the foundational primitives and data pipes.",
    words: 79,
    pattern: "Audit",
  },
  {
    order: 6,
    id: "1.6",
    title: "Parallel Sub-Agent Exploration & Handoff",
    purpose:
      "Orchestrate multiple parallel delegates to explore performance or architectural improvements independently before handing off implementation to a clean session.",
    text: "Spin up two parallel delegates to independently explore performance wins, architectural bottlenecks, and reliability improvements across both the client and server layers of this project. Once both delegates finish their investigations, synthesize and compare their findings, prioritize the highest-leverage improvements, and start a fresh implementation workflow to execute the best changes cleanly.",
    words: 52,
    pattern: "Parallel agents",
  },
  {
    order: 7,
    id: "1.7",
    title: "Deep Systems & Infrastructure Optimization",
    purpose:
      "Look past routine framework boilerplate to focus on high-leverage system architecture such as connection pooling, resource isolation, and runtime efficiency.",
    text: "Look past the surface-level application code, syntax choices, and standard queries in this project, and analyze our deep system architecture. Examine how our connection layers, state persistence, process isolation, memory management, and execution runtimes actually operate under load. Identify how we can re-architect these foundational layers to keep connections warm, minimize resource overhead, and dramatically improve speed and cost efficiency.",
    words: 60,
    pattern: "Execute",
  },
  {
    order: 8,
    id: "1.8",
    title: "Live Self-Execution & Verification",
    purpose:
      "Have the agent run the software itself, reproduce the failure directly, and verify its own fix end-to-end.",
    text: "This issue is still happening. Do not just guess from reading the static files—run the project yourself in this environment, trigger the exact flow that is failing, observe the live output and interface state, and figure out why the previous attempt did not resolve it. Once you identify the real root cause, apply the fix, run it again to verify the result firsthand, and capture proof that the issue is resolved.",
    words: 71,
    pattern: "Audit",
  },
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
    order: 16,
    id: "3.1",
    title: "Disparate Source & Data Unification",
    purpose:
      "Ask the agent to directly ingest, normalize, and merge scattered exports and documents instead of building custom parsing tools.",
    text: "Examine all the raw data exports, documents, logs, and notes scattered across this workspace. Instead of writing a permanent software pipeline to manage them, directly normalize, cross-reference, and combine all of these disparate records into a single unified dataset and summary. Surface the most interesting long-term patterns, anomalies, and connections across the combined history.",
    words: 54,
    pattern: "Execute",
  },
  {
    order: 17,
    id: "3.2",
    title: "On-Demand Interactive Research Visualizer",
    purpose: "Turn complex findings into an interactive visual exploration interface on the fly.",
    text: "Take all the findings, metrics, and comparisons we have uncovered in this research session and build a clean, self-contained interactive visual report. Make it easy to filter, compare, and inspect the underlying data points visually so I can explore the patterns directly and ask follow-up questions from the visual breakdown.",
    words: 50,
    pattern: "Visualize",
  },
  {
    order: 18,
    id: "3.3",
    title: "Parallel Hypothesis Delegation",
    purpose:
      "Use parallel sub-agents to investigate competing hypotheses simultaneously and synthesize the truth.",
    text: "Spin up parallel research delegates to investigate the question we are exploring from opposing angles: have one delegate gather the strongest primary evidence supporting our main hypothesis, and have another rigorously search for counter-evidence, edge cases, and alternative explanations. Synthesize their findings side by side, resolve the contradictions, and present a verified conclusion.",
    words: 53,
    pattern: "Parallel agents",
  },
  {
    order: 19,
    id: "3.4",
    title: "Information Access & Source Gap Introspection",
    purpose:
      "Ask the agent what data it cannot currently see that would be required to answer a research question with certainty.",
    text: "Based on the question we are trying to answer right now, evaluate the data and sources currently available to you in this workspace. Tell me explicitly what information you can verify directly, what remains speculative because the data is missing, and what specific files, connections, or external sources I should expose to you so you can answer this with complete certainty.",
    words: 61,
    pattern: "Audit",
  },
  {
    order: 20,
    id: "3.5",
    title: "Anomaly-to-Root-Cause Investigation Chain",
    purpose:
      "Trace an unexpected spike or anomaly in a summary report all the way back through underlying sources to actionable recommendations.",
    text: "Something in our latest metrics and reports looks unusually high and out of pattern. Go through our underlying source data, usage logs, and historical records to trace exactly what caused this spike. Break down the root causes by impact, identify what is driving the inefficiency, and give me a concrete execution plan to bring it back down immediately.",
    words: 58,
    pattern: "Execute",
  },
  {
    order: 21,
    id: "3.6",
    title: "Cross-Session Research Audit & Deduplication",
    purpose:
      "Audit all past research threads and notes to surface forgotten conclusions and prevent duplicate work.",
    text: "Audit all existing research notes, past transcripts, and open investigation threads in this workspace. Identify which questions we have already answered, where we have duplicate or overlapping investigations running, which stale threads should be closed out, and what high-value open questions remain unresolved. Consolidate the scattered findings into one clean master index.",
    words: 52,
    pattern: "Audit",
  },
  {
    order: 22,
    id: "3.7",
    title: "Primary Verification & Assumption Audit",
    purpose:
      "Force the agent to verify every claim against primary artifacts and explain any unverified gaps.",
    text: "Review the conclusions and summary points we just generated. Audit every single claim against the primary source files and raw data available in this environment. Flag any statement that relies on assumption rather than direct verification, run the necessary checks to verify those points directly, and explain if any missing tool or access prevented full verification.",
    words: 56,
    pattern: "Audit",
  },
  {
    order: 23,
    id: "4.1",
    title: "Direct Outcome Execution (“Don’t Build It, Just Do It“)",
    purpose:
      "Skip building trackers, apps, or complex systems for tasks where you can simply ask the agent for the end result.",
    text: "I am tempted to build a dedicated system, template, or tool to manage the task we are discussing, but I actually just want the end result. Figure out how to get me the exact outcome, information, and organized output I need right now using the tools and access you already have, without us building or maintaining any new infrastructure.",
    words: 59,
    pattern: "Execute",
  },
  {
    order: 24,
    id: "4.2",
    title: "Active Project & Task Triage",
    purpose:
      "Have the agent review all running workstreams, close out dead ends, organize active items, and draft the next actions.",
    text: "Review all of my currently active tasks, open threads, and running projects across this workspace. Give me an executive triage: tell me which items are ready to be finalized and closed right now, which ones are no longer useful and should be abandoned, and how the rest should be renamed and prioritized. For every remaining active item, write the exact prompt or action I should send next to move it forward.",
    words: 71,
    pattern: "Triage",
  },
  {
    order: 25,
    id: "4.3",
    title: "Communication & Inbox Stream Triage",
    purpose:
      "Replace compulsive inbox and notification checking with an agent audit that surfaces only what requires action.",
    text: "Scan across my connected communication streams, messages, and recent updates. Filter out all routine noise and give me a concise briefing of only what genuinely matters today: urgent requests waiting on my decision, unexpected billing or status alerts, and high-priority threads. For anything that requires action or investigation, draft the response or kick off the underlying investigation automatically.",
    words: 58,
    pattern: "Triage",
  },
  {
    order: 26,
    id: "4.4",
    title: "Scattered Record & Document Collection",
    purpose:
      "Have the agent gather, organize, and standardize files across disparate locations instead of writing custom scripts.",
    text: "Go through all the connected folders, portals, and document repositories available in this environment to collect every file and record related to our current task. Organize them into a clean, consistent structure, standardize the filenames by date and subject, extract the key facts from each document into a master summary, and tell me if any expected records are missing.",
    words: 59,
    pattern: "Execute",
  },
  {
    order: 27,
    id: "4.5",
    title: "Interactive Problem Unblocking",
    purpose:
      "Let the agent guide you through a messy, multi-branch problem conversationally, asking for screenshots or files as needed.",
    text: "I am running into a frustrating issue and want you to act as an interactive triager to unblock me. Start by asking me to describe what is going wrong in my own words and tell me what screenshots, files, or error messages would be helpful for me to paste directly into this chat. Ask follow-up questions anywhere my description is vague, inspect everything you have access to in this environment, and walk me step by step to the simplest working resolution.",
    words: 81,
    pattern: "Interactive",
  },
  {
    order: 28,
    id: "4.6",
    title: "Pre-Share Privacy & Secret Scrubbing",
    purpose:
      "Clean all sensitive credentials, personal data, and private identifiers before sharing or filing any output.",
    text: "Before I share, export, or publish the material and logs we have been working with in this thread, perform a thorough privacy and security scrub. Scan everything we have generated and referenced to strip out all API keys, credentials, internal paths, personal identifiers, financial figures, and confidential details, while preserving all the context needed for someone else to understand the issue.",
    words: 61,
    pattern: "Execute",
  },
  {
    order: 29,
    id: "4.7",
    title: "Workflow-to-Pipeline Bridge Identification",
    purpose:
      "Identify where connecting two data sources or tools would let the agent automate an entire multi-step chain end-to-end.",
    text: "Look at the manual steps I have been performing to move information between my messages, dashboards, documents, and workspaces. Identify the highest-friction bottlenecks where I am acting as a human copy-paste bridge. Tell me what specific data connections, permissions, or integrations I should link to your environment so that next time an alert or request arrives, you can trace it, investigate the system, and execute the fix end-to-end.",
    words: 68,
    pattern: "Codify",
  },
  {
    order: 30,
    id: "5.1",
    title: "Environment & Tool-Call Latency Audit",
    purpose:
      "Audit the agent’s own historical tool calls and command executions on the machine to find slow operations and shell/environment mismatches.",
    text: "Audit the history of all tool calls, shell commands, and operations that agents have executed in this environment. Break down how long each type of tool call and search operation is taking so we can see which commands are the slowest and which ones are failing or retrying most often. Identify any syntax mismatches with our local shell or OS environment, flag runaway directory searches, and give me specific recommendations to optimize this machine for faster, error-free agent runs.",
    words: 79,
    pattern: "Audit",
  },
  {
    order: 31,
    id: "5.2",
    title: "Context Window & Payload Visualizer",
    purpose:
      "Break down and visualize everything currently consuming the context window to catch hidden token bloat.",
    text: "Break down how our current context window is being used in this thread and build a clean visual representation of it. Show me the exact proportions consumed by system instructions, environment dumps, tool definitions, file reads, and conversation history. Flag any unexpectedly large injections, redundant data, or hidden overhead that is bloating our requests without adding value.",
    words: 57,
    pattern: "Visualize",
  },
  {
    order: 32,
    id: "5.3",
    title: "Full Capability & Harness Introspection",
    purpose:
      "Ask the agent to exhaustively describe every tool, interface control, and verification mechanism available in its current context.",
    text: "Describe in complete detail all of the capabilities, tools, environment access, and computer-use actions that you currently have access to in this session. Include how you discover and interact with applications, how you read interfaces and files, what input actions you can perform, and how you verify your own results. Give me a comprehensive inventory of everything present in your current harness and context window.",
    words: 65,
    pattern: "Audit",
  },
  {
    order: 33,
    id: "5.4",
    title: "Cross-Environment Capability Diff & Cloning",
    purpose:
      "Compare the current agent harness against another environment’s capabilities and replicate what is missing.",
    text: "Compare the capabilities, tools, and system access you have in this environment against the capabilities I just described from another tool. Summarize the exact differences, highlight what you currently have less access to here, and design and implement equivalents for as many of those missing capabilities, scripts, and verification workflows as possible within our current setup.",
    words: 56,
    pattern: "Audit",
  },
  {
    order: 34,
    id: "5.5",
    title: "Post-Mortem Failure & Omission Interrogation",
    purpose:
      "Ask the agent directly why it failed to perform an expected step or solve a problem, and what tool it needed.",
    text: "Look back at your previous response and execution attempt. Why didn’t you verify the output visually or catch the issue before finishing? Explain specifically what prevented you from figuring out the problem or completing that step—whether it was a missing tool, lack of visibility into the running state, or a flawed assumption—and tell me what tool or access we should add right now so you can do it automatically on every future run.",
    words: 73,
    pattern: "Audit",
  },
  {
    order: 35,
    id: "5.6",
    title: "Cross-Thread Transcript Diagnostic",
    purpose:
      "Have an agent read the transcript of another agent session to diagnose where its reasoning or tool usage went wrong.",
    text: "Read through the full transcript and execution history from the other thread I provided. Analyze where the agent got stuck, which assumptions were wrong, which tool calls failed or returned misleading data, and why the issue was never fully resolved. Give me a clear post-mortem of what went wrong and execute the corrected approach right here.",
    words: 56,
    pattern: "Audit",
  },
  {
    order: 36,
    id: "5.7",
    title: "Recurring Instruction to Skill & Memory Codification",
    purpose:
      "Detect repeated user instructions and convert them into permanent skills and project configuration files.",
    text: "Analyze our conversation history to find instructions, preferences, sub-agent delegation patterns, and workflows that I have had to ask for more than once. Extract those recurring patterns and package them into permanent workspace instructions and reusable skill definitions so that you and any future agents in this project apply them automatically by default.",
    words: 53,
    pattern: "Codify",
  },
  {
    order: 37,
    id: "5.8",
    title: "Prompt & Mindset Elevation Critique",
    purpose:
      "Prompt about your prompts—ask the agent where you are thinking too narrowly or over-engineering instructions instead of asking for bigger outcomes.",
    text: "Critique how I have been prompting you and using agents across our recent work. Point out where I am still trapped in a narrow, step-by-step box—where I am over-engineering my prompts, micromanaging implementation details, or building manual workarounds for things I could simply ask you to handle end-to-end. Show me how I could be prompting much harder to get bigger outcomes with less friction.",
    words: 64,
    pattern: "Audit",
  },
  {
    order: 38,
    id: "1.9",
    title: "Backlog & Worktree Branch Triage",
    purpose:
      "Audit all local branches, stashes, and open issues to close dead experiments, merge ready work, and generate next-step implementation prompts.",
    text: "Inspect all open git branches, uncommitted worktrees, stashes, and linked issue threads across this repository. Give me a decisive engineering triage: identify which branches are verified and ready to merge right now, which abandoned experiments or redundant PRs should be closed and deleted, and which in-progress changes conflict or overlap. For every active branch worth finishing, write the exact command or prompt I should run next to ship it cleanly.",
    words: 70,
    pattern: "Triage",
  },
  {
    order: 39,
    id: "1.10",
    title: "Dependency & Feature Surface Triage",
    purpose:
      "Evaluate installed libraries, internal helpers, and UI endpoints to strip dead weight and replace heavy dependencies with native primitives.",
    text: "Scan our dependency manifest, internal utility modules, and exposed feature endpoints across this codebase. Triage everything into three buckets: foundational primitives we actively rely on, bloated libraries or fragile wrappers that you can replace with a few lines of native code, and dead features or unused endpoints that should be deleted immediately. Execute the cleanup plan and verify that the test suite and runtime still pass.",
    words: 66,
    pattern: "Triage",
  },
  {
    order: 40,
    id: "1.11",
    title: "Review Feedback & Convention Codification",
    purpose:
      "Extract repeated code review corrections and architectural fixes from recent sessions into durable repository instructions and lint rules.",
    text: "Review the diffs, refactors, and code corrections I have asked you to make across our recent engineering sessions. Identify every recurring pattern in what I keep fixing—including error handling conventions, state ownership rules, naming boundaries, and test assertions. Distill these unspoken standards into a permanent repository instruction file and automated check scripts so you and future agents enforce them automatically before finishing any task.",
    words: 64,
    pattern: "Codify",
  },
  {
    order: 41,
    id: "1.12",
    title: "Ad-Hoc Script to Agent Primitive Codification",
    purpose:
      "Convert one-off debugging commands and database queries from the chat history into clean, callable CLI primitives for future agent runs.",
    text: "Look through the one-off shell commands, inspection scripts, and database queries we have cobbled together during this debugging session. Instead of letting those workflows vanish in the chat history or building a bloated admin UI around them, package the highest-leverage operations into clean, composable CLI primitives with structured output and a concise markdown skill so you can invoke them directly on demand.",
    words: 62,
    pattern: "Codify",
  },
  {
    order: 42,
    id: "1.13",
    title: "Interactive Architecture & Constraint Elicitation",
    purpose:
      "Have the agent interview you about edge cases, load realities, and non-goals before writing a single line of schema or system code.",
    text: "Before you write any code or lock in a schema for this system change, act as an interactive staff engineer and interview me. Inspect the existing codebase first so you do not ask obvious questions, then ask me targeted follow-up questions about real-world traffic patterns, failure tolerance, state recovery, and what we explicitly refuse to build. Once we have eliminated every ambiguous assumption together, execute the simplest primitive architecture directly.",
    words: 70,
    pattern: "Interactive",
  },
  {
    order: 43,
    id: "1.14",
    title: "Interactive Edge-Case & Invariant Probe",
    purpose:
      "Walk through tricky state transitions conversationally with live runtime probes to uncover unspoken domain invariants.",
    text: "We have subtle edge cases hiding in this module's state transitions. Do not write a massive speculative test matrix yet—walk through the suspicious scenarios with me interactively. Run small live probes against the code, show me the actual outputs for ambiguous inputs, and ask me in plain terms what the domain invariant should be whenever behavior looks questionable. Once we confirm the exact rules, lock them in with targeted verification tests.",
    words: 71,
    pattern: "Interactive",
  },
  {
    order: 44,
    id: "1.15",
    title: "Parallel Refactor & Minimal-Diff Bakeoff",
    purpose:
      "Launch parallel sub-agents to attempt a surgical patch versus a clean primitive redesign and compare verified test outcomes.",
    text: "Spin up two parallel delegates in isolated worktrees to solve this architectural bottleneck using competing strategies: have one delegate craft the smallest, lowest-risk surgical patch to the existing code, and have the other redesign the underlying primitive cleanly from first principles. Have both delegates run the full verification suite and benchmark their results, then compare the diffs side by side so we can merge the stronger implementation.",
    words: 67,
    pattern: "Parallel agents",
  },
  {
    order: 45,
    id: "1.16",
    title: "Parallel Adversarial Bug-Hunt & Fuzzing",
    purpose:
      "Pit one sub-agent building and hardening a feature against a parallel sub-agent actively trying to break it with live inputs.",
    text: "Spin up two parallel delegates to stress-test the code we just wrote: task the first delegate with generating adversarial inputs, concurrency races, and malformed payloads to break the running implementation, while the second delegate traces the live failure states and hardens the underlying primitives. Reconcile their findings into a minimal, verified patch with reproducible regression proof.",
    words: 56,
    pattern: "Parallel agents",
  },
  {
    order: 46,
    id: "1.17",
    title: "Ephemeral Diff & Blast-Radius Visualizer",
    purpose:
      "Generate a disposable interactive visual map of a complex pull request showing call-graph impact and verification coverage.",
    text: "This change touches too many files to review safely as a flat text diff. Generate a standalone, self-contained interactive visual map of our current branch that groups modifications by architectural layer, traces the downstream blast radius across callers and state stores, and highlights which modified code paths have been verified by live execution versus left untested.",
    words: 56,
    pattern: "Visualize",
  },
  {
    order: 47,
    id: "1.18",
    title: "Ephemeral Schema & Query Lineage Visualizer",
    purpose:
      "Build a one-off visual inspector for data transformations, schema relationships, and query bottlenecks without adding permanent admin tooling.",
    text: "Instead of building an internal admin page to inspect our data layer, inspect our current schemas, migrations, and live query plans and generate a standalone interactive visual explorer right now. Map out how records flow across tables, where N+1 queries or lock contentions happen under load, and which fields are redundant so we can spot structural simplifications at a glance.",
    words: 60,
    pattern: "Visualize",
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
    order: 58,
    id: "3.8",
    title: "Source Credibility & Signal-to-Noise Triage",
    purpose:
      "Audit a pile of collected papers, docs, and benchmarks to discard secondary fluff and rank primary sources worth deep analysis.",
    text: "Go through all the papers, articles, benchmark logs, and reference files we have dropped into this workspace. Run a strict source triage: separate primary empirical artifacts and first-hand technical post-mortems from derivative summaries, marketing fluff, or outdated speculation. Archive the low-signal material, rank the primary sources by direct relevance to our core question, and extract the verified claims from the top tier right now.",
    words: 64,
    pattern: "Triage",
  },
  {
    order: 59,
    id: "3.9",
    title: "Open Hypothesis & Investigation Queue Triage",
    purpose:
      "Prioritize competing research questions by decision impact so you stop rabbit-holing on low-leverage curiosities.",
    text: "Review all the open research questions, unresolved anomalies, and side investigations we have accumulated in this project. Triage the queue by actual decision leverage: identify which questions will directly change what we build or decide today, which ones can be answered immediately with data already in this environment, and which low-impact rabbit holes we should close out immediately. Execute the highest-leverage check first.",
    words: 63,
    pattern: "Triage",
  },
  {
    order: 60,
    id: "3.10",
    title: "Recurring Evaluation Rubric & Benchmark Codification",
    purpose:
      "Distill ad-hoc vendor, model, or architecture comparisons into a standardized, repeatable evaluation skill and scoring harness.",
    text: "Look at the criteria, stress tests, failure checks, and cost calculations we used to evaluate options in this research thread. Instead of reinventing our comparison methodology from scratch next time, codify this exact evaluation rubric and data-collection workflow into a reusable markdown skill and lightweight verification script so future evaluations run against the exact same standard automatically.",
    words: 57,
    pattern: "Codify",
  },
  {
    order: 61,
    id: "3.11",
    title: "Data Cleaning & Normalization Playbook Codification",
    purpose:
      "Capture the exact heuristics used to clean, join, and deduplicate messy raw exports into a reusable research skill.",
    text: "Review all the schema mappings, unit conversions, outlier filters, and deduplication rules you just applied to unify our raw research exports. Package those exact normalization heuristics and validation assertions into a clean markdown playbook and callable helper primitive so that whenever new raw data drops into this workspace, you can ingest, verify, and merge it into the master dataset in one step.",
    words: 62,
    pattern: "Codify",
  },
  {
    order: 62,
    id: "3.12",
    title: "Interactive Hypothesis & Scope Narrowing",
    purpose:
      "Have the agent interview you to sharpen a broad research prompt into falsifiable questions tied to a real decision before searching.",
    text: "Before you launch a massive, sprawling research sweep on this topic, act as an interactive research partner to narrow our scope. Ask me targeted questions about what concrete decision depends on this answer, what constraints or disqualifiers already rule out half the field, and what baseline data or screenshots I can drop into this chat right now. Once we have locked onto a sharp, falsifiable question, execute the deep investigation.",
    words: 70,
    pattern: "Interactive",
  },
  {
    order: 63,
    id: "3.13",
    title: "Interactive Anomaly & Domain Context Interrogation",
    purpose:
      "Combine automated statistical anomaly detection with an interactive interview to separate real breakthroughs from logging artifacts.",
    text: "Scan our dataset and surface the top statistical anomalies, sudden regime shifts, and unexpected correlations that stand out in the raw numbers. Instead of guessing what caused them in a vacuum, walk through each anomaly with me interactively: show me the exact slice of data, ask me what operational events or unlogged real-world changes happened around those timestamps, and help me separate genuine insights from instrumentation noise.",
    words: 67,
    pattern: "Interactive",
  },
  {
    order: 64,
    id: "3.14",
    title: "Parallel Multi-Corpus & Method Triangulation",
    purpose:
      "Dispatch parallel sub-agents across distinct data sources—quantitative logs, qualitative user transcripts, and external benchmarks—to triangulate truth.",
    text: "Spin up three parallel research delegates to investigate this question across completely independent evidence streams: have one analyze our raw quantitative telemetry and logs, have the second mine qualitative user reports and support transcripts, and have the third gather external benchmarks and primary literature. Cross-examine where all three streams agree, expose where they contradict each other, and synthesize a verified conclusion.",
    words: 61,
    pattern: "Parallel agents",
  },
  {
    order: 65,
    id: "3.15",
    title: "Parallel Devil's Advocate & Pre-Mortem Red-Team",
    purpose:
      "Run a parallel red-team sub-agent to attack your emerging research conclusion using the same primary dataset.",
    text: "We are converging on a recommendation, and I want to make sure confirmation bias is not blinding us. Spin up two parallel delegates over our primary data: task one with building the strongest case for our current conclusion, and task the other with acting as a ruthless red-team that searches the exact same raw records for survivorship bias, confounding variables, and counterexamples. Present the clash and tell me what actually holds up.",
    words: 72,
    pattern: "Parallel agents",
  },
  {
    order: 66,
    id: "3.16",
    title: "Ephemeral Contradiction & Citation Graph Visualizer",
    purpose:
      "Generate a standalone interactive visual map showing which claims in a research corpus corroborate or contradict each other.",
    text: "Instead of giving me a long prose literature review, build a standalone, self-contained interactive visual map of all the sources and data points in this workspace. Visually connect claims that corroborate each other, highlight direct contradictions between sources, and trace which secondary assertions actually rest on a single unverified origin, so I can inspect the evidence topology at a glance.",
    words: 60,
    pattern: "Visualize",
  },
  {
    order: 67,
    id: "3.17",
    title: "Ephemeral Sensitivity & Tradeoff Simulator",
    purpose:
      "Turn static research estimates into an interactive visual simulator where you can drag assumptions and see when conclusions flip.",
    text: "Our research conclusion depends on several uncertain assumptions around volume, latency, and cost. Build a standalone interactive visual simulator right now using the numbers we have gathered so I can adjust the key input assumptions with live sliders, see the exact threshold where one option overtakes another, and identify which single variable drives the most variance.",
    words: 56,
    pattern: "Visualize",
  },
  {
    order: 68,
    id: "4.8",
    title: "Recurring Commitment & Calendar Load Triage",
    purpose:
      "Audit upcoming meetings, recurring obligations, and open commitments to cancel low-leverage blocks and draft async replacements.",
    text: "Scan my schedule, recurring obligations, and open commitments across this workspace for the next two weeks. Give me a ruthless time triage: flag meetings where the outcome can be resolved asynchronously right now, identify stale recurring syncs that should be canceled or cut in half, and highlight high-stakes blocks that need preparation. Draft the async resolution messages and prep briefings immediately so I can reclaim the hours.",
    words: 67,
    pattern: "Triage",
  },
  {
    order: 69,
    id: "4.9",
    title: "Decision Bottleneck & Approval Queue Triage",
    purpose:
      "Surface every blocked decision waiting on your input across threads, sort by reversibility, and pre-draft the unblocking responses.",
    text: "Search across all open threads, documents, and pending requests in this workspace to find everywhere someone or something is blocked waiting on my decision. Triage every bottleneck into two groups: reversible two-way-door decisions where you can recommend a default and draft the approval right now, and high-stakes one-way-door choices that genuinely require my judgment. Present the crucial tradeoffs for the hard ones and clear the rest.",
    words: 66,
    pattern: "Triage",
  },
  {
    order: 70,
    id: "4.10",
    title: "Ad-Hoc Process to Autonomous Playbook Codification",
    purpose:
      "Turn a messy multi-step operational chore you just finished with the agent into a one-command markdown playbook.",
    text: "Look back at the multi-step operational chore we just completed together across these files, portals, and messages. Strip out all the false starts and back-and-forth clarifications we went through, and codify the exact working sequence—including file paths, validation checks, edge-case rules, and output formatting—into a self-contained markdown playbook so you can execute the entire chore autonomously from a single trigger next time.",
    words: 62,
    pattern: "Codify",
  },
  {
    order: 71,
    id: "4.11",
    title: "Personal Decision Criteria & Constraint Codification",
    purpose:
      "Extract your implicit priorities, dealbreakers, and tradeoffs from past decisions into a reusable filter skill.",
    text: "Review the choices, rejections, and tradeoffs I have made across our recent planning, purchasing, and prioritization threads. Identify the underlying decision rules I consistently apply—what I optimize for, what hidden costs I refuse to accept, and what signals I trust most. Distill those principles into a reusable decision-filter skill so you can pre-screen future options and surface only what fits my actual constraints.",
    words: 63,
    pattern: "Codify",
  },
  {
    order: 72,
    id: "4.12",
    title: "Interactive Decision & Tradeoff Elicitation",
    purpose:
      "Have the agent guide you through a complex multi-variable choice conversationally instead of building a sprawling comparison spreadsheet.",
    text: "I am stuck choosing between several complex options and do not want to spend hours building a weighted spreadsheet. Act as an interactive decision strategist: inspect the materials and quotes in this workspace, then ask me sharp, one-at-a-time questions to uncover my real constraints, worst-case tolerances, and non-negotiables in my own words. Eliminate the dominated options as we go and take me straight to the clearest choice.",
    words: 67,
    pattern: "Interactive",
  },
  {
    order: 73,
    id: "4.13",
    title: "Interactive Artifact & Messy Workspace Onboarding",
    purpose:
      "Drop the agent into a chaotic folder of screenshots, receipts, or notes and let it interview you to organize and execute the outcome.",
    text: "I have dumped a chaotic mix of screenshots, exports, half-written notes, and files into this workspace for a task I need to finish today. Inspect everything first to piece together as much context as you can on your own, then ask me targeted follow-up questions only where an artifact is ambiguous or a goal is unclear. Once I fill in the blanks, execute the final organized deliverable directly.",
    words: 68,
    pattern: "Interactive",
  },
  {
    order: 74,
    id: "4.14",
    title: "Parallel Scenario & Contingency Simulation",
    purpose:
      "Launch parallel sub-agents to stress-test a plan under optimistic, baseline, and failure scenarios before committing.",
    text: "Spin up three parallel delegates to pressure-test the operational plan we are about to execute: have one simulate a high-demand surge where everything happens twice as fast as expected, have the second model a key vendor or dependency failing mid-stream, and have the third audit cost and resource burn under baseline conditions. Synthesize their findings into three concrete pre-emptive safeguards we can apply right now.",
    words: 65,
    pattern: "Parallel agents",
  },
  {
    order: 75,
    id: "4.15",
    title: "Parallel Option Scouting & Negotiation Prep",
    purpose:
      "Use parallel sub-agents to independently evaluate competing vendors, contracts, or routes and synthesize leverage points.",
    text: "Spin up parallel delegates to independently dissect each of the competing proposals, contracts, or options in this workspace. Have each delegate extract the true all-in cost, hidden lock-in clauses, delivery risks, and missing guarantees for its assigned option, then bring their findings together into a unified comparison with the exact counter-offers and questions I should send right now.",
    words: 58,
    pattern: "Parallel agents",
  },
  {
    order: 76,
    id: "4.16",
    title: "Ephemeral Dependency & Timeline Visualizer",
    purpose:
      "Generate a disposable interactive visual map of project dependencies, critical paths, and bottlenecks without setting up PM software.",
    text: "Instead of setting up and maintaining a heavy project management tool, read through our current notes, tasks, and deadlines in this workspace and generate a standalone interactive visual timeline right now. Highlight the critical path, expose hidden sequential blockers that could be parallelized, and show me visually which single delay would push back the entire outcome.",
    words: 56,
    pattern: "Visualize",
  },
  {
    order: 77,
    id: "4.17",
    title: "Manual Workaround & Shadow-System Audit",
    purpose:
      "Audit your workspace for brittle spreadsheets, checklists, and manual trackers that should be replaced by direct agent outcomes.",
    text: "Audit the spreadsheets, recurring checklists, templates, and manual tracking files across this workspace. Identify where I have built brittle shadow systems or repetitive busywork just to keep track of state that you could query, verify, and summarize directly from the underlying sources on demand. Show me which trackers we can retire today and execute their underlying outcomes directly.",
    words: 58,
    pattern: "Audit",
  },
  {
    order: 78,
    id: "5.9",
    title: "Skill Library & Workspace Instruction Triage",
    purpose:
      "Audit all loaded skills, memory files, and workspace rules to prune conflicting instructions and merge redundant playbooks.",
    text: "Inspect all of the system instructions, workspace configuration files, memory rules, and custom skills currently loaded or stored in this project. Give me a clean meta-triage: identify which rules contradict each other, which bloated instructions are wasting context tokens on edge cases that never happen, and which overlapping skills should be merged or deleted. Rewrite and compact the surviving instructions immediately.",
    words: 61,
    pattern: "Triage",
  },
  {
    order: 79,
    id: "5.10",
    title: "Open Agent Thread & Session History Triage",
    purpose:
      "Scan active and recent agent sessions to close loops, salvage unmerged work, and archive dead-end threads.",
    text: "Scan across our recent agent session transcripts, scratchpads, and unfinished threads in this environment. Triage the state of our agent workflows: highlight sessions that produced valuable outputs or code that we never merged or applied, identify stuck loops that should be abandoned, and generate the exact handoff prompts needed to finish the remaining high-value work in clean threads.",
    words: 58,
    pattern: "Triage",
  },
  {
    order: 80,
    id: "5.11",
    title: "Self-Verification Loop & Proof Codification",
    purpose:
      "Convert the verification steps an agent needed to prove its work was correct into a mandatory pre-completion harness rule.",
    text: "Look at the verification commands, visual checks, and live assertions we had to run at the end of this session to prove the output actually worked. Codify this exact self-verification loop into our permanent workspace instructions and skill harness so that you never mark a task complete in the future without automatically executing the work, inspecting the live result, and capturing proof first.",
    words: 63,
    pattern: "Codify",
  },
  {
    order: 81,
    id: "5.12",
    title: "Sub-Agent Delegation Topology Codification",
    purpose:
      "Package a successful multi-agent exploration, bakeoff, and synthesis workflow into a reusable orchestration skill.",
    text: "Review how we just decomposed this problem across parallel sub-agents, isolated their workspaces, prevented them from stepping on each other, and synthesized their verified results. Distill that exact orchestration topology—including prompt scoping, handoff criteria, and synthesis rules—into a reusable markdown delegation skill so we can trigger the same parallel pattern on future problems in one sentence.",
    words: 56,
    pattern: "Codify",
  },
  {
    order: 82,
    id: "5.13",
    title: "Interactive Harness & Permission Onboarding",
    purpose:
      "Have the agent inspect your machine and interactively walk you through connecting the high-leverage CLIs, logs, and permissions it lacks.",
    text: "Inspect your current environment, available CLIs, file access, and verification tools relative to the projects we work on here. Then act as an interactive harness architect: ask me one question at a time about what external services, local databases, browser views, or log streams exist in my workflow, and guide me step by step to expose those exact primitives so you can operate end-to-end without me in the loop.",
    words: 69,
    pattern: "Interactive",
  },
  {
    order: 83,
    id: "5.14",
    title: "Interactive Prompt & Playbook Co-Design",
    purpose:
      "Collaborate with the agent interactively to turn a vague recurring goal into a battle-tested, outcome-oriented markdown skill.",
    text: "I want to create a reusable agent skill for a workflow I run repeatedly, but I do not want to over-specify brittle step-by-step instructions. Interview me interactively to uncover what final outcome actually matters, what local tools and data pipes you can already inspect on your own, and where human judgment is genuinely required. Once we strip the workflow down to its essential primitives, write and test the skill right here.",
    words: 71,
    pattern: "Interactive",
  },
  {
    order: 84,
    id: "5.15",
    title: "Parallel Prompt Strategy & Framing Bakeoff",
    purpose:
      "Test an outcome-first prompt against a step-by-step procedural prompt in parallel sub-agents to prove which framing yields better results.",
    text: "Spin up two parallel delegates to tackle our current task using opposite prompting philosophies: give one delegate a rigid, step-by-step procedural checklist, and give the other only the desired end-state outcome, guardrails, and access to our workspace primitives. Compare their execution speed, tool-call efficiency, and output quality side by side, and update our project playbooks with the winning approach.",
    words: 59,
    pattern: "Parallel agents",
  },
  {
    order: 85,
    id: "5.16",
    title: "Parallel Independent Verification & Judge Ensemble",
    purpose:
      "Dispatch parallel sub-agents to independently verify a complex agent output from different angles before accepting it.",
    text: "Before we trust the output from this complex run, spin up two independent verification delegates with zero visibility into each other's reasoning: have one verify every claim and code path by executing live probes against the environment, and have the other audit the output for silent omissions, edge-case regressions, and unstated assumptions. Reconcile both verification reports and fix any discrepancy automatically.",
    words: 61,
    pattern: "Parallel agents",
  },
  {
    order: 86,
    id: "5.17",
    title: "Ephemeral Agent Execution & Tool-Chain Visualizer",
    purpose:
      "Build an interactive visual timeline of an agent run showing tool calls, retries, dead ends, and verification checkpoints.",
    text: "Take the execution trace and tool-call history from our current session and generate a standalone, self-contained interactive visual timeline. Map out every search, file read, shell execution, retry loop, and sub-agent handoff visually so we can see exactly where time and tokens were spent, where the agent hit dead ends, and how we can streamline the harness.",
    words: 57,
    pattern: "Visualize",
  },
  {
    order: 87,
    id: "5.18",
    title: "Live Harness Self-Upgrade & Primitive Bootstrap",
    purpose:
      "Have the agent directly build, wire up, and verify the missing CLI tools or helper scripts it needs in its own environment.",
    text: "Do not just give me a list of recommendations for what tools or observability helpers are missing from your environment—build and wire up those primitives right now. Write the lightweight CLI wrappers, log-tailing helpers, or verification scripts you need to see and test this system directly, verify that they execute cleanly in your shell, and immediately use them to complete our current task.",
    words: 63,
    pattern: "Execute",
  },
  {
    order: 88,
    id: "1.19",
    title: "Recurring Bug Class & Guardrail Codification",
    purpose:
      "Turn a one-off bug fix into a systemic sweep and permanent guardrail that prevents the entire class of failure across the codebase.",
    text: "Do not treat this bug as an isolated one-off patch. After you identify the root cause, analyze the underlying pattern that allowed this class of failure to happen in the first place. Scan the entire codebase for every sibling occurrence of the same anti-pattern or missing check, fix them all together, and codify a lightweight automated check or workspace rule so that you and future agents catch this entire bug class before finishing any task.",
    words: 75,
    pattern: "Codify",
  },
  {
    order: 89,
    id: "1.20",
    title: "Legacy & Tech-Debt Triage Sweep",
    purpose:
      "Programmatically audit dead code, stale flags, and half-finished migrations to decide what to delete immediately and what to consolidate.",
    text: "Scan this repository for dead code paths, unused dependencies, stale feature flags, half-completed migrations, and temporary workarounds that have outlived their purpose. Give me a ruthless triage report: separate what can be safely deleted right now with zero behavior change, what should be consolidated into a single clean pattern, and what legacy areas are stable enough to leave alone. Execute the safe deletions first and verify that all checks still pass.",
    words: 71,
    pattern: "Triage",
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
    order: 92,
    id: "3.18",
    title: "Interactive Decision & Trade-Off Matrix",
    purpose:
      "Have the agent interview you to establish your true constraints and weighting criteria before translating research into a concrete recommendation.",
    text: "We have gathered plenty of raw research and options, and now we need to make a definitive choice. Before you rank the options, interview me interactively to lock down our real constraints, non-negotiable requirements, risk tolerance, and what trade-offs we are actually willing to accept. Once my answers are clear, evaluate every option against those exact criteria using our verified research data and give me a decisive recommendation.",
    words: 68,
    pattern: "Interactive",
  },
  {
    order: 93,
    id: "3.19",
    title: "Repeatable Research Playbook Codification",
    purpose:
      "Extract the exact query patterns, data normalization steps, and verification rules from a successful investigation into a reusable skill.",
    text: "Review the entire investigation we just completed—including which sources yielded the highest-signal data, how we cleaned and cross-referenced the records, what false leads we had to discard, and how we verified the final numbers. Distill this methodology into a clean, repeatable research playbook so that next time new data drops or we need to refresh this analysis, you can execute the entire investigation end-to-end from a single prompt.",
    words: 68,
    pattern: "Codify",
  },
  {
    order: 94,
    id: "4.18",
    title: "Parallel Scenario & Pre-Mortem Simulation",
    purpose:
      "Launch parallel delegates to stress-test a major plan across failure modes, resource bottlenecks, and second-order effects before execution.",
    text: "Before we commit to this plan, spin up parallel delegates to stress-test it from distinct operational angles: have one delegate run a ruthless pre-mortem assuming the rollout failed six months from now, have a second model out hidden resource and dependency bottlenecks, and have a third look for simpler ways to get eighty percent of the value in a fraction of the time. Synthesize their findings into a hardened execution plan.",
    words: 71,
    pattern: "Parallel agents",
  },
  {
    order: 95,
    id: "4.19",
    title: "Ephemeral Operations & Dependency Visualizer",
    purpose:
      "Generate a one-off visual map of timelines, dependencies, or resource allocation directly from raw workspace notes without setting up project management software.",
    text: "Instead of setting up and maintaining a heavyweight project tracker, read through all the plans, dates, owners, and open blockers across our workspace notes and generate a standalone, interactive visual map right now. Show me the critical path, sequencing dependencies, resource bottlenecks, and overdue items visually so we can spot collisions immediately and adjust the plan on the fly.",
    words: 59,
    pattern: "Visualize",
  },
  {
    order: 96,
    id: "5.19",
    title: "Skill & Workspace Instruction Pruning Triage",
    purpose:
      "Audit all accumulated skills, memory files, and workspace rules to delete stale directives, resolve contradictions, and merge overlapping playbooks.",
    text: "Inspect every custom instruction file, memory entry, and saved skill currently active in this workspace. Perform a clean-up triage: identify rules that contradict each other, outdated workarounds for problems that no longer exist, overly verbose playbooks that waste context tokens, and overlapping skills that should be merged. Show me what to delete, what to consolidate, and rewrite our workspace instructions so they are lean, high-signal, and unambiguous.",
    words: 67,
    pattern: "Triage",
  },
  {
    order: 97,
    id: "5.20",
    title: "Autonomous Verification Loop Construction",
    purpose:
      "Have the agent build a fast, self-contained verification harness so it can autonomously test and iterate on its own work without human babysitting.",
    text: "Right now I am acting as the manual verification loop for your work by checking your output and telling you what broke. Design and set up a fast, automated verification check in this environment—whether that is a lightweight assertion script, a headless interface check, or a ground-truth comparison—so that you can execute changes, run the verification yourself, see the exact failure output, and iterate autonomously until the result is proven correct.",
    words: 71,
    pattern: "Execute",
  },
  {
    order: 98,
    id: "1.21",
    title: "Runtime Memory & Execution Hot-Path Visualizer",
    purpose:
      "Generate an interactive visual breakdown of memory layout, allocations, and hot-loop execution before writing optimization code.",
    text: "Instead of guessing where frame drops, memory churn, or query latency are coming from, inspect our hot execution paths and generate a standalone interactive visual breakdown of memory allocations, call depth, and data movement across a full cycle. Highlight every unnecessary copy, cache miss risk, and blocking call so we can pinpoint the exact bottleneck visually before touching a single line of code.",
    words: 63,
    pattern: "Visualize",
  },
  {
    order: 99,
    id: "1.22",
    title: "Interactive Architecture & Dependency Uncoupling",
    purpose:
      "Have the agent inspect build targets and interview you on API boundary constraints before executing a multi-file refactoring end-to-end.",
    text: "We need to untangle a tightly coupled module in this repository without breaking downstream callers. Before proposing a file layout or moving headers around, inspect the dependency graph and interview me interactively about which boundaries need to stay stable, which internals should be hidden, and how the build target is consumed. Once we lock down the contract, execute the refactoring and verify the build end-to-end.",
    words: 65,
    pattern: "Interactive",
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
    order: 102,
    id: "3.20",
    title: "Autonomous Schema & Corpus Discovery",
    purpose:
      "Point the agent at an unfamiliar database or repository and have it autonomously map schemas, relationships, and anomalies without manual hand-holding.",
    text: "Point yourself directly at this unfamiliar database, codebase, or raw archive and map out its structure without waiting for me to explain the schema. Run exploratory queries and file inspections to discover the core tables, entity relationships, edge-case anomalies, and undocumented conventions on your own, then hand me a verified architectural map and the highest-leverage questions we can answer with this data.",
    words: 62,
    pattern: "Execute",
  },
  {
    order: 103,
    id: "3.21",
    title: "Primary-Artifact Signal-to-Noise Triage",
    purpose:
      "Filter a pile of repositories, papers, and references down to original implementations and empirical benchmarks before deep analysis.",
    text: "Scan all the candidate repositories, articles, datasets, and references we have collected for this topic. Triage them by actual primary-source signal: separate original implementations and raw empirical benchmarks from derivative summaries, outdated forks, and surface-level commentary. Archive the low-signal noise and focus our deep analysis exclusively on the primary artifacts that actually prove how the system works.",
    words: 57,
    pattern: "Triage",
  },
  {
    order: 104,
    id: "4.20",
    title: "Manual Glue & Friction Audit",
    purpose:
      "Audit recent workstreams to find where you are still acting as manual glue for setup, file organization, or status checks.",
    text: "Examine how we have been moving tasks from idea to completion across our recent sessions. Audit where I am still doing repetitive manual setup, file renaming, environment bootstrapping, or status checking that adds zero creative value. Rank those friction points by how much momentum they drain and show me which ones you can take over completely starting today.",
    words: 58,
    pattern: "Audit",
  },
  {
    order: 105,
    id: "4.21",
    title: "One-Off Resolution to Playbook Codification",
    purpose:
      "Turn a messy multi-turn troubleshooting or operational win into a single reusable command playbook before closing the session.",
    text: "We just spent multiple turns figuring out the right sequence of steps to solve a messy operational problem. Before we close this thread, extract the exact winning sequence, edge-case checks, and verification commands we discovered, and codify them into a single self-contained playbook file so that next time this situation comes up, a single command runs the whole resolution.",
    words: 59,
    pattern: "Codify",
  },
  {
    order: 106,
    id: "5.21",
    title: "Adversarial Builder-Verifier Delegate Pair",
    purpose:
      "Pair a builder sub-agent with an adversarial verifier sub-agent so edge cases are broken and fixed before you ever review the output.",
    text: "Spin up two parallel sub-agents with opposing jobs on this task: have the builder agent implement the solution and claim why it works, and have the verifier agent actively try to break it using edge-case inputs, boundary conditions, and environment checks. Do not hand the result back to me until the builder has resolved every real failure the verifier uncovered.",
    words: 60,
    pattern: "Parallel agents",
  },
  {
    order: 107,
    id: "5.22",
    title: "Interactive Prompt Scope Expansion",
    purpose:
      "Instruct the agent to catch when you ask for a narrow, tactical step and proactively offer to swallow the surrounding end-to-end workflow.",
    text: "Before you execute the literal narrow instruction I just typed, pause and evaluate whether I am asking for a small manual step inside a much larger goal. Ask me two sharp questions to confirm the real end-state I care about, propose how you can swallow the surrounding workflow end-to-end, and once I confirm, execute the bigger outcome directly.",
    words: 58,
    pattern: "Interactive",
  },
];
