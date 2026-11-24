# Rule schema (draft)

Each reviewed rule requires:
- `id` — stable identifier
- `authority` and `sourceUri` — primary authority and retrievable citation
- `sourceLocation` — article, clause, figure or page
- `verifiedOn` and `reviewStatus` — reviewer and version lifecycle
- `appliesTo` — vehicle classes, direction, time windows and supplementary plates
- `conditions` / `exceptions` — machine-readable structured predicates
- `effect` — prohibit, require, allow, warn
- `scenarioTests` — positive, negative and exception cases

Never mark an unreviewed imported quiz record as verified. The pure TypeScript engine treats draft scenarios as `unverified`, not `valid`. A route verdict does not establish full driving legality: control state, collision avoidance, signals and context must be modelled separately.
