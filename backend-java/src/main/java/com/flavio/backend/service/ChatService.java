package com.flavio.backend.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.flavio.backend.dto.ChatRequest;
import com.flavio.backend.model.ChatConversation;
import com.flavio.backend.model.Message;
import com.flavio.backend.repository.ChatRepository;
import com.flavio.backend.repository.MessageRepository;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Service
public class ChatService {

    @Value("${PYTHON_API_URL}")
    private String pythonApiUrl;

    // Ruta al ejecutable del venv (añádela a tu .env)
    @Value("${PYTHON_VENV_EXE:backend-python/venv/Scripts/python.exe}")
    private String pythonVenvExe;

    private Process pythonProcess;
    private final RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private ChatRepository chatRepository;

    // ESTO SE EJECUTA AL ARRANCAR SPRING
    @PostConstruct
    public void init() {
        new Thread(() -> {
            try {
                System.out.println("🚀 [ChatService] Levantando FastAPI en segundo plano...");
                ProcessBuilder pb = new ProcessBuilder(
                        pythonVenvExe, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000");
                pb.directory(new java.io.File("backend-python"));
                pb.redirectErrorStream(true);
                pythonProcess = pb.start();

                // Redirigir logs a la consola de Java para debuggear
                pythonProcess.getInputStream().transferTo(System.out);
            } catch (Exception e) {
                System.err.println("❌ Error arrancando el motor Python: " + e.getMessage());
            }
        }).start();
    }

    // ESTO CIERRA PYTHON AL APAGAR SPRING
    @PreDestroy
    public void shutdown() {
        if (pythonProcess != null && pythonProcess.isAlive()) {
            System.out.println("🛑 Apagando motor Python...");
            pythonProcess.destroy();
        }
    }

    public String askPython(String userMessageText, String systemPrompt, Double temperature, List<Map<String, String>> history) {

        // 1. Lógica de conversación (ID 1) - SE QUEDA IGUAL
        ChatConversation conversation = chatRepository.findById(1L)
                .orElseGet(() -> {
                    ChatConversation newChat = new ChatConversation();
                    newChat.setTitle("Sesión Azure AI Enterprise");
                    return chatRepository.save(newChat);
                });

        // 2. Guardar mensaje del USUARIO - SE QUEDA IGUAL
        Message userMsg = new Message();
        userMsg.setContent(userMessageText);
        userMsg.setSender("USER");
        userMsg.setConversation(conversation);
        messageRepository.save(userMsg);

        try {
            // 1. Creamos el DTO con el prompt dinámico
            ChatRequest requestBody = new ChatRequest(
                    userMessageText,
                    systemPrompt,
                    temperature,
                    history);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<ChatRequest> entity = new HttpEntity<>(requestBody, headers);

            // 2. Llamada a FastAPI
            Map<String, Object> response = restTemplate.postForObject(pythonApiUrl, entity, Map.class);

            // Extraemos la cadena de texto de la respuesta
            String aiResult = response.get("respuesta").toString();

            // 3. --- GUARDADO EN BD ---
            // Creamos la entidad de mensaje para la IA
            Message aiMessage = new Message();
            aiMessage.setContent(aiResult);
            aiMessage.setSender("AI");
            aiMessage.setTimestamp(LocalDateTime.now());

            // IMPORTANTE: Debes asociarlo a la conversación actual.
            // Asumo que tienes el objeto 'conversation' disponible en este método.
            aiMessage.setConversation(conversation);

            // Guardamos en la base de datos (vía MessageRepository)
            messageRepository.save(aiMessage);

            return aiResult;

        } catch (Exception e) {
            // Si falla el puente, podrías querer loguear el error para debuggear la red
            // local
            System.err.println("Error en la llamada al microservicio Python: " + e.getMessage());
            return "Error en el puente HTTP: " + e.getMessage();
        }
    }

    public List<Message> getMessagesByConversation(Long conversationId) {
        // Buscamos la conversación y devolvemos sus mensajes
        return chatRepository.findById(conversationId)
                .map(ChatConversation::getMessages)
                .orElse(List.of());
    }
}