<?php

namespace Src\Usecase;

use Src\Domain\Entity\Review;
use Src\Domain\Interface\ReviewInterface;

class ReviewUsecase
{
    private ReviewInterface $reviewRepository;

    public function __construct(ReviewInterface $reviewRepository)
    {
        $this->reviewRepository = $reviewRepository;
    }

    public function createReview(Review $review): ?Review
    {
        if ($review->rating !== null && ($review->rating < 0 || $review->rating > 5)) {
            throw new \InvalidArgumentException('Rating must be between 0 and 5');
        }
        return $this->reviewRepository->createReview($review);
    }

    public function getReviewById(int $id): ?Review
    {
        return $this->reviewRepository->getReviewById($id);
    }

    public function updateReview(int $id, array $data): ?Review
    {
        if (isset($data['profile_url']) && !filter_var($data['profile_url'], FILTER_VALIDATE_URL)) {
            throw new \InvalidArgumentException('Invalid profile URL');
        }
        if (isset($data['rating']) && ($data['rating'] < 0 || $data['rating'] > 5)) {
            throw new \InvalidArgumentException('Rating must be between 0 and 5');
        }
        return $this->reviewRepository->updateReview($id, $data);
    }

    public function deleteReview(int $id): bool
    {
        return $this->reviewRepository->deleteReview($id);
    }

    public function getAllReviews(int $page, int $limit): array
    {
        return $this->reviewRepository->getAllReviews($page, $limit);
    }

    public function getReviewsByCompany(string $company): array
    {
        return $this->reviewRepository->getReviewsByCompany($company);
    }

    public function getReviewsByRating(float $rating): array
    {
        if ($rating < 0 || $rating > 5) {
            throw new \InvalidArgumentException('Rating must be between 0 and 5');
        }
        return $this->reviewRepository->getReviewsByRating($rating);
    }

    public function deleteReviewByCompany(string $company): bool
    {
        return $this->reviewRepository->deleteReviewByCompany($company);
    }
}