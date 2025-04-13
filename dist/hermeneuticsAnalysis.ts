import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Hermeneutics analysis
 */
export interface HermeneuticsAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Textual interpretation
    textualInterpretation: {
        explicitMeanings: string[];
        implicitMeanings: string[];
        textualContext: string;
        interpretiveApproach: string;
    };
    
    // Hermeneutic circle
    hermeneuticCircle: {
        partWholeRelationship: string;
        circularUnderstanding: string;
        interpretiveMovement: string;
        circleAnalysis: string;
    };
    
    // Historical consciousness
    historicalConsciousness: {
        temporalContext: string;
        historicalSituation: string;
        traditionInfluence: string[];
        historicalAnalysis: string;
    };
    
    // Prejudice and horizon
    prejudiceAndHorizon: {
        identifiedPrejudices: string[];
        interpretiveHorizon: string;
        horizonFusion: string;
        prejudiceAnalysis: string;
    };
    
    // Language and dialogue
    languageAndDialogue: {
        linguisticElements: string[];
        dialogicalNature: string;
        languageGames: string[];
        languageAnalysis: string;
    };
    
    // Application and relevance
    applicationAndRelevance: {
        practicalApplication: string;
        contemporaryRelevance: string;
        transformativePotential: string[];
        applicationAnalysis: string;
    };
    
    // Hermeneutic recommendations
    hermeneuticRecommendations: string[];
}

/**
 * Provides analysis using Hermeneutics
 */
export class HermeneuticsAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Hermeneutics
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<HermeneuticsAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as HermeneuticsAnalysisResult;
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
            # Hermeneutics Analysis

            Analyze the following journal entry using Hermeneutics (Gadamer, Ricoeur, Heidegger, Schleiermacher, etc.).
            Focus on textual interpretation, the hermeneutic circle, historical consciousness, prejudice and horizon, language and dialogue, and application and relevance.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall hermeneutic interpretation",
                
                "textualInterpretation": {
                    "explicitMeanings": ["List", "of", "explicit", "meanings"],
                    "implicitMeanings": ["List", "of", "implicit", "meanings"],
                    "textualContext": "Analysis of textual context",
                    "interpretiveApproach": "Analysis of interpretive approach"
                },
                
                "hermeneuticCircle": {
                    "partWholeRelationship": "Analysis of part-whole relationship",
                    "circularUnderstanding": "Analysis of circular understanding",
                    "interpretiveMovement": "Analysis of interpretive movement",
                    "circleAnalysis": "Analysis of hermeneutic circle"
                },
                
                "historicalConsciousness": {
                    "temporalContext": "Analysis of temporal context",
                    "historicalSituation": "Analysis of historical situation",
                    "traditionInfluence": ["List", "of", "tradition", "influences"],
                    "historicalAnalysis": "Analysis of historical consciousness"
                },
                
                "prejudiceAndHorizon": {
                    "identifiedPrejudices": ["List", "of", "identified", "prejudices"],
                    "interpretiveHorizon": "Analysis of interpretive horizon",
                    "horizonFusion": "Analysis of horizon fusion",
                    "prejudiceAnalysis": "Analysis of prejudice and horizon"
                },
                
                "languageAndDialogue": {
                    "linguisticElements": ["List", "of", "linguistic", "elements"],
                    "dialogicalNature": "Analysis of dialogical nature",
                    "languageGames": ["List", "of", "language", "games"],
                    "languageAnalysis": "Analysis of language and dialogue"
                },
                
                "applicationAndRelevance": {
                    "practicalApplication": "Analysis of practical application",
                    "contemporaryRelevance": "Analysis of contemporary relevance",
                    "transformativePotential": ["List", "of", "transformative", "potentials"],
                    "applicationAnalysis": "Analysis of application and relevance"
                },
                
                "hermeneuticRecommendations": ["List", "of", "hermeneutic", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
