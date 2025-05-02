<?php

namespace Src\Domain\Entity;

class Company
{
    public function __construct(
        public string $name,
        public string $category,
        public string $logoUrl,
        public string $location,
        public string $about,
        public ?int $currentNumberOfInternships=NULL,
        public ?float $rating = null,
        public string $created_at,
        public string $updated_at,
        public ?int $id = null
    ) {}
}