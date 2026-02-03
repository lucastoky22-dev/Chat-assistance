package com.chat.DTO;

import com.chat.DTO.EtatAgent.UserState;
import com.chat.repositories.UserRepositories;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

public class UserDto {
	@Getter
	@Setter
	public static class CreateInput{
		
		private String nom;
		
		private String matricule;
		
		private String numero;
		
		private String email;
		
		private String motDePasse;
	}
	@Getter
	@Setter	
	public static class AuthInput{
		
		private String matricule;
		
		private String motDePasse;

	}
	
	@Getter
	@Setter
	public static class UpdateInput extends CreateInput{
		private Long id;
	}
	@Getter
	@Setter
	@AllArgsConstructor
	public static class CreateOutput{
		
		private String httpSession;
		
		private String nom;
		
		private String matricule;
		
		private String email;
		
		private String numero;
		
		private String motDePasse;
	}
	@Getter
	@Setter
	@AllArgsConstructor
	public static class DashboardOutput {


		private Long id;
		
		private String nom;
		
		private String matricule;
		
		private String email;
		
		private String numero;
		
		private String motDePasse;
		
		private boolean isAdmin;
		
		private boolean isConneected;
		
		private String etat;
		
		private String groupName;
	}
	@Getter
	@Setter
	@AllArgsConstructor
	public static class GroupOutput {


		private Long id;
		
		private String nom;
		
		private String matricule;
		
		private String email;
		
		private String numero;
		
		private String motDePasse;
		
		private boolean isAdmin;
		
		private boolean isConneected;
		
		private com.chat.DTO.EtatAgent.UserState state;
		
		private String groupName;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	public static class AgentOutput {
		
		private String nom;
		
		private String email;
	}
	
	
	
}
