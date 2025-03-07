<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class AvatarService
{
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
