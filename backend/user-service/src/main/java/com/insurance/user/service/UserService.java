package com.insurance.user.service;

import com.insurance.common.dto.PaginatedResponse;
import com.insurance.user.dto.*;
import org.springframework.security.core.Authentication;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getProfile(String email);
    UserResponse updateProfile(String email, UpdateUserRequest request);
    PaginatedResponse<UserResponse> getAllCustomers(int page, int size, String search);
    PaginatedResponse<UserResponse> getAllUsers(int page, int size);
    UserResponse getUserById(Long id);
    UserResponse updateUserStatus(Long id, String status);
    UserResponse updateCustomer(Long id, UpdateUserRequest request);
}
