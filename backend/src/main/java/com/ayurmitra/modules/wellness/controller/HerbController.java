package com.ayurmitra.modules.wellness.controller;

import com.ayurmitra.modules.wellness.dto.HerbOfTheDayDTO;
import com.ayurmitra.modules.wellness.service.HerbOfTheDayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/herbs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class HerbController {
    
    private final HerbOfTheDayService herbOfTheDayService;
    
    @GetMapping("/today")
    public ResponseEntity<HerbOfTheDayDTO> getTodayHerb() {
        Optional<HerbOfTheDayDTO> herb = herbOfTheDayService.getTodayHerb();
        return herb.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<HerbOfTheDayDTO>> getAllHerbs() {
        List<HerbOfTheDayDTO> herbs = herbOfTheDayService.getAllActiveHerbs();
        return ResponseEntity.ok(herbs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HerbOfTheDayDTO> getHerbById(@PathVariable Long id) {
        Optional<HerbOfTheDayDTO> herb = herbOfTheDayService.getHerbById(id);
        return herb.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<HerbOfTheDayDTO> createHerb(@RequestBody HerbOfTheDayDTO herbDTO) {
        HerbOfTheDayDTO herb = herbOfTheDayService.createHerb(herbDTO);
        return ResponseEntity.ok(herb);
    }
    
    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeDefaultHerbs() {
        herbOfTheDayService.initializeDefaultHerbs();
        return ResponseEntity.ok().build();
    }
}