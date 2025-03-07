<?php

namespace App\DTOs;

class PostDTO
{
    public function __construct(
        public readonly string $content,
        public readonly ?string $feeling = null,
        public readonly ?string $activity = null,
        public readonly array $media = []
    ) {}

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
