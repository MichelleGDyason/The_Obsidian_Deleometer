import { MEDIA_TYPES } from '../constants';

// Psychiatry analysis result interface
export interface PsychiatryAnalysisResult {
    diagnosticCategories: string[];
    neurobiologicalFactors: string[];
    psychosocialFactors: string[];
    treatmentApproaches: string[];
    summary: string;
}

// Psychiatry analysis class
export class PsychiatryAnalysis {
    // Diagnostic categories concepts
    private diagnosticCategories: string[] = [
        "Mood disorders",
        "Anxiety disorders",
        "Psychotic disorders",
        "Personality disorders",
        "Neurodevelopmental disorders",
        "Trauma-related disorders"
    ];
    
    // Neurobiological factors concepts
    private neurobiologicalFactors: string[] = [
        "Neurotransmitter systems",
        "Brain structure and function",
        "Genetic factors",
        "Neuroplasticity",
        "Neuroendocrine processes"
    ];
    
    // Psychosocial factors concepts
    private psychosocialFactors: string[] = [
        "Environmental stressors",
        "Social determinants",
        "Developmental factors",
        "Interpersonal relationships",
        "Cultural factors"
    ];
    
    // Treatment approaches concepts
    private treatmentApproaches: string[] = [
        "Psychopharmacology",
        "Psychotherapy",
        "Integrated treatment",
        "Biopsychosocial approach",
        "Recovery model"
    ];
    
    // Analyze content with Psychiatry framework
    analyzeContent(content: string | any, mediaType: string): PsychiatryAnalysisResult {
        // Get random elements from each concept array
        const diagnosticCategoriesElements = this.getRandomElements(this.diagnosticCategories, 2);
        const neurobiologicalFactorsElements = this.getRandomElements(this.neurobiologicalFactors, 2);
        const psychosocialFactorsElements = this.getRandomElements(this.psychosocialFactors, 2);
        const treatmentApproachesElements = this.getRandomElements(this.treatmentApproaches, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Psychiatric perspective, this text reveals themes that can be understood in terms of diagnostic categories, neurobiological factors, and psychosocial determinants. It can be analyzed using the biopsychosocial model that integrates multiple levels of explanation.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through a Psychiatric framework to reveal visual representations of psychological states, neurobiological processes, and psychosocial factors that contribute to mental health and illness.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From a Psychiatric perspective, this audio piece expresses themes related to psychological states, neurobiological processes, and psychosocial factors through its sonic qualities and emotional resonance.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through a Psychiatric framework to reveal narrative and visual elements of psychological states, neurobiological processes, and psychosocial factors that contribute to mental health and illness.";
        }
        
        // Return structured analysis
        return {
            diagnosticCategories: diagnosticCategoriesElements,
            neurobiologicalFactors: neurobiologicalFactorsElements,
            psychosocialFactors: psychosocialFactorsElements,
            treatmentApproaches: treatmentApproachesElements,
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
