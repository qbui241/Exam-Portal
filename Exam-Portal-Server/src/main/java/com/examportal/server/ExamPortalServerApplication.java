package com.examportal.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories(basePackages = "com.examportal.server.Repositories")
public class ExamPortalServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExamPortalServerApplication.class, args);
    }

}
