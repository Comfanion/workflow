---
name: service-deployment
description: Write or review one service's deployment document — its position in the platform infrastructure: where it deploys (cluster / namespace / environment), its build artifact and image, its CI/CD pipeline, its infra dependencies (which database instance, which broker cluster and topics, which secret paths), its networking (ingress/egress), its scaling unit, its rollback, and any platform rule it overrides. Use whenever the user wants to document how or where a service deploys, its pipeline, its infra dependencies, scaling, or rollback, or mentions "service deployment", "infrastructure.md", "where does it run", "its pipeline", "scaling", or "rollback for this service". This is the SERVICE-level infra (standing reference) — for the shared platform infra use `platform-infrastructure`; for the act of shipping a specific version use `release-engineering`.
---

# Service Deployment

Document one service's place in the platform infrastructure — its standing deployment reference. The shared substrate (clusters, environments, CI/CD conventions, common rules) is defined once in `platform-infrastructure`; **reference it** and document only what is specific to this service.

This is **operations at the service altitude**, the physical counterpart to `service-architecture`: that skill designs the service's internals; this one records where and how it runs. It is not the language/framework stack (that's the README), and it is not the per-version shipping runbook (that's `release-engineering`) — this is the static deployment shape a release acts on.

`{DOCS_ROOT}` defaults to `docs/`. Write a single service's doc to `{DOCS_ROOT}/ops/infrastructure.md`; in a multi-service system, write one per service at `{DOCS_ROOT}/ops/<service-name>-infrastructure.md`. Load `references/template.md` when you start.

## What's service-specific

- **Position in the infra** — where it deploys (cluster / namespace / environment), its build artifact (image + registry path), its scaling unit and what triggers scale.
- **Infra dependencies** — the concrete instances: which database (`db-<service>`), which broker cluster + topics, which cache, which secret paths.
- **Networking** — its ingress route (who can reach it), its egress (what it calls).
- **CI/CD** — anything in its pipeline beyond the platform convention.
- **Deploy & rollback** — the exact steps for THIS service, and its DB migration handling.
- **Rule deltas** — only the platform common-rules it overrides, and why (or "none").

## Document discipline

- **Never invent.** Deploy/rollback commands, secret paths, cluster/namespace names, and scaling triggers go in only if verified against the config or owner-confirmed; otherwise mark `⚠️ TBD`.
- **Mark current vs planned** per item.
- **Reference, don't restate.** The shared baseline is `platform-infrastructure`'s; the design is `service-architecture`'s; the per-release process is `release-engineering`'s. List only this service's deltas and specifics.
- **A deploy doc without a rollback path is incomplete** — the rollback steps and migration handling are the part that matters most under load.

## Process

1. **Read the source first** — the repo's CI config, build files (Dockerfile / Makefile), deploy manifests, and the `platform-infrastructure` doc for the shared baseline.
2. **Load `references/template.md`** and fill it.
3. Document the position, infra dependencies, networking, and scaling.
4. State the deploy and **rollback** steps and migration handling.
5. List only the **rule deltas** vs the platform; reference the common rules, don't restate them.

## Related

- `platform-infrastructure` — the shared infra and common rules this references.
- `service-architecture` — the service design this deploys (its physical counterpart).
- `release-engineering` — the per-release shipping runbook and deploy gate that act on this deployment shape.
- `adr-writing` — a service-specific deploy decision that overrides a platform rule is recorded as an ADR this doc links.
