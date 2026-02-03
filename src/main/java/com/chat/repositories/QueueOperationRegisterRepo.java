package com.chat.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.chat.DTO.QueueDto;
import com.chat.model.QueueOperationRegister;

public interface QueueOperationRegisterRepo extends JpaRepository<QueueOperationRegister, Long>{
	
	@Query("""
			SELECT r from QueueOperationRegister r order by r.dateDeCreation
			""")
	public List<QueueOperationRegister> queueEvolution();
	
}
