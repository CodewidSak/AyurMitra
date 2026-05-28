package com.ayurmitra.modules.wellness.repository;

import com.ayurmitra.modules.wellness.entity.HerbOfTheDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HerbOfTheDayRepository extends JpaRepository<HerbOfTheDay, Long> {
    
    Optional<HerbOfTheDay> findByFeaturedDate(LocalDate featuredDate);
    
    List<HerbOfTheDay> findByNameContainingIgnoreCase(String name);
    
    List<HerbOfTheDay> findAllByOrderByFeaturedDateDesc();
}