package com.chat.services;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Primary;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.chat.DTO.ChatUser;
import com.chat.DTO.EtatAgent;
import com.chat.DTO.EtatAgent.UserState;
import com.chat.DTO.MessageDto;
import com.chat.DTO.MessageDto.GetInputMessage;
import com.chat.DTO.UserDto;
import com.chat.exceptions.AuthException;
import com.chat.model.Chat;
import com.chat.model.Group;
import com.chat.model.Message;
import com.chat.model.ResponderUser;
import com.chat.model.Visitor;
import com.chat.repositories.UserRepositories;

import com.chat.events.UserEvents;
import com.chat.events.NewOnlineAgent;

import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;

@Service
@Primary
@RequiredArgsConstructor
public class UserService {
	//dependency injection 
	protected final UserRepositories userRep;
	protected final HttpSession session;
	protected final MessageService messageSer;
	protected final ChatService chatSer;
	protected final SimpMessagingTemplate simpMessage;
	protected final ApplicationEventPublisher publisher;
	private static final Logger logger = LoggerFactory.getLogger(RoutingService.class);
	
	public ResponderUser Authentify(String matricule, String password) throws AuthException {
		
		/**
		 * if the userInfo is correct set isConnected to true, or else keep it false.
		 */

		if(!(userRep.existsByMatricule(matricule))) {
			throw new AuthException("matricule incorrect");
		}
		
		if(userRep.existsByMatricule(matricule)){
			ResponderUser u = userRep.findResponderUserByMatricule(matricule);
			if(!(u.getMotDePasse().equals(password))) throw new AuthException("votre mot de passe est incorrect");
			
			if(u.getMotDePasse().equals(password)) {
				
				u.setConnected(true);
				
				System.out.println(u.getNom() + " is connected.");
				
				u.setEtat(UserState.FREE);
				
				session.setAttribute("userInfo", u);
				
				ResponderUser user = userRep.save(u);
				
				publisher.publishEvent(new NewOnlineAgent(u.getUserId()));
				
				return user;
			}
		
		}
		return null;
		
	}
	
	public ResponderUser getUser(ResponderUser u) {
	    return userRep.findResponderUserByMatricule(u.getMatricule());
	}
	
	public Group groupe(Long id) {
		return userRep.findResponderUserByUserId(id).getMyGroup();
	}
	
	public ResponderUser getUserById(Long id) {
		return userRep.findResponderUserByUserId(id);
	}
	
	public ResponderUser getUserByMatricule(String matricule) {
		return userRep.findResponderUserByMatricule(matricule);
	}
	
	public void finishDiscussion(Long userId) {
		ResponderUser u = getUserById(userId);
		u.setEtat(EtatAgent.UserState.FREE);
		save(u);
	}
	
	public void disconnect(String matr) {
		ResponderUser u = getUserByMatricule(matr);
		session.setAttribute("userInfo", null);
		u.setConnected(false);
		u.setEtat(UserState.FREE);
		ResponderUser savedUser = userRep.save(u);
		publisher.publishEvent(new NewOnlineAgent(savedUser.getUserId()));//publier l'évenement
		
	}
	
	public MessageDto.OutputMessage sendMessageToVisitor(MessageDto.GetInputMessage messageDto){
		
		ResponderUser u = getUserByMatricule(messageDto.getSender().getMatricule());
		
		Visitor v = new Visitor();
		v.setSession(messageDto.getVisitor().getSession());

		System.out.println("********************** agent   : " + u.getNom());
		System.out.println("********************** session : " + v.getSession());
		
		Message m = new Message();
		m.setContent(messageDto.getContent());
		m.setSender(u);
		m.setVisitor(v);
		m.setTimeStamp(Instant.ofEpochMilli(messageDto.getTimeStamp()));
		m.setType(messageDto.getType());
		
		Message savedMessage = messageSer.saveMessage(m);
		
		ChatUser chatUser = new ChatUser();
		chatUser.setNom(savedMessage.getSender().getNom());
		chatUser.setMatricule(savedMessage.getSender().getMatricule());
		chatUser.setAdmin(savedMessage.getSender().isAdmin());
		chatUser.setConnected(savedMessage.getSender().isConnected());
		
		MessageDto.OutputMessage response = new MessageDto.OutputMessage();
	
		response.setContent(savedMessage.getContent());
		response.setSender(chatUser);
		response.setTimeStamp(savedMessage.getTimeStamp()
		               .atZone(ZoneId.of("UTC+03:00"))   // ou ZoneId.of("Europe/Paris")
		               .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
	               );
		
		System.out.println("********************** Session : " + savedMessage.getVisitor().getSession());
		
		simpMessage.convertAndSendToUser(savedMessage.getVisitor().getSession(), "/private", response);
		
		return response;
		
	}
	
	public void setDisponibility(String matricule, EtatAgent.UserState etat) throws RuntimeException{
		
		ResponderUser user = getUserByMatricule(matricule);
		
		System.out.println("*******Free user email = " + user.getEmail());
		
		user.setEtat(etat);
		
		ResponderUser savedUser = save(user);
		
		if(etat == UserState.FREE) {//si l'agent change son etat en libre(FREE) 
			
			logger.info("state = " + etat);
			
			String chatSession = messageSer.getMessageSessionByReceiver(matricule);
			
			Chat chat = chatSer.getOpenChatByName(chatSession);
			
			if(chat == null) throw new RuntimeException(" * * * N.P.E * * * ");
			
			Chat endChat = new Chat();
			
			endChat.setName(chat.getName());
			
			endChat.setEmail(matricule);
			
			endChat.setDateDeCreation();
			
			endChat.setState(com.chat.model.Chat.ChatState.FERMER);
			
			chatSer.saveChat(endChat);
			
			logger.info("fin de chat par l'agent " + matricule);
			
			messageSer.deleteMessage(chatSession);
			
			publisher.publishEvent(new UserEvents(savedUser.getUserId()));//publier l'évenement
			
		}
		
	}
	
	public List<UserDto.AgentOutput> onOffAgent(boolean bool){//liste des agents connécté ou non connecter
		
		logger.info("affichage des agent en ligne");
		
		List<ResponderUser> userData = userRep.getOnOrOffLineAgent(bool);
		
		List<UserDto.AgentOutput> onOff = new ArrayList<>();
		
		for(ResponderUser u : userData) {
			onOff.add(new UserDto.AgentOutput(u.getNom(), u.getEmail()));
		}
		
		return onOff;
	}
	
	public ResponderUser save(ResponderUser u) {
		
		return userRep.save(u);
		
	}
	
	public HttpSession getSession() {
		return this.session;
	}
	
}
