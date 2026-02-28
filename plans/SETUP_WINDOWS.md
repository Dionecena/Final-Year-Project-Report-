# Guide de Setup sur Windows — MediConsult

## Problème Rencontré

```
Could not open input file: artisan
```

**Cause :** Le dossier `backend/` du projet GitHub ne contient que nos fichiers personnalisés (modèles, contrôleurs, migrations). Il manque le **projet Laravel de base** qui contient le fichier `artisan`, `composer.json`, `bootstrap/`, `config/`, etc.

---

## Solution : Créer le Projet Laravel Complet

### Étape 1 — Créer un nouveau projet Laravel

Ouvrez PowerShell dans votre dossier de travail (`C:\Users\user\Documents\ISI L3\RedacMemoire\`) :

```powershell
# Aller dans le dossier du projet
cd "C:\Users\user\Documents\ISI L3\RedacMemoire"

# Supprimer l'ancien dossier backend vide
Remove-Item -Recurse -Force backend

# Créer un nouveau projet Laravel 12
composer create-project laravel/laravel backend

# Vérifier que artisan existe
ls backend\artisan
```

### Étape 2 — Copier nos fichiers dans le projet Laravel

Maintenant que Laravel est installé, copiez nos fichiers depuis GitHub :

```powershell
# Cloner temporairement notre repo
git clone https://github.com/Dionecena/Final-Year-Project-Report-.git temp_repo

# Copier nos fichiers dans le projet Laravel
# Modèles
Copy-Item -Recurse temp_repo\backend\app\Models\* backend\app\Models\

# Contrôleurs
Copy-Item -Recurse temp_repo\backend\app\Http\Controllers\Api backend\app\Http\Controllers\

# Services
Copy-Item -Recurse temp_repo\backend\app\Services backend\app\

# Notifications
Copy-Item -Recurse temp_repo\backend\app\Notifications backend\app\

# Middleware
Copy-Item temp_repo\backend\app\Http\Middleware\SecurityHeaders.php backend\app\Http\Middleware\

# Console Commands
Copy-Item -Recurse temp_repo\backend\app\Console\Commands backend\app\Console\

# Migrations
Copy-Item temp_repo\backend\database\migrations\* backend\database\migrations\

# Seeders
Copy-Item temp_repo\backend\database\seeders\* backend\database\seeders\

# Routes
Copy-Item temp_repo\backend\routes\api.php backend\routes\

# Supprimer le dossier temporaire
Remove-Item -Recurse -Force temp_repo
```

### Étape 3 — Installer Laravel Sanctum

```powershell
cd backend
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### Étape 4 — Configurer le fichier .env

```powershell
# Copier le fichier d'exemple
Copy-Item .env.example .env

# Générer la clé
php artisan key:generate
```

Ouvrez `.env` dans VS Code et modifiez ces lignes :

```env
APP_NAME=MediConsult
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=mediconsult_db
DB_USERNAME=postgres
DB_PASSWORD=VotreMotDePassePostgres
```

### Étape 5 — Créer la base de données dans pgAdmin 4

1. Ouvrir pgAdmin 4
2. Clic droit sur **Databases** → **Create** → **Database**
3. Nom : `mediconsult_db`
4. Cliquer **Save**

### Étape 6 — Exécuter les migrations

```powershell
php artisan migrate
```

Si erreur de connexion PostgreSQL, vérifiez que :
- PostgreSQL est démarré (Services Windows)
- Le mot de passe dans `.env` est correct
- L'extension `pdo_pgsql` est activée dans `php.ini`

### Étape 7 — Peupler les données initiales

```powershell
php artisan db:seed --class=Database\\Seeders\\SpecialtySeeder
php artisan db:seed --class=Database\\Seeders\\SymptomSeeder
```

### Étape 8 — Démarrer le serveur

```powershell
php artisan serve
# → API disponible sur http://localhost:8000
```

---

## Alternative Plus Simple : Utiliser Laravel Sail (Docker)

Si vous avez Docker Desktop installé sur Windows :

```powershell
cd "C:\Users\user\Documents\ISI L3\RedacMemoire"
composer create-project laravel/laravel backend
cd backend
composer require laravel/sail --dev
php artisan sail:install
# Choisir : pgsql, redis
.\vendor\bin\sail up
```

---

## Vérification que tout fonctionne

```powershell
# Dans le dossier backend
php artisan route:list
# Doit afficher toutes les routes API

php artisan tinker
# Doit ouvrir un shell interactif Laravel
```

---

## Structure Finale Attendue du Dossier backend/

```
backend/
├── artisan                    ← DOIT EXISTER (créé par composer create-project)
├── composer.json              ← DOIT EXISTER
├── .env                       ← À créer depuis .env.example
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/           ← Nos contrôleurs (copiés depuis GitHub)
│   │   └── Middleware/        ← SecurityHeaders.php (copié depuis GitHub)
│   ├── Models/                ← Nos modèles (copiés depuis GitHub)
│   ├── Services/              ← Nos services (copiés depuis GitHub)
│   ├── Notifications/         ← Nos notifications (copiées depuis GitHub)
│   └── Console/Commands/      ← Nos commandes (copiées depuis GitHub)
├── bootstrap/                 ← Créé par Laravel
├── config/                    ← Créé par Laravel
├── database/
│   ├── migrations/            ← Nos migrations (copiées depuis GitHub)
│   └── seeders/               ← Nos seeders (copiés depuis GitHub)
├── public/                    ← Créé par Laravel
├── resources/                 ← Créé par Laravel
├── routes/
│   └── api.php                ← Notre fichier de routes (copié depuis GitHub)
├── storage/                   ← Créé par Laravel
└── vendor/                    ← Créé par composer install
```
