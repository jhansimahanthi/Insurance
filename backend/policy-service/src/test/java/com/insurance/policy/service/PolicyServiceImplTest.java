package com.insurance.policy.service;

import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.policy.dto.*;
import com.insurance.policy.entity.InsurancePolicy;
import com.insurance.policy.entity.PolicyPurchase;
import com.insurance.policy.kafka.PolicyEventPublisher;
import com.insurance.policy.mapper.PolicyMapper;
import com.insurance.policy.repository.PolicyRepository;
import com.insurance.policy.repository.PurchaseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PolicyServiceImplTest {

    @Mock private PolicyRepository policyRepository;
    @Mock private PurchaseRepository purchaseRepository;
    @Mock private PolicyMapper policyMapper;
    @Mock private PolicyEventPublisher eventPublisher;

    @InjectMocks private PolicyServiceImpl policyService;

    private InsurancePolicy testPolicy;
    private PolicyResponse testResponse;

    @BeforeEach
    void setUp() {
        testPolicy = InsurancePolicy.builder()
                .id(1L).policyNumber("POL-000001").policyName("Auto Insurance")
                .policyType("AUTO").description("Full auto coverage")
                .coverageAmount(new BigDecimal("50000.00"))
                .basePremium(new BigDecimal("120.00"))
                .duration(12).status(InsurancePolicy.PolicyStatus.ACTIVE)
                .benefits("Accident, Theft").exclusions("Racing").build();
        testResponse = PolicyResponse.builder()
                .id(1L).policyNumber("POL-000001").policyName("Auto Insurance")
                .policyType("AUTO").coverageAmount(new BigDecimal("50000.00"))
                .basePremium(new BigDecimal("120.00")).duration(12).status("ACTIVE").build();
    }

    @Test
    void createPolicy_success() {
        CreatePolicyRequest request = new CreatePolicyRequest();
        request.setPolicyName("Auto Insurance"); request.setPolicyType("AUTO");
        request.setCoverageAmount(new BigDecimal("50000.00"));
        request.setBasePremium(new BigDecimal("120.00")); request.setDuration(12);

        when(policyRepository.save(any(InsurancePolicy.class))).thenReturn(testPolicy);
        when(policyMapper.toPolicyResponse(testPolicy)).thenReturn(testResponse);

        PolicyResponse response = policyService.createPolicy(request);

        assertNotNull(response);
        assertEquals("POL-000001", response.getPolicyNumber());
        verify(policyRepository).save(any(InsurancePolicy.class));
    }

    @Test
    void getPolicyById_success() {
        when(policyRepository.findById(1L)).thenReturn(Optional.of(testPolicy));
        when(policyMapper.toPolicyResponse(testPolicy)).thenReturn(testResponse);

        PolicyResponse response = policyService.getPolicyById(1L);

        assertEquals("Auto Insurance", response.getPolicyName());
    }

    @Test
    void getPolicyById_notFound_throwsException() {
        when(policyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> policyService.getPolicyById(99L));
    }

    @Test
    void updatePolicy_success() {
        UpdatePolicyRequest request = new UpdatePolicyRequest();
        request.setPolicyName("Updated Auto Insurance");

        when(policyRepository.findById(1L)).thenReturn(Optional.of(testPolicy));
        when(policyRepository.save(any(InsurancePolicy.class))).thenReturn(testPolicy);
        when(policyMapper.toPolicyResponse(any())).thenReturn(testResponse);

        PolicyResponse response = policyService.updatePolicy(1L, request);

        assertNotNull(response);
        verify(policyRepository).save(any(InsurancePolicy.class));
    }

    @Test
    void purchasePolicy_success() {
        PurchasePolicyRequest request = new PurchasePolicyRequest();
        request.setCustomerId(1L); request.setPolicyId(1L);
        request.setPremium(new BigDecimal("120.00"));

        PolicyPurchase purchase = PolicyPurchase.builder()
                .id(1L).purchaseNumber("PUR-000001").customerId(1L).policyId(1L)
                .premium(new BigDecimal("120.00"))
                .startDate(LocalDate.now()).endDate(LocalDate.now().plusMonths(12))
                .status(PolicyPurchase.PurchaseStatus.PENDING_PAYMENT).build();
        PurchaseResponse purchaseResponse = PurchaseResponse.builder()
                .id(1L).purchaseNumber("PUR-000001").policyName("Auto Insurance")
                .premium(new BigDecimal("120.00")).status("PENDING_PAYMENT").build();

        when(policyRepository.findById(1L)).thenReturn(Optional.of(testPolicy));
        when(purchaseRepository.existsByCustomerIdAndPolicyIdAndStatus(1L, 1L, PolicyPurchase.PurchaseStatus.ACTIVE))
                .thenReturn(false);
        when(purchaseRepository.save(any(PolicyPurchase.class))).thenReturn(purchase);
        when(policyMapper.toPurchaseResponse(any(), eq("Auto Insurance"))).thenReturn(purchaseResponse);

        PurchaseResponse response = policyService.purchasePolicy(request);

        assertNotNull(response);
        assertEquals("PUR-000001", response.getPurchaseNumber());
        verify(eventPublisher).publishPolicyPurchasedEvent(any());
    }

    @Test
    void purchasePolicy_inactivePolicy_throwsException() {
        testPolicy.setStatus(InsurancePolicy.PolicyStatus.INACTIVE);
        PurchasePolicyRequest request = new PurchasePolicyRequest();
        request.setCustomerId(1L); request.setPolicyId(1L);
        request.setPremium(new BigDecimal("120.00"));

        when(policyRepository.findById(1L)).thenReturn(Optional.of(testPolicy));

        assertThrows(BusinessException.class, () -> policyService.purchasePolicy(request));
    }

    @Test
    void purchasePolicy_duplicatePurchase_throwsException() {
        PurchasePolicyRequest request = new PurchasePolicyRequest();
        request.setCustomerId(1L); request.setPolicyId(1L);
        request.setPremium(new BigDecimal("120.00"));

        when(policyRepository.findById(1L)).thenReturn(Optional.of(testPolicy));
        when(purchaseRepository.existsByCustomerIdAndPolicyIdAndStatus(1L, 1L, PolicyPurchase.PurchaseStatus.ACTIVE))
                .thenReturn(true);

        assertThrows(BusinessException.class, () -> policyService.purchasePolicy(request));
    }

    @Test
    void deletePolicy_success() {
        when(policyRepository.findById(1L)).thenReturn(Optional.of(testPolicy));
        when(policyRepository.save(any(InsurancePolicy.class))).thenReturn(testPolicy);

        policyService.deletePolicy(1L);

        verify(policyRepository).save(argThat(p -> p.getStatus() == InsurancePolicy.PolicyStatus.DISCONTINUED));
    }
}
