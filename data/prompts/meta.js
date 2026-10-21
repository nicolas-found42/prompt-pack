// Prompts for one category of the deck. One record per block, one id per
// line, so two contributors adding prompts never edit the same lines.
//  is the position each prompt had in the original deck; category
// membership lives in data/taxonomy.js, the single source of truth for
// where a prompt sits in the navigation tree.
export const PROMPTS = [
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
  {
    order: 125,
    id: "5.23",
    title: "Token & Cost Budget Audit",
    purpose:
      "Audit where the context window and money are actually going across recent sessions, and design a cheaper operating mode.",
    text: "Audit how much of my context budget and money each kind of work is actually consuming across our recent sessions. Break down token usage and cost by task type—exploration, debugging, writing, verification—and identify the patterns that burn the most for the least outcome: oversized file reads, repeated re-reads, verbose tool output we never use, and verification loops that run more than they need to. Then design a cheaper default operating mode for this workspace and codify it so future sessions run lean without losing the verification discipline.",
    words: 87,
    pattern: "Audit",
  },
  {
    order: 126,
    id: "5.24",
    title: "Skill & Playbook Outcome Verification",
    purpose:
      "Verify that the skills and playbooks in this workspace actually change agent behavior, by testing them against real tasks and measuring the difference.",
    text: "We have accumulated a library of skills and playbooks, and I want to know which ones actually change how the work gets done rather than just adding instructions to read. Pick the highest-traffic skills and playbooks in this workspace and verify them empirically: run the same representative tasks with and without each one, and compare the outcomes—whether the work was faster, needed fewer corrections, caught more errors, or produced a cleaner result. Report which skills earn their context cost, which are ceremony, and which tasks still have no skill at all, and rewrite or retire accordingly.",
    words: 96,
    pattern: "Audit",
  },
  {
    order: 127,
    id: "5.25",
    title: "Cross-Session Failure-Pattern Codification",
    purpose:
      "Mine every failed or abandoned session for the recurring failure patterns, and codify the prevention rules that stop them recurring.",
    text: "Look across all of our past sessions—not just the successful ones—and mine the failures: the dead ends, the abandoned approaches, the wrong assumptions, the loops we got stuck in. Identify the recurring failure patterns, not the one-off mistakes, and for each pattern write the exact prevention rule that would have caught it earlier. Codify those rules into our permanent workspace instructions and verification harness so the same class of failure gets caught automatically before it costs us another session.",
    words: 79,
    pattern: "Codify",
  },
  {
    order: 128,
    id: "5.26",
    title: "Ephemeral Session Health & Drift Visualizer",
    purpose:
      "Generate a one-off interactive visual of session health over time: where threads stall, where scope drifts, where outcomes land.",
    text: "Generate a standalone, self-contained interactive visual report of how our agent sessions have actually been going over time. Map each recent session by length, outcome landed versus abandoned, scope drift, and where work got handed off versus finished, so I can see the shape of our collaboration at a glance. Highlight the patterns—sessions that stall at a certain step, topics that keep getting reopened, handoffs that never landed—and recommend the two or three harness changes that would fix the biggest recurring drag.",
    words: 82,
    pattern: "Visualize",
  },
];
