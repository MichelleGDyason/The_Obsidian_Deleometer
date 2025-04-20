import { MEDIA_TYPES } from '../constants';

// Positive Psychology analysis result interface
export interface PositiveAnalysisResult {
    strengths: string[];
    wellBeingFactors: string[];
    flowExperiences: string[];
    summary: string;
}

// Positive Psychology analysis class
export class PositiveAnalysis {
    // Character strengths concepts
    private strengths: string[] = [
        "Wisdom and knowledge",
        "Courage",
        "Humanity",
        "Justice",
        "Temperance",
        "Transcendence"
    ];
    
    // Well-being factors concepts
    private wellBeingFactors: string[] = [
        "Positive emotions",
        "Engagement",
        "Relationships",
        "Meaning",
        "Accomplishment"
    ];
    
    // Flow experiences concepts
    private flowExperiences: string[] = [
        "Clear goals",
        "Immediate feedback",
        "Balance between challenge and skill",
        "Concentration on the task",
        "Loss of self-consciousness"
    ];
    
    // Analyze content with Positive Psychology framework
    analyzeContent(content: string | any, mediaType: string): PositiveAnalysisResult {
        // Get random elements from each concept array
        const strengthsElements = this.getRandomElements(this.strengths, 2);
        const wellBeingFactorsElements = this.getRandomElements(this.wellBeingFactors, 2);
        const flowExperiencesElements = this.getRandomElements(this.flowExperiences, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Positive Psychology perspective, this text reveals character strengths and elements of well-being that contribute to flourishing and optimal human experience.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through Positive Psychology to reveal visual representations of character strengths, positive emotions, and elements that contribute to well-being.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From a Positive Psychology perspective, this audio piece expresses elements of flow experience and positive emotions through its sonic qualities and emotional resonance.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through Positive Psychology to reveal narrative elements of character strengths, well-being factors, and optimal human experience.";
        }
        
        // Return structured analysis
        return {
            strengths: strengthsElements,
            wellBeingFactors: wellBeingFactorsElements,
            flowExperiences: flowExperiencesElements,
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
