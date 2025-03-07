<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'path',
        'type',
    ];

    /**
     * Get the post that owns the media.
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
