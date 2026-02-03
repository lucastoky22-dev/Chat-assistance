package com.chat.DTO;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
public class LoginDto {

	private String session;
	
	private String login;
	
}
