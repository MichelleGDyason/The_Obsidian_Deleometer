import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Cognitive-Behavioral analysis
 */
export interface CognitiveBehavioralAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Cognitive patterns
    cognitivePatterns: {
        automaticThoughts: string[];
        cognitiveDistortions: string[];
        coreBeliefs: string[];
        thoughtPatternAnalysis: string;
    };
    
    // Behavioral patterns
    behavioralPatterns: {
        adaptiveBehaviors: string[];
        maladaptiveBehaviors: string[];
        behavioralTriggers: string[];
        behavioralAnalysis: string;
    };
    
    // Emotional responses
    emotionalResponses: {
        primaryEmotions: string[];
        secondaryEmotions: string[];
        emotionalRegulation: string;
        emotionalAnalysis: string;
    };
    
    // Cognitive-behavioral cycles
    cognitiveBehavioralCycles: {
        thoughtBehaviorCycles: string[];
        reinforcementPatterns: string;
        maintenanceFactors: string[];
        cyclesAnalysis: string;
    };
    
    // Coping strategies
    copingStrategies: {
        adaptiveStrategies: string[];
        maladaptiveStrategies: string[];
        copingFlexibility: string;
        copingAnalysis: string;
    };
    
    // Intervention potential
    interventionPotential: {
        cognitiveInterventions: string[];
        behavioralInterventions: string[];
        skillDevelopment: string[];
        interventionAnalysis: string;
    };
    
    // Cognitive-behavioral recommendations
    cognitiveBehavioralRecommendations: string[];
}

/**
 * Provides analysis using Cognitive-Behavioral frameworks
 */
export class CognitiveBehavioralAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Cognitive-Behavioral frameworks
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<CognitiveBehavioralAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as CognitiveBehavioralAnalysisResult;
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
            # Cognitive-Behavioral Analysis

            Analyze the following journal entry using Cognitive-Behavioral frameworks (Beck, Ellis, Hayes, Linehan, etc.).
            Focus on cognitive patterns, behavioral patterns, emotional responses, cognitive-behavioral cycles, coping strategies, and intervention potential.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall cognitive-behavioral interpretation",
                
                "cognitivePatterns": {
                    "automaticThoughts": ["List", "of", "automatic", "thoughts"],
                    "cognitiveDistortions": ["List", "of", "cognitive", "distortions"],
                    "coreBeliefs": ["List", "of", "core", "beliefs"],
                    "thoughtPatternAnalysis": "Analysis of thought patterns"
                },
                
                "behavioralPatterns": {
                    "adaptiveBehaviors": ["List", "of", "adaptive", "behaviors"],
                    "maladaptiveBehaviors": ["List", "of", "maladaptive", "behaviors"],
                    "behavioralTriggers": ["List", "of", "behavioral", "triggers"],
                    "behavioralAnalysis": "Analysis of behavioral patterns"
                },
                
                "emotionalResponses": {
                    "primaryEmotions": ["List", "of", "primary", "emotions"],
                    "secondaryEmotions": ["List", "of", "secondary", "emotions"],
                    "emotionalRegulation": "Analysis of emotional regulation",
                    "emotionalAnalysis": "Analysis of emotional responses"
                },
                
                "cognitiveBehavioralCycles": {
                    "thoughtBehaviorCycles": ["List", "of", "thought-behavior", "cycles"],
                    "reinforcementPatterns": "Analysis of reinforcement patterns",
                    "maintenanceFactors": ["List", "of", "maintenance", "factors"],
                    "cyclesAnalysis": "Analysis of cognitive-behavioral cycles"
                },
                
                "copingStrategies": {
                    "adaptiveStrategies": ["List", "of", "adaptive", "strategies"],
                    "maladaptiveStrategies": ["List", "of", "maladaptive", "strategies"],
                    "copingFlexibility": "Analysis of coping flexibility",
                    "copingAnalysis": "Analysis of coping strategies"
                },
                
                "interventionPotential": {
                    "cognitiveInterventions": ["List", "of", "cognitive", "interventions"],
                    "behavioralInterventions": ["List", "of", "behavioral", "interventions"],
                    "skillDevelopment": ["List", "of", "skill", "development", "areas"],
                    "interventionAnalysis": "Analysis of intervention potential"
                },
                
                "cognitiveBehavioralRecommendations": ["List", "of", "cognitive-behavioral", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
