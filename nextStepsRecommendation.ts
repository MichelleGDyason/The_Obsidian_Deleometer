import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';
import { EnhancedAnalysisResult } from './enhancedAnalysisFrameworks';
import { IrigarayianAnalysisResult } from './irigarayianAnalysis';

/**
 * Represents a recommended action for the user
 */
export interface RecommendedAction {
    title: string;
    description: string;
    rationale: string;
    difficulty: 'easy' | 'moderate' | 'challenging';
    timeframe: 'immediate' | 'short-term' | 'long-term';
    category: 'emotional' | 'cognitive' | 'behavioral' | 'relational' | 'spiritual' | 'creative';
}

/**
 * Represents the result of a next steps recommendation
 */
export interface NextStepsResult {
    // Overall summary
    summary: string;
    
    // Identified goals
    identifiedGoals: {
        explicit: string[];
        implicit: string[];
    };
    
    // Recommended actions
    recommendedActions: RecommendedAction[];
    
    // Potential obstacles
    potentialObstacles: {
        internal: string[];
        external: string[];
    };
    
    // Resources and support
    resourcesAndSupport: {
        existingStrengths: string[];
        suggestedResources: string[];
    };
    
    // Long-term vision
    longTermVision: string;
    
    // Happiness insights
    happinessInsights: {
        currentFactors: string[];
        potentialFactors: string[];
        personalDefinition: string;
    };
}

/**
 * Provides next steps recommendations based on analysis results
 */
export class NextStepsRecommendation {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Generate next steps recommendations based on analysis results
     * @param text The original journal text
     * @param enhancedResult The enhanced analysis result
     * @param irigarayianResult The Irigarayian analysis result (optional)
     * @param userProfile The user profile for personalization
     */
    async generateRecommendations(
        text: string,
        enhancedResult: EnhancedAnalysisResult,
        irigarayianResult: IrigarayianAnalysisResult | null,
        userProfile: UserProfile | null
    ): Promise<NextStepsResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createRecommendationPrompt(
            text,
            enhancedResult,
            irigarayianResult,
            personalizationContext
        );
        
        // Get the recommendations
        const recommendationsResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return recommendationsResult as NextStepsResult;
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
        
        // Add personality baseline
        if (Object.keys(userProfile.personalityBaseline).length > 0) {
            context += 'Personality baseline: ';
            const traits = Object.entries(userProfile.personalityBaseline)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([trait, value]) => `${trait} (${value.toFixed(1)})`);
            context += traits.join(', ') + '.\n';
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
     * Create a recommendation prompt
     * @param text The original journal text
     * @param enhancedResult The enhanced analysis result
     * @param irigarayianResult The Irigarayian analysis result (optional)
     * @param personalizationContext The personalization context
     */
    private createRecommendationPrompt(
        text: string,
        enhancedResult: EnhancedAnalysisResult,
        irigarayianResult: IrigarayianAnalysisResult | null,
        personalizationContext: string
    ): string {
        const prompt = `
            # Next Steps Recommendation

            Based on the journal entry and analysis results below, generate personalized next steps recommendations
            focused on helping the user move forward in their aims with the ultimate goal of increasing their happiness.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "summary": "Brief summary of the user's current situation and overall recommendation",
                
                "identifiedGoals": {
                    "explicit": ["List", "of", "explicitly", "stated", "goals"],
                    "implicit": ["List", "of", "implicitly", "suggested", "goals"]
                },
                
                "recommendedActions": [
                    {
                        "title": "Action title",
                        "description": "Detailed description of the action",
                        "rationale": "Why this action would be helpful",
                        "difficulty": "easy/moderate/challenging",
                        "timeframe": "immediate/short-term/long-term",
                        "category": "emotional/cognitive/behavioral/relational/spiritual/creative"
                    },
                    // Additional actions...
                ],
                
                "potentialObstacles": {
                    "internal": ["List", "of", "internal", "obstacles"],
                    "external": ["List", "of", "external", "obstacles"]
                },
                
                "resourcesAndSupport": {
                    "existingStrengths": ["List", "of", "user's", "existing", "strengths"],
                    "suggestedResources": ["List", "of", "suggested", "resources"]
                },
                
                "longTermVision": "Description of a positive long-term vision for the user",
                
                "happinessInsights": {
                    "currentFactors": ["Factors", "currently", "contributing", "to", "happiness"],
                    "potentialFactors": ["Factors", "that", "could", "increase", "happiness"],
                    "personalDefinition": "Personalized definition of happiness based on the user's values"
                }
            }
            
            Journal Entry:
            ${text}
            
            Enhanced Analysis Results:
            ${JSON.stringify(enhancedResult, null, 2)}
            
            ${irigarayianResult ? `Irigarayian Analysis Results:
            ${JSON.stringify(irigarayianResult, null, 2)}` : ''}
        `;
        
        return prompt;
    }
}
