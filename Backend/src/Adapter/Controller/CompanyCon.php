<?php

namespace Src\Adapter\Controllers;

use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\CompanyUsecase;
use Src\Domain\Entity\Company;

class CompanyController {
    private CompanyUsecase $companyUsecase;
    private JsonPresenter $jsonPresenter;

    public function __construct(CompanyUsecase $companyUsecase, JsonPresenter $jsonPresenter)
    {
        $this->companyUsecase = $companyUsecase;
        $this->jsonPresenter = $jsonPresenter;
    }

    public function createCompany(array $request): void
    {
        $company = new Company(
            name: $request['name'],
            category: $request['category'],
            logoUrl: $request['logoUrl'],
            location: $request['location'],
            about: $request['about'],
            currentNumberOfInternships: (int)$request['currentNumberOfInternships'],
            rating: isset($request['rating']) ? (float)$request['rating'] : null,
            created_at: date('Y-m-d H:i:s'),
            updated_at: date('Y-m-d H:i:s')
        );

        $createdCompany = $this->companyUsecase->createCompany($company);
        if ($createdCompany) {
            $this->jsonPresenter->respond_without(201, ['message' => 'Company created successfully', 'data' => $createdCompany]);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to create company']);
        }
    }

    public function getCompanyById(int $id): void
    {
        $company = $this->companyUsecase->getCompanyById($id);
        if ($company) {
            $this->jsonPresenter->respond_without(200, ['data' => $company]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Company not found']);
        }
    }

    public function updateCompany(int $id, array $data): void
    {
        $updated = $this->companyUsecase->updateCompany($id, $data);
        if ($updated) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Company updated successfully', 'data' => $updated]);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to update company']);
        }
    }

    public function deleteCompany(int $id): void
    {
        if ($this->companyUsecase->deleteCompany($id)) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Company deleted successfully']);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to delete company']);
        }
    }

    public function getAllCompanies(int $page, int $limit): void
    {
        $companies = $this->companyUsecase->getAllCompanies($page, $limit);
        if ($companies) {
            $this->jsonPresenter->respond_without(200, ['data' => $companies]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No companies found']);
        }
    }

    public function getCompanyByName(string $name, int $page, int $limit): void
    {
        $companies = $this->companyUsecase->getCompanyByName($name, $page, $limit);
        if ($companies) {
            $this->jsonPresenter->respond_without(200, ['data' => $companies]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No companies found']);
        }
    }

    public function getCompaniesByCategory(string $category, int $page, int $limit): void
    {
        $companies = $this->companyUsecase->getCompaniesByCategory($category, $page, $limit);
        if ($companies) {
            $this->jsonPresenter->respond_without(200, ['data' => $companies]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No companies found']);
        }
    }

    public function getCompaniesByLocation(string $location, int $page, int $limit): void
    {
        $companies = $this->companyUsecase->getCompaniesByLocation($location, $page, $limit);
        if ($companies) {
            $this->jsonPresenter->respond_without(200, ['data' => $companies]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No companies found']);
        }
    }

    public function getCompaniesByRating(float $rating, int $page, int $limit): void
    {
        $companies = $this->companyUsecase->getCompaniesByRating($rating, $page, $limit);
        if ($companies) {
            $this->jsonPresenter->respond_without(200, ['data' => $companies]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No companies found']);
        }
    }

    public function searchCompanies(array $query, int $page, int $limit): void
    {
        $companies = $this->companyUsecase->searchCompanies($query, $page, $limit);
        if ($companies) {
            $this->jsonPresenter->respond_without(200, ['data' => $companies]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No companies found']);
        }
    }

    public function getCompanyInternships(int $companyId, int $page, int $limit): void
    {
        $internships = $this->companyUsecase->getCompanyInternships($companyId, $page, $limit);
        if ($internships) {
            $this->jsonPresenter->respond_without(200, ['data' => $internships]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No internships found for this company']);
        }
    }
}