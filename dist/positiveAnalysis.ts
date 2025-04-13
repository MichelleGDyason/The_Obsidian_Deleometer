import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Positive Psychology analysis
 */
export interface PositiveAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Character strengths and virtues
    characterStrengths: {
        topStrengths: string[];
        underutilizedStrengths: string[];
        strengthsAnalysis: string;
    };
    
    // PERMA model
    permaModel: {
        positiveEmotions: string;
        engagement: string;
        relationships: string;
        meaning: string;
        accomplishment: string;
        permaScore: number; // 1-10 scale
    };
    
    // Flow experiences
    flowExperiences: {
        flowActivities: string[];
        flowBarriers: string[];
        flowAnalysis: string;
    };
    
    // Resilience and growth
    resilienceAndGrowth: {
        resilienceFactors: string[];
        growthOpportunities: string[];
        postTraumaticGrowth: string;
    };
    
    // Optimism and hope
    optimismAndHope: {
        explanatoryStyle: string;
        futureOrientation: string;
        hopeAnalysis: string;
    };
    
    // Mindfulness and gratitude
    mindfulnessAndGratitude: {
        mindfulnessLevel: string;
        gratitudePractices: string[];
        presentMomentAwareness: string;
    };
    
    // Well-being recommendations
    wellBeingRecommendations: string[];
}

/**
 * Provides analysis using Positive Psychology
 */
export class PositiveAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Positive Psychology
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<PositiveAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as PositiveAnalysisResult;
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
            # Positive Psychology Analysis

            Analyze the following journal entry using Positive Psychology (Seligman, Csikszentmihalyi, Peterson, etc.).
            Focus on character strengths, the PERMA model, flow experiences, resilience, optimism, mindfulness, and well-being.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall positive psychology interpretation",
                
                "characterStrengths": {
                    "topStrengths": ["List", "of", "evident", "character", "strengths"],
                    "underutilizedStrengths": ["List", "of", "underutilized", "strengths"],
                    "strengthsAnalysis": "Analysis of character strengths and virtues"
                },
                
                "permaModel": {
                    "positiveEmotions": "Analysis of positive emotions present",
                    "engagement": "Analysis of engagement and flow",
                    "relationships": "Analysis of positive relationships",
                    "meaning": "Analysis of meaning and purpose",
                    "accomplishment": "Analysis of achievement and accomplishment",
                    "permaScore": 7 // 1-10 scale
                },
                
                "flowExperiences": {
                    "flowActivities": ["List", "of", "flow-inducing", "activities"],
                    "flowBarriers": ["List", "of", "barriers", "to", "flow"],
                    "flowAnalysis": "Analysis of flow experiences"
                },
                
                "resilienceAndGrowth": {
                    "resilienceFactors": ["List", "of", "resilience", "factors"],
                    "growthOpportunities": ["List", "of", "growth", "opportunities"],
                    "postTraumaticGrowth": "Analysis of post-traumatic growth if applicable"
                },
                
                "optimismAndHope": {
                    "explanatoryStyle": "Analysis of explanatory style (optimistic vs. pessimistic)",
                    "futureOrientation": "Analysis of future orientation and hope",
                    "hopeAnalysis": "Analysis of hope and pathways thinking"
                },
                
                "mindfulnessAndGratitude": {
                    "mindfulnessLevel": "Analysis of mindfulness level",
                    "gratitudePractices": ["List", "of", "gratitude", "practices"],
                    "presentMomentAwareness": "Analysis of present moment awareness"
                },
                
                "wellBeingRecommendations": ["List", "of", "well-being", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
