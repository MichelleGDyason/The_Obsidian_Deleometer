import { MEDIA_TYPES } from '../constants';

// Cognitive-Behavioral Therapy analysis result interface
export interface CbtAnalysisResult {
    cognitiveDistortions: string[];
    behavioralPatterns: string[];
    coreBeliefs: string[];
    adaptiveStrategies: string[];
    summary: string;
}

// Cognitive-Behavioral Therapy analysis class
export class CbtAnalysis {
    // Cognitive distortions concepts
    private cognitiveDistortions: string[] = [
        "All-or-nothing thinking",
        "Overgeneralization",
        "Mental filtering",
        "Catastrophizing",
        "Emotional reasoning",
        "Should statements",
        "Personalization"
    ];
    
    // Behavioral patterns concepts
    private behavioralPatterns: string[] = [
        "Avoidance behaviors",
        "Safety behaviors",
        "Reinforcement patterns",
        "Behavioral activation",
        "Stimulus-response patterns"
    ];
    
    // Core beliefs concepts
    private coreBeliefs: string[] = [
        "Schemas about self",
        "Schemas about others",
        "Schemas about the world",
        "Intermediate beliefs",
        "Automatic thoughts"
    ];
    
    // Adaptive strategies concepts
    private adaptiveStrategies: string[] = [
        "Cognitive restructuring",
        "Behavioral experiments",
        "Exposure techniques",
        "Problem-solving skills",
        "Mindfulness integration"
    ];
    
    // Analyze content with CBT framework
    analyzeContent(content: string | any, mediaType: string): CbtAnalysisResult {
        // Get random elements from each concept array
        const cognitiveDistortionsElements = this.getRandomElements(this.cognitiveDistortions, 2);
        const behavioralPatternsElements = this.getRandomElements(this.behavioralPatterns, 2);
        const coreBeliefsElements = this.getRandomElements(this.coreBeliefs, 2);
        const adaptiveStrategiesElements = this.getRandomElements(this.adaptiveStrategies, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Cognitive-Behavioral perspective, this text reveals patterns of thinking that may include cognitive distortions and underlying core beliefs. It can be analyzed in terms of the relationship between thoughts, emotions, and behaviors.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through a Cognitive-Behavioral framework to reveal visual representations of cognitive patterns, emotional responses, and behavioral tendencies.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From a Cognitive-Behavioral perspective, this audio piece expresses patterns of thinking, emotional responses, and behavioral tendencies through its sonic qualities and emotional resonance.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through a Cognitive-Behavioral framework to reveal narrative and visual elements of cognitive patterns, emotional responses, and behavioral tendencies.";
        }
        
        // Return structured analysis
        return {
            cognitiveDistortions: cognitiveDistortionsElements,
            behavioralPatterns: behavioralPatternsElements,
            coreBeliefs: coreBeliefsElements,
            adaptiveStrategies: adaptiveStrategiesElements,
            summary
        };
    }
    
    // Helper method to get random elements from an array
    private getRandomElements(array: string[], count: number): string[] {
        const result: string[] = [];
        const arrayCopy = [...array];
        
        for (let i = 0; i < count && arrayCopy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * arrayCopy.length);
            result.push(arrayCopy[randomIndex]);
            arrayCopy.splice(randomIndex, 1);
        }
        
        return result;
    }
}
