---
description: Use when searching codebase semantically - find code by meaning, not just text matching
agent: crawler
---

# Search Command

Semantic search across the codebase using vectorizer.

## Arguments
$ARGUMENTS

## Examples

```
/search authentication middleware
/search how users are stored
/search error handling patterns
```

## Your Task

Perform **multiple semantic searches** to find the best results for user's query.

### Step 1: Generate Search Variations

From user query "$ARGUMENTS", create 2-3 search variations:

1. **Original query** - as provided
2. **Technical variation** - rephrase with technical terms
3. **Conceptual variation** - broader concept search

Example for "how users are stored":
- "how users are stored" (original)
- "user repository database entity" (technical)
- "user persistence storage" (conceptual)

### Step 2: Execute Multiple Searches

Run searches in parallel across relevant indexes:

```typescript
// Search code with variations
search({ query: "original query", index: "code", limit: 3 })
search({ query: "technical variation", index: "code", limit: 3 })

// Also check docs if relevant
search({ query: "original query", index: "docs", limit: 2 })
```

### Step 3: Deduplicate & Rank Results

1. Merge all results
2. Remove duplicates (same file + chunk)
3. Sort by relevance score
4. Take top 5-7 unique results

### Step 4: Present Results

```markdown
## 🔍 Search: "{user query}"

Found {N} relevant results:

### 1. `path/to/file.ts` ⭐ (best match)
```typescript
// most relevant code snippet
```

### 2. `path/to/another.ts`
```typescript
// another snippet  
```

---

**Search variations used:**
- "{variation 1}" → {N} results
- "{variation 2}" → {N} results
```

### If No Results

```markdown
## 🔍 No results for "{query}"

**Tried:**
- "{variation 1}" - no matches
- "{variation 2}" - no matches

**Suggestions:**
- Check indexes: `codeindex({ action: "list" })`
- Reindex: `npx @comfanion/workflow index`
```

## Notes

- Always run at least 2 different search queries
- Prefer code index, add docs if query seems documentation-related
- Show the search variations used so user understands coverage
