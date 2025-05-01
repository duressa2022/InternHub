<?php

namespace Src\Domain\Entity;

class Application
{
    public function __construct(
        public int $company_id,
        public int $user_id,
        public int $internship_id,
        public string $status,
        public string $resume_url,
        public ?string $cover_letter = null,
        public ?string $additional_documents = null,
        public ?string $submission_date = null,
        public string $created_at,
        public string $updated_at,
        public ?int $id = null
    ) {}
}