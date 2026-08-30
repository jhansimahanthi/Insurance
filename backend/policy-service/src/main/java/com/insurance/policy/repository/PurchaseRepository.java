package com.insurance.policy.repository;

import com.insurance.policy.entity.PolicyPurchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PurchaseRepository extends JpaRepository<PolicyPurchase, Long> {
    Optional<PolicyPurchase> findByPurchaseNumber(String purchaseNumber);
    Page<PolicyPurchase> findByCustomerId(Long customerId, Pageable pageable);
    boolean existsByCustomerIdAndPolicyIdAndStatus(Long customerId, Long policyId, PolicyPurchase.PurchaseStatus status);
}
