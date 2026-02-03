package com.chat.model;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
public class LatencyDto {

	String session;
	
	int heures;
	
	int minutes;
	
	int secondes;
	
}
