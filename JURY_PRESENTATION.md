# 🎓 MediConsult — Guide Complet de Présentation au Jury
## Mémoire de Master en Informatique

> **Titre du mémoire :** Conception et réalisation d'une plateforme intelligente de préconsultation et de prise de rendez-vous médicaux en ligne — Cas d'une clinique privée au Sénégal
>
> **Auteure :** HANANE Abderemane

---

## TABLE DES MATIÈRES

1. [Résumé du projet en 2 minutes](#1-résumé-du-projet-en-2-minutes)
2. [Problématique et objectifs](#2-problématique-et-objectifs)
3. [Architecture technique complète](#3-architecture-technique-complète)
4. [Modèle de données (base de données)](#4-modèle-de-données-base-de-données)
5. [Le module IA — Algorithme de scoring](#5-le-module-ia--algorithme-de-scoring)
6. [Sécurité — Mesures implémentées](#6-sécurité--mesures-implémentées)
7. [Flux fonctionnels (parcours utilisateurs)](#7-flux-fonctionnels-parcours-utilisateurs)
8. [API REST — Endpoints](#8-api-rest--endpoints)
9. [Frontend React — Structure et logique](#9-frontend-react--structure-et-logique)
10. [Rôles et permissions](#10-rôles-et-permissions)
11. [Notifications et rappels automatiques](#11-notifications-et-rappels-automatiques)
12. [Audit Trail — Traçabilité](#12-audit-trail--traçabilité)
13. [Déploiement et infrastructure](#13-déploiement-et-infrastructure)
14. [Questions fréquentes du jury (Q&R)](#14-questions-fréquentes-du-jury-qr)
15. [Perspectives futures](#15-perspectives-futures)

---

## 1. Résumé du projet en 2 minutes

**MediConsult** est une plateforme web full-stack permettant à une clinique privée sénégalaise de :

1. **Digitaliser la préconsultation** : le patient décrit ses symptômes en ligne avant de venir
2. **Orienter intelligemment** : un algorithme de scoring suggère automatiquement la spécialité médicale adaptée
3. **Gérer les rendez-vous** : prise de RDV en ligne avec vérification des créneaux disponibles
4. **Administrer la clinique** : tableau de bord statistique, gestion des utilisateurs, audit de sécurité

### Stack technologique

| Couche | Technologie | Justification |
|---|---|---|
| **Frontend** | React.js 18 + TypeScript + TailwindCSS | SPA moderne, typage fort, UI rapide |
| **Backend** | Laravel 12 + PHP 8.2 | Framework MVC robuste, écosystème riche |
| **Base de données** | PostgreSQL 16 | SGBD relationnel fiable, données médicales |
| **Authentification** | Laravel Sanctum | Tokens API sécurisés, léger |
| **Module IA** | Algorithme de scoring PHP | Règles métier, pas de boîte noire |
| **Notifications** | Laravel Mail (SMTP) | Emails de confirmation et rappels |
| **Versioning** | Git + GitHub | Collaboration et traçabilité du code |

---

## 2. Problématique et objectifs

### Problème identifié

Dans les cliniques privées sénégalaises, les patients :
- Arrivent sans savoir quel médecin consulter → **mauvaise orientation**
- Prennent des RDV par téléphone → **files d'attente, erreurs, perte de temps**
- N'ont aucun suivi numérique de leurs consultations → **manque de traçabilité**

### Objectifs du projet

| Objectif | Solution apportée |
|---|---|
| Orienter le patient vers la bonne spécialité | Module de préconsultation + algorithme de scoring |
| Permettre la prise de RDV en ligne | Calendrier de disponibilités + réservation |
| Sécuriser les données médicales | HTTPS, bcrypt, Sanctum, audit trail |
| Donner une vision globale à l'administration | Dashboard statistique avec KPIs |
| Tracer toutes les actions sensibles | Table `audit_logs` + middleware |

---

## 3. Architecture technique complète

### Vue d'ensemble (Architecture 3-tiers)

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                  │
│                    Utilisateur (navigateur)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────────┐
│              COUCHE SÉCURITÉ (Production)                        │
│         Cloudflare — WAF + DDoS Protection + SSL                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    SERVEUR (VPS Linux)                           │
│              Nginx — Reverse Proxy + HTTPS                       │
│  ┌─────────────────────┐   ┌──────────────────────────────────┐ │
│  │   FRONTEND          │   │   BACKEND                        │ │
│  │   React.js 18       │   │   Laravel 12 (PHP 8.2)           │ │
│  │   TypeScript        │   │   API REST JSON                  │ │
│  │   TailwindCSS       │   │   Laravel Sanctum (Auth)         │ │
│  │   React Query       │   │   Eloquent ORM                   │ │
│  │   React Router v6   │   │   Services + Notifications       │ │
│  └─────────────────────┘   └──────────────┬───────────────────┘ │
│                                           │                      │
│  ┌────────────────────────────────────────▼───────────────────┐ │
│  │                  BASE DE DONNÉES                            │ │
│  │              PostgreSQL 16                                  │ │
│  │   8 tables + table pivot symptom_specialty                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Pattern architectural : MVC + Service Layer

Le backend suit le pattern **MVC enrichi d'une couche Service** :

```
Requête HTTP
    │
    ▼
routes/api.php          ← Définition des routes + middleware
    │
    ▼
Middleware              ← Auth (Sanctum), Rate Limiting, SecurityHeaders
    │
    ▼
Controller (Api/)       ← Validation des données, orchestration
    │
    ▼
Service                 ← Logique métier complexe (IA, Audit)
    │
    ▼
Model (Eloquent)        ← Accès base de données, relations
    │
    ▼
PostgreSQL              ← Persistance des données
```

### Pourquoi cette architecture ?

- **Séparation des responsabilités** : chaque couche a un rôle précis
- **Testabilité** : les Services peuvent être testés indépendamment
- **Maintenabilité** : modifier l'algorithme IA ne touche pas les contrôleurs
- **Scalabilité** : on peut ajouter Redis pour le cache sans changer la logique

---

## 4. Modèle de données (base de données)

### Schéma relationnel complet

```
users
├── id (PK)
├── name
├── email (UNIQUE)
├── password (bcrypt)
├── role (ENUM: patient, doctor, secretary, admin)
├── phone
├── is_active (BOOLEAN)
└── timestamps

doctors
├── id (PK)
├── user_id (FK → users) ← Un médecin EST un utilisateur
├── specialty_id (FK → specialties)
├── bio
├── photo
├── license_number
└── timestamps

specialties
├── id (PK)
├── name (ex: Cardiologie, Neurologie...)
├── description
├── icon
└── timestamps

symptoms
├── id (PK)
├── name (ex: Douleur thoracique)
├── description
├── category (ex: Cardiovasculaire, Neurologique...)
└── timestamps

symptom_specialty  ← TABLE PIVOT (cœur de l'algorithme IA)
├── id (PK)
├── symptom_id (FK → symptoms)
├── specialty_id (FK → specialties)
└── weight (DECIMAL 0.0 à 1.0) ← Poids de corrélation

pre_consultations
├── id (PK)
├── patient_id (FK → users)
├── symptoms_selected (JSON) ← IDs des symptômes cochés
├── suggested_specialty_id (FK → specialties) ← Résultat de l'IA
├── confidence_score (DECIMAL) ← Score de confiance en %
├── additional_notes
└── timestamps

appointments
├── id (PK)
├── patient_id (FK → users)
├── doctor_id (FK → doctors)
├── pre_consultation_id (FK → pre_consultations, NULLABLE)
├── scheduled_at (DATETIME)
├── status (ENUM: pending, confirmed, cancelled, completed)
├── notes
├── cancellation_reason
└── timestamps

schedules  ← Planning hebdomadaire des médecins
├── id (PK)
├── doctor_id (FK → doctors)
├── day_of_week (0=Dim, 1=Lun, ..., 6=Sam)
├── start_time (HH:MM)
├── end_time (HH:MM)
├── is_available (BOOLEAN)
└── timestamps

audit_logs  ← Journal de toutes les actions
├── id (PK)
├── user_id (FK → users, NULLABLE)
├── action (ex: login, create, update, cancel)
├── model (ex: Appointment, User)
├── model_id
├── old_values (JSON)
├── new_values (JSON)
├── ip_address
├── user_agent
└── created_at
```

### Relations Eloquent (Laravel ORM)

| Relation | Description |
|---|---|
| `User hasOne Doctor` | Un utilisateur peut être un médecin |
| `Doctor belongsTo Specialty` | Un médecin appartient à une spécialité |
| `Doctor hasMany Schedule` | Un médecin a plusieurs créneaux hebdomadaires |
| `Doctor hasMany Appointment` | Un médecin a plusieurs rendez-vous |
| `Appointment belongsTo PreConsultation` | Un RDV peut être lié à une préconsultation |
| `PreConsultation hasOne Appointment` | Une préconsultation mène à un RDV |
| `User hasMany AuditLog` | Toutes les actions d'un utilisateur sont tracées |

---

## 5. Le module IA — Algorithme de scoring

### Principe

Ce n'est **pas du Machine Learning** — c'est un **algorithme de scoring basé sur des règles métier expertes**. Ce choix est justifié car :
- Les données médicales sont sensibles (pas de données d'entraînement disponibles)
- L'algorithme est **explicable** et **auditable** (exigence médicale)
- Il est **déterministe** : même entrée → même sortie
- Il peut être **ajusté** par des médecins sans retraining

### Formule mathématique

```
Score(Spécialité S) = Σ(poids(symptôme_i, S)) / nombre_symptômes_sélectionnés

Avec : poids(symptôme_i, S) ∈ [0.0, 1.0]
```

### Exemple concret

**Patient sélectionne :** Douleur thoracique + Essoufflement + Palpitations cardiaques

| Spécialité | Douleur thoracique | Essoufflement | Palpitations | Total | Score normalisé |
|---|---|---|---|---|---|
| **Cardiologie** | 0.90 | 0.75 | 0.95 | 2.60 | **2.60/3 = 86.7%** ✅ |
| Pneumologie | 0.60 | 0.85 | 0 | 1.45 | 1.45/3 = 48.3% |
| Médecine Générale | 0.40 | 0 | 0.30 | 0.70 | 0.70/3 = 23.3% |

**→ Suggestion : Cardiologie (86.7% de correspondance)**

### Implémentation (classe `SpecialtySuggestionService`)

```php
// Requête SQL optimisée
$scores = DB::table('symptom_specialty')
    ->select('specialty_id', DB::raw('SUM(weight) as total_weight'))
    ->whereIn('symptom_id', $symptomIds)
    ->groupBy('specialty_id')
    ->orderByDesc('total_weight')
    ->limit(3)
    ->get();

// Normalisation
$normalizedScore = $score->total_weight / count($symptomIds);
$percentage = round($normalizedScore * 100, 1);
```

### Données initiales (SymptomSeeder)

La base contient **34 symptômes** répartis en catégories :
- Cardiovasculaire (4 symptômes)
- Respiratoire (3 symptômes)
- Neurologique (4 symptômes)
- Digestif (3 symptômes)
- Pédiatrique (3 symptômes)
- Dermatologique (3 symptômes)
- Ophtalmologique (3 symptômes)
- ORL (3 symptômes)
- Gynécologique (2 symptômes)
- Orthopédique (3 symptômes)
- Général (3 symptômes)

Et **~70 poids** dans la table `symptom_specialty` couvrant **12 spécialités**.

---

## 6. Sécurité — Mesures implémentées

### 6.1 Authentification (Laravel Sanctum)

```
POST /api/auth/login
    → Vérification email + mot de passe (bcrypt)
    → Vérification compte actif (is_active = true)
    → Génération token API (personal access token)
    → Log de connexion dans audit_logs

Toutes les routes protégées :
    → middleware('auth:sanctum')
    → Token envoyé dans header : Authorization: Bearer {token}
```

**Pourquoi Sanctum et pas JWT ?**
- Sanctum est natif Laravel, maintenu par l'équipe Laravel
- Tokens stockés en base → révocation immédiate possible
- Plus simple pour une API consommée par un seul frontend

### 6.2 Protection anti-brute force

```php
// routes/api.php
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1'); // 5 tentatives max par minute par IP
```

Chaque tentative échouée est loggée dans `audit_logs` avec l'IP.

### 6.3 Headers de sécurité HTTP (middleware `SecurityHeaders`)

| Header | Valeur | Protection |
|---|---|---|
| `X-Frame-Options` | `DENY` | Anti-clickjacking |
| `X-Content-Type-Options` | `nosniff` | Anti-MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Anti-XSS (anciens navigateurs) |
| `Strict-Transport-Security` | `max-age=31536000` | Force HTTPS (HSTS) |
| `Content-Security-Policy` | `default-src 'self'` | Limite les sources de contenu |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Contrôle les informations de référent |
| `Permissions-Policy` | `camera=(), microphone=()` | Désactive les APIs sensibles |

### 6.4 Protection contre les injections SQL

Laravel Eloquent utilise des **requêtes paramétrées** (prepared statements) :
```php
// ✅ Sécurisé — Eloquent paramétrise automatiquement
User::where('email', $email)->first();

// ✅ Sécurisé — DB::table avec bindings
DB::table('appointments')->where('doctor_id', $doctorId)->get();

// ❌ Jamais utilisé dans ce projet
DB::statement("SELECT * FROM users WHERE email = '$email'");
```

### 6.5 Validation des données

**Côté backend (Laravel)** — toutes les entrées sont validées :
```php
$validated = $request->validate([
    'email' => 'required|string|email|max:255|unique:users',
    'password' => ['required', 'confirmed', Password::min(8)],
    'role' => 'required|in:patient,doctor',
    'scheduled_at' => 'required|date|after:now',
]);
```

**Côté frontend (TypeScript)** — typage fort sur toutes les interfaces.

### 6.6 Contrôle d'accès par rôle (RBAC)

```php
// Exemple dans AppointmentController
if ($validated['status'] === 'confirmed' && !$user->isSecretary() && !$user->isAdmin()) {
    return response()->json(['message' => 'Seul le secrétaire peut confirmer un RDV'], 403);
}
```

**Côté frontend** — `ProtectedRoute` avec `allowedRoles` :
```tsx
<ProtectedRoute allowedRoles={['admin']}>
    <AuditLogsPage />
</ProtectedRoute>
```

### 6.7 Résumé des protections

| Attaque | Protection |
|---|---|
| Injection SQL | Eloquent ORM (requêtes paramétrées) |
| XSS | React échappe le HTML + CSP headers |
| CSRF | Laravel CSRF protection native |
| Brute Force | Rate limiting 5 req/min + audit log |
| Clickjacking | X-Frame-Options: DENY |
| Man-in-the-Middle | HTTPS + HSTS |
| Accès non autorisé | Sanctum + RBAC sur chaque route |
| DDoS | Cloudflare WAF (production) |

---

## 7. Flux fonctionnels (parcours utilisateurs)

### 7.1 Parcours Patient — Préconsultation + RDV

```
1. INSCRIPTION
   POST /api/auth/register
   → Création compte (role: patient)
   → Token généré automatiquement
   → Redirection vers dashboard

2. PRÉCONSULTATION
   GET /api/symptoms
   → Affichage des 34 symptômes par catégorie
   
   POST /api/pre-consultations/suggest
   → Envoi des symptômes sélectionnés
   → Retour : Top 3 spécialités avec scores
   
   POST /api/pre-consultations
   → Enregistrement de la préconsultation
   → Stockage : symptoms_selected (JSON), suggested_specialty_id, confidence_score

3. PRISE DE RENDEZ-VOUS
   GET /api/doctors?specialty_id=X
   → Liste des médecins de la spécialité suggérée
   
   GET /api/doctors/{id}/slots?date=2025-03-15
   → Créneaux disponibles (30 min) pour la date choisie
   → Vérification en temps réel des conflits
   
   POST /api/appointments
   → Création du RDV (status: pending)
   → Lien avec la préconsultation (pre_consultation_id)
   → Notification email au patient

4. SUIVI
   GET /api/appointments
   → Liste de tous ses RDV avec statuts
```

### 7.2 Parcours Secrétaire — Gestion des RDV

```
1. CONNEXION → Dashboard secrétaire

2. VOIR LES RDV EN ATTENTE
   GET /api/appointments (voit tous les RDV)
   → Filtre status: pending

3. CONFIRMER UN RDV
   PUT /api/appointments/{id}
   → body: { "status": "confirmed" }
   → Seul le secrétaire (ou admin) peut confirmer
   → Email de confirmation envoyé au patient

4. GÉRER LES PLANNINGS
   POST /api/schedules
   → Définir les créneaux hebdomadaires d'un médecin
```

### 7.3 Parcours Médecin — Consultation du planning

```
1. CONNEXION → Dashboard médecin

2. VOIR SES RDV DU JOUR
   GET /api/doctor/dashboard
   → appointments_today avec préconsultations associées
   → Le médecin voit les symptômes déclarés AVANT la consultation

3. GÉRER SON PLANNING
   GET /api/doctors/{id}/schedules
   PUT /api/schedules/{id}
   → Modifier ses disponibilités hebdomadaires
```

### 7.4 Parcours Admin — Supervision globale

```
1. CONNEXION → Dashboard admin

2. STATISTIQUES
   GET /api/admin/dashboard
   → KPIs : RDV aujourd'hui/semaine/mois
   → Taux d'utilisation préconsultation
   → Top 5 médecins, répartition par spécialité
   → Taux d'annulation

3. GESTION UTILISATEURS
   GET /api/admin/users
   PUT /api/admin/users/{id}/toggle-status  ← Activer/désactiver un compte
   PUT /api/admin/users/{id}/role           ← Changer le rôle

4. AUDIT DE SÉCURITÉ
   GET /api/admin/audit-logs
   GET /api/admin/security-stats
   → Voir toutes les actions : connexions, modifications, annulations
   → Détecter les tentatives de connexion échouées
```

---

## 8. API REST — Endpoints

### Routes publiques (sans authentification)

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion (throttle: 5/min) |
| `GET` | `/api/specialties` | Liste des spécialités |
| `GET` | `/api/symptoms` | Liste des symptômes |
| `GET` | `/api/doctors` | Liste des médecins |
| `GET` | `/api/doctors/{id}/slots?date=` | Créneaux disponibles |

### Routes protégées (token Sanctum requis)

| Méthode | Route | Rôle requis | Description |
|---|---|---|---|
| `POST` | `/api/auth/logout` | Tous | Déconnexion |
| `GET` | `/api/auth/profile` | Tous | Profil connecté |
| `POST` | `/api/pre-consultations/suggest` | Patient | Suggestion IA |
| `POST` | `/api/pre-consultations` | Patient | Soumettre préconsultation |
| `GET` | `/api/pre-consultations` | Patient | Historique |
| `GET` | `/api/appointments` | Tous | Mes RDV (filtré par rôle) |
| `POST` | `/api/appointments` | Patient | Créer un RDV |
| `PUT` | `/api/appointments/{id}` | Secrétaire/Admin | Confirmer/Annuler |
| `POST` | `/api/schedules` | Médecin/Admin | Créer un créneau |
| `GET` | `/api/admin/dashboard` | Admin/Secrétaire | Statistiques globales |
| `GET` | `/api/doctor/dashboard` | Médecin | Stats personnelles |
| `GET` | `/api/admin/audit-logs` | Admin | Journal d'audit |
| `GET` | `/api/admin/users` | Admin | Gestion utilisateurs |

### Format des réponses API

```json
// Succès
{
  "success": true,
  "data": { ... },
  "message": "Rendez-vous créé avec succès"
}

// Erreur de validation
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}

// Erreur d'autorisation
{
  "message": "Accès non autorisé"
}
```

---

## 9. Frontend React — Structure et logique

### Architecture des composants

```
src/
├── App.tsx                    ← Router principal + QueryClient
├── contexts/
│   └── AuthContext.tsx         ← État global d'authentification
├── components/
│   ├── ProtectedRoute.tsx      ← Garde de route (auth + rôles)
│   └── layout/
│       ├── DashboardLayout.tsx ← Layout principal (sidebar + contenu)
│       └── Sidebar.tsx         ← Navigation latérale adaptée au rôle
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── DashboardPage.tsx       ← Dashboard adaptatif (patient/médecin)
│   ├── PreConsultationPage.tsx ← Formulaire multi-étapes
│   ├── AppointmentsPage.tsx    ← Liste des RDV
│   ├── NewAppointmentPage.tsx  ← Prise de RDV
│   ├── DoctorsPage.tsx         ← Annuaire médecins
│   ├── admin/
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AuditLogsPage.tsx
│   │   ├── UsersPage.tsx
│   │   └── SpecialtiesPage.tsx
│   └── doctor/
│       └── SchedulePage.tsx
├── services/                  ← Couche d'appels API
│   ├── api.ts                 ← Instance Axios configurée
│   ├── authService.ts
│   ├── appointmentService.ts
│   ├── doctorService.ts
│   ├── preConsultationService.ts
│   └── specialtyService.ts
└── types/
    └── index.ts               ← Interfaces TypeScript (20+ types)
```

### Gestion de l'état — AuthContext

```tsx
// Contexte global d'authentification
const AuthContext = createContext<AuthContextType>({
  user: null,           // Utilisateur connecté
  isAuthenticated: bool,
  isLoading: bool,
  login: async (data) => {},
  register: async (data) => {},
  logout: async () => {},
  refreshUser: async () => {},
});

// Persistance : token + user stockés dans localStorage
// Rechargement automatique au démarrage de l'app
```

### Protection des routes (ProtectedRoute)

```tsx
// Redirection si non connecté
if (!isAuthenticated) return <Navigate to="/login" />;

// Redirection si rôle insuffisant
if (allowedRoles && !allowedRoles.includes(user.role)) {
  return <Navigate to="/dashboard" />;
}
```

### Gestion des requêtes — React Query

```tsx
// Cache automatique (5 minutes de staleTime)
// Retry automatique (1 fois)
// Pas de refetch au focus de fenêtre
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
```

### Couche service (api.ts)

```typescript
// Instance Axios avec intercepteurs
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Intercepteur : ajoute automatiquement le token Bearer
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur : redirige vers /login si 401
api.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  }
  return Promise.reject(error);
});
```

---

## 10. Rôles et permissions

### Les 4 rôles du système

| Rôle | Description | Accès |
|---|---|---|
| **patient** | Utilisateur final | Préconsultation, prise de RDV, ses propres données |
| **doctor** | Médecin de la clinique | Son planning, ses RDV, dashboard médecin |
| **secretary** | Secrétaire médicale | Tous les RDV, confirmation, dashboard admin |
| **admin** | Super administrateur | Tout + gestion utilisateurs + audit logs |

### Matrice des permissions

| Action | Patient | Médecin | Secrétaire | Admin |
|---|---|---|---|---|
| Voir ses RDV | ✅ | ✅ (les siens) | ✅ (tous) | ✅ (tous) |
| Créer un RDV | ✅ | ❌ | ✅ | ✅ |
| Confirmer un RDV | ❌ | ❌ | ✅ | ✅ |
| Annuler un RDV | ✅ (le sien) | ❌ | ✅ | ✅ |
| Préconsultation | ✅ | ❌ | ❌ | ✅ |
| Gérer son planning | ❌ | ✅ | ✅ | ✅ |
| Dashboard stats | ❌ | ✅ (perso) | ✅ (global) | ✅ (global) |
| Gestion utilisateurs | ❌ | ❌ | ❌ | ✅ |
| Audit logs | ❌ | ❌ | ❌ | ✅ |
| Gestion spécialités | ❌ | ❌ | ❌ | ✅ |

---

## 11. Notifications et rappels automatiques

### Notification de confirmation (email)

Déclenchée quand un secrétaire confirme un RDV :
```
Objet : ✅ Votre rendez-vous est confirmé — MediConsult
Corps :
  - Nom du médecin
  - Spécialité
  - Date et heure (format français)
  - Lien vers "Mes rendez-vous"
  - Rappel d'annulation 24h à l'avance
```

### Rappels automatiques (Artisan Command)

```bash
# Commande planifiée (cron quotidien)
php artisan appointments:send-reminders
```

Logique :
1. Récupère tous les RDV **confirmés** pour **demain**
2. Envoie un email de rappel à chaque patient
3. Affiche le nombre de rappels envoyés

**Planification (cron)** :
```
0 8 * * * php /var/www/mediconsult/artisan appointments:send-reminders
```
→ Exécuté chaque matin à 8h00

### Implémentation (ShouldQueue)

Les notifications implémentent `ShouldQueue` → elles sont **envoyées en arrière-plan** via les queues Laravel (Redis), sans bloquer la réponse HTTP.

---

## 12. Audit Trail — Traçabilité

### Principe

Chaque action sensible est enregistrée dans `audit_logs` avec :
- **Qui** a fait l'action (user_id)
- **Quoi** (action : login, create, update, cancel, view)
- **Sur quoi** (model + model_id)
- **Avant/Après** (old_values, new_values en JSON)
- **D'où** (ip_address, user_agent)
- **Quand** (created_at)

### Actions tracées

| Action | Déclencheur |
|---|---|
| `login` | Connexion réussie |
| `failed_login` | Tentative de connexion échouée |
| `logout` | Déconnexion |
| `register` | Inscription d'un nouvel utilisateur |
| `create` | Création d'un RDV ou préconsultation |
| `update` | Modification d'un RDV (changement de statut) |
| `cancel` | Annulation d'un RDV |
| `view` | Consultation d'un dossier patient |

### Utilité pour la conformité

- **Responsabilité** : on sait qui a modifié quoi et quand
- **Détection d'intrusion** : les `failed_login` répétés depuis une même IP signalent une attaque
- **Conformité RGPD** : traçabilité des accès aux données personnelles
- **Résolution de litiges** : preuve des actions effectuées

---

## 13. Déploiement et infrastructure

### Architecture de production

```
Internet
    │
    ▼
Cloudflare (DNS + WAF + DDoS + SSL)
    │
    ▼
VPS Linux Ubuntu 22.04
    │
    ▼
Nginx (Reverse Proxy)
    ├── /          → React build (fichiers statiques)
    └── /api       → PHP-FPM (Laravel)
                        │
                        ├── PostgreSQL 16
                        └── Redis 7 (queues + cache)
```

### Sécurité serveur

| Mesure | Détail |
|---|---|
| Firewall UFW | Ports 80, 443, 22 uniquement |
| SSH par clé | Pas de connexion par mot de passe |
| Fail2Ban | Blocage IP après tentatives échouées |
| Let's Encrypt | Certificat HTTPS gratuit, renouvellement auto |
| Backups PostgreSQL | Sauvegarde quotidienne automatique |
| Variables .env | Jamais committées dans Git |

### Commandes de déploiement

```bash
# Backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan migrate --force
php artisan db:seed

# Frontend
npm run build
# → Dossier build/ servi par Nginx
```

---

## 14. Questions fréquentes du jury (Q&R)

### Q1 : Pourquoi Laravel et pas Node.js/Express ?

**Réponse :** Laravel offre un écosystème complet "batteries included" : ORM Eloquent, migrations, Sanctum, queues, notifications, validation — tout est intégré. Pour un projet médical avec des données sensibles, la maturité et la sécurité native de Laravel (protection CSRF, validation, hachage) sont des avantages décisifs. Node.js aurait nécessité d'assembler de nombreuses bibliothèques tierces, augmentant la surface d'attaque.

### Q2 : Pourquoi PostgreSQL et pas MySQL ?

**Réponse :** PostgreSQL offre un meilleur support des types JSON (utilisé pour `symptoms_selected`), des contraintes d'intégrité plus strictes, et une meilleure conformité SQL. Pour des données médicales, la fiabilité transactionnelle de PostgreSQL est supérieure. De plus, PostgreSQL supporte `pgcrypto` pour le chiffrement au repos.

### Q3 : Votre "IA" est-elle vraiment de l'intelligence artificielle ?

**Réponse :** C'est un algorithme de scoring basé sur des règles expertes, pas du Machine Learning. Ce choix est **délibéré et justifié** pour un contexte médical :
1. **Explicabilité** : on peut expliquer pourquoi Cardiologie est suggérée (poids des symptômes)
2. **Auditabilité** : un médecin peut vérifier et corriger les poids
3. **Pas de données d'entraînement** : le ML nécessite des milliers de cas labellisés
4. **Déterminisme** : même entrée → même sortie, pas de comportement aléatoire

### Q4 : Comment gérez-vous la confidentialité des données médicales ?

**Réponse :** Plusieurs niveaux de protection :
- **Transport** : HTTPS obligatoire (TLS 1.3)
- **Authentification** : Sanctum tokens, bcrypt pour les mots de passe
- **Autorisation** : RBAC strict — un patient ne voit que ses propres données
- **Audit** : toutes les consultations de dossiers sont tracées
- **Minimisation** : on ne collecte que les données nécessaires (symptômes, pas de diagnostic)

### Q5 : Comment évitez-vous les conflits de rendez-vous ?

**Réponse :** Double vérification :
1. **Côté API** : avant de créer un RDV, on vérifie qu'aucun RDV `pending` ou `confirmed` n'existe pour ce médecin à ce créneau exact
2. **Côté affichage** : `GET /api/doctors/{id}/slots?date=` retourne chaque créneau avec `available: true/false`

```php
$conflict = Appointment::where('doctor_id', $doctorId)
    ->where('scheduled_at', $scheduledAt)
    ->whereIn('status', ['pending', 'confirmed'])
    ->exists();
```

### Q6 : Que se passe-t-il si un médecin n'a pas de planning défini ?

**Réponse :** La route `GET /api/doctors/{id}/slots` vérifie d'abord si le médecin a un créneau (`Schedule`) pour le jour demandé. Si aucun planning n'est défini, la réponse retourne un tableau vide avec le message "Le médecin n'est pas disponible ce jour".

### Q7 : Comment fonctionne la gestion des rôles côté frontend ?

**Réponse :** Le composant `ProtectedRoute` vérifie deux conditions :
1. L'utilisateur est authentifié (token valide en localStorage)
2. Son rôle est dans la liste `allowedRoles` de la route

Si une condition échoue, il est redirigé vers `/login` ou `/dashboard`. La sidebar s'adapte aussi dynamiquement selon le rôle pour n'afficher que les menus accessibles.

### Q8 : Pourquoi React Query et pas Redux ?

**Réponse :** React Query est spécialisé dans la **gestion du state serveur** (données venant d'une API), tandis que Redux gère le state client. Pour ce projet, 90% du state est du state serveur (listes de RDV, médecins, etc.). React Query offre le cache automatique, la revalidation, et les états loading/error sans boilerplate. Redux aurait été surdimensionné.

### Q9 : Comment testeriez-vous votre application ?

**Réponse :** Plusieurs niveaux de tests :
- **Tests unitaires** : PHPUnit pour les Services (SpecialtySuggestionService, AuditService)
- **Tests d'intégration** : Laravel Feature Tests pour les endpoints API
- **Tests E2E** : Cypress pour les parcours utilisateurs critiques (préconsultation → RDV)
- **Tests manuels** : Postman pour valider chaque endpoint

### Q10 : Quelles sont les limites de votre système ?

**Réponse :** Honnêteté intellectuelle :
1. **L'algorithme IA** ne remplace pas un diagnostic médical — c'est une aide à l'orientation
2. **Pas de paiement en ligne** — les RDV sont gratuits dans le système actuel
3. **Pas de téléconsultation** — uniquement la prise de RDV en présentiel
4. **Pas de SMS** — uniquement email (SMS prévu en perspectives)
5. **Pas de tests automatisés** dans la version actuelle (à implémenter)

---

## 15. Perspectives futures

| # | Fonctionnalité | Justification |
|---|---|---|
| 1 | **SMS (Orange Sénégal API)** | Meilleure accessibilité (pas tous les patients ont email) |
| 2 | **Application mobile** (React Native) | Accès depuis smartphone, notifications push |
| 3 | **Téléconsultation** (WebRTC) | Consultations à distance |
| 4 | **Chatbot** (NLP) | Aide à la saisie des symptômes |
| 5 | **ML sur les données** | Améliorer les poids avec les données réelles |
| 6 | **Dossier médical électronique** | Historique complet des consultations |
| 7 | **Intégration laboratoire** | Résultats d'analyses directement dans la plateforme |
| 8 | **Multi-cliniques** | Étendre à un réseau de cliniques |

---

## ANNEXE — Chiffres clés du projet

| Métrique | Valeur |
|---|---|
| Nombre de tables PostgreSQL | 8 tables + 1 table pivot |
| Nombre de modèles Eloquent | 8 modèles |
| Nombre de contrôleurs API | 10 contrôleurs |
| Nombre d'endpoints API | ~30 routes |
| Nombre de pages React | 12 pages |
| Nombre de services métier | 2 (SpecialtySuggestion, Audit) |
| Nombre de symptômes initiaux | 34 symptômes |
| Nombre de spécialités | 12 spécialités |
| Nombre de poids symptôme-spécialité | ~70 entrées |
| Nombre de rôles utilisateur | 4 rôles |
| Nombre de notifications | 2 (confirmation + rappel) |
| Lignes de code backend (PHP) | ~2000 lignes |
| Lignes de code frontend (TypeScript) | ~3000 lignes |

---

## ANNEXE — Glossaire technique

| Terme | Définition |
|---|---|
| **API REST** | Interface de programmation basée sur HTTP, retournant du JSON |
| **Eloquent ORM** | Couche d'abstraction de base de données de Laravel |
| **Sanctum** | Système d'authentification par tokens de Laravel |
| **bcrypt** | Algorithme de hachage de mots de passe (irréversible) |
| **RBAC** | Role-Based Access Control — contrôle d'accès par rôle |
| **HSTS** | HTTP Strict Transport Security — force HTTPS |
| **CSP** | Content Security Policy — limite les sources de contenu |
| **WAF** | Web Application Firewall — filtre les requêtes malveillantes |
| **SPA** | Single Page Application — l'app React ne recharge pas la page |
| **JWT** | JSON Web Token — alternative aux tokens Sanctum (non utilisé) |
| **Queue** | File d'attente pour traitement asynchrone (emails) |
| **Migration** | Script de création/modification de table en base de données |
| **Seeder** | Script de peuplement initial de la base de données |
| **Middleware** | Couche intermédiaire traitant les requêtes HTTP |
| **Pivot table** | Table de liaison entre deux entités (symptom_specialty) |

---

*Document généré pour la préparation à la soutenance de mémoire de Master en Informatique.*
*Plateforme MediConsult — HANANE Abderemane*
