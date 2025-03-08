<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\PostService;
use Inertia\Inertia;

class PageController extends Controller
{
    public function __construct(
        private PostService $postService
    ) {}

    public function welcome()
    {
        return Inertia::render('welcome');
    }

    public function account()
    {
        return Inertia::render('account');
    }

    public function accountAuth(string $username)
    {
        return Inertia::render('account', [
            'username' => $username
        ]);
    }

    public function showPost(Post $post)
    {
        $formattedPost = $this->postService->formatPost($post, auth()->user());

        return Inertia::render('posts/Show', [
            'post' => $formattedPost
        ]);
    }
}
