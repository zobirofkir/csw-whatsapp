<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    public function welcome()
    {
        return Inertia::render('welcome');
    }

    public function account()
    {
        return Inertia::render('account');
    }

    public function accountAuth(string $username)
    {
        return Inertia::render('account', [
            'username' => $username
        ]);
    }
}
