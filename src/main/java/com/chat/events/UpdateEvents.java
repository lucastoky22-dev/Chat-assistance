package com.chat.events;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateEvents {
	private Long id;
	private String nom;
    private String matricule;
	private String numero;
	private String email;
	private String motDePasse;
	
}
