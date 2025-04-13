import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of an Irigarayian analysis
 */
export interface IrigarayianAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Sexual difference analysis
    sexualDifference: {
        phallocentrism: string;
        feminineSpeaking: string;
        mimesis: string;
    };
    
    // Feminine subjectivity
    feminineSubjectivity: {
        fluidIdentity: string;
        embodiedKnowledge: string;
        relationality: string;
    };
    
    // Language and discourse
    languageAndDiscourse: {
        speakingAsWoman: string;
        disruptiveSyntax: string;
        poeticLanguage: string;
        silencesAndGaps: string;
    };
    
    // Ethics of sexual difference
    ethicsOfDifference: {
        intersubjectivity: string;
        wonderment: string;
        mutualRespect: string;
    };
    
    // Key concepts identified
    keyConcepts: string[];
    
    // Patterns of thought
    thoughtPatterns: string[];
}

/**
 * Provides analysis using Luce Irigaray's theoretical framework
 */
export class IrigarayianAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Irigaray's theoretical framework
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<IrigarayianAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as IrigarayianAnalysisResult;
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
            # Irigarayian Psychoanalytic Analysis

            Analyze the following journal entry using Luce Irigaray's theoretical framework.
            Focus on sexual difference, feminine subjectivity, language and discourse, and ethics of sexual difference.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall Irigarayian interpretation",
                
                "sexualDifference": {
                    "phallocentrism": "Analysis of phallocentric thinking or its absence",
                    "feminineSpeaking": "Analysis of feminine modes of expression",
                    "mimesis": "Analysis of mimetic strategies"
                },
                
                "feminineSubjectivity": {
                    "fluidIdentity": "Analysis of fluid identity expressions",
                    "embodiedKnowledge": "Analysis of embodied knowledge",
                    "relationality": "Analysis of relational thinking"
                },
                
                "languageAndDiscourse": {
                    "speakingAsWoman": "Analysis of parler-femme (speaking as woman)",
                    "disruptiveSyntax": "Analysis of disruptive syntax or non-linear expression",
                    "poeticLanguage": "Analysis of poetic or metaphorical language",
                    "silencesAndGaps": "Analysis of silences, gaps, or what remains unsaid"
                },
                
                "ethicsOfDifference": {
                    "intersubjectivity": "Analysis of intersubjective relations",
                    "wonderment": "Analysis of wonder or curiosity toward otherness",
                    "mutualRespect": "Analysis of mutual respect for difference"
                },
                
                "keyConcepts": ["List", "of", "key", "Irigarayian", "concepts", "identified"],
                "thoughtPatterns": ["List", "of", "thought", "patterns", "identified"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
