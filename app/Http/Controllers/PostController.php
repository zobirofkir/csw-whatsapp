<?php

namespace App\Http\Controllers;

use App\DTOs\PostDTO;
use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function __construct(
        private PostService $postService
    ) {}

    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $posts = $this->postService->getFormattedPosts($user);
        return response()->json(['data' => $posts]);
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $postDTO = PostDTO::fromArray($request->validated());
        $post = $this->postService->createPost($postDTO, $request->user());

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post,
        ]);
    }
}
