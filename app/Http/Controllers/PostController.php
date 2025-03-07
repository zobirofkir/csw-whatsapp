<?php

namespace App\Http\Controllers;

use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    private PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->postService->createPost($request->validated(), $request->user());

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post,
        ]);
    }
}
