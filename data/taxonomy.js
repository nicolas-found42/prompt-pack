// The navigation hierarchy: Category -> Subcategory -> Group -> prompt.
// Ids reference entries in data/prompts.js. Every prompt id belongs to exactly one group.

export const TAXONOMY = {
  categories: [
    {
      category: "Coding",
      subcategories: [
        {
          name: "Outcome Framing",
          summary: "Decide what to build and favor agent primitives over static features",
          groups: [
            {
              name: "Prebuild Checks",
              summary: "Question feature builds and confirm observability before writing code",
              ids: ["1.1", "1.2"],
            },
            {
              name: "Lightweight Alternatives",
              summary: "Replace permanent dashboards and rigid flows with throwaway agent tools",
              ids: ["1.3", "1.4"],
            },
          ],
        },
        {
          name: "Architecture Exploration",
          summary: "Survey bottlenecks with delegates and prove fixes by running code",
          groups: [
            {
              name: "Design Surveys",
              summary: "Expose surface bloat and explore improvements across client and server",
              ids: ["1.5", "1.6"],
            },
            {
              name: "Systems Deep Dives",
              summary: "Optimize deep system layers, then reproduce failures and verify fixes live",
              ids: ["1.7", "1.8"],
            },
          ],
        },
        {
          name: "Workspace Hygiene",
          summary: "Prune dead branches and dependencies, capture durable standards",
          groups: [
            {
              name: "Cruft Removal",
              summary: "Close dead branches and strip heavy or unused dependencies",
              ids: ["1.9", "1.10"],
            },
            {
              name: "Lasting Conventions",
              summary: "Distill review corrections and shell one-offs into lasting repo rules",
              ids: ["1.11", "1.12"],
            },
          ],
        },
        {
          name: "Guided Refinement",
          summary: "Elicit hidden constraints, then stress rival implementations",
          groups: [
            {
              name: "Constraint Discovery",
              summary: "Interview stakeholders and probe edge cases before writing code",
              ids: ["1.13", "1.14"],
            },
            {
              name: "Rival Solutions",
              summary: "Bake off rival refactors and pit builders against breakers",
              ids: ["1.15", "1.16"],
            },
          ],
        },
        {
          name: "Systemic Hardening",
          summary: "Map change impact, sweep bug classes, rework deep structure",
          groups: [
            {
              name: "Impact Maps",
              summary: "Map sprawling diffs and data flows without permanent tooling",
              ids: ["1.17", "1.18"],
            },
            {
              name: "Blanket Sweeps",
              summary: "Convert one-off fixes and legacy sweeps into permanent guardrails",
              ids: ["1.19", "1.20"],
            },
            {
              name: "Structural Rework",
              summary: "Expose memory hot paths and untangle coupled modules safely",
              ids: ["1.21", "1.22"],
            },
          ],
        },
        {
          name: "Interface & API Quality",
          summary:
            "Audit accessibility, API contracts, and third-party contributions before they calcify",
          groups: [
            {
              name: "Design Reviews",
              summary: "Audit API surfaces and accessibility before shipping",
              ids: ["1.23", "1.24"],
            },
            {
              name: "Contribution Review",
              summary: "Probe third-party PRs and plan reversibility",
              ids: ["1.25", "1.27"],
            },
          ],
        },
        {
          name: "Resource Efficiency",
          summary: "See where compute and money actually go before optimizing",
          groups: [
            {
              name: "Cost Visibility",
              summary: "Visualize cost and latency budgets per path",
              ids: ["1.26"],
            },
          ],
        },
      ],
    },
    {
      category: "Writing",
      subcategories: [
        {
          name: "Draft Origination",
          summary: "Raw notes into finished drafts through synthesis plus contrasting rewrites",
          groups: [
            {
              name: "Raw Material Synthesis",
              summary: "Assembling publication-ready drafts directly from rough notes",
              ids: ["2.1", "2.13"],
            },
            {
              name: "Contrast Experiments",
              summary: "Testing opposite framings then merging strongest elements",
              ids: ["2.5", "2.15", "2.21"],
            },
          ],
        },
        {
          name: "Editorial Momentum",
          summary: "Deciding draft fates plus drawing specifics out through questions",
          groups: [
            {
              name: "Portfolio Decisions",
              summary: "Sorting open drafts plus reviewer feedback into next actions",
              ids: ["2.2", "2.9"],
            },
            {
              name: "Author Questioning",
              summary: "Extracting examples plus thesis defense through direct dialogue",
              ids: ["2.3", "2.12"],
            },
          ],
        },
        {
          name: "Structural Diagnostics",
          summary: "Mapping argument health plus scoring density across versions",
          groups: [
            {
              name: "Structure Mapping",
              summary: "Charting argument flow plus evolution across draft versions",
              ids: ["2.4", "2.17"],
            },
            {
              name: "Pacing Calibration",
              summary: "Measuring pacing rhythm plus proof density paragraph by paragraph",
              ids: ["2.16", "2.20"],
            },
          ],
        },
        {
          name: "Signature Voice",
          summary: "Bottling house style plus carrying it across derivative formats",
          groups: [
            {
              name: "Voice Distillation",
              summary: "Extracting rhythm preferences plus domain phrasing into guides",
              ids: ["2.6", "2.10"],
            },
            {
              name: "Format Translation",
              summary: "Reshaping core essays into briefs without losing the voice",
              ids: ["2.11", "2.19"],
            },
          ],
        },
        {
          name: "Critical Scrutiny",
          summary: "Stress-testing drafts for gaps plus hostile reader objections",
          groups: [
            {
              name: "Gap Detection",
              summary: "Surfacing missing context plus unsupported claims needing proof",
              ids: ["2.7", "2.8"],
            },
            {
              name: "Simulated Readership",
              summary: "Channeling skeptical personas to preempt real reader pushback",
              ids: ["2.14", "2.18"],
            },
          ],
        },
        {
          name: "Derivative & Accessible Formats",
          summary: "Release notes, locales, plain language, and presentation narratives",
          groups: [
            {
              name: "Release Communication",
              summary: "Draft release notes and changelogs from merged diffs",
              ids: ["2.22"],
            },
            {
              name: "Audience & Locale Adaptation",
              summary: "Translate across locales and into plain language",
              ids: ["2.23", "2.24"],
            },
            {
              name: "Presentation Structure",
              summary: "Map a talk's narrative arc before presenting",
              ids: ["2.25"],
            },
          ],
        },
      ],
    },
    {
      category: "Research",
      subcategories: [
        {
          name: "Inquiry Groundwork",
          summary: "Opening moves that assemble scattered evidence into examinable form",
          groups: [
            {
              name: "Dataset Consolidation",
              summary: "Merging scattered exports into one unified queryable dataset",
              ids: ["3.1"],
            },
            {
              name: "Exploratory Reports",
              summary: "Self-contained interfaces for filtering plus inspecting findings",
              ids: ["3.2"],
            },
            {
              name: "Inquiry Framing",
              summary: "Splitting hypotheses across delegates plus surfacing data gaps",
              ids: ["3.3", "3.4"],
            },
            {
              name: "Causal Tracing",
              summary: "Tracing metric spikes to root causes plus remediation plans",
              ids: ["3.5"],
            },
          ],
        },
        {
          name: "Research Integrity",
          summary: "Checks that deduplicate past work plus verify current claims",
          groups: [
            {
              name: "Thread Indexing",
              summary: "Indexing past threads to close duplicates plus open questions",
              ids: ["3.6"],
            },
            {
              name: "Statement Verification",
              summary: "Checking each claim against primary artifacts plus flagging gaps",
              ids: ["3.7"],
            },
          ],
        },
        {
          name: "Source Standards",
          summary: "Filters for trustworthy sources plus durable evaluation standards",
          groups: [
            {
              name: "Source Prioritization",
              summary: "Ranking primary sources plus research questions by leverage",
              ids: ["3.8", "3.9"],
            },
            {
              name: "Durable Playbooks",
              summary: "Saving evaluation rubrics plus cleaning rules for reuse",
              ids: ["3.10", "3.11"],
            },
          ],
        },
        {
          name: "Hypothesis Refinement",
          summary: "Techniques that sharpen questions then stress-test emerging answers",
          groups: [
            {
              name: "Guided Scoping",
              summary: "Interviewing researchers to sharpen scope before deep searches",
              ids: ["3.12", "3.13"],
            },
            {
              name: "Delegated Validation",
              summary: "Cross-checking independent streams plus red-teaming conclusions",
              ids: ["3.14", "3.15"],
            },
          ],
        },
        {
          name: "Evidence Models",
          summary: "Live models exposing contradictions plus assumption thresholds",
          groups: [
            {
              name: "Claim Networks",
              summary: "Mapping which corpus claims corroborate or contradict each other",
              ids: ["3.16"],
            },
            {
              name: "Assumption Simulators",
              summary: "Sliders revealing thresholds where conclusions change winners",
              ids: ["3.17"],
            },
          ],
        },
        {
          name: "Knowledge Handover",
          summary: "Steps converting findings into decisions, playbooks, fresh corpora",
          groups: [
            {
              name: "Decision Matrices",
              summary: "Eliciting constraints then ranking options against live data",
              ids: ["3.18"],
            },
            {
              name: "Research Playbooks",
              summary: "Distilling successful investigations into repeatable procedures",
              ids: ["3.19"],
            },
            {
              name: "Corpus Orientation",
              summary: "Mapping unfamiliar stores then keeping primary artifacts only",
              ids: ["3.20", "3.21"],
            },
          ],
        },
        {
          name: "Decision & Competitive Evidence",
          summary: "Model thresholds, record decisions, and tear down competitors",
          groups: [
            {
              name: "Decision Records",
              summary: "Codify rationale and model evidence thresholds",
              ids: ["3.22", "3.23"],
            },
            {
              name: "Competitive & Context Intel",
              summary: "Tear down alternatives and brief for meetings",
              ids: ["3.24", "3.25"],
            },
          ],
        },
      ],
    },
    {
      category: "General",
      subcategories: [
        {
          name: "Workload Intake",
          summary: "Cut backlog noise and pull scattered work into clear next outcomes",
          groups: [
            {
              name: "Direct Fulfillment",
              summary: "Get the finished outcome directly without building new systems",
              ids: ["4.1"],
            },
            {
              name: "Demand Sorting",
              summary: "Sort active projects, messages, and scattered records into next actions",
              ids: ["4.2", "4.3", "4.4"],
            },
          ],
        },
        {
          name: "Personal Operations",
          summary: "Unblock daily flow while keeping shared outputs safe and connected",
          groups: [
            {
              name: "Issue Recovery",
              summary: "Walk through blocking issues conversationally toward working resolution",
              ids: ["4.5"],
            },
            {
              name: "Safe Handoffs",
              summary: "Scrub sensitive outputs and link tools for end-to-end automation",
              ids: ["4.6", "4.7"],
            },
            {
              name: "Load Clearing",
              summary: "Cancel low-leverage meetings and clear blocked approval queues",
              ids: ["4.8", "4.9"],
            },
          ],
        },
        {
          name: "Reusable Judgment",
          summary: "Turn implicit preferences and chores into repeatable decision filters",
          groups: [
            {
              name: "Method Preservation",
              summary: "Lock finished chores and implicit criteria into reusable playbooks",
              ids: ["4.10", "4.11"],
            },
            {
              name: "Guided Discovery",
              summary: "Draw out constraints and context through targeted follow-up questions",
              ids: ["4.12", "4.13"],
            },
          ],
        },
        {
          name: "Forward Reconnaissance",
          summary: "Probe plans under stress and expose dependencies before committing",
          groups: [
            {
              name: "Scenario Simulations",
              summary: "Stress-test plans and compare competing options through probes",
              ids: ["4.14", "4.15"],
            },
            {
              name: "Hidden Structure",
              summary: "Map dependency timelines and surface trackers ready for retirement",
              ids: ["4.16", "4.17"],
            },
          ],
        },
        {
          name: "Operational Hardening",
          summary: "Harden live operations then lock proven fixes into playbooks",
          groups: [
            {
              name: "Failure Mapping",
              summary: "Pre-mortem fragile plans and map operational dependencies visually",
              ids: ["4.18", "4.19"],
            },
            {
              name: "Friction Conversion",
              summary: "Rank manual busywork then lock winning fixes into reusable playbooks",
              ids: ["4.20", "4.21"],
            },
          ],
        },
        {
          name: "Money & Major Decisions",
          summary: "Audit spending, pressure-test purchases, contracts, and career moves",
          groups: [
            {
              name: "Spend & Purchase Triage",
              summary: "Audit recurring spend and elicit big-purchase decisions",
              ids: ["4.22", "4.23"],
            },
            {
              name: "Contract & Career Moves",
              summary: "Triage consumer contracts and bake off career materials",
              ids: ["4.24", "4.25"],
            },
          ],
        },
      ],
    },
    {
      category: "Meta",
      subcategories: [
        {
          name: "Harness Introspection",
          summary: "Inspect own tooling, context load, capabilities and failures",
          groups: [
            {
              name: "Overhead Measurement",
              summary: "Measure latency, context bloat and slow tool calls",
              ids: ["5.1", "5.2"],
            },
            {
              name: "Capability Mapping",
              summary: "Inventory own harness and compare against other setups",
              ids: ["5.3", "5.4"],
            },
            {
              name: "Failure Diagnostics",
              summary: "Interrogate missed steps and diagnose stuck transcripts",
              ids: ["5.5", "5.6"],
            },
          ],
        },
        {
          name: "Practice Review",
          summary: "Review prompting patterns plus accumulated skills and threads",
          groups: [
            {
              name: "Prompting Habits",
              summary: "Catch narrow prompting and codify recurring instructions",
              ids: ["5.7", "5.8"],
            },
            {
              name: "Workspace Hygiene",
              summary: "Prune conflicting skills and salvage open session threads",
              ids: ["5.9", "5.10"],
            },
          ],
        },
        {
          name: "Skill Construction",
          summary: "Turn proven loops and interviews into durable reusable skills",
          groups: [
            {
              name: "Durable Routines",
              summary: "Lock verification loops and delegation patterns into skills",
              ids: ["5.11", "5.12"],
            },
            {
              name: "Guided Setup",
              summary: "Connect missing permissions and co-design new playbooks",
              ids: ["5.13", "5.14"],
            },
          ],
        },
        {
          name: "Execution Refinement",
          summary: "Compare approaches, verify outputs and upgrade own tooling",
          groups: [
            {
              name: "Contender Comparison",
              summary: "Test rival framings and reconcile independent verdicts",
              ids: ["5.15", "5.16"],
            },
            {
              name: "Harness Improvement",
              summary: "Visualize execution traces then build missing helpers",
              ids: ["5.17", "5.18"],
            },
          ],
        },
        {
          name: "Self Oversight",
          summary: "Prune stale rules and enforce stronger autonomous checks",
          groups: [
            {
              name: "Rule Maintenance",
              summary: "Delete stale directives and build autonomous test harnesses",
              ids: ["5.19", "5.20"],
            },
            {
              name: "Outcome Assurance",
              summary: "Break work adversarially and expand narrow requests",
              ids: ["5.21", "5.22"],
            },
          ],
        },
        {
          name: "Cost & Effectiveness",
          summary: "Measure token spend, session health, and whether skills actually work",
          groups: [
            {
              name: "Spend & Session Health",
              summary: "Audit token budgets and visualize session drift",
              ids: ["5.23", "5.26"],
            },
            {
              name: "Effectiveness Verification",
              summary: "Verify skills change outcomes and codify failure patterns",
              ids: ["5.24", "5.25"],
            },
          ],
        },
      ],
    },
    {
      category: "Learning",
      subcategories: [
        {
          name: "Understanding & Mastery",
          summary: "Build working mental models through adaptive explanation and interrogation",
          groups: [
            {
              name: "Adaptive Explanation",
              summary: "Explain at my level and interrogate my understanding",
              ids: ["6.1", "6.2"],
            },
            {
              name: "Misconception Correction",
              summary: "Hunt wrong beliefs and drill the correct model",
              ids: ["6.11"],
            },
          ],
        },
        {
          name: "Learning Operations",
          summary: "Plan, triage, and codify the learning itself",
          groups: [
            {
              name: "Study Planning",
              summary: "Sequence material into a plan and triage the backlog",
              ids: ["6.3", "6.10"],
            },
            {
              name: "Retention & Playbooks",
              summary: "Retain via review and codify what worked",
              ids: ["6.14"],
            },
          ],
        },
        {
          name: "Skill & Language Building",
          summary: "Build a skill or a language through practice and bakeoffs",
          groups: [
            {
              name: "Skill Roadmaps",
              summary: "Elicit a skill roadmap from real constraints",
              ids: ["6.8"],
            },
            {
              name: "Explanation Bakeoffs",
              summary: "Compare teaching devices and practice a language",
              ids: ["6.4", "6.7"],
            },
            {
              name: "Knowledge Mapping",
              summary: "Map what I know versus what is new",
              ids: ["6.6"],
            },
          ],
        },
      ],
    },
    {
      category: "Communication",
      subcategories: [
        {
          name: "Message Production",
          summary: "Draft, adapt, and dispatch messages in my voice",
          groups: [
            {
              name: "Inbox & Replies",
              summary: "Draft send-ready replies and polish rambles",
              ids: ["7.1"],
            },
            {
              name: "Audience Adaptation",
              summary: "Adapt one message per audience from the same facts",
              ids: ["7.4", "7.10"],
            },
          ],
        },
        {
          name: "Difficult Conversations",
          summary: "Rehearse, elicit, and deliver hard conversations",
          groups: [
            {
              name: "Rehearsal",
              summary: "Rehearse difficult conversations and negotiations",
              ids: ["7.2", "7.6"],
            },
            {
              name: "Feedback & Repair",
              summary: "Audit tone, deliver feedback, and pay follow-up debt",
              ids: ["7.3", "7.7", "7.12"],
            },
          ],
        },
        {
          name: "Meeting & Incident Comms",
          summary: "Run meetings to action and audit incident communication",
          groups: [
            {
              name: "Incident Communication",
              summary: "Audit incident comms and rewrite the templates",
              ids: ["7.11"],
            },
          ],
        },
      ],
    },
    {
      category: "Life Admin",
      subcategories: [
        {
          name: "Money & Coverage",
          summary: "Audit spending, decisions, and health records",
          groups: [
            {
              name: "Finance Triage",
              summary: "Audit spending and elicit financial decisions",
              ids: ["8.1", "8.2"],
            },
            {
              name: "Health Records",
              summary: "Consolidate medical records into one picture",
              ids: ["8.4"],
            },
          ],
        },
        {
          name: "Travel & Home",
          summary: "Plan trips and sequence home maintenance",
          groups: [
            {
              name: "Travel Planning",
              summary: "Consolidate itineraries and bake off options",
              ids: ["8.5", "8.6"],
            },
            {
              name: "Home Upkeep",
              summary: "Triage repairs and decide on renovations",
              ids: ["8.7", "8.8"],
            },
          ],
        },
        {
          name: "Daily Life Systems",
          summary: "Meals, fitness, habits, and life changes",
          groups: [
            {
              name: "Meals & Fitness",
              summary: "Plan meals and visualize recovery",
              ids: ["8.9", "8.10"],
            },
            {
              name: "Life Changes",
              summary: "Simulate major life changes before committing",
              ids: ["8.13"],
            },
          ],
        },
      ],
    },
  ],
};
