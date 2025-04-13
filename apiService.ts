import { Notice } from 'obsidian';

// Define a minimal OpenAI interface to avoid importing the full library
interface OpenAIInterface {
    chat: {
        completions: {
            create: (params: any) => Promise<any>;
        };
    };
}

// Mock OpenAI class for development without the actual library
class OpenAI implements OpenAIInterface {
    constructor(private config: { apiKey: string, dangerouslyAllowBrowser?: boolean }) {}

    chat = {
        completions: {
            create: async (params: any) => {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the prompt from the messages
                const prompt = params.messages[0].content;

                // Generate a mock response based on the prompt
                let content = '';

                if (prompt.includes('emotional content')) {
                    // Emotion analysis
                    content = JSON.stringify({
                        joy: 7,
                        sadness: 3,
                        anger: 2,
                        fear: 1,
                        surprise: 4,
                        sentiment: 0.6
                    });
                } else if (prompt.includes('psychoanalytic')) {
                    // Psychoanalytic response
                    content = `Your journal entry reveals several interesting psychoanalytic patterns.

From a Freudian perspective, there appears to be a tension between your conscious desires and unconscious drives. The repeated mention of future plans suggests a strong ego development, while the emotional undertones hint at deeper id-based motivations.

From a Lacanian viewpoint, your language reveals a search for the "objet petit a" - that unattainable object of desire that drives your actions. The symbolic order of your writing suggests a structured approach to making meaning of your experiences.`;
                } else if (prompt.includes('personality')) {
                    // Personality analysis
                    content = JSON.stringify({
                        openness: 0.8,
                        conscientiousness: 0.7,
                        extraversion: 0.4,
                        agreeableness: 0.6,
                        neuroticism: 0.3
                    });
                } else {
                    // Default response
                    content = 'I analyzed your journal entry and found some interesting patterns.';
                }

                // Return a mock response
                return {
                    choices: [
                        {
                            message: {
                                content: content
                            }
                        }
                    ]
                };
            }
        }
    };
}

export interface ApiServiceSettings {
    openaiApiKey: string;
    provider: 'openai' | 'claude' | 'local';
    model: string;
}

export class ApiService {
    private openai: OpenAI | null = null;

    constructor(private settings: ApiServiceSettings) {
        this.initializeClient();
    }

    private initializeClient() {
        if (this.settings.provider === 'openai' && this.settings.openaiApiKey) {
            try {
                this.openai = new OpenAI({
                    apiKey: this.settings.openaiApiKey,
                    dangerouslyAllowBrowser: true
                });
            } catch (error) {
                console.error('Failed to initialize OpenAI client:', error);
                new Notice('Failed to initialize OpenAI client. Please check your API key.');
            }
        }
    }

    public updateSettings(settings: ApiServiceSettings) {
        this.settings = settings;
        this.initializeClient();
    }

    public async validateApiKey(): Promise<boolean> {
        if (!this.settings.openaiApiKey) {
            return false;
        }

        try {
            // In a real implementation, we would make a request to the OpenAI API
            // For now, we'll just simulate it with a mock implementation

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Consider key valid if it starts with "sk-"
            return this.settings.openaiApiKey.startsWith('sk-');
        } catch (error) {
            console.error('API key validation failed:', error);
            return false;
        }
    }

    public async getCompletion(prompt: string, options: {
        responseFormat?: 'json_object' | 'text',
        maxTokens?: number
    } = {}): Promise<any> {
        if (!this.openai) {
            throw new Error('API client not initialized. Please check your API key.');
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: this.settings.model || 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                response_format: options.responseFormat === 'json_object'
                    ? { type: "json_object" }
                    : undefined,
                max_tokens: options.maxTokens
            });

            if (options.responseFormat === 'json_object') {
                return JSON.parse(response.choices[0].message.content);
            }

            return response.choices[0].message.content;
        } catch (error) {
            console.error('API request failed:', error);

            // Provide more specific error messages
            if (error.response?.status === 401) {
                throw new Error('Invalid API key. Please check your settings.');
            } else if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (error.response?.status === 500) {
                throw new Error('OpenAI server error. Please try again later.');
            } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error('Network error. Please check your internet connection.');
            }

            throw new Error(`API request failed: ${error.message || 'Unknown error'}`);
        }
    }
}
