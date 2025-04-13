import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Nietzschean analysis
 */
export interface NietzscheanAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Will to power
    willToPower: {
        powerExpressions: string[];
        creativeForces: string;
        resistancePatterns: string[];
        powerAnalysis: string;
    };
    
    // Master-slave morality
    masterSlaveMorality: {
        masterValues: string[];
        slaveValues: string[];
        moralityOrigins: string;
        moralityAnalysis: string;
    };
    
    // Eternal recurrence
    eternalRecurrence: {
        affirmationLevel: string;
        repetitionAttitude: string;
        existentialWeight: string;
        recurrenceAnalysis: string;
    };
    
    // Übermensch
    ubermensch: {
        selfOvercoming: string;
        valueCreation: string[];
        lifeAffirmation: string;
        ubermenschAnalysis: string;
    };
    
    // Nihilism and revaluation
    nihilismAndRevaluation: {
        nihilismStage: string;
        valueRevaluation: string;
        meaningCreation: string[];
        nihilismAnalysis: string;
    };
    
    // Apollonian-Dionysian
    apollonianDionysian: {
        apollonianElements: string[];
        dionysianElements: string[];
        tensionResolution: string;
        dualityAnalysis: string;
    };
    
    // Nietzschean recommendations
    nietzscheanRecommendations: string[];
}

/**
 * Provides analysis using Nietzschean insights
 */
export class NietzscheanAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Nietzschean insights
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<NietzscheanAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as NietzscheanAnalysisResult;
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
            # Nietzschean Analysis

            Analyze the following journal entry using Nietzschean insights (from Friedrich Nietzsche's philosophy).
            Focus on will to power, master-slave morality, eternal recurrence, the Übermensch, nihilism and revaluation, and the Apollonian-Dionysian duality.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall Nietzschean interpretation",
                
                "willToPower": {
                    "powerExpressions": ["List", "of", "power", "expressions"],
                    "creativeForces": "Analysis of creative forces",
                    "resistancePatterns": ["List", "of", "resistance", "patterns"],
                    "powerAnalysis": "Analysis of will to power"
                },
                
                "masterSlaveMorality": {
                    "masterValues": ["List", "of", "master", "values"],
                    "slaveValues": ["List", "of", "slave", "values"],
                    "moralityOrigins": "Analysis of morality origins",
                    "moralityAnalysis": "Analysis of master-slave morality"
                },
                
                "eternalRecurrence": {
                    "affirmationLevel": "Analysis of affirmation level",
                    "repetitionAttitude": "Analysis of attitude toward repetition",
                    "existentialWeight": "Analysis of existential weight",
                    "recurrenceAnalysis": "Analysis of eternal recurrence"
                },
                
                "ubermensch": {
                    "selfOvercoming": "Analysis of self-overcoming",
                    "valueCreation": ["List", "of", "value", "creations"],
                    "lifeAffirmation": "Analysis of life affirmation",
                    "ubermenschAnalysis": "Analysis of Übermensch potential"
                },
                
                "nihilismAndRevaluation": {
                    "nihilismStage": "Analysis of nihilism stage",
                    "valueRevaluation": "Analysis of value revaluation",
                    "meaningCreation": ["List", "of", "meaning", "creations"],
                    "nihilismAnalysis": "Analysis of nihilism and revaluation"
                },
                
                "apollonianDionysian": {
                    "apollonianElements": ["List", "of", "Apollonian", "elements"],
                    "dionysianElements": ["List", "of", "Dionysian", "elements"],
                    "tensionResolution": "Analysis of tension resolution",
                    "dualityAnalysis": "Analysis of Apollonian-Dionysian duality"
                },
                
                "nietzscheanRecommendations": ["List", "of", "Nietzschean", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
