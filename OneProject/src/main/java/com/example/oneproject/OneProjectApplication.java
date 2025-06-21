package com.example.oneproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication(scanBasePackages = "com.example.oneproject")
public class OneProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(OneProjectApplication.class, args);
    }

}
