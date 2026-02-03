package com.chat.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.chat.DTO.QueueDto;
import com.chat.model.Message;
import com.chat.model.QueueEntity;

import jakarta.persistence.LockModeType;

public interface QueueRepositories extends JpaRepository<QueueEntity, Long>{
	
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("""
			  select q from QueueEntity q order by q.dateDeCreation asc
			""")
	public List<QueueEntity> findFirstMessageInQueue();
	
	/*@Query("""
		    SELECT new com.chat.DTO.QueueDto(
			    date_trunc('minute', q.dateDeCreation), 
			    COUNT(*) 
		    )
		    FROM QueueEntity q
		    GROUP BY q.dateDeCreation
		    ORDER BY q.dateDeCreation
		""")
	public	List<QueueDto> getQueueEvolutionPerMinute();
	
	@Query("""
			SELECT new com.chat.DTO.QueueDto(
			    q.dateDeCreation,
			    COUNT(*)
			)
			FROM QueueEntity q
			GROUP BY q.dateDeCreation
			ORDER BY q.dateDeCreation
			""")
	public List<QueueDto> getQueueEvolution();*/
}
