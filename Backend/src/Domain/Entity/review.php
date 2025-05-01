<?php

namespace Src\Domain\Entity;

class Review
{
    public function __construct(
        public string $profile_url,
        public string $full_name,
        public string $occupation,
        public string $company,
        public string $posts,
        public ?float $rating = null,
        public string $created_at,
        public string $updated_at,
        public ?int $id = null
    ) {}
}