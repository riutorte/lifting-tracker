---
author: Eric Riutort
created: 2026-04-29
updated: 2026-04-29
tier: REFERENCE
content_class: reference
version: 0.1.0
---

# Lifting Tracker — Conversation Archive

Date-prefixed historical record of significant Cowork / Dispatch / Code conversations. Operational class (historical) per CONVENTIONS_v0.2.4 §4. Read these when you need context for why a decision was made or what was discussed before durable artifacts captured it.

## Naming convention

`YYYY-MM-DD_<slug>.md` per CONVENTIONS §6.2 — date FIRST (chronological sort is the structural key for archives, an explicit exception to the general "version at end" rule), descriptive slug after. Date is in ISO-8601 calendar form for sortability.

Slug should follow the §6.1 descriptiveness rule: name what kind of conversation it was, not just an opaque hash or session ID. Examples: `claude-code-build`, `chat-claude-setup-extract`, `architecture-review`, `cm-design-walkthrough`.

## Files in scope

| Date | Slug | Topic |
|---|---|---|
| 2026-04-14 | chat-claude-setup-extract | Initial Claude Code setup conversation extract |
| 2026-04-14 | claude-code-build | Claude Code build session capture |

## When to add to this directory

A conversation archive entry is worth adding when:

- The conversation produced decisions or context that durable docs do NOT yet capture
- A future session would benefit from reading the conversation to understand "why" something was done
- Discussion was substantive enough that the chat history alone is insufficient (Dispatch / Cowork chat history isn't easily searchable across sessions)

Trivial back-and-forth, brief Q&A, or conversations whose substance was already promoted to durable docs (CONVENTIONS amendment, ADR, strategic-decisions log entry, memory file) do NOT need an archive entry. Per `feedback_decision_promotion.md` memory: prefer in-session promotion to durable docs over post-hoc archive capture.

## Lifecycle

Archive entries are POINT-IN-TIME — they don't get edited after creation. Status is "historical record" forever. No semver, no `updated:` field bump. The date in the filename is both the temporal scope and the version.

If a conversation produces enduring guidance (a recurring pattern, a methodology principle), the right home is a memory file or a CONVENTIONS amendment, not the archive. The archive captures the conversation; the durable doc captures the conclusion.

## Cross-references

- Conversation-archive convention: `../CONVENTIONS_v0.2.4.md` §4 (structure table) + §6.2 (date-prefixed naming)
- Memory system (per-user persistent context): `~/Library/Application Support/Claude/.../memory/MEMORY.md`
- Strategic-decisions log (for cross-cutting decisions surfaced in conversation): `~/reach4all/docs/architecture/strategic-decisions-log_v0.1.0.md`

## Pruning

None. Archives accumulate. Storage cost is trivial. If an archive becomes inaccurate (rare — conversations are immutable records of what happened), append a correction note rather than editing the original.

---

© 2026 Eric Riutort. All rights reserved.
