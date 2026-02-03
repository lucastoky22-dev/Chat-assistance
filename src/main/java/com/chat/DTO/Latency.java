package com.chat.DTO;

import java.time.Duration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Latency {

	String matricule;
	
	long responseTimeSec;
	
}
