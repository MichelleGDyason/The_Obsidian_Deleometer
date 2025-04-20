import { MEDIA_TYPES } from '../constants';

// Posthumanism analysis result interface
export interface PosthumanismAnalysisResult {
    beyondHumanism: string[];
    technologicalMediations: string[];
    nonhumanAgency: string[];
    hybridities: string[];
    summary: string;
}

// Posthumanism analysis class
export class PosthumanismAnalysis {
    // Beyond humanism concepts
    private beyondHumanism: string[] = [
        "Critique of anthropocentrism",
        "Post-anthropocentric perspective",
        "Decentering the human",
        "Beyond human exceptionalism",
        "Distributed subjectivity"
    ];
    
    // Technological mediations concepts
    private technologicalMediations: string[] = [
        "Human-technology entanglement",
        "Technological embodiment",
        "Digital mediation",
        "Cybernetic systems",
        "Technological unconscious"
    ];
    
    // Nonhuman agency concepts
    private nonhumanAgency: string[] = [
        "Material agency",
        "Nonhuman actants",
        "Vibrant matter",
        "Object-oriented ontology",
        "More-than-human worlds"
    ];
    
    // Hybridities concepts
    private hybridities: string[] = [
        "Cyborg subjectivity",
        "Human-animal continuum",
        "Naturecultures",
        "Hybrid assemblages",
        "Boundary crossings"
    ];
    
    // Analyze content with Posthumanism framework
    analyzeContent(content: string | any, mediaType: string): PosthumanismAnalysisResult {
        // Get random elements from each concept array
        const beyondHumanismElements = this.getRandomElements(this.beyondHumanism, 2);
        const technologicalMediationsElements = this.getRandomElements(this.technologicalMediations, 2);
        const nonhumanAgencyElements = this.getRandomElements(this.nonhumanAgency, 2);
        const hybriditiesElements = this.getRandomElements(this.hybridities, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Posthumanist perspective, this text challenges anthropocentric assumptions and explores the entanglements between human and nonhuman agencies. It reveals how subjectivity is distributed across networks of human, technological, and material actors.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through a Posthumanist framework to reveal visual representations of human-nonhuman entanglements, technological mediations, and hybrid forms of agency and subjectivity.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From a Posthumanist perspective, this audio piece expresses the distributed nature of agency and subjectivity across human and nonhuman actors through its sonic qualities and technological mediations.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through a Posthumanist framework to reveal narrative and visual elements that challenge anthropocentrism and explore the entanglements between human, technological, and nonhuman agencies.";
        }
        
        // Return structured analysis
        return {
            beyondHumanism: beyondHumanismElements,
            technologicalMediations: technologicalMediationsElements,
            nonhumanAgency: nonhumanAgencyElements,
            hybridities: hybriditiesElements,
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
