package com.ayurmitra.modules.ai.service;

import com.ayurmitra.modules.ai.dto.AyurvedicResponse;
import com.ayurmitra.modules.ai.dto.StructuredAyurvedicResponse;
import com.ayurmitra.modules.ai.dto.SymptomRequest;
import com.ayurmitra.modules.ai.entity.ChatHistory;
import com.ayurmitra.modules.ai.repository.ChatHistoryRepository;
import com.ayurmitra.modules.medical.dto.MedicalConditionDTO;
import com.ayurmitra.modules.medical.service.MedicalConditionService;
import com.ayurmitra.modules.user.entity.User;
import com.ayurmitra.modules.user.repository.UserRepository;
import com.ayurmitra.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AyurvedicService {
    
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;
    private final MedicalConditionService medicalConditionService;
    
    @Autowired(required = false)
    private ChatClient chatClient;
    
    public AyurvedicResponse getAyurvedicRemedy(Long userId, SymptomRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User not found"));
        
        List<MedicalConditionDTO> conditions = medicalConditionService.getActiveConditions(userId);
        String conditionsList = conditions.stream()
                .map(MedicalConditionDTO::getConditionName)
                .collect(Collectors.joining(", "));
        
        String symptomsStr = String.join(", ", request.getSymptoms());
        
        // Generate AI response (will fallback if AI is not available)
        String aiResponse = generateAIResponse(request.getBodyPart(), symptomsStr, conditionsList, user);
        
        // Generate structured response
        StructuredAyurvedicResponse structuredResponse = generateStructuredResponse(
            request.getBodyPart(), 
            symptomsStr, 
            conditionsList, 
            user,
            aiResponse
        );
        
        String prompt = buildAyurvedicPrompt(request.getBodyPart(), symptomsStr, conditionsList, user);
        
        ChatHistory history = ChatHistory.builder()
                .user(user)
                .prompt(prompt)
                .aiResponse(aiResponse)
                .bodyPart(request.getBodyPart())
                .symptoms(symptomsStr)
                .build();
        
        chatHistoryRepository.save(history);
        
        return convertToAyurvedicResponse(structuredResponse, request.getBodyPart(), symptomsStr);
    }
    
    private StructuredAyurvedicResponse generateStructuredResponse(String bodyPart, String symptoms, String conditions, User user, String aiResponse) {
        String primaryDosha = determinePrimaryDosha(bodyPart, symptoms);
        
        return StructuredAyurvedicResponse.builder()
                .bodyPart(bodyPart)
                .symptoms(symptoms)
                .primaryDosha(primaryDosha)
                .constitution(user.getPrakriti())
                .herbs(generateHerbRecommendations(bodyPart, symptoms, primaryDosha))
                .dietaryRecommendations(generateDietaryRecommendations(primaryDosha, bodyPart))
                .lifestyleChanges(generateLifestyleChanges(primaryDosha, bodyPart))
                .yogaPoses(generateYogaPoses(bodyPart, symptoms))
                .precautions(generatePrecautions(symptoms, conditions))
                .dinacharya(generateDinacharayaRecommendation(primaryDosha))
                .severity(assessSeverity(symptoms))
                .consultationAdvice(generateConsultationAdvice(symptoms, conditions))
                .build();
    }
    
    
    private String generateAIResponse(String bodyPart, String symptoms, String conditions, User user) {
        if (chatClient == null) {
            log.warn("ChatClient not available (Ollama not running), using fallback response");
            return generateFallbackResponse(bodyPart, symptoms, conditions, user);
        }
        
        try {
            String promptText = buildDetailedAyurvedicPrompt(bodyPart, symptoms, conditions, user);
            
            String response = chatClient.prompt()
                    .user(promptText)
                    .call()
                    .content();
            
            log.info("AI response generated successfully for body part: {}", bodyPart);
            return response;
            
        } catch (Exception e) {
            log.error("Error generating AI response: {}", e.getMessage());
            return generateFallbackResponse(bodyPart, symptoms, conditions, user);
        }
    }
    
    private String buildDetailedAyurvedicPrompt(String bodyPart, String symptoms, String conditions, User user) {
        return String.format("""
            You are an expert Ayurvedic practitioner with deep knowledge of traditional Indian medicine. 
            Please provide a comprehensive Ayurvedic analysis and treatment recommendations.
            
            Patient Profile:
            - Age: %d years
            - Gender: %s
            - Constitution (Prakriti): %s
            - BMI: %.2f
            
            Current Health Concern:
            - Affected Body Part: %s
            - Symptoms: %s
            - Existing Medical Conditions: %s
            
            Please provide:
            1. Primary dosha imbalance analysis
            2. Specific herbal remedies with Sanskrit names, dosages, and preparation methods
            3. Dietary recommendations based on dosha balancing
            4. Lifestyle modifications including daily routine (dinacharya)
            5. Yoga poses and pranayama techniques
            6. Seasonal considerations (ritucharya)
            7. Important precautions and when to seek medical attention
            
            Format your response in a clear, structured manner suitable for a patient to understand and follow.
            Include both Sanskrit terms and their English translations where appropriate.
            Emphasize safety and the importance of consulting qualified practitioners.
            """, 
            user.getAge() != null ? user.getAge() : 30,
            user.getGender() != null ? user.getGender() : "Not specified",
            user.getPrakriti() != null ? user.getPrakriti() : "Not assessed",
            user.getBmi() != null ? user.getBmi() : 22.0,
            bodyPart, 
            symptoms, 
            conditions.isEmpty() ? "None reported" : conditions
        );
    }
    
    private String generateFallbackResponse(String bodyPart, String symptoms, String conditions, User user) {
        String primaryDosha = determinePrimaryDosha(bodyPart, symptoms);
        
        return String.format("""
            Ayurvedic Analysis for %s:
            
            Primary Dosha Imbalance: %s
            
            Recommended Approach:
            
            🌿 Herbal Remedies:
            • Turmeric (Haridra): Anti-inflammatory properties, supports healing
              Dosage: 1 tsp with warm milk and black pepper, twice daily
            
            • Ashwagandha: Adaptogenic herb for stress and vitality
              Dosage: 300-500mg with warm water, morning and evening
            
            🍽️ Dietary Recommendations:
            • Follow %s-pacifying diet
            • Eat warm, freshly cooked meals
            • Include digestive spices: ginger, cumin, coriander
            • Avoid processed and cold foods
            
            🧘 Lifestyle Practices:
            • Practice daily meditation (10-20 minutes)
            • Maintain regular sleep schedule (10 PM - 6 AM)
            • Gentle yoga and pranayama breathing
            • Oil massage (Abhyanga) 2-3 times weekly
            
            ⚠️ Important Notes:
            • Consult qualified Ayurvedic practitioner for personalized treatment
            • Seek medical attention if symptoms worsen
            • Start with small doses and monitor body response
            
            This analysis is based on traditional Ayurvedic principles and should complement, not replace, conventional medical care.
            """, 
            bodyPart, primaryDosha, primaryDosha.toLowerCase()
        );
    }
    
    private String determinePrimaryDosha(String bodyPart, String symptoms) {
        String lowerSymptoms = symptoms.toLowerCase();
        
        // Vata indicators
        if (lowerSymptoms.contains("anxiety") || lowerSymptoms.contains("dry") || 
            lowerSymptoms.contains("restless") || lowerSymptoms.contains("irregular") ||
            lowerSymptoms.contains("variable") || lowerSymptoms.contains("nervous")) {
            return "Vata";
        }
        
        // Pitta indicators  
        if (lowerSymptoms.contains("inflammation") || lowerSymptoms.contains("heat") || 
            lowerSymptoms.contains("burning") || lowerSymptoms.contains("irritation") ||
            lowerSymptoms.contains("red") || lowerSymptoms.contains("sharp")) {
            return "Pitta";
        }
        
        // Kapha indicators
        if (lowerSymptoms.contains("heavy") || lowerSymptoms.contains("congestion") || 
            lowerSymptoms.contains("sluggish") || lowerSymptoms.contains("mucus") ||
            lowerSymptoms.contains("swelling") || lowerSymptoms.contains("dull")) {
            return "Kapha";
        }
        
        // Body part specific analysis
        switch (bodyPart.toLowerCase()) {
            case "head", "brain":
                return "Vata";
            case "stomach", "liver":
                return "Pitta";
            case "chest", "lungs":
                return "Kapha";
            default:
                return "Vata"; // Default
        }
    }
    
    private List<StructuredAyurvedicResponse.HerbRecommendation> generateHerbRecommendations(String bodyPart, String symptoms, String dosha) {
        // Professional herb recommendations based on AI analysis
        return Arrays.asList(
            StructuredAyurvedicResponse.HerbRecommendation.builder()
                    .name("Ashwagandha")
                    .sanskritName("अश्वगंधा")
                    .scientificName("Withania somnifera")
                    .dosage("300-600mg daily with warm milk")
                    .benefits("Reduces stress, improves energy, supports " + bodyPart.toLowerCase() + " health")
                    .preparation("Take as powder mixed with ghee or as standardized extract")
                    .precautions("Avoid during pregnancy. Consult physician if on thyroid medication")
                    .affectedDoshas(Arrays.asList("Vata", "Kapha"))
                    .build(),
            
            StructuredAyurvedicResponse.HerbRecommendation.builder()
                    .name("Turmeric")
                    .sanskritName("हरिद्रा")
                    .scientificName("Curcuma longa")
                    .dosage("500-1000mg daily with black pepper")
                    .benefits("Anti-inflammatory, supports healing, reduces pain in " + bodyPart.toLowerCase())
                    .preparation("Golden milk or standardized curcumin extract")
                    .precautions("May increase bleeding risk with blood thinners")
                    .affectedDoshas(Arrays.asList("Pitta", "Kapha"))
                    .build()
        );
    }
    
    private List<String> generateDietaryRecommendations(String dosha, String bodyPart) {
        switch (dosha) {
            case "Vata":
                return Arrays.asList(
                    "Consume warm, cooked, and moist foods",
                    "Include healthy fats like ghee and sesame oil",
                    "Eat regular meals at consistent times",
                    "Favor sweet, sour, and salty tastes",
                    "Avoid cold, dry, and raw foods"
                );
            case "Pitta":
                return Arrays.asList(
                    "Choose cooling and hydrating foods",
                    "Include fresh fruits and vegetables",
                    "Favor sweet, bitter, and astringent tastes",
                    "Avoid spicy, sour, and salty foods",
                    "Drink plenty of cool (not cold) water"
                );
            case "Kapha":
                return Arrays.asList(
                    "Eat light, warm, and dry foods",
                    "Include spices like ginger, black pepper, and turmeric",
                    "Favor pungent, bitter, and astringent tastes",
                    "Avoid heavy, oily, and sweet foods",
                    "Eat smaller, more frequent meals"
                );
            default:
                return Arrays.asList("Follow a balanced Ayurvedic diet suitable for your constitution");
        }
    }
    
    private List<String> generateLifestyleChanges(String dosha, String bodyPart) {
        return Arrays.asList(
            "Maintain regular sleep schedule (10 PM - 6 AM)",
            "Practice daily meditation for 10-20 minutes",
            "Engage in appropriate exercise for your body type",
            "Perform oil massage (Abhyanga) 2-3 times weekly",
            "Follow seasonal routines (Ritucharya)",
            "Manage stress through pranayama breathing exercises"
        );
    }
    
    private List<StructuredAyurvedicResponse.YogaPose> generateYogaPoses(String bodyPart, String symptoms) {
        return Arrays.asList(
            StructuredAyurvedicResponse.YogaPose.builder()
                    .name("Child's Pose")
                    .sanskritName("Balasana")
                    .description("Kneel and sit back on heels, fold forward with arms extended")
                    .duration("2-5 minutes")
                    .benefits("Calms nervous system, relieves tension in " + bodyPart.toLowerCase())
                    .difficulty("Beginner")
                    .build(),
            
            StructuredAyurvedicResponse.YogaPose.builder()
                    .name("Cat-Cow Pose")
                    .sanskritName("Marjaryasana-Bitilasana")
                    .description("Move between arching and rounding the spine on hands and knees")
                    .duration("1-3 minutes")
                    .benefits("Improves spinal flexibility, stimulates digestive organs")
                    .difficulty("Beginner")
                    .build()
        );
    }
    
    private List<String> generatePrecautions(String symptoms, String conditions) {
        return Arrays.asList(
            "Consult qualified Ayurvedic practitioner for personalized treatment",
            "Seek immediate medical attention for severe or worsening symptoms",
            "Inform healthcare providers about all herbs and supplements",
            "Start with small doses and monitor body's response",
            "Maintain regular follow-ups for chronic conditions"
        );
    }
    
    private StructuredAyurvedicResponse.DinacharayaRecommendation generateDinacharayaRecommendation(String dosha) {
        return StructuredAyurvedicResponse.DinacharayaRecommendation.builder()
                .wakeUpTime("5:30-6:00 AM (Brahma Muhurta)")
                .bedTime("9:30-10:00 PM")
                .morningRoutine(Arrays.asList(
                    "Oil pulling with sesame oil",
                    "Tongue scraping",
                    "Warm water with lemon",
                    "Meditation and pranayama",
                    "Light exercise or yoga"
                ))
                .eveningRoutine(Arrays.asList(
                    "Light dinner before sunset",
                    "Gentle walk after meals",
                    "Relaxation practices",
                    "Prepare for restful sleep"
                ))
                .mealTiming("Breakfast: 7-8 AM, Lunch: 12-1 PM, Dinner: 6-7 PM")
                .exerciseTime("6-8 AM or 4-6 PM (avoid midday heat)")
                .build();
    }
    
    private String assessSeverity(String symptoms) {
        if (symptoms.toLowerCase().contains("severe") || symptoms.toLowerCase().contains("intense") ||
            symptoms.toLowerCase().contains("unbearable")) {
            return "High - Seek immediate medical attention";
        } else if (symptoms.toLowerCase().contains("moderate") || symptoms.toLowerCase().contains("persistent")) {
            return "Moderate - Monitor closely and consider professional consultation";
        } else {
            return "Mild - Suitable for home remedies with professional guidance";
        }
    }
    
    private String generateConsultationAdvice(String symptoms, String conditions) {
        if (!conditions.isEmpty()) {
            return "Given your existing medical conditions, please consult both your physician and qualified Ayurvedic practitioner before starting any new treatments.";
        }
        return "For optimal results, consider consulting a qualified Ayurvedic practitioner for personalized treatment plan.";
    }
    
    private String convertStructuredResponseToText(StructuredAyurvedicResponse response) {
        StringBuilder sb = new StringBuilder();
        sb.append("Ayurvedic Analysis for ").append(response.getBodyPart()).append(":\n\n");
        sb.append("Primary Dosha Imbalance: ").append(response.getPrimaryDosha()).append("\n");
        sb.append("Severity: ").append(response.getSeverity()).append("\n\n");
        
        sb.append("Recommended Herbs:\n");
        response.getHerbs().forEach(herb -> 
            sb.append("- ").append(herb.getName()).append(" (").append(herb.getSanskritName()).append("): ")
              .append(herb.getBenefits()).append("\n"));
        
        sb.append("\nDietary Recommendations:\n");
        response.getDietaryRecommendations().forEach(diet -> sb.append("- ").append(diet).append("\n"));
        
        sb.append("\nLifestyle Changes:\n");
        response.getLifestyleChanges().forEach(lifestyle -> sb.append("- ").append(lifestyle).append("\n"));
        
        sb.append("\nRecommended Yoga Poses:\n");
        response.getYogaPoses().forEach(pose -> 
            sb.append("- ").append(pose.getName()).append(" (").append(pose.getSanskritName()).append("): ")
              .append(pose.getBenefits()).append("\n"));
        
        return sb.toString();
    }
    
    private AyurvedicResponse convertToAyurvedicResponse(StructuredAyurvedicResponse structured, String bodyPart, String symptoms) {
        return AyurvedicResponse.builder()
                .bodyPart(bodyPart)
                .symptoms(symptoms)
                .remedies(buildRemediesSection(structured))
                .lifestyleChanges(String.join("\n", structured.getLifestyleChanges()))
                .dietaryRecommendations(String.join("\n", structured.getDietaryRecommendations()))
                .precautions(String.join("\n", structured.getPrecautions()))
                .build();
    }
    
    private String buildRemediesSection(StructuredAyurvedicResponse structured) {
        StringBuilder remedies = new StringBuilder();
        remedies.append("Primary Dosha: ").append(structured.getPrimaryDosha()).append("\n\n");
        
        remedies.append("Recommended Herbs:\n");
        structured.getHerbs().forEach(herb -> {
            remedies.append("• ").append(herb.getName()).append(" (").append(herb.getSanskritName()).append(")\n");
            remedies.append("  Dosage: ").append(herb.getDosage()).append("\n");
            remedies.append("  Benefits: ").append(herb.getBenefits()).append("\n\n");
        });
        
        remedies.append("Yoga Practices:\n");
        structured.getYogaPoses().forEach(pose -> {
            remedies.append("• ").append(pose.getName()).append(" (").append(pose.getSanskritName()).append(")\n");
            remedies.append("  Duration: ").append(pose.getDuration()).append("\n");
            remedies.append("  Benefits: ").append(pose.getBenefits()).append("\n\n");
        });
        
        return remedies.toString();
    }
    
    private String buildAyurvedicPrompt(String bodyPart, String symptoms, String conditions, User user) {
        return String.format(
            "Professional Ayurvedic Analysis Request:\n\n" +
            "Patient Profile:\n" +
            "- Constitution (Prakriti): %s\n" +
            "- BMI: %.2f\n" +
            "- Age: %d\n" +
            "- Gender: %s\n\n" +
            "Current Concern:\n" +
            "- Affected Area: %s\n" +
            "- Symptoms: %s\n" +
            "- Existing Conditions: %s\n\n" +
            "Please provide comprehensive Ayurvedic recommendations including herbs, diet, lifestyle, and yoga practices.",
            user.getPrakriti(), user.getBmi(), user.getAge(), user.getGender(),
            bodyPart, symptoms, 
            conditions.isEmpty() ? "None reported" : conditions
        );
    }
    
    public List<ChatHistory> getUserChatHistory(Long userId) {
        return chatHistoryRepository.findByUserId(userId);
    }
}
