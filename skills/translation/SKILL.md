---
name: translation
description: Translate project documentation and communication from English into a stakeholder's language, optionally reformatting into Confluence wiki markup, while preserving technical terms, code, paths, and IDs. Use whenever the user wants to translate a doc (PRD, architecture, epic, story), export documentation for non-English stakeholders, produce a Confluence version, or mentions "translate", "перекладі", "export to Confluence", or a target language. Source docs stay English; translations are a separate, derived output.
---

# Translation & Export

Technical documents are written and maintained in English — that is where the work happens and where the source of truth lives. Translation produces a *derived* copy in a stakeholder's language so non-English readers can follow along, without ever becoming the version engineers edit. Keeping that direction one-way is the core rule: the English doc is canonical, the translation is downstream.

The failure to avoid is treating a translation as authoritative. The moment someone edits the translated copy and expects it to flow back, the two versions drift and the source of truth is lost. State plainly in every translated index that the original is always the more current document.

## The flow

```
{DOCS_ROOT}/ (English, canonical)        {DOCS_ROOT}/confluence/ (translated, derived)
  PRD.md                          →        prd-uk.md / prd-uk.confluence
  architecture.md                 →        architecture-uk.md
  epic-01.md                      →        epic-01-uk.md
```

`{DOCS_ROOT}` defaults to `docs/` at the project root (so translations land in `docs/confluence/`); honor the project's configured docs location if one is set. Technical docs always stay in English under `{DOCS_ROOT}`; translations always go to the `confluence/` subfolder.

## What to translate — and what to leave alone

Translate prose; preserve anything that is an identifier or executable. Translating a technical term or a path silently breaks cross-references and code.

| Content | Translate? | Notes |
|---------|------------|-------|
| Headers, descriptions | Yes | |
| User stories | Yes | "As a… I want… So that…" |
| Acceptance criteria | Yes | Given/When/Then keywords too |
| Technical terms | Keep English | API, endpoint, cache, JWT, etc. |
| Code blocks | No | leave byte-for-byte |
| File paths | No | |
| Variable / identifier names | No | |
| Issue IDs | No | `PROJ-123` stays `PROJ-123` |

Keep these terms in English regardless of context, because they are the shared vocabulary teams search and grep for: API, REST, GraphQL, endpoint, request, response, cache, database, schema, migration, query, repository, service, handler, middleware, authentication, authorization, token, JWT, deploy, CI/CD, pipeline, container, Docker, Kafka, Redis, PostgreSQL, MongoDB.

### Example

English source:

```markdown
## FR-001: User Registration
**As a** new user, **I want** to register with email and password, **So that** I can access the platform.

### Acceptance Criteria
**Given** a valid email and password
**When** the user submits the registration form
**Then** an account is created and a confirmation email is sent
```

Ukrainian translation — prose translated, the Given/When/Then keywords localized, the structure and any identifiers intact:

```markdown
## FR-001: Реєстрація користувача
**Як** новий користувач, **Я хочу** зареєструватися за допомогою email та пароля, **Щоб** отримати доступ до платформи.

### Критерії приймання
**Дано** валідний email та пароль
**Коли** користувач відправляє форму реєстрації
**Тоді** створюється обліковий запис і надсилається лист підтвердження
```

## How to translate a document

1. **Identify the source.** If a path was given, use it; otherwise list the available documents under `{DOCS_ROOT}/` and ask which to translate.
2. **Pick the target language.** Use the one given; otherwise use the project's configured default and confirm it.
3. **Pick the output format** — Confluence wiki markup, Markdown, HTML, or all of them.
4. **Translate and convert.** Read the source, translate the prose while preserving everything in the "leave alone" list, convert to the chosen format, and save under `{DOCS_ROOT}/confluence/`.
5. **Report** what was produced: source path and language, output path and language, sections translated, and how many technical terms were preserved.

For a batch export, repeat steps 4–5 for every document marked for translation, then generate a `{DOCS_ROOT}/confluence/README.md` index linking each translation back to its English original.

## File naming

```
{DOCS_ROOT}/confluence/
  {doc-name}-{lang}.{format}     e.g. prd-uk.confluence, prd-uk.md, architecture-uk.md
  html/                          HTML exports + style.css
  README.md                      index of all translations
```

Language codes: `uk` Ukrainian, `en` English, `pl` Polish.

## Confluence markup reference

When the target format is Confluence, convert Markdown to wiki markup:

- **Headers** — `h1.`, `h2.`, `h3.` prefixes.
- **Tables** — `|| Header || Header ||` for the header row, `| cell | cell |` for data rows.
- **Lists** — `*` / `**` for nested bullets; `#` / `##` for nested numbered.
- **Code** — `{code:language=go|title=Example} … {code}`.
- **Panels** — `{info} … {info}`, `{warning} … {warning}`, `{note} … {note}`.
- **Links** — `[text|https://example.com]`, or `[text|PAGE:Page Title]` for an internal page.
- **Status** — `{status:colour=Green|title=Done}`, `Yellow|In Progress`, `Red|Blocked`.

The translated index should carry the language, the update date, the source folder, a table linking each translated doc to its original, and a note that technical terms and code are left in English and the original is always more current.

## Validation

Before considering an export done, confirm:

- The source document exists under `{DOCS_ROOT}/`.
- The target language is supported.
- The output folder is writable.
- Technical terms are preserved and code blocks are unchanged.
- Links are updated for the new paths.
- The index is updated.

## Roles

This skill runs on request for whoever needs a stakeholder-facing copy. The document role owns the English source; translation produces a derived artifact for readers who do not work in the source doc.
