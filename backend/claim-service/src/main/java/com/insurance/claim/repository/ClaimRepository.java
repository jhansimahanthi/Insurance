package com.insurance.claim.repository;

import com.insurance.claim.entity.Claim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Optional<Claim> findByClaimNumber(String claimNumber);
    Page<Claim> findByCustomerId(Long customerId, Pageable pageable);
    Page<Claim> findByStatus(Claim.ClaimStatus status, Pageable pageable);
    long countByStatus(Claim.ClaimStatus status);
}
