package com.insurance.claim.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.common.event.ClaimStatusUpdatedEvent;
import com.insurance.common.event.ClaimSubmittedEvent;
import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.InvalidRequestException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.claim.dto.ClaimResponse;
import com.insurance.claim.dto.SubmitClaimRequest;
import com.insurance.claim.dto.UpdateClaimStatusRequest;
import com.insurance.claim.entity.Claim;
import com.insurance.claim.kafka.ClaimEventPublisher;
import com.insurance.claim.mapper.ClaimMapper;
import com.insurance.claim.repository.ClaimRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ClaimServiceImpl implements ClaimService {

    private static final Logger log = LoggerFactory.getLogger(ClaimServiceImpl.class);
    private static final AtomicInteger CLAIM_COUNTER = new AtomicInteger(1000);

    private final ClaimRepository claimRepository;
    private final ClaimMapper claimMapper;
    private final ClaimEventPublisher eventPublisher;

    public ClaimServiceImpl(ClaimRepository claimRepository,
                            ClaimMapper claimMapper,
                            ClaimEventPublisher eventPublisher) {
        this.claimRepository = claimRepository;
        this.claimMapper = claimMapper;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public ClaimResponse submitClaim(SubmitClaimRequest request) {
        log.info("Submitting claim for customer: {}, policy: {}", request.getCustomerId(), request.getPolicyId());

        String claimNumber = generateClaimNumber();

        Claim claim = Claim.builder()
                .claimNumber(claimNumber)
                .customerId(request.getCustomerId())
                .policyId(request.getPolicyId())
                .claimType(request.getClaimType())
                .description(request.getDescription())
                .claimAmount(request.getClaimAmount())
                .incidentDate(request.getIncidentDate())
                .status(Claim.ClaimStatus.SUBMITTED)
                .build();

        claim = claimRepository.save(claim);

        ClaimSubmittedEvent event = ClaimSubmittedEvent.create(
                claim.getId(), claim.getClaimNumber(),
                claim.getCustomerId(), null,
                claim.getPolicyId(), claim.getClaimType(),
                claim.getClaimAmount(), claim.getIncidentDate());
        eventPublisher.publishClaimSubmittedEvent(event);

        log.info("Claim submitted: {}", claimNumber);
        return claimMapper.toResponse(claim);
    }

    @Override
    public ClaimResponse getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));
        return claimMapper.toResponse(claim);
    }

    @Override
    public ClaimResponse getClaimByNumber(String claimNumber) {
        Claim claim = claimRepository.findByClaimNumber(claimNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "claimNumber", claimNumber));
        return claimMapper.toResponse(claim);
    }

    @Override
    public PaginatedResponse<ClaimResponse> getClaimsByCustomer(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
        Page<Claim> claims = claimRepository.findByCustomerId(customerId, pageable);

        return PaginatedResponse.<ClaimResponse>builder()
                .content(claims.getContent().stream().map(claimMapper::toResponse).toList())
                .page(claims.getNumber())
                .size(claims.getSize())
                .totalElements(claims.getTotalElements())
                .totalPages(claims.getTotalPages())
                .last(claims.isLast())
                .build();
    }

    @Override
    public PaginatedResponse<ClaimResponse> getAllClaims(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
        Page<Claim> claims;

        if (status != null && !status.isEmpty()) {
            claims = claimRepository.findByStatus(
                    Claim.ClaimStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            claims = claimRepository.findAll(pageable);
        }

        return PaginatedResponse.<ClaimResponse>builder()
                .content(claims.getContent().stream().map(claimMapper::toResponse).toList())
                .page(claims.getNumber())
                .size(claims.getSize())
                .totalElements(claims.getTotalElements())
                .totalPages(claims.getTotalPages())
                .last(claims.isLast())
                .build();
    }

    @Override
    @Transactional
    public ClaimResponse updateClaimStatus(Long id, UpdateClaimStatusRequest request) {
        log.info("Updating claim status: {} to {}", id, request.getStatus());

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim", "id", id));

        String previousStatus = claim.getStatus().name();
        String newStatus = request.getStatus().toUpperCase();

        // Validate status transition
        validateStatusTransition(claim.getStatus(), Claim.ClaimStatus.valueOf(newStatus));

        claim.setStatus(Claim.ClaimStatus.valueOf(newStatus));
        if (request.getAdminNotes() != null) {
            claim.setAdminNotes(request.getAdminNotes());
        }

        claim = claimRepository.save(claim);

        ClaimStatusUpdatedEvent event = ClaimStatusUpdatedEvent.create(
                claim.getId(), claim.getClaimNumber(),
                claim.getCustomerId(), null,
                previousStatus, newStatus, "admin");
        eventPublisher.publishClaimStatusUpdatedEvent(event);

        log.info("Claim status updated: {} -> {}", previousStatus, newStatus);
        return claimMapper.toResponse(claim);
    }

    private void validateStatusTransition(Claim.ClaimStatus current, Claim.ClaimStatus next) {
        Map<Claim.ClaimStatus, java.util.Set<Claim.ClaimStatus>> validTransitions = new HashMap<>();
        validTransitions.put(Claim.ClaimStatus.SUBMITTED,
                java.util.Set.of(Claim.ClaimStatus.UNDER_REVIEW));
        validTransitions.put(Claim.ClaimStatus.UNDER_REVIEW,
                java.util.Set.of(Claim.ClaimStatus.APPROVED, Claim.ClaimStatus.REJECTED));
        validTransitions.put(Claim.ClaimStatus.APPROVED,
                java.util.Set.of(Claim.ClaimStatus.SETTLED));
        validTransitions.put(Claim.ClaimStatus.REJECTED,
                java.util.Set.of());
        validTransitions.put(Claim.ClaimStatus.SETTLED,
                java.util.Set.of());

        if (!validTransitions.containsKey(current) ||
            !validTransitions.get(current).contains(next)) {
            throw new BusinessException(
                    String.format("Invalid status transition from %s to %s", current, next),
                    "INVALID_STATUS_TRANSITION");
        }
    }

    private String generateClaimNumber() {
        return "CLM-" + String.format("%06d", CLAIM_COUNTER.getAndIncrement());
    }
}
