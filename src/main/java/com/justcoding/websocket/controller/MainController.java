package com.justcoding.websocket.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.justcoding.websocket.models.SimpleTextMessage;

@Controller
public class MainController {
	
	@MessageMapping("/chat.send")
	@SendTo("/topic/public")
	public SimpleTextMessage sendMessage(@Payload SimpleTextMessage message) {
		return message;
	}
	
	@MessageMapping("/chat.add")
	@SendTo("/topic/public")
	public SimpleTextMessage joinRoom(
			@Payload SimpleTextMessage message, SimpMessageHeaderAccessor headerAccessor) {
		headerAccessor.getSessionAttributes().put("username", message.getSender());
		return message;
	}

}
