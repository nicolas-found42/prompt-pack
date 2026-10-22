# Prompt Workshop

The Prompt Workshop creates a prompt from a task request or adds selected guidance to an existing prompt. It runs the Rust generator as WebAssembly in the browser. It makes no LLM or Jev calls.

## Use

1. Open **Create a prompt** and enter a request, or choose **Refine an existing prompt** and paste the prompt to keep.
2. Select a task profile and only the context flags that apply.
3. Choose **Analyze request**. The engine marks literal cue coverage and checks advisory section recommendations.
4. Change any section selection, then choose **Build prompt**. The source text is included verbatim inside a collision-free fence; selected sections follow in a fixed order.
5. Review the output before using it. **Copy prompt** uses the browser clipboard API and falls back to `document.execCommand("copy")`; if both are blocked, the output remains selectable for manual copying.

Changing the request or task options invalidates the prior analysis and generated output. Analyze again before building.

## What the engine does

- Handles UTF-8 input up to **262,144 bytes**. It rejects larger input and never truncates it.
- Uses fixed, ASCII-case-insensitive phrase cues in `generator/src/lib.rs` to flag objective, scope, output, acceptance, clarification, evidence, workflow, and trust-boundary language.
- Recommends only scaffold sections associated with missing cues or selected context. The user can include or omit every optional section.
- Preserves input bytes as supplied. A tilde fence longer than any tilde run in the source prevents source text from closing its boundary accidentally.
- Emits sections in a deterministic order. Profiles add short, fixed guidance for research, coding, writing, or data analysis.
- Builds and analyzes locally. The page fetches the same-origin `wasm/prompt_workshop.wasm`; task text is not persisted by the app or sent to a service. Copying is user-triggered and puts the generated prompt on the clipboard.

## Limits

Cue matching is a transparent heuristic, not semantic analysis. It can miss equivalent wording or find a phrase inside a larger word. Coverage does not mean the prompt is good, and a suggested section is not proof that it is needed. User choices override suggestions.

The builder assembles fixed text; it does not rewrite, summarize, fact-check, or evaluate the source prompt. It cannot ensure that a downstream agent follows the generated instructions. The verification section is guidance for that agent, not a verification run performed by this application. Profiles are static, and the output format is not inferred into a schema.

The 256 KiB input cap bounds memory use. The generated prompt can be larger than its input because collision-free delimiters and selected guidance are added.

## Build and run

Prerequisites: Node.js 24 or newer, Rust stable, and the `wasm32-unknown-unknown` target. The crate has no third-party Rust dependencies.

```sh
rustup target add wasm32-unknown-unknown
npm install
npm test
npm run dev
```

`npm run dev` compiles the release WebAssembly module, stages the static site in `_site/`, then serves that directory over HTTP. `npm run build` performs the compile and staging without starting a server. Opening the HTML from `file://` is unsupported because the page loads native ES modules and a same-origin WebAssembly asset.

The Pages workflow installs the Rust target, runs the repository checks, and stages `workshop.html`, the single workshop documentation page, and the WebAssembly module with the existing deck assets.

## Research basis

The [prompt corpus](https://github.com/nicolas-found42/prompt-pack/tree/main/data/prompts) and recorded quality analysis—the [prompt-evaluation research](https://github.com/nicolas-found42/prompt-pack/blob/main/docs/prompt-research/research.md), [coding-prompt gap analysis](https://github.com/nicolas-found42/prompt-pack/blob/main/docs/coding-prompt-gap-analysis.md), and [generator research](https://github.com/nicolas-found42/prompt-pack/blob/main/docs/prompt-research/prompt-generator-research.md)—are the primary design inputs. The generator research note screens eight arXiv papers and separates evidence about LLM prompt instances from recommendations for deterministic prompt builders. Those studies do **not** establish that this generator improves downstream outcomes.

Relevant studies and the question each informed:

- [IFEval](https://arxiv.org/abs/2311.07911) and [FollowBench](https://arxiv.org/abs/2310.20410): explicit, composable requirements and verifiable instruction cues.
- [FormatSpread](https://arxiv.org/abs/2310.11324): avoid claiming one output form is portable across models.
- [Lost in the Middle](https://arxiv.org/abs/2307.03172): keep ordering and source boundaries explicit; this is guidance, not a measured guarantee for this builder.
- [Instruction Hierarchy](https://arxiv.org/abs/2404.13208): include a conditional boundary when the task uses retrieved content or tools.

The [`prompts.chat` builder](https://github.com/f/prompts.chat) is a precedent for deterministic assembly from explicit fields. Its builder does not infer task-relative gaps from arbitrary prose; this generator uses only bounded literal matching for that step.
