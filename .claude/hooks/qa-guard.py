#!/usr/bin/env python3
# Hook PreToolUse du garde-fou 1 de /run-qa (KOM-15, RM5) : pendant une session de QA, refuse toute
# modification d'un e2e existant, y compris depuis les subagents. Hors session, ne bloque rien.
# La session est ouverte par `node .claude/skills/run-qa/qa.mjs start`, qui fige la liste des e2e existants.
import json
import os
import re
import sys

SESSION_FILE = ".claude/qa-session.json"
# Ce qui permettrait de lever le garde-fou lui-même.
GUARD_FILES = [SESSION_FILE, ".claude/hooks/qa-guard.py", ".claude/settings.json", ".claude/settings.local.json"]
WRITE_BASH = re.compile(
    r"((?<![0-9&])>(?!&)|\btee\b|\bsed\b[^|;&]*\s-i|\bperl\b[^|;&]*\s-i|\b(mv|rm|cp|truncate|dd|install|ln|unlink)\b"
    r"|\bgit\s+(checkout|restore|rm|mv|apply|stash|reset)\b)"
)


def block(reason):
    print(f"Bloqué par qa-guard (KOM-15, RM5) : {reason}", file=sys.stderr)
    sys.exit(2)


def main():
    data = json.load(sys.stdin)
    root = os.environ.get("CLAUDE_PROJECT_DIR") or data.get("cwd") or os.getcwd()
    session_path = os.path.join(root, SESSION_FILE)
    if not os.path.exists(session_path):
        return
    with open(session_path, encoding="utf-8") as f:
        protected = set(json.load(f).get("protectedFiles", []))

    tool = data.get("tool_name", "")
    tool_input = data.get("tool_input", {}) or {}

    if tool in ("Edit", "Write", "MultiEdit", "NotebookEdit"):
        path = tool_input.get("file_path") or tool_input.get("notebook_path") or ""
        rel = os.path.normpath(os.path.relpath(path, root) if os.path.isabs(path) else path)
        if rel in protected:
            block(f"{rel} est un e2e existant. Pendant le QA, on peut seulement créer de nouveaux e2e.")
        if rel in GUARD_FILES:
            block(f"{rel} protège le garde-fou du QA.")
    elif tool == "Bash":
        command = tool_input.get("command", "")
        if not WRITE_BASH.search(command):
            return
        if re.search(r"(^|[\s'\"/])e2e/", command):
            block("commande d'écriture qui vise e2e/. Pour créer un nouvel e2e, utiliser l'outil Write.")
        if any(g in command for g in GUARD_FILES):
            block("commande d'écriture qui vise le garde-fou du QA.")


main()
