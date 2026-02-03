package com.chat.services;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chat.DTO.Latency;
import com.chat.model.LatencyDto;
import com.chat.model.Message;
import com.chat.model.Visitor;
import com.chat.repositories.MessageRepository;
import com.chat.repositories.UserRepositories;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MessageService {
	
	private MessageRepository messageRep;
	
	private UserRepositories userRep;
	
	public Message saveMessage(Message m) {
		messageRep.save(m);
		return m;
	}
	
	public List<Message> getAllMessages(){
		return messageRep.findAllByOrderByTimeStampAsc();
	}
	
	public List<Message> getAllMessagePerDay(LocalDate date){
		return messageRep.getAllMessagePerDay(date);
	}
	
	public List<Message> getRecentMessage(){
		return messageRep.findTop50ByOrderByTimeStampDesc();
	}
	
	public Message getMessageByVisitor(Visitor visitor){
		return messageRep.findMessageByVisitor(visitor);
	}

	public List<Latency> getAgentLatency(String session, boolean average){
		if(session == null) {
			throw new RuntimeException("500 internal server error");
		}
		Visitor v = new Visitor();
		
		v.setSession(session);
		
		List<LatencyDto> latencyDto = new ArrayList<>();
		
		List<Message> messageBySession = messageRep.findAllMessageByVisitor(v);
		
		for(Message m : messageBySession) {
			
			latencyDto.add(new LatencyDto(
					
					session,
					LocalDateTime.ofInstant(m.getTimeStamp(), ZoneId.systemDefault()).getHour(),
					LocalDateTime.ofInstant(m.getTimeStamp(), ZoneId.systemDefault()).getMinute(),
					LocalDateTime.ofInstant(m.getTimeStamp(), ZoneId.systemDefault()).getSecond()
					
			));
			
		}
		
		List<CharSequence> sequence = new ArrayList<>();
		
		for(LatencyDto l : latencyDto) {
			sequence.add("PT"+l.getHeures()+"H"+l.getMinutes()+"M"+l.getSecondes()+"S");
		}
		
		ArrayList<Duration> messageDate = new ArrayList<>();

		for (CharSequence s : sequence) {

			messageDate.add(Duration.parse(s));

		}
		
		ArrayList<Duration> latency = new ArrayList<>();

		if(messageDate.size() >= 2 ) {
			
			for (int q = 0; q+1 < messageDate.size(); q += 2) {
	
				latency.add(messageDate.get(q+1).minus(messageDate.get(q)));
	
			}
			
		}
		
		System.out.println("********************latence**********************");
		
		CharSequence initTime = "PT0H00M00.0S";
		
		Duration sum = Duration.parse(initTime);
		
		ArrayList<Latency> responseTimeSec = new ArrayList<>();
		
		String matricule = messageRep.findFirstByVisitor(v).getReceiver();
			
		List<Latency> l = new ArrayList<>();
		
		for(Duration d : latency) {
			
			System.out.println(d.toHoursPart()+"h "+d.toMinutesPart()+"m "+d.toSecondsPart()+"s");
			
			responseTimeSec.add(new Latency(matricule, d.getSeconds()));
			
			sum = sum.plus(d);
		
		}
		
		if(average) {
			System.out.println("********************moyenne**********************");
			
			Duration moy = sum.dividedBy((long)latency.size());
			
			System.out.println("moyenne : " + moy.toHoursPart()+"h "+moy.toMinutesPart()+"m "+moy.toSecondsPart()+"s");
		
			l.add(new Latency(matricule, moy.getSeconds()));
			
			return l;
			
		}
		
		return responseTimeSec;
	
	}
	
	public String getMessageReceiverBySession(Visitor visitor) {
		
		System.out.println("**************getMessageReceiverBySession****************");
		
		Optional<Message> m = messageRep.findTopByVisitorOrderByTimeStampAsc(visitor);
		
		if (m.isPresent()) {
			
			Message message = m.get();
			
			return message.getReceiver();
			
		}

		return null;
	}
	
	public String getMessageSessionByReceiver(String sender) throws RuntimeException{
		
		System.out.println("**************Get Message Session By Receiver****************");
		
		Message m = messageRep.findTopByReceiverOrderByTimeStampDesc(sender).orElseThrow(() -> { throw new RuntimeException("erreur");} );
				
	    return m.getVisitor().getSession();
			
	}
	
	@Transactional
	public void deleteMessage(String session) {
		
		Visitor v = new Visitor();
		
		v.setSession(session);
		
		messageRep.deleteAllByVisitor(v);
		
		System.out.println("all messages with session " + session + " are remove correctly.");
		
	}
	
	
	
	
}
