import { MEDIA_TYPES } from '../constants';

// Epicurean analysis result interface
export interface EpicureanAnalysisResult {
    pleasure: string[];
    ataraxia: string[];
    naturalDesires: string[];
    friendship: string[];
    summary: string;
}

// Epicurean analysis class
export class EpicureanAnalysis {
    // Pleasure concepts
    private pleasure: string[] = [
        "Absence of pain (aponia)",
        "Tranquility (ataraxia)",
        "Static pleasures",
        "Kinetic pleasures",
        "Pleasure as the highest good"
    ];
    
    // Ataraxia concepts
    private ataraxia: string[] = [
        "Freedom from disturbance",
        "Mental tranquility",
        "Peace of mind",
        "Absence of fear",
        "Equanimity"
    ];
    
    // Natural desires concepts
    private naturalDesires: string[] = [
        "Natural and necessary desires",
        "Natural but unnecessary desires",
        "Vain and empty desires",
        "Limiting desires",
        "Simple living"
    ];
    
    // Friendship concepts
    private friendship: string[] = [
        "Friendship as essential good",
        "Community of like-minded individuals",
        "Philosophical friendship",
        "Security through social bonds",
        "Shared pleasure in company"
    ];
    
    // Analyze content with Epicurean framework
    analyzeContent(content: string | any, mediaType: string): EpicureanAnalysisResult {
        // Get random elements from each concept array
        const pleasureElements = this.getRandomElements(this.pleasure, 2);
        const ataraxiaElements = this.getRandomElements(this.ataraxia, 2);
        const naturalDesiresElements = this.getRandomElements(this.naturalDesires, 2);
        const friendshipElements = this.getRandomElements(this.friendship, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From an Epicurean perspective, this text explores themes related to the pursuit of pleasure understood as freedom from pain and mental disturbance. It reveals insights about natural desires, the value of friendship, and the path to tranquility (ataraxia).";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through an Epicurean lens to reveal visual representations of pleasure, tranquility, natural desires, and the importance of friendship and community.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From an Epicurean perspective, this audio piece expresses themes related to pleasure, tranquility, and the satisfaction of natural desires through its sonic qualities and emotional resonance.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through an Epicurean framework to reveal narrative elements of pleasure, tranquility, natural desires, and the importance of friendship and community.";
        }
        
        // Return structured analysis
        return {
            pleasure: pleasureElements,
            ataraxia: ataraxiaElements,
            naturalDesires: naturalDesiresElements,
            friendship: friendshipElements,
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
