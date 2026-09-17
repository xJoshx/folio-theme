#!/usr/bin/env bash
set -euo pipefail

name="shell"
for item in ready "theme fixture"; do
  printf '%s: %s\n' "$name" "$item"
done
