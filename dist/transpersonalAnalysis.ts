import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Transpersonal Psychology analysis
 */
export interface TranspersonalAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Consciousness states
    consciousnessStates: {
        ordinaryConsciousness: string;
        nonordinaryStates: string[];
        consciousnessSpectrum: string;
        statesAnalysis: string;
    };
    
    // Spiritual dimensions
    spiritualDimensions: {
        spiritualExperiences: string[];
        spiritualBeliefs: string;
        transcendentAspects: string;
        spiritualAnalysis: string;
    };
    
    // Self-transcendence
    selfTranscendence: {
        beyondEgo: string;
        transcendentExperiences: string[];
        selfExpansion: string;
        transcendenceAnalysis: string;
    };
    
    // Holistic development
    holisticDevelopment: {
        developmentalStage: string;
        integrationLevel: string;
        growthPotential: string[];
        developmentalAnalysis: string;
    };
    
    // Transpersonal practices
    transpersonalPractices: {
        meditativePractices: string[];
        contemplativePractices: string[];
        bodyworkPractices: string[];
        practicesAnalysis: string;
    };
    
    // Transformative experiences
    transformativeExperiences: {
        peakExperiences: string[];
        transformationalCrises: string;
        awakeningPotential: string;
        transformationAnalysis: string;
    };
    
    // Transpersonal recommendations
    transpersonalRecommendations: string[];
}

/**
 * Provides analysis using Transpersonal Psychology
 */
export class TranspersonalAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Transpersonal Psychology
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<TranspersonalAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as TranspersonalAnalysisResult;
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
            # Transpersonal Psychology Analysis

            Analyze the following journal entry using Transpersonal Psychology (Grof, Wilber, Maslow, Assagioli, etc.).
            Focus on consciousness states, spiritual dimensions, self-transcendence, holistic development, transpersonal practices, and transformative experiences.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall transpersonal psychology interpretation",
                
                "consciousnessStates": {
                    "ordinaryConsciousness": "Analysis of ordinary consciousness",
                    "nonordinaryStates": ["List", "of", "non-ordinary", "states"],
                    "consciousnessSpectrum": "Analysis of consciousness spectrum",
                    "statesAnalysis": "Analysis of consciousness states"
                },
                
                "spiritualDimensions": {
                    "spiritualExperiences": ["List", "of", "spiritual", "experiences"],
                    "spiritualBeliefs": "Analysis of spiritual beliefs",
                    "transcendentAspects": "Analysis of transcendent aspects",
                    "spiritualAnalysis": "Analysis of spiritual dimensions"
                },
                
                "selfTranscendence": {
                    "beyondEgo": "Analysis of beyond-ego experiences",
                    "transcendentExperiences": ["List", "of", "transcendent", "experiences"],
                    "selfExpansion": "Analysis of self-expansion",
                    "transcendenceAnalysis": "Analysis of self-transcendence"
                },
                
                "holisticDevelopment": {
                    "developmentalStage": "Analysis of developmental stage",
                    "integrationLevel": "Analysis of integration level",
                    "growthPotential": ["List", "of", "growth", "potentials"],
                    "developmentalAnalysis": "Analysis of holistic development"
                },
                
                "transpersonalPractices": {
                    "meditativePractices": ["List", "of", "meditative", "practices"],
                    "contemplativePractices": ["List", "of", "contemplative", "practices"],
                    "bodyworkPractices": ["List", "of", "bodywork", "practices"],
                    "practicesAnalysis": "Analysis of transpersonal practices"
                },
                
                "transformativeExperiences": {
                    "peakExperiences": ["List", "of", "peak", "experiences"],
                    "transformationalCrises": "Analysis of transformational crises",
                    "awakeningPotential": "Analysis of awakening potential",
                    "transformationAnalysis": "Analysis of transformative experiences"
                },
                
                "transpersonalRecommendations": ["List", "of", "transpersonal", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
