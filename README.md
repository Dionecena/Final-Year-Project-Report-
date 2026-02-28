# MediConsult — Plateforme Intelligente de Préconsultation Médicale

> Conception et réalisation d'une plateforme intelligente de préconsultation et de prise de rendez-vous médicaux en ligne : Cas d'une clinique privée au Sénégal

## Stack Technologique

| Couche | Technologie |
|---|---|
| Frontend | React.js 18 + TypeScript + TailwindCSS |
| Backend | Laravel 12 + PHP 8.2 |
| Base de données | PostgreSQL 16 |
| Auth | Laravel Sanctum |
| Module IA | Algorithme de scoring PHP |

---

## ⚡ Installation Rapide (Windows)

### Prérequis
- [PHP 8.2+](https://www.php.net/downloads) + [Composer](https://getcomposer.org)
- [Node.js 18+](https://nodejs.org)
- [PostgreSQL 16](https://www.postgresql.org/download) + pgAdmin 4
- [Git](https://git-scm.com)

### Étape 1 — Cloner le projet

```powershell
git clone https://github.com/Dionecena/Final-Year-Project-Report-.git mediconsult
cd mediconsult
```

### Étape 2 — Installer le Backend

```powershell
cd backend

# Installer les dépendances Laravel
composer install

# Configurer l'environnement
copy .env.example .env
php artisan key:generate
```

Ouvrir `.env` et modifier :
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mediconsult_db
DB_USERNAME=postgres
DB_PASSWORD=VotreMotDePassePostgres
```

```powershell
# Créer la BDD dans pgAdmin 4 : CREATE DATABASE mediconsult_db;

# Installer Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Migrations + données initiales
php artisan migrate
php artisan db:seed

# Démarrer l'API
php artisan serve
# → http://localhost:8000
```

### Étape 3 — Installer le Frontend

```powershell
# Nouveau terminal
cd ..\frontend

npm install

# Créer le fichier .env
echo REACT_APP_API_URL=http://localhost:8000/api > .env

npm start
# → http://localhost:3000
```

---

## Structure du Projet

```
mediconsult/
├── backend/                    ← API Laravel 12
│   ├── artisan                 ← CLI Laravel
│   ├── composer.json           ← Dépendances PHP
│   ├── .env.example            ← Modèle de configuration
│   ├── app/
│   │   ├── Http/Controllers/Api/   ← 10 contrôleurs REST
│   │   ├── Models/                 ← 8 modèles Eloquent
│   │   ├── Services/               ← Algorithme IA + Audit
│   │   └── Notifications/          ← Emails
│   ├── database/
│   │   ├── migrations/             ← 8 tables PostgreSQL
│   │   └── seeders/                ← Données initiales
│   └── routes/api.php              ← Routes REST
│
├── frontend/                   ← React.js 18 + TypeScript
│   └── src/
│       ├── pages/              ← 12 pages
│       ├── services/           ← Appels API
│       └── components/         ← Layout, Sidebar
│
└── plans/                      ← Documentation
```

---

## API Endpoints Principaux

| Route | Description |
|---|---|
| `POST /api/auth/register` | Inscription |
| `POST /api/auth/login` | Connexion |
| `GET /api/symptoms` | Liste des symptômes |
| `POST /api/pre-consultations/suggest` | Suggestion de spécialiste |
| `POST /api/pre-consultations` | Soumettre préconsultation |
| `GET /api/doctors` | Liste des médecins |
| `GET /api/doctors/{id}/slots?date=...` | Créneaux disponibles |
| `POST /api/appointments` | Créer un RDV |
| `GET /api/admin/dashboard` | Statistiques admin |
| `GET /api/admin/audit-logs` | Logs d'audit |

---

## Sécurité

- HTTPS + Cloudflare WAF (production)
- Laravel Sanctum (tokens API)
- bcrypt (mots de passe)
- Rate limiting login (5 req/min)
- Audit trail complet
- Headers sécurité (HSTS, CSP, X-Frame-Options)
