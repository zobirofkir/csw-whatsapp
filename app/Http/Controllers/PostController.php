<?php

namespace App\Http\Controllers;

use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use Illuminate\Http\JsonResponse;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\Comment;
use Illuminate\Http\Request;

class PostController extends Controller
{
    private PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();

        $posts = Post::with(['user', 'media', 'reactions', 'comments.user'])
            ->latest()
            ->get()
            ->map(function ($post) use ($user) {
                $reactionCounts = $post->reactions()
                    ->select('type')
                    ->selectRaw('count(*) as count')
                    ->groupBy('type')
                    ->pluck('count', 'type')
                    ->toArray();

                $userReaction = $post->reactions()
                    ->where('user_id', $user->id)
                    ->value('type');

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
                    'reactionCounts' => $reactionCounts,
                    'userReaction' => $userReaction,
                    'likes' => array_sum($reactionCounts),
                    'hasReacted' => (bool) $userReaction,
                    'comments' => $post->comments->map(function ($comment) {
                        return [
                            'id' => $comment->id,
                            'content' => $comment->content,
                            'user' => [
                                'name' => $comment->user->name,
                                'avatar' => $comment->user->avatar ?? 'https://i.pravatar.cc/150?u=' . $comment->user->id,
                            ],
                            'timestamp' => $comment->created_at->diffForHumans(),
                        ];
                    }),
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

    public function toggleReaction(Request $request, $postId): JsonResponse
    {
        $user = auth()->user();
        $post = Post::findOrFail($postId);
        $type = $request->input('type', 'like');

        if (!array_key_exists($type, Reaction::$types)) {
            return response()->json(['message' => 'Invalid reaction type'], 400);
        }

        $existingReaction = $post->reactions()->where('user_id', $user->id)->first();

        if ($existingReaction) {
            if ($existingReaction->type === $type) {
                $existingReaction->delete();
                $userReaction = null;
            } else {
                $existingReaction->update(['type' => $type]);
                $userReaction = $type;
            }
        } else {
            $post->reactions()->create([
                'user_id' => $user->id,
                'type' => $type
            ]);
            $userReaction = $type;
        }

        $reactionCounts = $post->reactions()
            ->select('type')
            ->selectRaw('count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        return response()->json([
            'message' => 'Reaction updated successfully',
            'reactionCounts' => $reactionCounts,
            'userReaction' => $userReaction,
        ]);
    }

    public function comment(Request $request, $postId): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $post = Post::findOrFail($postId);
        $comment = $post->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'user' => [
                    'name' => $comment->user->name,
                    'avatar' => $comment->user->avatar ?? 'https://i.pravatar.cc/150?u=' . $comment->user->id,
                ],
                'timestamp' => $comment->created_at->diffForHumans(),
            ],
        ]);
    }
}
