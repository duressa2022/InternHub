<?php

namespace Src\Domain\Interface;

use Src\Domain\Entity\Company;

interface CompanyInterface {
    public function createCompany(Company $company): ?Company;
    public function getCompanyById(int $id): ?Company;
    public function updateCompany(int $id, array $data): ?Company;
    public function deleteCompany(int $id): bool;
    public function getAllCompanies(int $page, int $limit): array;
    public function getCompanyByName(string $name, int $page, int $limit): array;
    public function getCompaniesByCategory(string $category, int $page, int $limit): array;
    public function getCompaniesByLocation(string $location, int $page, int $limit): array;
    public function getCompaniesByRating(float $rating, int $page, int $limit): array;
    public function searchCompanies(array $query, int $page, int $limit): array;
    public function getCompanyInternships(int $companyId, int $page, int $limit): array;
}