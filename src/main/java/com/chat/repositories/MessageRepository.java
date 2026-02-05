package com.chat.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chat.DTO.EtatAgent;
import com.chat.DTO.Latency;
import com.chat.model.LatencyDto;
import com.chat.model.Message;
import com.chat.model.Visitor;

@Repository
@Primary
public interface MessageRepository extends JpaRepository<Message, Long>{

	List<Message> findTop50ByOrderByTimeStampDesc();
	
	List<Message> findAllByOrderByTimeStampAsc();
	
	List<Message> findAllMessageByVisitor(Visitor visitor);
	
	Optional<Message> findTopByVisitorOrderByTimeStampAsc(Visitor visitor);
	
	Optional<Message> findTopByReceiverOrderByTimeStampDesc(String sender);
	
	Message findMessageByVisitor(Visitor visitor);
	
	Message findMaxIdMessageByVisitor(Visitor visitor);
	
	Message findFirstByVisitor(Visitor session);
	
	void deleteAllByVisitor(Visitor session);
	
	@Query(value = """
			delete from Message m where m.visitor = :session
			""", nativeQuery = true)
	
	public void deleteAllMessageBySession(@Param("session") Visitor session);
	
	@Query("""
			select distinct m.sender from Message m where m.visitor = :session 
			""")
	public Optional<Long> findSenderByVisitor(@Param("session") Visitor session);
	
	@Query("""
			select distinct m.visitor from Message m where m.sender = :sender
			""")
	public Optional<String> findVisitorBySender(@Param("sender") String sender);
	
	@Query("""
			select m.receiver from Message m where m.visitor = :x order by m.timeStamp desc
			""")
	public Optional<String> getUniqueSessionMessage(@Param("x")Visitor visitor);
	
	@Query("""
			update Message m set m.visitor='disabled' where m.visitor = :x 
			""")
	public int disableSession(@Param("x")Visitor visitor);
	
	@Query("""
			select m from Message m where FUNCTION('DATE', m.timeStamp) = :date
			""")
	public List<Message> getAllMessagePerDay(@Param("date")LocalDate date);
	
}
