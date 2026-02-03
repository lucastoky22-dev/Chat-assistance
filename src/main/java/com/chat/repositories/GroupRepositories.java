package com.chat.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chat.model.Group;
import com.chat.model.ResponderUser;

public interface GroupRepositories extends JpaRepository<Group, Long> {
	public Group findGroupByGroupId(Long id);
	public Group findByNom(String nom);
	public boolean existsByNom(String nom);
	public List<ResponderUser> findAllByGroupId(Long id);//trouver les membres par l'id du groupe
}
