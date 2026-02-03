package com.chat.model;

import java.time.Instant;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class Message {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(columnDefinition = "text")
	private String content; 
	
	private Instant timeStamp;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "sender_id")
	private ResponderUser sender;
	
	private String receiver;//agent matricule or visitor sessionId
	
	@Enumerated(EnumType.STRING)
	private com.chat.DTO.MessageDto.GetInputMessage.MessageType type;
	
	@Embedded
	private Visitor visitor;
	
	public enum MessageType {
			CHAT, JOIN, LEAVE, TYPING
	}

}













