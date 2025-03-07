<?php

use App\Http\Controllers\Auth\WorkOSAuthController;
use Illuminate\Support\Facades\Route;

Route::controller(WorkOSAuthController::class)->group(function () {
    Route::get('login', 'login')->middleware(['guest'])->name('login');
    Route::get('authenticate', 'authenticate')->middleware(['guest']);
    Route::post('logout', 'logout')->middleware(['auth'])->name('logout');
});
