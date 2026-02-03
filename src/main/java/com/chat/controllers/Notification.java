package com.chat.controllers;

import java.util.List;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.chat.DTO.UserDto;
import com.chat.services.UserService;



@Controller
@RequestMapping("/notification")
public class Notification {

    private final UserService userService;

    Notification(UserService userService) {
        this.userService = userService;
    }
	
	@MessageMapping("/newAgentOnline")
	public List<UserDto.AgentOutput> onlineAgent(){
		return userService.onOffAgent(true);
	}
	
}
