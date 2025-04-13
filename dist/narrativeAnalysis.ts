import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Narrative Psychology analysis
 */
export interface NarrativeAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Narrative structure
    narrativeStructure: {
        plotType: string;
        narrativeArc: string;
        temporalSequence: string;
        coherence: string;
    };
    
    // Narrative themes
    narrativeThemes: {
        dominantThemes: string[];
        recurrentMotifs: string[];
        thematicAnalysis: string;
    };
    
    // Narrative identity
    narrativeIdentity: {
        selfConcept: string;
        identityDevelopment: string;
        autobiographicalReasoning: string;
        possibleSelves: string[];
    };
    
    // Narrative positioning
    narrativePositioning: {
        agencyLevel: string;
        communionLevel: string;
        positioningAnalysis: string;
        characterRoles: string[];
    };
    
    // Meaning-making
    meaningMaking: {
        causalConnections: string;
        insightGeneration: string;
        redemptionSequences: string[];
        contaminationSequences: string[];
    };
    
    // Cultural narratives
    culturalNarratives: {
        masterNarratives: string[];
        counterNarratives: string[];
        culturalPositioning: string;
    };
    
    // Narrative recommendations
    narrativeRecommendations: string[];
}

/**
 * Provides analysis using Narrative Psychology
 */
export class NarrativeAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Narrative Psychology
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<NarrativeAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as NarrativeAnalysisResult;
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
            # Narrative Psychology Analysis

            Analyze the following journal entry using Narrative Psychology (McAdams, Bruner, White, Gergen, etc.).
            Focus on narrative structure, themes, identity, positioning, meaning-making, and cultural narratives.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall narrative psychology interpretation",
                
                "narrativeStructure": {
                    "plotType": "Analysis of plot type (e.g., comedy, tragedy, redemption)",
                    "narrativeArc": "Analysis of narrative arc and progression",
                    "temporalSequence": "Analysis of temporal sequence and organization",
                    "coherence": "Analysis of narrative coherence and integration"
                },
                
                "narrativeThemes": {
                    "dominantThemes": ["List", "of", "dominant", "themes"],
                    "recurrentMotifs": ["List", "of", "recurrent", "motifs"],
                    "thematicAnalysis": "Analysis of thematic content"
                },
                
                "narrativeIdentity": {
                    "selfConcept": "Analysis of narrative self-concept",
                    "identityDevelopment": "Analysis of identity development through narrative",
                    "autobiographicalReasoning": "Analysis of autobiographical reasoning",
                    "possibleSelves": ["List", "of", "possible", "selves"]
                },
                
                "narrativePositioning": {
                    "agencyLevel": "Analysis of agency in narrative",
                    "communionLevel": "Analysis of communion in narrative",
                    "positioningAnalysis": "Analysis of positioning relative to others",
                    "characterRoles": ["List", "of", "character", "roles"]
                },
                
                "meaningMaking": {
                    "causalConnections": "Analysis of causal connections in narrative",
                    "insightGeneration": "Analysis of insight and meaning generation",
                    "redemptionSequences": ["List", "of", "redemption", "sequences"],
                    "contaminationSequences": ["List", "of", "contamination", "sequences"]
                },
                
                "culturalNarratives": {
                    "masterNarratives": ["List", "of", "master", "narratives"],
                    "counterNarratives": ["List", "of", "counter", "narratives"],
                    "culturalPositioning": "Analysis of positioning relative to cultural narratives"
                },
                
                "narrativeRecommendations": ["List", "of", "narrative-based", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
