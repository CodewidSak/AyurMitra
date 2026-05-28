package com.ayurmitra.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring AI Configuration for Ollama
 * Note: Ollama integration requires manual installation and setup
 * See OLLAMA_SETUP.md for instructions
 */
@Configuration
public class SpringAIConfig {
    
    @Bean
    public ChatClient chatClient(@Autowired(required = false) OllamaChatModel chatModel) {
        if (chatModel != null) {
            return ChatClient.builder(chatModel).build();
        }
        return null; // Return null if Ollama is not available
    }
}

