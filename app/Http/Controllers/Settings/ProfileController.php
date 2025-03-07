<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\WorkOS\Http\Requests\AuthKitAccountDeletionRequest;

class ProfileController extends Controller
{
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
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:1024'], // Max 1MB
        ]);

        $userData = [
            'name' => $request->name,
        ];

        if ($request->hasFile('avatar')) {
            // Delete old avatar if it's a local file (not a WorkOS URL)
            if ($request->user()->avatar && !str_contains($request->user()->avatar, 'workoscdn.com')) {
                Storage::disk('public')->delete($request->user()->avatar);
            }

            // Store new avatar
            $userData['avatar'] = $request->file('avatar')->store('avatars', 'public');
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
