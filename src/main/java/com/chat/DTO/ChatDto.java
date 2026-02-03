package com.chat.DTO;

import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
public class ChatDto {

	private Instant timeStamp;
	
	private Long seconds;
	
}
