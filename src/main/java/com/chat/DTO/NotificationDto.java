package com.chat.DTO;

import com.chat.DTO.UserDto.CreateOutput;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
public class NotificationDto <T>{
	
	private NotificationType type;
	
	private String title;
    
	private T content;
    
	private String message;
    
	private String session;
    
    public enum NotificationType{
		SUCCESS, INFO, ERROR, WARNING
	}

}
