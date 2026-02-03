package com.chat.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.chat.model.Chat;
import com.chat.model.Message;
import com.chat.model.ResponderUser;

public interface ChatRepository extends JpaRepository<Chat, Long> {
	
	public List<Chat> findByState(com.chat.model.Chat.ChatState state);
	
	public boolean existsByName(String name);
	
	public Optional<Chat> findByName(String name);
	
	@Query("""
			select c from Chat c where c.state="OUVERT" and c.name= :name
			""")
	public Chat findOpenChatByName(@Param("name") String name);
	
	@Query("""
			select c from Chat c where c.name= :name
			""")
	public List<Chat> findAllByName(@Param("name") String name);
	
	@Query("""
			select c from Chat c where c.state="OUVERT" order by c.dateDeCreation asc
			""")
	public List<Chat> OpenChat();
	
	@Query("""
			select c from Chat c where c.state="OUVERT" and c.owner= :owner order by c.dateDeCreation desc
			""")
	public List<Chat> OpenChatOrderByDesc(@Param("owner") ResponderUser owner);
	
	
	
}
