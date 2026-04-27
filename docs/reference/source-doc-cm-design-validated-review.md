---
author: Eric Riutort
created: 2026-04-22
updated: 2026-04-22
valid_as_of: 2026-04-22
re_check_by: 2026-07-21
tier: REFERENCE
content_class: research
---

# Source-Doc CM Design — Validated Gap Review

Validation pass over the 26 gaps identified in the first-pass review of `docs/reference/source-doc-cm-design.md`. Each gap is revisited against current (2025–2026) primary sources — SAFe, DORA, OWASP, NIST, ISO/IEC, EIA, CMMI, TOGAF, DoDAF, SLSA, CycloneDX/SPDX, sigstore, Anthropic/OpenAI/LangChain — rather than training memory. Confidence and priority have been recalibrated to a solo-plus-AI team.

---

## 1. Scope and Method

**What was validated.** The 26 gaps identified in the first-pass review, grouped by discipline:

- SAFe (G1–G5): Architectural Runway, NFRs, Value-stream mapping, PI cadence, WSJF.
- CI/CD (G6–G10): DORA metrics, rollback for doc baselines, release cadence, immutable artifacts, SBOM.
- DevSecOps (G11–G16): Secret scanning, signed commits/tags, SLSA, threat model strength, least-privilege, audit-log tamper-evidence.
- Other CM standards (G17–G20): ISO/IEC 10007, EIA-649, CMMI, NIST baseline nomenclature.
- TOGAF/EA (G21–G23): TOGAF ADM, DoDAF views, MBSE.
- Agentic-AI-dev (G24–G26): Evals for the CM skill, multi-agent conflict resolution, memory hygiene.

**Method.** For each gap: read the brief to confirm whether it's covered or missed, then fetch primary sources where reachable (and reputable third-party summaries for paywalled material). Quotes are kept under 15 words each. Each row lands a confidence level (HIGH / MEDIUM / LOW) keyed to source diversity + alignment, and a priority (must-fix / should-incorporate / nice-to-have / decline) calibrated to solo+AI scale.

**Calibration.** The brief is explicit (Section 7) that this is solo+AI and enterprise-scale practices should be individually justified. That calibration is inherited into priority grading here — e.g., DoDAF mapping is a must for a DoD program but nice-to-have at best for this posture.

**Source hierarchy.** Primary standards bodies (ISO, NIST, SAE, OpenGroup, DoD, OWASP) first; vendor reference docs (Anthropic, LangChain, GitHub) second; reputable third-party summaries last. Paywalls are flagged inline.

---

## 2. Validated Gap Rows (G1–G26)

### G1 — Architectural Runway absent

- **Original claim:** SAFe requires explicit runway planning (enablers, enabler epics); brief doesn't address it.
- **Current state per sources:** SAFe defines Architectural Runway as the existing code, components, and technical infrastructure needed to implement near-term features without excessive redesign. It is built and maintained via Enabler epics, capabilities, features, and stories, managed on the same backlogs as business work. The concept is foundational to SAFe's continuous delivery pipeline and is intended to prevent architectural debt from blocking future increments. For a source-doc CM brief (not code), runway translates loosely to "reference scaffolding" (templates, manifest schema, tier model) — which §3 and §4 of the brief already provide implicitly.
- **Confidence:** HIGH — SAFe site directly defines the term and its artifacts.
- **Priority for solo+AI:** decline — enablers as a backlog discipline are enterprise-team overhead; brief already ships equivalent scaffolding via tier model and manifest schema.
- **Citations:**
  - [Architectural Runway - Scaled Agile Framework](https://framework.scaledagile.com/architectural-runway) — "the existing code, components, and technical infrastructure needed to implement near-term features"
  - [Enablers - Scaled Agile Framework](https://framework.scaledagile.com/enablers) — enablers "support activities needed to extend the Architectural Runway"
  - [SAFe Lean-Agile Principles](https://framework.scaledagile.com/safe-lean-agile-principles) — runway built incrementally via enabler work
- **Recommended action:** No change to brief body; add a one-line note in §7 Risk-vs-Ops Calibration row "Architectural Runway → skip; tier model + manifest schema serve equivalent scaffolding role at solo scale."

---

### G2 — NFRs not first-class

- **Original claim:** SAFe treats NFRs as backlog items; brief's user-stories list (US-300, 301, 310, 311, 320, 321) doesn't elevate them.
- **Current state per sources:** SAFe classifies Non-Functional Requirements (performance, security, reliability, usability, maintainability) as system qualities that constrain backlog items at every level (Portfolio, Solution, ART, Team). Rather than standalone backlog items, NFRs are attached as constraints/acceptance criteria to features and stories, and validated continuously. SAFe explicitly warns that treating NFRs as afterthoughts produces technical debt. For a CM brief, relevant NFRs are integrity (no content loss), traceability, and reproducibility — the brief addresses these via Book Boss verify (§5.5), baseline tags (§2.5), and append-only ledger (§6), though not labeled as "NFRs."
- **Confidence:** HIGH — SAFe article is explicit and current.
- **Priority for solo+AI:** should-incorporate — naming the NFRs makes testability explicit and cheap.
- **Citations:**
  - [Nonfunctional Requirements - Scaled Agile](https://framework.scaledagile.com/nonfunctional-requirements) — NFRs are "system qualities" constraining every backlog level
  - [Nonfunctional Requirements - Scaled Agile](https://framework.scaledagile.com/nonfunctional-requirements) — "specify system attributes such as security, reliability, performance, maintainability, scalability, and usability"
- **Recommended action:** Add §2.7 "Documentation NFRs" listing integrity, traceability, reproducibility, discoverability with the CI job or skill step that enforces each.

---

### G3 — Value-stream mapping missing

- **Original claim:** SAFe begins with identifying operational and development value streams.
- **Current state per sources:** SAFe 6.0/7.0 makes value stream identification the entry point for any SAFe adoption — operational value streams (the business process delivering value to the end customer) precede development value streams (the systems, teams, and flows that build and maintain them). The framework treats this as a precondition for ART design. For a solo-plus-AI doc CM system, "value stream" collapses to a single author-to-reader loop with Claude as the agentic collaborator; mapping is trivial and implicit but not formally documented in the brief.
- **Confidence:** HIGH — SAFe site is explicit; primary guidance stable across versions.
- **Priority for solo+AI:** nice-to-have — a single diagram clarifies intent but adds little mechanical value at this scale.
- **Citations:**
  - [Value Streams - Scaled Agile Framework](https://framework.scaledagile.com/value-streams) — "Value Streams represent the series of steps that an organization uses to deliver value"
  - [Identify Value Streams and ARTs - Scaled Agile](https://framework.scaledagile.com/identify-value-streams-and-arts) — identification is the foundational step in SAFe adoption
- **Recommended action:** Add §1.6 "Value Stream (solo scale)" — one-paragraph diagram-in-prose: Eric authors → Claude agent transforms → git baseline → reader (future-Eric, external agent) consumes.

---

### G4 — Program Increment cadence not addressed

- **Original claim:** Brief talks sprints but not PIs (8–12 week planning horizon).
- **Current state per sources:** SAFe's Program Increment (renamed "Planning Interval" in SAFe 6.0) is a timebox of 8–12 weeks during which an ART delivers incremental value. PI Planning is the cadence-based, face-to-face event that aligns teams. SAFe 6.0 docs explicitly note the rename from "Program Increment" to "Planning Interval" while preserving the acronym PI. For a solo author, PI cadence has no operational meaning — there is no cross-team alignment to synchronize. Sprint-level cadence (already in brief) is the appropriate unit.
- **Confidence:** HIGH — SAFe rename and cadence definition are well-documented.
- **Priority for solo+AI:** decline — PI cadence exists to synchronize multiple teams; N=1 doesn't need it.
- **Citations:**
  - [Planning Interval - Scaled Agile Framework](https://framework.scaledagile.com/planning-interval) — "timebox during which an Agile Release Train delivers incremental value"
  - [PI Planning - Scaled Agile Framework](https://framework.scaledagile.com/pi-planning) — cadence-based event "typically 8–12 weeks"
- **Recommended action:** Add a one-line "PI cadence → skip (single author)" entry to §7 Risk-vs-Ops table. No other change.

---

### G5 — WSJF prioritization

- **Original claim:** SAFe uses Weighted Shortest Job First to prioritize backlog; Notekeeper has no priority model.
- **Current state per sources:** SAFe WSJF computes priority as Cost of Delay (user-business value + time criticality + risk reduction/opportunity enablement) divided by job size. It is the canonical method for sequencing features in SAFe backlogs. For a doc CM brief, priority translates to "which doc update ships first when Eric has 2 hours" — a lightweight version of WSJF (value/effort) is legitimately useful at any scale because it forces explicit trade-off. The brief currently has no priority scheme.
- **Confidence:** HIGH — WSJF formula and rationale are well-documented on SAFe site.
- **Priority for solo+AI:** should-incorporate — a one-line "value/effort" heuristic in the manifest or work log is cheap and reduces decision thrash.
- **Citations:**
  - [WSJF - Scaled Agile Framework](https://framework.scaledagile.com/wsjf) — "WSJF = Cost of Delay / Job Size"
  - [WSJF - Scaled Agile Framework](https://framework.scaledagile.com/wsjf) — Cost of Delay = "user-business value + time criticality + risk reduction and/or opportunity enablement"
- **Recommended action:** Add §4.3 "Priority field in manifest" — optional `priority: {value: 1-5, effort: 1-5}` tuple; recommend processing highest value/effort ratio first. Explicitly cite WSJF as the inspiration with a note that full CoD decomposition is overkill.

---

### G6 — No DORA metrics

- **Original claim:** Deployment frequency, lead time, change failure rate, MTTR should be tracked for source-doc CI/CD too.
- **Current state per sources:** DORA's four key metrics — deployment frequency, lead time for changes, change failure rate, and failed deployment recovery time (renamed from MTTR in 2024) — remain the canonical software delivery performance measures per the 2024 State of DevOps Report. The 2024 report also adds a fifth metric (rework rate) and emphasizes that the four keys apply to any delivery system, not just code. For source docs, deployment frequency = baseline tag cadence; lead time = commit-to-tag; change failure rate = baselines requiring revert; recovery time = time from bad baseline to corrected baseline.
- **Confidence:** HIGH — DORA 2024 report is primary, recent, and explicit on metric definitions.
- **Priority for solo+AI:** nice-to-have — the Scorekeeper ledger can emit these trivially; signal/noise is low at solo scale but trend data is cheap to capture.
- **Citations:**
  - [DORA 2024 State of DevOps Report](https://dora.dev/research/2024/dora-report/) — four keys: "deployment frequency, lead time for changes, change failure rate, and failed deployment recovery time"
  - [DORA Core](https://dora.dev/guides/dora-core/) — metrics apply across delivery contexts
  - [Google Cloud DORA](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report) — 2024 report summary
- **Recommended action:** Add §5.6 "DORA-equivalent doc metrics" listing the four keys as they map to baseline tags and stating Scorekeeper emits them to a monthly JSON summary.

---

### G7 — Rollback procedure for doc baselines

- **Original claim:** Brief says tags are immutable but doesn't specify rollback (revert-commit vs new-baseline-tag vs forward-fix-only).
- **Current state per sources:** Standard git/semver practice and GitOps doctrine (e.g., semantic-release, Conventional Commits FAQ) treat tags as immutable and require forward-fix: create a new commit that reverts or supersedes the bad change, then tag a new baseline (e.g., v1.2.1 correcting v1.2.0). Re-tagging (moving a tag) is explicitly forbidden because downstream consumers and CI caches have already resolved the old tag. GitHub's own release docs recommend this pattern. The brief's "tags immutable, no force-push" rule implies forward-fix but doesn't name it.
- **Confidence:** HIGH — git semantics, semantic-release, and GitHub docs all converge on forward-fix.
- **Priority for solo+AI:** must-fix — rollback ambiguity is a real failure mode; fix is one paragraph.
- **Citations:**
  - [Semantic Versioning 2.0.0](https://semver.org/) — versions, once released, must not be modified
  - [semantic-release FAQ](https://semantic-release.gitbook.io/semantic-release/support/faq) — releases are immutable; fix-forward via new version
  - [GitHub Docs: Managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) — edit release notes, not the tagged commit
- **Recommended action:** Add §2.6.1 "Rollback policy" — three lines: (1) tags never move, (2) bad baselines are corrected by `git revert` + new baseline tag (e.g., v1.2.1), (3) deprecation note added to manifest `status` field.

---

### G8 — Release cadence rule

- **Original claim:** Brief doesn't state whether doc releases are continuous on merge or sprint-aligned.
- **Current state per sources:** DORA 2024 data shows elite performers ship on-demand (continuous); release-train/sprint-aligned cadence is associated with mid-tier performance. Continuous delivery doctrine (Humble/Farley, reinforced in Accelerate) argues cadence should match the artifact's consumers' tolerance for change. For source docs consumed by one author + one agent, on-merge baseline tags ("every merge to main is a baseline") is the lowest-friction rule. Sprint-aligned cadence would add ceremony without benefit.
- **Confidence:** MEDIUM — doctrine is clear but application to source-doc CM is inferred, not explicit in primary sources.
- **Priority for solo+AI:** should-incorporate — explicit rule prevents drift; one sentence.
- **Citations:**
  - [DORA 2024 State of DevOps Report](https://dora.dev/research/2024/dora-report/) — elite performers deploy on-demand
  - [Continuous Delivery - Jez Humble](https://continuousdelivery.com/principles/) — "release small changes frequently"
- **Recommended action:** Add one line to §2.6 "Baselines are tagged on every merge to main that touches a tier-1 or tier-2 doc; no sprint-aligned release train."

---

### G9 — Immutable artifacts not explicitly named

- **Original claim:** Brief implies immutability but doesn't use "immutable artifact" terminology or discuss content-addressed storage.
- **Current state per sources:** Immutability is a canonical CI/CD principle: SLSA, OCI, and artifact repositories (Artifactory, GHCR) all enforce content-addressed storage (sha256 digest) as the immutability mechanism. Git tags are functionally equivalent for source docs because they reference a commit SHA (itself a content hash). Calling this out with the right term aids future readers and aligns with supply-chain vocabulary. Content-addressed storage beyond git (e.g., for rendered PDFs of baselined docs) is a future concern, not MVP.
- **Confidence:** HIGH — terminology is industry-standard.
- **Priority for solo+AI:** nice-to-have — pure naming improvement; zero mechanical change.
- **Citations:**
  - [SLSA v1.0 Spec - Terminology](https://slsa.dev/spec/v1.0/terminology) — artifact identified "by its cryptographic digest"
  - [OCI Image Spec](https://github.com/opencontainers/image-spec/blob/main/descriptor.md) — content-addressed via sha256 digest
- **Recommended action:** In §2.5, add a sentence: "Baseline tags are immutable artifacts in the SLSA sense — the git commit SHA is the content-addressed identifier."

---

### G10 — SBOM for skill dependencies

- **Original claim:** CycloneDX or SPDX SBOM for the Python deps of skill scripts (`book_boss.py` etc.) is not mentioned.
- **Current state per sources:** CycloneDX v1.6 (2024) and SPDX 3.0 (2024) are the two primary SBOM standards; both are ISO/IEC-recognized (SPDX is ISO/IEC 5962). US EO 14028 and EU CRA are driving SBOM as baseline supply-chain practice. Tools like `cyclonedx-py`, `syft`, and `pip-audit` can generate SBOMs from `requirements.txt` in one command. For skill scripts with a handful of Python deps, an SBOM is near-free but genuinely protects against a compromised upstream (e.g., PyPI typosquat).
- **Confidence:** HIGH — CycloneDX/SPDX specs and EO 14028 are primary and current.
- **Priority for solo+AI:** should-incorporate — one CI step (`cyclonedx-py -o sbom.json`) is cheap insurance.
- **Citations:**
  - [CycloneDX v1.6 Specification](https://cyclonedx.org/specification/overview/) — SBOM standard for software supply chain
  - [SPDX 3.0](https://spdx.dev/learn/overview/) — ISO/IEC 5962:2021 SBOM standard
  - [CISA SBOM Guidance](https://www.cisa.gov/sbom) — SBOM as baseline supply-chain practice
- **Recommended action:** Add a CI job to §5.2 "sbom-generate" using `cyclonedx-py`; commit SBOM to `supply-chain/sbom.json` on each baseline tag.

---

### G11 — Secret scanning absent

- **Original claim:** No gitleaks / trufflehog / GitHub secret scanning in pre-commit or CI.
- **Current state per sources:** GitHub Secret Scanning is free for public repos and available for private repos via Advanced Security; it detects 200+ token patterns and supports push protection (block on detect). Gitleaks and trufflehog are the canonical OSS pre-commit/CI scanners; both have maintained pre-commit hooks in 2024–2025. OWASP DevSecOps Maturity Model Level 1 includes secret scanning as a baseline control. For source docs, leaked API keys (Supabase service role, LLM keys) are a live risk even if docs "shouldn't" contain them.
- **Confidence:** HIGH — sources are primary and current.
- **Priority for solo+AI:** must-fix — cost is minutes, risk is real and asymmetric.
- **Citations:**
  - [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) — "scans repositories for known types of secrets"
  - [gitleaks](https://github.com/gitleaks/gitleaks) — pre-commit hook for secret detection
  - [OWASP DevSecOps Maturity Model](https://owasp.org/www-project-devsecops-maturity-model/) — secret scanning as baseline
- **Recommended action:** Add gitleaks to §5.3 pre-commit hooks and §5.2 CI jobs; enable GitHub push protection in repo settings (note in §8).

---

### G12 — Signed commits/tags not required

- **Original claim:** No GPG or sigstore (gitsign) for commit/tag provenance.
- **Current state per sources:** sigstore's `gitsign` (2023+) provides keyless commit and tag signing using OIDC identity — no GPG key management. GitHub fully supports sigstore-signed commits as of 2024. For solo work, signing proves "this commit came from Eric's verified identity, not a compromised agent," which matters more in agentic workflows where Claude could be the actor. Traditional GPG still works but has key-management overhead; sigstore removes that.
- **Confidence:** HIGH — sigstore and gitsign docs are primary and current.
- **Priority for solo+AI:** should-incorporate — gitsign is essentially free and materially strengthens agentic-AI-dev frame provenance.
- **Citations:**
  - [gitsign - sigstore](https://github.com/sigstore/gitsign) — "keyless Git commit and tag signing using Sigstore"
  - [GitHub: About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification) — supports GPG, SSH, S/MIME, and sigstore
  - [sigstore overview](https://www.sigstore.dev/) — free signing service for open-source
- **Recommended action:** Add §2.8 "Commit and tag signing" — require gitsign (or GPG) for all commits on main; CI job verifies signatures on baseline tags.

---

### G13 — SLSA attestation framework not mentioned

- **Original claim:** SLSA v1.0 build provenance levels not considered.
- **Current state per sources:** SLSA v1.0 (2023) defines Build Levels L1–L3 (L4 deferred to v1.1+): L1 = provenance exists, L2 = hosted build platform, L3 = hardened build with non-forgeable provenance. GitHub Actions + sigstore produce SLSA L3 provenance natively via the `slsa-github-generator` actions. For source docs, the relevant artifact is the baseline tag or rendered doc bundle; L2 (build on GitHub Actions with signed provenance) is achievable essentially for free. L3 is overkill for solo scale.
- **Confidence:** HIGH — SLSA v1.0 spec is primary and stable.
- **Priority for solo+AI:** nice-to-have — L2 attestations are cheap but provide marginal value until there are external consumers of the docs.
- **Citations:**
  - [SLSA v1.0 Build Levels](https://slsa.dev/spec/v1.0/levels) — L1 "provenance exists," L2 "hosted build," L3 "hardened build"
  - [slsa-github-generator](https://github.com/slsa-framework/slsa-github-generator) — native GitHub Actions SLSA L3 provenance
  - [SLSA v1.0 Provenance](https://slsa.dev/spec/v1.0/provenance) — attestation format spec
- **Recommended action:** Add a one-line note to §8 Open-Standards Audit: "SLSA L2 provenance achievable via `slsa-github-generator`; defer until external doc consumers exist." No body change in MVP.

---

### G14 — Q9 Mythos/Glasswing threat model is lightweight

- **Original claim:** Current §10 Q9 treatment is inadequate vs STRIDE, LINDDUN, MAESTRO, or OWASP LLM Top 10 2025.
- **Current state per sources:** OWASP's 2025 GenAI Top 10 explicitly adds agentic risks (LLM06 Excessive Agency, LLM08 Vector/Embedding Weaknesses) and the separate "Agentic AI — Threats and Mitigations" guide enumerates 15 agentic threat classes. MAESTRO (Cloud Security Alliance, 2025) is a 7-layer threat framework purpose-built for agentic AI that extends STRIDE/LINDDUN into the agent stack. For solo+AI, full STRIDE/MAESTRO modeling is overkill, but the brief should at least name a reference framework and enumerate the top 3–5 concrete agentic risks (excessive agency, prompt injection via skill content, tool misuse) that bite at this scale.
- **Confidence:** HIGH — OWASP 2025 list and MAESTRO are both current and widely cited.
- **Priority for solo+AI:** should-incorporate — frameworks are heavyweight, but naming a reference and listing top-5 agentic risks is cheap insurance.
- **Citations:**
  - [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/) — "LLM06:2025 Excessive Agency" and "LLM01 Prompt Injection" remain top risks.
  - [CSA — Agentic AI Threat Modeling Framework: MAESTRO](https://cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro) — "seven-layer reference architecture" for agentic AI threat modeling.
  - [OWASP Agentic AI — Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/) — enumerates 15 agentic threat taxonomies.
- **Recommended action:** In §10, add a "Threat-model reference" subsection citing OWASP LLM Top 10 2025 + MAESTRO, and list the top 3–5 agentic risks concretely applicable to the skill (excessive agency, skill-content prompt injection, tool misuse, unlogged state change, cross-session leak).

---

### G15 — No least-privilege enforcement beyond allowed-tools

- **Original claim:** Need OS-level sandboxing, filesystem scoping, network allow-list; `allowed-tools` alone is coarse.
- **Current state per sources:** Claude Code's own docs recommend containerized/devcontainer execution and explicitly note that `allowed-tools` frontmatter is an allowlist at the tool-invocation layer, not a sandbox. Anthropic's Sep-2025 "Writing Tools for Agents" and the Dec-2025 Agent Skills spec both push execution into isolated environments (Code Execution tool, sandboxed containers) rather than relying on allowlist hygiene alone. For solo+AI on a laptop, full container sandboxing is heavy; a filesystem-scope declaration (working-dir allowlist) and network-off by default for skill scripts is a proportionate step.
- **Confidence:** HIGH — Anthropic's own guidance explicitly distinguishes allowlist from sandbox.
- **Priority for solo+AI:** should-incorporate — full sandbox is overkill, but a scoped fs/network declaration in skill frontmatter is proportionate.
- **Citations:**
  - [Anthropic — Claude Code Security](https://docs.claude.com/en/docs/claude-code/security) — "we recommend using development containers" for isolation.
  - [Anthropic — Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills) — "allowed-tools" is a tool-layer constraint, not an OS sandbox.
  - [Anthropic — Writing Tools for Agents](https://www.anthropic.com/engineering/writing-tools-for-agents) — "isolate execution environments and apply least-privilege."
- **Recommended action:** In §10, add explicit filesystem scope (working-dir allowlist) and default-deny network posture for skill bash steps; note devcontainer as optional upgrade path.

---

### G16 — Audit log tamper-evidence missing

- **Original claim:** scorekeeper.json is append-only but not hash-chained; tamper-evident chain or sigstore attestation would close the gap.
- **Current state per sources:** Append-only is an access-control property, not a tamper-evidence property — anyone with write access can rewrite the file. Hash-chaining (each entry includes SHA-256 of the previous entry) is the standard cheap primitive; this is what git itself does and what sigstore's Rekor transparency log implements at scale. For solo+AI, full sigstore is unnecessary, but adding a `prev_hash` field per entry and a verify script is ~20 lines of Python and gives real tamper-evidence at zero ops cost.
- **Confidence:** HIGH — hash-chaining is a well-known primitive with cheap implementation.
- **Priority for solo+AI:** should-incorporate — cost is trivial, value is real (detects accidental edits and malicious rewrites).
- **Citations:**
  - [Sigstore — Rekor transparency log](https://docs.sigstore.dev/logging/overview/) — "append-only, tamper-resistant" via Merkle-tree.
  - [NIST SP 800-92 — Log Management](https://csrc.nist.gov/publications/detail/sp/800-92/final) — recommends cryptographic integrity protection for audit logs.
  - [RFC 9162 — Certificate Transparency 2.0](https://www.rfc-editor.org/rfc/rfc9162.html) — canonical hash-chained append-only log design.
- **Recommended action:** In §6 Scorekeeper section, add `prev_hash` field to JSON schema and a `verify_scorekeeper.py` script; keep it local (no Rekor dependency).

---

### G17 — ISO/IEC 10007:2017 not cited

- **Original claim:** The international standard for CM should be referenced; brief only cites 12207:2017.
- **Current state per sources:** ISO 10007:2017 "Quality management — Guidelines for configuration management" is the ISO CM reference and defines the core CM activities (identification, change control, status accounting, configuration audit) that every downstream CM standard inherits. It is explicitly a guideline standard (not a certifiable requirements standard), so citation cost is low and it anchors the brief's CM vocabulary to an international baseline. BSI and NQA publish free third-party summaries; the ISO page itself is paywalled.
- **Confidence:** HIGH — standard is current, widely referenced, and directly on-topic.
- **Priority for solo+AI:** should-incorporate — one citation line, anchors vocabulary.
- **Citations:**
  - [ISO 10007:2017 abstract](https://www.iso.org/standard/70400.html) — "guidelines for configuration management" [paywall]
  - [BSI — ISO 10007 CM guidance](https://www.bsigroup.com/en-GB/standards/iso-10007/) — summarizes the four core CM activities.
  - [NQA — ISO 10007 summary](https://www.nqa.com/en-us/resources/blog/june-2020/iso-10007) — "identification, change control, status accounting, audit."
- **Recommended action:** In §1 Four Frames (or §2 Versioning preamble), add citation to ISO 10007:2017 alongside 12207:2017 and map the four CM activities to brief sections.

---

### G18 — EIA-649 not referenced

- **Original claim:** EIA-649-C (SAE) is the US consensus CM standard; CM Plan structure derives from it.
- **Current state per sources:** SAE EIA-649C (2019, reaffirmed 2024) is the US "National Consensus Standard for Configuration Management" and is the structural source for DoD, NASA, and most US aerospace CM plans. It defines five CM functions (planning/management, identification, change management, status accounting, verification/audit) and is tailored for adoption at any scale — the standard itself explicitly supports scaling down. For solo+AI, citing it is effectively free and it's the lineage standard behind MIL-HDBK-61B.
- **Confidence:** HIGH — EIA-649-C is the current consensus standard, widely referenced.
- **Priority for solo+AI:** nice-to-have — citation is cheap, but adds less than ISO 10007 since it's US-sector-specific.
- **Citations:**
  - [SAE EIA-649C abstract](https://www.sae.org/standards/content/eia649c/) — "National Consensus Standard for Configuration Management" [paywall]
  - [NASA — CM Handbook references EIA-649](https://www.nasa.gov/wp-content/uploads/2015/07/configuration_management_handbook.pdf) — "five CM functions" from EIA-649.
  - [DAU — CM Guidebook](https://www.dau.edu/cop/pqm/resources/dod-configuration-management-guidance) — references EIA-649 as commercial-standard baseline.
- **Recommended action:** In §1 Four Frames preamble, add EIA-649-C citation alongside ISO 10007 and 12207; note that brief's structure maps to the five EIA-649 functions.

---

### G19 — CMMI maturity levels not mapped

- **Original claim:** CMMI v3.0 CM practice area (ML2–ML3) could calibrate where brief lands.
- **Current state per sources:** CMMI v3.0 (ISACA, 2023; updates through 2025) places Configuration Management as a practice area introduced at Maturity Level 2 with deeper practices at ML3 (baseline integrity, change management, configuration audits). For solo+AI, CMMI assessment is not in scope, but self-assessing where the brief targets (ML2-equivalent practices: identification, change control, status accounting) is a one-paragraph exercise that clarifies ambition. Going beyond ML2 is disproportionate at this scale.
- **Confidence:** MEDIUM — CMMI mapping is valuable framing but optional; confidence on the fact CMMI has a CM practice area is high, on the value of mapping it for solo+AI is lower.
- **Priority for solo+AI:** decline — CMMI framing is enterprise-scoped; self-assessment adds ceremony without changing what gets built.
- **Citations:**
  - [ISACA — CMMI v3.0 overview](https://cmmiinstitute.com/cmmi/cmmi-v3-0) — CM practice area present from ML2.
  - [CMMI Institute — Configuration Management practice area](https://cmmiinstitute.com/learning/cmmi-model-v3-0) — "establish and maintain integrity of work products."
- **Recommended action:** Decline. Optionally add one sentence in §7 Risk-vs-Ops noting brief targets "CMMI ML2-equivalent CM practices, not assessed."

---

### G20 — NIST baseline nomenclature not cross-referenced

- **Original claim:** NIST/MIL use functional/allocated/product baseline; brief's 4-tier tier naming is idiosyncratic.
- **Current state per sources:** MIL-HDBK-61B and NIST SP 800-128 both use the functional/allocated/product baseline taxonomy, which applies to *system-development* configuration items (requirements → design → as-built product). The brief's REFERENCE/COMPANION/MASTER/OPERATIONAL tier is a *document lifecycle* taxonomy — a different axis (source-of-truth posture, not development stage). The two are orthogonal, not competing, so the brief should cross-reference to prevent reviewer confusion rather than rename.
- **Confidence:** HIGH — the two taxonomies address different objects (CI baselines vs document tiers).
- **Priority for solo+AI:** should-incorporate — one-paragraph cross-reference prevents "why isn't this using the standard terms" challenges.
- **Citations:**
  - [NIST SP 800-128](https://csrc.nist.gov/publications/detail/sp/800-128/final) — "functional, allocated, and product baselines."
  - [MIL-HDBK-61B](https://quicksearch.dla.mil/qsDocDetails.aspx?ident_number=287536) — defines three program baselines over system lifecycle.
  - [NASA CM Handbook §4.2](https://www.nasa.gov/wp-content/uploads/2015/07/configuration_management_handbook.pdf) — same three-baseline taxonomy.
- **Recommended action:** In §3 Tier Model, add a paragraph noting NIST/MIL three-baseline taxonomy is orthogonal (development-stage CI baselines vs document source-of-truth tiers) and explicitly declining to re-use those terms.

---

### G21 — TOGAF ADM mapping absent

- **Original claim:** TOGAF 10 ADM phases could frame brief's place in the architecture lifecycle.
- **Current state per sources:** TOGAF 10 ADM (2022, supplemented through 2025) defines phases Preliminary through H plus Requirements Management, with explicit "Architecture Repository" and "Architecture Content Framework" deliverables that are the direct equivalent of what this brief governs. For enterprise EA, mapping CM onto ADM Phase G (Implementation Governance) and the Architecture Repository is standard practice. For solo+AI on a single sub-system, full ADM alignment is disproportionate — but one paragraph noting which ADM phases the brief's documents correspond to would anchor the brief in Eric's EA training without adding ceremony.
- **Confidence:** HIGH — TOGAF ADM is well-specified; the question is proportionality.
- **Priority for solo+AI:** nice-to-have — Eric is EA-trained so a one-paragraph ADM map is low-cost and increases doc self-documentation.
- **Citations:**
  - [TOGAF 10 — ADM Overview](https://pubs.opengroup.org/togaf-standard/adm/) — phases Preliminary through H plus Requirements Management.
  - [TOGAF 10 — Architecture Repository](https://pubs.opengroup.org/togaf-standard/architecture-content/chap03.html) — governance of architecture artifacts.
- **Recommended action:** In §1 Four Frames, optionally add a one-paragraph TOGAF ADM map (which documents correspond to which ADM phase outputs); mark as informative, not normative.

---

### G22 — DoDAF views/viewpoints not cross-referenced

- **Original claim:** DoDAF 2.02 OV/SV/SvcV/DIV/CV/PV/AV could frame SoS applicability.
- **Current state per sources:** DoDAF 2.02 is the current version (no 3.0 released), and its viewpoints are designed for defense SoS. The brief's scope is source-document CM for a single sub-system (Lifting Tracker) with an explicit SoS parent (XRSize4 ALL) documented in `xrsize4all_concept_v0.2.0.md`. DoDAF viewpoint mapping would belong in the xrsize4all concept doc, not this CM brief — the CM brief governs *how* architecture docs are versioned, not *what* views they contain.
- **Confidence:** HIGH — DoDAF is clearly scoped to defense SoS and is orthogonal to CM-of-docs.
- **Priority for solo+AI:** decline — wrong doc; belongs in the SoS concept doc if anywhere.
- **Citations:**
  - [DoDAF 2.02 — Viewpoints](https://dodcio.defense.gov/Library/DoD-Architecture-Framework/) — OV, SV, SvcV, DIV, CV, PV, AV.
- **Recommended action:** Decline. Optionally note in §1 that DoDAF view/viewpoint applicability belongs in `xrsize4all_concept_v0.2.0.md`, not in the CM brief.

---

### G23 — MBSE not named

- **Original claim:** SysML/OPM-based MBSE is current standard for SoS; brief is document-based not model-based.
- **Current state per sources:** INCOSE's MBSE Initiative and OMG SysML v2 (released 2024, maturing through 2025) do define model-based SE as the direction for SoS engineering, with SysML v2 replacing v1.x via a textual+graphical notation. However, MBSE requires tooling (Cameo, SysML v2 Pilot Implementation, Capella) that is disproportionate for solo+AI and would replace, not supplement, document-based CM. The brief is explicitly document-centric by design (D1 architecture doc, stories, roadmaps), which is appropriate at this scale; MBSE is a path not taken, worth naming as a deliberate choice.
- **Confidence:** HIGH — MBSE is real and current, but requires heavy tooling.
- **Priority for solo+AI:** decline — deliberate document-based choice; one sentence acknowledging MBSE as alternative is enough.
- **Citations:**
  - [INCOSE — MBSE Initiative](https://www.incose.org/communities/working-groups-initiatives/mbse-initiative) — "MBSE is the formalized application of modeling."
  - [OMG SysML v2](https://www.omg.org/spec/SysML/2.0/Beta2/) — 2024 release, textual + graphical.
- **Recommended action:** In §1 Four Frames or §7 Risk-vs-Ops, add one sentence: "Document-based, not MBSE/SysML v2 — deliberate choice at solo+AI scale; tooling cost (Cameo/Capella/SysML v2 pilot) not justified."

---

### G24 — Evals framework for the CM skill itself missing

- **Original claim:** Brief mentions evaluation philosophically in §1.4 but doesn't specify a harness (test corpus, golden outputs, regression suite, metrics).
- **Current state per sources:** Anthropic's "Writing Tools for Agents" (Sep 2025) is emphatic that evals are the forcing function — "without evals on realistic tasks, you can't tell whether a tool is actually working" — and recommends curated task sets with measurable outcomes. For a CM skill, a minimal eval harness is: (1) a fixture corpus of sample doc-update scenarios (add ADR, bump semver, rename file, update manifest), (2) golden expected outputs, (3) a regression runner that invokes the skill and diffs. §1.4 cites the principle; §9 implementation sketch doesn't instantiate it. Closing this gap costs ~1 day and is the single highest-leverage addition on this list.
- **Confidence:** HIGH — Anthropic's own engineering guidance is explicit.
- **Priority for solo+AI:** must-fix — §1.4 already commits to the principle; not implementing it is a contradiction.
- **Citations:**
  - [Anthropic — Writing Tools for Agents](https://www.anthropic.com/engineering/writing-tools-for-agents) — "evals are the forcing function."
  - [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — "test on realistic tasks before shipping."
  - [Anthropic — Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills) — recommends skill evaluation patterns.
- **Recommended action:** Add §9.5 "Eval Harness for the CM Skill" — specify fixture corpus location (`skills/document-cm/evals/`), golden-output format, runner invocation, and initial 5–10 scenarios (ADR add, semver bump, baseline freeze, manifest update, skill registration).

---

### G25 — Multi-agent/multi-skill conflict resolution absent

- **Original claim:** Multiple skills editing same doc has no conflict resolution; LangGraph 1.0 / OpenAI Agents SDK have supervisor patterns.
- **Current state per sources:** LangGraph 1.0 (Oct 2025) and OpenAI Agents SDK both formalize supervisor/handoff patterns for multi-agent coordination, but these target *runtime* agent orchestration, not file-level write conflicts. At solo+AI scale, the real conflict surface is: document-cm skill + skill-creator + any repo-scoped subagent touching the same manifest or doc file. Git's merge machinery handles textual conflicts; what's missing is a *serialization rule* — e.g., "only one skill may hold the manifest-write lock at a time" or "skill-creator must call document-cm to update manifest, never edit directly." This is a convention, not a framework.
- **Confidence:** MEDIUM — LangGraph/Agents SDK cited but they're overkill; the real gap is a convention, not a framework.
- **Priority for solo+AI:** should-incorporate — one-paragraph convention (who owns manifest writes) is cheap and prevents drift.
- **Citations:**
  - [LangChain — LangGraph 1.0](https://blog.langchain.com/langchain-langgraph-1dot0/) — supervisor patterns for multi-agent orchestration.
  - [OpenAI — Agents SDK](https://platform.openai.com/docs/guides/agents) — "handoffs" primitive for agent-to-agent delegation.
  - [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) — orchestrator-worker pattern.
- **Recommended action:** In §6 Agent-to-skill, add a "Write-ownership" subsection: document-cm owns manifest writes; other skills request updates via document-cm; textual conflicts fall back to git merge.

---

### G26 — Memory hygiene not specified

- **Original claim:** Claude Code auto memory is referenced but no hygiene rules (what to store, pruning, drift detection, leak prevention).
- **Current state per sources:** Claude Code's memory system (docs.claude.com) supports CLAUDE.md files at user, project, and local scope, plus auto-memory at `~/.claude/memory/`. Anthropic's guidance warns that memory can become stale or contradict canonical files, and recommends explicit hygiene: canonical files over memory, periodic review, and scope-aware storage. For this brief, the gap is concrete: (1) what does the CM skill write to memory vs to scorekeeper.json vs to manifest?, (2) pruning policy (TTL or size cap), (3) drift check (memory vs manifest reconciliation), (4) cross-session leak prevention (no athlete data in memory).
- **Confidence:** HIGH — Anthropic docs explicitly flag memory-vs-canonical-files tension.
- **Priority for solo+AI:** should-incorporate — brief already references memory; not specifying hygiene leaves a known-stale surface.
- **Citations:**
  - [Anthropic — Memory and CLAUDE.md](https://docs.claude.com/en/docs/claude-code/memory) — "files authoritative over memory."
  - [Anthropic — Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices) — periodic CLAUDE.md review.
  - [Anthropic — Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills) — skill-scoped vs user-scoped storage.
- **Recommended action:** In §6 (after memory-hygiene paragraph), add a subsection "Memory hygiene rules": (a) manifest and scorekeeper are canonical, memory is cache; (b) no athlete data in memory; (c) monthly drift check (memory summary vs manifest); (d) pruning via Claude Code `/memory` review.

---

## 3. Cross-Cutting Findings

### 3.1 Clusters — gaps that collapse to single actions

Three clusters merge when the recommended actions are pooled:

- **Supply-chain hardening cluster (G10, G11, G12, G13, G16).** SBOM + secret scanning + signed commits + SLSA provenance + tamper-evident scorekeeper are all one motion: a single "supply-chain" CI pipeline + pre-commit chain + gitsign bootstrap. Closing them together is ~one day of setup; closing them piecemeal costs more in context-switching than in implementation.
- **Threat model + least-privilege cluster (G14, G15).** OWASP LLM Top 10 2025 / MAESTRO threat-model reference + filesystem/network scope for skill scripts are complementary: the threat model names the risks, the scope declaration mitigates them. One subsection in §10 covers both.
- **Standards-citation cluster (G17, G18, G20).** ISO 10007 + EIA-649 + NIST baseline cross-reference all add one short paragraph each to §1 and §3. Trivial together; fragmented individually.

Implication: bundle the recommendations at write time rather than implementing them as 26 atomic edits.

### 3.2 Gaps the original review overstated

- **G1 (Architectural Runway).** Brief already ships the equivalent scaffolding (tier model, manifest schema, templates in §6.1). "Missing" is misleading; "not named using SAFe terminology" is accurate.
- **G4 (PI cadence).** Correctly identified as a missing enterprise practice but irrelevant at solo+AI scale. Priority is decline, not must-fix.
- **G19 (CMMI mapping).** CMMI assessment is enterprise-scoped. Self-assessment adds ceremony without changing what gets built.
- **G22 (DoDAF views).** Wrong doc — belongs in `xrsize4all_concept_v0.2.0.md` if anywhere, not the CM brief.
- **G23 (MBSE).** Deliberate document-based choice; the brief would benefit from naming it as such rather than adopting MBSE.

### 3.3 Gaps the original review understated

- **G7 (Rollback procedure).** The review correctly flagged this as missing but did not emphasize that it is a *real* operational failure mode. When a bad baseline ships and the rule isn't written down, recovery drifts into ad-hoc decisions. This is must-fix and was tagged as lesser.
- **G11 (Secret scanning).** Asymmetric risk — cost is minutes, downside is a leaked Supabase service-role key. The review framed it as one of six DevSecOps gaps; it deserves standalone emphasis.
- **G24 (Evals harness).** The review correctly flagged §1.4's commitment-without-implementation contradiction, but this is the single highest-leverage addition on the list — it's what makes every other check verifiable.

### 3.4 Gaps that should be dropped because the brief already covers them

- **G1 partial drop.** Brief's §3 Tier Model + §4 manifest schema + §6.1 templates already constitute architectural scaffolding. Recommend relabeling the gap "Architectural Runway not named using SAFe terminology" rather than "absent."
- **G9 (Immutable artifacts).** Brief says tags are immutable and never force-pushed (§2.6). The only gap is terminology — `immutable artifact` / content-addressed storage. A one-line terminology addition is all that's needed; this is nice-to-have, not a real capability gap.

### 3.5 Confidence and source-diversity notes

- **HIGH confidence dominates (22 of 26).** Primary sources reachable and consistent across SAFe, DORA, OWASP, Anthropic, SLSA, sigstore, Conventional Commits, and CycloneDX/SPDX.
- **MEDIUM confidence (4 of 26):** G8 (cadence — doctrine clear, specific source-doc application inferred), G19 (CMMI — value of mapping is scale-dependent), G25 (multi-agent conflict — SDKs cited but real gap is convention, not framework).
- **No LOW-confidence rows** — every gap had at least one primary source available.

---

## 4. Newly-Identified Gaps (G27+)

### G27 — Manifest schema versioning + migration policy

- **Observation during validation:** The manifest uses `schema_version: "1.0"` (§4.3) but the brief does not specify what happens when the schema itself bumps. No migration policy, no deprecation window, no mapping from old manifest entries to new schema.
- **Current state per sources:** JSON Schema and OpenAPI practice both require versioned schemas with explicit migration (e.g., OpenAPI's `$ref` with version paths; Kubernetes CRD versioning with conversion webhooks).
- **Confidence:** HIGH — general API-versioning practice.
- **Priority:** should-incorporate — cheap insurance against future schema-change churn.
- **Recommended action:** Add §4.8 "Manifest schema versioning" — one paragraph: schema bumps follow semver; migration script required for MAJOR bumps; MINOR bumps are additive.

### G28 — Historical-import provenance (the `data/combined_workout_log.txt` source)

- **Observation during validation:** CLAUDE.md notes the repo has `data/combined_workout_log.txt` as historical import source (400+ sessions). This is a data-lineage surface not covered by the CM brief — the brief explicitly scopes out "data" but this file's *ingestion rules* are a documentation concern.
- **Current state per sources:** Data provenance (W3C PROV-DM, DataOps practice) is a distinct discipline from CM. For solo+AI, a single note in §1 Scope acknowledging the line (data files = out of scope, data ingestion rules = documentation in scope) avoids ambiguity.
- **Confidence:** MEDIUM — gap is real but narrow.
- **Priority:** nice-to-have — one sentence in §1 Scope.
- **Recommended action:** Clarify §1 Scope to say "data files are out of scope but their ingestion rules (e.g., `docs/data-import.md`) are in scope as documentation CIs."

### G29 — Third-party skill vetting process

- **Observation during validation:** §10 Q9 recommends "code-review any skill script that came from outside Eric's repo," but there's no defined *vetting process* — what gets checked, what the pass/fail criteria are, how the result is recorded. This is a procedural gap that falls out of the G14/G15 threat-model work but deserves its own line.
- **Current state per sources:** OWASP LLM Top 10 2025 and Anthropic's skill documentation both recommend explicit vetting steps (review scripts, check permissions, pin dependencies, test in isolated context).
- **Confidence:** HIGH — security practice is well-documented.
- **Priority:** should-incorporate — follows from G14 cluster.
- **Recommended action:** Add §10.9.1 "Third-party skill vetting checklist" — 5 bullets: read all scripts, check `allowed-tools` scope, pin deps, test in isolated branch, record approval in scorekeeper.

---

## 5. Revised Priority List — Must-Fix Before Skill Build

Gaps ranked by combined (priority × confidence × leverage). Only the must-fix and highest-value should-incorporate items made this list. Everything below the cut-line can wait for the brief's v1.0.0 revision.

1. **G24 — Evals harness for the CM skill** (must-fix). §1.4 commits to the principle; not implementing it is self-contradiction. Without evals, the skill can't be verified. **~1 day of work.**
2. **G11 — Secret scanning** (must-fix). Asymmetric risk; cost is minutes. Add gitleaks to pre-commit and CI. **~30 minutes.**
3. **G7 — Rollback policy for baselines** (must-fix). Operational failure mode with no documented recovery. Add §2.6.1. **~15 minutes of writing.**
4. **Supply-chain hardening bundle — G10 + G12 + G13 + G16** (should-incorporate, bundled). SBOM + gitsign + SLSA L2 + hash-chained scorekeeper. One coherent pass. **~half-day as a bundle.**
5. **Threat-model + least-privilege bundle — G14 + G15** (should-incorporate, bundled). Add §10 subsection citing OWASP LLM Top 10 2025 + MAESTRO; declare fs/network scope for skill bash. **~2 hours.**
6. **G2 — Documentation NFRs (integrity, traceability, reproducibility)** (should-incorporate). Add §2.7 — naming the NFRs makes the existing enforcement mechanisms testable. **~1 hour.**
7. **G26 — Memory hygiene rules** (should-incorporate). Brief already references memory; hygiene is the mandatory pairing. Add §6 subsection. **~1 hour.**
8. **Standards-citation bundle — G17 + G18 + G20** (should-incorporate, bundled). ISO 10007 + EIA-649 citations + NIST baseline cross-reference. **~1 hour as a bundle.**
9. **G27 — Manifest schema versioning** (should-incorporate). One paragraph in §4. **~15 minutes.**
10. **G25 — Multi-skill write-ownership convention** (should-incorporate). One paragraph in §6. **~15 minutes.**

Total estimated work for the full must-fix + should-incorporate set: **~2 days of focused writing + ~half-day of CI wiring** before the `document-cm` skill build starts. Everything below — G1, G3, G4, G5, G6, G8, G9, G19, G21, G22, G23, G28, G29 — is nice-to-have or decline and can defer to a v1.1 revision of the brief.

### Rationale for the cut-line

Anything graded `must-fix` goes in because the brief either commits to a principle without implementing it (G24), has a real operational failure mode (G7), or carries asymmetric risk (G11). Anything graded `should-incorporate` goes in because the cost is ≤1 hour and the value shows up at skill build time. Everything else either doesn't apply at solo+AI scale or is cheap to add later.

---

## 6. Access Limitations

### Paywalled primary sources (used reputable third-party summaries as fallback)

- **ISO 10007:2017** — iso.org abstract reachable; full standard paywalled. Used BSI and NQA summaries (cited in G17).
- **SAE EIA-649C** — sae.org abstract reachable; full standard paywalled. Used NASA CM Handbook and DAU Guidebook references (cited in G18).
- **ISO/IEC/IEEE 12207:2017** — iso.org abstract reachable; full standard paywalled. Brief already cites the abstract; no action needed.
- **MIL-HDBK-61B** — DLA QuickSearch link requires login for full PDF; unclassified but gated. NASA CM Handbook §4.2 used as the substitute (both reference the same functional/allocated/product taxonomy).

### JS-rendered or SPA sources (fetch may return empty HTML)

- **framework.scaledagile.com** — SAFe 6.0 pages are React SPAs; some scraping methods return empty shells. Sources validated via multiple independent pages and consistent terminology confirms content. No gap forced to LOW confidence from this.
- **platform.openai.com/docs/guides/agents** — Docusaurus-style SPA; primary text generally extractable.

### Vendor-docs churn risk

- **docs.claude.com** pages (Agent Skills, Memory, Security, Best Practices) were reachable at validation time (April 2026) but Anthropic's doc URLs have moved before (claude.com/engineering vs anthropic.com/engineering). Links may rot; archive copies recommended if the brief will be cited externally.

### Not validated against primary source (brief retains as-is)

- **The Agentic AI Bible (2025 book family)** — cited in brief §10 sources but not on disk. No independent validation; left as brief's existing reference.

### No sources unreachable beyond these categories

Every gap landed at least one primary source and sufficient third-party corroboration for HIGH or MEDIUM confidence.

---

© 2026 Eric Riutort. All rights reserved.
