#!/usr/bin/env bash
# Hook PostToolUse (Bash) : après un `gh pr create` lancé par Claude Code, surveille la CI
# de la PR en arrière-plan. Si elle est rouge, ci-fix.sh lance un worker qui la corrige.

input=$(cat)

# Le worker ne doit pas déclencher un autre worker.
[ -n "$CI_FIX_WORKER" ] && exit 0

echo "$input" | grep -q 'gh pr create' || exit 0

pr_url=$(echo "$input" | grep -oE 'https://github\.com/[^/]+/[^/]+/pull/[0-9]+' | head -1)
[ -z "$pr_url" ] && exit 0

# Le worker renvoie son compte rendu à cette session.
socket="$CLAUDE_CODE_MESSAGING_SOCKET"
[ -z "$socket" ] && exit 0

pr_number=${pr_url##*/}
log="/tmp/ci-fix-$(basename "$CLAUDE_PROJECT_DIR")-$pr_number.log"

setsid nohup "$CLAUDE_PROJECT_DIR/.claude/hooks/ci-fix.sh" "$pr_url" "$socket" "$CLAUDE_PROJECT_DIR" \
  >"$log" 2>&1 </dev/null &

echo "CI de la PR #$pr_number surveillée en arrière-plan (log : $log)."
exit 0
