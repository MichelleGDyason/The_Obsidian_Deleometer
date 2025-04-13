import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Feminist Philosophy analysis
 */
export interface FeministAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Gender and power
    genderAndPower: {
        genderDynamics: string;
        powerStructures: string;
        internalization: string;
        resistance: string[];
    };
    
    // Intersectionality
    intersectionality: {
        intersectingIdentities: string[];
        privilegeAndMarginalization: string;
        intersectionalExperience: string;
    };
    
    // Situated knowledge
    situatedKnowledge: {
        standpoint: string;
        epistemicPosition: string;
        embodiedKnowing: string;
        objectivityAnalysis: string;
    };
    
    // Agency and autonomy
    agencyAndAutonomy: {
        agencyExpression: string;
        constraintsOnAgency: string[];
        relationalAutonomy: string;
        choiceAnalysis: string;
    };
    
    // Care ethics
    careEthics: {
        ethicsOfCare: string;
        relationality: string;
        interdependence: string;
        careWork: string;
    };
    
    // Feminist consciousness
    feministConsciousness: {
        awarenessLevel: string;
        criticalAnalysis: string;
        solidarityPotential: string;
        transformativePossibilities: string[];
    };
    
    // Feminist recommendations
    feministRecommendations: string[];
}

/**
 * Provides analysis using Feminist Philosophy
 */
export class FeministAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Feminist Philosophy
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<FeministAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as FeministAnalysisResult;
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
            # Feminist Philosophy Analysis

            Analyze the following journal entry using Feminist Philosophy (hooks, Butler, Ahmed, Young, etc.).
            Focus on gender and power, intersectionality, situated knowledge, agency, care ethics, and feminist consciousness.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall feminist interpretation",
                
                "genderAndPower": {
                    "genderDynamics": "Analysis of gender dynamics",
                    "powerStructures": "Analysis of power structures",
                    "internalization": "Analysis of internalized gender norms",
                    "resistance": ["List", "of", "resistance", "strategies"]
                },
                
                "intersectionality": {
                    "intersectingIdentities": ["List", "of", "intersecting", "identities"],
                    "privilegeAndMarginalization": "Analysis of privilege and marginalization",
                    "intersectionalExperience": "Analysis of intersectional experience"
                },
                
                "situatedKnowledge": {
                    "standpoint": "Analysis of standpoint and perspective",
                    "epistemicPosition": "Analysis of epistemic position",
                    "embodiedKnowing": "Analysis of embodied knowing",
                    "objectivityAnalysis": "Analysis of objectivity claims"
                },
                
                "agencyAndAutonomy": {
                    "agencyExpression": "Analysis of agency expression",
                    "constraintsOnAgency": ["List", "of", "constraints", "on", "agency"],
                    "relationalAutonomy": "Analysis of relational autonomy",
                    "choiceAnalysis": "Analysis of choice and constraint"
                },
                
                "careEthics": {
                    "ethicsOfCare": "Analysis of ethics of care",
                    "relationality": "Analysis of relationality",
                    "interdependence": "Analysis of interdependence",
                    "careWork": "Analysis of care work"
                },
                
                "feministConsciousness": {
                    "awarenessLevel": "Analysis of feminist awareness level",
                    "criticalAnalysis": "Analysis of critical thinking about gender",
                    "solidarityPotential": "Analysis of potential for solidarity",
                    "transformativePossibilities": ["List", "of", "transformative", "possibilities"]
                },
                
                "feministRecommendations": ["List", "of", "feminist", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
