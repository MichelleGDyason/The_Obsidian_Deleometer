import { MEDIA_TYPES } from '../constants';

// Feminist analysis result interface
export interface FeministAnalysisResult {
    genderConstruction: string[];
    patriarchalStructures: string[];
    feministPerspectives: string[];
    intersectionality: string[];
    summary: string;
}

// Feminist analysis class
export class FeministAnalysis {
    // Gender construction concepts
    private genderConstruction: string[] = [
        "Social construction of gender",
        "Gender performativity",
        "Gender as process",
        "Gender socialization",
        "Gender as relational"
    ];
    
    // Patriarchal structures concepts
    private patriarchalStructures: string[] = [
        "Systemic oppression",
        "Male privilege",
        "Institutional sexism",
        "Hegemonic masculinity",
        "Phallogocentrism"
    ];
    
    // Feminist perspectives concepts
    private feministPerspectives: string[] = [
        "Liberal feminism",
        "Radical feminism",
        "Socialist feminism",
        "Postmodern feminism",
        "Ecofeminism",
        "Transfeminism"
    ];
    
    // Intersectionality concepts
    private intersectionality: string[] = [
        "Interlocking oppressions",
        "Multiple identities",
        "Intersectional analysis",
        "Matrix of domination",
        "Situated knowledge"
    ];
    
    // Analyze content with Feminist framework
    analyzeContent(content: string | any, mediaType: string): FeministAnalysisResult {
        // Get random elements from each concept array
        const genderConstructionElements = this.getRandomElements(this.genderConstruction, 2);
        const patriarchalStructuresElements = this.getRandomElements(this.patriarchalStructures, 2);
        const feministPerspectivesElements = this.getRandomElements(this.feministPerspectives, 2);
        const intersectionalityElements = this.getRandomElements(this.intersectionality, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Feminist perspective, this text reveals the social construction of gender and the operation of patriarchal structures. It can be analyzed through various feminist lenses to understand how gender shapes experience and social relations.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through a Feminist framework to reveal visual representations of gender construction, patriarchal structures, and the potential for resistance and transformation.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From a Feminist perspective, this audio piece expresses gendered experiences and the potential for challenging patriarchal structures through its sonic qualities and emotional resonance.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through a Feminist framework to reveal narrative elements of gender construction, patriarchal structures, and the potential for feminist resistance and transformation.";
        }
        
        // Return structured analysis
        return {
            genderConstruction: genderConstructionElements,
            patriarchalStructures: patriarchalStructuresElements,
            feministPerspectives: feministPerspectivesElements,
            intersectionality: intersectionalityElements,
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
