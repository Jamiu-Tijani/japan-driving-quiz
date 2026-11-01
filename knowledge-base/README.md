# Driving Knowledge Base

Source-controlled **learning references**, not runtime/browser storage. Each statement should be traceable to an authoritative legal or driving-school reference before it is used for automated scoring.

## Folders
- `sources/` — source register: publisher, edition, publication URL, verification date.
- `signs/` — sign catalogue, IDs, applicability, translations, supplementary plates and artwork provenance.
- `rules/` — rules grouped by topic: priority, intersections, road markings, vehicle restrictions.
- `scenarios/` — scenarios, expected decisions and traceable rule IDs.
- `review/` — verification checklist and open questions.

## Accuracy policy
Do not call Wikimedia artwork *official government-issued graphics*. Prefer faithful verified sign illustrations with license and attribution information. All questions and scenario judgements must reference a reviewed rule and relevant conditions. Koyama textbook mappings remain unverified until edition and pages can be checked. Keep copyrighted textbook excerpts out of the repository without permission.

## Session data
Learner history belongs in browser-local storage and is **not** committed in this folder. The current implementation stores schema-versioned quiz attempts and sessions under `jrdl.progress.v1`. Storage is device/browser-specific and can be cleared by browser settings.
