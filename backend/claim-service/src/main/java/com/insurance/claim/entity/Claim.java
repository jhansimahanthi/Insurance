package com.insurance.claim.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String claimNumber;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Long policyId;

    @Column(nullable = false)
    private String claimType;

    private String description;

    @Column(nullable = false)
    private BigDecimal claimAmount;

    @Column(nullable = false)
    private LocalDate incidentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ClaimStatus status = ClaimStatus.SUBMITTED;

    private String adminNotes;

    @CreationTimestamp
    private LocalDateTime submittedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ClaimStatus {
        SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, SETTLED
    }
}
