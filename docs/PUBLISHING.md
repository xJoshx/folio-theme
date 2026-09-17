# Publishing Folio

Folio is structurally ready as a four-theme Zed release candidate. Public
publication remains intentionally blocked until the themes are tested in Zed,
the logo is selected, and the GitHub repository is connected.

## Current package

- Extension ID: `folio-theme`
- Theme family: `Folio`
- Version: `0.0.1`
- Dark themes: Luminous Ink, Sunlit Shell, Spring Herbarium
- Light theme: Linen
- Artifact: `themes/folio.json`
- Author: José Vizcaíno

The ID follows Zed's current requirement for a unique kebab-cased theme ID and
does not contain `zed` or `extension`. The generated theme uses Zed's current
`v0.2.0` theme schema.

## Gates before publication

- Connect the intended GitHub repository and replace the placeholder URL in
  `extension.toml`.
- Confirm the public spelling of the author name.
- Install this repository with **Install Dev Extension** and inspect all four
  themes in Zed.
- Test Linen across the polyglot fixture and decide whether it needs a second
  color-tuning pass.
- Select and validate the Folio logo.
- Re-run `npm run release:check` and validate `themes/folio.json` against the
  official Zed theme schema.
- Re-check that `folio-theme` is unique immediately before submission.

## Submission

Zed extensions are published through a pull request to
`zed-industries/extensions`. Add the public repository as a submodule, add a
matching `extensions.toml` entry at version `0.0.1`, run the registry sorting
command, and submit the pull request only after every gate above is complete.
