<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileBioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bio' => 'nullable|string|max:500',
            'details' => 'nullable|array',
            'details.work' => 'nullable|string|max:255',
            'details.education' => 'nullable|string|max:255',
            'details.location' => 'nullable|string|max:255',
            'details.relationship' => 'nullable|string|max:255',
        ];
    }
}
