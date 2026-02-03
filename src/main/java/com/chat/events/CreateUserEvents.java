package com.chat.events;

import com.chat.DTO.EtatAgent;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateUserEvents {
	
	private String httpSessionId;
	
	private String nom;
	
	private String matricule;
	
	private String email;
	
	private String numero;
	
	private String motDePasse;
	
}
