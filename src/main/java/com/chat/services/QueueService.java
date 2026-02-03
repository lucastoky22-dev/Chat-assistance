package com.chat.services;

import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.chat.DTO.QueueDto;
import com.chat.exceptions.QueueException;
import com.chat.model.Message;
import com.chat.model.QueueEntity;
import com.chat.model.QueueOperationRegister;
import com.chat.repositories.QueueOperationRegisterRepo;
import com.chat.repositories.QueueRepositories;

import ch.qos.logback.classic.Logger;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class QueueService {
	
	private final QueueRepositories queueRepositories;
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(QueueService.class);
	
	private QueueTransaction queueTransac;
	
	public Message poll() {
		
		return queueTransac.poll();
		
	}
	
	public boolean offer(Message m) {
		
		try {
			queueTransac.add(m);
			logger.info("le message a bien été ajouté au queue");
			return true;
		}catch(QueueException ex) {
			logger.error("erreur lors de l'ajout au queue");
			return false;
		}
		
	}
	
	public int size() {
		
		List<QueueEntity> queue = queueRepositories.findAll();
		
		return queue.size();
		
	}
	
}
