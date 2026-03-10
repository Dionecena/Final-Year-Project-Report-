# Guide de Deploiement -- MediConsult

Deploiement gratuit sur **Railway** (backend Laravel + PostgreSQL) et **Vercel** (frontend React).

---

## Etape 1 : Backend sur Railway

### 1.1 Creer le projet

1. Aller sur [railway.app](https://railway.app) et se connecter avec GitHub
2. Cliquer **"New Project"** > **"Deploy from GitHub Repo"**
3. Selectionner le repo `Dionecena/Final-Year-Project-Report-`
4. Dans les settings du service :
   - **Root Directory** : `backend`
   - Railway detecte automatiquement Laravel via `nixpacks.toml`

### 1.2 Ajouter PostgreSQL

1. Dans le projet Railway, cliquer **"+ New"** > **"Database"** > **"Add PostgreSQL"**
2. Railway cree automatiquement les variables `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

### 1.3 Variables d'environnement

Dans les settings du service backend, onglet **"Variables"**, ajouter :

```
APP_NAME=MediConsult
APP_ENV=production
APP_DEBUG=false
APP_KEY=   (voir 1.4)
APP_URL=https://VOTRE-SERVICE.railway.app

FRONTEND_URL=https://VOTRE-APP.vercel.app

DB_CONNECTION=pgsql
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}

SANCTUM_STATEFUL_DOMAINS=VOTRE-APP.vercel.app

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=log

MEDICAL_DATA_ENCRYPTION_KEY=   (generer une cle de 32 caracteres aleatoires)
```

### 1.4 Generer APP_KEY

Dans le terminal Railway (onglet **"Shell"** du service) :

```bash
php artisan key:generate --show
```

Copier la valeur affichee (commence par `base64:...`) et la coller dans la variable `APP_KEY`.

### 1.5 Lancer les migrations et le seed

Toujours dans le terminal Railway :

```bash
php artisan migrate --force
php artisan db:seed --force
```

### 1.6 Creer le compte admin

```bash
php artisan tinker
```

```php
App\Models\User::create([
    'name' => 'Administrateur',
    'email' => 'admin@mediconsult.sn',
    'password' => bcrypt('VotreMotDePasseSecurise'),
    'role' => 'admin',
]);
```

### 1.7 Verifier

Acceder a `https://VOTRE-SERVICE.railway.app/up` -- doit retourner un statut 200.

---

## Etape 2 : Frontend sur Vercel

### 2.1 Creer le projet

1. Aller sur [vercel.com](https://vercel.com) et se connecter avec GitHub
2. Cliquer **"Add New"** > **"Project"**
3. Importer le repo `Dionecena/Final-Year-Project-Report-`
4. Configurer :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Create React App
   - **Build Command** : `npm run build`  (ou laisser par defaut)
   - **Output Directory** : `build`  (ou laisser par defaut)

### 2.2 Variable d'environnement

Dans **Settings** > **Environment Variables** :

| Name | Value |
|---|---|
| `REACT_APP_API_URL` | `https://VOTRE-SERVICE.railway.app/api` |

> **Important** : Remplacer `VOTRE-SERVICE` par le vrai nom de votre service Railway.

### 2.3 Deployer

Cliquer **"Deploy"**. Vercel build et deploie automatiquement.

### 2.4 Mettre a jour CORS

Une fois l'URL Vercel connue (ex: `mediconsult-xxx.vercel.app`) :
1. Retourner dans Railway > Variables du backend
2. Mettre a jour `FRONTEND_URL=https://mediconsult-xxx.vercel.app`
3. Mettre a jour `SANCTUM_STATEFUL_DOMAINS=mediconsult-xxx.vercel.app`
4. Railway redeploie automatiquement

---

## Etape 3 : Verification finale

1. Ouvrir l'URL Vercel dans le navigateur
2. Tester l'inscription (devrait creer un compte patient)
3. Se connecter avec le compte admin
4. Verifier le dashboard admin
5. Creer un medecin et une secretaire depuis l'interface admin

---

## Depannage

### Erreur CORS
- Verifier que `FRONTEND_URL` dans Railway correspond exactement a l'URL Vercel (avec `https://`)
- Verifier que `SANCTUM_STATEFUL_DOMAINS` ne contient PAS le `https://` (juste le domaine)

### Erreur 500 sur le backend
- Verifier les logs : Railway > Service > onglet **"Logs"**
- S'assurer que `APP_KEY` est defini
- S'assurer que la base de donnees est connectee

### Page blanche sur le frontend
- Verifier que `REACT_APP_API_URL` est bien defini dans Vercel
- Redeploy apres avoir modifie les variables : Vercel > Deployments > Redeploy

### La base de donnees est vide
```bash
# Dans le terminal Railway
php artisan migrate --force
php artisan db:seed --force
```

---

## Architecture de deploiement

```
Utilisateur
    |
    v
[Vercel - Frontend React]
    |
    | REACT_APP_API_URL
    v
[Railway - Backend Laravel]
    |
    | DB_HOST, DB_PORT...
    v
[Railway - PostgreSQL]
```

---

## Couts

| Service | Plan | Limite |
|---|---|---|
| **Vercel** | Hobby (gratuit) | 100 GB bandwidth/mois |
| **Railway** | Trial | 5$/mois de credits offerts |
| **PostgreSQL** | Inclus Railway | 1 GB stockage |

Pour une demo/soutenance, ces limites sont largement suffisantes.