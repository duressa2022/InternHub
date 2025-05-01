<?php

namespace Src\Adapter\Controllers;

use Src\Adapter\Presenters\JsonPresenter;
use Src\Usecase\ApplicationUsecase;
use Src\Domain\Entity\Application;

class ApplicationController
{
    private ApplicationUsecase $applicationUsecase;
    private JsonPresenter $jsonPresenter;

    public function __construct(ApplicationUsecase $applicationUsecase, JsonPresenter $jsonPresenter)
    {
        $this->applicationUsecase = $applicationUsecase;
        $this->jsonPresenter = $jsonPresenter;
    }

    public function createApplication(array $request): void
    {
        $application = new Application(
            company_id: (int)$request['company_id'],
            user_id: (int)$request['user_id'],
            internship_id: (int)$request['internship_id'],
            status: $request['status'],
            resume_url: $request['resume_url'],
            cover_letter: $request['cover_letter'] ?? null,
            additional_documents: $request['additional_documents'] ?? null,
            submission_date: $request['submission_date'] ?? date('Y-m-d'),
            created_at: date('Y-m-d H:i:s'),
            updated_at: date('Y-m-d H:i:s')
        );

        $createdApplication = $this->applicationUsecase->createApplication($application);
        if ($createdApplication) {
            $this->jsonPresenter->respond_without(201, ['message' => 'Application created successfully', 'data' => (array)$createdApplication]);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to create application']);
        }
    }

    public function getApplicationById(int $id): void
    {
        $application = $this->applicationUsecase->getApplicationById($id);
        if ($application) {
            $this->jsonPresenter->respond_without(200, ['data' => (array)$application]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'Application not found']);
        }
    }

    public function updateApplication(int $id, array $data): void
    {
        $updated = $this->applicationUsecase->updateApplication($id, $data);
        if ($updated) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Application updated successfully', 'data' => (array)$updated]);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to update application']);
        }
    }

    public function deleteApplication(int $id): void
    {
        if ($this->applicationUsecase->deleteApplication($id)) {
            $this->jsonPresenter->respond_without(200, ['message' => 'Application deleted successfully']);
        } else {
            $this->jsonPresenter->respond_without(400, ['message' => 'Failed to delete application']);
        }
    }

    public function getAllApplications(int $page, int $limit): void
    {
        $applications = $this->applicationUsecase->getAllApplications($page, $limit);
        if ($applications) {
            $this->jsonPresenter->respond_without(200, ['data' => $applications]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No applications found']);
        }
    }

    public function getApplicationsByUserId(int $user_id, int $page, int $limit): void
    {
        $applications = $this->applicationUsecase->getApplicationsByUserId($user_id, $page, $limit);
        if ($applications) {
            $this->jsonPresenter->respond_without(200, ['data' => $applications]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No applications found']);
        }
    }

    public function getApplicationsByCompanyId(int $company_id, int $page, int $limit): void
    {
        $applications = $this->applicationUsecase->getApplicationsByCompanyId($company_id, $page, $limit);
        if ($applications) {
            $this->jsonPresenter->respond_without(200, ['data' =>$applications]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No applications found']);
        }
    }

    public function getApplicationsByInternshipId(int $internship_id, int $page, int $limit): void
    {
        $applications = $this->applicationUsecase->getApplicationsByInternshipId($internship_id, $page, $limit);
        if ($applications) {
            $this->jsonPresenter->respond_without(200, ['data' => $applications]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No applications found']);
        }
    }

    public function getApplicationsByStatus(string $status, int $page, int $limit): void
    {
        $applications = $this->applicationUsecase->getApplicationsByStatus($status, $page, $limit);
        if ($applications) {
            $this->jsonPresenter->respond_without(200, ['data' => $applications]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No applications found']);
        }
    }

    public function getApplicationStatsByUserId(int $user_id): void
    {
        $stats = $this->applicationUsecase->getApplicationStatsByUserId($user_id);
        if ($stats) {
            $this->jsonPresenter->respond_without(200, ['data' => $stats]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No application stats found']);
        }
    }

    public function getApplicationsInformation(int $user_id, int $page, int $limit): void
    {
        $applicationsInfo = $this->applicationUsecase->getApplicationsInformation($user_id, $page, $limit);
        if ($applicationsInfo) {
            $this->jsonPresenter->respond_without(200, ['data' => $applicationsInfo]);
        } else {
            $this->jsonPresenter->respond_without(404, ['message' => 'No applications found']);
        }
    }
}