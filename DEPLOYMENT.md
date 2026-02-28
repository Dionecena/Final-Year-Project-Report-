# Guide de Déploiement Sécurisé — MediConsult

## Architecture de Production

```
Internet → Cloudflare (WAF + DDoS + SSL) → VPS Linux → Nginx → Laravel API + React Build
                                                              → PostgreSQL 16
                                                              → Redis 7
```

---

## 1. PRÉREQUIS SERVEUR

### Spécifications recommandées
- **OS** : Ubuntu 22.04 LTS
- **RAM** : 2 Go minimum (4 Go recommandé)
- **CPU** : 2 vCPU
- **Stockage** : 20 Go SSD
- **Hébergeurs** : Hostinger VPS (~5€/mois), DigitalOcean (~6$/mois), Contabo (~5€/mois)

---

## 2. INSTALLATION DU SERVEUR

### 2.1 Mise à jour et outils de base

```bash
apt update && apt upgrade -y
apt install -y curl wget git unzip nginx postgresql redis-server php8.2-fpm \
  php8.2-pgsql php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip \
  php8.2-bcmath php8.2-redis nodejs npm certbot python3-certbot-nginx
```

### 2.2 Sécurité serveur

```bash
# Firewall UFW
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable

# Fail2Ban (blocage automatique des IPs suspectes)
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Désactiver la connexion SSH par mot de passe (utiliser les clés)
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd
```

---

## 3. CONFIGURATION POSTGRESQL

```bash
# Créer la base de données
sudo -u postgres psql
CREATE DATABASE mediconsult_db;
CREATE USER mediconsult_user WITH ENCRYPTED PASSWORD 'VotreMotDePasseSecurise123!';
GRANT ALL PRIVILEGES ON DATABASE mediconsult_db TO mediconsult_user;
\q
```

---

## 4. DÉPLOIEMENT DU BACKEND LARAVEL

```bash
# Cloner le projet
cd /var/www
git clone https://github.com/Dionecena/Final-Year-Project-Report-.git mediconsult
cd mediconsult/backend

# Installer les dépendances
composer install --no-dev --optimize-autoloader

# Configuration
cp .env.example .env
php artisan key:generate

# Éditer .env avec les vraies valeurs
nano .env
# DB_HOST=127.0.0.1
# DB_DATABASE=mediconsult_db
# DB_USERNAME=mediconsult_user
# DB_PASSWORD=VotreMotDePasseSecurise123!
# APP_URL=https://votre-domaine.com
# APP_ENV=production
# APP_DEBUG=false

# Migrations et seeders
php artisan migrate --force
php artisan db:seed --class=SpecialtySeeder
php artisan db:seed --class=SymptomSeeder

# Optimisations production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Permissions
chown -R www-data:www-data /var/www/mediconsult/backend
chmod -R 755 /var/www/mediconsult/backend/storage
```

---

## 5. DÉPLOIEMENT DU FRONTEND REACT

```bash
cd /var/www/mediconsult/frontend

# Créer le fichier .env de production
echo "REACT_APP_API_URL=https://votre-domaine.com/api" > .env.production

# Build de production
npm install
npm run build

# Les fichiers sont dans /var/www/mediconsult/frontend/build/
```

---

## 6. CONFIGURATION NGINX

```nginx
# /etc/nginx/sites-available/mediconsult
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # SSL (géré par Certbot)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Headers de sécurité
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Frontend React (fichiers statiques)
    root /var/www/mediconsult/frontend/build;
    index index.html;

    # API Laravel
    location /api {
        try_files $uri $uri/ @laravel;
    }

    location @laravel {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /var/www/mediconsult/backend/public/index.php;
        include fastcgi_params;
    }

    # React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Logs
    access_log /var/log/nginx/mediconsult_access.log;
    error_log /var/log/nginx/mediconsult_error.log;
}
```

```bash
# Activer le site
ln -s /etc/nginx/sites-available/mediconsult /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# SSL avec Let's Encrypt (gratuit)
certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

---

## 7. CONFIGURATION CLOUDFLARE (Protection DDoS + WAF)

1. Ajouter votre domaine sur [cloudflare.com](https://cloudflare.com)
2. Changer les nameservers chez votre registrar
3. Activer **SSL/TLS → Full (strict)**
4. Activer **WAF → Managed Rules**
5. Activer **DDoS Protection**
6. Activer **Bot Fight Mode**

---

## 8. SCHEDULER LARAVEL (Rappels automatiques)

```bash
# Ajouter au crontab
crontab -e
# Ajouter cette ligne :
* * * * * cd /var/www/mediconsult/backend && php artisan schedule:run >> /dev/null 2>&1
```

Dans `app/Console/Kernel.php` :
```php
protected function schedule(Schedule $schedule): void
{
    // Envoyer les rappels de RDV chaque jour à 18h
    $schedule->command('appointments:send-reminders')->dailyAt('18:00');
}
```

---

## 9. BACKUPS AUTOMATIQUES

```bash
# Script de backup PostgreSQL
cat > /etc/cron.daily/backup-mediconsult << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mediconsult"
mkdir -p $BACKUP_DIR
pg_dump -U mediconsult_user mediconsult_db > $BACKUP_DIR/db_$DATE.sql
# Garder seulement les 7 derniers backups
ls -t $BACKUP_DIR/db_*.sql | tail -n +8 | xargs rm -f
EOF
chmod +x /etc/cron.daily/backup-mediconsult
```

---

## 10. MONITORING

```bash
# Vérifier les logs Laravel
tail -f /var/www/mediconsult/backend/storage/logs/laravel.log

# Vérifier les logs Nginx
tail -f /var/log/nginx/mediconsult_access.log
tail -f /var/log/nginx/mediconsult_error.log

# Vérifier les tentatives de connexion suspectes
grep "failed_login" /var/www/mediconsult/backend/storage/logs/laravel.log | tail -20
```

---

## 11. CHECKLIST DE SÉCURITÉ AVANT MISE EN PRODUCTION

- [ ] `APP_DEBUG=false` dans `.env`
- [ ] `APP_ENV=production` dans `.env`
- [ ] Mot de passe PostgreSQL fort (16+ caractères)
- [ ] Clé `APP_KEY` générée (`php artisan key:generate`)
- [ ] SSL/HTTPS activé (Let's Encrypt)
- [ ] Cloudflare WAF activé
- [ ] Firewall UFW configuré
- [ ] Fail2Ban installé
- [ ] SSH par clé uniquement
- [ ] Backups automatiques configurés
- [ ] Headers de sécurité Nginx configurés
- [ ] Rate limiting sur `/api/auth/login` (5 req/min)
- [ ] CORS configuré pour votre domaine uniquement
