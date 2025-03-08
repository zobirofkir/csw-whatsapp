<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\PostService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/**
 * Controller for handling page-related routes
 */
class PageController extends Controller
{
    /**
     * Create a new PageController instance
     */
    public function __construct(
        private PostService $postService
    ) {}

    /**
     * Display the welcome page
     */
    public function welcome()
    {
        return Inertia::render('welcome');
    }

    /**
     * Display the account page for authenticated users
     */
    public function account()
    {
        return Inertia::render('account');
    }

    /**
     * Display the account page for a specific username
     *
     * @param string $username The username to display account for
     */
    public function accountAuth(string $username)
    {
        return Inertia::render('account', [
            'username' => $username
        ]);
    }

    /**
     * Display a single post
     *
     * @param Post $post The post to display
     */
    public function showPost(Post $post)
    {
        $formattedPost = $this->postService->formatPost($post, auth()->user());

        return Inertia::render('posts/Show', [
            'post' => $formattedPost
        ]);
    }
}
