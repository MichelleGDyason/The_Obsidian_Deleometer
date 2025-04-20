import { MEDIA_TYPES } from '../constants';

// Attachment analysis result interface
export interface AttachmentAnalysisResult {
    attachmentStyles: string[];
    relationshipPatterns: string[];
    internalWorkingModels: string[];
    summary: string;
}

// Attachment analysis class
export class AttachmentAnalysis {
    // Attachment styles concepts
    private attachmentStyles: string[] = [
        "Secure attachment",
        "Anxious-ambivalent attachment",
        "Avoidant attachment",
        "Disorganized attachment",
        "Earned secure attachment"
    ];
    
    // Relationship patterns concepts
    private relationshipPatterns: string[] = [
        "Proximity seeking",
        "Safe haven",
        "Secure base",
        "Separation anxiety",
        "Internal working models"
    ];
    
    // Internal working models concepts
    private internalWorkingModels: string[] = [
        "Self-representation",
        "Other-representation",
        "Relationship expectations",
        "Emotional regulation strategies",
        "Interpersonal scripts"
    ];
    
    // Analyze content with Attachment framework
    analyzeContent(content: string | any, mediaType: string): AttachmentAnalysisResult {
        // Get random elements from each concept array
        const attachmentStylesElements = this.getRandomElements(this.attachmentStyles, 2);
        const relationshipPatternsElements = this.getRandomElements(this.relationshipPatterns, 2);
        const internalWorkingModelsElements = this.getRandomElements(this.internalWorkingModels, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From an Attachment Theory perspective, this text reveals patterns of relationship dynamics and internal working models that shape interpersonal expectations and emotional responses.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through Attachment Theory to reveal representations of relationship dynamics and attachment patterns through visual symbolism.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "From an Attachment Theory perspective, this audio piece expresses emotional patterns and relationship dynamics through its sonic qualities and emotional resonance.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through Attachment Theory to reveal character relationships, attachment styles, and internal working models through narrative and visual elements.";
        }
        
        // Return structured analysis
        return {
            attachmentStyles: attachmentStylesElements,
            relationshipPatterns: relationshipPatternsElements,
            internalWorkingModels: internalWorkingModelsElements,
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
