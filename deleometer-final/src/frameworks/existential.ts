import { MEDIA_TYPES } from '../constants';

// Existential analysis result interface
export interface ExistentialAnalysisResult {
    freedom: string[];
    authenticity: string[];
    anxiety: string[];
    meaning: string[];
    summary: string;
}

// Existential analysis class
export class ExistentialAnalysis {
    // Freedom concepts
    private freedom: string[] = [
        "Radical freedom",
        "Freedom as burden",
        "Choice and responsibility",
        "Existential choice",
        "Freedom-toward-death"
    ];
    
    // Authenticity concepts
    private authenticity: string[] = [
        "Authentic existence",
        "Inauthentic existence",
        "Self-creation",
        "Being-for-itself",
        "Overcoming bad faith"
    ];
    
    // Anxiety concepts
    private anxiety: string[] = [
        "Existential anxiety",
        "Angst",
        "Dread",
        "Confronting nothingness",
        "Anxiety of freedom"
    ];
    
    // Meaning concepts
    private meaning: string[] = [
        "Creating meaning",
        "Absurdity",
        "Existential vacuum",
        "Will to meaning",
        "Meaning in suffering"
    ];
    
    // Analyze content with Existential framework
    analyzeContent(content: string | any, mediaType: string): ExistentialAnalysisResult {
        // Get random elements from each concept array
        const freedomElements = this.getRandomElements(this.freedom, 2);
        const authenticityElements = this.getRandomElements(this.authenticity, 2);
        const anxietyElements = this.getRandomElements(this.anxiety, 2);
        const meaningElements = this.getRandomElements(this.meaning, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From an Existential perspective, this text explores themes of freedom, choice, and the search for authentic meaning in an inherently meaningless universe. It reveals the tension between existential anxiety and the human project of self-creation.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through an Existential lens to reveal visual representations of freedom, authenticity, and the confrontation with nothingness that characterizes human existence.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From an Existential perspective, this audio piece expresses the tension between freedom and anxiety, and the search for authentic meaning through its sonic qualities and emotional resonance.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through an Existential framework to reveal narrative elements of freedom, choice, authenticity, and the human struggle to create meaning in an absurd universe.";
        }
        
        // Return structured analysis
        return {
            freedom: freedomElements,
            authenticity: authenticityElements,
            anxiety: anxietyElements,
            meaning: meaningElements,
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
