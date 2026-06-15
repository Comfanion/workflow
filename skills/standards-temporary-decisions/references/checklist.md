# Temporary Decisions — Entry Checklist

A valid entry has every field; missing one is the bug.

- [ ] **Decision** is concrete: names the file/path or the system, not just the topic.
- [ ] **Why shortcut** names the actual constraint (date / missing dependency / unclear spec), not "it was faster".
- [ ] **Cost if kept** is observable: what breaks, who is hurt, when.
- [ ] **Trigger to revisit** is a concrete event or condition: not "someday", not "when we have time".
- [ ] **Deadline** is a date or a sprint reference.
- [ ] **Owner** is a person or named role.
- [ ] **Status** is one of `open`, `in-progress`, `resolved`, `accepted-as-permanent`.
- [ ] If `resolved`: PR / commit reference + resolution date present.
- [ ] If `accepted-as-permanent`: ADR slug present.
- [ ] If the entry references code: `path/file:line` cited.

A stale ledger is worse than no ledger. At every sprint planning, every `open` entry past its deadline must either be re-dated with a reason or be promoted into the sprint.
