import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Critical Theory analysis
 */
export interface CriticalAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Power relations
    powerRelations: {
        powerDynamics: string;
        dominationPatterns: string[];
        resistancePatterns: string[];
        hegemonicInfluences: string;
    };
    
    // Ideology critique
    ideologyCritique: {
        ideologicalPositioning: string;
        falseConsciousness: string;
        naturalizationProcesses: string[];
        ideologicalContradictions: string[];
    };
    
    // Knowledge/power
    knowledgePower: {
        discursiveFormations: string;
        truthRegimes: string;
        powerKnowledgeCircuits: string;
        epistemicPrivilege: string;
    };
    
    // Social structures
    socialStructures: {
        structuralConstraints: string[];
        institutionalAnalysis: string;
        systemicPatterns: string;
        reproductionMechanisms: string;
    };
    
    // Emancipatory interest
    emancipatoryInterest: {
        emancipatoryPotential: string;
        communicativeAction: string;
        rationalConsensus: string;
        utopianHorizons: string[];
    };
    
    // Critical reflexivity
    criticalReflexivity: {
        selfReflexivity: string;
        positionality: string;
        criticalAwareness: string;
        transformativePraxis: string;
    };
    
    // Critical recommendations
    criticalRecommendations: string[];
}

/**
 * Provides analysis using Critical Theory
 */
export class CriticalAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Critical Theory
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<CriticalAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as CriticalAnalysisResult;
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
            # Critical Theory Analysis

            Analyze the following journal entry using Critical Theory (Foucault, Habermas, Adorno, Horkheimer, etc.).
            Focus on power relations, ideology critique, knowledge/power, social structures, emancipatory interest, and critical reflexivity.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall critical theory interpretation",
                
                "powerRelations": {
                    "powerDynamics": "Analysis of power dynamics",
                    "dominationPatterns": ["List", "of", "domination", "patterns"],
                    "resistancePatterns": ["List", "of", "resistance", "patterns"],
                    "hegemonicInfluences": "Analysis of hegemonic influences"
                },
                
                "ideologyCritique": {
                    "ideologicalPositioning": "Analysis of ideological positioning",
                    "falseConsciousness": "Analysis of false consciousness",
                    "naturalizationProcesses": ["List", "of", "naturalization", "processes"],
                    "ideologicalContradictions": ["List", "of", "ideological", "contradictions"]
                },
                
                "knowledgePower": {
                    "discursiveFormations": "Analysis of discursive formations",
                    "truthRegimes": "Analysis of truth regimes",
                    "powerKnowledgeCircuits": "Analysis of power/knowledge circuits",
                    "epistemicPrivilege": "Analysis of epistemic privilege"
                },
                
                "socialStructures": {
                    "structuralConstraints": ["List", "of", "structural", "constraints"],
                    "institutionalAnalysis": "Analysis of institutional influences",
                    "systemicPatterns": "Analysis of systemic patterns",
                    "reproductionMechanisms": "Analysis of social reproduction mechanisms"
                },
                
                "emancipatoryInterest": {
                    "emancipatoryPotential": "Analysis of emancipatory potential",
                    "communicativeAction": "Analysis of communicative action",
                    "rationalConsensus": "Analysis of rational consensus building",
                    "utopianHorizons": ["List", "of", "utopian", "horizons"]
                },
                
                "criticalReflexivity": {
                    "selfReflexivity": "Analysis of self-reflexivity",
                    "positionality": "Analysis of social positionality",
                    "criticalAwareness": "Analysis of critical awareness",
                    "transformativePraxis": "Analysis of transformative praxis"
                },
                
                "criticalRecommendations": ["List", "of", "critical", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
