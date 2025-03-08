<?php

namespace App\Http\Controllers;

use App\DTOs\PostDTO;
use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * Controller for handling post-related operations
 */
class PostController extends Controller
{
    /**
     * PostController constructor
     *
     * @param PostService $postService Service for handling post business logic
     */
    public function __construct(
        private PostService $postService
    ) {}

    /**
     * Get all formatted posts for the authenticated user
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $posts = $this->postService->getFormattedPosts($user);
        return response()->json(['data' => $posts]);
    }

    /**
     * Store a new post
     *
     * @param StorePostRequest $request The validated request containing post data
     * @return JsonResponse
     */
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
