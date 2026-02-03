package com.chat.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chat.DTO.ChatDto;
import com.chat.DTO.EtatAgent;
import com.chat.DTO.GroupDto;
import com.chat.DTO.Latency;
import com.chat.DTO.LoginDto;
import com.chat.DTO.QueueDto;
import com.chat.DTO.UserDto;
import com.chat.DTO.UserDto.AgentOutput;
import com.chat.DTO.UserDto.DashboardOutput;
import com.chat.exceptions.AuthException;
import com.chat.exceptions.CreationException;

import com.chat.model.Chat;
import com.chat.model.Group;
import com.chat.model.LatencyDto;
import com.chat.model.Message;
import com.chat.model.QueueOperationRegister;
import com.chat.model.ResponderUser;
import com.chat.model.ResponderUser.UserState;
import com.chat.model.Visitor;
import com.chat.repositories.QueueOperationRegisterRepo;

import com.chat.services.AdminService;
import com.chat.services.ChatService;
import com.chat.services.GroupService;
import com.chat.services.MessageService;
import com.chat.services.QueueService;
import com.chat.services.RecaptchaService;
import com.chat.services.RoutingService;
import com.chat.services.UserService;
import com.chat.services.VisitorService;
import com.chat.events.CreateUserEvents;
import com.chat.events.UpdateEvents;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class ApiController {

	//dependency injection
	
	private UserService userSer;
	private MessageService messageSer;
	private AdminService adminSer;
	private QueueService queueService;
	private ChatService chatSer;
	private QueueOperationRegisterRepo registerRepo;
	protected ApplicationEventPublisher publisher;
	private RecaptchaService recaptchaSerivce;
	private static final Logger logger = LoggerFactory.getLogger(RoutingService.class);
	
	/*************  auth + CRUD **************/
	//TODO recatcha integration
	@PostMapping("/auth")
	public ResponderUser authentification(/*@RequestHeader("X-RECAPTCHA-TOKEN") String recaptchaToken,*/
								@RequestBody UserDto.AuthInput input) throws AuthException{
		/*System.out.println(recaptchaToken);
	    if (recaptchaToken == null || recaptchaToken.isBlank()) {
	        throw new AuthException("Captcha manquant");
	    }

	    if (!recaptchaSerivce.verify(recaptchaToken)) {
	        throw new AuthException("reCAPTCHA invalide");
	    }*/
		return userSer.Authentify(input.getMatricule(), input.getMotDePasse());
	}
	
	@PostMapping("/adminCreateUser")
	public ResponderUser creationParAdm(@RequestBody UserDto.CreateInput input) throws CreationException{
		
		return adminSer.creer(input.getNom(), input.getMatricule(), input.getNumero(), input.getEmail(), input.getMotDePasse());
	
	}
	
	@PostMapping("/createUser")
	public String creation(@RequestBody UserDto.CreateInput input, HttpSession session) throws CreationException{
		
		String httpSessionId = (String) session.getId();
		
		logger.info("httpSessionId : " + httpSessionId);
		
		publisher.publishEvent(new CreateUserEvents(httpSessionId, input.getNom(), input.getMatricule(), input.getNumero(), input.getEmail(), input.getMotDePasse()));
		
		return httpSessionId;
	
	}
	
	@PutMapping("/updateInfo")
	public void miseAjour(@RequestBody UserDto.UpdateInput input) {//TODO call an event for real time udpate
		System.out.println("input.getId() : " + input.getId());
		publisher.publishEvent(new UpdateEvents(input.getId(), input.getNom(), input.getMatricule(), input.getNumero(),  input.getEmail(), input.getMotDePasse()));
		//adminSer. mettreAjour(input.getId(), input.getNom(), input.getMatricule(), input.getNumero(), input.getEmail(), input.getMotDePasse());
	}
	
	@DeleteMapping("/deleteUser")
	public void deleteUser(@RequestParam Long id) {
	    adminSer.supprimer(id);
	}
	
	@GetMapping("/getAdmin")
	public String getAdmin() {
		return adminSer.findAdmin();
	}
	
	
	@GetMapping("/listOfUser")
	public List<UserDto.DashboardOutput> list() {
		return adminSer.lister();
	}
	
	@GetMapping("/listOfMessagePerDay")
	public List<Message> messageParJour(@RequestParam LocalDate date) {
		return messageSer.getAllMessagePerDay(date);
	}
	
	@GetMapping("/listOfAllMessages")
	public List<Message> toutesLesMessages() {
		return messageSer.getAllMessages();
	}
	
	@GetMapping("/agentLatency")
	public List<Latency> agentLatency(@RequestParam String session) {
		return messageSer.getAgentLatency(session, false);
	}
	
	@GetMapping("/averageLatency")
	public List<Latency> averageLatency(@RequestParam String session) {
		return messageSer.getAgentLatency(session, true);
	}
	
	@GetMapping("/queueEvolution")
	public List<QueueDto> getQueueEvolution(){
		List<QueueDto> response = new ArrayList<>();
		for(QueueOperationRegister r : registerRepo.queueEvolution()) {
			response.add(new QueueDto(r.getDateDeCreation(), r.getTaille()));
		}
		return response;
	}
	
	@GetMapping("/queueSize")
	public int getQueueSize() {
		return queueService.size();
	}
	
	@GetMapping("/userWithNoGroup")
	public List<UserDto.GroupOutput> agentSansGroupe() {
		return adminSer.agentSansGoupe();
	}
	
	@GetMapping("/listOfUserByDisponibility")
	public List<String> list(@RequestBody EtatAgent state) {
		return adminSer.listOfUserByDisponibility(state.getEtat());
	}
	
	@GetMapping("/getOnlineAgent")
	public List<DashboardOutput> getOnlineAgent() {
		
		return adminSer.listOnlineAgents();
	}
	
	
	@GetMapping("/groupList")
	public Group groupList(@RequestParam Long id){
		return userSer.groupe(id);
	}
	
	@GetMapping("/onOffAgent")
	public List<UserDto.AgentOutput> onOffAgent(@RequestParam boolean etat){
		return userSer.onOffAgent(etat);
	}
	
	@GetMapping("/allOpenChat")
	public List<Chat> getAllOpenChat(){
		return chatSer.getAllChatOrderByTime();
	}
	
	@GetMapping("/chatSize")
	public int chatSize() {
		return chatSer.getAllOpenChat().size();
	}
	
	@GetMapping("/averageChatDuration")
	public List<ChatDto> getAverageChatDuration() {
		return chatSer.averageChatDuration(true);
	}
	
	@GetMapping("/chatHistory")
	public List<Chat> chatOrderByDesc(@RequestParam String userMatricule){
		return chatSer.getOpenOrderByDesc(userMatricule);
	}
	
	@GetMapping("/ListDuration")
	public List<ChatDto> getDurationList() {
		
		return chatSer.averageChatDuration(false);
	
	}
	
	
	@PutMapping("/disconnect")
	public int disconnect(@RequestParam String matr) {
		userSer.disconnect(matr);
		return 0;
	}
	
	@PutMapping("/makeUserAsFree")
	public int makeUserAsFree(@RequestParam String matr, @RequestParam EtatAgent.UserState state) {
		System.out.println("********makeUserAsFree********");
		userSer.setDisponibility(matr, state);
		return 0;
	}
	
	@GetMapping("/visitorSession")
	public String visitorSession(HttpSession session) {
		String s = session.getId();
		return s;
	}

	
	
	@GetMapping("/getReceiverBySession")
	public String getReceiverBySession(@RequestParam String session) {
		Visitor v = new Visitor();
		v.setSession(session);
		return messageSer.getMessageReceiverBySession(v);
	}
	
	
	/***** Get user session *****/
	
	@GetMapping("/session")
	public ResponderUser session() {
		return (ResponderUser) userSer.getSession().getAttribute("userInfo");
	}
	
	@PostMapping("/sendLogin")
	public String sendLogin(@RequestBody LoginDto logDto) {
		
		return adminSer.sendLogin(logDto.getSession(), logDto.getLogin());
		
	}
	
	
	
}
