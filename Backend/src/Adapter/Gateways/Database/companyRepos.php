<?php

namespace Src\Adapter\Gateways\Database;

use PDO;
use Src\Domain\Entity\Company;
use Src\Domain\Interface\CompanyInterface;

class CompanyRepository implements CompanyInterface
{
    public function __construct(private PDO $db) {}

    public function createCompany(Company $company): ?Company
    {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("INSERT INTO companies 
                (name, category, logoUrl, location, about, currentNumberOfInternships, rating, created_at, updated_at) 
                VALUES (:name, :category, :logoUrl, :location, :about, :currentNumberOfInternships, :rating, :created_at, :updated_at)");
        
            $stmt->bindParam(':name', $company->name);
            $stmt->bindParam(':category', $company->category);
            $stmt->bindParam(':logoUrl', $company->logoUrl);
            $stmt->bindParam(':location', $company->location);
            $stmt->bindParam(':about', $company->about);
            $stmt->bindParam(':currentNumberOfInternships', $company->currentNumberOfInternships, PDO::PARAM_INT);
            $stmt->bindParam(':rating', $company->rating, PDO::PARAM_STR); 
            $stmt->bindParam(':created_at', $company->created_at);
            $stmt->bindParam(':updated_at', $company->updated_at);
        
            $stmt->execute();
        
            $id = $this->db->lastInsertId();
            $stmt = $this->db->prepare("SELECT * FROM companies WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $companyData = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if ($companyData) {
                $company = new Company(
                    name: $companyData['name'],
                    category: $companyData['category'],
                    logoUrl: $companyData['logoUrl'],
                    location: $companyData['location'],
                    about: $companyData['about'],
                    currentNumberOfInternships: (int)$companyData['currentNumberOfInternships'],
                    rating: isset($companyData['rating']) ? (float)$companyData['rating'] : null,
                    created_at: $companyData['created_at'],
                    updated_at: $companyData['updated_at'],
                    id: (int)$companyData['id']
                );
        
                $this->db->commit();
                return $company;
            }
        
            $this->db->rollBack();
            return null;
        } catch (\Exception $e) {
            $this->db->rollBack();
            error_log("Transaction failed in createCompany: " . $e->getMessage());
            return null;
        }
    }

    public function getCompanyById(int $id): ?Company
    {
        $stmt = $this->db->prepare("SELECT * FROM companies WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ? $this->mapToCompany($data) : null;
    }

    public function updateCompany(int $id, array $data): ?Company
    {
        $fields = [];
        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
        }
        $sql = "UPDATE companies SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $data['id'] = $id;
        $stmt->execute($data);
        return $this->getCompanyById($id);
    }

    public function deleteCompany(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM companies WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function getAllCompanies(int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM companies LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToCompany'], $rows);
    }
    

    public function getCompanyByName(string $name, int $page, int $limit): array
    {
        return $this->getByField('name', $name, $page, $limit);
    }

    public function getCompaniesByCategory(string $category, int $page, int $limit): array
    {
        return $this->getByField('category', $category, $page, $limit);
    }

    public function getCompaniesByLocation(string $location, int $page, int $limit): array
    {
        return $this->getByField('location', $location, $page, $limit);
    }

    public function getCompaniesByRating(float $rating, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $stmt = $this->db->prepare("SELECT * FROM companies WHERE rating >= :rating LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':rating', $rating, PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $rows;
    }

    public function searchCompanies(array $query, int $page, int $limit): array
    {
        $offset = ($page - 1) * $limit;
        $conditions = [];
        $params = [];

        if (isset($query['letter']) && $query['letter'] !== 'All') {
            $conditions[] = "name LIKE :letter";
            $params[':letter'] = $query['letter'] . '%';
        }

        if (isset($query['name'])) {
            $conditions[] = "name LIKE :name";
            $params[':name'] = "%{$query['name']}%";
        }

        if (isset($query['industry'])) {
            $conditions[] = "category LIKE :industry";
            $params[':industry'] = "%{$query['industry']}%";
        }

        if (isset($query['location'])) {
            $conditions[] = "location LIKE :location";
            $params[':location'] = "%{$query['location']}%";
        }

        if (isset($query['rating'])) {
            $conditions[] = "rating >= :rating";
            $params[':rating'] = $query['rating'];
        }

        $sql = "SELECT * FROM companies";
        if (!empty($conditions)) {
            $sql .= " WHERE " . implode(" AND ", $conditions);
        }
        $sql .= " LIMIT :limit OFFSET :offset";

        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToCompany'], $rows);
    }

    public function getCompanyInternships(int $companyId, int $page, int $limit): array
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
        $sql = "SELECT * FROM companies WHERE $field LIKE :value LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($sql);
        
        $likeValue = '%' . $value . '%';
        $stmt->bindParam(':value', $likeValue, PDO::PARAM_STR);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'mapToCompany'], $rows);
    }

    private function mapToCompany(array $data): Company
    {
        return new Company(
            name: $data['name'],
            category: $data['category'],
            logoUrl: $data['logoUrl'],
            location: $data['location'],
            about: $data['about'],
            currentNumberOfInternships: (int)$data['currentNumberOfInternships'],
            rating: isset($data['rating']) ? (float)$data['rating'] : null,
            id: (int)$data['id'],
            created_at: $data['created_at'],
            updated_at: $data['updated_at']
        );
    }

    private function mapToInternship(array $data): Internship
    {
        return new Internship(
            title: $data['title'],
            company: $data['company'],
            location: $data['location'],
            type: $data['type'],
            category: $data['category'],
            salaryRange: $data['salary_range'] ?? null,
            startDate: $data['start_date'],
            endDate: $data['end_date'],
            description: $data['description'],
            requirements: $data['requirements'],
            benefits: $data['benefits'] ?? null,
            deadline: $data['deadline'],
            link: $data['link'],
            created_at: $data['created_at'],
            updated_at: $data['updated_at'],
            id: (int)$data['id']
        );
    }
}