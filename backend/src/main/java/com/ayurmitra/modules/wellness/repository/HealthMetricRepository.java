package com.ayurmitra.modules.wellness.repository;

import com.ayurmitra.modules.wellness.entity.HealthMetric;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HealthMetricRepository extends JpaRepository<HealthMetric, Long> {
    
    List<HealthMetric> findByUserIdAndMetricTypeOrderByRecordedAtDesc(Long userId, String metricType);
    
    @Query("SELECT hm FROM HealthMetric hm WHERE hm.user.id = :userId AND hm.metricType = :metricType ORDER BY hm.recordedAt DESC")
    List<HealthMetric> findLatestByUserIdAndMetricType(@Param("userId") Long userId, @Param("metricType") String metricType, Pageable pageable);
    
    List<HealthMetric> findByUserIdOrderByRecordedAtDesc(Long userId);
    
    @Query("SELECT AVG(hm.metricValue) FROM HealthMetric hm WHERE hm.user.id = :userId AND hm.metricType = :metricType")
    Double getAverageMetricValue(@Param("userId") Long userId, @Param("metricType") String metricType);
}