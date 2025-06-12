package com.benedict.duomonggo.config;

import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

import java.util.TimeZone;

@Configuration
public class TimeZoneConfig {
    
    @PostConstruct
    public void init() {
        // Set the default time zone to Bangkok (Asia/Bangkok)
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Bangkok"));
    }
}
