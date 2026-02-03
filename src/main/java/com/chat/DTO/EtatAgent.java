package com.chat.DTO;

import com.chat.model.ResponderUser.UserState;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EtatAgent {
	
	private UserState etat;
	
	public enum UserState{
		FREE, BUSY
	}
}
