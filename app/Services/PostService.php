<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Http\UploadedFile;

class PostService
{
    public function createPost(array $validated, $user): Post
    {
        $post = $user->posts()->create([
            'content' => $validated['content'],
            'feeling' => $validated['feeling'] ?? null,
            'activity' => $validated['activity'] ?? null,
        ]);

        if (isset($validated['media'])) {
            $this->handleMediaUploads($post, $validated['media']);
        }

        return $post->load(['user', 'media']);
    }

    private function handleMediaUploads(Post $post, array $mediaItems): void
    {
        foreach ($mediaItems as $media) {
            if (!isset($media['file'])) {
                continue;
            }

            $path = $media['file']->store('posts', 'public');
            $post->media()->create([
                'path' => $path,
                'type' => $media['type']
            ]);
        }
    }
}
