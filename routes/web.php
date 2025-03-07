<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::get('/account', function () {
        return Inertia::render('account');
    })->name('account');

    Route::get('/account/auth/{username}', function ($username) {
        return Inertia::render('account', [
            'username' => $username
        ]);
    })->name('account.auth');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
