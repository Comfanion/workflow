---
name: research-methodology
description: Conduct structured technical, market, domain, or competitive research and turn it into a cited, actionable report. Use whenever the user wants to investigate a technology choice, size a market, understand a business domain, map competitors, or asks to "research", "do a deep dive", "compare options", "evaluate", or "gather background" before requirements or design work begins. Produces a research report, not a decision — it feeds the people who decide.
---

# Research Methodology

Research exists to replace guesses with evidence before a team commits to a direction. A good research report does not just collect facts; it answers a specific set of questions, shows how the answers were found, and ends with recommendations someone can act on. Run this before requirements gathering or any non-trivial technology choice — it is cheaper to be wrong on paper than in code.

The failure mode to avoid is the link dump: pages of findings with no question driving them and no recommendation at the end. Start from the questions, and let them decide what is worth researching.

## Pick the research type

The four types share a shape but differ in what they look for. Identify which one (or which mix) the task needs, because it sets the sections you produce.

### Market research

Understand the landscape, the trends, and where the opportunity is.

1. Define the scope and the questions.
2. Identify the target market segments.
3. Size the market and its growth.
4. Analyze the key trends moving it.
5. Name the opportunities and gaps.

Report sections: Market Overview · Target Segments · Market Size & Growth · Key Trends · Opportunities.

### Technical research

Evaluate technologies, patterns, and approaches against a real need.

1. Define the technical questions to answer.
2. Survey the available technologies.
3. Weigh the pros and cons of each.
4. Review case studies and real implementations — not just vendor claims.
5. Recommend, with the reasoning.

Report sections: Technology Options · Comparison Matrix · Case Studies · Recommendations · Risks & Considerations.

### Domain research

Build deep understanding of the business domain so requirements use the right concepts.

1. Identify the domain concepts and terminology.
2. Research the industry standards.
3. Understand the regulatory requirements.
4. Study the recurring domain patterns.
5. Document the domain model.

Report sections: Domain Glossary · Industry Standards · Regulatory Requirements · Domain Patterns · Domain Model.

### Competitive research

Map the competitive landscape and find where to differentiate.

1. Identify competitors, direct and indirect.
2. Analyze their products and features.
3. Evaluate strengths and weaknesses.
4. Identify where you can differentiate.
5. Benchmark the best practices worth adopting.

Report sections: Competitor Overview · Feature Comparison · SWOT Analysis · Differentiation Opportunities · Best Practices.

## How to run it well

- **Questions first.** Write 3–5 specific, answerable questions before searching. They are the spine of the report and the test for whether a finding is relevant.
- **Use the tools you have.** Search the web and fetch sources for external facts; use any codebase- or document-search capability for internal context. Prefer current documentation over memory for anything that changes — versions, pricing, API contracts.
- **Verify non-trivial claims across at least two independent sources.** One source is a lead, not a fact.
- **Filter by recency.** For technical and market topics, weight the last 12 months; an outdated finding is worse than a missing one.
- **Cite as you go.** Every finding carries its source. A report you cannot trace back is one nobody can trust.
- **Acknowledge limits.** Say what you could not find or could not verify. A named gap is a finding; a hidden one is a trap.

## Report structure

Open the report with this frontmatter (so agents filter research by domain/type and avoid re-running existing reports):

```yaml
---
type: research                                # controlled vocab — primary filter for agents
title: {{topic}} — Research
description: {{one line — the question this report answers}}
domain: {{domain/module}}                      # dedup axis: find existing research in this area
status: draft                                 # draft | approved | deprecated | superseded
tags: [{{tag}}, {{tag}}]                       # research type + subject labels
updated: {{YYYY-MM-DDThh:mmZ}}                 # OKF timestamp — last meaningful change
related: []                                    # cross-links; e.g. the PRD/ADR it feeds
---
```

Then produce the report with these sections:

- **Executive Summary** — 2–3 paragraphs of the key findings, readable on its own.
- **Research Questions** — the specific questions this report answers.
- **Methodology** — how the research was conducted and which sources were used.
- **Findings** — one subsection per finding, with detail and citations.
- **Recommendations** — concrete, actionable, tied back to the questions.
- **References** — every source cited.
- **Appendix** — supporting data, tables, charts.

## Quality bar

Before calling the report done, confirm:

- Clear research questions are defined and each is answered.
- The methodology is documented.
- Every non-trivial claim is sourced, with at least two independent sources where it matters.
- Findings are actionable, not just informational.
- Recommendations are present and traceable to findings.
- Limitations and unverified gaps are stated explicitly.

## Output location

Save the report to `{DOCS_ROOT}/research/<type>/<topic>-research.md` (`{DOCS_ROOT}` defaults to `docs/` at the project root; honor the project's configured docs location if one is set).

## Roles

This skill is written for whoever holds the research role (on a team, the analyst or researcher; solo, you). The report feeds the product and architecture roles, who turn its findings into requirements and design decisions — the researcher informs the choice, they do not make it.
