# Commentaires — seulement les utiles, et courts

Un commentaire ne se justifie que s'il apporte une information **que le code ne dit pas déjà**. Par défaut, ne pas commenter.

## Ce qui mérite un commentaire

- Le **pourquoi** non évident : une décision, un piège, une contrainte, un lien vers une règle métier du ticket. Ex. « le bouton reste désactivé tant que la requête est en vol (RM6) ».
- Un choix contre-intuitif qu'un lecteur voudrait « corriger » sans le contexte.

## Exception : 1 ligne au-dessus de chaque composant

Chaque composant qu'on écrit ou qu'on restyle dans `components/ui/` et `components/pages/` porte **1 ligne de commentaire juste au-dessus de sa déclaration**. Elle dit son rôle, ou ce qui ne se voit pas dans son nom : d'où vient son style (la maquette), quelle RM il porte, comment ses états arrivent.

- ✓ `// Pied de page des 4 pages. Le lien ViDev s'ouvre dans un nouvel onglet (RM15).`
- ✓ `// Sans firstName, accueil visiteur (RM1) ; avec, accueil connecté (RM2).`

Un composant shadcn laissé tel quel (ni restylé ni modifié) n'en prend pas.

## Ce qui ne mérite pas de commentaire

- **Paraphraser** un nom de variable, de fonction ou de prop. Si `handleDismiss` ou `initialFocus` sont clairs, ne pas les réexpliquer.
- **Réécrire ce qu'une librairie documente déjà.** Le nom d'un prop + sa description au survol (l'infobulle de l'IDE) suffisent. Ne pas recopier le comportement de la lib en commentaire.
- Décrire une ligne qui **se lit d'elle-même**.

## Quand il est utile, il reste court

Une phrase, une ligne. Jamais une deuxième ligne qui re-justifie ou détaille le mécanisme. Si le commentaire déborde sur plusieurs lignes pour expliquer un comportement de lib, c'est le signe qu'il ne fallait pas le mettre.

- ✗
  ```tsx
  // À l'ouverture, on ne déplace le focus sur AUCUN élément (sinon la lib
  // focalise le premier tabbable, la croix, et son anneau de focus apparaît).
  initialFocus={false}
  ```
- ✓ `initialFocus={false}` — le nom du prop et sa doc au survol disent déjà tout.

## Test avant d'écrire un commentaire

« Est-ce que quelqu'un qui connaît la stack comprend déjà le code sans ce commentaire ? » Si oui, ne pas l'écrire (ou le supprimer).
