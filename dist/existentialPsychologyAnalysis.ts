import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of an Existential Psychology analysis
 */
export interface ExistentialPsychologyAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Existential givens
    existentialGivens: {
        death: string;
        freedom: string;
        isolation: string;
        meaninglessness: string;
        givensAnalysis: string;
    };
    
    // Existential anxiety
    existentialAnxiety: {
        anxietyTypes: string[];
        anxietyManagement: string;
        existentialCourage: string;
        anxietyInsight: string;
    };
    
    // Meaning and purpose
    meaningAndPurpose: {
        meaningCreation: string;
        valueSystem: string[];
        purposeDirection: string;
        meaningfulActivities: string[];
    };
    
    // Authenticity
    authenticity: {
        authenticLiving: string;
        selfDeception: string[];
        genuineChoices: string[];
        authenticityBarriers: string;
    };
    
    // Interpersonal existence
    interpersonalExistence: {
        iThoudynamics: string;
        existentialEncounter: string;
        loveAnalysis: string;
        existentialIsolation: string;
    };
    
    // Therapeutic implications
    therapeuticImplications: {
        existentialTherapy: string;
        therapeuticFocus: string[];
        growthPotential: string;
        existentialCrisis: string;
    };
    
    // Existential psychology recommendations
    existentialPsychologyRecommendations: string[];
}

/**
 * Provides analysis using Existential Psychology
 */
export class ExistentialPsychologyAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Existential Psychology
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<ExistentialPsychologyAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as ExistentialPsychologyAnalysisResult;
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
            # Existential Psychology Analysis

            Analyze the following journal entry using Existential Psychology (Yalom, May, Frankl, Bugental, etc.).
            Focus on existential givens, existential anxiety, meaning and purpose, authenticity, interpersonal existence, and therapeutic implications.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall existential psychology interpretation",
                
                "existentialGivens": {
                    "death": "Analysis of death awareness and mortality",
                    "freedom": "Analysis of freedom, responsibility, and choice",
                    "isolation": "Analysis of existential isolation",
                    "meaninglessness": "Analysis of meaning and meaninglessness",
                    "givensAnalysis": "Analysis of how the person confronts existential givens"
                },
                
                "existentialAnxiety": {
                    "anxietyTypes": ["List", "of", "existential", "anxiety", "types"],
                    "anxietyManagement": "Analysis of anxiety management strategies",
                    "existentialCourage": "Analysis of existential courage",
                    "anxietyInsight": "Analysis of insight into existential anxiety"
                },
                
                "meaningAndPurpose": {
                    "meaningCreation": "Analysis of meaning creation",
                    "valueSystem": ["List", "of", "personal", "values"],
                    "purposeDirection": "Analysis of purpose and direction",
                    "meaningfulActivities": ["List", "of", "meaningful", "activities"]
                },
                
                "authenticity": {
                    "authenticLiving": "Analysis of authentic living",
                    "selfDeception": ["List", "of", "self-deception", "patterns"],
                    "genuineChoices": ["List", "of", "genuine", "choices"],
                    "authenticityBarriers": "Analysis of barriers to authenticity"
                },
                
                "interpersonalExistence": {
                    "iThoudynamics": "Analysis of I-Thou dynamics",
                    "existentialEncounter": "Analysis of existential encounter",
                    "loveAnalysis": "Analysis of love and connection",
                    "existentialIsolation": "Analysis of existential isolation"
                },
                
                "therapeuticImplications": {
                    "existentialTherapy": "Analysis of existential therapy implications",
                    "therapeuticFocus": ["List", "of", "therapeutic", "focus", "areas"],
                    "growthPotential": "Analysis of growth potential",
                    "existentialCrisis": "Analysis of existential crisis"
                },
                
                "existentialPsychologyRecommendations": ["List", "of", "existential", "psychology", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
