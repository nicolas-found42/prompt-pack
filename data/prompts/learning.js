// Prompts for one category of the deck. One record per block, one id per
// line, so two contributors adding prompts never edit the same lines.
//  is the position each prompt had in the original deck; category
// membership lives in data/taxonomy.js, the single source of truth for
// where a prompt sits in the navigation tree.
export const PROMPTS = [
  {
    order: 129,
    id: "6.1",
    title: "Adaptive Explanation of an Unfamiliar System",
    purpose:
      "Explain a complex system at exactly my level, checking what I already know first, and stop when I have the working model.",
    text: "I need to understand a system I know nothing about—a codebase, a domain, a piece of hardware—and generic documentation dumps just bury me. Explain it to me adaptively: first ask me what I already know about this area so you do not re-teach the basics, then build the explanation up from the smallest working model, checking at each step whether the picture holds together for me. Stop when I have a working mental model I could act on, not when you have run out of things to say.",
    words: 88,
    pattern: "Execute",
  },
  {
    order: 130,
    id: "6.2",
    title: "Interactive Concept Interrogation",
    purpose:
      "Probe a concept conversationally, asking me to explain it back until the gaps in my understanding are exposed and filled.",
    text: "I think I understand a concept, but I want to find out where my understanding actually breaks. Interrogate me interactively about it: ask me to explain it back in my own words, poke at the parts I glossed over, and give me a concrete counterexample whenever I state something too broadly. Keep pushing until I can explain it, predict its behavior in a new situation, and say where it stops applying—then write the corrected, tight version of the explanation down so I keep it.",
    words: 84,
    pattern: "Interactive",
  },
  {
    order: 131,
    id: "6.3",
    title: "Personalized Study Plan From Raw Material",
    purpose:
      "Turn a pile of material and a deadline into a study plan that sequences the highest-yield learning first.",
    text: "I have a pile of material to learn—a course, a stack of papers, a documentation set—and a deadline, and I keep starting at the beginning and never getting anywhere. Build me a study plan that works backward from what I actually need to be able to do: sequence the material by dependency and yield, estimate the real time each piece takes, and schedule spaced review so it sticks. Produce the plan as a concrete checklist I can execute, and adapt it as I go based on what turns out to be hard.",
    words: 92,
    pattern: "Execute",
  },
  {
    order: 132,
    id: "6.4",
    title: "Parallel Explanation Style Bakeoff",
    purpose:
      "Explain a hard concept through parallel delegates using different teaching devices, then keep the clearest one.",
    text: "I am struggling to understand a genuinely hard concept, and one explanation is not cutting through. Spin up parallel delegates to explain it through completely different teaching devices: one with a concrete worked example, one with an analogy from everyday life, one by building it up from first principles, and one by showing what breaks when you get it wrong. Compare which explanation actually made the concept click, and distill the clearest one into a short reference note I can keep.",
    words: 81,
    pattern: "Parallel agents",
  },
  {
    order: 133,
    id: "6.6",
    title: "Ephemeral Knowledge-Gap Map",
    purpose:
      "Generate a one-off interactive visual map of what I know, what I half-know, and what I do not know about a topic.",
    text: "Before I invest hours learning a topic, I want to see the shape of my own ignorance. Build a standalone, self-contained interactive visual map of the topic: the core concepts, how they depend on each other, and—overlaid on that—what I already know, what I half-know, and what is completely new to me. Highlight the prerequisite gaps that would block me, the areas where my partial knowledge is actually misleading, and the shortest path from where I am to being able to work in this topic.",
    words: 85,
    pattern: "Visualize",
  },
  {
    order: 134,
    id: "6.7",
    title: "Language Learning Practice Partner",
    purpose:
      "Run a language practice session that targets exactly the gaps my recent mistakes reveal, and codify my recurring errors.",
    text: "I am learning a language and generic practice is wasting my time on things I already know. Run a real practice session with me: conversation, short writing, or comprehension drills, whatever exercises the weak spots. Track every mistake I make, identify the recurring error patterns—grammar rules I keep missing, vocabulary gaps, pronunciation traps—and codify them into a personal error log. Use that log to target the next session so each practice round attacks what actually holds me back.",
    words: 78,
    pattern: "Execute",
  },
  {
    order: 135,
    id: "6.8",
    title: "Interactive Skill-Learning Roadmap Elicitation",
    purpose:
      "Interview me about a skill I want to build, then produce a concrete progression plan instead of a vague list of resources.",
    text: "I want to build a real skill—not collect a pile of bookmarks, but actually get competent. Interview me interactively to pin down what competent looks like for me, how much time I genuinely have, and what I already bring to it. Then build a concrete progression plan: the stages in order, the deliberate practice each stage needs, the projects that prove each stage, and the traps that stall most people at the transition between stages. Write it as a plan I can start this week.",
    words: 85,
    pattern: "Interactive",
  },
  {
    order: 136,
    id: "6.10",
    title: "Learning Backlog & Resource Triage",
    purpose:
      "Triage an overgrown pile of courses, books, and saved tutorials into a keep-start-kill plan.",
    text: "My learning backlog has grown into a pile of half-started courses, saved tutorials, and books I keep meaning to read, and it is now a source of guilt instead of momentum. Triage the whole pile: identify what is genuinely worth finishing given where I am now, what should be started fresh, what is stale or superseded and should be deleted, and what order to attack the survivors in. For each keeper, write the exact first step to restart it, and set a review date so the backlog cannot silently regrow.",
    words: 90,
    pattern: "Triage",
  },
  {
    order: 137,
    id: "6.11",
    title: "Parallel Misconception Hunt & Study Drill",
    purpose:
      "Hunt for the misconceptions I carry about a topic in parallel with drilling the correct model, then reconcile.",
    text: "I suspect I carry some wrong beliefs about a topic, and studying more without fixing them just entrenches the errors. Spin up parallel delegates: one hunts for the likely misconceptions a learner at my level typically holds and checks which ones I actually hold, and the other builds a drill that forces the correct model—predictions, worked problems, explain-it-back checks. Run the drill, surface where my answers reveal a misconception, correct it explicitly, and re-drill until the correct model survives contact with new problems.",
    words: 83,
    pattern: "Parallel agents",
  },
  {
    order: 138,
    id: "6.14",
    title: "Learning Session Retrospective Codification",
    purpose:
      "Turn a finished learning push into a reusable study playbook capturing what worked, what wasted time, and what to do next time.",
    text: "We just finished a serious learning push on a hard topic, and I do not want the next hard topic to start from zero again. Retrospect on how it went: which resources actually earned their time, which explanations finally clicked, where I got stuck and what unblocked me, and what I would do differently. Codify the winning approach into a reusable study playbook for the next hard topic, including the resource shortlist, the explanation devices that worked for me, and the stuck-point escape moves.",
    words: 84,
    pattern: "Codify",
  },
];
