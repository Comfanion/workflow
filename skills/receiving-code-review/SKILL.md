---
name: receiving-code-review
description: Respond to code-review feedback with technical rigor instead of reflexive agreement — understand each comment, verify whether it is actually correct against the code, then implement the ones that hold, push back with evidence on the ones that don't, and ask when a comment is unclear. Use this whenever you receive review feedback, PR comments, or change requests, especially when a comment seems wrong, unclear, or technically questionable. This decides how to act on review input — it does not perform the review or write the original code.
---

# Receiving Code Review

The failure this skill prevents is **performative agreement**: treating every review comment as an order, implementing it without understanding, and saying "good catch, fixed" to a suggestion that was wrong. That is not respect for the reviewer — it ships their mistakes, hides the ones you spotted, and teaches everyone that review is theater. The opposite failure, defending every line out of ego, is just as bad. The discipline in between is the point: each comment gets understood and verified before it gets implemented or rejected.

A reviewer is a second mind, not an authority whose every word is correct. Comfanion's review is deliberately split into evidence-backed dimensions (`code-review` and the `review-*` skills) precisely so findings are concrete and checkable — which means you can, and must, check them.

## The Iron Law

```
UNDERSTAND AND VERIFY EACH COMMENT BEFORE ACTING ON IT
```

You do not implement a comment you do not understand, and you do not implement a comment you have not confirmed is correct. "The reviewer said so" is not a reason to change working code, and it is not a reason to break it.

## The loop, per comment

For each piece of feedback, in order:

1. **Understand it.** What is the reviewer actually claiming — a bug, a risk, a style preference, a misread? If you cannot state their point back clearly, you do not understand it yet (go to step 4).
2. **Verify it against the code.** Is the claim true? Read the code, run the case, check the reference. A comment is a hypothesis about your code, not a verified fact — treat it the way `systematic-debugging` treats any hypothesis. Especially verify comments that *sound* authoritative.
3. **Decide and act on evidence:**
   - **Correct →** implement the fix properly (not a patch that silences the comment), then prove it through `verification-before-completion`.
   - **Wrong →** push back with evidence: the `path:line`, the test, or the doc that shows why. Politely and specifically — "this is already handled at `x.go:40`, here's the test" — not "no."
   - **Partly right →** take the valid part, name the part you're not taking and why.
4. **Unclear →** ask before acting. Guessing at what a reviewer meant and implementing the guess wastes a full round-trip. One clarifying question is cheaper.

## Severity is not agreement

Sort feedback by whether it is *correct and matters*, not by how confidently it was phrased or how senior the reviewer is. A blocking security finding and a naming nit are not the same weight even if stated with equal certainty — and a wrong comment stated with great confidence is still wrong. Verify, then weight.

## Red flags — stop, you're rubber-stamping

- "Good catch, fixed!" written before you verified the catch was real
- Implementing a comment you could not explain in your own words
- Changing working, tested code solely because a comment suggested it, with no verification
- Silencing a comment (suppressing the warning, deleting the test) instead of addressing what it pointed at
- Agreeing to avoid friction with a senior reviewer
- Rejecting a comment because of ego rather than evidence — the mirror-image failure

## Common rationalizations

| Excuse | Reality |
|--------|---------|
| "The reviewer is senior, they're right" | Seniority is not proof. Verify the claim; push back with evidence if it's wrong. |
| "Just implement it, faster than arguing" | Implementing a wrong comment ships a bug and costs more than one verification. |
| "I'll silence the warning to clear the comment" | That addresses the comment, not the thing it pointed at. Fix the cause. |
| "Pushing back looks defensive" | Pushing back *with evidence* is the job. Blind agreement is the failure. |
| "I don't get it but I'll guess what they meant" | A wrong guess burns a full review round. Ask. |
| "It's just a nit, I'll do it to be safe" | Fine to take nits — but consciously, not reflexively. Know which bucket each comment is in. |

## After the round

When you have worked every comment, report back concretely: what you changed (and the verification output), what you did not change and why (with the evidence), and any clarifying questions still open. A reviewer can re-review that in one pass. "Addressed all comments" with no detail forces them to re-derive everything.

## Roles

Cross-cutting on the receiving end of the review gate — primarily the developer acting on the reviewer's verdict, but any role whose output was reviewed. It is the counterpart to `code-review`: that skill produces the evidence-backed findings; this one governs how the author responds to them without either capitulating or stonewalling. In the `dev` loop, this is what "turn the returned action items into fix tasks" actually requires — verify each item first.

## Related

- `code-review` — produces the findings this skill responds to; together they close the review loop.
- `verification-before-completion` — proves each accepted fix actually landed before reporting back.
- `systematic-debugging` — treat a review comment as a hypothesis and verify it the same way.
- `review-correctness` / `review-security` — the dimensions whose findings most often warrant a real fix versus a reasoned push-back.
