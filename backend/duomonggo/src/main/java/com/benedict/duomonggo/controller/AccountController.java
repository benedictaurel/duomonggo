package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.*;
import com.benedict.duomonggo.service.AccountService;
import com.benedict.duomonggo.service.UserProgressService;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    private final AccountService accountService;
    private final UserProgressService userProgressService;

    @Autowired
    public AccountController(AccountService accountService, UserProgressService userProgressService) {
        this.accountService = accountService;
        this.userProgressService = userProgressService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<Account>> getAccount(@PathVariable Long id) {
        Optional<Account> account = accountService.getAccountById(id);
        return account.map(value -> ResponseEntity.ok(new BaseResponse<>(true, "Account found", value)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Account not found", null)));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<Account>>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(new BaseResponse<>(true, "Accounts found", accounts));
    }

    @PostMapping("/register")
    public ResponseEntity<BaseResponse<Account>> createAccount(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");
            String email = (String) payload.get("email");
            Role role = Role.valueOf(((String) payload.get("role")).toUpperCase());

            if (accountService.getAccountByUsername(username) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new BaseResponse<>(false, "Username already exists", null));
            }

            if (accountService.getAccountByEmail(email) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(new BaseResponse<>(false, "Email already exists", null));
            }

            Account account = accountService.createAccount(username, password, email, role);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new BaseResponse<>(true, "Account created successfully", account));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false, "Failed to create account: " + e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<Account>> login(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");

            Account account = accountService.getAccountByUsername(username);
            if (account == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new BaseResponse<>(false, "Invalid username or password", null));
            }

            if (accountService.authenticateAccount(username, password)) {
                return ResponseEntity.ok(new BaseResponse<>(true, "Login successful", account));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new BaseResponse<>(false, "Invalid username or password", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false, "Login failed: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<Account>> updateAccount(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Optional<Account> optionalAccount = accountService.getAccountById(id);
            if (optionalAccount.isPresent()) {
                String username = null;
                String email = null;
                Role role = null;
                Integer exp = null;

                if (payload.containsKey("username")) {
                    username = (String) payload.get("username");
                    Account existingWithUsername = accountService.getAccountByUsername(username);
                    if (existingWithUsername != null && !existingWithUsername.getId().equals(id)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new BaseResponse<>(false, "Username already exists", null));
                    }
                }

                if (payload.containsKey("email")) {
                    email = (String) payload.get("email");
                    Account existingWithEmail = accountService.getAccountByEmail(email);
                    if (existingWithEmail != null && !existingWithEmail.getId().equals(id)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new BaseResponse<>(false, "Email already exists", null));
                    }
                }

                if (payload.containsKey("role")) {
                    role = Role.valueOf(((String) payload.get("role")).toUpperCase());
                }

                if (payload.containsKey("exp")) {
                    exp = Integer.parseInt(payload.get("exp").toString());
                }

                if (payload.containsKey("password")) {
                    String newPassword = (String) payload.get("password");
                    accountService.updatePassword(id, newPassword);
                }

                Account updatedAccount = accountService.updateAccount(id, username, email, role, exp);
                return ResponseEntity.ok(new BaseResponse<>(true, "Account updated successfully", updatedAccount));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Account not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false, "Failed to update account: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<String>> deleteAccount(@PathVariable Long id) {
        try {
            if (accountService.deleteAccount(id)) {
                return ResponseEntity.ok(new BaseResponse<>(true, "Account deleted successfully",
                        "Account with ID: " + id + " was deleted"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new BaseResponse<>(false, "Account not found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BaseResponse<>(false, "Failed to delete account: " + e.getMessage(), null));
        }
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getAdminDashboard() {
        try {
            List<Account> accounts = accountService.getAllAccounts();

            // Extract relevant information for the dashboard
            List<Map<String, Object>> userList = new ArrayList<>();
            for (Account account : accounts) {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", account.getId());
                userInfo.put("username", account.getUsername());
                userInfo.put("email", account.getEmail());
                userInfo.put("exp", account.getExp());
                userInfo.put("role", account.getRole());
                userInfo.put("createdAt", account.getCreatedAt());

                // Add user progress stats if needed
                long completedCourses = userProgressService.getCompletedCoursesCount(account.getId());
                userInfo.put("completedCourses", completedCourses);

                userList.add(userInfo);
            }

            Map<String, Object> dashboardData = new HashMap<>();
            dashboardData.put("totalUsers", accounts.size());
            dashboardData.put("users", userList);

            return ResponseEntity.ok(new BaseResponse<>(true, "Dashboard data retrieved successfully", dashboardData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new BaseResponse<>(false, "Failed to retrieve dashboard data: " + e.getMessage(), null));
        }
    }
}
