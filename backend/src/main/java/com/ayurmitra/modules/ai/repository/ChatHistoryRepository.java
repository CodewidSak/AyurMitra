package com.ayurmitra.modules.ai.repository;

import com.ayurmitra.modules.ai.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserId(Long userId);
    Page<ChatHistory> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<ChatHistory> findByUserIdAndBodyPart(Long userId, String bodyPart);
}
