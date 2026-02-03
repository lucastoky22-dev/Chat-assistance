package com.chat.controllers;

import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.chat.DTO.ChatUser;
import com.chat.DTO.MessageDto;
import com.chat.DTO.MessageDto.GetInputMessage;
import com.chat.model.Message;
import com.chat.model.ResponderUser;
import com.chat.model.Visitor;
import com.chat.services.MessageService;
import com.chat.services.RoutingService;
import com.chat.services.UserService;

@RequestMapping("/app")
@Controller 
public class ChatController{
	
	private SimpMessagingTemplate messageTemplate;
	private MessageService messageSer;
	private UserService userSer;
	private RoutingService router;	
	private static final Logger logger = LoggerFactory.getLogger(RoutingService.class);
	
	public ChatController(MessageService messageSer, UserService userSer, RoutingService router, SimpMessagingTemplate messageTemplate) {
		this.messageSer = messageSer;
		this.userSer = userSer;
		this.router = router; 
		this.messageTemplate = messageTemplate;
	}
	
	@MessageMapping("/chat.sendPublicMessage")
	@SendTo("/topic/public")//message public entre les agents
	public Message sendPublicMessage(@RequestBody MessageDto.GetInputMessage messageDto) {
		
		ResponderUser u = userSer.getUserByMatricule(messageDto.getSender().getMatricule());
		
		Message message = new Message();
		
		message.setContent(messageDto.getContent());
		message.setSender(userSer.getUser(u));
		message.setTimeStamp(Instant.ofEpochMilli(messageDto.getTimeStamp()));
		message.setType(messageDto.getType());
		
		return messageSer.saveMessage(message);
		
	}
	
	@MessageMapping("/DGi-support")//canal d'envoi du visiteur
	public void visitorMessage(MessageDto.GetInputMessage messageDto, org.springframework.messaging.Message<?> message) throws Exception {
		
		SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(message);
		
		String httpSessionId = (String) accessor.getSessionAttributes().get("HTTP_SESSION_ID");
		
		logger.info("httpSessionId : " + httpSessionId);
		
		String clientSessionId = messageDto.getVisitor().getSession();
		
		logger.info("clientSessionId : " + clientSessionId);
		
		if(!(httpSessionId.equals(clientSessionId ))) throw new Exception("tentative d'usurpation");
		
		Visitor v = new Visitor();
	
		v.setEmail(messageDto.getVisitor().getEmail());
		
		v.setSession(httpSessionId);

		//Hameconnage d'un agent
		router.sendMessageToAgent(v, messageDto);
	}
	
	@MessageMapping("/agent-assistance")//canal d'envoi du visiteur
	public void  agentMessage(MessageDto.GetInputMessage messageDto)  {

		userSer.sendMessageToVisitor(messageDto);
		
	}
}