package com.chat.model;

import java.util.List;

import com.chat.DTO.EtatAgent;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "user_agent")
public class ResponderUser{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	private String nom;
	
	@Column(unique = true, nullable= false)
	private String matricule;
	
	private String email;
	
	private String numero;
	
	private String motDePasse;
	
	private boolean isAdmin;
	
	private boolean isConnected;
	
	@Enumerated(EnumType.STRING)
	private EtatAgent.UserState etat;
	
	public enum UserState{
		FREE, BUSY
	}
	
	@OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Message> listMessage;
	
	@OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonIgnore
	private List<Chat> chatList;
	
	@ManyToOne(cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
	@JoinColumn(name = "group_id")
	private Group myGroup;
	
	public ResponderUser() {
		this.isConnected = false;
		this.etat = EtatAgent.UserState.FREE;
	}

	public List<Message> getListMessage() {
		return listMessage;
	}

	public void setListMessage(Message listMessage) {
		this.listMessage.add(listMessage);
	}
	
	@Override
	public String toString() {
		return this.getUserId() + " " + this.getNom();
	}
	
	
}
