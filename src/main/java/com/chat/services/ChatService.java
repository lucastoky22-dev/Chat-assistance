package com.chat.services;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalField;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.chat.DTO.ChatDto;
import com.chat.model.Chat;
import com.chat.model.LatencyDto;
import com.chat.model.Message;
import com.chat.model.ResponderUser;
import com.chat.repositories.ChatRepository;
import com.chat.repositories.UserRepositories;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ChatService {
	
	private ChatRepository chatRep;
	private UserRepositories userRep;
	
	public List<Chat> getAllOpenChat(){
		
		return chatRep.findByState(com.chat.model.Chat.ChatState.OUVERT);
	
	}
	
	public List<Chat> getAllChatOrderByTime(){
		
		return chatRep.OpenChat();
	
	}
	
	public Chat getOpenChatByName(String name) {
		
		if(name.isBlank() || name.isEmpty()) throw new RuntimeException("null session error");
		
		return chatRep.findOpenChatByName(name);
	
	}
	
	public List<Chat> getAllChatByName(String name){
		return chatRep.findAllByName(name);
	}
	
	public List<Chat> getOpenOrderByDesc(String userMatricule) {
		ResponderUser u = userRep.findResponderUserByMatricule(userMatricule);
		return chatRep.OpenChatOrderByDesc(u);
	}
	
	public Chat saveChat(Chat chat) {
		
		if(chat == null) throw new RuntimeException("je ne sauvegarde pas un objet null ou vide");
		
		return chatRep.save(chat);
	
	}

	public boolean existingChat(String name) {
		
		return chatRep.existsByName(name);
		
	}
	
	public int chatSize() {
		
		List<Chat> chat = chatRep.findAll();
		
		return chat.size();
	
	}
	
	public List<ChatDto> averageChatDuration(boolean moyenne) {
		
		List<Chat> chat = chatRep.findAll();
		
		List<Chat> startChat = chat.stream()
				.filter((start) -> start.getState()==com.chat.model.Chat.ChatState.OUVERT)
				.collect(Collectors.toList());
		List<Chat> endChat = chat.stream()
				.filter((start) -> start.getState()==com.chat.model.Chat.ChatState.FERMER)
				.collect(Collectors.toList());

		List<Duration> chatDuration = new ArrayList<>();

		List<ChatDto> durationList = new ArrayList<>();
		
		//TODO performance a ameliorer
		for(Chat start : startChat) {
			for(Chat end : endChat) {
				if(start.getName().equals(end.getName())) {
						
						chatDuration.add(Duration.between(start.getDateDeCreation(), end.getDateDeCreation()));
						
						durationList.add( new ChatDto(
								start.getDateDeCreation(), 
								(Duration.between(start.getDateDeCreation(), end.getDateDeCreation()).getSeconds()
							)
										
						)
					); 
				}
			}
		}
		
		if (moyenne) {
			CharSequence initTime = "PT0H00M00.0S";
			
			Duration sum = Duration.parse(initTime);
			
			for(Duration d : chatDuration) {
				sum = sum.plus(d);
			}
			
			System.out.println("********************durée moyenne de chat**********************");
			
			Duration moy = sum.dividedBy((long)chatDuration.size());
			
			List<ChatDto> chatMoy = new ArrayList<>();
			
			ChatDto average = new ChatDto(Instant.now(), moy.getSeconds());
			
			chatMoy.add(average);
			
			return chatMoy;
		}else {
			return durationList;
		}
		
	}
	
	
	
	
	
	
	
	
}
