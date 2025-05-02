<?php

namespace Src\Domain\Interface;

use Src\Domain\Entity\Review;

interface ReviewInterface {
    public function createReview(Review $review): ?Review;
    public function getReviewById(int $id): ?Review;
    public function updateReview(int $id, array $data): ?Review;
    public function deleteReview(int $id): bool;
    public function getAllReviews(int $page, int $limit): array;
    public function getReviewsByCompany(string $company): array;
    public function getReviewsByRating(float $rating): array;
    public function deleteReviewByCompany(string $company): bool;
}