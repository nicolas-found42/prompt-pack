// Prompts for one category of the deck. One record per block, one id per
// line, so two contributors adding prompts never edit the same lines.
// order is the position each prompt had in the original deck; category
// membership lives in data/taxonomy.js, the single source of truth for
// where a prompt sits in the navigation tree.
export const PROMPTS = [
  {
    order: 173,
    id: "10.1",
    title: "Authority Policy for Unsupervised Action",
    purpose:
      "Write down, before the work starts, which classes of repository action you may take without asking, and justify every line by what cannot be undone.",
    text: "I keep re-deciding what you are allowed to do, and that indecision is its own risk. Write the authority policy for this repository as a short list of action classes—inspection, local edits, commits, pushes, pull requests, review comments, merges, deploys, destructive data operations, and anything that sends a message or spends money. For each, state whether you act alone, act and report, or stop for approval, and justify the line by what cannot be undone and how many people see the effect. Then audit your own last week of work against the policy and show me every action it would now forbid.",
    words: 102,
    pattern: "Codify",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 174,
    id: "10.2",
    title: "Pre-Flight Action Gate",
    purpose:
      "Before an irreversible action, classify what it cannot undo, who it reaches, and what it would repeat on retry—then refuse when the answer exceeds the agreed threshold.",
    text: "Before this action runs, answer three things in writing: what cannot be undone, who outside this workspace will see the effect, and what a retry would repeat. Be specific—files, records, recipients, money. State the threshold we agreed on, compare the action against it, and if the action exceeds it, stop and hand me the classification instead of proceeding. If it passes, say which of the three decided it and what would have flipped the answer. An effect you cannot describe exactly in advance does not run.",
    words: 86,
    pattern: "Audit",
    session: "in-progress",
    tags: ["in-progress"],
  },
  {
    order: 175,
    id: "10.3",
    title: "The Case for No Change",
    purpose:
      "Recommend making no change when its risk exceeds its value, and defend that recommendation as strongly as a recommendation to act.",
    text: "Before we build anything, argue the opposite case: that the right move is to change nothing. Name what the change buys, what it costs to build, what it costs to maintain, and what breaks if it is wrong. Then state the conditions under which doing nothing is the better engineering decision, and check whether we actually meet them. If we do, recommend no change and stop; if we do not, say which condition failed and why the change is worth its risk. Do not hedge—I want a decision I can defend to someone who wanted the feature.",
    words: 97,
    pattern: "Execute",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 176,
    id: "10.4",
    title: "Shadow Rehearsal of an Irreversible Action",
    purpose:
      "Rehearse an irreversible action against a copy that cannot reach production, diff the intended effect against the actual one, and only then run it for real.",
    text: "This action cannot be undone, so the first time it runs should not be the first time it runs. Rehearse it against a copy: a restored snapshot, a scratch environment, or a shadow account that cannot reach production or another person. Capture what it actually changed there, diff that against what you told me it would change, and explain every difference. If the rehearsal's diff is not identical to the intended diff, stop and report the gap instead of running it for real—an unexplained difference in a rehearsal is a surprise in production.",
    words: 93,
    pattern: "Execute",
    session: "in-progress",
    tags: ["in-progress"],
  },
  {
    order: 177,
    id: "10.5",
    title: "Retry-Safe Mutation",
    purpose:
      "Make a mutating sequence safe to resume from any point, with a durable record of what already happened rather than trust in exit codes.",
    text: "This job mutates systems outside our control and it will be retried—by a timeout, by me, or by an agent that thinks it failed. Make it safe to resume from any point: give each external action a stable identity derived from the work itself, record what has already been applied somewhere durable, and check that record before acting instead of trusting the last exit code. Then prove it by killing the job halfway and rerunning it, showing that applied effects were skipped and the remainder completed. Report where the record lives and what happens if it is corrupted.",
    words: 98,
    pattern: "Execute",
    session: "in-progress",
    tags: ["in-progress"],
  },
  {
    order: 178,
    id: "10.6",
    title: "Territory Claiming Across Agents",
    purpose:
      "Claim the files and issues about to be touched so concurrent agents do not collide, and release every claim when the work lands or is abandoned.",
    text: "Several agents may be editing this repository at once, and silent collisions cost more than the work saves. Before touching anything, write down the exact files, directories, and issue numbers you intend to modify, publish the claim where the others will read it, and check whether anyone already holds one. If a claim conflicts, settle it by whose plan is more complete, not who started first, and record why. Release every claim when your change lands or you abandon it, and if you find yourself editing outside your claim, stop and re-claim before continuing.",
    words: 94,
    pattern: "Parallel agents",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 179,
    id: "10.7",
    title: "Atomic Commit Splitting",
    purpose:
      "Split a working change into commits that each build and revert on their own, with messages that name the failure each one prevents.",
    text: "Our history is one enormous commit per feature, so nothing can be reverted without taking the whole thing with it. Split the working change into commits that each build and pass on their own, sized so reverting any single one leaves a working tree. Order them so the riskiest change is last, and write each message about the failure that commit prevents rather than the lines it touches. Then prove it: revert the middle commit, run the checks, and show me the tree still works. Report any split that could not be made safe on its own and why.",
    words: 99,
    pattern: "Execute",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 180,
    id: "10.8",
    title: "Merge Conflict Intent Resolution",
    purpose:
      "Reconstruct what each side of a conflict was trying to do before editing, then satisfy both intents or name the pair that cannot coexist.",
    text: "Both sides of this conflict were trying to do something specific, and picking a winner silently deletes the other side's intent. Before you edit a line, reconstruct what each branch was attempting from its commits, its tests, and the callers that depend on it, and state both intents in one sentence each. Then write a resolution that satisfies both, or say precisely which intent you are dropping and why it is no longer needed. Where the two genuinely cannot coexist, stop and show me the incompatible pair rather than choosing. Verify the resolution by running the tests from both sides.",
    words: 100,
    pattern: "Interactive",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 181,
    id: "10.9",
    title: "Pull Request Narrative from Diff and Decision",
    purpose:
      "Write the pull request body from the decision and its evidence rather than from the commit list, so a reviewer knows what to check and why.",
    text: "The commit log is a record of how I got here, not an explanation of why anyone should care. Write the pull request body from the diff and the decision: the problem that existed, the option that was chosen and the ones that were rejected, the evidence that the change works, and the specific things a reviewer should look at hardest. Call out the diff's least obvious consequence and any part you are least confident about. Do not summarize the commits, and do not claim a behavior is fixed unless a test or a run demonstrates it.",
    words: 97,
    pattern: "Execute",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 182,
    id: "10.10",
    title: "Scope Drift Interrupt",
    purpose:
      "Notice mid-task that the work has drifted from what was asked, stop, and state the original intent against what is now being built.",
    text: "Somewhere in this task you are no longer doing what I asked. Before continuing, restate the request in one sentence as I made it, then state what you are actually building now. If those differ, name the drift precisely: a discovered prerequisite, a convenience refactor, a bug found on the way, or a change of mind you assumed I had. For each drift, say whether it is required for the original request or merely adjacent, and stop before expanding it further. If a drift is genuinely required, get my agreement before continuing; if it is adjacent, cut it and finish the original request.",
    words: 103,
    pattern: "Execute",
    session: "in-progress",
    tags: ["in-progress"],
  },
  {
    order: 183,
    id: "10.11",
    title: "Merge Gate on Pre-Committed Checks",
    purpose:
      "Merge only after the checks committed before the work started pass, and report what was verified rather than that CI was green.",
    text: "A green pipeline is not the same as a verified change. Before merging, list the checks we committed to before this work began, then run or read each one and state what it actually proves about this diff. Distinguish checks that exercised the new behavior from checks that merely ran and passed. If any committed check was quietly weakened, skipped, or replaced during the work, stop and report it instead of merging. Merge only when every committed check passes as written, and state in the merge what was verified and what still rests on assumption.",
    words: 95,
    pattern: "Codify",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 184,
    id: "10.12",
    title: "Deployed-Artifact Identity Proof",
    purpose:
      "Prove the running system is the artifact built from the reviewed commit, from the running system itself rather than the deploy log.",
    text: "A successful deploy does not mean the thing I reviewed is the thing now running. Before deploying, record the reviewed commit and the digest of the artifact built from it. After deploying, read the version identity back out of the running system—its own report of what it is, not the deploy log's claim—and compare byte for byte with what you recorded. If they differ, stop and report the divergence rather than retrying, because a retry can hide a caching or promotion fault. If they match, state the evidence and name what would have made you call the deploy wrong.",
    words: 99,
    pattern: "Reconcile",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 185,
    id: "10.13",
    title: "Pre-Committed Kill Criteria",
    purpose:
      "Write the metric, threshold, and window that would mean revert before shipping, commit them with the change, and act on them when they trip.",
    text: "Before this change ships, write the criteria that would make us take it back: the metric, the threshold, the measurement window, and how it will be read from the live system rather than from the CI log. Commit those criteria with the change so nobody can edit them afterward to match whatever happens. Once it is live, read the metric yourself, state whether the criteria held, and revert without asking if they tripped. If the metric cannot be observed yet, say that before shipping rather than after, and treat it as a reason to wait.",
    words: 95,
    pattern: "Codify",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 186,
    id: "10.14",
    title: "Post-Merge Health Verification",
    purpose:
      "Check that the shared branch and the environment are healthy after a merge, rather than trusting that the merge itself succeeded.",
    text: "A merge that applied cleanly can still leave the shared branch broken for everyone else. Immediately after merging, verify the merged commit on the shared branch—not your local copy: the build and tests run there, the artifact it produces, and the environment that consumes it. Compare against the state just before the merge so any new failure is attributable to this change rather than something older. If the merge broke something, revert it now and report the failure; if it is healthy, say what you checked and what a later consumer should watch. Do not report the merge as done before that check.",
    words: 103,
    pattern: "Audit",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 187,
    id: "10.15",
    title: "Close the Tracker Loop",
    purpose:
      "Close the loop on the issue that started the work: link the shipped change, update the state, and state plainly what a user can now do.",
    text: "The issue that started this work is still open and nobody can tell from it whether the work shipped. Close the loop: link the merged change and the release that carries it, update the issue state and any project board, and write one plain sentence about what a user can now do that they could not before. Remove or update the intermediate comments that are now stale, including any workaround someone would follow after the fix landed. If something from the original report is still not addressed, say so explicitly instead of closing as done.",
    words: 95,
    pattern: "Execute",
    session: "fresh",
    tags: ["fresh-session"],
  },
];
