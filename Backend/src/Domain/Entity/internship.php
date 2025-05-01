<?php

namespace Src\Domain\Entity;

class Internship
{
    public function __construct(
        public string $title,
        public string $company,
        public string $location,
        public string $type,
        public string $category,
        public string $salaryRange, 
        public string $startDate,  
        public string $endDate,     
        public string $description,
        public string $requirements,
        public string $benefits,
        public string $deadline,    
        public string $link,
        public string $created_at, 
        public string $updated_at,
        public ?int $id=null,

    ) {}
}
