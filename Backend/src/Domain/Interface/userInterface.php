<?php
namespace Src\Domain\Interface;

use Src\Domain\Entity\User;

interface UserInterface {
    public function createUser(User $user): ?User;
    public function getUserById(int $id): ?User;
    public function updateUser(int $id,array $data): ?User;
    public function deleteUser(int $id): bool;
    public function getAllUsers(int $page, int $limit): array;
    public function getUserByEmail(string $email): ?User;
    public function getUserByEmailForPassword(string $email): ?User;
    public function deleteUserByEmail(string $email): bool;
}
?>