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
        return Inertia::render('settings/profile', [
            'status' => $request->session()->get('status'),
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
