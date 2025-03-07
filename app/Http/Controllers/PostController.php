<?php

namespace App\Http\Controllers;

use App\Services\PostService;
use App\Http\Requests\StorePostRequest;
use Illuminate\Http\JsonResponse;
use App\Models\Post;
use App\Models\Reaction;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    private PostService $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index(): JsonResponse
    {
        $user = Auth::user();

        $posts = Post::with(['user', 'media', 'reactions', 'comments.user', 'comments.reactions'])
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
                    'comments' => $post->comments->map(function ($comment) use ($user) {
                        return [
                            'id' => $comment->id,
                            'content' => $comment->content,
                            'user' => [
                                'name' => $comment->user->name,
                                'avatar' => $comment->user->avatar ?? 'https://i.pravatar.cc/150?u=' . $comment->user->id,
                            ],
                            'timestamp' => $comment->created_at->diffForHumans(),
                            'reactions' => $comment->reactions,
                            'userReaction' => $comment->reactions()
                                ->where('user_id', $user->id)
                                ->value('type'),
                            'replies' => []
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
        $user = Auth::user();
        $post = Post::findOrFail($postId);
        $type = $request->input('type');

        if (!$type) {
            return response()->json(['message' => 'Reaction type is required'], 400);
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
            'user_id' => Auth::id(),
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
                'reactions' => [],
                'userReaction' => null,
                'replies' => []
            ],
        ]);
    }

    public function commentReaction(Request $request, Comment $comment): JsonResponse
    {
        $user = Auth::user();
        $type = $request->input('type', 'like');

        $existingReaction = $comment->reactions()->where('user_id', $user->id)->first();

        if ($existingReaction) {
            if ($existingReaction->type === $type) {
                $existingReaction->delete();
                $userReaction = null;
            } else {
                $existingReaction->update(['type' => $type]);
                $userReaction = $type;
            }
        } else {
            $comment->reactions()->create([
                'user_id' => $user->id,
                'type' => $type
            ]);
            $userReaction = $type;
        }

        $reactions = $comment->reactions()
            ->select('type')
            ->selectRaw('count(*) as count')
            ->groupBy('type')
            ->get()
            ->map(function ($reaction) {
                return [
                    'type' => $reaction->type,
                    'count' => $reaction->count
                ];
            })->toArray();

        return response()->json([
            'reactions' => $reactions,
            'userReaction' => $userReaction,
        ]);
    }

    public function commentReply(Request $request, Comment $comment): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $reply = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $comment->post_id,
            'parent_id' => $comment->id,
            'content' => $request->content,
        ]);

        $reply->load('user');

        return response()->json([
            'reply' => [
                'id' => $reply->id,
                'content' => $reply->content,
                'user' => [
                    'name' => $reply->user->name,
                    'avatar' => $reply->user->avatar ?? 'https://i.pravatar.cc/150?u=' . $reply->user->id,
                ],
                'timestamp' => $reply->created_at->diffForHumans(),
                'reactions' => [],
                'replies' => [],
            ],
        ]);
    }
}
