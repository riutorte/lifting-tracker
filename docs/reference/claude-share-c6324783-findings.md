---
author: Eric Riutort
created: 2026-04-24
updated: 2026-04-24
valid_as_of: 2026-04-24
re_check_by: 2026-07-23
tier: REFERENCE
content_class: research
---

# Claude.ai Share `c6324783` — Findings

## §1 Executive summary

- **Topic.** A single-turn factual Q&A: "what is the difference between Claude Cowork and Claude Dispatch."
- **Conclusion captured.** Dispatch is not a sibling product to Cowork; it is a phone-side feature *inside* Cowork that lets Eric drive a desktop Cowork session from mobile (QR-pair, Mac must be awake, app open).
- **Classification.** **NEW-TOPIC** at the level of "product taxonomy clarification," but **non-decision-affecting** for the Lifting Tracker portfolio. The conversation is informational, not architectural.
- **Decision impact.** None. No D-level decision, risk, or open question is touched. Eric already uses both terms operationally in `docs/dispatch-handoff.md` and `docs/conversation-archive/2026-04-21_dispatch-session-1.rtf` consistent with the answer captured here.
- **Recommendation.** **File-historical.** No fold-in to existing docs required; no follow-up task warranted.

## §2 Provenance

| Field            | Value                                                                  |
|------------------|------------------------------------------------------------------------|
| Share URL        | https://claude.ai/share/c6324783-d0c2-4122-9388-e4d520a55690           |
| Share ID         | `c6324783-d0c2-4122-9388-e4d520a55690`                                 |
| Conversation title | "Claude Cowork vs Claude Dispatch"                                   |
| Date stamp shown | "5:17 PM" (no calendar date in shared snapshot)                        |
| Access status    | OK — fetched via Claude in Chrome, full body recovered (≈2,150 chars)  |
| Length           | 1 user turn, 1 assistant turn (with 2 web searches inline)             |

The share URL was not present in `docs/reference/april-10-session-analysis.md` (the 14 pre-April-10 + April-10 main share URLs) — verified by grep. It is therefore not a duplicate of any prior session already ingested.

## §3 Conversation captured

### Turn 1 — Eric

Verbatim prompt (single line):

> "tell me the difference between Claude Cowork and Claude dispatch, look up online if you are not sure"

### Turn 2 — Claude (paraphrased)

Claude searched the web twice, then framed the products as non-parallel: Dispatch is a feature *inside* Cowork, not a separate offering. The response then summarized:

- **Claude Cowork** — Anthropic's agentic AI for knowledge work; runs on the desktop app alongside Chat and Code; has access to local folders, connectors (Google Drive, Gmail, DocuSign, FactSet, etc.), and plugins; given a goal it produces a finished deliverable. Launch timeline: research preview January 2026, broader enterprise availability late February 2026.
- **Claude Dispatch** — a Cowork feature, research-preview launched March 2026, that lets the user drive a desktop Cowork session from a phone. Close cousin of Claude Code's Remote Control feature. Mac must be awake with the Claude app open; pairing is by QR code from the mobile app; once paired a Dispatch entry appears in the mobile sidebar and tasks can be assigned remotely. Plan availability: initially Max-only, then extended to Pro, then to Teams on March 25, 2026.
- **One-line framing.** Cowork is the agent that does the work on the desktop; Dispatch is the phone-side remote that lets the user assign and monitor that work when away from the machine.
- **Caveat noted.** Reviewers describe Dispatch as "promising but rough — slow, with reliability issues on longer tasks and browser control." (Identifying handle quoted from response, <15 words.)

No code, schemas, file references, or third-party URLs appear in the assistant turn beyond the unspecified web-search results.

## §4 Cross-reference with existing portfolio

| Existing artifact                                         | Relationship to this conversation                                                                                                       |
|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `docs/dispatch-handoff.md`                                | Eric already uses "Dispatch" as the operational workflow (mobile → desktop Cowork session). The conversation's product taxonomy is consistent with current usage. No update needed. |
| `docs/conversation-archive/2026-04-21_dispatch-session-1.rtf` | Confirms Dispatch is the channel for actual project work, not just a definition. Conversation's "Mac awake + QR pairing" matches Eric's setup. |
| `docs/reference/april-10-session-analysis.md`             | 14 share URLs ingested there. `c6324783` is not among them. No duplication.                                                              |
| `docs/architecture.md` (D1–D27)                           | None of D1–D27 touch Anthropic product taxonomy. No decision is contradicted or extended.                                               |
| `docs/risks.md` (27 active risks)                         | The "Dispatch reliability issues on longer tasks" caveat is *operational* for Eric's working environment, not a portfolio risk for Lifting Tracker. Already implicitly mitigated by the offline-first / archive-as-you-go pattern Eric uses. |
| `docs/reference/source-doc-cm-design.md` (CM brief v0.3.0) | Content classes and WF-003 are about Concept-Computing-style document workflows; orthogonal to Anthropic product naming.                |
| `docs/retrospectives/sprint-0a.md`                        | No overlap.                                                                                                                              |

**Classification:** **NEW-TOPIC** in the narrow sense (no prior reference doc explicitly defines Cowork vs Dispatch), but operationally redundant — Eric's working files already encode the same understanding. Effective overlap: high.

## §5 Decisions / references worth surfacing

None at decision level. Items worth noting at reference level only:

- **Plan-tier availability of Dispatch.** Max → Pro → Teams (March 25, 2026). Useful only if Eric ever has to justify why a collaborator on a different plan can't use Dispatch with him; not relevant to the architecture.
- **Reviewer caveat on Dispatch reliability.** Aligns with Eric's own observation — captured in `docs/dispatch-handoff.md` — that long sessions need archiving and manual checkpointing. The conversation does not name a specific failure mode beyond "slow" and "browser control reliability," so nothing actionable is added.
- **No new tools or patterns introduced.** No third-party tool, library, schema, or framework is named in the conversation.

## §6 Recommendation

**File-historical only.** No fold-in, no spawn-follow-up.

Rationale: the conversation is a one-turn product-definition Q&A. The substantive content is already present, operationally, in `dispatch-handoff.md` and the April 21 dispatch session archive. Writing this back into a primary doc would add no information and would dilute those docs' decision-density.

If a future "Working Environment" or "Tooling Inventory" appendix is created (currently no such doc exists in the portfolio), the Cowork/Dispatch distinction belongs there — not in `architecture.md`, not in `risks.md`, and not in the CM brief.

## §7 Open questions

- None raised by the conversation itself.
- Meta-question for Eric (optional): is it worth standing up a `docs/working-environment.md` (or similar) that records the current tooling stack — Cowork, Dispatch, Claude Code, IDE, plugins, MCP servers — separate from the architecture? Several reference docs touch parts of this (`claude-code-internals-findings.md`, `mcp-servers-to-add-assessment.md`, `skills-to-add-assessment.md`); none consolidates the operational picture. Not blocking; flagged only because this conversation would have a natural home there.

---

© 2026 Eric Riutort. All rights reserved.
