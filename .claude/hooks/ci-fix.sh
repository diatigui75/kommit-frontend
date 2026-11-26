#!/usr/bin/env bash
# Lancé en arrière-plan par ci-watch.sh. Attend la fin de la CI de la PR ; si elle est rouge,
# lance un worker Claude Code (headless, sur l'abonnement) dans un worktree de la branche de la PR.
# Usage : ci-fix.sh <url de la PR> <socket de la session à prévenir> <dossier du repo>

pr_url=$1
socket=$2
repo=$3
pr_number=${pr_url##*/}

cd "$repo" || exit 1

# Juste après `gh pr create`, GitHub n'a pas encore enregistré les checks : on attend qu'ils apparaissent.
for _ in $(seq 36); do
  gh pr checks "$pr_url" 2>&1 | grep -q 'no checks reported' || break
  sleep 5
done

gh pr checks "$pr_url" --watch --interval 10
status=$?
echo "Statut CI de la PR #$pr_number : $status"
[ $status -eq 0 ] && exit 0

branch=$(gh pr view "$pr_url" --json headRefName -q .headRefName)
[ -z "$branch" ] && exit 1

# Worktree détaché : le worker ne touche pas au working tree de l'utilisateur,
# même si la branche de la PR y est checkout.
worktree="/tmp/ci-fix-$(basename "$repo")-$pr_number"
git worktree remove --force "$worktree" 2>/dev/null
git fetch origin "$branch" && git worktree add --detach "$worktree" "origin/$branch" || exit 1
base=$(git rev-parse "origin/$branch")

# Garde-fou du worker : bloque push hors branche, merge, et modification des tests, du lint ou de la CI.
guard="{\"hooks\":{\"PreToolUse\":[{\"matcher\":\"Bash|Edit|Write|MultiEdit|NotebookEdit\",\"hooks\":[{\"type\":\"command\",\"command\":\"python3 $repo/.claude/hooks/ci-fix-guard.py\"}]}]}}"

prompt="/goal Consigne (worker) : actuellement, la CI de la PR $pr_url est rouge. Fais-la passer au vert. \
Tu travailles dans un worktree détaché de la branche $branch : pousse avec \`git push origin HEAD:$branch\`. \
Tu as le droit de commit et push sur la branche de la PR, jamais sur dev. Tu ne merges pas la PR. \
Interdit de modifier, supprimer ou désactiver un test existant, une règle de lint ou le fichier de la CI ; \
interdit de retirer ce que la PR apporte (ex. un lockfile périmé se met à jour, on ne retire pas la dépendance). \
Si la seule correction possible passe par l'un de ces interdits, ne pousse rien, arrête-toi et explique-le dans le compte rendu. \
Lance \`date\` au début et après chaque push. \
À la fin, que la CI soit verte ou que tu t'arrêtes, envoie avec SendMessage à la session uds:$socket un compte rendu : \
pour chaque échec, la cause trouvée et la correction poussée. \
Preuve de fin (évaluateur) : le goal est atteint quand la sortie de \`gh pr checks $pr_number\`, lancée après le dernier push, \
montre tous les checks en pass, et que le compte rendu a été envoyé avec SendMessage à la session uds:$socket. \
Il s'arrête aussi après 3 tours sans vert, quand une correction demanderait un des interdits ci-dessus, \
ou quand la sortie de \`date\` montre 15 minutes écoulées depuis le début."

cd "$worktree" || exit 1
CI_FIX_WORKER=1 CI_FIX_BRANCH=$branch CI_FIX_BASE=$base timeout 15m claude -p "$prompt" \
  --settings "$guard" \
  --name "ci-fix PR #$pr_number" \
  --permission-mode bypassPermissions \
  --disallowedTools "Bash(gh pr merge:*)" "Bash(git push origin dev*)" "Bash(git push origin HEAD:dev*)"
echo "Worker terminé : $?"

cd "$repo" && git worktree remove --force "$worktree"
