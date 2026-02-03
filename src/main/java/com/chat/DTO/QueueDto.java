package com.chat.DTO;

import java.time.Instant;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class QueueDto {
	
	private Instant timeStamp;
	
	private int size;

}
