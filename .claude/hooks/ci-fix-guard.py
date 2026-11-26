#!/usr/bin/env python3
# Hook PreToolUse du worker lancé par ci-fix.sh : bloque ce que la consigne interdit (RM5, RM6, RM8).
# Variables posées par ci-fix.sh : CI_FIX_BRANCH (branche de la PR), CI_FIX_BASE (commit de départ).
import json
import os
import re
import subprocess
import sys

PROTECTED = re.compile(
    r"(\.test\.|\.spec\.|(^|/)(tests?|e2e|__tests__)/|eslint|vitest\.config|vite\.config"
    r"|playwright\.config|jest\.config|tsconfig|(^|/)\.github/|(^|/)\.claude/)"
)
CHEAT = re.compile(r"eslint-disable|@ts-ignore|@ts-nocheck|@ts-expect-error|\.(skip|only|todo)\(")
SCRIPTS = re.compile(r'^[+-]\s*"(test|lint|build|typecheck)[^"]*"\s*:')


def block(reason):
    print(f"Bloqué par ci-fix-guard : {reason}", file=sys.stderr)
    sys.exit(2)


def git(cwd, *args):
    return subprocess.run(["git", "-C", cwd, *args], capture_output=True, text=True).stdout


def check_push(cwd, command, branch, base):
    allowed = f"git push origin HEAD:{branch}"
    for push in re.findall(r"git\s+push[^;&|\n]*", command):
        if " ".join(push.split()) != allowed:
            block(f"seul `{allowed}` est autorisé (RM5).")

    files = git(cwd, "diff", "--name-only", f"{base}..HEAD").split()
    touched = [f for f in files if PROTECTED.search(f)]
    if touched:
        block(f"le push modifierait un test, le lint, la CI ou la config : {', '.join(touched)} (RM6).")

    diff = git(cwd, "diff", "-U0", f"{base}..HEAD")
    added = [l for l in diff.splitlines() if l.startswith("+") and not l.startswith("+++")]
    if any(CHEAT.search(l) for l in added):
        block("le push ajoute un eslint-disable, un @ts-ignore ou un test désactivé (RM6).")
    if "package.json" in files:
        pkg = git(cwd, "diff", "-U0", f"{base}..HEAD", "--", "package.json")
        if any(SCRIPTS.match(l) for l in pkg.splitlines()):
            block("le push modifie un script test, lint, build ou typecheck de package.json (RM6).")


def check_bash(cwd, command, branch, base):
    if re.search(r"gh\s+pr\s+merge", command) or re.search(r"pulls/\d+/merge", command):
        block("le merge reste la décision de l'utilisateur (RM8).")
    if re.search(r"gh\s+auth\s+token", command):
        block("pas d'accès direct au token GitHub.")
    if re.search(r"gh\s+api", command) and re.search(
        r"(-X|--method)\s*(POST|PUT|PATCH|DELETE)|\s-[fF]\s|--field|--raw-field|--input", command
    ):
        block("gh api en écriture interdit, seule la lecture est permise (RM5, RM8).")
    if re.search(r"git\s+push", command):
        check_push(cwd, command, branch, base)


def main():
    data = json.load(sys.stdin)
    branch = os.environ.get("CI_FIX_BRANCH")
    base = os.environ.get("CI_FIX_BASE")
    if not branch or not base:
        return
    tool = data.get("tool_name", "")
    tool_input = data.get("tool_input", {})
    cwd = data.get("cwd") or os.getcwd()

    if tool == "Bash":
        check_bash(cwd, tool_input.get("command", ""), branch, base)
    elif tool in ("Edit", "Write", "MultiEdit", "NotebookEdit"):
        path = tool_input.get("file_path") or tool_input.get("notebook_path") or ""
        rel = os.path.relpath(path, cwd) if os.path.isabs(path) else path
        if PROTECTED.search(rel):
            block(f"{rel} est un test, une config de lint, de test ou de CI (RM6).")


main()
