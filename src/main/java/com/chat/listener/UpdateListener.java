package com.chat.listener;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.chat.events.UpdateEvents;
import com.chat.exceptions.CreationException;
import com.chat.model.ResponderUser;
import com.chat.services.AdminService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Component
public class UpdateListener {
	
	private AdminService adminSer;
	
	private SimpMessagingTemplate simpMessage; 
	
	@EventListener
	public ResponderUser updateUser(UpdateEvents e) throws CreationException{
		
		System.out.println("event call");
		
		String admin = adminSer.findAdmin();
		
		ResponderUser u = adminSer.mettreAjour(e.getId(), e.getNom(), e.getMatricule(), e.getNumero(), e.getEmail(), e.getMotDePasse());
		
		simpMessage.convertAndSendToUser(admin, "/dashboard/userData", adminSer.lister());
		
		return u;
	
	}
	
}
