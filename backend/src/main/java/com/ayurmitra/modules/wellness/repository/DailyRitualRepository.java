package com.ayurmitra.modules.wellness.repository;

import com.ayurmitra.modules.wellness.entity.DailyRitual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DailyRitualRepository extends JpaRepository<DailyRitual, Long> {
    
    List<DailyRitual> findByUserIdAndRitualDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    
    List<DailyRitual> findByUserIdOrderByPriorityAscScheduledTimeAsc(Long userId);
    
    @Query("SELECT dr FROM DailyRitual dr WHERE dr.user.id = :userId AND dr.ritualDate >= :startOfDay AND dr.ritualDate < :endOfDay ORDER BY dr.priority ASC, dr.scheduledTime ASC")
    List<DailyRitual> findTodayRitualsByUserId(@Param("userId") Long userId, @Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
    
    @Query("SELECT COUNT(dr) FROM DailyRitual dr WHERE dr.user.id = :userId AND dr.isCompleted = true AND dr.ritualDate >= :startOfDay AND dr.ritualDate < :endOfDay")
    Long countCompletedTodayByUserId(@Param("userId") Long userId, @Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
    
    @Query("SELECT COUNT(dr) FROM DailyRitual dr WHERE dr.user.id = :userId AND dr.ritualDate >= :startOfDay AND dr.ritualDate < :endOfDay")
    Long countTotalTodayByUserId(@Param("userId") Long userId, @Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
    
    List<DailyRitual> findByUserIdAndIsCompletedTrueOrderByCompletionDateDesc(Long userId);
}