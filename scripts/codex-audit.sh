#!/usr/bin/env bash
set -euo pipefail

target=${1:-src/game.js}
codex exec --sandbox read-only "Find concrete defects in ${target} and its direct dependencies. Static inspection only: do not launch subagents, use a browser, start servers, or run this script recursively. Cover gameplay logic, mobile controls, security, licensing, and missing tests. Return at most 600 words, rate findings CRITICAL/MEDIUM/MINOR, and do not edit files."
