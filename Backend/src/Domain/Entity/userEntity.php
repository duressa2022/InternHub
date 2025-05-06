<?php

namespace Src\Domain\Entity;
class User{
    public function __construct(
        public string $first_name,
        public string $last_name,
        public string $email,
        public string $password,
        public ?string $field=null,
        public string $role,
        public ?string $avater_url=null,
        public ?string $gender=null,
        public ?string $phone_number=null,
        public ?string $address=null,
        public ?string $city=null,
        public ?string $state=null,
        public ?string $country=null,
        public ?string $postal_code=null,
        public ?string $date_of_birth=null,
        public ?string $website=null,
        public ?array  $social_links=null,
        public string $created_at,
        public string $updated_at,
        public ?int $id=null,
    ) {}

}
?>