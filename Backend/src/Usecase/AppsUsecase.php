<?php

namespace Src\Usecase;

use Src\Domain\Entity\Application;
use Src\Domain\Interface\ApplicationInterface;

class ApplicationUsecase
{
    private ApplicationInterface $applicationRepository;

    public function __construct(ApplicationInterface $applicationRepository)
    {
        $this->applicationRepository = $applicationRepository;
    }

    public function createApplication(Application $application): ?Application
    {
        return $this->applicationRepository->createApplication($application);
    }

    public function getApplicationById(int $id): ?Application
    {
        return $this->applicationRepository->getApplicationById($id);
    }

    public function updateApplication(int $id, array $data): ?Application
    {
        return $this->applicationRepository->updateApplication($id, $data);
    }

    public function deleteApplication(int $id): bool
    {
        return $this->applicationRepository->deleteApplication($id);
    }

    public function getAllApplications(int $page, int $limit): array
    {
        return $this->applicationRepository->getAllApplications($page, $limit);
    }

    public function getApplicationsByUserId(int $user_id, int $page, int $limit): array
    {
        return $this->applicationRepository->getApplicationsByUserId($user_id, $page, $limit);
    }

    public function getApplicationsByCompanyId(int $company_id, int $page, int $limit): array
    {
        return $this->applicationRepository->getApplicationsByCompanyId($company_id, $page, $limit);
    }

    public function getApplicationsByInternshipId(int $internship_id, int $page, int $limit): array
    {
        return $this->applicationRepository->getApplicationsByInternshipId($internship_id, $page, $limit);
    }

    public function getApplicationsByStatus(string $status, int $page, int $limit): array
    {
        return $this->applicationRepository->getApplicationsByStatus($status, $page, $limit);
    }

    public function getApplicationStatsByUserId(int $user_id): array
    {
        return $this->applicationRepository->getApplicationStatsByUserId($user_id);
    }

    public function getApplicationsInformation(int $user_id, int $page, int $limit): array
    {
        return $this->applicationRepository->getApplicationsInformation($user_id, $page, $limit);
    }
}