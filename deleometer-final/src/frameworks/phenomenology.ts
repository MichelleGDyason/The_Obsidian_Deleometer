import { MEDIA_TYPES } from '../constants';

// Phenomenology analysis result interface
export interface PhenomenologyAnalysisResult {
    livedExperience: string[];
    intentionality: string[];
    embodiment: string[];
    summary: string;
}

// Phenomenology analysis class
export class PhenomenologyAnalysis {
    // Lived experience concepts
    private livedExperience: string[] = [
        "Subjective experience",
        "First-person perspective",
        "Experiential qualities",
        "Phenomenal consciousness",
        "Qualitative aspects"
    ];
    
    // Intentionality concepts
    private intentionality: string[] = [
        "Directedness toward objects",
        "Subject-object relation",
        "Meaning-making",
        "Horizons of experience",
        "Intentional structure"
    ];
    
    // Embodiment concepts
    private embodiment: string[] = [
        "Lived body",
        "Bodily awareness",
        "Corporeal schema",
        "Embodied cognition",
        "Bodily intentionality"
    ];
    
    // Analyze content with Phenomenology framework
    analyzeContent(content: string | any, mediaType: string): PhenomenologyAnalysisResult {
        // Get random elements from each concept array
        const livedExperienceElements = this.getRandomElements(this.livedExperience, 2);
        const intentionalityElements = this.getRandomElements(this.intentionality, 2);
        const embodimentElements = this.getRandomElements(this.embodiment, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Phenomenological perspective, this text reveals structures of lived experience and intentionality, exploring the qualitative aspects of subjective consciousness.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through Phenomenology to reveal visual representations of embodied experience and intentional structures of perception.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From a Phenomenological perspective, this audio piece expresses qualities of lived auditory experience and embodied listening through its sonic elements.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through Phenomenology to reveal structures of perceptual experience, embodiment, and intentionality through visual and narrative elements.";
        }
        
        // Return structured analysis
        return {
            livedExperience: livedExperienceElements,
            intentionality: intentionalityElements,
            embodiment: embodimentElements,
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
