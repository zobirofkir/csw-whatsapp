<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
            'image' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif,mp4,mov,avi', 'max:5120'], 
            'feeling' => ['nullable', 'string', 'max:50'],
            'activity' => ['nullable', 'string', 'max:50'],
        ]);

        $post = $request->user()->posts()->create([
            'content' => $validated['content'],
            'feeling' => $validated['feeling'] ?? null,
            'activity' => $validated['activity'] ?? null,
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $path = $file->store('posts', 'public');
            $post->update(['image_path' => $path]);
        }

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post->load('user'),
        ]);
    }
}
