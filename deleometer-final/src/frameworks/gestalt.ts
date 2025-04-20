import { MEDIA_TYPES } from '../constants';

// Gestalt analysis result interface
export interface GestaltAnalysisResult {
    wholenessPrinciples: string[];
    contactBoundary: string[];
    awarenessProcess: string[];
    polarities: string[];
    summary: string;
}

// Gestalt analysis class
export class GestaltAnalysis {
    // Wholeness principles concepts
    private wholenessPrinciples: string[] = [
        "The whole is greater than the sum of parts",
        "Figure-ground relationship",
        "Prägnanz (good form)",
        "Closure and completion",
        "Holistic perception"
    ];
    
    // Contact boundary concepts
    private contactBoundary: string[] = [
        "Contact and withdrawal",
        "Boundary disturbances",
        "Confluence and isolation",
        "Introjection and projection",
        "Retroflection and deflection"
    ];
    
    // Awareness process concepts
    private awarenessProcess: string[] = [
        "Here-and-now awareness",
        "Phenomenological method",
        "Organismic self-regulation",
        "Paradoxical theory of change",
        "Creative adjustment"
    ];
    
    // Polarities concepts
    private polarities: string[] = [
        "Top dog/underdog",
        "Integration of opposites",
        "Dialectical thinking",
        "Polarization and synthesis",
        "Complementary aspects"
    ];
    
    // Analyze content with Gestalt framework
    analyzeContent(content: string | any, mediaType: string): GestaltAnalysisResult {
        // Get random elements from each concept array
        const wholenessPrinciplesElements = this.getRandomElements(this.wholenessPrinciples, 2);
        const contactBoundaryElements = this.getRandomElements(this.contactBoundary, 2);
        const awarenessProcessElements = this.getRandomElements(this.awarenessProcess, 2);
        const polaritiesElements = this.getRandomElements(this.polarities, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Gestalt perspective, this text reveals the principles of wholeness and figure-ground relationships. It can be understood in terms of contact boundaries, awareness processes, and the integration of polarities.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through a Gestalt framework to reveal visual principles of wholeness, figure-ground relationships, and the integration of polarities.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From a Gestalt perspective, this audio piece expresses principles of wholeness and figure-ground relationships through its sonic qualities and temporal unfolding.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through a Gestalt framework to reveal narrative and visual elements of wholeness, contact boundaries, awareness processes, and the integration of polarities.";
        }
        
        // Return structured analysis
        return {
            wholenessPrinciples: wholenessPrinciplesElements,
            contactBoundary: contactBoundaryElements,
            awarenessProcess: awarenessProcessElements,
            polarities: polaritiesElements,
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
