<?php

namespace Src\Adapter\Gateways\Database;

use PDO;
use Src\Domain\Entity\Review;
use Src\Domain\Interface\ReviewInterface;

class ReviewRepository implements ReviewInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function createReview(Review $review): ?Review
    {
        $stmt = $this->db->prepare("
            INSERT INTO reviews (profile_url, full_name, occupation, company, posts, rating, created_at, updated_at)
            VALUES (:profile_url, :full_name, :occupation, :company, :posts, :rating, :created_at, :updated_at)
        ");
        $stmt->bindParam(':profile_url', $review->profile_url);
        $stmt->bindParam(':full_name', $review->full_name);
        $stmt->bindParam(':occupation', $review->occupation);
        $stmt->bindParam(':company', $review->company);
        $stmt->bindParam(':posts', $review->posts);
        $stmt->bindParam(':rating', $review->rating, PDO::PARAM_STR);
        $stmt->bindParam(':created_at', $review->created_at);
        $stmt->bindParam(':updated_at', $review->updated_at);
        if ($stmt->execute()) {
            $id = $this->db->lastInsertId();
            return $this->getReviewById($id);
        }
        return null;
    }

    public function getReviewById(int $id): ?Review
    {
        $stmt = $this->db->prepare("SELECT * FROM reviews WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $reviewData = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($reviewData) {
            return new Review(
                $reviewData['profile_url'],
                $reviewData['full_name'],
                $reviewData['occupation'],
                $reviewData['company'],
                $reviewData['posts'],
                $reviewData['rating'] !== null ? (float)$reviewData['rating'] : null,
                $reviewData['created_at'],
                $reviewData['updated_at'],
                $reviewData['id']
            );
        }
        return null;
    }

    public function isReviewExist(string $profile_url): bool
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM reviews WHERE profile_url = :profile_url");
        $stmt->bindParam(':profile_url', $profile_url);
        $stmt->execute();
        return (bool)$stmt->fetchColumn();
    }

    public function updateReview(int $id, array $data): ?Review
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

        $sql = "UPDATE reviews SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        if ($stmt->execute($params)) {
            return $this->getReviewById($id);
        }
        return null;
    }

    public function deleteReview(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM reviews WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getAllReviews(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM reviews LIMIT :limit OFFSET :offset");
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $reviews = [];
        while ($reviewData = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $reviews[] = new Review(
                $reviewData['profile_url'],
                $reviewData['full_name'],
                $reviewData['occupation'],
                $reviewData['company'],
                $reviewData['posts'],
                $reviewData['rating'] !== null ? (float)$reviewData['rating'] : null,
                $reviewData['created_at'],
                $reviewData['updated_at'],
                $reviewData['id']
            );
        }
        return $reviews;
    }

    public function getReviewsByCompany(string $company): array
    {
        $stmt = $this->db->prepare("SELECT * FROM reviews WHERE company = :company");
        $stmt->bindParam(':company', $company);
        $stmt->execute();
        $reviews = [];
        while ($reviewData = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $reviews[] = new Review(
                $reviewData['profile_url'],
                $reviewData['full_name'],
                $reviewData['occupation'],
                $reviewData['company'],
                $reviewData['posts'],
                $reviewData['rating'] !== null ? (float)$reviewData['rating'] : null,
                $reviewData['created_at'],
                $reviewData['updated_at'],
                $reviewData['id']
            );
        }
        return $reviews;
    }

    public function getReviewsByRating(float $rating): array
    {
        $stmt = $this->db->prepare("SELECT * FROM reviews WHERE rating = :rating");
        $stmt->bindParam(':rating', $rating, PDO::PARAM_STR);
        $stmt->execute();
        $reviews = [];
        while ($reviewData = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $reviews[] = new Review(
                $reviewData['profile_url'],
                $reviewData['full_name'],
                $reviewData['occupation'],
                $reviewData['company'],
                $reviewData['posts'],
                $reviewData['rating'] !== null ? (float)$reviewData['rating'] : null,
                $reviewData['created_at'],
                $reviewData['updated_at'],
                $reviewData['id']
            );
        }
        return $reviews;
    }

    public function deleteReviewByCompany(string $company): bool
    {
        $stmt = $this->db->prepare("DELETE FROM reviews WHERE company = :company");
        return $stmt->execute([':company' => $company]);
    }
}