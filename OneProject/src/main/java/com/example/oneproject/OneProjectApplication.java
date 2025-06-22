package com.example.oneproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
public class OneProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(OneProjectApplication.class, args);
    }

    @Bean
    public CommandLineRunner printMappings(@Qualifier("requestMappingHandlerMapping") RequestMappingHandlerMapping mapping) {
        return args -> {
            System.out.println("🔍 등록된 RequestMapping 목록:");
            mapping.getHandlerMethods().forEach((info, method) -> {
                System.out.println("🔗 " + info + " -> " +
                        method.getBeanType().getSimpleName() + "#" + method.getMethod().getName());
            });
        };
    }
}

