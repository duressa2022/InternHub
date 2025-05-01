<?php

namespace Src\Domain\Interface;

use Src\Domain\Entity\Application;

interface ApplicationInterface {
    public function createApplication(Application $application): ?Application;
    public function getApplicationById(int $id): ?Application;
    public function updateApplication(int $id, array $data): ?Application;
    public function deleteApplication(int $id): bool;
    public function getAllApplications(int $page, int $limit): array;
    public function getApplicationsByUserId(int $user_id, int $page, int $limit): array;
    public function getApplicationsByCompanyId(int $company_id, int $page, int $limit): array;
    public function getApplicationsByInternshipId(int $internship_id, int $page, int $limit): array;
    public function getApplicationsByStatus(string $status, int $page, int $limit): array;
    public function getApplicationStatsByUserId(int $user_id): array;
    public function getApplicationsInformation(int $user_id, int $page, int $limit): array;
}