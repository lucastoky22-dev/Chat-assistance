package com.chat.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.chat.events.UserEvents;
import com.chat.exceptions.QueueException;
import com.chat.model.Message;
import com.chat.model.QueueOperationRegister;
import com.chat.model.ResponderUser;
import com.chat.repositories.QueueOperationRegisterRepo;
import com.chat.services.MessageService;
import com.chat.services.QueueService;
import com.chat.services.RoutingService;
import com.chat.services.UserService;

import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor
@Component
public class StateAgentListener {
	
	private final QueueService queue;
	private final UserService userSer;
	private final RoutingService router;
	private final MessageService messageSer;
	private final QueueOperationRegisterRepo queueOpRepo;
	private static final Logger logger = LoggerFactory.getLogger(StateAgentListener.class);
	
	@EventListener
	public void oneAgentIsFree(UserEvents e) throws QueueException, Exception{
		
		logger.info("***************** Agent n°" + e.getId() + " is free, queue poll processing.");
		
		ResponderUser u = userSer.getUserById(e.getId());
		
		logger.info("***************** queue.size() = " + queue.size());
		
		if(queue.size() == 0) {
			throw new QueueException("la queue est vide");
		}
		
		Message m = queue.poll();
		
		m.setReceiver(u.getMatricule());
		
		messageSer.saveMessage(m);
		
		QueueOperationRegister register = new QueueOperationRegister();
		register.setTaille(queue.size());
		queueOpRepo.save(register);
		
		logger.info("***************** Message with session " + m.getVisitor().getSession() + " is out of queue");
		
		router.sendMessageFromQueue(u, m);
		
	}

}
