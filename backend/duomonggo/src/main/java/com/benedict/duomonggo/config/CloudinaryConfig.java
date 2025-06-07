package com.benedict.duomonggo.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dmmevnad5");
        config.put("api_key", "839983149331922");
        config.put("api_secret", "iOunzlGhJf6VAVdaawTHb0NBnM0");
        config.put("secure", "true");

        return new Cloudinary(config);
    }
}
