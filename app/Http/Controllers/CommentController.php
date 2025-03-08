<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function __construct(
        private PostService $postService
    ) {}

    public function store(Request $request, Post $post): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:1000']);

        $comment = $post->comments()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        $comment->load('user');

        /** @var User $user */
        $user = Auth::user();

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $this->postService->formatComment($comment, $user),
        ]);
    }

    public function reply(Request $request, Comment $comment): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:1000']);

        $reply = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $comment->post_id,
            'parent_id' => $comment->id,
            'content' => $request->content,
        ]);

        $reply->load('user');

        /** @var User $user */
        $user = Auth::user();

        return response()->json([
            'reply' => $this->postService->formatComment($reply, $user),
        ]);
    }
}
