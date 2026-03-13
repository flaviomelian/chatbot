package com.flavio.backend.controller;

import com.flavio.backend.dto.ChatRequest;
import com.flavio.backend.service.ChatService; // Asumiendo que tienes este servicio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*") // Permite peticiones desde Next.js
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> processChat(@RequestBody ChatRequest request) {
        try {
            // 1. Llamada al servicio que conecta con Azure OpenAI
            // Le pasamos el mensaje, el historial, el prompt y la temperatura del slider
            String aiResponse = chatService.askPython(
                request.message(),
                request.systemPrompt(),
                request.temperature(),
                request.history()
            );

            // 2. Preparamos la respuesta para el Frontend
            Map<String, Object> response = new HashMap<>();
            response.put("role", "assistant");
            response.put("content", aiResponse);
            response.put("status", "success");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Manejo de errores profesional
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage() + " (Error al procesar la solicitud)");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}