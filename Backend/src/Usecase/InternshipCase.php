<?php
namespace Src\Usecase;

use Src\Domain\Entity\Internship;
use Src\Domain\Interface\InternshipInterface;

class InternshipUsecase {
    private InternshipInterface $internshipRepository;

    public function __construct(InternshipInterface $internshipRepository)
    {
        $this->internshipRepository = $internshipRepository;
    }

    public function createInternship(Internship $internship): ?Internship
    {
        return $this->internshipRepository->createInternship($internship);
    }

    public function getInternshipById(int $id): ?Internship
    {
        return $this->internshipRepository->getInternshipById($id);
    }

    public function updateInternship(int $id, array $data): ?Internship
    {
        return $this->internshipRepository->updateInternship($id, $data);
    }

    public function deleteInternship(int $id): bool
    {
        return $this->internshipRepository->deleteInternship($id);
    }

    public function getAllInternships(int $page, int $limit): array
    {
        return $this->internshipRepository->getAllInternships($page, $limit);
    }

    public function getInternshipByTitle(string $title, int $page, int $limit):array
    {
        return $this->internshipRepository->getInternshipByTitle($title, $page, $limit);
    }

    public function getInternshipsByCompany(string $company, int $page, int $limit): array
    {
        return $this->internshipRepository->getInternshipsByCompany($company, $page, $limit);
    }

    public function getInternshipsByLocation(string $location, int $page, int $limit): array
    {
        return $this->internshipRepository->getInternshipsByLocation($location, $page, $limit);
    }

    public function getInternshipsByType(string $type, int $page, int $limit): array
    {
        return $this->internshipRepository->getInternshipsByType($type, $page, $limit);
    }

    public function getInternshipsByCategory(string $category, int $page, int $limit): array
    {
        return $this->internshipRepository->getInternshipsByCategory($category, $page, $limit);
    }

    public function searchInternships(array $query, int $page, int $limit): array
    {
        return $this->internshipRepository->searchInternships($query, $page, $limit);
    }

    public function applyToInternship(int $internshipId, int $userId): bool
    {
        return $this->internshipRepository->applyToInternship($internshipId, $userId);
    }

    public function getInternshipApplications(int $internshipId): array
    {
        return $this->internshipRepository->getInternshipApplications($internshipId);
    }
}
?>
