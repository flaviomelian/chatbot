package com.flavio.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flavio.backend.model.ChatConversation;

public interface ChatRepository extends JpaRepository<ChatConversation, Long> {}
