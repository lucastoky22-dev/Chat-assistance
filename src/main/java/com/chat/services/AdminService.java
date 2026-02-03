package com.chat.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.chat.DTO.EtatAgent;
import com.chat.DTO.UserDto;
import com.chat.exceptions.CreationException;
import com.chat.model.ResponderUser;
import com.chat.model.ResponderUser.UserState;
import com.chat.repositories.UserRepositories;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
public class AdminService extends UserService{
	
	public AdminService (UserRepositories repo, HttpSession session, MessageService messageSer,  ChatService chatSer, SimpMessagingTemplate simpMessage, ApplicationEventPublisher publisher){
		super(repo, session, messageSer,  chatSer, simpMessage, publisher);
	}
		
	//CRUD
	
	public ResponderUser creer(String nom, String matricule, String numero, String email, String motDePasse) throws CreationException{
		if(nom == null || nom.isBlank()) {
			throw new CreationException("le nom ne doit pas etre vide ");
		}
		if(matricule == null || matricule.isBlank()) {	
			throw new CreationException("le matricule ne doit pas etre vide ");
		}
		if(numero == null || numero.isBlank()) {
			throw new CreationException("le numero ne doit pas etre vide ");
		}
		if(email == null || email.isBlank()) {
			throw new CreationException("l'email ne doit pas etre vide ");
		}
		if(motDePasse == null || motDePasse.isBlank()) {
			throw new CreationException("le mot de passe ne doit pas etre vide ");
		}
		if(userRep.existsByMatricule(matricule)) {
			throw new CreationException("ce matricule est déja utlisé");
		}
		if(userRep.existsByEmail(email)) {
			throw new CreationException("cette email est déja utlisé");
		}
		ResponderUser u = new ResponderUser();
		u.setNom(nom);
		u.setMatricule(matricule);
		u.setEmail(email);
		u.setNumero(numero);
		u.setMotDePasse(motDePasse);
		u.setAdmin(false);
		u.setConnected(false);
		u.setEtat(EtatAgent.UserState.FREE);
		return userRep.save(u);
	}
	
	public List<UserDto.DashboardOutput> lister(){
		String etat = "déconnecté";
		List<ResponderUser> userData = userRep.findAll();
		
		List<UserDto.DashboardOutput> data = new ArrayList<>();
		
		for(ResponderUser u : userData) {
			if(u.isConnected()) etat = "connecté";
			else etat = "déconnecté";
			if(u.getMyGroup() == null) {
				data.add(new UserDto.DashboardOutput(
						u.getUserId(),
						u.getNom(), 
						u.getMatricule(), 
						u.getEmail(), 
						u.getNumero(), 
						u.getMotDePasse(), 
						u.isAdmin(), 
						u.isConnected(),
						etat,
						"")
						);
			}else {
				data.add(new UserDto.DashboardOutput(
						u.getUserId(),
						u.getNom(), 
						u.getMatricule(), 
						u.getEmail(), 
						u.getNumero(), 
						u.getMotDePasse(), 
						u.isAdmin(), 
						u.isConnected(),
						etat,
						u.getMyGroup().getNom())
						);
			}
		}
		return data;
	}
	
	public List<UserDto.DashboardOutput> listOnlineAgents(){
		
		List<UserDto.DashboardOutput> ouput = new ArrayList<>();
		
		List<ResponderUser> userData = userRep.findAll();
		
		 userData.stream().filter((agent)->agent.isConnected()==true)
		 				  .forEach((agent)->ouput.add(new UserDto.DashboardOutput(
								agent.getUserId(),
								agent.getNom(),
								agent.getMatricule(),
								agent.getEmail(),
								agent.getNumero(),
								agent.getMotDePasse(),
								agent.isAdmin(),
								agent.isConnected(),
								"connécté",
								""))
		 				    );
		return ouput;
	}
	
	public ResponderUser mettreAjour(Long id, String nom, String matricule, String numero, String email, String motDePasse) throws CreationException{
		if(nom == null || nom.isBlank()) {
			throw new CreationException("le nom ne doit pas etre vide ");
		}
		if(matricule == null || matricule.isBlank()) {	
			throw new CreationException("le matricule ne doit pas etre vide ");
		}
		if(userRep.findResponderUserByMatricule(matricule) != null && userRep.findResponderUserByMatricule(matricule).getUserId() != id) {
			throw new CreationException("Ce matricule est déja utilisé");
		}
		if(numero == null || numero.isBlank()) {
			throw new CreationException("le numero ne doit pas etre vide ");
		}
		if(email == null || email.isBlank()) {
			throw new CreationException("l'email ne doit pas etre vide ");
		}
		if(userRep.findResponderUserByEmail(email) != null && userRep.findResponderUserByEmail(email).getUserId() != id){
			throw new CreationException("Ce email est déja utilisé");
		}
		if(motDePasse == null || motDePasse.isBlank()) {
			throw new CreationException("le mot de passe ne doit pas etre vide ");
		}
		
		ResponderUser u = userRep.findResponderUserByUserId(id);
		u.setNom(nom);
		u.setMatricule(matricule);
		u.setEmail(email);
		u.setMotDePasse(motDePasse);
		u.setAdmin(false);
		u.setNumero(numero);
		u.setConnected(false);
		
		return userRep.save(u);
	}
	
	public void supprimer(Long id) {
		ResponderUser u = userRep.findById(id).orElseThrow();
		if(u.getMyGroup() != null){
			u.setMyGroup(null);
			userRep.save(u);
			userRep.delete(u);
		}else {
			userRep.deleteById(id);
		}
	}
	
	
	public List<String> listOfUserByDisponibility(EtatAgent.UserState state){
		return userRep.getReceiverByState(state);
	}
	
	public  List<UserDto.GroupOutput> agentSansGoupe(){
		
		 List<ResponderUser> agents = userRep.findAll();
		 
		 List<ResponderUser> agentsSansGroupe  = agents.stream().filter( agent -> agent.getMyGroup()==null).map(agent -> agent).collect(Collectors.toList());

		 List<UserDto.GroupOutput> data = new ArrayList<>();
			
			for(ResponderUser u : agentsSansGroupe ) {
					data.add(new UserDto.GroupOutput(
							u.getUserId(),
							u.getNom(), 
							u.getMatricule(), 
							u.getEmail(), 
							u.getNumero(), 
							u.getMotDePasse(), 
							u.isAdmin(), 
							u.isConnected(),
							u.getEtat(),
							"sans groupe")
							);
				
			}
		 return data;
	}
	
	public String findAdmin() {
		return userRep.getAdmin();
	}
	
	public String sendLogin(String session, String login) {
		
		simpMessage.convertAndSendToUser(session, "/subscribeSession", login);
		
		return login;
	
	}
	
	
	
	
}
