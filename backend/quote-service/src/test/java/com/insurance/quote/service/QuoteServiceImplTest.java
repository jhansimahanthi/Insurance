package com.insurance.quote.service;

import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.quote.client.PolicyServiceClient;
import com.insurance.quote.dto.CreateQuoteRequest;
import com.insurance.quote.dto.QuoteResponse;
import com.insurance.quote.entity.Quote;
import com.insurance.quote.kafka.QuoteEventPublisher;
import com.insurance.quote.mapper.QuoteMapper;
import com.insurance.quote.repository.QuoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuoteServiceImplTest {

    @Mock private QuoteRepository quoteRepository;
    @Mock private PolicyServiceClient policyServiceClient;
    @Mock private PremiumCalculator premiumCalculator;
    @Mock private QuoteMapper quoteMapper;
    @Mock private QuoteEventPublisher eventPublisher;

    @InjectMocks private QuoteServiceImpl quoteService;

    private Quote testQuote;
    private QuoteResponse testResponse;
    private Map<String, Object> policyData;

    @BeforeEach
    void setUp() {
        testQuote = Quote.builder()
                .id(1L).quoteNumber("QT-000001").customerId(1L).policyId(1L)
                .age(30).coverageAmount(new BigDecimal("100000.00"))
                .duration(12).riskLevel("LOW")
                .calculatedPremium(new BigDecimal("150.00"))
                .status(Quote.QuoteStatus.PENDING).createdAt(LocalDateTime.now())
                .build();
        testResponse = QuoteResponse.builder()
                .id(1L).quoteNumber("QT-000001").customerId(1L).policyId(1L)
                .policyName("Auto Insurance").age(30)
                .coverageAmount(new BigDecimal("100000.00")).duration(12)
                .riskLevel("LOW").calculatedPremium(new BigDecimal("150.00"))
                .status("PENDING").build();
        policyData = new HashMap<>();
        policyData.put("basePremium", new BigDecimal("100.00"));
        policyData.put("policyName", "Auto Insurance");
    }

    @Test
    void generateQuote_success() {
        CreateQuoteRequest request = new CreateQuoteRequest();
        request.setCustomerId(1L); request.setPolicyId(1L);
        request.setAge(30); request.setCoverageAmount(new BigDecimal("100000.00"));
        request.setDuration(12);

        when(policyServiceClient.getPolicyById(1L)).thenReturn(policyData);
        when(premiumCalculator.calculate(any(), eq(30), any(), eq(12)))
                .thenReturn(new BigDecimal("150.00"));
        when(premiumCalculator.determineRiskLevel(any(), eq(30), any())).thenReturn("LOW");
        when(quoteRepository.save(any(Quote.class))).thenReturn(testQuote);
        when(quoteMapper.toResponse(any(Quote.class), eq("Auto Insurance"))).thenReturn(testResponse);

        QuoteResponse response = quoteService.generateQuote(request);

        assertNotNull(response);
        assertEquals("QT-000001", response.getQuoteNumber());
        verify(eventPublisher).publishQuoteGeneratedEvent(any());
    }

    @Test
    void generateQuote_policyNotFound_throwsException() {
        CreateQuoteRequest request = new CreateQuoteRequest();
        request.setCustomerId(1L); request.setPolicyId(99L);
        request.setAge(30); request.setCoverageAmount(new BigDecimal("100000.00"));
        request.setDuration(12);

        when(policyServiceClient.getPolicyById(99L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> quoteService.generateQuote(request));
    }

    @Test
    void getQuoteById_success() {
        when(quoteRepository.findById(1L)).thenReturn(Optional.of(testQuote));
        when(policyServiceClient.getPolicyById(1L)).thenReturn(policyData);
        when(quoteMapper.toResponse(testQuote, "Auto Insurance")).thenReturn(testResponse);

        QuoteResponse response = quoteService.getQuoteById(1L);

        assertEquals("QT-000001", response.getQuoteNumber());
    }

    @Test
    void getQuoteById_notFound_throwsException() {
        when(quoteRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> quoteService.getQuoteById(99L));
    }
}
