package com.benedict.duomonggo.service;

import com.benedict.duomonggo.model.Account;
import com.benedict.duomonggo.model.Role;
import com.benedict.duomonggo.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder, CloudinaryService cloudinaryService) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.cloudinaryService = cloudinaryService;
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Optional<Account> getAccountById(Long id) {
        return accountRepository.findById(id);
    }

    public Account getAccountByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    public Account getAccountByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    @Transactional
    public Account createAccount(String username, String password, String email, Role role) {
        String hashedPassword = passwordEncoder.encode(password);
        Account account = new Account(username, hashedPassword, email, role, 0, null);
        return accountRepository.save(account);
    }

    @Transactional
    public Account updateAccount(Long id, String username, String email, Role role, Integer exp, MultipartFile image, String password) {
        try {
            Optional<Account> optionalAccount = accountRepository.findById(id);
            if (optionalAccount.isPresent()) {
                Account account = optionalAccount.get();
                if (username != null) {
                    account.setUsername(username);
                }
                if (email != null) {
                    account.setEmail(email);
                }
                if (role != null) {
                    account.setRole(role);
                }
                if (exp != null) {
                    account.setExp(exp);
                }
                if (password != null) {
                    account.setPassword(passwordEncoder.encode(password));
                }

                // Handle image upload
                if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image, "accounts");
                    account.setImageUrl(imageUrl);
                }

                return accountRepository.save(account);
            }
            return null;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    @Transactional
    public boolean deleteAccount(Long id) {
        if (accountRepository.existsById(id)) {
            accountRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean authenticateAccount(String username, String password) {
        Account account = accountRepository.findByUsername(username);
        return account != null && passwordEncoder.matches(password, account.getPassword());
    }
}
