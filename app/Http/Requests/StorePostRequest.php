<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:5000'],
            'media.*.file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif,mp4,mov,avi', 'max:5120'],
            'media.*.type' => ['required_with:media.*.file', 'string', 'in:image,video'],
            'feeling' => ['nullable', 'string', 'max:50'],
            'activity' => ['nullable', 'string', 'max:50'],
        ];
    }
}
