<?php

namespace Src\Adapter\Gateways\Database;

use PDO;
use Src\Domain\Entity\Application;
use Src\Domain\Interface\ApplicationInterface;

class ApplicationRepository implements ApplicationInterface
{
    public function __construct(private PDO $db) {}

    public function createApplication(Application $application): ?Application
    {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("
                INSERT INTO applications 
                (company_id, user_id, internship_id, status, resume_url, cover_letter, additional_documents, submission_date, created_at, updated_at) 
                VALUES (:company_id, :user_id, :internship_id, :status, :resume_url, :cover_letter, :additional_documents, :submission_date, :created_at, :updated_at)
            ");
        
            $stmt->bindParam(':company_id', $application->company_id, PDO::PARAM_INT);
            $stmt->bindParam(':user_id', $application->user_id, PDO::PARAM_INT);
            $stmt->bindParam(':internship_id', $application->internship_id, PDO::PARAM_INT);
            $stmt->bindParam(':status', $application->status);
            $stmt->bindParam(':resume_url', $application->resume_url);
            $stmt->bindParam(':cover_letter', $application->cover_letter);
            $stmt->bindParam(':additional_documents', $application->additional_documents);
            $stmt->bindParam(':submission_date', $application->submission_date);
            $stmt->bindParam(':created_at', $application->created_at);
            $stmt->bindParam(':updated_at', $application->updated_at);
        
            $stmt->execute();
        
            $id = $this->db->lastInsertId();
            $stmt = $this->db->prepare("SELECT * FROM applications WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $applicationData = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if ($applicationData) {
                $application = new Application(
                    company_id: (int)$applicationData['company_id'],
                    user_id: (int)$applicationData['user_id'],
                    internship_id: (int)$applicationData['internship_id'],
                    status: $applicationData['status'],
                    resume_url: $applicationData['resume_url'],
                    cover_letter: $applicationData['cover_letter'],
                    additional_documents: $applicationData['additional_documents'],
                    submission_date: $applicationData['submission_date'],
                    created_at: $applicationData['created_at'],
                    updated_at: $applicationData['updated_at'],
                    id: (int)$applicationData['id']
                );
        
                $this->db->commit();
                return $application;
            }
        
            $this->db->rollBack();
            return null;
        } catch (\Exception $e) {
            $this->db->rollBack();
            error_log("Transaction failed in createApplication: " . $e->getMessage());
            return null;
        }
    }

    public function getApplicationById(int $id): ?Application
    {
        $stmt = $this->db->prepare("SELECT * FROM applications WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ? $this->mapToApplication($data) : null;
    }

    public function updateApplication(int $id, array $data): ?Application
    {
        $fields = [];
        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
        }
        $sql = "UPDATE applications SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $data['id'] = $id;
        $stmt->execute($data);
        return $this->getApplicationById($id);
    }

    public function deleteApplication(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM applications WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getAllApplications(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM applications LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToApplication'], $rows);
    }

    public function getApplicationsByUserId(int $user_id, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM applications WHERE user_id = :user_id LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToApplication'], $rows);
    }

    public function getApplicationsByCompanyId(int $company_id, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM applications WHERE company_id = :company_id LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':company_id', $company_id, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToApplication'], $rows);
    }

    public function getApplicationsByInternshipId(int $internship_id, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM applications WHERE internship_id = :internship_id LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':internship_id', $internship_id, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToApplication'], $rows);
    }

    public function getApplicationsByStatus(string $status, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM applications WHERE status = :status LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToApplication'], $rows);
    }

    public function getApplicationStatsByUserId(int $user_id): array
    {
        $stmt = $this->db->prepare("
            SELECT status, COUNT(*) as count 
            FROM applications 
            WHERE user_id = :user_id 
            GROUP BY status
        ");
        $stmt->execute([':user_id' => $user_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getApplicationsInformation(int $user_id, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("
            SELECT 
                a.id AS application_id,
                a.status,
                a.resume_url,
                a.cover_letter,
                a.additional_documents,
                a.submission_date,
                a.created_at AS application_created_at,
                a.updated_at AS application_updated_at,
                c.name AS company_name,
                c.category AS company_category,
                c.logoUrl AS company_logo_url,
                c.location AS company_location,
                c.about AS company_about,
                c.rating AS company_rating,
                i.title AS internship_title,
                i.location AS internship_location,
                i.type AS internship_type,
                i.category AS internship_category,
                i.salary_range AS internship_salary_range,
                i.start_date AS internship_start_date,
                i.end_date AS internship_end_date,
                i.description AS internship_description,
                i.requirements AS internship_requirements,
                i.benefits AS internship_benefits,
                i.deadline AS internship_deadline,
                i.link AS internship_link
            FROM applications a
            INNER JOIN companies c ON a.company_id = c.id
            INNER JOIN internships i ON a.internship_id = i.id
            WHERE a.user_id = :user_id
            LIMIT :limit OFFSET :offset
        ");
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    private function mapToApplication(array $data): Application
    {
        return new Application(
            company_id: (int)$data['company_id'],
            user_id: (int)$data['user_id'],
            internship_id: (int)$data['internship_id'],
            status: $data['status'],
            resume_url: $data['resume_url'],
            cover_letter: $data['cover_letter'],
            additional_documents: $data['additional_documents'],
            submission_date: $data['submission_date'],
            created_at: $data['created_at'],
            updated_at: $data['updated_at'],
            id: (int)$data['id']
        );
    }
}