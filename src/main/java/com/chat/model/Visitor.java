package com.chat.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class Visitor {
	
	String session;
	
	String email;
	
	@Override
	public String toString() {
		return "Visitor session : " + this.getSession() + "email: " + this.email;
	}
}
