package com.flavio.backend.dto;

import java.util.List;
import java.util.Map;

public record ChatRequest(
    String message,
    String systemPrompt,
    Double temperature,
    List<Map<String, String>> history
) {}