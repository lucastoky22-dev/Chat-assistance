package com.chat.exceptions;

public class AuthException extends RuntimeException {
	
	public AuthException(String errorMessage) {
		
		super(errorMessage);
		
	}
}
