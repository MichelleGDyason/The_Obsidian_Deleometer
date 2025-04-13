import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Categories of journaling prompts
 */
export type PromptCategory = 
    'self-reflection' | 
    'emotional-awareness' | 
    'personal-growth' | 
    'creativity' | 
    'relationships' | 
    'gratitude' | 
    'goals' | 
    'challenges' | 
    'mindfulness' | 
    'values' |
    'dreams' |
    'memories' |
    'identity' |
    'healing' |
    'spirituality';

/**
 * Represents a journaling prompt
 */
export interface JournalingPrompt {
    prompt: string;
    category: PromptCategory;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    timeEstimate: number; // in minutes
    frameworks: string[]; // which frameworks this prompt is particularly good for
    followUpPrompts?: string[]; // optional follow-up prompts
}

/**
 * Represents a set of journaling prompts
 */
export interface JournalingPromptSet {
    prompts: JournalingPrompt[];
    personalized: boolean;
    recommendedPrompt?: JournalingPrompt;
}

/**
 * Provides journaling prompts for users
 */
export class JournalingPrompts {
    private apiService: ApiService;
    private predefinedPrompts: Map<PromptCategory, JournalingPrompt[]>;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
        this.predefinedPrompts = this.initializePredefinedPrompts();
    }
    
    /**
     * Get journaling prompts
     * @param category Optional category to filter prompts
     * @param userProfile Optional user profile for personalization
     * @param count Number of prompts to return
     */
    async getPrompts(
        category?: PromptCategory, 
        userProfile?: UserProfile | null,
        count: number = 5
    ): Promise<JournalingPromptSet> {
        // If we have a user profile, generate personalized prompts
        if (userProfile) {
            return this.getPersonalizedPrompts(category, userProfile, count);
        }
        
        // Otherwise, return predefined prompts
        return this.getPredefinedPrompts(category, count);
    }
    
    /**
     * Get personalized journaling prompts
     * @param category Optional category to filter prompts
     * @param userProfile User profile for personalization
     * @param count Number of prompts to return
     */
    private async getPersonalizedPrompts(
        category?: PromptCategory,
        userProfile: UserProfile | null = null,
        count: number = 5
    ): Promise<JournalingPromptSet> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createPromptsGenerationPrompt(category, personalizationContext, count);
        
        // Get the prompts
        const result = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        // Add some predefined prompts to ensure quality
        const predefinedSet = this.getPredefinedPrompts(category, Math.floor(count / 2));
        
        // Combine personalized and predefined prompts
        const combinedPrompts = [...result.prompts, ...predefinedSet.prompts].slice(0, count);
        
        return {
            prompts: combinedPrompts,
            personalized: true,
            recommendedPrompt: result.recommendedPrompt || combinedPrompts[0]
        };
    }
    
    /**
     * Get predefined journaling prompts
     * @param category Optional category to filter prompts
     * @param count Number of prompts to return
     */
    private getPredefinedPrompts(
        category?: PromptCategory,
        count: number = 5
    ): JournalingPromptSet {
        let prompts: JournalingPrompt[] = [];
        
        // If category is specified, get prompts from that category
        if (category && this.predefinedPrompts.has(category)) {
            prompts = [...this.predefinedPrompts.get(category)!];
        } else {
            // Otherwise, get prompts from all categories
            for (const categoryPrompts of this.predefinedPrompts.values()) {
                prompts = [...prompts, ...categoryPrompts];
            }
        }
        
        // Shuffle the prompts
        prompts = this.shuffleArray(prompts);
        
        // Return the requested number of prompts
        return {
            prompts: prompts.slice(0, count),
            personalized: false,
            recommendedPrompt: prompts[0]
        };
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
     * Create a prompt for generating journaling prompts
     * @param category Optional category to filter prompts
     * @param personalizationContext Personalization context
     * @param count Number of prompts to return
     */
    private createPromptsGenerationPrompt(
        category?: PromptCategory,
        personalizationContext: string = '',
        count: number = 5
    ): string {
        const categoryText = category ? `in the category "${category}"` : 'across different categories';
        
        const prompt = `
            # Journaling Prompts Generation

            Generate ${count} thoughtful journaling prompts ${categoryText} that will help the user express themselves deeply and provide rich material for psychological and philosophical analysis.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "prompts": [
                    {
                        "prompt": "The journaling prompt text",
                        "category": "self-reflection/emotional-awareness/personal-growth/creativity/relationships/gratitude/goals/challenges/mindfulness/values/dreams/memories/identity/healing/spirituality",
                        "difficulty": "beginner/intermediate/advanced",
                        "timeEstimate": 15, // estimated time in minutes
                        "frameworks": ["List", "of", "relevant", "frameworks"],
                        "followUpPrompts": ["Optional", "follow-up", "prompts"]
                    },
                    // More prompts...
                ],
                "recommendedPrompt": {
                    // The most relevant prompt for this user based on their profile
                    "prompt": "The journaling prompt text",
                    "category": "category",
                    "difficulty": "difficulty",
                    "timeEstimate": 15,
                    "frameworks": ["List", "of", "relevant", "frameworks"],
                    "followUpPrompts": ["Optional", "follow-up", "prompts"]
                }
            }
        `;
        
        return prompt;
    }
    
    /**
     * Initialize predefined prompts
     */
    private initializePredefinedPrompts(): Map<PromptCategory, JournalingPrompt[]> {
        const prompts = new Map<PromptCategory, JournalingPrompt[]>();
        
        // Self-reflection prompts
        prompts.set('self-reflection', [
            {
                prompt: "Describe a moment when you felt most authentically yourself. What were you doing, who were you with, and what made this moment special?",
                category: 'self-reflection',
                difficulty: 'beginner',
                timeEstimate: 15,
                frameworks: ['existentialist', 'jungian', 'narrative'],
                followUpPrompts: [
                    "What prevents you from feeling this way more often?",
                    "How might you create more of these authentic moments in your life?"
                ]
            },
            {
                prompt: "Write a letter to your past self from 5 years ago. What wisdom would you share? What reassurances would you offer?",
                category: 'self-reflection',
                difficulty: 'intermediate',
                timeEstimate: 20,
                frameworks: ['narrative', 'existentialist', 'positive'],
                followUpPrompts: [
                    "What surprises you most about how your life has unfolded compared to what you expected?",
                    "What would your past self be proud of or surprised by?"
                ]
            },
            {
                prompt: "Reflect on a belief you once held strongly but have since changed your mind about. What caused this shift in perspective?",
                category: 'self-reflection',
                difficulty: 'intermediate',
                timeEstimate: 20,
                frameworks: ['cognitive-behavioral', 'critical', 'hermeneutics'],
                followUpPrompts: [
                    "How did this change in belief affect your identity or relationships?",
                    "Are there current beliefs you hold that you think might change in the future?"
                ]
            },
            {
                prompt: "If your life were a book, what would the current chapter be titled? Describe the major themes, characters, and developments in this chapter.",
                category: 'self-reflection',
                difficulty: 'beginner',
                timeEstimate: 15,
                frameworks: ['narrative', 'existentialist', 'jungian'],
                followUpPrompts: [
                    "What do you want the next chapter to be about?",
                    "Who are the main characters in your life story and what roles do they play?"
                ]
            },
            {
                prompt: "Describe the masks or personas you wear in different contexts of your life. How do you present yourself differently at work, with family, with friends, or when alone?",
                category: 'self-reflection',
                difficulty: 'advanced',
                timeEstimate: 25,
                frameworks: ['jungian', 'existentialist', 'gestalt'],
                followUpPrompts: [
                    "Which of these personas feels most authentic to you?",
                    "What parts of yourself do you hide from others, and why?"
                ]
            }
        ]);
        
        // Emotional awareness prompts
        prompts.set('emotional-awareness', [
            {
                prompt: "Describe an emotion you experienced today in detail. Where did you feel it in your body? What triggered it? How did it evolve over time?",
                category: 'emotional-awareness',
                difficulty: 'beginner',
                timeEstimate: 10,
                frameworks: ['phenomenological', 'cognitive-behavioral', 'gestalt'],
                followUpPrompts: [
                    "How did you respond to this emotion? Was this response helpful?",
                    "What would you like to do differently next time you experience this emotion?"
                ]
            },
            {
                prompt: "Think of an emotion you find difficult to express or experience. What makes this emotion challenging for you? How has this affected your life?",
                category: 'emotional-awareness',
                difficulty: 'intermediate',
                timeEstimate: 20,
                frameworks: ['psychoanalytic', 'attachment', 'cognitive-behavioral'],
                followUpPrompts: [
                    "Can you trace this difficulty back to earlier experiences in your life?",
                    "What would it look like to have a healthier relationship with this emotion?"
                ]
            },
            {
                prompt: "Describe a recent conflict or disagreement. What emotions were you experiencing beneath the surface? What emotions do you think the other person was experiencing?",
                category: 'emotional-awareness',
                difficulty: 'intermediate',
                timeEstimate: 20,
                frameworks: ['cognitive-behavioral', 'attachment', 'feminist'],
                followUpPrompts: [
                    "How did these emotions influence how the conflict unfolded?",
                    "What needs were you trying to meet through this interaction?"
                ]
            },
            {
                prompt: "Map your emotional landscape over the past week. What patterns do you notice? Are there specific triggers for certain emotions?",
                category: 'emotional-awareness',
                difficulty: 'advanced',
                timeEstimate: 25,
                frameworks: ['cognitive-behavioral', 'gestalt', 'phenomenological'],
                followUpPrompts: [
                    "Which emotions do you welcome, and which do you try to avoid?",
                    "How do your emotions influence your decisions and behaviors?"
                ]
            },
            {
                prompt: "Describe a moment when you experienced two contradictory emotions simultaneously. How did you navigate this emotional complexity?",
                category: 'emotional-awareness',
                difficulty: 'advanced',
                timeEstimate: 20,
                frameworks: ['dialectical', 'existentialist', 'gestalt'],
                followUpPrompts: [
                    "What does this emotional complexity reveal about the situation?",
                    "How comfortable are you with holding contradictory emotions?"
                ]
            }
        ]);
        
        // Add more categories and prompts...
        // Personal growth prompts
        prompts.set('personal-growth', [
            {
                prompt: "Describe a challenge you've overcome recently. What strengths and resources helped you through it? What did you learn?",
                category: 'personal-growth',
                difficulty: 'beginner',
                timeEstimate: 15,
                frameworks: ['positive', 'narrative', 'existentialist'],
                followUpPrompts: [
                    "How has overcoming this challenge changed how you see yourself?",
                    "What future challenges might you approach differently based on this experience?"
                ]
            },
            {
                prompt: "Identify three areas of your life where you'd like to grow. What specific steps could you take in each area? What obstacles might you face?",
                category: 'personal-growth',
                difficulty: 'intermediate',
                timeEstimate: 20,
                frameworks: ['cognitive-behavioral', 'positive', 'existentialist'],
                followUpPrompts: [
                    "Which of these growth areas feels most important right now, and why?",
                    "What support or resources would help you in your growth journey?"
                ]
            },
            {
                prompt: "Reflect on a mistake or failure that ultimately led to growth. What made this experience valuable? How did you transform setback into learning?",
                category: 'personal-growth',
                difficulty: 'intermediate',
                timeEstimate: 20,
                frameworks: ['narrative', 'positive', 'stoicism'],
                followUpPrompts: [
                    "How has your relationship with failure changed over time?",
                    "What advice would you give someone facing a similar setback?"
                ]
            }
        ]);
        
        // Creativity prompts
        prompts.set('creativity', [
            {
                prompt: "Imagine meeting your creative muse or inspiration as a person. Describe them, their personality, what they say to you, and how they guide your creative process.",
                category: 'creativity',
                difficulty: 'intermediate',
                timeEstimate: 20,
                frameworks: ['jungian', 'transpersonal', 'gestalt'],
                followUpPrompts: [
                    "What does this personification reveal about your creative process?",
                    "How might you strengthen your relationship with your creative muse?"
                ]
            },
            {
                prompt: "Choose an object in your immediate environment. Write a detailed description of it, then transform it into a metaphor for something in your life right now.",
                category: 'creativity',
                difficulty: 'beginner',
                timeEstimate: 15,
                frameworks: ['phenomenological', 'hermeneutics', 'gestalt'],
                followUpPrompts: [
                    "What new insights does this metaphor reveal about your current situation?",
                    "How might you extend this metaphor further?"
                ]
            },
            {
                prompt: "Write a dialogue between two opposing parts of yourself (e.g., your inner critic and inner advocate, your logical and emotional sides, your past and future self).",
                category: 'creativity',
                difficulty: 'advanced',
                timeEstimate: 25,
                frameworks: ['gestalt', 'jungian', 'dialectical'],
                followUpPrompts: [
                    "What surprised you about this dialogue?",
                    "How might you facilitate better cooperation between these parts of yourself?"
                ]
            }
        ]);
        
        // Add more categories as needed...
        
        return prompts;
    }
    
    /**
     * Shuffle an array using Fisher-Yates algorithm
     * @param array The array to shuffle
     */
    private shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}
