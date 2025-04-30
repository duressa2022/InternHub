<?php
namespace Src\Usecase;
use Src\Domain\Entity\User;
use Src\Domain\Interface\UserInterface;

class UserUsecase{
    private UserInterface $userRepository;

    public function __construct(UserInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function createUser(User $user): ?User
    {
        if ($this->userRepository->isUserExist($user->email)) {
            return null; 
        }
        return $this->userRepository->createUser($user);
    }

    public function getUserById(int $id): ?User
    {
        return $this->userRepository->getUserById($id);
    }

    public function updateUser(int $id ,array $data): ?User
    {
        return $this->userRepository->updateUser($id,$data);
    }

    public function deleteUser(int $id): bool
    {
        return $this->userRepository->deleteUser($id);
    }

    public function getAllUsers(int $page, int $limit): array
    {
        return $this->userRepository->getAllUsers($page, $limit);
    }

    public function getUserByEmail(string $email): ?User
    {
        return $this->userRepository->getUserByEmail($email);
    }

    public function deleteUserByEmail(string $email): bool
    {
        return $this->userRepository->deleteUserByEmail($email);
    }
    public function login(array $data): ?User
    {
        $user = $this->userRepository->getUserByEmailForPassword($data['email']);
        if ($user && password_verify($data["password"], $user->password)) {
            unset($user->password);
            return $user;
        }
        return null; 
    }
    public function changePassword(array $data): bool
    {
        return $this->userRepository->changePassword($data["email"], $data["password"]);
    }
}
?>
