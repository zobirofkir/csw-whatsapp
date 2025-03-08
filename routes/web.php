<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', [PageController::class, 'welcome'])->name('home');

Route::controller(PageController::class)->middleware([ 'auth',ValidateSessionWithWorkOS::class ])->group(function () {
    Route::get('/account/auth/{username}', 'accountAuth')->name('account.auth');

    // Post routes
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');

    // Reaction routes
    Route::post('/posts/{post}/react', [ReactionController::class, 'togglePostReaction'])->name('posts.react');
    Route::post('/comments/{comment}/react', [ReactionController::class, 'toggleCommentReaction'])->name('comments.react');

    // Comment routes
    Route::post('/posts/{post}/comment', [CommentController::class, 'store'])->name('posts.comment');
    Route::post('/comments/{comment}/reply', [CommentController::class, 'reply'])->name('comments.reply');

    Route::get('/posts/{post}', [PageController::class, 'showPost'])->name('posts.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
