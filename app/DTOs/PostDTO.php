<?php

namespace App\DTOs;

/**
 * Data Transfer Object for Post entities
 */
class PostDTO
{
    /**
     * @param string $content The main content of the post
     * @param string|null $feeling The feeling/emotion associated with the post
     * @param string|null $activity The activity associated with the post
     * @param array $media Array of media attachments for the post
     */
    public function __construct(
        public readonly string $content,
        public readonly ?string $feeling = null,
        public readonly ?string $activity = null,
        public readonly array $media = []
    ) {}

    /**
     * Creates a PostDTO instance from an array of data
     *
     * @param array $data Array containing post data with keys: content, feeling, activity, media
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            content: $data['content'],
            feeling: $data['feeling'] ?? null,
            activity: $data['activity'] ?? null,
            media: $data['media'] ?? []
        );
    }
}
