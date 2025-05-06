<?php 
namespace Src\Adapter\Controllers;

use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\InternshipUsecase;
use Src\Domain\Entity\Internship;

class InternshipController {
    private InternshipUsecase $internshipUsecase;
    private JsonPresenter $jsonPresenter;

    public function __construct(InternshipUsecase $internshipUsecase, JsonPresenter $jsonPresenter)
    {
        $this->internshipUsecase = $internshipUsecase;
        $this->jsonPresenter = $jsonPresenter;
    }

    public function createInternship(array $request): void
    {
        $internship = new Internship(
            company_id: (int)$request['company_id'],
            title: $request['title'],
            company: $request['company'],
            location: $request['location'],
            type: $request['type'],
            category: $request['category'],
            salaryRange: $request['salary_range'],
            startDate: $request['start_date'],
            endDate: $request['end_date'],
            requirements: $request['requirements'],
            description: $request['description'],
            benefits: $request['benefits'] ?? null,
            deadline: $request['deadline'],
            link: $request['link'],
            created_at:date('Y-m-d H:i:s'),
            updated_at:date('Y-m-d H:i:s')
        );

        echo $request;
        $createdInternship = $this->internshipUsecase->createInternship($internship);
        echo $createdInternship;
        if ($createdInternship) {
            $this->jsonPresenter->respond_without(201, ['message' => 'Internship created successfully', 'data' => $createdInternship]);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to create internship']);
        }
    }

    public function getInternshipById(int $id): void
    {
        $internship = $this->internshipUsecase->getInternshipById($id);
        if ($internship) {
            $this->jsonPresenter->respond_without(200, ['data' => $internship]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Internship not found']);
        }
    }

    public function updateInternship(int $id, array $data): void
    {
        $updated = $this->internshipUsecase->updateInternship($id, $data);
        if ($updated) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Internship updated successfully', 'data' => $updated]);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to update internship']);
        }
    }

    public function deleteInternship(int $id): void
    {
        if ($this->internshipUsecase->deleteInternship($id)) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Internship deleted successfully']);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to delete internship']);
        }
    }

    public function getAllInternships(int $page, int $limit): void
    {
        $internships = $this->internshipUsecase->getAllInternships($page, $limit);
        if ($internships) {
            $this->jsonPresenter->respond_without(200, ['data' => $internships]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No internships found']);
        }
    }

    public function searchInternships(array $query, int $page, int $limit): void
    {
        $internships = $this->internshipUsecase->searchInternships($query, $page, $limit);
        if ($internships) {
            $this->jsonPresenter->respond_without(200, ['data' => $internships]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No matching internships found']);
        }
    }

    public function applyToInternship(int $internshipId, int $userId): void
    {
        if ($this->internshipUsecase->applyToInternship($internshipId, $userId)) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Successfully applied to internship']);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to apply to internship']);
        }
    }

    public function getInternshipApplications(int $internshipId): void
    {
        $applications = $this->internshipUsecase->getInternshipApplications($internshipId);
        if ($applications) {
            $this->jsonPresenter->respond_without(200, ['data' => $applications]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No applications found for this internship']);
        }
    }
    public function getInternshipByTitle(string $title,int $page, int $limit): void
    {
        $internship = $this->internshipUsecase->getInternshipByTitle($title,$page, $limit);
        if ($internship) {
            $this->jsonPresenter->respond_without(200, ['data' => $internship]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Internship not found']);
        }
    }
    public function getInternshipByCompany(string $company,int $page, int $limit): void
    {
        $internship = $this->internshipUsecase->getInternshipsByCompany($company,$page, $limit);
        if ($internship) {
            $this->jsonPresenter->respond_without(200, ['data' => $internship]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Internship not found']);
        }
    }
    public function getInternshipByLocation(string $location,int $page, int $limit): void
    {
        $internship = $this->internshipUsecase->getInternshipsByLocation($location,$page, $limit);
        if ($internship) {
            $this->jsonPresenter->respond_without(200, ['data' => $internship]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Internship not found']);
        }
    }
    public function getInternshipByCategory(string $category,int $page, int $limit): void
    {
        $internship = $this->internshipUsecase->getInternshipsByCategory($category,$page, $limit);
        if ($internship) {
            $this->jsonPresenter->respond_without(200, ['data' => $internship]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Internship not found']);
        }
    }
    public function getInternshipByType(string $type,int $page, int $limit): void
    {
        $internship = $this->internshipUsecase->getInternshipsByType($type,$page, $limit);
        if ($internship) {
            $this->jsonPresenter->respond_without(200, ['data' => $internship]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Internship not found']);
        }
    }
    public function getInternshipByCompanyID(int $companyId,int $page, int $limit): void
    {
        $internship = $this->internshipUsecase->getInternshipsByCompanyID($companyId,$page, $limit);
        if ($internship) {
            $this->jsonPresenter->respond_without(200, ['data' => $internship]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Internship not found']);
        }
    }

}
?>
