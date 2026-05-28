package com.ayurmitra.modules.wellness.service;

import com.ayurmitra.modules.wellness.dto.HerbOfTheDayDTO;
import com.ayurmitra.modules.wellness.entity.HerbOfTheDay;
import com.ayurmitra.modules.wellness.repository.HerbOfTheDayRepository;
import com.ayurmitra.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HerbOfTheDayService {
    
    private final HerbOfTheDayRepository herbOfTheDayRepository;
    
    public Optional<HerbOfTheDayDTO> getTodayHerb() {
        Optional<HerbOfTheDay> herb = herbOfTheDayRepository.findByFeaturedDate(LocalDate.now());
        return herb.map(this::convertToDTO);
    }
    
    public List<HerbOfTheDayDTO> getAllActiveHerbs() {
        List<HerbOfTheDay> herbs = herbOfTheDayRepository.findAll();
        return herbs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<HerbOfTheDayDTO> getHerbById(Long id) {
        Optional<HerbOfTheDay> herb = herbOfTheDayRepository.findById(id);
        return herb.map(this::convertToDTO);
    }
    
    @Transactional
    public HerbOfTheDayDTO createHerb(HerbOfTheDayDTO herbDTO) {
        HerbOfTheDay herb = HerbOfTheDay.builder()
                .name(herbDTO.getName())
                .latinName(herbDTO.getLatinName())
                .description(herbDTO.getDescription())
                .benefits(herbDTO.getBenefits())
                .doshaEffect(herbDTO.getDoshaEffect())
                .preparationMethod(herbDTO.getPreparationMethod())
                .dosage(herbDTO.getDosage())
                .precautions(herbDTO.getPrecautions())
                .imageUrl(herbDTO.getImageUrl())
                .featuredDate(herbDTO.getFeaturedDate() != null ? herbDTO.getFeaturedDate() : LocalDate.now())
                .build();
        
        HerbOfTheDay saved = herbOfTheDayRepository.save(herb);
        return convertToDTO(saved);
    }
    
    private HerbOfTheDayDTO convertToDTO(HerbOfTheDay herb) {
        return HerbOfTheDayDTO.builder()
                .id(herb.getId())
                .name(herb.getName())
                .latinName(herb.getLatinName())
                .description(herb.getDescription())
                .benefits(herb.getBenefits())
                .doshaEffect(herb.getDoshaEffect())
                .preparationMethod(herb.getPreparationMethod())
                .dosage(herb.getDosage())
                .precautions(herb.getPrecautions())
                .imageUrl(herb.getImageUrl())
                .featuredDate(herb.getFeaturedDate())
                .build();
    }
    
    // Initialize default herbs
    @Transactional
    public void initializeDefaultHerbs() {
        if (herbOfTheDayRepository.count() == 0) {
            List<HerbOfTheDay> defaultHerbs = List.of(
                // Week 1 - Cognitive & Mental Health
                HerbOfTheDay.builder()
                    .name("Brahmi")
                    .latinName("Bacopa monnieri")
                    .description("The herb of grace. Renowned for enhancing cognitive function and calming the nervous system.")
                    .benefits("Improves memory, reduces anxiety, supports brain health, enhances focus and concentration")
                    .doshaEffect("Balances Vata and Pitta")
                    .preparationMethod("Fresh juice, powder, or capsules")
                    .dosage("1-2 capsules daily with warm water, or 1-2 tsp fresh juice in the morning")
                    .precautions("Avoid during pregnancy. May cause drowsiness in some individuals")
                    .imageUrl("/images/herbs/brahmi.jpg")
                    .featuredDate(LocalDate.now())
                    .build(),
                
                HerbOfTheDay.builder()
                    .name("Mandukaparni")
                    .latinName("Centella asiatica")
                    .description("The brain tonic herb that enhances mental clarity and supports nervous system health.")
                    .benefits("Improves cognitive function, reduces mental fatigue, supports wound healing")
                    .doshaEffect("Balances Vata and Pitta")
                    .preparationMethod("Fresh juice, powder, or herbal tea")
                    .dosage("1 tsp powder with warm water twice daily")
                    .precautions("Generally safe, avoid excessive doses")
                    .imageUrl("/images/herbs/mandukaparni.jpg")
                    .featuredDate(LocalDate.now().plusDays(1))
                    .build(),
                
                // Week 2 - Stress & Adaptogenic Herbs
                HerbOfTheDay.builder()
                    .name("Ashwagandha")
                    .latinName("Withania somnifera")
                    .description("The winter cherry. A powerful adaptogen that helps the body manage stress and promotes vitality.")
                    .benefits("Reduces stress and cortisol levels, improves strength and muscle mass, enhances sleep quality")
                    .doshaEffect("Balances Vata and Kapha")
                    .preparationMethod("Powder with warm milk or capsules")
                    .dosage("300-500mg twice daily with meals, or 1 tsp powder with warm milk before bed")
                    .precautions("Avoid during pregnancy and breastfeeding. May interact with immunosuppressant medications")
                    .imageUrl("/images/herbs/ashwagandha.jpg")
                    .featuredDate(LocalDate.now().plusDays(2))
                    .build(),
                
                HerbOfTheDay.builder()
                    .name("Jatamansi")
                    .latinName("Nardostachys jatamansi")
                    .description("The Himalayan spikenard. A potent nervine that calms the mind and promotes restful sleep.")
                    .benefits("Reduces anxiety, improves sleep quality, supports emotional balance")
                    .doshaEffect("Balances Vata and Pitta")
                    .preparationMethod("Powder or herbal decoction")
                    .dosage("1/4 to 1/2 tsp powder with warm water before bed")
                    .precautions("Avoid during pregnancy. May cause drowsiness")
                    .imageUrl("/images/herbs/jatamansi.jpg")
                    .featuredDate(LocalDate.now().plusDays(3))
                    .build(),
                
                // Week 3 - Digestive Health
                HerbOfTheDay.builder()
                    .name("Turmeric")
                    .latinName("Curcuma longa")
                    .description("The golden spice. A potent anti-inflammatory herb that supports overall health and healing.")
                    .benefits("Powerful anti-inflammatory properties, supports joint health, boosts immunity, aids digestion")
                    .doshaEffect("Balances all three doshas")
                    .preparationMethod("Fresh root, powder, or curcumin supplements")
                    .dosage("1 tsp powder with warm milk and black pepper, or 500mg curcumin supplement daily")
                    .precautions("May increase bleeding risk. Avoid high doses if taking blood thinners")
                    .imageUrl("/images/herbs/turmeric.jpg")
                    .featuredDate(LocalDate.now().plusDays(4))
                    .build(),
                
                HerbOfTheDay.builder()
                    .name("Ginger")
                    .latinName("Zingiber officinale")
                    .description("The universal medicine. Excellent for digestion, nausea, and circulation.")
                    .benefits("Improves digestion, reduces nausea, anti-inflammatory, supports circulation")
                    .doshaEffect("Balances Vata and Kapha, may increase Pitta in excess")
                    .preparationMethod("Fresh root, dried powder, or tea")
                    .dosage("1-2 tsp fresh ginger juice or 1/2 tsp powder with meals")
                    .precautions("Avoid in high Pitta conditions, gallstones, or before surgery")
                    .imageUrl("/images/herbs/ginger.jpg")
                    .featuredDate(LocalDate.now().plusDays(5))
                    .build(),
                
                HerbOfTheDay.builder()
                    .name("Triphala")
                    .latinName("Three fruits combination")
                    .description("The three fruits. A gentle detoxifier and digestive tonic combining Amalaki, Bibhitaki, and Haritaki.")
                    .benefits("Supports digestion, gentle detoxification, improves elimination, rich in antioxidants")
                    .doshaEffect("Balances all three doshas")
                    .preparationMethod("Powder or tablets")
                    .dosage("1-2 tsp powder with warm water before bed or 2 tablets daily")
                    .precautions("Start with small doses. Avoid during pregnancy")
                    .imageUrl("/images/herbs/triphala.jpg")
                    .featuredDate(LocalDate.now().plusDays(6))
                    .build(),
                
                // Week 4 - Respiratory & Immunity
                HerbOfTheDay.builder()
                    .name("Tulsi")
                    .latinName("Ocimum sanctum")
                    .description("The holy basil. A sacred herb that supports respiratory health and builds immunity.")
                    .benefits("Supports respiratory health, boosts immunity, reduces stress, antimicrobial properties")
                    .doshaEffect("Balances Vata and Kapha")
                    .preparationMethod("Fresh leaves, tea, or powder")
                    .dosage("5-10 fresh leaves daily or 1 cup tulsi tea twice daily")
                    .precautions("Generally safe, may lower blood sugar levels")
                    .imageUrl("/images/herbs/tulsi.jpg")
                    .featuredDate(LocalDate.now().plusDays(7))
                    .build(),
                
                HerbOfTheDay.builder()
                    .name("Licorice")
                    .latinName("Glycyrrhiza glabra")
                    .description("The sweet root. Soothes respiratory passages and supports adrenal health.")
                    .benefits("Soothes throat and respiratory tract, supports adrenal function, anti-inflammatory")
                    .doshaEffect("Balances Vata and Pitta, may increase Kapha")
                    .preparationMethod("Root powder, tea, or extract")
                    .dosage("1/2 tsp powder with warm water or milk twice daily")
                    .precautions("Avoid with high blood pressure, heart conditions, or during pregnancy")
                    .imageUrl("/images/herbs/licorice.jpg")
                    .featuredDate(LocalDate.now().plusDays(8))
                    .build(),
                
                // Week 5 - Women's Health & Hormonal Balance
                HerbOfTheDay.builder()
                    .name("Shatavari")
                    .latinName("Asparagus racemosus")
                    .description("The queen of herbs for women. Supports reproductive health and hormonal balance.")
                    .benefits("Supports female reproductive health, balances hormones, nourishes tissues")
                    .doshaEffect("Balances Vata and Pitta")
                    .preparationMethod("Powder with warm milk or ghee")
                    .dosage("1 tsp powder with warm milk twice daily")
                    .precautions("Generally safe, consult healthcare provider during pregnancy")
                    .imageUrl("/images/herbs/shatavari.jpg")
                    .featuredDate(LocalDate.now().plusDays(9))
                    .build(),
                
                HerbOfTheDay.builder()
                    .name("Aloe Vera")
                    .latinName("Aloe barbadensis")
                    .description("The plant of immortality. Cooling and healing for both internal and external use.")
                    .benefits("Soothes digestive tract, supports skin health, cooling and anti-inflammatory")
                    .doshaEffect("Balances Pitta and Vata")
                    .preparationMethod("Fresh gel or juice")
                    .dosage("2-4 tbsp fresh gel or juice on empty stomach")
                    .precautions("Avoid during pregnancy, menstruation, or with kidney problems")
                    .imageUrl("/images/herbs/aloe.jpg")
                    .featuredDate(LocalDate.now().plusDays(10))
                    .build(),
                
                // Week 6 - Heart Health & Circulation
                HerbOfTheDay.builder()
                    .name("Arjuna")
                    .latinName("Terminalia arjuna")
                    .description("The heart protector. Supports cardiovascular health and strengthens the heart muscle.")
                    .benefits("Supports heart health, improves circulation, strengthens cardiac muscle")
                    .doshaEffect("Balances Pitta and Kapha")
                    .preparationMethod("Bark powder or decoction")
                    .dosage("1/2 tsp powder with warm water twice daily")
                    .precautions("Consult healthcare provider if on heart medications")
                    .imageUrl("/images/herbs/arjuna.jpg")
                    .featuredDate(LocalDate.now().plusDays(11))
                    .build(),
                
                HerbOfTheDay.builder()
                    .name("Guggulu")
                    .latinName("Commiphora mukul")
                    .description("The cholesterol manager. Supports healthy cholesterol levels and joint health.")
                    .benefits("Supports healthy cholesterol, aids weight management, supports joint health")
                    .doshaEffect("Balances Vata and Kapha")
                    .preparationMethod("Standardized extract or traditional preparations")
                    .dosage("As per standardized extract instructions")
                    .precautions("Avoid during pregnancy, may interact with thyroid medications")
                    .imageUrl("/images/herbs/guggulu.jpg")
                    .featuredDate(LocalDate.now().plusDays(12))
                    .build(),
                
                // Week 7 - Energy & Vitality
                HerbOfTheDay.builder()
                    .name("Shilajit")
                    .latinName("Asphaltum")
                    .description("The destroyer of weakness. A mineral-rich substance that enhances energy and vitality.")
                    .benefits("Increases energy, supports male reproductive health, enhances physical performance")
                    .doshaEffect("Balances Vata and Kapha")
                    .preparationMethod("Purified resin dissolved in warm water or milk")
                    .dosage("Rice grain sized amount dissolved in warm water twice daily")
                    .precautions("Use only purified shilajit, avoid during fever or high Pitta conditions")
                    .imageUrl("/images/herbs/shilajit.jpg")
                    .featuredDate(LocalDate.now().plusDays(13))
                    .build()
            );
            
            herbOfTheDayRepository.saveAll(defaultHerbs);
            log.info("Initialized {} herbs in the database", defaultHerbs.size());
        }
    }
}