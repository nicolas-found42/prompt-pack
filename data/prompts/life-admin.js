// Prompts for one category of the deck. One record per block, one id per
// line, so two contributors adding prompts never edit the same lines.
//  is the position each prompt had in the original deck; category
// membership lives in data/taxonomy.js, the single source of truth for
// where a prompt sits in the navigation tree.
export const PROMPTS = [
  {
    order: 148,
    id: "8.1",
    title: "Personal Finance & Spending Triage",
    purpose:
      "Audit where my money actually goes, kill waste, and produce a monthly operating picture without a budgeting app.",
    text: "Audit my personal finances the way you would audit a leaky system: go through the accounts, cards, and records in this workspace and show me where the money actually went last quarter. Triage the spending into needs, habits worth keeping, and waste, flag every subscription and recurring charge that is not pulling its weight, and produce a simple monthly operating picture—income, fixed costs, variable spend, and what is genuinely left. Do not build me a budgeting app; give me the picture and the three cuts that would matter most.",
    words: 89,
    pattern: "Triage",
  },
  {
    order: 149,
    id: "8.2",
    title: "Interactive Financial Decision Elicitation",
    purpose:
      "Interview me about a major financial decision until the real numbers and risks surface, then lay out the honest comparison.",
    text: "I am facing a real financial decision—a purchase, an investment, taking on a commitment—and I keep going in circles because the numbers and the feelings are tangled. Interview me interactively to pin down the actual costs including the hidden ones, the real alternatives including doing nothing, and the worst case if it goes wrong. Then lay out the honest comparison in plain numbers: what this buys me, what it costs over time, and what I would have to give up. No spreadsheet-building; just the clearest possible picture of the decision.",
    words: 90,
    pattern: "Interactive",
  },
  {
    order: 150,
    id: "8.4",
    title: "Medical Records & Health Summary Consolidation",
    purpose:
      "Consolidate scattered medical records, reports, and histories into one organized, plain-language health summary.",
    text: "My medical records are scattered across portals, PDFs, and paper folders, and I cannot see my own health picture. Collect everything in this workspace—test results, visit summaries, prescriptions, insurance explanations of benefits—and consolidate it into one organized, chronologically ordered health summary in plain language. Flag the trends and anomalies worth discussing with my doctor, list the open loops like follow-ups never scheduled, and organize the files so my future self can hand the whole picture to any provider in one folder.",
    words: 81,
    pattern: "Execute",
  },
  {
    order: 151,
    id: "8.5",
    title: "Travel Itinerary Consolidation & Stress-Test",
    purpose:
      "Pull a messy pile of bookings and plans into one itinerary, then stress-test it for the failure points that ruin trips.",
    text: "I have a trip coming up and the bookings, confirmations, and plans are scattered across email, apps, and notes. Consolidate everything into a single chronological itinerary with every confirmation number, time zone, and location in one place. Then stress-test the plan the way you would stress-test a fragile system: the tight connections, the single points of failure, the jet-lag math, the documents I will be asked for at a border, and what happens if the first flight is canceled. Fix what can be fixed now and write the contingency notes.",
    words: 90,
    pattern: "Execute",
  },
  {
    order: 152,
    id: "8.6",
    title: "Parallel Travel Option Bakeoff",
    purpose:
      "Compare competing travel plans in parallel delegates to find the one that best fits my real constraints.",
    text: "I am deciding between several ways to make this trip happen—different routes, budgets, or pace—and each option has tradeoffs I keep mis-remembering. Spin up parallel delegates, one per option, to cost it out honestly including the hidden costs, model the failure modes, and score it against my real constraints: budget, energy, time off work, who I am traveling with. Bring the comparisons together side by side with the true all-in picture for each, and tell me which option wins and what I would be giving up.",
    words: 86,
    pattern: "Parallel agents",
  },
  {
    order: 153,
    id: "8.7",
    title: "Home Maintenance & Repair Triage",
    purpose:
      "Audit the state of my home, sequence the maintenance and repairs by urgency and cost, and dispatch what can be dispatched.",
    text: "My home has accumulated a pile of maintenance tasks, odd repairs, and things I have been ignoring, and I cannot see the whole picture. Audit everything in this workspace—inspection reports, quotes, notes, photos—and triage it into a sequenced plan: what is urgent and safety-relevant, what is quietly getting more expensive by waiting, and what is cosmetic and can wait. For each item, note the real cost range and the consequence of delay, draft the messages to contractors or the landlord where needed, and give me the order to attack it in.",
    words: 91,
    pattern: "Execute",
  },
  {
    order: 154,
    id: "8.8",
    title: "Interactive Renovation & Contractor Decision",
    purpose:
      "Interview me about a renovation until the real scope, budget, and non-negotiables are clear, then compare contractor bids honestly.",
    text: "I am planning a renovation and I keep flip-flopping because the scope, the budget, and the contractor options are all tangled. Interview me interactively to pin down what I actually want the space to do, the budget ceiling I will not break, and the outcomes I would regret. Then take the contractor bids or quotes in this workspace and compare them honestly: true scope covered, what is excluded, timelines, and the risk each carries. Take me to the bid that best fits the real constraints, and list the exact questions to ask before signing.",
    words: 94,
    pattern: "Interactive",
  },
  {
    order: 155,
    id: "8.9",
    title: "Weekly Meal Planning & Grocery Consolidation",
    purpose:
      "Plan a week of meals around my real constraints and produce one consolidated grocery list, without a meal-kit subscription.",
    text: "I want to eat well next week without the mental load of deciding every night, and I do not want another subscription. Look at what is already in my kitchen, my schedule and energy for each night, and my dietary constraints, then plan the week's meals around reality: quick meals on the nights I am exhausted, one meal that uses up what is about to go bad, and leftovers that become the next day's lunch. Produce one consolidated grocery list organized by store section, and write the plan as a simple reference I can check off as the week unfolds.",
    words: 100,
    pattern: "Execute",
  },
  {
    order: 156,
    id: "8.10",
    title: "Ephemeral Fitness & Recovery Visualizer",
    purpose:
      "Generate a one-off interactive visual of my recent activity, sleep, and recovery to show what is actually working.",
    text: "I have been tracking workouts, sleep, and how I feel, and I have data but no picture. Build a standalone, self-contained interactive visual report of my recent activity and recovery: training load, sleep quality, resting heart rate or whatever I have been logging, and how I reported feeling each day. Show the trends and the correlations—what the weeks looked like when I felt good versus when I felt wiped out—and highlight the patterns that are actually driving how I feel, so I can adjust the plan based on evidence instead of vibes.",
    words: 92,
    pattern: "Visualize",
  },
  {
    order: 157,
    id: "8.13",
    title: "Parallel Life Admin Scenario Simulation",
    purpose:
      "Simulate a major life change across parallel delegates—finances, logistics, energy—before committing to it.",
    text: "I am considering a significant life change—a move, a job change, a new commitment—and I want to see it from every angle before I commit. Spin up parallel delegates to simulate it: one models the financial impact over the next two years, one maps the logistical tasks and their dependencies, one models the time and energy cost against my real calendar, and one plays devil's advocate on whether I actually want this or just the idea of it. Synthesize their findings into an honest readiness picture: what it costs, what has to be true for it to work, and the safest sequence to try it.",
    words: 105,
    pattern: "Parallel agents",
  },
];
