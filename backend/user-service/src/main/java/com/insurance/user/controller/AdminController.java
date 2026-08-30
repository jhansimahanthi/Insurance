package com.insurance.user.controller;

import com.insurance.common.dto.ApiResponse;
import com.insurance.common.dto.PaginatedResponse;
import com.insurance.user.dto.UserResponse;
import com.insurance.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard stats")
    public ResponseEntity<ApiResponse<java.util.Map<String, Object>>> getDashboard() {
        PaginatedResponse<UserResponse> customers = userService.getAllCustomers(0, 1, null);
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalCustomers", customers.getTotalElements());
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @GetMapping("/customers")
    @Operation(summary = "Get all customers")
    public ResponseEntity<ApiResponse<PaginatedResponse<UserResponse>>> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        PaginatedResponse<UserResponse> response = userService.getAllCustomers(page, size, search);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", response));
    }

    @GetMapping("/customers/{id}")
    @Operation(summary = "Get customer by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getCustomerById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", response));
    }

    @PutMapping("/customers/{id}")
    @Operation(summary = "Update customer")
    public ResponseEntity<ApiResponse<UserResponse>> updateCustomer(
            @PathVariable Long id,
            @RequestBody com.insurance.user.dto.UpdateUserRequest request) {
        UserResponse response = userService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", response));
    }
}
