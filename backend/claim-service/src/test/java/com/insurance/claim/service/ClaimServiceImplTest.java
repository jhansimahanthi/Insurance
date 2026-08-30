package com.insurance.claim.service;

import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.claim.dto.ClaimResponse;
import com.insurance.claim.dto.SubmitClaimRequest;
import com.insurance.claim.dto.UpdateClaimStatusRequest;
import com.insurance.claim.entity.Claim;
import com.insurance.claim.kafka.ClaimEventPublisher;
import com.insurance.claim.mapper.ClaimMapper;
import com.insurance.claim.repository.ClaimRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClaimServiceImplTest {

    @Mock private ClaimRepository claimRepository;
    @Mock private ClaimMapper claimMapper;
    @Mock private ClaimEventPublisher eventPublisher;

    @InjectMocks private ClaimServiceImpl claimService;

    private Claim testClaim;
    private ClaimResponse testResponse;

    @BeforeEach
    void setUp() {
        testClaim = Claim.builder()
                .id(1L).claimNumber("CLM-000001").customerId(1L).policyId(1L)
                .claimType("ACCIDENT").description("Car accident on highway")
                .claimAmount(new BigDecimal("5000.00"))
                .incidentDate(LocalDate.now().minusDays(5))
                .status(Claim.ClaimStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now()).build();
        testResponse = ClaimResponse.builder()
                .id(1L).claimNumber("CLM-000001").customerId(1L).policyId(1L)
                .claimType("ACCIDENT").claimAmount(new BigDecimal("5000.00"))
                .incidentDate(LocalDate.now().minusDays(5))
                .status("SUBMITTED").build();
    }

    @Test
    void submitClaim_success() {
        SubmitClaimRequest request = SubmitClaimRequest.builder()
                .customerId(1L).policyId(1L).claimType("ACCIDENT")
                .claimAmount(new BigDecimal("5000.00"))
                .incidentDate(LocalDate.now().minusDays(5))
                .description("Car accident on highway").build();

        when(claimRepository.save(any(Claim.class))).thenReturn(testClaim);
        when(claimMapper.toResponse(testClaim)).thenReturn(testResponse);

        ClaimResponse response = claimService.submitClaim(request);

        assertNotNull(response);
        assertEquals("CLM-000001", response.getClaimNumber());
        assertEquals("SUBMITTED", response.getStatus());
        verify(eventPublisher).publishClaimSubmittedEvent(any());
    }

    @Test
    void getClaimById_success() {
        when(claimRepository.findById(1L)).thenReturn(Optional.of(testClaim));
        when(claimMapper.toResponse(testClaim)).thenReturn(testResponse);

        ClaimResponse response = claimService.getClaimById(1L);

        assertEquals("CLM-000001", response.getClaimNumber());
    }

    @Test
    void getClaimById_notFound_throwsException() {
        when(claimRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> claimService.getClaimById(99L));
    }

    @Test
    void updateClaimStatus_submittedToUnderReview_success() {
        UpdateClaimStatusRequest request = new UpdateClaimStatusRequest();
        request.setStatus("UNDER_REVIEW"); request.setAdminNotes("Reviewing documents");

        when(claimRepository.findById(1L)).thenReturn(Optional.of(testClaim));
        Claim updatedClaim = Claim.builder()
                .id(1L).claimNumber("CLM-000001").customerId(1L)
                .status(Claim.ClaimStatus.UNDER_REVIEW)
                .adminNotes("Reviewing documents").build();
        when(claimRepository.save(any(Claim.class))).thenReturn(updatedClaim);
        when(claimMapper.toResponse(updatedClaim)).thenReturn(
                ClaimResponse.builder().id(1L).claimNumber("CLM-000001").status("UNDER_REVIEW").build());

        ClaimResponse response = claimService.updateClaimStatus(1L, request);

        assertEquals("UNDER_REVIEW", response.getStatus());
        verify(eventPublisher).publishClaimStatusUpdatedEvent(any());
    }

    @Test
    void updateClaimStatus_underReviewToApproved_success() {
        testClaim.setStatus(Claim.ClaimStatus.UNDER_REVIEW);
        UpdateClaimStatusRequest request = new UpdateClaimStatusRequest();
        request.setStatus("APPROVED");

        when(claimRepository.findById(1L)).thenReturn(Optional.of(testClaim));
        Claim updatedClaim = Claim.builder().id(1L).status(Claim.ClaimStatus.APPROVED).build();
        when(claimRepository.save(any())).thenReturn(updatedClaim);
        when(claimMapper.toResponse(updatedClaim)).thenReturn(
                ClaimResponse.builder().id(1L).status("APPROVED").build());

        ClaimResponse response = claimService.updateClaimStatus(1L, request);

        assertEquals("APPROVED", response.getStatus());
    }

    @Test
    void updateClaimStatus_invalidTransition_throwsException() {
        // SUBMITTED -> APPROVED is invalid (must go through UNDER_REVIEW first)
        UpdateClaimStatusRequest request = new UpdateClaimStatusRequest();
        request.setStatus("APPROVED");

        when(claimRepository.findById(1L)).thenReturn(Optional.of(testClaim));

        assertThrows(BusinessException.class, () -> claimService.updateClaimStatus(1L, request));
    }

    @Test
    void updateClaimStatus_rejectedCannotTransition_throwsException() {
        testClaim.setStatus(Claim.ClaimStatus.REJECTED);
        UpdateClaimStatusRequest request = new UpdateClaimStatusRequest();
        request.setStatus("UNDER_REVIEW");

        when(claimRepository.findById(1L)).thenReturn(Optional.of(testClaim));

        assertThrows(BusinessException.class, () -> claimService.updateClaimStatus(1L, request));
    }

    @Test
    void updateClaimStatus_settledCannotTransition_throwsException() {
        testClaim.setStatus(Claim.ClaimStatus.SETTLED);
        UpdateClaimStatusRequest request = new UpdateClaimStatusRequest();
        request.setStatus("APPROVED");

        when(claimRepository.findById(1L)).thenReturn(Optional.of(testClaim));

        assertThrows(BusinessException.class, () -> claimService.updateClaimStatus(1L, request));
    }

    @Test
    void updateClaimStatus_approvedToSettled_success() {
        testClaim.setStatus(Claim.ClaimStatus.APPROVED);
        UpdateClaimStatusRequest request = new UpdateClaimStatusRequest();
        request.setStatus("SETTLED");

        when(claimRepository.findById(1L)).thenReturn(Optional.of(testClaim));
        Claim updatedClaim = Claim.builder().id(1L).status(Claim.ClaimStatus.SETTLED).build();
        when(claimRepository.save(any())).thenReturn(updatedClaim);
        when(claimMapper.toResponse(updatedClaim)).thenReturn(
                ClaimResponse.builder().id(1L).status("SETTLED").build());

        ClaimResponse response = claimService.updateClaimStatus(1L, request);

        assertEquals("SETTLED", response.getStatus());
    }
}
