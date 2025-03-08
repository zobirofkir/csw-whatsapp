<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\User;
use App\Services\AvatarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\WorkOS\Http\Requests\AuthKitAccountDeletionRequest;
use App\Services\PostService;

class ProfileController extends Controller
{
    public function __construct(
        private readonly AvatarService $avatarService
    ) {}

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        // Get the authenticated user's posts using the PostService
        $postService = app(PostService::class);
        $userPosts = $postService->getFormattedUserPosts($request->user());

        return Inertia::render('settings/profile', [
            'status' => $request->session()->get('status'),
            'userPosts' => $userPosts,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $userData = ['name' => $request->validated('name')];

        if ($request->hasFile('avatar')) {
            $userData['avatar'] = $this->avatarService->updateAvatar(
                user: $request->user(),
                newAvatar: $request->file('avatar')
            );
        }

        if ($request->hasFile('cover_photo')) {
            // Store the cover photo in the public disk under 'cover-photos' directory
            $path = $request->file('cover_photo')->store('cover-photos', 'public');
            $userData['cover_photo'] = $path;
        }

        $request->user()->update($userData);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(AuthKitAccountDeletionRequest $request): RedirectResponse
    {
        return $request->delete(
            using: fn (User $user) => $user->delete()
        );
    }
}
