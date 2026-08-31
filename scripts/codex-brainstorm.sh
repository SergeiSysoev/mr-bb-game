#!/usr/bin/env bash
set -euo pipefail

target=${1:-README.md}
codex exec --sandbox read-only "Brainstorm bounded improvements for ${target}. Do not edit files."
