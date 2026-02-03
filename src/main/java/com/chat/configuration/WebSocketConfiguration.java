package com.chat.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.chat.model.UserHandshakeInterceptor;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer{

	@Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        
        config.setApplicationDestinationPrefixes("/app");
        
	    config.enableSimpleBroker("/topic", "/user");
	    
	    config.setUserDestinationPrefix("/user");
	}
	
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173") //autorise le frontend vite
                .addInterceptors(new UserHandshakeInterceptor()) // <-- ajout de l'interceptor
                .withSockJS();
    }
    
}
