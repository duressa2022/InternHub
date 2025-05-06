<?php

namespace Src\Adapter\Gateways\Database;

use PDO;
use Src\Domain\Entity\Internship;
use Src\Domain\Interface\InternshipInterface;

class InternshipRepository implements InternshipInterface
{
    public function __construct(private PDO $db) {}

    public function createInternship(Internship $internship): ?Internship
    {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("INSERT INTO internships 
                (company_id,title, company, location, type, category, salary_range, start_date, end_date, description, requirements, benefits, deadline, link, created_at, updated_at) 
                VALUES (:company_id,,:title, :company, :location, :type, :category, :salary_range, :start_date, :end_date, :description, :requirements, :benefits, :deadline, :link, :created_at, :updated_at)");
            
            $stmt->bindParam(':company_id', $internship->company_id, PDO::PARAM_INT);
            $stmt->bindParam(':title', $internship->title);
            $stmt->bindParam(':company', $internship->company);
            $stmt->bindParam(':location', $internship->location);
            $stmt->bindParam(':type', $internship->type);
            $stmt->bindParam(':category', $internship->category);
            $stmt->bindParam(':salary_range', $internship->salaryRange);
            $stmt->bindParam(':start_date', $internship->startDate);
            $stmt->bindParam(':end_date', $internship->endDate);
            $stmt->bindParam(':requirements', $internship->requirements);
            $stmt->bindParam(':description', $internship->description);
            $stmt->bindParam(':benefits', $internship->benefits);
            $stmt->bindParam(':deadline', $internship->deadline);
            $stmt->bindParam(':link', $internship->link);
            $stmt->bindParam(':created_at', $internship->created_at);
            $stmt->bindParam(':updated_at', $internship->updated_at);
        
            $stmt->execute();
        
            $id = $this->db->lastInsertId();
            $stmt = $this->db->prepare("SELECT * FROM internships WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $internshipData = $stmt->fetch(PDO::FETCH_ASSOC);

        
            if ($internshipData) {
                $internship = new Internship(
                    title: $internshipData['title'],
                    company: $internshipData['company'],
                    location: $internshipData['location'],
                    type: $internshipData['type'],
                    category: $internshipData['category'],
                    salaryRange: $internshipData['salary_range'],
                    startDate: $internshipData['start_date'],
                    endDate: $internshipData['end_date'],
                    requirements: $internshipData['requirements'],
                    description: $internshipData['description'],
                    benefits: $internshipData['benefits'] ?? null,
                    deadline: $internshipData['deadline'],
                    link: $internshipData['link'],
                    created_at: $internshipData['created_at'],
                    updated_at: $internshipData['updated_at'],
                    id: (int)$internshipData['id']
                );
        
                $this->db->commit();
                return $internship;
            }
        
            $this->db->rollBack();
            return null;
        } catch (\Exception $e) {
            $this->db->rollBack();
            error_log("Transaction failed in createInternship: " . $e->getMessage());
            return null;
        }
    }


    public function getInternshipById(int $id): ?Internship
    {
        $stmt = $this->db->prepare("SELECT * FROM internships WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ? $this->mapToInternship($data) : null;
    }

    public function updateInternship(int $id, array $data): ?Internship
    {
        $fields = [];
        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
        }
        $sql = "UPDATE internships SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $data['id'] = $id;
        $stmt->execute($data);
        return $this->getInternshipById($id);
    }

    public function deleteInternship(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM internships WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getAllInternships(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM internships LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToInternship'], $rows);
    }

    public function getInternshipByTitle(string $title, int $page, int $limit): array
    {
        return $this->getByField('title', $title, $page, $limit);
    }

    public function getInternshipsByCompany(string $company, int $page, int $limit): array
    {
        return $this->getByField('company', $company, $page, $limit);
    }

    public function getInternshipsByLocation(string $location, int $page, int $limit): array
    {
        return $this->getByField('location', $location, $page, $limit);
    }

    public function getInternshipsByType(string $type, int $page, int $limit): array
    {
        return $this->getByField('type', $type, $page, $limit);
    }

    public function getInternshipsByCategory(string $category, int $page, int $limit): array
    {
        return $this->getByField('category', $category, $page, $limit);
    }

    public function searchInternships(array $query, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $conditions = [];
        $params = [];

        foreach ($query as $key => $value) {
            $conditions[] = "$key LIKE :$key";
            $params[":$key"] = "%$value%";
        }

        $sql = "SELECT * FROM internships WHERE " . implode(" AND ", $conditions) . " LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToInternship'], $rows);
    }

    public function applyToInternship(int $internshipId, int $userId): bool
    {
        $stmt = $this->db->prepare("INSERT INTO internship_applications (internship_id, user_id, applied_at) VALUES (:internship_id, :user_id, NOW())");
        return $stmt->execute([
            ':internship_id' => $internshipId,
            ':user_id' => $userId
        ]);
    }

    public function getInternshipApplications(int $internshipId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM internship_applications WHERE internship_id = :id");
        $stmt->execute([':id' => $internshipId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getInternshipByCompanyId(int $companyId, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM internships WHERE company_id = :company_id LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':company_id', $companyId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToInternship'], $rows);
    }

    private function getByField(string $field, string $value, int $page, int $limit): array
    {
      
        $offset = ($page - 1) * $limit;
        $sql = "SELECT * FROM internships WHERE $field LIKE :value LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($sql);
        
        $likeValue = '%' . $value . '%';
        $stmt->bindParam(':value', $likeValue, \PDO::PARAM_STR);
        $stmt->bindParam(':limit', $limit, \PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, \PDO::PARAM_INT);
        
        $stmt->execute();
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return array_map([$this, 'mapToInternship'], $rows);
    }


    private function mapToInternship(array $data): Internship
    {
        return new Internship(
            title: $data['title'],
            company: $data['company'],
            location: $data['location'],
            type: $data['type'],
            category: $data['category'],
            salaryRange: $data['salary_range'],
            startDate: $data['start_date'],
            endDate: $data['end_date'],
            description: $data['description'],
            requirements: $data['requirements'],
            benefits: $data['benefits'],
            deadline: $data['deadline'],
            link: $data['link'],
            created_at: $data['created_at'],
            updated_at: $data['updated_at'],
            id: (int)$data['id']
        );
    }
}
