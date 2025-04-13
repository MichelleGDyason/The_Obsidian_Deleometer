import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of an Attachment Theory analysis
 */
export interface AttachmentAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Attachment style
    attachmentStyle: {
        primaryStyle: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
        secondaryStyle?: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
        styleDescription: string;
        developmentalOrigins: string;
    };
    
    // Internal working models
    internalWorkingModels: {
        selfModel: string;
        othersModel: string;
        relationshipExpectations: string;
    };
    
    // Attachment behaviors
    attachmentBehaviors: {
        proximityMaintenance: string;
        safeHaven: string;
        secureBase: string;
        separationDistress: string;
    };
    
    // Relationship patterns
    relationshipPatterns: {
        intimacyPatterns: string;
        dependencyPatterns: string;
        conflictResolution: string;
        trustIssues: string;
    };
    
    // Emotional regulation
    emotionalRegulation: {
        copingStrategies: string[];
        emotionalExpression: string;
        emotionalAwareness: string;
    };
    
    // Growth and healing
    growthAndHealing: {
        earnedSecurity: string;
        therapeuticNeeds: string[];
        developmentalOpportunities: string;
    };
    
    // Key attachment indicators
    keyAttachmentIndicators: string[];
}

/**
 * Provides analysis using Attachment Theory
 */
export class AttachmentAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Attachment Theory
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<AttachmentAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as AttachmentAnalysisResult;
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
            # Attachment Theory Analysis

            Analyze the following journal entry using Attachment Theory (Bowlby, Ainsworth, Main, etc.).
            Focus on attachment styles, internal working models, attachment behaviors, relationship patterns, and emotional regulation.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall attachment-based interpretation",
                
                "attachmentStyle": {
                    "primaryStyle": "secure/anxious/avoidant/disorganized",
                    "secondaryStyle": "secure/anxious/avoidant/disorganized (if applicable)",
                    "styleDescription": "Description of attachment style",
                    "developmentalOrigins": "Analysis of possible developmental origins"
                },
                
                "internalWorkingModels": {
                    "selfModel": "Analysis of internal model of self",
                    "othersModel": "Analysis of internal model of others",
                    "relationshipExpectations": "Analysis of expectations in relationships"
                },
                
                "attachmentBehaviors": {
                    "proximityMaintenance": "Analysis of proximity-seeking behaviors",
                    "safeHaven": "Analysis of using relationships as safe haven",
                    "secureBase": "Analysis of using relationships as secure base",
                    "separationDistress": "Analysis of separation anxiety/distress"
                },
                
                "relationshipPatterns": {
                    "intimacyPatterns": "Analysis of patterns in intimate relationships",
                    "dependencyPatterns": "Analysis of dependency/independence patterns",
                    "conflictResolution": "Analysis of conflict resolution approaches",
                    "trustIssues": "Analysis of trust and vulnerability issues"
                },
                
                "emotionalRegulation": {
                    "copingStrategies": ["List", "of", "emotional", "coping", "strategies"],
                    "emotionalExpression": "Analysis of emotional expression patterns",
                    "emotionalAwareness": "Analysis of emotional awareness and attunement"
                },
                
                "growthAndHealing": {
                    "earnedSecurity": "Analysis of movement toward earned security",
                    "therapeuticNeeds": ["List", "of", "therapeutic", "needs"],
                    "developmentalOpportunities": "Analysis of opportunities for growth"
                },
                
                "keyAttachmentIndicators": ["List", "of", "key", "attachment", "indicators"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
