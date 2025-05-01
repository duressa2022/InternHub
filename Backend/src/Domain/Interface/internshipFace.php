<?php
namespace Src\Domain\Interface;

use Src\Domain\Entity\Internship;

interface InternshipInterface {
    public function createInternship(Internship $internship): ?Internship;
    public function getInternshipById(int $id): ?Internship;
    public function updateInternship(int $id, array $data): ?Internship;
    public function deleteInternship(int $id): bool;
    public function getAllInternships(int $page, int $limit): array;
    public function getInternshipByTitle(string $title, int $page, int $limit): array;
    public function getInternshipsByCompany(string $company, int $page, int $limit): array;
    public function getInternshipsByLocation(string $location, int $page, int $limit): array;
    public function getInternshipsByType(string $type, int $page, int $limit): array;
    public function getInternshipsByCategory(string $category, int $page, int $limit): array;
    public function searchInternships(array $query, int $page, int $limit): array;
    public function applyToInternship(int $internshipId, int $userId): bool;
    public function getInternshipApplications(int $internshipId): array; 
    public function getInternshipByCompanyId(int $companyId, int $page, int $limit): array;
}