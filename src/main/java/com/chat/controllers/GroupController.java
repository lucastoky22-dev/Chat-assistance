package com.chat.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chat.DTO.GroupDto;
import com.chat.DTO.UserDto;
import com.chat.exceptions.GroupException;
import com.chat.model.Group;
import com.chat.model.ResponderUser;
import com.chat.services.AdminService;
import com.chat.services.GroupService;
import com.chat.services.UserService;

@RestController
@RequestMapping("/api/group")
public class GroupController {
	
	public GroupService groupSer;
	public UserService userSer;
	public AdminService adminSer;
	public GroupController(GroupService groupSer, UserService userSer, AdminService adminSer){
		
		this.groupSer = groupSer;
		this.userSer  = userSer; 
		this.adminSer = adminSer;
	}
	
    /**** create group ****/
	
	@PostMapping("/createGroup")
	public Group newGroup(@RequestBody GroupDto.PostInput input) throws Exception{
		return groupSer.creerGroupe(input.getNom(), input.getMembres());
	} 
	
	/**** add member ****/
	
	@PostMapping("/addMember")
	public ResponderUser addMemeber(@RequestParam Long group_id, @RequestParam Long userMemberid) throws GroupException {
		return groupSer.ajouterUnMembre(group_id, userSer.getUserById(userMemberid)); 
	} 
	
	@DeleteMapping("/deleteMember")
	public void deleteMember(@RequestParam Long groupId, @RequestParam Long userId) throws GroupException {
		groupSer.supprimerUnMembre(groupId, userId); 
	} 
	
	/**** list of members ****/
	
	@GetMapping("/listOfMembers/{groupId}")
	public List<ResponderUser> listOfMembers(@PathVariable Long groupId){
		return groupSer.ListerLesMembres(groupId);
	}
	
	/**** update group info  ****/
	
	@PutMapping("/updateGroup")
	public void updateGroup(@RequestBody GroupDto.UpdateInput input) {
		groupSer. mettreAjour(input.getId(), input.getNom(), input.getMembres());
	}
	
	 /**** display all group ****/
	
	@GetMapping("/listOfGroup")
	public List<Group> listOfGroup() {
		return groupSer.ListerLesGroupes();
	}
	
	 /**** delete group ****/
	
	@DeleteMapping("/deleteGroup/{id}")
	public void deleteGroup(@PathVariable Long id) {
	    groupSer.supprimer(id);
	}
	
}
