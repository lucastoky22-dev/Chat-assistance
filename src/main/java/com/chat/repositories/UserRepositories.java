package com.chat.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chat.DTO.EtatAgent;
import com.chat.model.ResponderUser;

import jakarta.persistence.LockModeType;

import java.util.List;


@Repository
public interface UserRepositories extends JpaRepository<ResponderUser, Long>{
	
	public void deleteByMatricule(String matricule);
	
	public ResponderUser findResponderUserByUserId(Long id);
	
	public ResponderUser findResponderUserByMatricule(String matricule);
	
	public ResponderUser findResponderUserByEmail(String email);
	
	public String findMatriculeByUserId(Long UserId);
	
	public boolean existsByMatricule(String matricule);
	
	public boolean existsByEmail(String email);
	
	public boolean existsByMotDePasse(String motDePasse);
	
	@Query("""
			select u from ResponderUser u where u.isConnected = :state
			""")
	public List<ResponderUser> getOnOrOffLineAgent(@Param("state") boolean etat);
	
	@Query("""
			select u.matricule from ResponderUser u where u.etat = :state
			""")
	public List<String> getReceiverByState(@Param("state") EtatAgent.UserState etat);
	
	@Query("""
			select u from ResponderUser u where u.myGroup = null
			""")
	public List<ResponderUser> getUserWithNoGroup();
	
	@Query("""
			select u.matricule from ResponderUser u where u.isAdmin = true
			""")
	public String getAdmin();
	

    /**
     * Sélectionne tous les agents FREE et en ligne puis applique un lock pessimiste
     * pour empêcher que deux transactions prennent le même agent en même temps.
     */
    @Lock(LockModeType.PESSIMISTIC_READ)
    @Query("""
    			select u from ResponderUser u where u.etat = :etat and u.isConnected=true
    	   """)
    List<ResponderUser> findResponderUserByStateAndLock(@Param("etat")EtatAgent.UserState etat);
	
}
