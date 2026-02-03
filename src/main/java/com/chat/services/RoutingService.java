package com.chat.services;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.chat.DTO.ChatUser;
import com.chat.DTO.EtatAgent;
import com.chat.DTO.MessageDto;
import com.chat.DTO.MessageDto.GetInputMessage;
import com.chat.DTO.MessageDto.OutputMessage;
import com.chat.exceptions.RoutingException;
import com.chat.model.Chat;
import com.chat.model.Group;
import com.chat.model.Message;
import com.chat.model.QueueOperationRegister;
import com.chat.model.ResponderUser;
import com.chat.model.Visitor;
import com.chat.repositories.GroupRepositories;
import com.chat.repositories.QueueOperationRegisterRepo;
import com.chat.repositories.UserRepositories;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.event.Level;

import org.springframework.transaction.annotation.Transactional;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Service
public class RoutingService{

	private final Object lock = new Object(); // <- Le verrou partagé
	
	private MessageService messageSer;
	
    private UserService userService;
    
    private UserTransactionService userTransaction; 
	
	private UserRepositories userRep;
    
	private GroupRepositories groupRepo;
	
	private SimpMessagingTemplate messageTemplate;
	
	private Random rand;
	
	private QueueService queue;
	
	private QueueOperationRegisterRepo queueOpRepo;
	
	private ChatService chatSer;
	
	private static final Logger logger = LoggerFactory.getLogger(RoutingService.class);
	
	public RoutingService( UserRepositories userRep, 
						   GroupRepositories groupRepo,  
						   SimpMessagingTemplate messageTemplate, 
						   UserService userService, 
						   MessageService messageSer,
						   UserTransactionService userTransaction,
						   QueueService queue,
						   QueueOperationRegisterRepo queueOpRepo,
						   ChatService chatSer
						 ) {
		
		this.userRep 		 = userRep; 
		this.groupRepo 		 = groupRepo;
		this.messageTemplate = messageTemplate;
		this.userService     = userService;
		this.messageSer      = messageSer;
		this.userTransaction = userTransaction;
		this.queue           = queue;
		this.queueOpRepo     = queueOpRepo; 
		this.chatSer		 = chatSer;	
		
		rand = new Random();
	}
	
	public String agentRouting(Visitor visitor,  MessageDto.GetInputMessage messageDto) throws  RoutingException {
		
		String receiver = messageSer.getMessageReceiverBySession(visitor);
		
		logger.info("************agentRouting(Visitor visitor) ------ messageSer.getMessageReceiverBySession(visitor) : " + receiver);
		
		if (receiver != null) {
		    return receiver;
		}

		Optional<ResponderUser> agentOpt = userTransaction.randomAgent();
		
		if (agentOpt.isEmpty()) {
			
			logger.info("**************Pas d'agent disponible. Mise en queue**************");
			
			Message m = new Message();
			m.setContent(messageDto.getContent());
			m.setVisitor(visitor);
			m.setType(messageDto.getType());
			m.setTimeStamp(Instant.ofEpochMilli(messageDto.getTimeStamp()));
			
			messageSer.saveMessage(m);
			
			queue.offer(m);
			
			QueueOperationRegister register = new QueueOperationRegister();
			
			queueOpRepo.save(register);
			
			return "en attente";
		}	
		
			return agentOpt.get().getMatricule();
		
		
	}
	
	public MessageDto.OutputMessage sendMessageToAgent(Visitor visitor , MessageDto.GetInputMessage messageDto) throws RoutingException {// routage du message vers l'agent choisi
		
		logger.info("**************MessageDto.GetInputMessage sendMessageToAgent()***************");	
		
		String agent = agentRouting(visitor, messageDto);
		
		if(agent == null || agent.equals("en attente")) {
			throw new RoutingException("en attente");
		}else {
		
			userService.setDisponibility(agent,  EtatAgent.UserState.BUSY);
			
			ResponderUser user = userRep.findResponderUserByMatricule(agent);
			
			
			ChatUser u = new ChatUser();
			u.setNom(messageDto.getSender().getNom());
			u.setAdmin(false);
			u.setConnected(true);
			u.setMatricule("");
			
			Message m = new Message();
			m.setContent(messageDto.getContent());
			m.setVisitor(visitor);
			m.setReceiver(agent);
			m.setTimeStamp(Instant.ofEpochMilli(messageDto.getTimeStamp()));
			m.setType(messageDto.getType());
			
			Message savedMessage = messageSer.saveMessage(m);
			
			MessageDto.OutputMessage response = new OutputMessage();
		
			response.setContent(savedMessage.getContent());
			response.setReceiver(savedMessage.getReceiver());
			response.setVisitor(savedMessage.getVisitor());
			response.setSender(u);
			response.setType(savedMessage.getType());
			response.setTimeStamp(savedMessage.getTimeStamp()
		               .atZone(ZoneId.of("UTC+03:00"))   // ou ZoneId.of("Europe/Paris")
		               .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
			
			messageTemplate.convertAndSendToUser(agent, "/private", response);
			
			Chat chat = new Chat();
			
			chat.setName(visitor.getSession());
			
			chat.setOwner(user);
			
			chat.setEmail(visitor.getEmail());
			
			chat.setState(com.chat.model.Chat.ChatState.OUVERT);
			
			chat.setDateDeCreation();
			
			List<Chat> chatByName = chatSer.getAllChatByName(visitor.getSession());
			
			if(chatByName.size() == 0) {
				
				chatSer.saveChat(chat);
				
				throw new RoutingException("Nouvelle session de discussion");
			
			}
			
			if(chatByName.getLast().getState() == com.chat.model.Chat.ChatState.FERMER)chatSer.saveChat(chat);
			
			logger.info("New chat is open by visitor session : " + chat.getState() + m.getVisitor().toString());
			
			return response;
		}
		
	}
	
	public OutputMessage sendMessageFromQueue(ResponderUser agent, Message m) throws Exception{
		
		logger.info("**************MessageDto.GetInputMessage sendMessageFromQueue()***************");
		
		Visitor v = new Visitor();
		
		v.setSession(m.getVisitor().getSession());

		userService.setDisponibility(agent.getMatricule(),  EtatAgent.UserState.BUSY);
		
		logger.info(agent.getMatricule() + " = " + EtatAgent.UserState.BUSY);
		
		ChatUser u = new ChatUser();
		u.setNom("john doe");
		u.setAdmin(false);
		u.setConnected(true);
		u.setMatricule("");
		
		Message queueMessage = new Message();
		queueMessage.setContent(m.getContent());
		queueMessage.setVisitor(v);
		queueMessage.setReceiver(agent.getMatricule());
		queueMessage.setTimeStamp(m.getTimeStamp());
		queueMessage.setType(m.getType());
		
		Message savedMessage = messageSer.saveMessage(m);
		
		MessageDto.OutputMessage response = new OutputMessage();
	
		response.setContent(savedMessage.getContent());
		response.setReceiver(savedMessage.getReceiver());
		response.setVisitor(savedMessage.getVisitor());
		response.setSender(u);
		response.setTimeStamp(savedMessage.getTimeStamp()
	               .atZone(ZoneId.of("UTC"))   // ou ZoneId.of("Europe/Paris")
	               .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
		response.setType(savedMessage.getType());
		
		messageTemplate.convertAndSendToUser(agent.getMatricule(), "/private", response);
		
		logger.info(m.getVisitor().toString());
		
		return response;
	}
	
}

























