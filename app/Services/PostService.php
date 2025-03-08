<?php

namespace App\Services;

use App\DTOs\PostDTO;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

/**
 * Service class for handling Post-related operations
 */
class PostService
{
    /**
     * Create a new post with optional media attachments
     *
     * @param PostDTO $postDTO Data transfer object containing post details
     * @param User $user The user creating the post
     * @return Post The created post with loaded relationships
     */
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

    /**
     * Get formatted posts with all related data
     *
     * @param User $currentUser The user viewing the posts
     * @return array Collection of formatted posts
     */
    public function getFormattedPosts(User $currentUser)
    {
        return Post::with(['user', 'media', 'reactions', 'comments.user', 'comments.reactions'])
            ->latest()
            ->get()
            ->map(fn ($post) => $this->formatPost($post, $currentUser));
    }

    /**
     * Format a single post with all its related data
     *
     * @param Post $post The post to format
     * @param User $user The user viewing the post
     * @return array Formatted post data
     */
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

    /**
     * Format user data for response
     *
     * @param User $user The user to format
     * @return array Formatted user data
     */
    private function formatUser($user): array
    {
        return [
            'name' => $user->name,
            'avatar' => $user->avatar ?? 'https://i.pravatar.cc/150?u=' . $user->id,
        ];
    }

    /**
     * Format media data for response
     *
     * @param mixed $media The media to format
     * @return array Formatted media data
     */
    private function formatMedia($media): array
    {
        return [
            'id' => $media->id,
            'url' => asset('storage/' . $media->path),
            'type' => $media->type,
        ];
    }

    /**
     * Format comment data with reactions and replies
     *
     * @param mixed $comment The comment to format
     * @param User $user The user viewing the comment
     * @return array Formatted comment data
     */
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

    /**
     * Handle media file uploads for a post
     *
     * @param Post $post The post to attach media to
     * @param array $mediaItems Array of media items to upload
     * @return void
     */
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
