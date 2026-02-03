package com.chat.DTO;

import java.time.Instant;

import com.chat.model.ResponderUser;
import com.chat.model.Visitor;

import lombok.Getter;
import lombok.Setter;

public class MessageDto {
	@Getter
	@Setter
	public static class GetInputMessage{
		
		private String content;
		
        private ChatUser sender;
        
        private String receiver; 
        
        private Visitor visitor;
        
        private Long timeStamp;
        
        private MessageType type;
       
        public enum MessageType {
			CHAT, JOIN, LEAVE, TYPING
        }
	}
	
	@Getter
	@Setter
	public static class OutputMessage{
		
		private String content;
		
        private ChatUser sender;
        
        private String receiver; 
        
        private Visitor visitor;
        
        private  String timeStamp;
        
        private com.chat.DTO.MessageDto.GetInputMessage.MessageType type;
       
        public enum MessageType {
			CHAT, JOIN, LEAVE, TYPING
        }

		public void setType(com.chat.DTO.MessageDto.GetInputMessage.MessageType type2) {
			this.type = type2;
			
		}

	}
}
