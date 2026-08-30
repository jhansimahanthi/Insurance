package com.insurance.policy.repository;

import com.insurance.policy.entity.InsurancePolicy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    Optional<InsurancePolicy> findByPolicyNumber(String policyNumber);
    boolean existsByPolicyNumber(String policyNumber);
    Page<InsurancePolicy> findByPolicyType(String policyType, Pageable pageable);
    Page<InsurancePolicy> findByStatus(InsurancePolicy.PolicyStatus status, Pageable pageable);
    Page<InsurancePolicy> findByPolicyNameContainingOrDescriptionContaining(String name, String description, Pageable pageable);
}
