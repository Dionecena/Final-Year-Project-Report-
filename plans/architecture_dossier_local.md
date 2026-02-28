# Architecture du Dossier Local — MediConsult

## Structure Complète du Projet sur Votre Machine

```
mediconsult/                          ← Dossier racine du projet
│
├── README.md                         ← Documentation principale
├── DEPLOYMENT.md                     ← Guide de déploiement production
│
├── backend/                          ← API Laravel (PHP)
│   ├── .env                          ← Variables d'environnement (à créer depuis .env.example)
│   ├── .env.example                  ← Modèle de configuration
│   ├── composer.json                 ← Dépendances PHP (à créer avec composer)
│   │
│   ├── app/
│   │   ├── Console/
│   │   │   └── Commands/
│   │   │       └── SendAppointmentReminders.php  ← Rappels automatiques
│   │   │
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       ├── AuthController.php         ← Login/Register/Logout
│   │   │   │       ├── SpecialtyController.php    ← CRUD spécialités
│   │   │   │       ├── DoctorController.php       ← CRUD médecins
│   │   │   │       ├── SymptomController.php      ← Liste symptômes
│   │   │   │       ├── PreConsultationController.php ← Préconsultation + suggestion
│   │   │   │       ├── AppointmentController.php  ← Rendez-vous + créneaux
│   │   │   │       ├── ScheduleController.php     ← Planning médecins
│   │   │   │       ├── DashboardController.php    ← Statistiques admin/médecin
│   │   │   │       ├── AuditLogController.php     ← Logs + sécurité
│   │   │   │       └── UserController.php         ← Gestion utilisateurs (admin)
│   │   │   │
│   │   │   └── Middleware/
│   │   │       └── SecurityHeaders.php            ← Headers HTTP sécurité
│   │   │
│   │   ├── Models/
│   │   │   ├── User.php              ← Utilisateurs (patient/médecin/secrétaire/admin)
│   │   │   ├── Specialty.php         ← Spécialités médicales
│   │   │   ├── Doctor.php            ← Profils médecins
│   │   │   ├── Symptom.php           ← Catalogue de symptômes
│   │   │   ├── PreConsultation.php   ← Questionnaires préconsultation
│   │   │   ├── Appointment.php       ← Rendez-vous
│   │   │   ├── Schedule.php          ← Plannings médecins
│   │   │   └── AuditLog.php          ← Journal d'audit
│   │   │
│   │   ├── Notifications/
│   │   │   ├── AppointmentConfirmedNotification.php  ← Email confirmation RDV
│   │   │   └── AppointmentReminderNotification.php   ← Email rappel 24h avant
│   │   │
│   │   └── Services/
│   │       ├── AuditService.php                  ← Traçabilité des actions
│   │       └── SpecialtySuggestionService.php    ← Algorithme de scoring IA
│   │
│   ├── database/
│   │   ├── migrations/               ← Structure des tables PostgreSQL
│   │   │   ├── ...001_create_users_table.php
│   │   │   ├── ...002_create_specialties_table.php
│   │   │   ├── ...003_create_doctors_table.php
│   │   │   ├── ...004_create_audit_logs_table.php
│   │   │   ├── ...005_create_symptoms_table.php
│   │   │   ├── ...006_create_pre_consultations_table.php
│   │   │   ├── ...007_create_schedules_table.php
│   │   │   └── ...008_create_appointments_table.php
│   │   │
│   │   └── seeders/                  ← Données initiales
│   │       ├── SpecialtySeeder.php   ← 12 spécialités médicales
│   │       └── SymptomSeeder.php     ← 35 symptômes + 60+ poids
│   │
│   └── routes/
│       └── api.php                   ← Toutes les routes API REST
│
├── frontend/                         ← Application React.js (TypeScript)
│   ├── .env                          ← REACT_APP_API_URL=http://localhost:8000/api
│   ├── package.json                  ← Dépendances Node.js
│   ├── tailwind.config.js            ← Configuration TailwindCSS
│   ├── tsconfig.json                 ← Configuration TypeScript
│   │
│   ├── public/
│   │   └── index.html                ← Point d'entrée HTML
│   │
│   └── src/
│       ├── App.tsx                   ← Routeur principal (toutes les routes)
│       ├── index.tsx                 ← Point d'entrée React
│       ├── index.css                 ← Styles globaux TailwindCSS
│       │
│       ├── types/
│       │   └── index.ts              ← Tous les types TypeScript
│       │
│       ├── contexts/
│       │   └── AuthContext.tsx       ← Contexte d'authentification global
│       │
│       ├── components/
│       │   ├── ProtectedRoute.tsx    ← Route protégée par rôle
│       │   └── layout/
│       │       ├── Sidebar.tsx       ← Navigation latérale (menu par rôle)
│       │       └── DashboardLayout.tsx ← Layout principal avec header
│       │
│       ├── services/                 ← Appels API (Axios)
│       │   ├── api.ts                ← Client Axios configuré
│       │   ├── authService.ts        ← Login/Register/Logout
│       │   ├── specialtyService.ts   ← CRUD spécialités
│       │   ├── doctorService.ts      ← CRUD médecins
│       │   ├── preConsultationService.ts ← Préconsultation + suggestions
│       │   └── appointmentService.ts ← Rendez-vous + créneaux
│       │
│       └── pages/
│           ├── auth/
│           │   ├── LoginPage.tsx     ← Page de connexion
│           │   └── RegisterPage.tsx  ← Page d'inscription
│           │
│           ├── DashboardPage.tsx     ← Dashboard adapté par rôle
│           ├── PreConsultationPage.tsx ← Questionnaire 3 étapes
│           ├── AppointmentsPage.tsx  ← Liste des rendez-vous
│           ├── NewAppointmentPage.tsx ← Prendre un nouveau RDV
│           ├── DoctorsPage.tsx       ← Liste des médecins
│           │
│           ├── admin/
│           │   ├── AdminDashboardPage.tsx ← Stats + graphiques Recharts
│           │   ├── AuditLogsPage.tsx      ← Logs + alertes sécurité
│           │   ├── UsersPage.tsx          ← Gestion utilisateurs
│           │   └── SpecialtiesPage.tsx    ← CRUD spécialités
│           │
│           └── doctor/
│               └── SchedulePage.tsx  ← Planning médecin par jour
│
└── plans/                            ← Documentation du projet
    ├── analyse_comparative_et_plan_memoire.md
    ├── architecture_et_recommandations_techniques.md
    ├── plan_final_plateforme.md
    ├── environnement_travail_HANANE.md
    └── architecture_dossier_local.md  ← Ce fichier
```

---

## Comment Créer Ce Dossier sur Votre Machine

### Étape 1 — Cloner le projet GitHub

```bash
git clone https://github.com/Dionecena/Final-Year-Project-Report-.git mediconsult
cd mediconsult
```

### Étape 2 — Installer le Backend Laravel

```bash
cd backend

# Installer les dépendances PHP
composer install

# Créer le fichier .env
cp .env.example .env

# Générer la clé de l'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=mediconsult_db
# DB_USERNAME=postgres
# DB_PASSWORD=votre_mot_de_passe

# Créer la base de données dans pgAdmin 4 :
# CREATE DATABASE mediconsult_db;

# Exécuter les migrations
php artisan migrate

# Peupler les données initiales
php artisan db:seed --class=SpecialtySeeder
php artisan db:seed --class=SymptomSeeder

# Démarrer le serveur Laravel
php artisan serve
# → API disponible sur http://localhost:8000
```

### Étape 3 — Installer le Frontend React

```bash
cd ../frontend

# Installer les dépendances Node.js
npm install

# Créer le fichier .env
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Démarrer le serveur React
npm start
# → Application disponible sur http://localhost:3000
```

---

## Outils à Installer sur Votre Machine

| Outil | Version | Téléchargement |
|---|---|---|
| **PHP** | 8.2+ | https://www.php.net/downloads |
| **Composer** | 2.x | https://getcomposer.org |
| **Node.js** | 18+ | https://nodejs.org |
| **PostgreSQL** | 16 | https://www.postgresql.org/download |
| **pgAdmin 4** | Dernière | https://www.pgadmin.org/download |
| **VS Code** | Dernière | https://code.visualstudio.com |
| **Git** | Dernière | https://git-scm.com |
| **Postman** | Dernière | https://www.postman.com/downloads |

---

## Extensions VS Code Recommandées

```json
{
  "recommendations": [
    "bmewburn.vscode-intelephense-client",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## Flux de Développement

```
1. git pull origin session/...    ← Récupérer les dernières modifications
2. cd backend && php artisan serve ← Démarrer l'API Laravel
3. cd frontend && npm start        ← Démarrer React
4. Développer les fonctionnalités
5. git add -A && git commit -m "..."
6. git push origin session/...
```
