package com.insurance.quote.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "quotes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String quoteNumber;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private Long policyId;

    private Integer age;

    @Column(nullable = false)
    private BigDecimal coverageAmount;

    @Column(nullable = false)
    private Integer duration;

    private String riskLevel;

    @Column(nullable = false)
    private BigDecimal calculatedPremium;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private QuoteStatus status = QuoteStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    public enum QuoteStatus {
        PENDING, ACCEPTED, EXPIRED, REJECTED
    }
}
