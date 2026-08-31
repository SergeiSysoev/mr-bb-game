#!/usr/bin/env bash
set -euo pipefail

target=${1:-README.md}
codex exec --sandbox read-only "Research the question or context in ${target}. Return findings only; do not edit files."
