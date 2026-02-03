package com.chat.DTO;

import java.util.List;

import com.chat.model.ResponderUser;

import lombok.Getter;
import lombok.Setter;

public class GroupDto {
	@Getter
	@Setter
	public static class PostInput{
		
		private String nom;
		
		private List<ResponderUser> membres;
		
	}
	@Getter
	@Setter
	public static class UpdateInput{
		
		private Long id;
		
		private String nom;
		
		private List<ResponderUser> membres;
		
	}
}
