Compris. Ces distinctions sont cruciales, en particulier la façon dont vous définissez la différence entre les fonctionnalités **Snapshot (copie locale)** et **Partage (diffusion en salle)**, ainsi que les rôles de création de salle déjà présents dans la version 1.0.

J'ai mis à jour la structure du document ci-dessous pour refléter avec précision votre configuration actuelle de la version 1.0 et pour cartographier précisément les nouvelles extensions de la version 2.0.

---

# CRUX : Document sur la Portée du Produit et l'Évolution des Versions

**Phase du Projet :** Achèvement de la Production 1.0 / Planification Architecturale 2.0

**Systèmes Cibles :** Web (1.0/2.0) & Client de Bureau (2.0 Premium)

---

## 1. Résumé Exécutif et Pivot Central

### 1.1 La Vision de Crux

Crux a commencé comme un utilitaire sans friction conçu pour les jeux de rôle sur table comme _Mage_. L'éthos central de la version 1.0 est l'utilité immédiate : permettre aux utilisateurs de s'auto-attribuer des rôles à l'entrée et d'interagir avec un tirage de Tarot structuré à 3 cartes sans aucune configuration de compte.

La version 2.0 transforme Crux en un **Écosystème Modulaire de Table de Jeu Virtuelle (VTT) et de Bac à Sable de Campagne**. Elle fait passer l'application d'un espace éphémère à mécanique unique à un tableau de bord persistant et personnalisable, alimenté par des comptes d'utilisateurs, des widgets d'interface modulaires, des mécanismes de dessin avancés et un client de bureau premium pour les utilisateurs expérimentés.

---

## 2. Matrice de Comparaison de la Portée de Haut Niveau

_Utilisez les liens dans la colonne "Domaine Fonctionnel" pour accéder directement aux descriptions techniques et fonctionnelles de chaque section._

| Domaine Fonctionnel                                                                       | Version 1.0 (Base Actuelle)                                                                                                                | Version 2.0 (Mise à Jour Prévue)                                                                                                  | Niveau de Disponibilité (2.0)                                                         |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **[Authentification & Persistance](#3-couche-dauthentification-et-de-persistance)**       | Accès anonyme uniquement ; salles temporaires et éphémères. Les données sont effacées à la fermeture de la salle.                          | Comptes Utilisateur Sécurisés & Authentification. Synchronisation persistante de la base de données.                              | **Gratuit** (Basique) / **Premium** (Avancé)                                          |
| **[Gestion des Salles & Rôles](#4-gestion-des-salles-et-des-campagnes)**                  | Choix d'attribution de rôle à l'entrée : Créer une Salle (attribue le MJ) ou Rejoindre une Salle (attribue le Joueur). Existence éphémère. | Salles persistantes liées aux profils de compte. Les MJ peuvent sauvegarder les salles au lieu de les voir disparaître.           | **Gratuit** (2 Salles MJ) / **Premium** (Plus Salles MJ & un Nombre de Salles Joueur) |
| **[Mécanique Principale : Tirage de Tarot](#5-système-de-mécaniques-modulaires-core)**    | Séquence fixe de tirage à 3 cartes avec des orientations définies et un ordre rigide.                                                      | Tirages entièrement personnalisables : choisissez les formes de disposition, le nombre de cartes.                                 | **Gratuit**                                                                           |
| **[Dés & Aléatoire](#5-système-de-mécaniques-modulaires-core)**                           | Aucun.                                                                                                                                     | Widget de moteur de lancer de dés multi-systèmes.                                                                                 | **Gratuit**                                                                           |
| **[Outils de Génération de Contenu](#6-automatisation-et-moteurs-de-génération)**         | Aucun.                                                                                                                                     | Systèmes de génération de PNJ, bibelots, objets et quêtes.                                                                        | **Gratuit** (Basique) / **Premium** (Donjons)                                         |
| **[Fiches de Personnage](#7-fiches-de-personnage-et-personnalisation)**                   | Aucun.                                                                                                                                     | Fiches de personnage numériques avec suivi du système.                                                                            | **Gratuit** (Standard) / **Premium** (Avancé)                                         |
| **[Disposition de l'Interface Utilisateur](#7-fiches-de-personnage-et-personnalisation)** | Disposition rigide à volets fixes, entièrement centrée sur le canevas Tarot à 3 cartes.                                                    | Disposition de page entièrement modulaire avec sélection de widgets par glisser-déposer.                                          | **Gratuit** (Grille Web) / **Premium** (Volets Flottants)                             |
| **[Captures & Partage](#8-utilitaires-sociaux-et-de-partage)**                            | Synchronisation de l'état en temps réel uniquement dans le canevas de la salle active.                                                     | **Capture Instantanée** (Copier l'image dans le presse-papiers) vs. **Fonctionnalité de Partage** (Diffusion de module en salle). | **Capture Gratuite** / **Diffusion de Partage Premium**                               |
| **[Canaux de Déploiement](#9-architecture-de-déploiement-et-client-de-bureau)**           | Navigateur Web uniquement.                                                                                                                 | Navigateur Web + Client de Bureau Multiplateforme.                                                                                | **Client de Bureau Exclusif Premium**                                                 |
| **[Gestion des Connaissances](#9-architecture-de-déploiement-et-client-de-bureau)**       | Aucun.                                                                                                                                     | Moteur de notes interne de style Obsidian avec Markdown et Vue Graphique.                                                         | **Exclusif Premium** (Bureau)                                                         |

---

## 3. Couche d'Authentification et de Persistance

### 3.1 Version 1.0 (Base Actuelle)

- **Modèle d'Accès :** Zéro connexion. Les utilisateurs naviguent vers une chaîne d'URL générée dynamiquement ou saisissent un code de salle.
- **Cycle de Vie du Stockage :** En mémoire / éphémère. L'état de la salle n'est conservé que tant que les connexions WebSocket actives restent ouvertes. Une fois que le dernier utilisateur quitte, l'historique de la salle est définitivement purgé.

### 3.2 Version 2.0 (Mise à Jour Prévue)

- **Gestion des Identités :** Introduction de comptes utilisateur sécurisés (Email/Mot de passe & fournisseurs OAuth).
- **Salles Persistantes :** Les salles sont liées à un enregistrement de base de données. Les MJ et les joueurs peuvent fermer leurs onglets et revenir des jours plus tard pour retrouver leur disposition, leurs historiques et leurs ressources entièrement intacts.
- **Niveaux de Stockage :**
    - **Niveau Gratuit :** Les MJ bénéficient de jusqu'à 2 salles persistantes actives. Les joueurs n'ont pas de salles persistantes gratuites.
    - **Niveau Premium :** Salles persistantes illimitées pour les MJ et les joueurs, cache de stockage d'actifs côté serveur accru.

---

## 4. Gestion des Salles et des Campagnes

### 4.1 Version 1.0 (Base Actuelle)

- **Attribution des Rôles :** Au lancement de l'application, un utilisateur choisit soit de "Créer une Salle" (ce qui lui confère automatiquement le rôle de **Maître de Jeu**), soit de "Rejoindre une Salle" (ce qui lui confère automatiquement le rôle de **Joueur**).
- **Persistance :** Ces rôles ne durent que le temps de la session éphémère.

### 4.2 Version 2.0 (Mise à Jour Prévue)

- **Rôles MJ/Joueur Persistants :** Les MJ peuvent officiellement sauvegarder et étiqueter leurs salles dans leur tableau de bord de compte. Les MJ peuvent inviter des comptes de joueurs persistants, en maintenant une liste statique sur plusieurs soirées de jeu.
- **Salles Rapides pour les Joueurs :** Les joueurs peuvent conserver leurs propres salles personnelles sauvegardées pour des sessions de jeu rapides, des tests de disposition ou la gestion de ressources solo sans nécessiter une session MJ active.

---

## 5. Système de Mécaniques Modulaires (Core)

### 5.1 Version 1.0 (Base Actuelle)

- **Moteur de Tarot Rigide :** L'application est codée en dur autour d'un canevas partagé avec une action unique : démarrer un tirage. Ce tirage tire exactement **3 cartes dans une orientation définie et un ordre spécifique**.

### 5.2 Version 2.0 (Mise à Jour Prévue)

Le système évolue vers un **espace de travail modulaire sur canevas** où les mécaniques deviennent des widgets activables, et le moteur de cartes s'étend considérablement :

- **Widget Tarot Avancé (Étendu) :** S'affranchit de la limite rigide de 3 cartes. Les MJ et les joueurs peuvent choisir parmi des formes de disposition prédéfinies (par exemple, Croix Celtique, tirages Passé/Présent/Futur) ou spécifier manuellement le nombre exact de cartes à tirer par tirage avec des options d'orientation libre.
- **Moteur de Lancer de Dés :** Un nouveau widget modulaire de base prenant en charge la notation de dés standard (d4, d6, d8, d10, d12, d20, d100) ainsi que des règles de dés narratifs personnalisées (par exemple, le comptage des succès pour les jeux de système de narration comme _Mage_). Comprend des journaux visuels des lancers dans la salle.

---

## 6. Automatisation et Moteurs de Génération

### 6.1 Version 1.0 (Base Actuelle)

- Inexistant. Toute la construction du monde et la génération narrative doivent se faire manuellement en dehors de l'interface de l'application Crux.

### 6.2 Version 2.0 (Mise à Jour Prévue)

- **Générateurs Narratifs de Base (Gratuit) :** Panneaux latéraux ou widgets intégrés qui tirent des matrices de données organisées pour générer instantanément :
    - Des Personnages Non-Joueurs (PNJ) avec des noms, des motivations, des bizarreries et des statistiques appropriées au système.
    - Des bibelots ou descriptions d'objets mondains et magiques.
    - Des accroches de quête, des complications et des thèmes structurels pour contourner les blocages créatifs du MJ.

- **Générateur de Cartes Procédural (Premium) :** Un module premium qui génère automatiquement des plans de donjon aléatoires, des dispositions de grille ou des archétypes de ruines. Les cartes peuvent être générées instantanément et poussées directement vers la couche d'arrière-plan de la salle pour une exploration active.

---

## 7. Fiches de Personnage et Personnalisation

### 7.1 Version 1.0 (Base Actuelle)

- Aucune représentation des données ou attributs des joueurs. Le suivi des personnages doit être géré via des feuilles de papier, des PDF ou des plateformes externes.

### 7.2 Version 2.0 (Mise à Jour Prévue)

- **Interface Utilisateur de Tableau de Bord Modulaire :** L'interface principale de l'application passe d'une disposition rigide à un tableau de bord adaptable. Les utilisateurs peuvent choisir précisément quels modules (Dés, Cartes, Fiches, Générateurs) sont visibles sur leur écran à tout moment.
- **Fiches de Personnage Standard (Gratuit) :** Modèles numériques fonctionnels permettant aux joueurs de saisir des attributs, des compétences et de suivre les statistiques vitales (santé, réserves de pouvoir) directement dans leur interface de tableau de bord.
- **Fiches de Personnage Avancées et Personnalisées (Premium) :** Constructeurs de fiches hautement personnalisables avec des formules mathématiques automatisées, des boutons macro reliant les attributs directement au Moteur de Dés, des habillages/thèmes visuels et un suivi interactif approfondi du système.

---

## 8. Utilitaires Sociaux et de Partage

### 8.1 Version 1.0 (Base Actuelle)

- L'échange d'informations est strictement limité aux utilisateurs qui regardent physiquement le canevas de salle partagé actif et synchronisé.

### 8.2 Version 2.0 (Mise à Jour Prévue)

- **Outil de Capture Instantanée (Gratuit) :** Un bouton de rendu localisé attaché aux modules (comme le canevas de Tarot ou le journal de dés). En cliquant dessus, une image nette de l'événement ou du tirage spécifique est capturée et copiée directement dans le presse-papiers local de l'utilisateur pour un collage facile dans des applications externes (comme Discord ou des éditeurs de texte).
- **La Fonctionnalité "Partager" (Exclusif Premium) :** Un système de notification et d'affichage actif et synchronisé. Lorsqu'un utilisateur premium déclenche un "Partage", il diffuse de manière forcée ou proéminente la disposition spécifique de l'événement/tirage/lancer à toutes les personnes actuellement connectées à la salle dans un module de projecteur dédié, garantissant que personne ne manque un moment narratif majeur.

---

## 9. Architecture de Déploiement et Client de Bureau

### 9.1 Version 1.0 (Base Actuelle)

- **Plateforme :** Interface Web uniquement accessible via les navigateurs de bureau et mobiles modernes.

### 9.2 Version 2.0 (Mise à Jour Prévue)

Alors que l'application Web reçoit des mises à niveau substantielles, un **Client de Bureau** natif séparé (construit via des frameworks comme Electron ou Tauri) sera lancé exclusivement en tant que produit de niveau premium offrant des capacités avancées.

- **Moteur de Disposition Avancé (Desktop Premium) :**
    - S'affranchit des limites des onglets de navigateur uniques.
    - Prend en charge de véritables **fenêtres flottantes et indépendantes** permettant aux utilisateurs multi-écrans d'épingler leur fiche de personnage sur un écran, les moteurs de notes sur un autre, et la salle de Tarot partagée principale sur un écran central.

- **Moteur de Base de Connaissances (Desktop Premium) :**
    - Un **environnement de prise de notes intégré de style Obsidian** exploitant les fichiers markdown.
    - **Entrées Interliées :** Permet aux utilisateurs de lier des notes entre elles à l'aide de références de page bidirectionnelles (par exemple, [[Nom PNJ]]).
    - **Vue Graphique Interactive :** Affiche un réseau de nœuds visuel évolutif montrant les relations et les connexions structurelles entre les PNJ, les lieux, les indices et les événements de campagne.

- **Stratégie de Synchronisation et de Stockage :**
    - **Option Locale Uniquement :** Contrôles de confidentialité complets permettant aux utilisateurs de sauvegarder les campagnes, les graphiques, les notes et les journaux de session localement sur leur machine sans jamais atteindre les serveurs cloud.
    - **Synchronisation Cloud :** Synchronisation automatique en arrière-plan avec le stockage cloud. Comprend un utilitaire transparent pour convertir les résultats du canevas (comme un tirage de carte impactant) directement en un fichier de note markdown en un seul clic.
