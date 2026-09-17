# Release readiness review

This document is intentionally long. It exists to test sustained reading comfort,
not isolated syntax tokens. A useful editor theme must remain calm when prose fills
most of the viewport and only a few fragments carry semantic emphasis.

## Context

The release candidate has three dark identities and one light identity. Each dark
theme shares the same interaction model, but the backgrounds and accent families
change the atmosphere. The question for this review is narrower: **what colour
should ordinary reading text use?**

The previous implementation allowed a pale green or warm yellow to occupy large
areas. Those colours were attractive in a palette card, yet tiring across a long
terminal transcript, a Markdown specification, or a configuration file containing
many strings. Accent colours stopped feeling like accents because almost everything
was accented.

### Evaluation criteria

- [ ] Body text remains readable for at least twenty minutes.
- [ ] Headings are visible without becoming fluorescent.
- [ ] Inline code such as `resolveChartFilters()` is distinct from prose.
- [ ] Links and emphasis retain a clear hierarchy.
- [ ] Dense lists do not turn into a single bright rectangle.
- [ ] The active line is visible without changing the perceived text colour.
- [ ] Gray text still feels related to the Wada source material.

## Scenario one: architecture notes

The application receives a saved dashboard definition, resolves its data sources,
and creates one query plan per visible component. A component may inherit global
filters, define local filters, or opt out of selected filter dimensions. The final
query is produced only after permissions and feature flags have been evaluated.

There are two plausible implementation paths. **Option A** keeps the transformation
inside the frontend and adds no backend contract. It is smaller and safer, but it
cannot represent every interaction shown in the product mock. **Option B** extends
the query model with an explicit grouping override. It matches the intended user
experience, though it requires validation at the API boundary.

The important detail is that neither option changes the storage format immediately.
Existing documents continue to load, and new fields are omitted when the user has
not selected the corresponding feature. This gives the team a reversible rollout
path and keeps old clients compatible during the migration window.

> A good migration is boring: readers should understand what changes, what remains
> stable, and how to reverse the decision without deciphering decorative colour.

## Scenario two: operational checklist

1. Deploy the schema reader before any writer begins emitting the new field.
2. Confirm that mixed-version clients ignore unknown keys without data loss.
3. Enable the writer for internal workspaces only.
4. Compare query latency and error rate against the previous release.
5. Expand gradually while keeping the rollback flag available.
6. Remove compatibility code only after the final supported client has upgraded.

During the rollout, operators will spend more time reading ordinary sentences than
looking at keywords. Warnings such as **schema mismatch** and **permission denied**
need colour, but successful routine output should settle into the background.

## Scenario three: investigation log

The first report arrived at 09:14 UTC. Users could save a dashboard, but reopening
it silently removed a filter that referenced a renamed field. Logs showed a valid
request and a successful response, which initially suggested a rendering problem.

At 09:27 UTC the team reproduced the issue with an older document. The normalizer
accepted the legacy key, converted it to the new shape, and then discarded it during
serialization because the compatibility flag was evaluated too early.

At 09:42 UTC a patch moved the flag check to the writer boundary. Existing tests
covered new documents but not documents that had already passed through one upgrade.
The regression fixture now includes both states and confirms stable round-tripping.

```ts
const normalized = normalizeDashboard(source);
const persisted = serializeDashboard(normalized, {
  preserveLegacyFilters: workspace.flags.compatibilityMode,
  omitEmptyCollections: true,
});
```

## Decision record

We will use a neutral reading colour for long-form content and reserve brighter
colours for identifiers, headings, state changes, and small semantic landmarks.
The exact value remains under comparison. Gray should feel quiet and durable;
soft white should feel crisp without becoming a glowing sheet over the editor.

The chosen value must work across all three dark canvases. If one background needs
a different luminance, adjust that theme deliberately rather than hiding the problem
behind unrelated syntax colours. Consistency is useful, but perceptual balance is
the actual goal.

## Final review questions

- Does the paragraph texture look even when you defocus your eyes?
- Can you find headings and inline code without scanning line by line?
- Do accent colours still communicate meaning after several screens of prose?
- Is the text comfortable beside a terminal and a source-code pane?
- Would you choose this theme for an all-day documentation task?

If the answer changes between Gray and White, record which background was active
and whether the surrounding pane contained code, prose, or terminal output. That
context is more useful than a preference stated from a single isolated screenshot.
