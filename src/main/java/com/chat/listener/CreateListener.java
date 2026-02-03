package com.chat.listener;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.chat.DTO.NotificationDto;
import com.chat.DTO.UserDto;
import com.chat.events.CreateUserEvents;
import com.chat.services.AdminService;
import com.chat.services.NotificationServices;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class CreateListener { 
	
	private AdminService adminSer;
	
	private  NotificationServices notif;
	
	@EventListener
	public void createValidation(CreateUserEvents e){
		
		String admin = adminSer.findAdmin();
		
		UserDto.CreateOutput payload = new UserDto.CreateOutput(e.getHttpSessionId(), e.getNom(), e.getMatricule(), e.getEmail(), e.getNumero(), e.getMotDePasse());
	
		NotificationDto<UserDto.CreateOutput> notification = new NotificationDto<>(
				NotificationDto.NotificationType.INFO, 
				"Demande de validation",
				payload,
				"inscription",
				e.getHttpSessionId()
				);
		
		notif.createNotif(admin, notification);
		
	}

}
