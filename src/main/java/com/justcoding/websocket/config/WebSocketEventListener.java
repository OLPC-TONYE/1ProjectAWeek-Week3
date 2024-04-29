package com.justcoding.websocket.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.justcoding.websocket.models.MessageType;
import com.justcoding.websocket.models.SimpleTextMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
	
	private final SimpMessageSendingOperations messageTemplate;
	
	@EventListener
	public void handleWebSocketListenerEvent(SessionDisconnectEvent event) {
		
		StompHeaderAccessor headeraccessor = StompHeaderAccessor.wrap(event.getMessage());
		String username = (String) headeraccessor.getSessionAttributes().get("username");
		log.info("User disconnected", username);
		var message = SimpleTextMessage.builder().type(MessageType.LEAVE).sender(username).build();
		
		messageTemplate.convertAndSend("/topic/public", message);
		
	}
}
