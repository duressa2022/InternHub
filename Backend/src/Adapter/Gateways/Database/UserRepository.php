<?php
namespace Src\Adapter\Gateways\Database;

use Src\Domain\Entity\User;
use Src\Domain\Interface\UserInterface;
use PDO;

class UserRepository implements UserInterface{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

public function createUser(User $user): ?User
{
    // Check if email exists
    $checkStmt = $this->db->prepare("SELECT id FROM users WHERE email = :email");
    $checkStmt->bindParam(':email', $user->email);
    $checkStmt->execute();
    
    if ($checkStmt->fetch()) {
        throw new Exception("User already exists with this email.");
    }

    // Prepare JSON data first
    $socialLinksJson = json_encode($user->social_links ?: []);
    $createdAt = $user->created_at ?? date('Y-m-d H:i:s');
    $updatedAt = $user->updated_at ?? date('Y-m-d H:i:s');

    $stmt = $this->db->prepare("
        INSERT INTO users (
            first_name, last_name, email, password, role, created_at, updated_at
        ) VALUES (
            :first_name, :last_name, :email, :password, :role, :created_at, :updated_at
        )
    ");

    // Bind all parameters
    $stmt->bindParam(':first_name', $user->first_name);
    $stmt->bindParam(':last_name', $user->last_name);
    $stmt->bindParam(':email', $user->email);
    $stmt->bindParam(':password', $user->password);
    $stmt->bindParam(':role', $user->role);
    $stmt->bindParam(':created_at', $createdAt);
    $stmt->bindParam(':updated_at', $updatedAt);

    if (!$stmt->execute()) {
        throw new Exception("Failed to create user");
    }

    $userId = $this->db->lastInsertId();

    // Return the created user
    $getUserStmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
    $getUserStmt->bindParam(':id', $userId);
    $getUserStmt->execute();
    
    if ($userData = $getUserStmt->fetch(PDO::FETCH_ASSOC)) {
        return new User(
            $userData['first_name'],
            $userData['last_name'],
            $userData['email'],
            '', // Don't return password
            $userData['field'],
            $userData['role'],
            $userData['avatar_url'],
            $userData['gender'],
            $userData['phone_number'],
            $userData['address'],
            $userData['city'],
            $userData['state'],
            $userData['country'],
            $userData['postal_code'],
            $userData['date_of_birth'],
            $userData['website'],
            json_decode($userData['social_links'], true) ?: [],
            $userData['created_at'],
            $userData['updated_at'],
            $userData['id']
        );
    }

    throw new Exception("User creation failed");
}

    public function getUserById(int $id): ?User
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($userData) {
            return new User(
                $userData['first_name'],
                $userData['last_name'],
                $userData['email'],
                "", 
                $userData['field'] ?? null,
                $userData['role'],
                $userData['avater_url'] ?? null,
                $userData['gender'] ?? null,
                $userData['phone_number'] ?? null,
                $userData['address'] ?? null,
                $userData['city'] ?? null,
                $userData['state'] ?? null,
                $userData['country'] ?? null,
                $userData['postal_code'] ?? null,
                $userData['date_of_birth'] ?? null,
                $userData['website'] ?? null,
                $userData['social_links'] ?? null,
                $userData['created_at'],
                $userData['updated_at'],
                $userData['id']
            );
        }
    return null;
    }

    public function isUserExist(string $email): bool
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return (bool)$stmt->fetchColumn();
    }

    public function getUserByEmail(string $email): ?User
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($userData) {
            $user= new User(
                $userData['first_name'],
                $userData['last_name'],
                $userData['email'],
                $userData['password'], 
                $userData['field'] ?? null,
                $userData['role'],
                $userData['avater_url'] ?? null,
                $userData['gender'] ?? null,
                $userData['phone_number'] ?? null,
                $userData['address'] ?? null,
                $userData['city'] ?? null,
                $userData['state'] ?? null,
                $userData['country'] ?? null,
                $userData['postal_code'] ?? null,
                $userData['date_of_birth'] ?? null,
                $userData['website'] ?? null,
                $userData['social_links'] ?? null,
                $userData['created_at'],
                $userData['updated_at'],
                $userData['id']
            );
            unset($user->password);
            return $user;
        }
    return null;
    }   

    public function getUserByEmailForPassword(string $email): ?User
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($userData) {
            return new User(
                $userData['first_name'],
                $userData['last_name'],
                $userData['email'],
                $userData['password'], 
                $userData['field'] ?? null,
                $userData['role'],
                $userData['avater_url'] ?? null,
                $userData['gender'] ?? null,
                $userData['phone_number'] ?? null,
                $userData['address'] ?? null,
                $userData['city'] ?? null,
                $userData['state'] ?? null,
                $userData['country'] ?? null,
                $userData['postal_code'] ?? null,
                $userData['date_of_birth'] ?? null,
                $userData['website'] ?? null,
                $userData['social_links'] ?? null,
                $userData['created_at'],
                $userData['updated_at'],
                $userData['id']
            );
        }
    return null;
    } 

    public function updateUser(int $id, array $data): ?User
    {
        $fields = [];
        $params = [':id' => $id];
    
        foreach ($data as $key => $value) {
            if ($value !== null && $key !== 'id') {
                $fields[] = "$key = :$key";
                $params[":$key"] = $value;
            }
        }
        $fields[] = "updated_at = :updated_at";
        $params[':updated_at'] = date('Y-m-d H:i:s');
    
        if (empty($fields)) {
            return null;
        }
    
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        
        if ($stmt->execute($params)) {
            $stmt = $this->db->prepare("SELECT id, first_name, last_name, email, field, avater_url, gender, phone_number, address, city, state, country, postal_code, date_of_birth, website, social_links, role, created_at, updated_at FROM users WHERE id = :id");
            $stmt->execute([':id' => $id]);
            $userData = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($userData) {
                $user= new User(
                    $userData['first_name'],
                    $userData['last_name'],
                    $userData['email'],
                    $userData['password'], 
                    $userData['field'] ?? null,
                    $userData['role'],
                    $userData['avater_url'] ?? null,
                    $userData['gender'] ?? null,
                    $userData['phone_number'] ?? null,
                    $userData['address'] ?? null,
                    $userData['city'] ?? null,
                    $userData['state'] ?? null,
                    $userData['country'] ?? null,
                    $userData['postal_code'] ?? null,
                    $userData['date_of_birth'] ?? null,
                    $userData['website'] ?? null,
                    $userData['social_links'] ?? null,
                    $userData['created_at'],
                    $userData['updated_at'],
                    $userData['id']
                );
                unset($user->password);
                return $user;
            }
        }
    
        return null;
    }
    


    public function deleteUser(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
    public function deleteUserByEmail(string $email): bool
    {
        $stmt = $this->db->prepare("DELETE FROM users WHERE email = :email");
        return $stmt->execute([':email' => $email]);
    }


   public function getAllUsers(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;

        $stmt = $this->db->prepare("
            SELECT id, first_name, last_name, email, role, field, avater_url, gender,
                phone_number, address, city, state, country, postal_code,
                date_of_birth, website, social_links, created_at, updated_at
            FROM users
            LIMIT :limit OFFSET :offset
        ");

        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function changePassword(string $email, string $password): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET password = :password WHERE email = :email");
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        return $stmt->execute();
    }


}

?>