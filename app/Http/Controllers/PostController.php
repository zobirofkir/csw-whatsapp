<?php

namespace App\Http\Controllers;

use App\DTOs\PostDTO;
use App\Services\PostService;
use App\Services\ReactionService;
use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function __construct(
        private PostService $postService,
        private ReactionService $reactionService
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

    public function toggleReaction(Request $request, Post $post): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $request->validate(['type' => 'required|string']);

        $result = $this->reactionService->toggleReaction(
            $post,
            $user,
            $request->input('type')
        );

        return response()->json([
            'message' => 'Reaction updated successfully',
            ...$result
        ]);
    }

    public function comment(Request $request, Post $post): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:1000']);

        $comment = $post->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $this->postService->formatComment($comment, Auth::user()),
        ]);
    }

    public function commentReaction(Request $request, Comment $comment): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $request->validate(['type' => 'required|string']);

        $result = $this->reactionService->toggleReaction(
            $comment,
            $user,
            $request->input('type')
        );

        return response()->json($result);
    }

    public function commentReply(Request $request, Comment $comment): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:1000']);

        $reply = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $comment->post_id,
            'parent_id' => $comment->id,
            'content' => $request->content,
        ]);

        $reply->load('user');

        return response()->json([
            'reply' => $this->postService->formatComment($reply, Auth::user()),
        ]);
    }
}
