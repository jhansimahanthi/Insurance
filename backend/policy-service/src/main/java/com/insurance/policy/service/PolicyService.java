package com.insurance.policy.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.policy.dto.*;

import java.util.List;

public interface PolicyService {
    PolicyResponse createPolicy(CreatePolicyRequest request);
    PolicyResponse updatePolicy(Long id, UpdatePolicyRequest request);
    PolicyResponse getPolicyById(Long id);
    PaginatedResponse<PolicyResponse> getAllPolicies(int page, int size, String type, String status);
    PaginatedResponse<PolicyResponse> getActivePolicies(int page, int size);
    void deletePolicy(Long id);
    PurchaseResponse purchasePolicy(PurchasePolicyRequest request);
    PaginatedResponse<PurchaseResponse> getAllPurchases(int page, int size);
    PurchaseResponse getPurchaseById(Long id);
    PaginatedResponse<PurchaseResponse> getPurchasesByCustomer(Long customerId, int page, int size);
}
