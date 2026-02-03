package com.chat.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.chat.DTO.RecaptchaResponse;

@Service
public class RecaptchaService {
	
	@Value("${recaptcha.secret}")
	private String recaptchaSecret;  
	
	private final RestTemplate restTemplate = new RestTemplate();

    public boolean verify(String token) {

        String url = "https://www.google.com/recaptcha/api/siteverify"
                + "?secret=" + recaptchaSecret
                + "&response=" + token;

        RecaptchaResponse response =
            restTemplate.postForObject(url, null, RecaptchaResponse.class);

        return response != null && response.isSuccess();
    }

}
