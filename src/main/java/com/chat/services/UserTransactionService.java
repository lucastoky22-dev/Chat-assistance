package com.chat.services;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chat.DTO.EtatAgent;
import com.chat.model.ResponderUser;
import com.chat.repositories.UserRepositories;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserTransactionService {
	
	private final UserRepositories userRep;
	
	private static final Logger logger = LoggerFactory.getLogger(RoutingService.class);

	@Transactional
	public Optional<ResponderUser> randomAgent() {//agent aléatoire
		
		List<ResponderUser> freeAgentList = userRep.findResponderUserByStateAndLock(EtatAgent.UserState.FREE);
		
		if (freeAgentList.isEmpty()) {
			logger.info("UserTransactionService ----> Pas d'agent libre {°~°}");
			return Optional.empty();
		}
		
		logger.info("************** Selection aléatoire d'un agent *************");
		
		ResponderUser u = freeAgentList.get(ThreadLocalRandom.current().nextInt(freeAgentList.size()));//random Thread Safe
		
		//userService.makeUserAsBusy(u.getMatricule());
		
		return Optional.of(u);
		
	}
	
}
