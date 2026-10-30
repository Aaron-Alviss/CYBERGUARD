# CYBERGUARD SCAN

Prototype web de sensibilisation à la cybersécurité pour le Hack4Trust 2026.

## Objectif

Cette première version présente une plateforme visuelle et fonctionnelle qui aide les utilisateurs à :

- reconnaître les arnaques numériques courantes,
- analyser des liens suspects,
- apprendre les bons réflexes,
- signaler une tentative d’arnaque de manière démonstrative.

## Structure du projet

- `index.html` : page principale du prototype
- `style.css` : design, responsive, animations et styles de composants
- `script.js` : menu mobile, analyseur de liens, animations et signalement local
- `assets/images/` : dossier prévu pour des visuels locaux (non indispensable pour cette version)

## Lancement local

### Option 1 : ouvrir directement le fichier

Vous pouvez ouvrir `index.html` dans le navigateur.

### Option 2 : via XAMPP / PHP server local

1. Placez le dossier dans le dossier `htdocs` de XAMPP.
2. Démarrez Apache.
3. Ouvrez l’adresse : `http://localhost/CYBERGUARD SCAN/` ou le nom du dossier.

### Option 3 : serveur Python simple

Dans le dossier du projet, exécutez :

```bash
python -m http.server 8000
```

Ensuite ouvrez :

```text
http://localhost:8000/
```

## Fonctionnalités de démonstration

- Analyseur de liens avec indicateurs visuels (VERT / ORANGE / ROUGE)
- Exemple de liens de démonstration :
  - `https://universite-exemple.invalid/paiement`
  - `https://cadeau-gratuit.invalid`
  - `https://site-officiel.invalid`
- Signaler une arnaque enregistré temporairement dans le navigateur via `localStorage`

## Remarques

- Les images sont chargées depuis des sources publiques et peuvent être remplacées si besoin.
- Les données institutionnelles sont fictives et clairement marquées comme exemples de démonstration.
- L’analyse n’est pas une garantie absolue de sécurité, mais une aide visuelle à la vigilance.

## Auteurs

CYBERGUARD RDC

Slogan : « Vérifions avant de cliquer ! »
