<?php

namespace App\Http\Controllers;

use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use Illuminate\Http\JsonResponse;
use App\Models\Post;

class PostController extends Controller
{
    private PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index(): JsonResponse
    {
        $posts = Post::with(['user', 'media'])
            ->latest()
            ->get()
            ->map(function ($post) {
                \Log::info('Post data:', ['post' => $post->toArray()]);

                return [
                    'id' => $post->id,
                    'user' => [
                        'name' => $post->user->name,
                        'avatar' => $post->user->avatar ?? 'https://i.pravatar.cc/150?u=' . $post->user->id,
                        'timestamp' => $post->created_at->diffForHumans(),
                    ],
                    'content' => $post->content,
                    'media' => $post->media->map(function ($media) {
                        return [
                            'id' => $media->id,
                            'url' => asset('storage/' . $media->path),
                            'type' => $media->type,
                        ];
                    }),
                    'likes' => 0, // You can implement this later
                    'comments' => 0, // You can implement this later
                ];
            });

        return response()->json([
            'data' => $posts
        ]);
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
