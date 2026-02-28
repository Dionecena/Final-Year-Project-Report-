# Stack Complet Proposé — Plateforme Intelligente de Préconsultation Médicale

> Validez ou modifiez chaque choix selon vos préférences

---

## BACKEND

| # | Technologie | Version | Usage | Valider ? |
|---|---|---|---|---|
| 1 | **PHP** | 8.2+ | Langage serveur | ☐ |
| 2 | **Laravel** | 11 ou 12 | Framework MVC + REST API | ☐ |
| 3 | **Laravel Sanctum** | inclus | Authentification par tokens API | ☐ |
| 4 | **Laravel Queues** | inclus | Envoi asynchrone des notifications | ☐ |
| 5 | **Laravel Scheduler** | inclus | Rappels automatiques de RDV | ☐ |
| 6 | **Laravel Telescope** | optionnel | Monitoring des requêtes en dev | ☐ |

---

## FRONTEND

| # | Technologie | Version | Usage | Valider ? |
|---|---|---|---|---|
| 7 | **React.js** | 18 | Framework frontend SPA | ☐ |
| 8 | **TypeScript** | 5+ | Typage statique JavaScript | ☐ |
| 9 | **TailwindCSS** | 3 | Styling rapide et responsive | ☐ |
| 10 | **React Router** | v6 | Navigation entre les pages | ☐ |
| 11 | **React Query (TanStack)** | v5 | Gestion des appels API + cache | ☐ |
| 12 | **React Hook Form + Zod** | — | Formulaire de préconsultation avec validation | ☐ |
| 13 | **Axios** | — | Appels HTTP vers l'API Laravel | ☐ |
| 14 | **FullCalendar** | — | Affichage du planning des médecins | ☐ |
| 15 | **Recharts** | — | Graphiques du dashboard admin | ☐ |

> **Alternative :** Si vous préférez Angular comme HANANE, remplacez React par Angular 18 + TypeScript

---

## BASE DE DONNÉES

| # | Technologie | Version | Usage | Valider ? |
|---|---|---|---|---|
| 16 | **PostgreSQL** | 16 | SGBDR principal | ☐ |
| 17 | **pgAdmin 4** | — | Interface d'administration PostgreSQL | ☐ |
| 18 | **Redis** | 7 | Cache + files d'attente pour les notifications | ☐ |

---

## MODULE IA / SUGGESTION

| # | Approche | Détail | Valider ? |
|---|---|---|---|
| 19 | **Algorithme de scoring PHP** (recommandé) | Table `symptom_specialty` avec poids — calcul de score par spécialité — implémenté dans Laravel | ☐ |
| 20 | **Microservice Python FastAPI** (avancé) | Modèle scikit-learn (Naive Bayes) entraîné sur symptômes → spécialités | ☐ |
| 21 | **API OpenAI GPT-4** (très avancé) | Chatbot conversationnel de préconsultation | ☐ |

---

## NOTIFICATIONS

| # | Technologie | Usage | Valider ? |
|---|---|---|---|
| 22 | **Laravel Mail + SMTP** | Emails de confirmation et rappels de RDV | ☐ |
| 23 | **Mailtrap** | Test des emails en développement | ☐ |
| 24 | **Mailgun** | Envoi d'emails en production | ☐ |
| 25 | **Orange SMS API Sénégal** | Notifications SMS (bonus) | ☐ |

---

## OUTILS DE DÉVELOPPEMENT

| # | Outil | Usage | Valider ? |
|---|---|---|---|
| 26 | **VS Code** | IDE principal (ou PhpStorm comme HANANE) | ☐ |
| 27 | **Figma** | Prototypage des interfaces UI/UX | ☐ |
| 28 | **Postman** | Test des API REST | ☐ |
| 29 | **StarUML** | Diagrammes UML | ☐ |
| 30 | **Git + GitHub** | Versioning | ☐ |
| 31 | **pgAdmin 4** | Administration PostgreSQL | ☐ |
| 32 | **Docker + Laravel Sail** | Environnement de développement local | ☐ |

---

## DÉPLOIEMENT (pour la démo de soutenance)

| # | Option | Détail | Valider ? |
|---|---|---|---|
| 33 | **Localhost** | Démo en local sur votre machine | ☐ |
| 34 | **Railway.app** | Hébergement gratuit Laravel + PostgreSQL | ☐ |
| 35 | **Render.com** | Hébergement gratuit avec PostgreSQL | ☐ |
| 36 | **VPS Linux** | Serveur dédié (si vous en avez un) | ☐ |

---

## MODÉLISATION / DOCUMENTATION

| # | Outil | Usage | Valider ? |
|---|---|---|---|
| 37 | **StarUML** | Diagrammes UML (comme HANANE) | ☐ |
| 38 | **draw.io** | Alternative gratuite en ligne pour les diagrammes | ☐ |
| 39 | **Microsoft Word** | Rédaction du mémoire | ☐ |
| 40 | **Microsoft PowerPoint** | Présentation de soutenance | ☐ |

---

## RÉSUMÉ VISUEL DU STACK PROPOSÉ

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOTRE PLATEFORME                              │
├──────────────────┬──────────────────────────────────────────────┤
│ FRONTEND         │ React.js 18 + TypeScript + TailwindCSS        │
│ BACKEND          │ Laravel 12 + PHP 8.2                          │
│ BASE DE DONNÉES  │ PostgreSQL 16 + Redis                         │
│ MODULE IA        │ Algorithme de scoring PHP (table poids)        │
│ NOTIFICATIONS    │ Laravel Mail + SMTP (email)                   │
│ IDE              │ VS Code ou PhpStorm                           │
│ PROTOTYPAGE      │ Figma                                         │
│ UML              │ StarUML                                       │
│ TEST API         │ Postman                                       │
│ VERSIONING       │ Git + GitHub                                  │
│ DÉPLOIEMENT      │ Localhost ou Railway.app                      │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## QUESTIONS POUR VALIDER VOS CHOIX

1. **Frontend** : Préférez-vous **React.js** (recommandé) ou **Angular** (comme HANANE) ?
2. **Module IA** : Algorithme de scoring PHP simple, ou vous voulez tenter Python/FastAPI ?
3. **Notifications** : Email seulement, ou vous voulez aussi les SMS (Orange API) ?
4. **IDE** : VS Code ou PhpStorm ?
5. **Déploiement** : Démo en local ou hébergement en ligne pour la soutenance ?
