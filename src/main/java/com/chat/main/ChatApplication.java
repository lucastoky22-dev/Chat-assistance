package com.chat.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

//Component scan

@org.springframework.boot.persistence.autoconfigure.EntityScan(basePackages = {
		"com.chat.model"
})
@EnableJpaRepositories(basePackages = {
		"com.chat.repositories" 
})
@SpringBootApplication(scanBasePackages = {
	"com.chat.*", "com.chat.controllers", "com.chat.main"
})
public class ChatApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
	}

}
