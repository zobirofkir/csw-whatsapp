<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ReactionService
{
    public function toggleReaction(Model $reactionable, User $user, string $type): array
    {
        $existingReaction = $reactionable->reactions()
            ->where('user_id', $user->id)
            ->first();

        $userReaction = null;

        if ($existingReaction) {
            if ($existingReaction->type === $type) {
                $existingReaction->delete();
            } else {
                $existingReaction->update(['type' => $type]);
                $userReaction = $type;
            }
        } else {
            $reactionable->reactions()->create([
                'user_id' => $user->id,
                'type' => $type
            ]);
            $userReaction = $type;
        }

        $reactionCounts = $reactionable->reactions()
            ->select('type')
            ->selectRaw('count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        return [
            'reactionCounts' => $reactionCounts,
            'userReaction' => $userReaction,
        ];
    }
}
