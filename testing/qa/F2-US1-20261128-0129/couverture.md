# Couverture des CA, run F2-US1-20261128-0129

Tickets : KOM-19 (daily standup, frontend) et KOM-22 (calendrier, frontend). Les tickets portent des CA, pas des RM.

| CA | Ticket | Déclenchable ? | Couverte par | Remarque |
| --- | --- | --- | --- | --- |
| CA1 | KOM-19 | Oui | `standupHome.test.ts › SM-1` | |
| CA8 | KOM-19 | Oui | `standupHome.test.ts › SM-2` | |
| CA42 | KOM-19 | Oui | `standupHome.test.ts › SM-3` | |
| CA2 | KOM-19 | Oui | `standupConversation.nondet.test.ts › SM-4` | Couvert seulement par un `.nondet` (vrai LLM), non rejoué par le QA : à explorer en passe 2. Ouverture aussi observée par `qa-standup.test.ts › QA-1` (flux simulé). |
| CA4, CA34 | KOM-19 | Oui | `standupConversation.nondet.test.ts › SM-5` | `.nondet` seulement. Indicateur d'attente aussi vu dans `standupErrors.test.ts › SM-18` (après Réessayer). |
| CA39 | KOM-19 | Oui | `qa-standup.test.ts › QA-1` (ajouté) | Accueil et champ de la modale, vide puis espaces. OK. |
| CA40 | KOM-19 | Oui | `standupConversation.nondet.test.ts › SM-6` | `.nondet` seulement. |
| CA5, CA10 | KOM-19 | Oui | `standupSummary.nondet.test.ts › SM-7` | `.nondet` seulement. « Aucun » côté résumé du calendrier aussi dans `standupCalendar.test.ts › SM-6`. |
| CA30 (récap) | KOM-19 | Oui | `standupSummary.test.ts › SM-8` | |
| CA26 | KOM-19 | Oui | `qa-standup.test.ts › QA-4` (ajouté) | Corps du POST /standups égal à `{ summary }` reçu, sans date, 1 seul appel à la conversation. OK. |
| CA6, CA25 | KOM-19 | Oui | `standupSummary.nondet.test.ts › SM-9` | `.nondet` seulement. |
| CA27 | KOM-19 | Oui | `standupSummary.nondet.test.ts › SM-10` | `.nondet` seulement. |
| CA7 | KOM-19 | Oui | `standupClose.nondet.test.ts › SM-11, SM-12, SM-13` | `.nondet` seulement. |
| CA44 | KOM-19 | Oui | `standupClose.nondet.test.ts › SM-14` | `.nondet` seulement. |
| CA9 | KOM-19 | Oui | `standupReplace.nondet.test.ts › SM-15`, `standupReplace.test.ts › SM-16` | Branche « confirmer » en `.nondet` seulement. |
| CA41 | KOM-19 | Oui | `standupReplace.nondet.test.ts › SM-17` | `.nondet` seulement. |
| CA29 | KOM-19 | Oui | `standupErrors.test.ts › SM-18`, `qa-standup.test.ts › QA-2` (ajouté) | SM-18 coupe la connexion (pas un événement SSE `error`). QA-2 envoie un vrai événement `error`. |
| CA31 | KOM-19 | Oui | `qa-standup.test.ts › QA-2` (ajouté) | Interprétation : « message distinct » = le `message` de l'erreur affiché avec « Réessayer » (arbitrage de l'inventaire KOM-19). `LLM_UNAVAILABLE` n'est pas rejoué : même chemin de code que `LLM_QUOTA_EXCEEDED`. OK. |
| CA32 | KOM-19 | Oui | `qa-standup.test.ts › QA-3` (ajouté) | Après `SUMMARY_MALFORMED`, aucun bouton « Oui, je valide le daily » actif. OK. |
| CA11 | KOM-22 | Oui | `standupCalendar.test.ts › SM-1` | |
| CA12 | KOM-22 | Oui | `standupCalendar.test.ts › SM-2` | |
| CA13 | KOM-22 | Oui, visuellement | Aucun e2e (unitaire seulement) | Non ajouté : un jour futur et un jour gris ne diffèrent que par la couleur de fond, sans rôle ni libellé, et le run tombe un samedi (aucun jour futur dans la semaine). À vérifier à l'œil en passe 2 un autre jour que le samedi. |
| CA37 | KOM-22 | Non | Unitaire | Dépend d'une date du jour piège (29 mars, 25 octobre, 29 février) : impossible à provoquer sur le lien déployé un 28 novembre. |
| CA14 | KOM-22 | Oui | `standupCalendar.test.ts › SM-3` | |
| CA15 | KOM-22 | Oui | `standupCalendar.test.ts › SM-4` | |
| CA46 | KOM-22 | Oui | `standupCalendar.test.ts › SM-5` | |
| CA30 (résumé) | KOM-22 | Oui | `standupCalendar.test.ts › SM-6` | |
| CA45 | KOM-22 | Oui | `standupCalendar.test.ts › SM-7` | |
| CA43 | KOM-22 | Oui | `standupCalendar.test.ts › SM-8, SM-9` | |
| Isolation A/B | KOM-22 | Non | Aucun | Contrainte tenue par le serveur, le front ne peut pas l'assurer (dit le ticket). |
