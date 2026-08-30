package com.insurance.policy.controller;

import com.insurance.common.dto.ApiResponse;
import com.insurance.common.dto.PaginatedResponse;
import com.insurance.policy.dto.*;
import com.insurance.policy.service.PolicyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policies")
@Tag(name = "Policies", description = "Insurance Policy Management APIs")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @PostMapping
    @Operation(summary = "Create a new insurance policy")
    public ResponseEntity<ApiResponse<PolicyResponse>> createPolicy(
            @Valid @RequestBody CreatePolicyRequest request) {
        PolicyResponse response = policyService.createPolicy(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Policy created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all insurance policies")
    public ResponseEntity<ApiResponse<PaginatedResponse<PolicyResponse>>> getAllPolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        PaginatedResponse<PolicyResponse> response = policyService.getAllPolicies(page, size, type, status);
        return ResponseEntity.ok(ApiResponse.success("Policies retrieved successfully", response));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active policies")
    public ResponseEntity<ApiResponse<PaginatedResponse<PolicyResponse>>> getActivePolicies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<PolicyResponse> response = policyService.getActivePolicies(page, size);
        return ResponseEntity.ok(ApiResponse.success("Active policies retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get policy by ID")
    public ResponseEntity<ApiResponse<PolicyResponse>> getPolicyById(@PathVariable Long id) {
        PolicyResponse response = policyService.getPolicyById(id);
        return ResponseEntity.ok(ApiResponse.success("Policy retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an insurance policy")
    public ResponseEntity<ApiResponse<PolicyResponse>> updatePolicy(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePolicyRequest request) {
        PolicyResponse response = policyService.updatePolicy(id, request);
        return ResponseEntity.ok(ApiResponse.success("Policy updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (discontinue) an insurance policy")
    public ResponseEntity<ApiResponse<Void>> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        return ResponseEntity.ok(ApiResponse.success("Policy discontinued successfully"));
    }

    @PostMapping("/purchase")
    @Operation(summary = "Purchase an insurance policy")
    public ResponseEntity<ApiResponse<PurchaseResponse>> purchasePolicy(
            @Valid @RequestBody PurchasePolicyRequest request) {
        PurchaseResponse response = policyService.purchasePolicy(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Policy purchase initiated", response));
    }

    @GetMapping("/purchases")
    @Operation(summary = "Get all purchases")
    public ResponseEntity<ApiResponse<PaginatedResponse<PurchaseResponse>>> getAllPurchases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<PurchaseResponse> response = policyService.getAllPurchases(page, size);
        return ResponseEntity.ok(ApiResponse.success("Purchases retrieved successfully", response));
    }

    @GetMapping("/purchases/{id}")
    @Operation(summary = "Get purchase by ID")
    public ResponseEntity<ApiResponse<PurchaseResponse>> getPurchaseById(@PathVariable Long id) {
        PurchaseResponse response = policyService.getPurchaseById(id);
        return ResponseEntity.ok(ApiResponse.success("Purchase retrieved successfully", response));
    }

    @GetMapping("/purchases/customer/{customerId}")
    @Operation(summary = "Get purchases by customer ID")
    public ResponseEntity<ApiResponse<PaginatedResponse<PurchaseResponse>>> getPurchasesByCustomer(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<PurchaseResponse> response =
                policyService.getPurchasesByCustomer(customerId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Customer purchases retrieved successfully", response));
    }
}
