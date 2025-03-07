<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\WorkOS\Http\Requests\AuthKitAuthenticationRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLoginRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLogoutRequest;
use Illuminate\Support\Facades\Log;

class WorkOSAuthController extends Controller
{
    public function login(AuthKitLoginRequest $request)
    {
        return $request->redirect();
    }

    public function authenticate(AuthKitAuthenticationRequest $request)
    {
        $user = $request->authenticate();

        Log::info('WorkOS User:', ['user' => $user]);

        return redirect()->route('account.auth', [
            'username' => $user->name ?? 'default-username'
        ]);
    }

    public function logout(AuthKitLogoutRequest $request)
    {
        return $request->logout();
    }
}
