<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', [PageController::class, 'welcome'])->name('home');

Route::controller(PageController::class)->middleware([ 'auth',ValidateSessionWithWorkOS::class ])->group(function () {
    Route::get('/account/auth/{username}', 'accountAuth')->name('account.auth');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('/posts/{post}/react', [PostController::class, 'toggleReaction'])->name('posts.react');
    Route::post('/posts/{post}/comment', [PostController::class, 'comment'])->name('posts.comment');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
