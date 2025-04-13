import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Stoicism analysis
 */
export interface StoicismAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Dichotomy of control
    dichotomyOfControl: {
        withinControl: string[];
        beyondControl: string[];
        misclassifiedElements: string[];
        controlAnalysis: string;
    };
    
    // Virtues
    virtues: {
        wisdom: string;
        courage: string;
        justice: string;
        temperance: string;
        virtueAnalysis: string;
    };
    
    // Passions and emotions
    passionsAndEmotions: {
        identifiedPassions: string[];
        emotionalResponses: string;
        impressionsJudgments: string;
        emotionAnalysis: string;
    };
    
    // Nature and cosmos
    natureAndCosmos: {
        naturalOrder: string;
        cosmicPerspective: string;
        fateAcceptance: string;
        natureAnalysis: string;
    };
    
    // Practical disciplines
    practicalDisciplines: {
        assent: string;
        desire: string;
        action: string;
        disciplineAnalysis: string;
    };
    
    // Philosophical exercises
    philosophicalExercises: {
        negativVisualization: string;
        viewFromAbove: string;
        morningEvening: string[];
        exerciseAnalysis: string;
    };
    
    // Stoic recommendations
    stoicRecommendations: string[];
}

/**
 * Provides analysis using Stoicism
 */
export class StoicismAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Stoicism
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<StoicismAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as StoicismAnalysisResult;
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
            # Stoicism Analysis

            Analyze the following journal entry using Stoicism (Epictetus, Seneca, Marcus Aurelius, etc.).
            Focus on the dichotomy of control, virtues, passions and emotions, nature and cosmos, practical disciplines, and philosophical exercises.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall stoic interpretation",
                
                "dichotomyOfControl": {
                    "withinControl": ["List", "of", "elements", "within", "control"],
                    "beyondControl": ["List", "of", "elements", "beyond", "control"],
                    "misclassifiedElements": ["List", "of", "misclassified", "elements"],
                    "controlAnalysis": "Analysis of dichotomy of control"
                },
                
                "virtues": {
                    "wisdom": "Analysis of wisdom (practical wisdom)",
                    "courage": "Analysis of courage (fortitude)",
                    "justice": "Analysis of justice (fairness)",
                    "temperance": "Analysis of temperance (moderation)",
                    "virtueAnalysis": "Analysis of virtues"
                },
                
                "passionsAndEmotions": {
                    "identifiedPassions": ["List", "of", "identified", "passions"],
                    "emotionalResponses": "Analysis of emotional responses",
                    "impressionsJudgments": "Analysis of impressions and judgments",
                    "emotionAnalysis": "Analysis of passions and emotions"
                },
                
                "natureAndCosmos": {
                    "naturalOrder": "Analysis of natural order",
                    "cosmicPerspective": "Analysis of cosmic perspective",
                    "fateAcceptance": "Analysis of fate acceptance",
                    "natureAnalysis": "Analysis of nature and cosmos"
                },
                
                "practicalDisciplines": {
                    "assent": "Analysis of discipline of assent",
                    "desire": "Analysis of discipline of desire",
                    "action": "Analysis of discipline of action",
                    "disciplineAnalysis": "Analysis of practical disciplines"
                },
                
                "philosophicalExercises": {
                    "negativVisualization": "Analysis of negative visualization (premeditatio malorum)",
                    "viewFromAbove": "Analysis of view from above (cosmic perspective)",
                    "morningEvening": ["List", "of", "morning/evening", "reflections"],
                    "exerciseAnalysis": "Analysis of philosophical exercises"
                },
                
                "stoicRecommendations": ["List", "of", "stoic", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
