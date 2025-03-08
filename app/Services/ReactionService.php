<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Service class for handling reaction-related operations
 */
class ReactionService
{
    /**
     * Toggle a reaction on a model
     *
     * @param Model $reactionable The model to toggle reaction on
     * @param User $user The user creating the reaction
     * @param string $type The type of reaction
     * @return array Array containing reaction counts and user reaction
     */
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
