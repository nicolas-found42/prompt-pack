// Prompts for one category of the deck. One record per block, one id per
// line, so two contributors adding prompts never edit the same lines.
//  is the position each prompt had in the original deck; category
// membership lives in data/taxonomy.js, the single source of truth for
// where a prompt sits in the navigation tree.
export const PROMPTS = [
  {
    order: 139,
    id: "7.1",
    title: "Inbox Reply Drafting & Send-Ready Triage",
    purpose:
      "Draft replies to every message that genuinely needs one, so the inbox is cleared without me typing routine responses.",
    text: "Go through my inbox and connected message threads and clear the backlog of anything that needs a reply. Triage out the noise and the FYIs, and for everything that genuinely needs a response, draft a send-ready reply in my voice—short, direct, and specific to what the other person actually asked. Flag the few messages that need my personal judgment or a decision only I can make, with the context I need to answer in one read. Leave the drafts ready to send so I only review, not compose.",
    words: 88,
    pattern: "Execute",
  },
  {
    order: 140,
    id: "7.2",
    title: "Interactive Difficult-Conversation Rehearsal",
    purpose:
      "Rehearse a hard conversation interactively, playing the other person so I can practice before it happens.",
    text: "I have a difficult conversation coming up—a performance conversation, a boundary conversation, a negotiation—and I want to rehearse it before it happens. Interview me interactively to understand the situation and the other person, then play the other side: push back the way they actually will, raise the objection I am dreading, and force me to find language that works. Run it a few times, show me where my phrasing lands badly or sounds defensive, and help me rewrite the two or three sentences I will actually open with.",
    words: 88,
    pattern: "Interactive",
  },
  {
    order: 141,
    id: "7.3",
    title: "Communication Tone & Relationship Health Audit",
    purpose:
      "Audit my recent messages for tone problems that are quietly damaging relationships, and rewrite the risky ones.",
    text: "Audit the messages and emails I have actually sent recently—not the drafts, the sent ones—for tone problems I am too close to see: brusque phrasing that reads as dismissive, apologies that undermine my own position, enthusiasm that lands as pressure, and silence where a reply was owed. Tell me honestly which relationships are being quietly damaged and why, draft the repair messages where a follow-up is owed, and codify the tone rules I keep violating into a personal communication style note so I catch them before sending.",
    words: 87,
    pattern: "Audit",
  },
  {
    order: 142,
    id: "7.4",
    title: "Parallel Audience-Specific Message Adaptation",
    purpose:
      "Adapt one announcement or request into versions each audience can actually act on, via parallel delegates.",
    text: "I need to send one announcement—a change, a launch, a request—to several audiences who each need something different from it, and one generic message would land wrong with all of them. Spin up parallel delegates, one per audience—team, customers, leadership, partners—to rewrite the announcement for what that audience actually needs to hear and do. Reconcile the versions so the core facts never contradict, and hand me four send-ready messages that share one truth but speak each audience's language.",
    words: 78,
    pattern: "Parallel agents",
  },
  {
    order: 143,
    id: "7.6",
    title: "Interactive Negotiation Rehearsal & BATNA Elicitation",
    purpose:
      "Interview me to find my real fallback position, then rehearse the negotiation against a delegate playing the other side.",
    text: "I am heading into a negotiation—salary, a contract, a price—and I tend to concede early because I have not pinned down my walk-away point. Interview me interactively to establish my real BATNA, the concessions I can trade, and the outcomes ranked from ideal to unacceptable. Then rehearse against me playing the other side as tough as they will actually be, and show me the exact sentences where I gave away value. Rewrite my asks and anchors until the rehearsal holds.",
    words: 80,
    pattern: "Interactive",
  },
  {
    order: 144,
    id: "7.7",
    title: "Relationship & Follow-Up Debt Triage",
    purpose:
      "Surface every relationship where I owe a follow-up, and draft the catch-up messages so the debt gets paid.",
    text: "Audit my recent conversations, intros, and commitments across every channel to find where I owe someone a follow-up and went quiet. Triage the relationship debt by how much it matters and how overdue it is: the people I should call this week, the threads I should revive with a specific update, and the ones where a short honest note beats a long perfect one. Draft the catch-up messages for me—specific, referencing the last real thing we discussed, not a generic 'circling back'—so paying the debt is a review task, not a writing task.",
    words: 93,
    pattern: "Triage",
  },
  {
    order: 145,
    id: "7.10",
    title: "Parallel Stakeholder Update Synthesis",
    purpose:
      "Generate each stakeholder's update from the same verified facts, so nobody gets a contradictory story.",
    text: "A project just hit a milestone—or a setback—and every stakeholder needs an update, but I do not want to write six messages and accidentally tell different stories. Spin up parallel delegates, one per stakeholder group, to draft their update from the same verified fact base: what each group needs to know, what they should do next, and what they should not hear secondhand. Reconcile the drafts so the facts, dates, and asks are identical across all of them, and hand me the full set ready to send.",
    words: 87,
    pattern: "Parallel agents",
  },
  {
    order: 146,
    id: "7.11",
    title: "Incident & Outage Communication Audit",
    purpose:
      "Audit how we communicated during a recent incident, and rewrite the templates so the next one is clear and calm.",
    text: "We just got through an incident or outage, and I want the communication reviewed as rigorously as the technical fix. Audit every message that went out during it—the internal updates, the status page, the customer emails—for accuracy, timing, and tone: where we were vague when we should have been specific, where we over-reassured, where customers learned things in the wrong order, and where the next update was late. Rewrite the templates so the next incident starts from a calm, accurate, honest baseline, and codify the communication rules we learned into the incident playbook.",
    words: 93,
    pattern: "Audit",
  },
  {
    order: 147,
    id: "7.12",
    title: "Interactive Feedback Delivery Elicitation",
    purpose:
      "Interview me to find the real feedback I need to give, then help me deliver it in a way the person can actually use.",
    text: "I need to give someone difficult feedback, and I keep either softening it into uselessness or making it about the person instead of the behavior. Interview me interactively to pin down the specific observable behavior, the real impact it had, and what I want to change—then help me shape it into feedback the person can actually act on. Rehearse the delivery with me, show me where my phrasing turns the conversation defensive, and rewrite the two or three sentences that carry the whole conversation.",
    words: 84,
    pattern: "Interactive",
  },
];
