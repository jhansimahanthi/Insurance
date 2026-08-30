package com.insurance.claim.controller;

import com.insurance.common.dto.ApiResponse;
import com.insurance.common.dto.PaginatedResponse;
import com.insurance.claim.dto.ClaimResponse;
import com.insurance.claim.dto.SubmitClaimRequest;
import com.insurance.claim.dto.UpdateClaimStatusRequest;
import com.insurance.claim.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/claims")
@Tag(name = "Claims", description = "Insurance Claim Management APIs")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    @Operation(summary = "Submit a new insurance claim")
    public ResponseEntity<ApiResponse<ClaimResponse>> submitClaim(
            @Valid @RequestBody SubmitClaimRequest request) {
        ClaimResponse response = claimService.submitClaim(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim submitted successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get claim by ID")
    public ResponseEntity<ApiResponse<ClaimResponse>> getClaimById(@PathVariable Long id) {
        ClaimResponse response = claimService.getClaimById(id);
        return ResponseEntity.ok(ApiResponse.success("Claim retrieved successfully", response));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get claims by customer ID")
    public ResponseEntity<ApiResponse<PaginatedResponse<ClaimResponse>>> getClaimsByCustomer(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<ClaimResponse> response = claimService.getClaimsByCustomer(customerId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all claims (admin)")
    public ResponseEntity<ApiResponse<PaginatedResponse<ClaimResponse>>> getAllClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        PaginatedResponse<ClaimResponse> response = claimService.getAllClaims(page, size, status);
        return ResponseEntity.ok(ApiResponse.success("Claims retrieved successfully", response));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update claim status (admin)")
    public ResponseEntity<ApiResponse<ClaimResponse>> updateClaimStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateClaimStatusRequest request) {
        ClaimResponse response = claimService.updateClaimStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Claim status updated successfully", response));
    }
}
