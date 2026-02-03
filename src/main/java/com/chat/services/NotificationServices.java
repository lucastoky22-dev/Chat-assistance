package com.chat.services;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.chat.DTO.NotificationDto;
import com.chat.DTO.UserDto;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NotificationServices {
	
	private SimpMessagingTemplate simp;
	
	public NotificationDto<UserDto.CreateOutput> createNotif(String adminMtr, NotificationDto<UserDto.CreateOutput> data){
		
		simp.convertAndSendToUser(adminMtr, "/dashboard/notif", data);
		
		return data;
	
	}

}
