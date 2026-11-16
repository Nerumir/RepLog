<p align="center">
  <img src="assets/images/icon.png" width="120" alt="RepLog" />
</p>

<h1 align="center">RepLog</h1>

<p align="center">
  Une app de musculation 100% hors-ligne, avec suivi de niveau par groupe musculaire et une carte de progression façon jeu vidéo.
</p>

## Fonctionnalités

- **Programmes & séances** : création manuelle ou générée aléatoirement (questionnaire : matériel, objectif, expérience, temps disponible) de programmes (full body, push/pull/legs, etc.), séances guidées avec minuteur de repos, suivi des séries en temps réel.
- **Catalogue d'exercices** : près de 500 exercices illustrés (vidéo/gif), navigables par groupe musculaire et par matériel (poids du corps / poids-haltères-barres / machines).
- **Niveaux de performance** : pour chaque exercice pratiqué, ton 1RM (ou tes répétitions) est comparé à des barèmes par sexe et poids de corps, avec 5 paliers (Débutant → Élite) calculés par groupe musculaire.
- **Carte d'assiduité** : une route en zigzag traversant 6 biomes (Prairie → Valhalla). Chaque séance te fait avancer, une pause trop longue te fait reculer.
- **Trophées** : 48 succès à débloquer (progression musculaire, régularité, franchissement de biome, spécialisation poids du corps/machines...), répartis en 5 paliers (Bronze → Rubis), avec pop-up de déblocage animée.
- **100% hors-ligne** : toutes les données sont stockées en local (SQLite), aucun compte, aucun serveur.
- **Import / export** : sauvegarde toutes tes données (profil, programmes, historique, trophées, assiduité) dans un fichier, pour les transférer d'un téléphone à l'autre.

## Installer l'application

### Installation rapide (sur Android, en 2 minutes)

1. **Sur ton téléphone**, ouvre ce lien pour télécharger directement l'APK de la dernière version :
   👉 **[Télécharger RepLog.apk](https://github.com/Nerumir/RepLog/releases/latest/download/app-release.apk)**
2. Une fois le téléchargement terminé, ouvre le fichier depuis tes notifications (ou ton dossier *Téléchargements*).
3. Android va probablement afficher un avertissement (*« Installer des applications inconnues »* ou *« App non reconnue »*) : c'est normal pour une app installée hors Play Store. Appuie sur **Paramètres**, active l'autorisation pour l'app qui a servi au téléchargement (Chrome, Fichiers...), reviens en arrière et appuie sur **Installer**.
4. Lance RepLog et crée ton profil au premier démarrage. Aucune connexion internet n'est nécessaire ensuite : tout fonctionne hors-ligne.

Toutes les versions sont listées dans l'onglet [**Releases**](../../releases) de ce dépôt. L'app n'est pas publiée sur le Play Store : c'est un projet personnel, à installer manuellement (« sideload »).

### En buildant depuis les sources

Prérequis : [Node.js](https://nodejs.org/) 20+, [Android Studio](https://developer.android.com/studio) (SDK + un émulateur ou un téléphone en mode développeur avec le débogage USB activé).

```bash
git clone https://github.com/Nerumir/RepLog.git
cd RepLog
npm install

# Génère le projet natif Android à partir de la config Expo
npx expo prebuild --platform android

# Build + installe en debug (connecté à Metro, pour développer)
npx expo run:android

# Ou build + installe une version release autonome (ne nécessite pas Metro ensuite)
npx expo run:android --variant release
```

## Stack technique

- [Expo](https://expo.dev) / React Native (Expo Router, New Architecture)
- [Drizzle ORM](https://orm.drizzle.team/) sur [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (base locale, migrations versionnées)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) + [React Native Skia](https://shopify.github.io/react-native-skia/) pour les animations et le rendu de la carte d'assiduité
- TypeScript strict de bout en bout

## Structure du projet

```
src/
  app/            écrans (expo-router, routage par fichiers)
  components/     composants UI réutilisables
  domain/         logique métier pure (niveaux, succès, assiduité...)
  db/             schéma Drizzle, requêtes, migrations
  audio/          effets sonores
data/seed/        catalogue d'exercices et barèmes de performance (données versionnées en code)
```
