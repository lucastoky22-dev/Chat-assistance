package com.chat.listener;
import com.chat.services.RoutingService;
import com.chat.services.UserService;

import lombok.AllArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.chat.events.NewOnlineAgent;
import com.chat.model.ResponderUser;

@Component
@AllArgsConstructor
public class NewOnlineListener {

    private final UserService userService;
    
    private final SimpMessagingTemplate simpMessage;
	
    private static final Logger logger = LoggerFactory.getLogger(RoutingService.class);
   
	@EventListener
	public Long newOnlineAgent(NewOnlineAgent e) {
		
		logger.info("onLine agent : " + userService.onOffAgent(true));
		
		simpMessage.convertAndSend("/topic/public", userService.onOffAgent(true));
		
		return e.getId();
		
	}
	
}
