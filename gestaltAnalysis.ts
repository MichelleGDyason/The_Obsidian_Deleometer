import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Gestalt Psychology analysis
 */
export interface GestaltAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Figure-ground dynamics
    figureGroundDynamics: {
        figureElements: string[];
        groundElements: string[];
        figureGroundInterplay: string;
        awareness: string;
    };
    
    // Gestalt principles
    gestaltPrinciples: {
        proximity: string;
        similarity: string;
        continuity: string;
        closure: string;
        pragnanz: string;
        principlesAnalysis: string;
    };
    
    // Contact boundary
    contactBoundary: {
        contactStyles: string[];
        boundaryDisturbances: string[];
        contactCycle: string;
        boundaryAnalysis: string;
    };
    
    // Polarities
    polarities: {
        identifiedPolarities: string[];
        polarityIntegration: string;
        splitPolarities: string;
        polarityWork: string;
    };
    
    // Here and now
    hereAndNow: {
        presentAwareness: string;
        experientialFocus: string;
        avoidancePatterns: string[];
        presentCenteredness: string;
    };
    
    // Unfinished business
    unfinishedBusiness: {
        incompleteGestalts: string[];
        fixedGestalts: string;
        resolutionPotential: string;
        integrationWork: string;
    };
    
    // Gestalt recommendations
    gestaltRecommendations: string[];
}

/**
 * Provides analysis using Gestalt Psychology
 */
export class GestaltAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Gestalt Psychology
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<GestaltAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as GestaltAnalysisResult;
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
            # Gestalt Psychology Analysis

            Analyze the following journal entry using Gestalt Psychology (Perls, Goodman, Polster, Zinker, etc.).
            Focus on figure-ground dynamics, gestalt principles, contact boundary, polarities, here-and-now awareness, and unfinished business.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall gestalt psychology interpretation",
                
                "figureGroundDynamics": {
                    "figureElements": ["List", "of", "figure", "elements"],
                    "groundElements": ["List", "of", "ground", "elements"],
                    "figureGroundInterplay": "Analysis of figure-ground interplay",
                    "awareness": "Analysis of awareness of figure-ground"
                },
                
                "gestaltPrinciples": {
                    "proximity": "Analysis of proximity principle",
                    "similarity": "Analysis of similarity principle",
                    "continuity": "Analysis of continuity principle",
                    "closure": "Analysis of closure principle",
                    "pragnanz": "Analysis of pragnanz (good form) principle",
                    "principlesAnalysis": "Analysis of gestalt principles in experience"
                },
                
                "contactBoundary": {
                    "contactStyles": ["List", "of", "contact", "styles"],
                    "boundaryDisturbances": ["List", "of", "boundary", "disturbances"],
                    "contactCycle": "Analysis of contact cycle",
                    "boundaryAnalysis": "Analysis of contact boundary functioning"
                },
                
                "polarities": {
                    "identifiedPolarities": ["List", "of", "identified", "polarities"],
                    "polarityIntegration": "Analysis of polarity integration",
                    "splitPolarities": "Analysis of split polarities",
                    "polarityWork": "Analysis of potential polarity work"
                },
                
                "hereAndNow": {
                    "presentAwareness": "Analysis of present awareness",
                    "experientialFocus": "Analysis of experiential focus",
                    "avoidancePatterns": ["List", "of", "avoidance", "patterns"],
                    "presentCenteredness": "Analysis of present-centeredness"
                },
                
                "unfinishedBusiness": {
                    "incompleteGestalts": ["List", "of", "incomplete", "gestalts"],
                    "fixedGestalts": "Analysis of fixed gestalts",
                    "resolutionPotential": "Analysis of resolution potential",
                    "integrationWork": "Analysis of potential integration work"
                },
                
                "gestaltRecommendations": ["List", "of", "gestalt", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
