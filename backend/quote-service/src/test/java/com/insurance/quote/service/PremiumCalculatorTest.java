package com.insurance.quote.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PremiumCalculatorTest {

    @InjectMocks
    private PremiumCalculator calculator;

    @Test
    void calculate_youngAdult_lowCoverage() {
        BigDecimal basePremium = new BigDecimal("100.00");
        BigDecimal coverageAmount = new BigDecimal("50000.00");
        BigDecimal result = calculator.calculate(basePremium, 25, coverageAmount, 12);

        assertNotNull(result);
        assertTrue(result.compareTo(BigDecimal.ZERO) > 0, "Premium must be positive");
    }

    @Test
    void calculate_ageAffectsPremium() {
        BigDecimal basePremium = new BigDecimal("100.00");
        BigDecimal coverageAmount = new BigDecimal("100000.00");
        BigDecimal result30 = calculator.calculate(basePremium, 30, coverageAmount, 12);
        BigDecimal result55 = calculator.calculate(basePremium, 55, coverageAmount, 12);

        assertTrue(result55.compareTo(result30) > 0,
                "Age 55 premium should be higher than age 30 premium");
    }

    @Test
    void calculate_higherCoverage_higherPremium() {
        BigDecimal basePremium = new BigDecimal("100.00");
        BigDecimal resultLow = calculator.calculate(basePremium, 30, new BigDecimal("50000.00"), 12);
        BigDecimal resultHigh = calculator.calculate(basePremium, 30, new BigDecimal("200000.00"), 12);

        assertTrue(resultHigh.compareTo(resultLow) > 0,
                "Higher coverage should result in higher premium");
    }

    @Test
    void calculate_minimumPremium() {
        BigDecimal basePremium = new BigDecimal("10.00");
        BigDecimal result = calculator.calculate(basePremium, 25, new BigDecimal("1000.00"), 1);

        assertTrue(result.compareTo(new BigDecimal("50.00")) >= 0,
                "Premium should never go below minimum of $50");
    }

    @Test
    void calculate_shorterDuration_lowerPremium() {
        BigDecimal basePremium = new BigDecimal("100.00");
        BigDecimal coverage = new BigDecimal("100000.00");
        BigDecimal result6 = calculator.calculate(basePremium, 30, coverage, 6);
        BigDecimal result12 = calculator.calculate(basePremium, 30, coverage, 12);

        assertTrue(result12.compareTo(result6) > 0,
                "12-month premium should be higher than 6-month premium");
    }

    @Test
    void calculate_seniorHighestAgeFactor() {
        BigDecimal basePremium = new BigDecimal("100.00");
        BigDecimal coverage = new BigDecimal("100000.00");
        BigDecimal result25 = calculator.calculate(basePremium, 25, coverage, 12);
        BigDecimal result70 = calculator.calculate(basePremium, 70, coverage, 12);

        assertTrue(result70.compareTo(result25) > 0,
                "Age 70 should have higher premium due to age factor");
    }

    @Test
    void determineRiskLevel_youngLowCoverage() {
        String risk = calculator.determineRiskLevel(new BigDecimal("500.00"), 25, new BigDecimal("50000.00"));
        assertNotNull(risk);
        assertTrue(List.of("LOW", "MEDIUM", "HIGH").contains(risk));
    }

    @Test
    void determineRiskLevel_oldHighCoverage_high() {
        String risk = calculator.determineRiskLevel(new BigDecimal("100.00"), 60, new BigDecimal("500000.00"));
        assertEquals("HIGH", risk);
    }

    @Test
    void determineRiskLevel_validResult() {
        String risk = calculator.determineRiskLevel(new BigDecimal("100.00"), 40, new BigDecimal("200000.00"));
        assertNotNull(risk);
        assertTrue(List.of("LOW", "MEDIUM", "HIGH").contains(risk));
    }

    @Test
    void calculate_resultHasTwoDecimalPlaces() {
        BigDecimal result = calculator.calculate(new BigDecimal("100.00"), 30, new BigDecimal("100000.00"), 12);
        assertEquals(2, result.scale(), "Premium should have 2 decimal places");
    }
}
