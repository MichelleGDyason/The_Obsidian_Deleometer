import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Phenomenological analysis
 */
export interface PhenomenologicalAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Lived experience
    livedExperience: {
        lifeworld: string;
        experientialQualities: string[];
        phenomenalDescription: string;
    };
    
    // Intentionality
    intentionality: {
        consciousnessDirectedness: string;
        noematicContent: string;
        noeticProcess: string;
    };
    
    // Embodiment
    embodiment: {
        bodilyAwareness: string;
        embodiedKnowing: string;
        spatialExperience: string;
        temporalExperience: string;
    };
    
    // Intersubjectivity
    intersubjectivity: {
        sharedMeaning: string;
        empathicUnderstanding: string;
        socialEmbeddedness: string;
    };
    
    // Bracketing and reduction
    bracketing: {
        naturalAttitude: string;
        phenomenologicalReduction: string;
        eidetic: string;
    };
    
    // Existential themes
    existentialThemes: {
        freedom: string;
        authenticity: string;
        finitude: string;
        meaning: string;
    };
    
    // Essential structures
    essentialStructures: string[];
}

/**
 * Provides analysis using Phenomenology
 */
export class PhenomenologicalAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Phenomenology
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<PhenomenologicalAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as PhenomenologicalAnalysisResult;
    }
    
    /**
     * Create a personalization context based on user profile
     * @param userProfile The user profile
     */
    private createPersonalizationContext(userProfile: UserProfile | null): string {
        if (!userProfile) {
            return '';
        }
        
        let context = '### User Profile Context\n';
        
        // Add emotional baseline
        if (Object.keys(userProfile.emotionalBaseline).length > 0) {
            context += 'Emotional baseline: ';
            const emotions = Object.entries(userProfile.emotionalBaseline)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([emotion, value]) => `${emotion} (${value.toFixed(1)})`);
            context += emotions.join(', ') + '.\n';
        }
        
        // Add common themes
        if (userProfile.commonThemes.length > 0) {
            context += 'Common themes: ' + userProfile.commonThemes.slice(0, 10).join(', ') + '.\n';
        }
        
        // Add recurring patterns
        if (userProfile.recurringPatterns.length > 0) {
            context += 'Recurring patterns: ';
            const patterns = userProfile.recurringPatterns
                .slice(0, 5)
                .map(p => `${p.pattern} (frequency: ${p.frequency})`);
            context += patterns.join(', ') + '.\n';
        }
        
        return context;
    }
    
    /**
     * Create an analysis prompt
     * @param text The text to analyze
     * @param personalizationContext The personalization context
     */
    private createAnalysisPrompt(text: string, personalizationContext: string): string {
        const prompt = `
            # Phenomenological Analysis

            Analyze the following journal entry using Phenomenology (Husserl, Heidegger, Merleau-Ponty, etc.).
            Focus on lived experience, intentionality, embodiment, intersubjectivity, bracketing, and existential themes.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall phenomenological interpretation",
                
                "livedExperience": {
                    "lifeworld": "Analysis of the person's lifeworld",
                    "experientialQualities": ["List", "of", "experiential", "qualities"],
                    "phenomenalDescription": "Rich description of the phenomenal experience"
                },
                
                "intentionality": {
                    "consciousnessDirectedness": "Analysis of how consciousness is directed",
                    "noematicContent": "Analysis of the content of experience (noema)",
                    "noeticProcess": "Analysis of the process of experiencing (noesis)"
                },
                
                "embodiment": {
                    "bodilyAwareness": "Analysis of bodily awareness and sensations",
                    "embodiedKnowing": "Analysis of embodied knowledge and skills",
                    "spatialExperience": "Analysis of lived space",
                    "temporalExperience": "Analysis of lived time"
                },
                
                "intersubjectivity": {
                    "sharedMeaning": "Analysis of shared meaning and understanding",
                    "empathicUnderstanding": "Analysis of empathic understanding of others",
                    "socialEmbeddedness": "Analysis of social embeddedness and relations"
                },
                
                "bracketing": {
                    "naturalAttitude": "Analysis of the natural attitude",
                    "phenomenologicalReduction": "Analysis of phenomenological reduction",
                    "eidetic": "Analysis of essential structures (eidetic reduction)"
                },
                
                "existentialThemes": {
                    "freedom": "Analysis of freedom and choice",
                    "authenticity": "Analysis of authenticity and inauthenticity",
                    "finitude": "Analysis of finitude and mortality",
                    "meaning": "Analysis of meaning and meaninglessness"
                },
                
                "essentialStructures": ["List", "of", "essential", "structures"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
