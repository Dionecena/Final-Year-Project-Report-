# MediConsult — Plateforme Intelligente de Préconsultation Médicale

> Conception et réalisation d'une plateforme intelligente de préconsultation et de prise de rendez-vous médicaux en ligne : Cas d'une clinique privée au Sénégal

## Stack Technologique

| Couche | Technologie |
|---|---|
| Frontend | React.js 18 + TypeScript + TailwindCSS |
| Backend | Laravel 12 + PHP 8.2 |
| Base de données | PostgreSQL 16 |
| Cache/Queues | Redis 7 |
| Auth | Laravel Sanctum |
| Module IA | Algorithme de scoring PHP |

---

## Installation

### Prérequis
- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 16
- Redis

### Backend (Laravel)

```bash
cd backend

# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=mediconsult_db
# DB_USERNAME=postgres
# DB_PASSWORD=votre_mot_de_passe

# Créer la base de données
# CREATE DATABASE mediconsult_db;

# Exécuter les migrations
php artisan migrate

# Peupler les données initiales
php artisan db:seed --class=SpecialtySeeder

# Démarrer le serveur
php artisan serve
```

### Frontend (React.js)

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'URL de l'API dans .env
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env

# Démarrer le serveur de développement
npm start
```

---

## Structure du Projet

```
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── SpecialtyController.php
│   │   │   └── DoctorController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Specialty.php
│   │   │   ├── Doctor.php
│   │   │   └── AuditLog.php
│   │   └── Services/
│   │       └── AuditService.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
├── frontend/                   # React.js SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── specialtyService.ts
│   │   │   └── doctorService.ts
│   │   └── types/
│   │       └── index.ts
│   └── tailwind.config.js
│
└── plans/                      # Documentation du projet
    ├── analyse_comparative_et_plan_memoire.md
    ├── architecture_et_recommandations_techniques.md
    ├── plan_final_plateforme.md
    └── ...
```

---

## API Endpoints

### Authentification
| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/login` | Connexion | Non |
| POST | `/api/auth/logout` | Déconnexion | Oui |
| GET | `/api/auth/profile` | Profil utilisateur | Oui |

### Spécialités
| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/specialties` | Lister les spécialités | Non |
| GET | `/api/specialties/{id}` | Détail d'une spécialité | Non |
| POST | `/api/specialties` | Créer une spécialité | Admin |
| PUT | `/api/specialties/{id}` | Modifier une spécialité | Admin |
| DELETE | `/api/specialties/{id}` | Supprimer une spécialité | Admin |

### Médecins
| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/doctors` | Lister les médecins | Non |
| GET | `/api/doctors/{id}` | Détail d'un médecin | Non |
| POST | `/api/doctors` | Créer un profil médecin | Admin |
| PUT | `/api/doctors/{id}` | Modifier un profil | Admin/Médecin |
| DELETE | `/api/doctors/{id}` | Supprimer un profil | Admin |

---

## Sécurité

- HTTPS obligatoire (Let's Encrypt SSL)
- Authentification par tokens (Laravel Sanctum)
- Mots de passe hachés (bcrypt)
- Rate limiting sur le login (5 tentatives/minute)
- Chiffrement AES-256 des données médicales
- Audit trail complet (table audit_logs)
- CORS configuré
- Protection CSRF native Laravel

---

## Auteur

Projet de fin de cycle — Licence Professionnelle ISI Dakar
