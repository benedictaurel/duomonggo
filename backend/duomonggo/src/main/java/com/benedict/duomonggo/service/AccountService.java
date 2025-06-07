package com.benedict.duomonggo.service;

import com.benedict.duomonggo.model.Account;
import com.benedict.duomonggo.model.Role;
import com.benedict.duomonggo.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AccountService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
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
        Account account = new Account(username, hashedPassword, email, role, 0);
        return accountRepository.save(account);
    }

    @Transactional
    public Account updateAccount(Long id, String username, String email, Role role, Integer exp) {
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
            return accountRepository.save(account);
        }
        return null;
    }

    @Transactional
    public Account updatePassword(Long id, String newPassword) {
        Optional<Account> optionalAccount = accountRepository.findById(id);
        if (optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            account.setPassword(passwordEncoder.encode(newPassword));
            return accountRepository.save(account);
        }
        return null;
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

    @Transactional
    public Account addExperiencePoints(Long id, Integer additionalExp) {
        Optional<Account> optionalAccount = accountRepository.findById(id);
        if (optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            account.setExp(account.getExp() + additionalExp);
            return accountRepository.save(account);
        }
        return null;
    }
}
