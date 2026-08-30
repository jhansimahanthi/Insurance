package com.insurance.user.service;

import com.insurance.common.exception.BusinessException;
import com.insurance.common.exception.DuplicateResourceException;
import com.insurance.common.exception.ResourceNotFoundException;
import com.insurance.user.dto.*;
import com.insurance.user.entity.User;
import com.insurance.user.kafka.UserEventPublisher;
import com.insurance.user.mapper.UserMapper;
import com.insurance.user.repository.UserRepository;
import com.insurance.user.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private UserMapper userMapper;
    @Mock private UserEventPublisher eventPublisher;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks private UserServiceImpl userService;

    private User testUser;
    private UserResponse testUserResponse;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L).firstName("John").lastName("Doe")
                .email("john@example.com").password("encodedPassword")
                .phone("+1234567890").role(User.Role.CUSTOMER)
                .status(User.UserStatus.ACTIVE).createdAt(LocalDateTime.now())
                .build();
        testUserResponse = UserResponse.builder()
                .id(1L).firstName("John").lastName("Doe")
                .email("john@example.com").phone("+1234567890")
                .role("CUSTOMER").status("ACTIVE").build();
    }

    @Test
    void register_success() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("John"); request.setLastName("Doe");
        request.setEmail("john@example.com"); request.setPhone("+1234567890");
        request.setPassword("Password123!"); request.setConfirmPassword("Password123!");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateToken("john@example.com", "CUSTOMER")).thenReturn("test-token");

        AuthResponse response = userService.register(request);

        assertNotNull(response);
        assertEquals("test-token", response.getToken());
        assertEquals("CUSTOMER", response.getRole());
        verify(eventPublisher).publishCustomerRegisteredEvent(any());
    }

    @Test
    void register_passwordMismatch_throwsBusinessException() {
        RegisterRequest request = new RegisterRequest();
        request.setPassword("Password1!"); request.setConfirmPassword("Different!");

        assertThrows(BusinessException.class, () -> userService.register(request));
    }

    @Test
    void register_duplicateEmail_throwsDuplicateResource() {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("John"); request.setLastName("Doe");
        request.setEmail("john@example.com"); request.setPhone("+1234567890");
        request.setPassword("Password1!"); request.setConfirmPassword("Password1!");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> userService.register(request));
    }

    @Test
    void login_success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com"); request.setPassword("Password1!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateToken("john@example.com", "CUSTOMER")).thenReturn("test-token");

        AuthResponse response = userService.login(request);

        assertNotNull(response);
        assertEquals("test-token", response.getToken());
    }

    @Test
    void login_inactiveAccount_throwsBusinessException() {
        testUser.setStatus(User.UserStatus.INACTIVE);
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com"); request.setPassword("Password1!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));

        assertThrows(BusinessException.class, () -> userService.login(request));
    }

    @Test
    void getProfile_success() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(userMapper.toResponse(testUser)).thenReturn(testUserResponse);

        UserResponse response = userService.getProfile("john@example.com");

        assertEquals("John", response.getFirstName());
    }

    @Test
    void getProfile_userNotFound_throwsException() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getProfile("missing@example.com"));
    }

    @Test
    void getAllCustomers_withSearch() {
        Page<User> page = new PageImpl<>(List.of(testUser));
        when(userRepository.findByFirstNameContainingOrLastNameContainingOrEmailContaining(
                anyString(), anyString(), anyString(), any()))
                .thenReturn(page);
        when(userMapper.toResponse(testUser)).thenReturn(testUserResponse);

        var result = userService.getAllCustomers(0, 10, "John");

        assertEquals(1, result.getContent().size());
        assertEquals(1L, result.getTotalElements());
    }

    @Test
    void getAllCustomers_noSearch() {
        Page<User> page = new PageImpl<>(List.of(testUser));
        when(userRepository.findByRole(any(User.Role.class), any())).thenReturn(page);
        when(userMapper.toResponse(testUser)).thenReturn(testUserResponse);

        var result = userService.getAllCustomers(0, 10, null);

        assertEquals(1, result.getContent().size());
    }
}
