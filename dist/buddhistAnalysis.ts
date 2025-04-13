import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Buddhist Philosophy analysis
 */
export interface BuddhistAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Four Noble Truths
    fourNobleTruths: {
        sufferingPresence: string;
        sufferingOrigins: string[];
        sufferingCessation: string;
        pathAnalysis: string;
    };
    
    // Three Marks of Existence
    threeMarksOfExistence: {
        impermanence: string;
        suffering: string;
        nonSelf: string;
        marksInsight: string;
    };
    
    // Dependent Origination
    dependentOrigination: {
        causalChains: string[];
        interdependence: string;
        conditionality: string;
        karmaAnalysis: string;
    };
    
    // Mindfulness and Awareness
    mindfulnessAndAwareness: {
        presentMomentAwareness: string;
        mindfulnessLevel: string;
        mindStates: string[];
        awarenessQuality: string;
    };
    
    // Compassion and Loving-kindness
    compassionAndLovingkindness: {
        selfCompassion: string;
        compassionForOthers: string;
        lovingkindness: string;
        equanimity: string;
    };
    
    // Middle Way
    middleWay: {
        extremeAvoidance: string;
        balanceAnalysis: string;
        skillfulMeans: string[];
        wisdomApplication: string;
    };
    
    // Buddhist recommendations
    buddhistRecommendations: string[];
}

/**
 * Provides analysis using Buddhist Philosophy
 */
export class BuddhistAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Buddhist Philosophy
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<BuddhistAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as BuddhistAnalysisResult;
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
            # Buddhist Philosophy Analysis

            Analyze the following journal entry using Buddhist Philosophy.
            Focus on the Four Noble Truths, Three Marks of Existence, Dependent Origination, Mindfulness, Compassion, and the Middle Way.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall Buddhist interpretation",
                
                "fourNobleTruths": {
                    "sufferingPresence": "Analysis of suffering (dukkha) present",
                    "sufferingOrigins": ["List", "of", "origins", "of", "suffering"],
                    "sufferingCessation": "Analysis of potential for cessation of suffering",
                    "pathAnalysis": "Analysis of the path to cessation"
                },
                
                "threeMarksOfExistence": {
                    "impermanence": "Analysis of impermanence (anicca)",
                    "suffering": "Analysis of suffering/unsatisfactoriness (dukkha)",
                    "nonSelf": "Analysis of non-self (anatta)",
                    "marksInsight": "Analysis of insight into the three marks"
                },
                
                "dependentOrigination": {
                    "causalChains": ["List", "of", "causal", "chains"],
                    "interdependence": "Analysis of interdependence",
                    "conditionality": "Analysis of conditionality",
                    "karmaAnalysis": "Analysis of karma and intention"
                },
                
                "mindfulnessAndAwareness": {
                    "presentMomentAwareness": "Analysis of present moment awareness",
                    "mindfulnessLevel": "Analysis of mindfulness level",
                    "mindStates": ["List", "of", "mind", "states"],
                    "awarenessQuality": "Analysis of quality of awareness"
                },
                
                "compassionAndLovingkindness": {
                    "selfCompassion": "Analysis of self-compassion",
                    "compassionForOthers": "Analysis of compassion for others",
                    "lovingkindness": "Analysis of loving-kindness (metta)",
                    "equanimity": "Analysis of equanimity (upekkha)"
                },
                
                "middleWay": {
                    "extremeAvoidance": "Analysis of avoiding extremes",
                    "balanceAnalysis": "Analysis of balance and moderation",
                    "skillfulMeans": ["List", "of", "skillful", "means"],
                    "wisdomApplication": "Analysis of wisdom application"
                },
                
                "buddhistRecommendations": ["List", "of", "Buddhist", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
