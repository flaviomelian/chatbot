package com.flavio.backend.controller;

import com.flavio.backend.model.Message;
import com.flavio.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private ChatService chatService;

    // Obtener todos los mensajes de la conversación 1
    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAllMessages() {
        // Usamos el método que ya definimos en el servicio
        List<Message> messages = chatService.getMessagesByConversation(1L);
        
        // Mapeamos al formato que espera el Frontend {role, content}
        List<Map<String, String>> response = messages.stream().map(m -> {
            Map<String, String> map = new HashMap<>();
            // Normalizamos nombres: USER -> user, AI -> assistant
            String role = m.getSender().equalsIgnoreCase("USER") ? "user" : "assistant";
            map.put("role", role);
            map.put("content", m.getContent());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}