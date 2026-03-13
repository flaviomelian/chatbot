package com.flavio.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flavio.backend.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {}