<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Rappels automatiques de rendez-vous — chaque jour à 18h
Schedule::command('appointments:send-reminders')->dailyAt('18:00');
