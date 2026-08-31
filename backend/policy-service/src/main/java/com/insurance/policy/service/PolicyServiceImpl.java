package com.insurance.policy.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.common.event.PolicyPurchasedEvent;
import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.DuplicateResourceException;
import com.insurance.common.exception.InvalidRequestException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.policy.dto.*;
import com.insurance.policy.entity.InsurancePolicy;
import com.insurance.policy.entity.PolicyPurchase;
import com.insurance.policy.kafka.PolicyEventPublisher;
import com.insurance.policy.mapper.PolicyMapper;
import com.insurance.policy.repository.PolicyRepository;
import com.insurance.policy.repository.PurchaseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class PolicyServiceImpl implements PolicyService {

    private static final Logger log = LoggerFactory.getLogger(PolicyServiceImpl.class);
    private static final AtomicInteger POLICY_COUNTER = new AtomicInteger(1000);
    private static final AtomicInteger PURCHASE_COUNTER = new AtomicInteger(1000);

    private final PolicyRepository policyRepository;
    private final PurchaseRepository purchaseRepository;
    private final PolicyMapper policyMapper;

    @Autowired(required = false)
    private PolicyEventPublisher eventPublisher;

    public PolicyServiceImpl(PolicyRepository policyRepository,
                             PurchaseRepository purchaseRepository,
                             PolicyMapper policyMapper) {
        this.policyRepository = policyRepository;
        this.purchaseRepository = purchaseRepository;
        this.policyMapper = policyMapper;
    }

    @Override
    @Transactional
    public PolicyResponse createPolicy(CreatePolicyRequest request) {
        log.info("Creating policy: {}", request.getPolicyName());

        String policyNumber = generatePolicyNumber();

        InsurancePolicy policy = InsurancePolicy.builder()
                .policyNumber(policyNumber)
                .policyName(request.getPolicyName())
                .policyType(request.getPolicyType())
                .description(request.getDescription())
                .coverageAmount(request.getCoverageAmount())
                .basePremium(request.getBasePremium())
                .duration(request.getDuration())
                .status(InsurancePolicy.PolicyStatus.ACTIVE)
                .benefits(request.getBenefits())
                .exclusions(request.getExclusions())
                .build();

        policy = policyRepository.save(policy);
        log.info("Policy created successfully: {}", policy.getPolicyNumber());

        return policyMapper.toPolicyResponse(policy);
    }

    @Override
    @Transactional
    public PolicyResponse updatePolicy(Long id, UpdatePolicyRequest request) {
        log.info("Updating policy: {}", id);

        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy", "id", id));

        if (request.getPolicyName() != null) policy.setPolicyName(request.getPolicyName());
        if (request.getPolicyType() != null) policy.setPolicyType(request.getPolicyType());
        if (request.getDescription() != null) policy.setDescription(request.getDescription());
        if (request.getCoverageAmount() != null) policy.setCoverageAmount(request.getCoverageAmount());
        if (request.getBasePremium() != null) policy.setBasePremium(request.getBasePremium());
        if (request.getDuration() != null) policy.setDuration(request.getDuration());
        if (request.getBenefits() != null) policy.setBenefits(request.getBenefits());
        if (request.getExclusions() != null) policy.setExclusions(request.getExclusions());
        if (request.getStatus() != null) {
            policy.setStatus(InsurancePolicy.PolicyStatus.valueOf(request.getStatus().toUpperCase()));
        }

        policy = policyRepository.save(policy);
        return policyMapper.toPolicyResponse(policy);
    }

    @Override
    public PolicyResponse getPolicyById(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy", "id", id));
        return policyMapper.toPolicyResponse(policy);
    }

    @Override
    public PaginatedResponse<PolicyResponse> getAllPolicies(int page, int size, String type, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<InsurancePolicy> policies;

        if (type != null && !type.isEmpty()) {
            policies = policyRepository.findByPolicyType(type, pageable);
        } else if (status != null && !status.isEmpty()) {
            policies = policyRepository.findByStatus(
                    InsurancePolicy.PolicyStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            policies = policyRepository.findAll(pageable);
        }

        return PaginatedResponse.<PolicyResponse>builder()
                .content(policies.getContent().stream().map(policyMapper::toPolicyResponse).toList())
                .page(policies.getNumber())
                .size(policies.getSize())
                .totalElements(policies.getTotalElements())
                .totalPages(policies.getTotalPages())
                .last(policies.isLast())
                .build();
    }

    @Override
    public PaginatedResponse<PolicyResponse> getActivePolicies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<InsurancePolicy> policies = policyRepository.findByStatus(InsurancePolicy.PolicyStatus.ACTIVE, pageable);

        return PaginatedResponse.<PolicyResponse>builder()
                .content(policies.getContent().stream().map(policyMapper::toPolicyResponse).toList())
                .page(policies.getNumber())
                .size(policies.getSize())
                .totalElements(policies.getTotalElements())
                .totalPages(policies.getTotalPages())
                .last(policies.isLast())
                .build();
    }

    @Override
    @Transactional
    public void deletePolicy(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy", "id", id));
        policy.setStatus(InsurancePolicy.PolicyStatus.DISCONTINUED);
        policyRepository.save(policy);
        log.info("Policy discontinued: {}", policy.getPolicyNumber());
    }

    @Override
    @Transactional
    public PurchaseResponse purchasePolicy(PurchasePolicyRequest request) {
        log.info("Processing policy purchase for customer: {}, policy: {}",
                request.getCustomerId(), request.getPolicyId());

        InsurancePolicy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy", "id", request.getPolicyId()));

        if (policy.getStatus() != InsurancePolicy.PolicyStatus.ACTIVE) {
            throw new BusinessException("Policy is not available for purchase", "POLICY_INACTIVE");
        }

        if (purchaseRepository.existsByCustomerIdAndPolicyIdAndStatus(
                request.getCustomerId(), request.getPolicyId(), PolicyPurchase.PurchaseStatus.ACTIVE)) {
            throw new BusinessException("Customer already has an active policy for this insurance type",
                    "DUPLICATE_PURCHASE");
        }

        String purchaseNumber = generatePurchaseNumber();
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(policy.getDuration());

        PolicyPurchase purchase = PolicyPurchase.builder()
                .purchaseNumber(purchaseNumber)
                .customerId(request.getCustomerId())
                .policyId(request.getPolicyId())
                .quoteId(request.getQuoteId())
                .premium(request.getPremium())
                .startDate(startDate)
                .endDate(endDate)
                .status(PolicyPurchase.PurchaseStatus.PENDING_PAYMENT)
                .build();

        purchase = purchaseRepository.save(purchase);

        if (eventPublisher != null) {
            try {
                PolicyPurchasedEvent event = PolicyPurchasedEvent.create(
                        purchase.getId(), purchase.getPurchaseNumber(),
                        purchase.getCustomerId(), null,
                        policy.getId(), policy.getPolicyName(),
                        purchase.getQuoteId(), purchase.getPremium(),
                        purchase.getStartDate(), purchase.getEndDate());
                eventPublisher.publishPolicyPurchasedEvent(event);
            } catch (Exception e) {
                log.warn("Could not publish Kafka event: {}", e.getMessage());
            }
        }

        log.info("Policy purchase recorded: {}", purchaseNumber);
        return policyMapper.toPurchaseResponse(purchase, policy.getPolicyName());
    }

    @Override
    public PaginatedResponse<PurchaseResponse> getAllPurchases(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PolicyPurchase> purchases = purchaseRepository.findAll(pageable);

        return PaginatedResponse.<PurchaseResponse>builder()
                .content(purchases.getContent().stream()
                        .map(p -> {
                            String policyName = policyRepository.findById(p.getPolicyId())
                                    .map(InsurancePolicy::getPolicyName).orElse("Unknown");
                            return policyMapper.toPurchaseResponse(p, policyName);
                        })
                        .toList())
                .page(purchases.getNumber())
                .size(purchases.getSize())
                .totalElements(purchases.getTotalElements())
                .totalPages(purchases.getTotalPages())
                .last(purchases.isLast())
                .build();
    }

    @Override
    public PurchaseResponse getPurchaseById(Long id) {
        PolicyPurchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase", "id", id));
        String policyName = policyRepository.findById(purchase.getPolicyId())
                .map(InsurancePolicy::getPolicyName).orElse("Unknown");
        return policyMapper.toPurchaseResponse(purchase, policyName);
    }

    @Override
    public PaginatedResponse<PurchaseResponse> getPurchasesByCustomer(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PolicyPurchase> purchases = purchaseRepository.findByCustomerId(customerId, pageable);

        return PaginatedResponse.<PurchaseResponse>builder()
                .content(purchases.getContent().stream()
                        .map(p -> {
                            String policyName = policyRepository.findById(p.getPolicyId())
                                    .map(InsurancePolicy::getPolicyName).orElse("Unknown");
                            return policyMapper.toPurchaseResponse(p, policyName);
                        })
                        .toList())
                .page(purchases.getNumber())
                .size(purchases.getSize())
                .totalElements(purchases.getTotalElements())
                .totalPages(purchases.getTotalPages())
                .last(purchases.isLast())
                .build();
    }

    private String generatePolicyNumber() {
        return "POL-" + String.format("%06d", POLICY_COUNTER.getAndIncrement());
    }

    private String generatePurchaseNumber() {
        return "PUR-" + String.format("%06d", PURCHASE_COUNTER.getAndIncrement());
    }
}
