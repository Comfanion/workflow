---
name: translation
description: Use when translating docs to user language or exporting to Confluence format
license: MIT
compatibility: opencode
metadata:
  domain: documentation
  agents: [pm, all]
---

# Translation & Export Skill

> **Purpose**: Translate technical docs to user language, export to Confluence format
> **Used by**: Any agent on request

---

## Principle

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCUMENTATION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   docs/ (English)              docs/confluence/ (User Language)  │
│   ────────────────             ────────────────────────────────  │
│   • prd.md                  →  • prd-uk.md (Ukrainian)           │
│   • architecture.md         →  • architecture-uk.confluence      │
│   • epic-01.md              →  • epic-01-uk.md (Ukrainian)       │
│                                                                  │
│   ALWAYS English               Translated + Reformatted          │
│   (agents work here)           (stakeholders read here)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Rule:** Technical docs in `docs/` are ALWAYS in English. Translations go to `docs/confluence/`.

---

## Configuration

```yaml
# config.yaml
documentation:
  technical:
    language: "English"
    enforced: true
    
  user_facing:
    enabled: true
    output_folder: "docs/confluence/"
    default_language: "Ukrainian"
    formats: [confluence, markdown, html]
```

---

## Output Formats

### 1. Confluence Wiki Format

```
docs/confluence/
├── prd-uk.confluence           # Confluence markup
├── architecture-uk.confluence
└── assets/
    └── diagrams/
```

**Confluence Markup:**
```
h1. Назва продукту - PRD

h2. Огляд

Цей документ описує вимоги до системи...

h3. Функціональні вимоги

|| ID || Вимога || Пріоритет ||
| FR-001 | Реєстрація користувача | P0 |
| FR-002 | Авторизація | P0 |

{info}
Важлива примітка для команди
{info}

{code}
// Code example
{code}
```

### 2. Translated Markdown

```
docs/confluence/
├── prd-uk.md                   # Ukrainian markdown
├── architecture-uk.md
└── epic-01-uk.md
```

### 3. Standalone HTML

```
docs/confluence/
├── html/
│   ├── prd-uk.html
│   └── style.css
```
confluence/
├── html/
│   ├── prd-uk.html
│   ├── style.css
│   └── assets/
```

---

## Translation Rules

### What to Translate

| Content | Translate? | Notes |
|---------|------------|-------|
| Headers | ✅ Yes | |
| Descriptions | ✅ Yes | |
| User stories | ✅ Yes | "As a... I want... So that..." |
| Acceptance criteria | ✅ Yes | Given/When/Then |
| Technical terms | ⚠️ Keep English | API, endpoint, cache, etc. |
| Code blocks | ❌ No | Keep original |
| File paths | ❌ No | Keep original |
| Variable names | ❌ No | Keep original |
| Jira IDs | ❌ No | PROJ-123 stays PROJ-123 |

### Technical Terms (Keep in English)

```
API, REST, GraphQL, endpoint, request, response,
cache, database, schema, migration, query,
repository, service, handler, middleware,
authentication, authorization, token, JWT,
deploy, CI/CD, pipeline, container, Docker,
Kafka, Redis, PostgreSQL, MongoDB
```

### Translation Examples

**English (source):**
```markdown
## FR-001: User Registration

**As a** new user,
**I want** to register with email and password,
**So that** I can access the platform.

### Acceptance Criteria

**Given** a valid email and password
**When** user submits registration form
**Then** account is created and confirmation email sent
```

**Ukrainian (translated):**
```markdown
## FR-001: Реєстрація користувача

**Як** новий користувач,
**Я хочу** зареєструватися за допомогою email та пароля,
**Щоб** отримати доступ до платформи.

### Критерії приймання

**Дано** валідний email та пароль
**Коли** користувач відправляє форму реєстрації
**Тоді** створюється обліковий запис і надсилається лист підтвердження
```

---

## Workflow

### Command: `/translate [doc] [language]`

```xml
<workflow name="translate-document">
  <step n="1" goal="Identify source document">
    <check if="doc path provided">
      <action>Use provided path</action>
    </check>
    <check else>
      <output>
        Available documents for translation:
        1. docs/prd.md
        2. docs/architecture.md
        3. docs/sprint-artifacts/sprint-1/epic-01.md
      </output>
      <ask>Which document to translate?</ask>
    </check>
  </step>

  <step n="2" goal="Select target language">
    <check if="language provided">
      <action>Use provided language</action>
    </check>
    <check else>
      <action>Use default from config: {{default_language}}</action>
      <ask>Translate to {{default_language}}? (y/n or specify language)</ask>
    </check>
  </step>

  <step n="3" goal="Select output format">
    <output>
      Output formats:
      1. Confluence wiki markup (.confluence)
      2. Markdown (.md)
      3. HTML (.html)
      4. All formats
    </output>
    <ask>Select format:</ask>
  </step>

  <step n="4" goal="Translate">
    <action>Read source document</action>
    <action>Translate content (preserve technical terms)</action>
    <action>Convert to target format</action>
    <action>Save to docs/confluence/ folder</action>
    
    <output>
      ✅ Translation complete:
      
      Source: docs/prd.md (English)
      Output: docs/confluence/prd-uk.confluence (Ukrainian)
      
      Sections translated: 15
      Technical terms preserved: 23
    </output>
  </step>
</workflow>
```

### Batch Export

Batch export all configured documents:

```xml
<workflow name="export-confluence">
  <step n="1" goal="Read config">
    <action>Get documents marked for translation</action>
    <action>Get target language</action>
  </step>

  <step n="2" goal="Translate all">
    <for-each doc in="translate_list">
      <action>Translate to target language</action>
      <action>Generate Confluence format</action>
      <action>Save to docs/confluence/</action>
    </for-each>
  </step>

  <step n="3" goal="Generate index">
    <action>Create docs/confluence/README.md with links to all translated docs</action>
  </step>

  <output>
    ✅ Export complete:
    
    Documents translated: 5
    Target language: Ukrainian
    Output folder: docs/confluence/
    
    Files created:
    - docs/confluence/prd-uk.confluence
    - docs/confluence/architecture-uk.confluence
    - docs/confluence/epic-01-uk.confluence
    - docs/confluence/epic-02-uk.confluence
    - docs/confluence/README.md
  </output>
</workflow>
```

---

## Confluence Format Reference

### Headers

```
h1. Header 1
h2. Header 2
h3. Header 3
```

### Tables

```
|| Header 1 || Header 2 || Header 3 ||
| Cell 1 | Cell 2 | Cell 3 |
| Cell 4 | Cell 5 | Cell 6 |
```

### Lists

```
* Bullet item
** Nested bullet

# Numbered item
## Nested numbered
```

### Code Blocks

```
{code:language=go|title=Example}
func main() {
    fmt.Println("Hello")
}
{code}
```

### Panels

```
{info}
Information panel
{info}

{warning}
Warning panel
{warning}

{note}
Note panel
{note}
```

### Links

```
[Link text|https://example.com]
[Link to page|PAGE:Page Title]
```

### Status Macros

```
{status:colour=Green|title=Done}
{status:colour=Yellow|title=In Progress}
{status:colour=Red|title=Blocked}
```

---

## File Naming Convention

```
docs/confluence/
├── {doc-name}-{lang}.{format}
│
├── prd-uk.confluence          # Ukrainian Confluence
├── prd-uk.md                  # Ukrainian Markdown
├── architecture-uk.confluence
├── epic-01-uk.confluence
│
├── html/                      # HTML exports
│   ├── prd-uk.html
│   └── style.css
│
└── README.md                  # Index of all translations
```

**Language codes:**
- `uk` - Ukrainian
- `en` - English
- `pl` - Polish

---

## Confluence Index Template

```markdown
# Документація проекту / Project Documentation

**Мова / Language:** Українська
**Оновлено / Updated:** {{date}}
**Джерело / Source:** docs/ (English)

## Документи / Documents

| Документ | Confluence | Markdown | Оригінал |
|----------|------------|----------|----------|
| PRD | [prd-uk.confluence](./prd-uk.confluence) | [prd-uk.md](./prd-uk.md) | [docs/prd.md](../docs/prd.md) |
| Архітектура | [architecture-uk.confluence](./architecture-uk.confluence) | [architecture-uk.md](./architecture-uk.md) | [docs/architecture.md](../docs/architecture.md) |

## Примітки / Notes

- Технічні терміни залишені англійською (API, endpoint, cache, etc.)
- Блоки коду не перекладаються
- Оригінальна документація завжди актуальніша

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | {{date}} | Initial translation |
```

---

## Validation

- [ ] Source document exists in docs/
- [ ] Target language supported
- [ ] Output folder writable
- [ ] Technical terms preserved
- [ ] Code blocks unchanged
- [ ] Links updated for new paths
- [ ] Index updated
