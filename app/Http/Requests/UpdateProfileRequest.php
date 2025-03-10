<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:1024'], // Max 1MB
            'cover_photo' => ['nullable', 'image', 'max:2048'], // Max 2MB
            'bio' => ['nullable', 'string', 'max:500'], // Max 500 characters for bio
            'details' => ['nullable', 'array'], // Details as JSON/array
            'details.*' => ['nullable', 'string', 'max:255'], // Validate each detail value
        ];
    }
}
