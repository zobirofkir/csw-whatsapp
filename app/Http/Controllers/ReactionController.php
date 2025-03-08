<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\User;
use App\Services\ReactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReactionController extends Controller
{
    public function __construct(
        private ReactionService $reactionService
    ) {}

    public function togglePostReaction(Request $request, Post $post): JsonResponse
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

    public function toggleCommentReaction(Request $request, Comment $comment): JsonResponse
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
}
