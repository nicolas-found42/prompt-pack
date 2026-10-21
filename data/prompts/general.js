// Prompts for one category of the deck. One record per block, one id per
// line, so two contributors adding prompts never edit the same lines.
//  is the position each prompt had in the original deck; category
// membership lives in data/taxonomy.js, the single source of truth for
// where a prompt sits in the navigation tree.
export const PROMPTS = [
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
    order: 121,
    id: "4.22",
    title: "Subscription & Recurring-Spend Audit",
    purpose:
      "Audit every recurring charge and subscription, kill the ones not pulling weight, and negotiate or downgrade the rest.",
    text: "Go through every recurring charge, subscription, membership, and auto-renewal tied to my accounts and this workspace. Run a ruthless spend triage: flag anything I have not used in the last ninety days, anything duplicated by a tool I already have, and anything whose price crept up since I signed up. Cancel the dead weight directly where you can, draft the cancellation and downgrade messages for the rest, and give me the exact annual savings so I can see what this audit was worth.",
    words: 83,
    pattern: "Triage",
  },
  {
    order: 122,
    id: "4.23",
    title: "Interactive Purchase & Big-Decision Elicitation",
    purpose:
      "Interview me about a major purchase until the real constraints surface, then produce a verified shortlist instead of a vague comparison.",
    text: "I am trying to decide on a significant purchase and I keep going back and forth between options without a clear finish line. Do not build me a giant comparison spreadsheet—interview me interactively instead: ask sharp, one-at-a-time questions about my real constraints, the failure modes I cannot tolerate, and what I would regret in a year. Eliminate the dominated options as we go, verify the finalists against real reviews and price history rather than marketing pages, and take me to a shortlist I can actually commit to.",
    words: 87,
    pattern: "Interactive",
  },
  {
    order: 123,
    id: "4.24",
    title: "Parallel Career-Transition & Materials Bakeoff",
    purpose:
      "Prepare for a job switch with parallel delegates pressure-testing the resume, narrative, and outreach from different angles.",
    text: "I am preparing to switch roles or employers, and I want the materials battle-tested before anything goes out. Spin up parallel delegates to attack my transition package from different angles: one tears apart my resume for gaps, vague claims, and keywords a real screener would miss; one stress-tests my narrative—why this move, why now—against skeptical interviewer questions; one audits my outreach drafts for tone-deaf phrasing and weak hooks. Reconcile their findings and rewrite the weakest materials directly.",
    words: 77,
    pattern: "Parallel agents",
  },
  {
    order: 124,
    id: "4.25",
    title: "Consumer Contract & Terms Plain-Language Triage",
    purpose:
      "Read a consumer contract, lease, or terms of service and surface the clauses that actually bind me, in plain language.",
    text: "I have a consumer contract—a lease, a service agreement, a terms-of-service update—that I am expected to accept, and I want to know what I am actually signing. Read it end to end and triage it into plain language: the clauses that create real obligations or penalties for me, the auto-renewal and price-increase traps, the liability and arbitration terms that change my rights, and the parts that are standard boilerplate I can stop worrying about. Flag anything unusual compared to the norm for this kind of agreement, and tell me the exact questions to ask before signing.",
    words: 96,
    pattern: "Execute",
  },
];
