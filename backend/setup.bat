@echo off
echo ============================================
echo  MediConsult - Setup Backend Laravel
echo ============================================

echo.
echo [1/6] Suppression du cache de configuration...
if exist bootstrap\cache\config.php del /f bootstrap\cache\config.php
if exist bootstrap\cache\packages.php del /f bootstrap\cache\packages.php
if exist bootstrap\cache\services.php del /f bootstrap\cache\services.php
if exist bootstrap\cache\routes-v7.php del /f bootstrap\cache\routes-v7.php
echo Cache supprime.

echo.
echo [2/6] Verification du fichier .env...
if not exist .env (
    copy .env.example .env
    echo Fichier .env cree depuis .env.example
) else (
    echo Fichier .env existe deja.
)

echo.
echo [3/6] Generation de la cle d'application...
php artisan key:generate

echo.
echo [4/6] Vider le cache de configuration...
php artisan config:clear

echo.
echo [5/6] Executer les migrations...
php artisan migrate:fresh

echo.
echo [6/6] Peupler les donnees initiales...
php artisan db:seed

echo.
echo ============================================
echo  Setup termine ! Demarrage du serveur...
echo ============================================
php artisan serve
