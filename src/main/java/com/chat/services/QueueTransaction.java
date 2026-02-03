package com.chat.services;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.chat.exceptions.QueueException;
import com.chat.model.Message;
import com.chat.model.QueueEntity;
import com.chat.repositories.QueueRepositories;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class QueueTransaction {
	
	private QueueRepositories queueRep;
	
	@Transactional
	public Message poll() {
		/*QueueEntity queue = queueRep.findFirstMessageInQueue(PageRequest.of(0, 1))
				.orElseThrow(() -> new RuntimeException("Queue vide"));*/
		QueueEntity q = queueRep.findFirstMessageInQueue()
				.stream()
				.findFirst()
				.orElseThrow(() -> new QueueException("Queue vide"));
		
		Message message = q.getMessage();

		queueRep.delete(q); // suppression de LA ligne verrouillée

		return message;
	}
	
	@Transactional
	public void add(Message m) {
		
		QueueEntity queueElement = new QueueEntity();
		
		queueElement.setMessage(m);
		
		queueRep.save(queueElement);
		
	}

}
