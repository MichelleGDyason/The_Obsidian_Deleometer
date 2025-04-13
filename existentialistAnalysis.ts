import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of an Existentialist analysis
 */
export interface ExistentialistAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Freedom and responsibility
    freedomAndResponsibility: {
        choiceAwareness: string;
        responsibilityLevel: string;
        badFaith: string;
        authenticChoices: string[];
    };
    
    // Authenticity
    authenticity: {
        authenticSelf: string;
        inauthenticPatterns: string[];
        selfDeception: string;
        authenticityStrategies: string[];
    };
    
    // Existential anxiety
    existentialAnxiety: {
        deathAnxiety: string;
        freedomAnxiety: string;
        isolationAnxiety: string;
        meaninglessnessAnxiety: string;
        anxietyCoping: string;
    };
    
    // Absurdity and meaning
    absurdityAndMeaning: {
        absurdityRecognition: string;
        meaningCreation: string;
        valueSystem: string;
        existentialPurpose: string;
    };
    
    // Being-in-the-world
    beingInTheWorld: {
        worldRelation: string;
        temporality: string;
        facticity: string;
        transcendence: string;
    };
    
    // Interpersonal existence
    interpersonalExistence: {
        beingForOthers: string;
        authenticRelating: string;
        existentialIsolation: string;
        loveAnalysis: string;
    };
    
    // Existential recommendations
    existentialRecommendations: string[];
}

/**
 * Provides analysis using Existentialism
 */
export class ExistentialistAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Existentialism
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<ExistentialistAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as ExistentialistAnalysisResult;
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
            # Existentialist Analysis

            Analyze the following journal entry using Existentialism (Sartre, de Beauvoir, Camus, Heidegger, etc.).
            Focus on freedom, responsibility, authenticity, anxiety, absurdity, meaning, being-in-the-world, and interpersonal existence.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall existentialist interpretation",
                
                "freedomAndResponsibility": {
                    "choiceAwareness": "Analysis of awareness of choice and freedom",
                    "responsibilityLevel": "Analysis of taking responsibility for choices",
                    "badFaith": "Analysis of bad faith or self-deception",
                    "authenticChoices": ["List", "of", "authentic", "choices"]
                },
                
                "authenticity": {
                    "authenticSelf": "Analysis of authentic self-expression",
                    "inauthenticPatterns": ["List", "of", "inauthentic", "patterns"],
                    "selfDeception": "Analysis of self-deception mechanisms",
                    "authenticityStrategies": ["List", "of", "authenticity", "strategies"]
                },
                
                "existentialAnxiety": {
                    "deathAnxiety": "Analysis of death anxiety",
                    "freedomAnxiety": "Analysis of freedom anxiety",
                    "isolationAnxiety": "Analysis of isolation anxiety",
                    "meaninglessnessAnxiety": "Analysis of meaninglessness anxiety",
                    "anxietyCoping": "Analysis of coping with existential anxiety"
                },
                
                "absurdityAndMeaning": {
                    "absurdityRecognition": "Analysis of recognition of absurdity",
                    "meaningCreation": "Analysis of meaning creation",
                    "valueSystem": "Analysis of personal value system",
                    "existentialPurpose": "Analysis of existential purpose"
                },
                
                "beingInTheWorld": {
                    "worldRelation": "Analysis of relation to the world",
                    "temporality": "Analysis of relation to time",
                    "facticity": "Analysis of facticity and situation",
                    "transcendence": "Analysis of transcendence and possibilities"
                },
                
                "interpersonalExistence": {
                    "beingForOthers": "Analysis of being-for-others",
                    "authenticRelating": "Analysis of authentic relating",
                    "existentialIsolation": "Analysis of existential isolation",
                    "loveAnalysis": "Analysis of love and connection"
                },
                
                "existentialRecommendations": ["List", "of", "existential", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
