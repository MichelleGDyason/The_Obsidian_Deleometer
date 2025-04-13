import { Notice } from 'obsidian';
import { ApiService } from './apiService';
import { AnalysisResult } from './types';

/**
 * Settings for the Advanced AI features
 */
export interface AdvancedAISettings {
    enablePersonalization: boolean;
    personalizedModelId: string;
    feedbackCollection: boolean;
    voiceAnalysis: boolean;
    userFeedbackHistory: UserFeedback[];
}

/**
 * User feedback on analysis results
 */
export interface UserFeedback {
    analysisId: string;
    date: string;
    rating: number; // 1-5 scale
    comments: string;
    correctedEmotions?: Record<string, number>;
    correctedPersonality?: Record<string, number>;
}

/**
 * Advanced AI features for the Deleometer plugin
 * Provides personalized analysis, voice journaling, and fine-tuned models
 */
export class AdvancedAI {
    private apiService: ApiService;
    private settings: AdvancedAISettings;
    private userProfile: UserProfile | null = null;
    
    constructor(apiService: ApiService, settings: AdvancedAISettings) {
        this.apiService = apiService;
        this.settings = settings;
        this.initializeUserProfile();
    }
    
    /**
     * Initializes the user profile
     */
    private async initializeUserProfile(): Promise<void> {
        if (!this.settings.enablePersonalization) {
            return;
        }
        
        try {
            // In a real implementation, we would load the user profile from storage
            // For now, we'll create a default profile
            this.userProfile = {
                id: 'user-1',
                emotionalBaseline: {
                    joy: 5,
                    sadness: 3,
                    anger: 2,
                    fear: 2,
                    surprise: 4,
                    sentiment: 0.2
                },
                personalityBaseline: {
                    openness: 0.7,
                    conscientiousness: 0.6,
                    extraversion: 0.5,
                    agreeableness: 0.6,
                    neuroticism: 0.4
                },
                commonThemes: ['work', 'relationships', 'creativity', 'health'],
                analysisPreferences: {
                    detailLevel: 'detailed',
                    focusAreas: ['emotions', 'patterns', 'growth']
                }
            };
        } catch (error) {
            console.error('Error initializing user profile:', error);
            new Notice('Failed to initialize user profile. Personalization features may be limited.');
        }
    }
    
    /**
     * Updates the user profile based on analysis results and feedback
     * @param result The analysis result
     * @param feedback Optional user feedback
     */
    public async updateUserProfile(result: AnalysisResult, feedback?: UserFeedback): Promise<void> {
        if (!this.settings.enablePersonalization || !this.userProfile) {
            return;
        }
        
        try {
            // Update emotional baseline (simple moving average)
            if (result.emotions) {
                Object.entries(result.emotions).forEach(([emotion, value]) => {
                    if (emotion !== 'sentiment' && this.userProfile?.emotionalBaseline) {
                        const currentValue = this.userProfile.emotionalBaseline[emotion] || 0;
                        // Weight: 90% existing, 10% new
                        this.userProfile.emotionalBaseline[emotion] = currentValue * 0.9 + value * 0.1;
                    }
                });
                
                // Update sentiment
                if (result.emotions.sentiment !== undefined && this.userProfile.emotionalBaseline) {
                    const currentSentiment = this.userProfile.emotionalBaseline.sentiment || 0;
                    this.userProfile.emotionalBaseline.sentiment = 
                        currentSentiment * 0.9 + result.emotions.sentiment * 0.1;
                }
            }
            
            // Update personality baseline
            if (result.personalityInsights && this.userProfile.personalityBaseline) {
                Object.entries(result.personalityInsights).forEach(([trait, value]) => {
                    const currentValue = this.userProfile?.personalityBaseline?.[trait] || 0;
                    // Weight: 95% existing, 5% new (personality changes more slowly)
                    if (this.userProfile?.personalityBaseline) {
                        this.userProfile.personalityBaseline[trait] = currentValue * 0.95 + value * 0.05;
                    }
                });
            }
            
            // If user feedback is provided, adjust more aggressively
            if (feedback) {
                this.applyUserFeedback(feedback);
            }
            
            // In a real implementation, we would save the updated profile
            console.log('User profile updated:', this.userProfile);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }
    
    /**
     * Applies user feedback to the profile
     * @param feedback The user feedback
     */
    private applyUserFeedback(feedback: UserFeedback): void {
        if (!this.userProfile) return;
        
        // Add feedback to history
        this.settings.userFeedbackHistory.push(feedback);
        
        // If user provided corrected emotions, adjust the baseline more aggressively
        if (feedback.correctedEmotions && this.userProfile.emotionalBaseline) {
            Object.entries(feedback.correctedEmotions).forEach(([emotion, value]) => {
                const currentValue = this.userProfile?.emotionalBaseline?.[emotion] || 0;
                // Weight: 70% existing, 30% corrected
                if (this.userProfile?.emotionalBaseline) {
                    this.userProfile.emotionalBaseline[emotion] = currentValue * 0.7 + value * 0.3;
                }
            });
        }
        
        // If user provided corrected personality traits, adjust the baseline
        if (feedback.correctedPersonality && this.userProfile.personalityBaseline) {
            Object.entries(feedback.correctedPersonality).forEach(([trait, value]) => {
                const currentValue = this.userProfile?.personalityBaseline?.[trait] || 0;
                // Weight: 80% existing, 20% corrected
                if (this.userProfile?.personalityBaseline) {
                    this.userProfile.personalityBaseline[trait] = currentValue * 0.8 + value * 0.2;
                }
            });
        }
    }
    
    /**
     * Performs personalized analysis of a journal entry
     * @param text The journal entry text
     * @returns Promise<AnalysisResult> The analysis result
     */
    public async analyzeWithPersonalization(text: string): Promise<AnalysisResult> {
        if (!this.settings.enablePersonalization || !this.userProfile) {
            throw new Error('Personalization is not enabled or user profile is not initialized.');
        }
        
        try {
            // Create a personalized prompt based on the user profile
            const prompt = this.createPersonalizedPrompt(text);
            
            // Get completion from the API
            const response = await this.apiService.getCompletion(prompt, {
                responseFormat: 'json_object'
            });
            
            // Process the response into an AnalysisResult
            const result: AnalysisResult = {
                emotions: response.emotions || {},
                psychoanalyticResponse: response.psychoanalysis || '',
                personalityInsights: response.personality || {},
                date: new Date().toISOString()
            };
            
            // Update the user profile with the new analysis
            await this.updateUserProfile(result);
            
            return result;
        } catch (error) {
            console.error('Error in personalized analysis:', error);
            throw new Error(`Personalized analysis failed: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Creates a personalized prompt based on the user profile
     * @param text The journal entry text
     * @returns string The personalized prompt
     */
    private createPersonalizedPrompt(text: string): string {
        if (!this.userProfile) {
            return `Analyze this journal entry: ${text}`;
        }
        
        // Create a prompt that includes the user's profile information
        return `
            Analyze this journal entry with personalization.
            
            User Profile:
            - Emotional Baseline: ${JSON.stringify(this.userProfile.emotionalBaseline)}
            - Personality Baseline: ${JSON.stringify(this.userProfile.personalityBaseline)}
            - Common Themes: ${this.userProfile.commonThemes.join(', ')}
            - Analysis Preferences: ${JSON.stringify(this.userProfile.analysisPreferences)}
            
            Instructions:
            1. Compare the emotional content to the user's baseline
            2. Identify patterns consistent with or deviating from their personality baseline
            3. Note any recurring themes from their common themes list
            4. Provide analysis at their preferred detail level
            5. Focus on their preferred areas
            
            Format the response as JSON with these keys:
            - emotions: object with emotion names and values
            - psychoanalysis: string with psychoanalytic insights
            - personality: object with personality trait names and values
            - patterns: array of identified patterns
            - deviations: array of notable deviations from baseline
            - recommendations: array of personalized recommendations
            
            Journal Entry: ${text}
        `;
    }
    
    /**
     * Processes voice input for analysis
     * @param audioBlob The audio blob from voice recording
     * @returns Promise<string> The transcribed text
     */
    public async processVoiceInput(audioBlob: Blob): Promise<string> {
        if (!this.settings.voiceAnalysis) {
            throw new Error('Voice analysis is not enabled.');
        }
        
        try {
            // In a real implementation, we would send the audio to a speech-to-text API
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Return a mock transcription
            return "This is a simulated transcription of voice input. In a real implementation, this would be the text transcribed from the user's voice recording.";
        } catch (error) {
            console.error('Error processing voice input:', error);
            throw new Error(`Voice processing failed: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Collects user feedback on an analysis
     * @param analysisId The ID of the analysis
     * @param rating The user rating (1-5)
     * @param comments Optional user comments
     * @param corrections Optional corrections to the analysis
     */
    public async collectFeedback(
        analysisId: string,
        rating: number,
        comments: string = '',
        corrections: {
            emotions?: Record<string, number>,
            personality?: Record<string, number>
        } = {}
    ): Promise<void> {
        if (!this.settings.feedbackCollection) {
            return;
        }
        
        try {
            // Create feedback object
            const feedback: UserFeedback = {
                analysisId,
                date: new Date().toISOString(),
                rating,
                comments,
                correctedEmotions: corrections.emotions,
                correctedPersonality: corrections.personality
            };
            
            // Add to feedback history
            this.settings.userFeedbackHistory.push(feedback);
            
            // Update user profile based on feedback
            if (this.userProfile) {
                this.applyUserFeedback(feedback);
            }
            
            // In a real implementation, we would save the feedback to storage
            console.log('Feedback collected:', feedback);
            
            new Notice('Thank you for your feedback!');
        } catch (error) {
            console.error('Error collecting feedback:', error);
            new Notice('Failed to save feedback.');
        }
    }
    
    /**
     * Gets the user profile
     * @returns UserProfile | null The user profile or null if not initialized
     */
    public getUserProfile(): UserProfile | null {
        return this.userProfile;
    }
    
    /**
     * Updates the advanced AI settings
     * @param settings The new settings
     */
    public updateSettings(settings: AdvancedAISettings): void {
        this.settings = settings;
        
        // Reinitialize user profile if personalization was enabled
        if (settings.enablePersonalization && !this.userProfile) {
            this.initializeUserProfile();
        }
    }
}

/**
 * User profile for personalized analysis
 */
interface UserProfile {
    id: string;
    emotionalBaseline: Record<string, number>;
    personalityBaseline: Record<string, number>;
    commonThemes: string[];
    analysisPreferences: {
        detailLevel: 'brief' | 'standard' | 'detailed';
        focusAreas: string[];
    };
}
