import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Jungian analysis
 */
export interface JungianAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Archetypes
    archetypes: {
        persona: string;
        shadow: string;
        anima: string;
        animus: string;
        self: string;
    };
    
    // Collective unconscious
    collectiveUnconscious: {
        mythologicalThemes: string;
        universalSymbols: string[];
        culturalMotifs: string;
    };
    
    // Psychological types
    psychologicalTypes: {
        attitudeType: 'introversion' | 'extraversion' | 'balanced';
        dominantFunction: 'thinking' | 'feeling' | 'sensation' | 'intuition';
        auxiliaryFunction: 'thinking' | 'feeling' | 'sensation' | 'intuition';
        typeDescription: string;
    };
    
    // Individuation process
    individuation: {
        currentStage: string;
        integrationProcess: string;
        selfRealization: string;
    };
    
    // Synchronicity
    synchronicity: {
        meaningfulCoincidences: string[];
        acausalConnections: string;
    };
    
    // Dreams and symbols
    dreamsAndSymbols: {
        symbolAnalysis: string;
        dreamMotifs: string[];
        amplification: string;
    };
    
    // Key symbols identified
    keySymbols: string[];
}

/**
 * Provides analysis using Carl Jung's analytical psychology
 */
export class JungianAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Jung's analytical psychology
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<JungianAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as JungianAnalysisResult;
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
            # Jungian Analytical Psychology Analysis

            Analyze the following journal entry using Carl Jung's analytical psychology.
            Focus on archetypes, the collective unconscious, psychological types, individuation, synchronicity, and dream analysis.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall Jungian interpretation",
                
                "archetypes": {
                    "persona": "Analysis of the persona (social mask)",
                    "shadow": "Analysis of the shadow (repressed aspects)",
                    "anima": "Analysis of the anima (feminine aspects in men or feminine energy)",
                    "animus": "Analysis of the animus (masculine aspects in women or masculine energy)",
                    "self": "Analysis of the self (wholeness and integration)"
                },
                
                "collectiveUnconscious": {
                    "mythologicalThemes": "Analysis of mythological themes present",
                    "universalSymbols": ["List", "of", "universal", "symbols", "identified"],
                    "culturalMotifs": "Analysis of cultural motifs present"
                },
                
                "psychologicalTypes": {
                    "attitudeType": "introversion/extraversion/balanced",
                    "dominantFunction": "thinking/feeling/sensation/intuition",
                    "auxiliaryFunction": "thinking/feeling/sensation/intuition",
                    "typeDescription": "Description of the psychological type"
                },
                
                "individuation": {
                    "currentStage": "Current stage in the individuation process",
                    "integrationProcess": "Analysis of the integration process",
                    "selfRealization": "Analysis of progress toward self-realization"
                },
                
                "synchronicity": {
                    "meaningfulCoincidences": ["List", "of", "meaningful", "coincidences"],
                    "acausalConnections": "Analysis of acausal connections"
                },
                
                "dreamsAndSymbols": {
                    "symbolAnalysis": "Analysis of symbols present in the text",
                    "dreamMotifs": ["List", "of", "dream", "motifs"],
                    "amplification": "Amplification of symbols and motifs"
                },
                
                "keySymbols": ["List", "of", "key", "symbols", "identified"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
