package com.chat.configuration;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.chat.exceptions.*;

@ControllerAdvice
public class GlobalExceptionHandling {

	 @ExceptionHandler(Exception.class)
	    public ResponseEntity<String> catchAny(Exception ex) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
	    }
	 
	 @ExceptionHandler(AuthException.class)
	    public ResponseEntity<String> catchAuthException(AuthException ex) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	    }
	 
	 @ExceptionHandler(CreationException.class)
	    public ResponseEntity<String> catchCreationException(CreationException ex) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	    }
	 
	 @ExceptionHandler(GroupException.class)
	    public ResponseEntity<String> catchCreationException(GroupException ex) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	    }
	 @ExceptionHandler(RoutingException .class)
	    public ResponseEntity<String> catchCreationException(RoutingException  ex) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	    }
	 @ExceptionHandler(QueueException .class)
	    public ResponseEntity<String> catchQueueException(QueueException  ex) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
	    }
	
}
