# Environnement de Travail de HANANE Abderemane — Extrait du PDF

> Source : *Développement d'une plateforme de gestion des rendez-vous médicaux : cas du service de santé militaire*
> Auteure : Mme. HANANE Abderemane — Licence Professionnelle IAGE, ISI Dakar, 2024-2025
> Soutenu le 26/12/2025

---

## 1. LANGAGES DE PROGRAMMATION

| Langage | Rôle | Version |
|---|---|---|
| **PHP** | Backend — langage serveur principal | PHP 8.4 (sortie novembre 2024) |
| **JavaScript** | Frontend — langage client | Standard moderne |
| **TypeScript** | Frontend — surcouche typée de JavaScript | Utilisé via Angular |
| **HTML / CSS** | Structure et style des pages web | Standard |
| **SQL** | Requêtes base de données | Via PostgreSQL |

---

## 2. FRAMEWORKS

| Framework | Rôle | Version |
|---|---|---|
| **Laravel** | Backend — framework PHP MVC + REST API | Laravel 12 |
| **Angular** | Frontend — framework JavaScript/TypeScript | Angular 18 |

### Architecture utilisée
- **MVC (Model-View-Controller)** côté backend avec Laravel
- **Architecture REST API** : le backend expose des API consommées par le frontend Angular
- Séparation claire **Frontend / Backend**

---

## 3. BASE DE DONNÉES

| Technologie | Détail |
|---|---|
| **PostgreSQL** | SGBDR principal — base de données relationnelle |
| **pgAdmin 4** | Interface graphique d'administration de PostgreSQL |
| **Nom de la BDD** | `mediceaux_rdv_db` |
| **Connexion** | Via fichier `.env` Laravel avec extension `pdo_pgsql` |

### Commandes utilisées
```sql
-- Création de la base de données
CREATE DATABASE mediceaux_rdv_db;
```

```bash
# Création des migrations Laravel
php artisan make:migration create_nom_migration_table

# Application des migrations
php artisan migrate

# Création des modèles
php artisan make:model nom_model

# Création des controllers API
php artisan make:controller nom_controller --api
```

---

## 4. OUTILS DE DÉVELOPPEMENT

### IDE / Éditeur de code
| Outil | Usage | Justification |
|---|---|---|
| **PhpStorm** | IDE principal pour le développement | Debugger intégré, analyse de code avancée, support natif Laravel/Symfony, autocomplétion intelligente, outils de refactoring |

### Prototypage UI/UX
| Outil | Usage |
|---|---|
| **Figma** | Conception et prototypage des interfaces utilisateur — maquettes interactives, collaboration en temps réel |

### Modélisation UML
| Outil | Usage |
|---|---|
| **StarUML** | Création de tous les diagrammes UML (cas d'utilisation, diagramme de classes) et architectures |

### Test des API
| Outil | Usage |
|---|---|
| **Postman** | Test et validation des requêtes API — vérification de la communication frontend/backend |

### Productivité / Documentation
| Outil | Usage |
|---|---|
| **Microsoft Word** | Rédaction et édition du mémoire |
| **Microsoft PowerPoint** | Création de la présentation de soutenance |

### DevOps / Versioning
| Outil | Usage |
|---|---|
| **Git** | Gestion de version locale |
| **GitHub** | Hébergement du code source (repositories) |

---

## 5. DIAGRAMMES UML RÉALISÉS

| Diagramme | Description |
|---|---|
| Diagramme de cas d'utilisation général | Vue globale du système |
| Diagramme de cas d'utilisation — Gestion des Utilisateurs | Inscription, connexion, profils |
| Diagramme de cas d'utilisation — Gestion des Rendez-vous | Prise, suivi, annulation |
| Diagramme de cas d'utilisation — Gestion des Plannings | Créneaux, disponibilités |
| Diagramme de cas d'utilisation — Gestion des Services | Spécialités médicales |
| Diagramme de classes | Structure statique du système |

---

## 6. COMMANDES ANGULAR UTILISÉES

```bash
# Créer un nouveau projet Angular
ng new nom_projet

# Créer un composant
ng g c nom_composant

# Créer un service (pour les appels API)
ng g s nom_service

# Démarrer le serveur de développement Angular
ng serve
```

---

## 7. COMMANDES LARAVEL UTILISÉES

```bash
# Créer un nouveau projet Laravel
composer create-project laravel/laravel medical-backend

# Démarrer le serveur Laravel
php artisan serve

# Migrations
php artisan make:migration create_nom_migration_table
php artisan migrate

# Modèles et Controllers
php artisan make:model nom_model
php artisan make:controller nom_controller --api
```

---

## 8. ACTEURS / RÔLES DU SYSTÈME

| Rôle | Fonctionnalités |
|---|---|
| **Visiteur** | Inscription |
| **Patient** | Connexion, gestion profil, prise de RDV, suivi des RDV, annulation |
| **Médecin** | Connexion, gestion profil, visualisation planning, gestion des créneaux, liste des patients |
| **Secrétaire** | Confirmation/refus des demandes de RDV, gestion des plannings médecins, liste des médecins |
| **Administrateur** | Gestion des utilisateurs (ajout, blocage, suppression), gestion des services médicaux |

---

## 9. MODULES FONCTIONNELS IMPLÉMENTÉS

| Module | Statut | Description |
|---|---|---|
| Gestion des utilisateurs | ✅ **Atteint** | Inscription, connexion sécurisée avec rôles, gestion des profils, administration des comptes |
| Interface de prise de rendez-vous | ✅ **Atteint** | Réservation avec choix du médecin et du service, consultation des plannings |
| Gestion des plannings médicaux | ✅ **Atteint** | Création, modification, visualisation des plannings, gestion des créneaux |
| Gestion des services | ✅ **Atteint** | Liste des spécialités, attribution des services aux médecins, ajout/modification |
| Notifications et rappels | ✅ **Atteint** | Envoi de rappels par SMS et e-mail |
| Chatbot d'assistance | ❌ **Non atteint** | Non implémenté pour raisons de contraintes temporelles et complexité technique |

---

## 10. INTERFACES DÉVELOPPÉES (Captures d'écran dans le mémoire)

| Interface | Acteur |
|---|---|
| Page d'inscription | Visiteur |
| Page de connexion | Tous |
| Page d'accueil | Tous |
| Liste des médecins | Patient |
| Page de prise de rendez-vous | Patient |
| Page de suivi des rendez-vous | Patient |
| Page d'accueil du médecin | Médecin |
| Liste des patients | Médecin |
| Gestion du planning | Médecin |
| Page d'accueil du secrétaire | Secrétaire |
| Liste des demandes de rendez-vous | Secrétaire |
| Gestion des utilisateurs | Administrateur |
| Gestion des services | Administrateur |

---

## 11. BESOINS NON FONCTIONNELS DÉFINIS

- **Interface utilisateur** : intuitive et facile à utiliser
- **Temps de réponse** : réponses rapides du système
- **Confidentialité** : protection des données des patients
- **Disponibilité** : système stable avec récupération en cas de défaillance
- **Responsivité** : adaptation à différents environnements (desktop, mobile)
- **Maintenabilité** : application facilement maintenable

---

## 12. RÉSUMÉ COMPLET DE L'ENVIRONNEMENT TECHNIQUE

```
┌─────────────────────────────────────────────────────────────┐
│                  ENVIRONNEMENT HANANE                        │
├─────────────────┬───────────────────────────────────────────┤
│ IDE             │ PhpStorm                                   │
│ Frontend        │ Angular 18 + TypeScript                    │
│ Backend         │ Laravel 12 + PHP 8.4                       │
│ Base de données │ PostgreSQL + pgAdmin 4                     │
│ Architecture    │ MVC + REST API                             │
│ Prototypage     │ Figma                                      │
│ Modélisation    │ StarUML (diagrammes UML)                   │
│ Test API        │ Postman                                    │
│ Versioning      │ Git + GitHub                               │
│ Documentation   │ Microsoft Word + PowerPoint                │
│ Langage BD      │ SQL (PostgreSQL)                           │
│ Langage back    │ PHP 8.4                                    │
│ Langage front   │ TypeScript / JavaScript                    │
└─────────────────┴───────────────────────────────────────────┘
```

---

## 13. CE QUE HANANE N'A PAS FAIT (Opportunités pour votre projet)

| Fonctionnalité | Statut HANANE | Votre Opportunité |
|---|---|---|
| Chatbot d'assistance | ❌ Non atteint | ✅ À implémenter |
| Module de préconsultation | ❌ Absent | ✅ **Votre innovation principale** |
| Système de suggestion de spécialiste | ❌ Absent | ✅ **Votre innovation principale** |
| Application mobile | ❌ Non mentionné | ✅ Perspective future |
| Intégration avec d'autres systèmes de santé | ❌ Non mentionné | ✅ Perspective future |
