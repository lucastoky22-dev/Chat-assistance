package com.chat.model;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import jakarta.servlet.http.HttpSession;

import java.util.Map;

public class UserHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {
    	
        String query = request.getURI().getQuery(); 
        
        String matricule = query != null && query.contains("matricule=") ?
                query.split("matricule=")[1] : "unknown";

        attributes.put("principal", new StompPrincipal(matricule));
        
        System.out.println("WebSocket principal : " + matricule);
        
        if(request instanceof ServletServerHttpRequest servletRequest) {
        	
        	HttpSession session = servletRequest.getServletRequest().getSession();
        	
        	attributes.put("HTTP_SESSION_ID", session.getId());
        }
        
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) { }
}