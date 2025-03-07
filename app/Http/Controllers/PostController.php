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
            'media.*.file' => ['nullable', 'file', 'mimes:jpeg,png,jpg,gif,mp4,mov,avi', 'max:5120'],
            'media.*.type' => ['required_with:media.*.file', 'string', 'in:image,video'],
            'feeling' => ['nullable', 'string', 'max:50'],
            'activity' => ['nullable', 'string', 'max:50'],
        ]);

        // Create the post
        $post = $request->user()->posts()->create([
            'content' => $validated['content'],
            'feeling' => $validated['feeling'] ?? null,
            'activity' => $validated['activity'] ?? null,
        ]);

        // Handle multiple media files
        if ($request->has('media')) {
            foreach ($request->media as $media) {
                if (isset($media['file'])) {
                    $path = $media['file']->store('posts', 'public');
                    $post->media()->create([
                        'path' => $path,
                        'type' => $media['type']
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post->load(['user', 'media']),
        ]);
    }
}
