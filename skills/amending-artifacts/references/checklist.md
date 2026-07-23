# Amending Artifacts — checklist

Run for every edit to an existing `{DOCS_ROOT}` artifact.

- [ ] **Located, not created:** owning doc found via frontmatter `type` + `domain` grep; no sibling doc created.
- [ ] **Minimal diff:** only the invalidated section touched; spillover into 3+ sections → stopped and routed to the authoring skill.
- [ ] **Recorded:** frontmatter `timestamp` bumped; changelog row appended where the artifact keeps a changelog table.
- [ ] **ADR check:** amendment contradicts no accepted ADR — or the ADR was superseded first (`adr-writing`) and the new record is linked.
- [ ] **Links intact:** inbound references to moved/renamed sections fixed (grepped, not assumed).
- [ ] **Status/provenance:** transitions deliberate — `draft→approved` by the owner only; `inferred→inferred-reviewed` only as the record of an actual human review.
- [ ] **Standards artifact?** `authoring-standards` review gate applied on top.
