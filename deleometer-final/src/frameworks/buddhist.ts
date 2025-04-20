import { MEDIA_TYPES } from '../constants';

// Buddhist analysis result interface
export interface BuddhistAnalysisResult {
    fourNobleTruths: string[];
    impermanence: string[];
    nonSelf: string[];
    mindfulness: string[];
    summary: string;
}

// Buddhist analysis class
export class BuddhistAnalysis {
    // Four Noble Truths concepts
    private fourNobleTruths: string[] = [
        "Suffering (dukkha)",
        "Origin of suffering (samudaya)",
        "Cessation of suffering (nirodha)",
        "Path to cessation (magga)",
        "Eightfold path"
    ];
    
    // Impermanence concepts
    private impermanence: string[] = [
        "Anicca (impermanence)",
        "Constant change",
        "Transience",
        "Momentariness",
        "Flux and flow"
    ];
    
    // Non-self concepts
    private nonSelf: string[] = [
        "Anatta (non-self)",
        "No permanent self",
        "Interdependent arising",
        "Emptiness (sunyata)",
        "Five aggregates"
    ];
    
    // Mindfulness concepts
    private mindfulness: string[] = [
        "Present-moment awareness",
        "Bare attention",
        "Non-judgmental observation",
        "Vipassana (insight)",
        "Samatha (calm abiding)"
    ];
    
    // Analyze content with Buddhist framework
    analyzeContent(content: string | any, mediaType: string): BuddhistAnalysisResult {
        // Get random elements from each concept array
        const fourNobleTruthsElements = this.getRandomElements(this.fourNobleTruths, 2);
        const impermanenceElements = this.getRandomElements(this.impermanence, 2);
        const nonSelfElements = this.getRandomElements(this.nonSelf, 2);
        const mindfulnessElements = this.getRandomElements(this.mindfulness, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Buddhist perspective, this text reveals the nature of impermanence (anicca) and the absence of a permanent self (anatta). It can be understood in terms of the Four Noble Truths, which address the nature of suffering and the path to its cessation.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through a Buddhist framework to reveal visual representations of impermanence, interdependent arising, and the potential for mindful awareness of present experience.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From a Buddhist perspective, this audio piece expresses the nature of impermanence and the potential for mindful awareness through its sonic qualities and temporal unfolding.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through a Buddhist framework to reveal narrative and visual elements of impermanence, non-self, and the potential for awakening to the true nature of reality.";
        }
        
        // Return structured analysis
        return {
            fourNobleTruths: fourNobleTruthsElements,
            impermanence: impermanenceElements,
            nonSelf: nonSelfElements,
            mindfulness: mindfulnessElements,
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
