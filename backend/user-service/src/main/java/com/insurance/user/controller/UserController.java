package com.insurance.user.controller;

import com.insurance.common.dto.ApiResponse;
import com.insurance.common.dto.PaginatedResponse;
import com.insurance.user.dto.UpdateUserRequest;
import com.insurance.user.dto.UserResponse;
import com.insurance.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(Authentication authentication) {
        UserResponse response = userService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping("/users/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID (admin)")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", response));
    }

    @PutMapping("/admin/customers/{id}")
    @Operation(summary = "Update customer details (admin)")
    public ResponseEntity<ApiResponse<UserResponse>> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", response));
    }

    @PutMapping("/admin/customers/{id}/status")
    @Operation(summary = "Update customer status (admin)")
    public ResponseEntity<ApiResponse<UserResponse>> updateCustomerStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        UserResponse response = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Customer status updated successfully", response));
    }

    @GetMapping("/admin/customers")
    @Operation(summary = "Get all customers (admin)")
    public ResponseEntity<ApiResponse<PaginatedResponse<UserResponse>>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PaginatedResponse<UserResponse> response = userService.getAllCustomers(page, size, search);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", response));
    }

    @GetMapping("/admin/users")
    @Operation(summary = "Get all users (admin)")
    public ResponseEntity<ApiResponse<PaginatedResponse<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PaginatedResponse<UserResponse> response = userService.getAllUsers(page, size);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", response));
    }
}
