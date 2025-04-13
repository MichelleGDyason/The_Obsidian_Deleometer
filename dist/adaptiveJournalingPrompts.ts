import { App, TFile } from 'obsidian';
import { UserProfileSystem, UserProfile } from './userProfileSystem';
import { EnhancedAnalysisFrameworks } from './enhancedAnalysisFrameworks';
import { JournalingPrompts, PromptCategory, PromptSet } from './journalingPrompts';

/**
 * Represents a prompt with metadata about its effectiveness
 */
interface AnalystPrompt {
    text: string;
    category: PromptCategory;
    tags: string[];
    effectiveness?: number; // 0-1 scale of how effective this prompt has been
    usageCount?: number; // How many times this prompt has been used
    responseLength?: number; // Average length of responses to this prompt
    emotionalDepth?: number; // 0-1 scale of emotional depth in responses
    insightGeneration?: number; // 0-1 scale of insights generated from responses
    lastUsed?: Date; // When this prompt was last used
}

/**
 * Represents the user's response to a prompt
 */
interface PromptResponse {
    promptId: string;
    promptText: string;
    responseText: string;
    date: Date;
    analysisResult?: any; // Analysis of the response
}

/**
 * Adaptive Journaling Prompts System
 * Generates prompts from the analyst's perspective based on user's journaling patterns
 */
export class AdaptiveJournalingPrompts {
    private app: App;
    private userProfileSystem: UserProfileSystem;
    private analysisFrameworks: EnhancedAnalysisFrameworks;
    private basePrompts: JournalingPrompts;
    private analystPrompts: AnalystPrompt[] = [];
    private promptResponses: PromptResponse[] = [];
    private learningEnabled: boolean = true;

    constructor(
        app: App,
        userProfileSystem: UserProfileSystem,
        analysisFrameworks: EnhancedAnalysisFrameworks,
        basePrompts: JournalingPrompts
    ) {
        this.app = app;
        this.userProfileSystem = userProfileSystem;
        this.analysisFrameworks = analysisFrameworks;
        this.basePrompts = basePrompts;
        
        // Initialize with default analyst prompts
        this.initializeAnalystPrompts();
        
        // Load saved data
        this.loadData();
    }

    /**
     * Initialize with default analyst prompts
     */
    private initializeAnalystPrompts() {
        // These prompts are from the analyst's perspective ("from the chair, not the couch")
        this.analystPrompts = [
            {
                text: "What patterns have you noticed in your emotional responses this week? Consider how these patterns might connect to earlier experiences.",
                category: "self-reflection",
                tags: ["patterns", "emotions", "insight"],
                effectiveness: 0.8,
                usageCount: 0
            },
            {
                text: "If you were to observe yourself from a distance, what would you notice about your recent behaviors that you might not see up close?",
                category: "self-reflection",
                tags: ["perspective", "behavior", "observation"],
                effectiveness: 0.75,
                usageCount: 0
            },
            {
                text: "Consider a recent conflict or tension. What might be happening beneath the surface that hasn't been verbalized?",
                category: "emotional-processing",
                tags: ["conflict", "unconscious", "depth"],
                effectiveness: 0.85,
                usageCount: 0
            },
            {
                text: "What metaphor best describes your current life situation? Explore what this metaphor reveals about your unconscious understanding.",
                category: "creative",
                tags: ["metaphor", "unconscious", "symbolism"],
                effectiveness: 0.7,
                usageCount: 0
            },
            {
                text: "Notice the resistance you feel when thinking about certain topics. What might this resistance be protecting?",
                category: "shadow-work",
                tags: ["resistance", "protection", "shadow"],
                effectiveness: 0.9,
                usageCount: 0
            },
            {
                text: "How might your current challenges be serving a purpose in your psychological development?",
                category: "growth",
                tags: ["purpose", "development", "challenge"],
                effectiveness: 0.8,
                usageCount: 0
            },
            {
                text: "What recurring dreams or symbols have appeared in your life recently? Consider their significance beyond literal interpretation.",
                category: "depth",
                tags: ["dreams", "symbols", "unconscious"],
                effectiveness: 0.75,
                usageCount: 0
            },
            {
                text: "Identify a belief that limits you. What early experiences might have contributed to forming this belief?",
                category: "cognitive",
                tags: ["beliefs", "limitations", "origins"],
                effectiveness: 0.85,
                usageCount: 0
            },
            {
                text: "How do your relationships mirror aspects of your relationship with yourself?",
                category: "relationships",
                tags: ["mirroring", "self-relation", "patterns"],
                effectiveness: 0.8,
                usageCount: 0
            },
            {
                text: "What parts of yourself do you find most difficult to accept? What might these parts need from you?",
                category: "shadow-work",
                tags: ["acceptance", "parts-work", "integration"],
                effectiveness: 0.9,
                usageCount: 0
            }
        ];
    }

    /**
     * Load saved data from disk
     */
    private async loadData() {
        try {
            // Load analyst prompts
            const promptsFile = this.app.vault.getAbstractFileByPath('.obsidian/plugins/deleometer/analyst_prompts.json');
            if (promptsFile && promptsFile instanceof TFile) {
                const content = await this.app.vault.read(promptsFile);
                const data = JSON.parse(content);
                if (data.analystPrompts) {
                    this.analystPrompts = [...this.analystPrompts, ...data.analystPrompts];
                }
                if (data.promptResponses) {
                    this.promptResponses = data.promptResponses;
                }
            }
        } catch (error) {
            console.error('Error loading adaptive journaling prompts data:', error);
        }
    }

    /**
     * Save data to disk
     */
    private async saveData() {
        try {
            const data = {
                analystPrompts: this.analystPrompts,
                promptResponses: this.promptResponses
            };
            
            // Ensure the directory exists
            const dir = '.obsidian/plugins/deleometer';
            if (!await this.app.vault.adapter.exists(dir)) {
                await this.app.vault.adapter.mkdir(dir);
            }
            
            // Save the data
            await this.app.vault.adapter.write(
                `${dir}/analyst_prompts.json`,
                JSON.stringify(data, null, 2)
            );
        } catch (error) {
            console.error('Error saving adaptive journaling prompts data:', error);
        }
    }

    /**
     * Get personalized prompts based on user profile and journaling history
     * @param category Optional category to filter prompts
     * @param count Number of prompts to return
     * @returns Promise<PromptSet> A set of personalized prompts
     */
    public async getPersonalizedPrompts(
        category?: PromptCategory,
        count: number = 5
    ): Promise<PromptSet> {
        // Get user profile
        const userProfile = this.userProfileSystem.getUserProfile();
        
        // Filter prompts by category if specified
        let filteredPrompts = [...this.analystPrompts];
        if (category) {
            filteredPrompts = filteredPrompts.filter(p => p.category === category);
        }
        
        // Sort prompts by relevance to user profile
        const rankedPrompts = this.rankPromptsByRelevance(filteredPrompts, userProfile);
        
        // Get top prompts
        const topPrompts = rankedPrompts.slice(0, count);
        
        // Create prompt set
        const promptSet: PromptSet = {
            prompts: topPrompts.map(p => ({
                id: this.generatePromptId(p.text),
                text: p.text,
                category: p.category,
                tags: p.tags
            })),
            recommendedPrompt: topPrompts.length > 0 ? {
                id: this.generatePromptId(topPrompts[0].text),
                text: topPrompts[0].text,
                category: topPrompts[0].category,
                tags: topPrompts[0].tags,
                reason: this.generateRecommendationReason(topPrompts[0], userProfile)
            } : undefined
        };
        
        return promptSet;
    }

    /**
     * Rank prompts by relevance to user profile
     * @param prompts Array of prompts to rank
     * @param userProfile User profile
     * @returns Ranked array of prompts
     */
    private rankPromptsByRelevance(prompts: AnalystPrompt[], userProfile?: UserProfile): AnalystPrompt[] {
        if (!userProfile) {
            // If no user profile, sort by effectiveness and usage count
            return [...prompts].sort((a, b) => {
                const aScore = (a.effectiveness || 0.5) * (1 - (a.usageCount || 0) / 10);
                const bScore = (b.effectiveness || 0.5) * (1 - (b.usageCount || 0) / 10);
                return bScore - aScore;
            });
        }
        
        // Calculate relevance score for each prompt based on user profile
        return [...prompts].sort((a, b) => {
            const aScore = this.calculateRelevanceScore(a, userProfile);
            const bScore = this.calculateRelevanceScore(b, userProfile);
            return bScore - aScore;
        });
    }

    /**
     * Calculate relevance score for a prompt based on user profile
     * @param prompt The prompt to score
     * @param userProfile User profile
     * @returns Relevance score (0-1)
     */
    private calculateRelevanceScore(prompt: AnalystPrompt, userProfile: UserProfile): number {
        let score = prompt.effectiveness || 0.5;
        
        // Adjust score based on usage (less used prompts get higher scores)
        score *= 1 - (prompt.usageCount || 0) / 10;
        
        // Adjust score based on last used date (older prompts get higher scores)
        if (prompt.lastUsed) {
            const daysSinceLastUsed = (Date.now() - prompt.lastUsed.getTime()) / (1000 * 60 * 60 * 24);
            score *= Math.min(1, daysSinceLastUsed / 30); // Max boost after 30 days
        }
        
        // Adjust score based on user profile
        if (userProfile.emotionalPatterns) {
            // Check if prompt tags match emotional patterns
            const emotionalTags = ['emotions', 'emotional-processing', 'feelings'];
            const hasEmotionalTags = prompt.tags.some(tag => emotionalTags.includes(tag));
            
            if (hasEmotionalTags && userProfile.emotionalPatterns.needsProcessing) {
                score += 0.2;
            }
        }
        
        if (userProfile.cognitivePatterns) {
            // Check if prompt tags match cognitive patterns
            const cognitiveTags = ['beliefs', 'thoughts', 'cognitive'];
            const hasCognitiveTags = prompt.tags.some(tag => cognitiveTags.includes(tag));
            
            if (hasCognitiveTags && userProfile.cognitivePatterns.needsReframing) {
                score += 0.2;
            }
        }
        
        if (userProfile.relationshipPatterns) {
            // Check if prompt tags match relationship patterns
            const relationshipTags = ['relationships', 'connection', 'interpersonal'];
            const hasRelationshipTags = prompt.tags.some(tag => relationshipTags.includes(tag));
            
            if (hasRelationshipTags && userProfile.relationshipPatterns.needsAttention) {
                score += 0.2;
            }
        }
        
        // Normalize score to 0-1 range
        return Math.min(1, Math.max(0, score));
    }

    /**
     * Generate a unique ID for a prompt
     * @param text Prompt text
     * @returns Unique ID
     */
    private generatePromptId(text: string): string {
        return `prompt_${text.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now().toString(36)}`;
    }

    /**
     * Generate a recommendation reason for a prompt
     * @param prompt The prompt
     * @param userProfile User profile
     * @returns Recommendation reason
     */
    private generateRecommendationReason(prompt: AnalystPrompt, userProfile?: UserProfile): string {
        if (!userProfile) {
            return "This prompt may help deepen your self-reflection.";
        }
        
        // Generate reason based on prompt category and user profile
        switch (prompt.category) {
            case "self-reflection":
                return "This prompt aligns with your current need for deeper self-understanding.";
            case "emotional-processing":
                return "Based on your recent entries, this prompt may help process emotions that need attention.";
            case "shadow-work":
                return "This prompt can help explore aspects of yourself that may benefit from integration.";
            case "relationships":
                return "Your relationship patterns suggest this prompt may offer valuable insights.";
            case "growth":
                return "This prompt aligns with your current growth trajectory.";
            default:
                return "This prompt is tailored to your current journaling patterns.";
        }
    }

    /**
     * Record a response to a prompt
     * @param promptId Prompt ID
     * @param promptText Prompt text
     * @param responseText User's response
     */
    public async recordPromptResponse(promptId: string, promptText: string, responseText: string): Promise<void> {
        if (!this.learningEnabled) return;
        
        // Create response record
        const response: PromptResponse = {
            promptId,
            promptText,
            responseText,
            date: new Date()
        };
        
        // Analyze the response
        try {
            const userProfile = this.userProfileSystem.getUserProfile();
            response.analysisResult = await this.analysisFrameworks.analyzeText(
                responseText,
                userProfile,
                { includeFreudian: true, detailLevel: 'basic' }
            );
        } catch (error) {
            console.error('Error analyzing prompt response:', error);
        }
        
        // Add to responses
        this.promptResponses.push(response);
        
        // Update prompt effectiveness
        this.updatePromptEffectiveness(promptId, promptText, responseText, response.analysisResult);
        
        // Save data
        await this.saveData();
    }

    /**
     * Update prompt effectiveness based on response
     * @param promptId Prompt ID
     * @param promptText Prompt text
     * @param responseText User's response
     * @param analysisResult Analysis of the response
     */
    private updatePromptEffectiveness(
        promptId: string,
        promptText: string,
        responseText: string,
        analysisResult?: any
    ): void {
        // Find the prompt
        const promptIndex = this.analystPrompts.findIndex(p => 
            this.generatePromptId(p.text) === promptId || p.text === promptText
        );
        
        if (promptIndex === -1) return;
        
        const prompt = this.analystPrompts[promptIndex];
        
        // Update usage count
        prompt.usageCount = (prompt.usageCount || 0) + 1;
        prompt.lastUsed = new Date();
        
        // Update response length
        prompt.responseLength = responseText.length;
        
        // Update effectiveness based on analysis result
        if (analysisResult) {
            // Calculate emotional depth from analysis
            const emotionalDepth = this.calculateEmotionalDepth(analysisResult);
            prompt.emotionalDepth = emotionalDepth;
            
            // Calculate insight generation from analysis
            const insightGeneration = this.calculateInsightGeneration(analysisResult);
            prompt.insightGeneration = insightGeneration;
            
            // Update overall effectiveness
            prompt.effectiveness = (emotionalDepth * 0.5) + (insightGeneration * 0.5);
        }
        
        // Update the prompt in the array
        this.analystPrompts[promptIndex] = prompt;
    }

    /**
     * Calculate emotional depth from analysis result
     * @param analysisResult Analysis result
     * @returns Emotional depth score (0-1)
     */
    private calculateEmotionalDepth(analysisResult: any): number {
        if (!analysisResult || !analysisResult.emotions) return 0.5;
        
        // Calculate emotional depth based on variety and intensity of emotions
        const emotions = analysisResult.emotions;
        const emotionKeys = Object.keys(emotions).filter(k => k !== 'sentiment');
        
        // More emotions = more depth
        const varietyScore = Math.min(1, emotionKeys.length / 5);
        
        // Higher intensity = more depth
        let intensitySum = 0;
        emotionKeys.forEach(key => {
            intensitySum += emotions[key];
        });
        const intensityScore = Math.min(1, intensitySum / emotionKeys.length / 0.7);
        
        return (varietyScore * 0.5) + (intensityScore * 0.5);
    }

    /**
     * Calculate insight generation from analysis result
     * @param analysisResult Analysis result
     * @returns Insight generation score (0-1)
     */
    private calculateInsightGeneration(analysisResult: any): number {
        if (!analysisResult) return 0.5;
        
        // Calculate insight generation based on analysis
        let insightScore = 0.5; // Default
        
        // Check for insights in the analysis
        if (analysisResult.insights && analysisResult.insights.length > 0) {
            insightScore += 0.3;
        }
        
        // Check for patterns identified
        if (analysisResult.patterns && analysisResult.patterns.length > 0) {
            insightScore += 0.2;
        }
        
        return Math.min(1, insightScore);
    }

    /**
     * Create a new analyst prompt
     * @param text Prompt text
     * @param category Prompt category
     * @param tags Prompt tags
     */
    public async createAnalystPrompt(
        text: string,
        category: PromptCategory,
        tags: string[]
    ): Promise<void> {
        // Create new prompt
        const newPrompt: AnalystPrompt = {
            text,
            category,
            tags,
            effectiveness: 0.5, // Default effectiveness
            usageCount: 0
        };
        
        // Add to prompts
        this.analystPrompts.push(newPrompt);
        
        // Save data
        await this.saveData();
    }

    /**
     * Toggle learning mode
     * @param enabled Whether learning is enabled
     */
    public toggleLearning(enabled: boolean): void {
        this.learningEnabled = enabled;
    }

    /**
     * Get learning status
     * @returns Whether learning is enabled
     */
    public isLearningEnabled(): boolean {
        return this.learningEnabled;
    }
}
