<?php

namespace Src\Adapter\Controllers;

use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\ReviewUsecase;
use Src\Domain\Entity\Review;

class ReviewController
{
    private ReviewUsecase $reviewUsecase;
    private JsonPresenter $jsonPresenter;

    public function __construct(ReviewUsecase $reviewUsecase, JsonPresenter $jsonPresenter)
    {
        $this->reviewUsecase = $reviewUsecase;
        $this->jsonPresenter = $jsonPresenter;
    }

    public function createReview(array $request): void
    {
        try {
            $review = new Review(
                $request['profile_url'],
                $request['full_name'],
                $request['occupation'],
                $request['company'],
                $request['posts'],
                $request['rating'] ?? null,
                date('Y-m-d H:i:s'),
                date('Y-m-d H:i:s')
            );
            $createdReview = $this->reviewUsecase->createReview($review);
            if ($createdReview) {
                $this->jsonPresenter->respond_without(201, ['message' => 'Review created successfully', 'data' => (array)$createdReview]);
            } else {
                $this->jsonPresenter->respond_without(409, ['message' => 'Review with this profile URL already exists']);
            }
        } catch (\InvalidArgumentException $e) {
            $this->jsonPresenter->respond_without(400, ['message' => $e->getMessage()]);
        }
    }

    public function getReviewById(int $id): void
    {
        $review = $this->reviewUsecase->getReviewById($id);
        if ($review) {
            $this->jsonPresenter->respond_without(200, ['data' => (array)$review]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Review not found']);
        }
    }

    public function updateReview(int $id, array $data): void
    {
        try {
            $updatedReview = $this->reviewUsecase->updateReview($id, $data);
            if ($updatedReview) {
                $this->jsonPresenter->respond_without(200, ['message' => 'Review updated successfully', 'data' => (array)$updatedReview]);
            } else {
                $this->jsonPresenter->respond_without(400, ['message' => 'Failed to update review']);
            }
        } catch (\InvalidArgumentException $e) {
            $this->jsonPresenter->respond_without(400, ['message' => $e->getMessage()]);
        }
    }

    public function deleteReview(int $id): void
    {
        if ($this->reviewUsecase->deleteReview($id)) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Review deleted successfully']);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to delete review']);
        }
    }

    public function getAllReviews(int $page, int $limit): void
    {
        $reviews = $this->reviewUsecase->getAllReviews($page, $limit);
        if ($reviews) {
            $this->jsonPresenter->respond_without(200, ['data' => array_map('get_object_vars', $reviews)]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No reviews found']);
        }
    }

    public function getReviewsByCompany(string $company): void
    {
        $reviews = $this->reviewUsecase->getReviewsByCompany($company);
        if ($reviews) {
            $this->jsonPresenter->respond_without(200, ['data' => array_map('get_object_vars', $reviews)]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No reviews found']);
        }
    }

    public function getReviewsByRating(float $rating): void
    {
        try {
            $reviews = $this->reviewUsecase->getReviewsByRating($rating);
            if ($reviews) {
                $this->jsonPresenter->respond_without(200, ['data' => array_map('get_object_vars', $reviews)]);
            } else {
                $this->jsonPresenter->respond_without(404, ['message' => 'No reviews found']);
            }
        } catch (\InvalidArgumentException $e) {
            $this->jsonPresenter->respond_without(400, ['message' => $e->getMessage()]);
        }
    }

    public function deleteReviewByCompany(string $company): void
    {
        if ($this->reviewUsecase->deleteReviewByCompany($company)) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Reviews deleted successfully']);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to delete reviews']);
        }
    }
}