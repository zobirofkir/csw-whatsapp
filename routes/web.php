<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', [PageController::class, 'welcome'])->name('home');

Route::controller(PageController::class)->middleware([ 'auth',ValidateSessionWithWorkOS::class ])->group(function () {
    Route::get('/account/auth/{username}', 'accountAuth')->name('account.auth');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
