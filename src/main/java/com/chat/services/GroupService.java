package com.chat.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.chat.DTO.GroupDto;
import com.chat.exceptions.GroupException;
import com.chat.model.Group;
import com.chat.model.ResponderUser;
import com.chat.repositories.GroupRepositories;
import com.chat.repositories.UserRepositories;

import lombok.Getter;
import lombok.Setter;

@Service
@Getter
@Setter
public class GroupService {
	private GroupRepositories groupRepo;
	private UserRepositories  userRepo;
	private UserService userSer;
	private AdminService adminSer;
	private SimpMessagingTemplate message;
	
	public GroupService(GroupRepositories groupRepo, UserRepositories  userRepo, UserService userSer, SimpMessagingTemplate message, AdminService adminSer) {
		this.groupRepo = groupRepo;
		this.userRepo  = userRepo;
		this.userSer   = userSer;
		this.message   = message;
		this.adminSer  = adminSer;
	}
	
	public List<Group> ListerLesGroupes(){
		return groupRepo.findAll();
	}
	
	public Group trouverUnGroupeParSonId(Long id) {
		return groupRepo.findGroupByGroupId(id);
	}
	
	public ResponderUser ajouterUnMembre(Long id, ResponderUser u) throws GroupException{
		if(userRepo.findResponderUserByUserId(u.getUserId()) == null) {
			new GroupException("cet agent n'existe pas, créer le d'abord");
		}
		Group g = groupRepo.findGroupByGroupId(id);
		u.setMyGroup(g);
		userSer.save(u);
		List<ResponderUser> membres = g.getMembres();
		
		membres.add(u);
		g.setMembres(membres);
		g.setAbonnes(membres.size());
		groupRepo.save(g);
		return u;
	}
	
	public void supprimerUnMembre(Long groupId, Long userId) {
		
		System.out.println("************************** Supprimer un membre  ************************");
		
		Group groupe = groupRepo.findGroupByGroupId(groupId);
		
		if(groupe == null) throw new GroupException("this group isn't exist");
		
		List<ResponderUser> membres  = groupe.getMembres();
		
		for(ResponderUser agent : membres) {
			
			if(agent.getUserId() == userId) {
				
				membres.remove(agent);
				
				ResponderUser u = userSer.getUser(agent);
				
				u.setMyGroup(null);
				
				userSer.save(u);
				
				break;
			}
		}
		
		groupe.setMembres(membres);
		
		groupe.setAbonnes(membres.size());
		
		groupRepo.save(groupe);
		
		String actualSession = ((ResponderUser) userSer.getSession().getAttribute("userInfo")).getMatricule();
		
		message.convertAndSendToUser(actualSession, "/dashboard/updateGroup", ListerLesMembres(groupId));
		
		message.convertAndSendToUser(actualSession, "/dashboard/agent", adminSer.agentSansGoupe());
		
	}
	public List<ResponderUser> ListerLesMembres(Long group_id){
		return groupRepo.findGroupByGroupId(group_id).getMembres();
	}
	
	public void supprimer(Long id){
		List<ResponderUser> membres = ListerLesMembres(id);
		for(ResponderUser u : membres) {
			u.setMyGroup(null);
		}
		groupRepo.deleteById(id);
		
		String actualSession = ((ResponderUser) userSer.getSession().getAttribute("userInfo")).getMatricule();

		message.convertAndSendToUser(actualSession, "/dashboard/groupList", ListerLesGroupes());
	}
	
	public Group creerGroupe( String nom, List<ResponderUser> membres) throws GroupException{
		
		Group newGroup = new Group();
		
		if(nom == null) throw new GroupException("le groupe doit avoir un nom");
		if(groupRepo.existsByNom(nom)) throw new GroupException("ce nom de groupe existe déja");
		
		newGroup.setNom(nom);
		
		if(membres == null) {// si l'utilisateur n'ajoute pas de membre lors de la creation, on attribue une liste vide pour les membres
			newGroup.setMembres(new ArrayList<>());
		}else newGroup.setMembres(membres);
		
		newGroup.setAbonnes(newGroup.getMembres().size());
		
		groupRepo.save(newGroup);
		
		for(ResponderUser u : newGroup.getMembres() ) {
			if(userRepo.findResponderUserByMatricule(u.getMatricule()) == null) {
				throw new GroupException("this agent isn't exist");
			}
			ResponderUser agent = userRepo.findResponderUserByMatricule(u.getMatricule());
			agent.setMyGroup(newGroup);
			userSer.save(agent);
		}
		
		String actualSession = ((ResponderUser)userSer.getSession().getAttribute("userInfo")).getMatricule();
		
		message.convertAndSendToUser(actualSession, "/dashboard", ListerLesGroupes());

		message.convertAndSendToUser(actualSession, "/dashboard/agent", adminSer.agentSansGoupe());
		
		return newGroup;
		
	}
	
	public Group mettreAjour(Long id, String nom, List<ResponderUser> membres) throws GroupException{
		
		System.out.println("************************** Mise à jour  ************************");
	
		if(id == null) throw new GroupException("Erreur du developpeur");
		
		Group gr = groupRepo.findGroupByGroupId(id);
		
		if(nom == null) throw new GroupException("le groupe doit avoir un nom");
		if(groupRepo.existsByNom(nom)) throw new GroupException("ce nom de groupe existe déja");
		
		gr.setNom(nom);
		
		List<ResponderUser> newMember = gr.getMembres();
		
		if(!membres.isEmpty()) {
			System.out.println("membres : " + membres);
			for(ResponderUser u : membres) {
				newMember.add(u);
				if(userRepo.findResponderUserByMatricule(u.getMatricule()) == null) {
					throw new GroupException("this agent isn't exist");
				}
				ResponderUser agent = userRepo.findResponderUserByMatricule(u.getMatricule());
				agent.setMyGroup(gr);
				userSer.save(agent);
			}

			gr.setMembres(newMember);
			
		}

		gr.setAbonnes(gr.getMembres().size());
		
		sauvegarder(gr);
		
		String actualSession = ((ResponderUser)userSer.getSession().getAttribute("userInfo")).getMatricule();
		
		message.convertAndSendToUser(actualSession, "/dashboard/groupList", ListerLesGroupes());
		
		message.convertAndSendToUser(actualSession, "/dashboard/userData", adminSer.lister());
		
		//message.convertAndSendToUser(actualSession, "/dashboard/updateGroup", ListerLesMembres(groupId));
		
		message.convertAndSendToUser(actualSession, "/dashboard/agent", adminSer.agentSansGoupe());
		
		return gr;
	}
	
	public Group sauvegarder(Group g) {
		return groupRepo.save(g);
	}
	
}
