package com.flavio.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob // Indica que es un objeto grande
    @Column(columnDefinition = "TEXT") // Fuerza a MySQL a usar el tipo TEXT (hasta 64KB)
    private String content;
    
    // Si crees que te va a escribir El Quijote, usa columnDefinition = "LONGTEXT"
    
    private String sender;
    private LocalDateTime timestamp = LocalDateTime.now();
    
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "chat_id")
    private ChatConversation conversation;
}
