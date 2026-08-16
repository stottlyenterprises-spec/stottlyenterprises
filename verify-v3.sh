#!/bin/bash
# Stottly Enterprises v3 verification sweep.
# Run this from the project root before considering ANY page "done."
# Catches the exact bug class that recurred repeatedly during the v3 rollout:
# leftover pre-v3 colors/weights that slip through page-by-page fixes.
#
# Usage: ./verify-v3.sh

set -e
cd "$(dirname "$0")"

FAIL=0

check() {
  local label="$1"
  local pattern="$2"
  local exclude="${3:-}"
  local matches
  matches=$(grep -rlP "$pattern" --include="*.html" . 2>/dev/null || true)
  if [ -n "$exclude" ]; then
    matches=$(echo "$matches" | grep -vE "$exclude" || true)
  fi
  if [ -n "$matches" ]; then
    echo "FAIL: $label"
    echo "$matches" | sed 's/^/  /'
    FAIL=1
  else
    echo "OK:   $label"
  fi
}

echo "=== Color/weight retint leftovers ==="
check "font-weight:300 (body text not bumped to 400)" 'font-weight:300;'
check "font-weight:200 (headline/stat not bumped to 800)" 'font-weight:200;'
check "old blue hero-bg gradient stops" '#(EAF1F8|D9E7F3|C3D9EC)'
check "old purple venture-link" '#5B4BDB'
check "old core v3 tokens (pre-retint blue theme)" '#(2E3B4E|5B7A9D|5A6B84|F7FAFD|E7F0F8|AEC4DA|6E93BE|4B6E96)'

echo
echo "=== Copy rules ==="
check "raw em-dash character (not &mdash; entity)" $'\xe2\x80\x94'

echo
echo "=== Stale D.E.E.D.S. wording ==="
# press/pr-deeds.html and blog/press-release-deeds-app-launch.html are dated historical
# press-release bodies (July 30, 2026) and are intentionally left unedited after publication.
# Only evergreen ticker/status copy gets updated elsewhere.
check "'launches in August' / 'Launching August 2026' (should be 'this month')" \
  '(launches|[Ll]aunching) [Ii]n? ?August 2026' \
  '(pr-deeds\.html|press-release-deeds-app-launch\.html)'

if [ "$FAIL" -eq 0 ]; then
  echo
  echo "All checks passed."
else
  echo
  echo "One or more checks failed. Fix before pushing."
  exit 1
fi
