<?php

namespace Src\Usecase;

use Src\Domain\Entity\Company;
use Src\Domain\Interface\CompanyInterface;

class CompanyUsecase {
    private CompanyInterface $companyRepository;

    public function __construct(CompanyInterface $companyRepository)
    {
        $this->companyRepository = $companyRepository;
    }

    public function createCompany(Company $company): ?Company
    {
        return $this->companyRepository->createCompany($company);
    }

    public function getCompanyById(int $id): ?Company
    {
        return $this->companyRepository->getCompanyById($id);
    }

    public function updateCompany(int $id, array $data): ?Company
    {
        return $this->companyRepository->updateCompany($id, $data);
    }

    public function deleteCompany(int $id): bool
    {
        return $this->companyRepository->deleteCompany($id);
    }

    public function getAllCompanies(int $page, int $limit): array
    {
        return $this->companyRepository->getAllCompanies($page, $limit);
    }

    public function getCompanyByName(string $name, int $page, int $limit): array
    {
        return $this->companyRepository->getCompanyByName($name, $page, $limit);
    }

    public function getCompaniesByCategory(string $category, int $page, int $limit): array
    {
        return $this->companyRepository->getCompaniesByCategory($category, $page, $limit);
    }

    public function getCompaniesByLocation(string $location, int $page, int $limit): array
    {
        return $this->companyRepository->getCompaniesByLocation($location, $page, $limit);
    }

    public function getCompaniesByRating(float $rating, int $page, int $limit): array
    {
        return $this->companyRepository->getCompaniesByRating($rating, $page, $limit);
    }

    public function searchCompanies(array $query, int $page, int $limit): array
    {
        return $this->companyRepository->searchCompanies($query, $page, $limit);
    }

    public function getCompanyInternships(int $companyId, int $page, int $limit): array
    {
        return $this->companyRepository->getCompanyInternships($companyId, $page, $limit);
    }
}