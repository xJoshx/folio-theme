default:
  just --list

# Validate the project while the palette is still intentionally empty.
check:
  npm run check

# Generate the installable Zed theme. Fails until every palette role has a color.
build:
  npm run build

test:
  npm test

site:
  npm run site:dev

site-build:
  npm run site:build

clean:
  find themes -maxdepth 1 -name '*.json' -delete
