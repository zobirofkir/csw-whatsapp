<?php

namespace App\Services;

use App\DTOs\PostDTO;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class PostService
{
    public function createPost(PostDTO $postDTO, User $user): Post
    {
        $post = $user->posts()->create([
            'content' => $postDTO->content,
            'feeling' => $postDTO->feeling,
            'activity' => $postDTO->activity,
        ]);

        if ($postDTO->media) {
            $this->handleMediaUploads($post, $postDTO->media);
        }

        return $post->load(['user', 'media']);
    }

    public function getFormattedPosts(User $currentUser)
    {
        return Post::with(['user', 'media', 'reactions', 'comments.user', 'comments.reactions'])
            ->latest()
            ->get()
            ->map(fn ($post) => $this->formatPost($post, $currentUser));
    }

    public function formatPost(Post $post, User $user): array
    {
        $reactionCounts = $post->reactions()
            ->select('type')
            ->selectRaw('count(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        return [
            'id' => $post->id,
            'user' => $this->formatUser($post->user),
            'content' => $post->content,
            'media' => $post->media->map(fn ($media) => $this->formatMedia($media)),
            'reactionCounts' => $reactionCounts,
            'userReaction' => $post->reactions()->where('user_id', $user->id)->value('type'),
            'likes' => array_sum($reactionCounts),
            'hasReacted' => (bool) $post->reactions()->where('user_id', $user->id)->exists(),
            'comments' => $post->comments->map(fn ($comment) => $this->formatComment($comment, $user)),
        ];
    }

    private function formatUser($user): array
    {
        return [
            'name' => $user->name,
            'avatar' => $user->avatar ?? 'https://i.pravatar.cc/150?u=' . $user->id,
        ];
    }

    private function formatMedia($media): array
    {
        return [
            'id' => $media->id,
            'url' => asset('storage/' . $media->path),
            'type' => $media->type,
        ];
    }

    public function formatComment($comment, User $user): array
    {
        return [
            'id' => $comment->id,
            'content' => $comment->content,
            'user' => $this->formatUser($comment->user),
            'timestamp' => $comment->created_at->diffForHumans(),
            'reactions' => $comment->reactions()
                ->select('type')
                ->selectRaw('count(*) as count')
                ->groupBy('type')
                ->get(),
            'userReaction' => $comment->reactions()->where('user_id', $user->id)->value('type'),
            'replies' => $comment->replies->map(fn ($reply) => $this->formatComment($reply, $user))
        ];
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
