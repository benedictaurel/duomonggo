package com.benedict.duomonggo.controller;

import com.benedict.duomonggo.model.*;
import com.benedict.duomonggo.service.AccountService;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/accounts")
public class AccountController {
    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
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

            Role role;
            if (payload.get("role") != null) {
                role = Role.valueOf(((String) payload.get("role")).toUpperCase());
            } else {
                role = Role.USER;
            }

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

    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<BaseResponse<Account>> updateAccount(
            @PathVariable Long id,
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Optional<Account> optionalAccount = accountService.getAccountById(id);
            if (optionalAccount.isPresent()) {
                if (username != null && !username.isEmpty()) {
                    Account existingAccount = accountService.getAccountByUsername(username);
                    if (existingAccount != null && !existingAccount.getId().equals(id)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new BaseResponse<>(false, "Username already exists", null));
                    }
                }

                if (email != null && !email.isEmpty()) {
                    Account existingAccount = accountService.getAccountByEmail(email);
                    if (existingAccount != null && !existingAccount.getId().equals(id)) {
                        return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new BaseResponse<>(false, "Email already exists", null));
                    }
                }

                Account account = optionalAccount.get();
                Role role = account.getRole();
                Integer exp = account.getExp();

                Account updatedAccount = accountService.updateAccount(id, username, email, role, exp, image, password);

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
}
