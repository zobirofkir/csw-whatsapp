<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

/**
 * Public Routes
 */
Route::get('/', [PageController::class, 'welcome'])->name('home');

/**
 * Authenticated Routes
 * These routes require authentication and valid WorkOS session
 */
Route::controller(PageController::class)->middleware([ 'auth',ValidateSessionWithWorkOS::class ])->group(function () {
    Route::get('/account/auth/{username}', 'accountAuth')->name('account.auth');

    /**
     * Post Management Routes
     */
    Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}', [PageController::class, 'showPost'])->name('posts.show');

    /**
     * Reaction Management Routes
     */
    Route::post('/posts/{post}/react', [ReactionController::class, 'togglePostReaction'])->name('posts.react');
    Route::post('/comments/{comment}/react', [ReactionController::class, 'toggleCommentReaction'])->name('comments.react');

    /**
     * Comment Management Routes
     */
    Route::post('/posts/{post}/comment', [CommentController::class, 'store'])->name('posts.comment');
    Route::post('/comments/{comment}/reply', [CommentController::class, 'reply'])->name('comments.reply');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
