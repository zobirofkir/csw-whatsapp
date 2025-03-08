<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Service class for handling user avatar operations
 */
class AvatarService
{
    /**
     * Updates a user's avatar by storing the new file and removing the old one
     *
     * @param User $user The user whose avatar needs to be updated
     * @param UploadedFile|null $newAvatar The new avatar file to be stored
     * @return string|null Path to the newly stored avatar or null if no avatar provided
     */
    public function updateAvatar(User $user, ?UploadedFile $newAvatar): ?string
    {
        if (!$newAvatar) {
            return null;
        }

        // Delete old avatar if it's a local file (not a WorkOS URL)
        if ($user->avatar && !str_contains($user->avatar, 'workoscdn.com')) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store and return path to new avatar
        return $newAvatar->store('avatars', 'public');
    }
}
