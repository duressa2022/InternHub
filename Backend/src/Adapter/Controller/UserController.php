<?php 
namespace Src\Adapter\Controllers;
use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\UserUsecase;
use Src\Domain\Entity\User;
use Src\Domain\Interface\UserInterface;

class UserController{
    private UserUsecase $userUsecase;
    private JsonPresenter $jsonPresenter;

    public function __construct(UserUsecase $userUsecase, JsonPresenter $jsonPresenter)
    {
        $this->userUsecase = $userUsecase;
        $this->jsonPresenter = $jsonPresenter;
    }

    public function createUser(array $request): void
    {
        $user = new User(
            $request['first_name'],
            $request['last_name'],
            $request['email'],
            password_hash($request['password'], PASSWORD_BCRYPT),
            $request['feild'] ?? null,
            $request['role'],
            $request['avater_url'] ?? null,
            $request['gender'] ?? null,
            $request['phone_number'] ?? null,
            $request['address'] ?? null,
            $request['city'] ?? null,
            $request['state'] ?? null,
            $request['country'] ?? null,
            $request['postal_code'] ?? null,
            $request['date_of_birth'] ?? null,
            $request['website'] ?? null,
            $request['social_links'] ?? null,
            date('Y-m-d H:i:s'),
            date('Y-m-d H:i:s')
        );
        $createdUser = $this->userUsecase->createUser($user);
        if ($createdUser) {
            $this->jsonPresenter->respond_without(201, ['message' => 'User created successfully', 'data' => $createdUser]);
        } else if ($createdUser === null) {
            $this->jsonPresenter->respond_without(409, ['message' => 'User already exists']);
        }else{
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to create user']);
        }
    }

    public function getUserById(int $id): void
    {
        $user = $this->userUsecase->getUserById($id);
        if ($user) {
            $this->jsonPresenter->respond_without(200, ['data' => $user]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'User not found']);
        }
    }

    public function updateUser(int $id, array $data): void
    {
            
        $updated=$this->userUsecase->updateUser($id,$data);
        if ($updated){
            $this->jsonPresenter->respond_without(200, ['message' => 'User updated successfully','data' => $updated]);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to update user']);
        }
    }

    public function deleteUser(int $id): void
    {
        if ($this->userUsecase->deleteUser($id)) {
            $this->jsonPresenter->respond_without(200, ['message' => 'User deleted successfully']);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to delete user']);
        }
    }

    public function getAllUsers(int $page, int $limit): void{
        $users = $this->userUsecase->getAllUsers($page, $limit);
        if ($users) {
            $this->jsonPresenter->respond_without(200, ['data' => $users]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No users found']);
        }
    }

    public function getUserByEmail(string $email): void
    {
        $user = $this->userUsecase->getUserByEmail($email);
        if ($user) {
            $this->jsonPresenter->respond_without(200, ['data' => $user]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'User not found']);
        }
    }

    
    public function deleteUserByEmail(string $email): void
    {
        if ($this->userUsecase->deleteUserByEmail($email)) {
            $this->jsonPresenter->respond_without(200, ['message' => 'User deleted successfully']);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to delete user']);
        }
    }
    public function login(array $data): void
    {
        $user = $this->userUsecase->login($data);
        if ($user) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Login successful', 'data' => $user]);
        } else {
            $this->jsonPresenter->respond_without(401, ['message' => 'Invalid email or password']);
        }

    }

}