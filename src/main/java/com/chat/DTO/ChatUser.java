package com.chat.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatUser {
	
    private String nom;
    
    private String matricule;
    
    private boolean isAdmin;
    
    private boolean isConnected;
    
}