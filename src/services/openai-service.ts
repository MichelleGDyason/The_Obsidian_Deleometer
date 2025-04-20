import { DeleometerSettings } from '../constants';

// Define interfaces for OpenAI requests and responses
interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface OpenAIRequest {
    model: string;
    messages: OpenAIMessage[];
    max_tokens?: number;
    temperature?: number;
}

interface OpenAIResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export class OpenAIService {
    private apiKey: string;
    private model: string;
    private apiUrl: string = 'https://api.openai.com/v1/chat/completions';
    private cache: Map<string, string> = new Map();

    constructor(settings: DeleometerSettings) {
        this.apiKey = settings.openaiApiKey || '';
        this.model = settings.openaiModel || 'gpt-3.5-turbo';
    }

    /**
     * Update the service configuration
     */
    updateConfig(settings: DeleometerSettings) {
        this.apiKey = settings.openaiApiKey || '';
        this.model = settings.openaiModel || 'gpt-3.5-turbo';
    }

    /**
     * Check if the OpenAI integration is properly configured
     */
    isConfigured(): boolean {
        return !!this.apiKey;
    }

    /**
     * Generate a cache key for a request
     */
    private generateCacheKey(framework: string, content: string, mediaType: string): string {
        // Create a simple hash of the content to use as part of the cache key
        let contentHash = 0;
        for (let i = 0; i < content.length; i++) {
            contentHash = ((contentHash << 5) - contentHash) + content.charCodeAt(i);
            contentHash = contentHash & contentHash; // Convert to 32bit integer
        }
        
        return `${framework}-${mediaType}-${contentHash}`;
    }

    /**
     * Analyze content using OpenAI API
     */
    async analyzeContent(content: string, framework: string, mediaType: string, frameworkName: string): Promise<string> {
        // Check if API key is configured
        if (!this.isConfigured()) {
            throw new Error('OpenAI API key is not configured');
        }

        // Check cache first
        const cacheKey = this.generateCacheKey(framework, content, mediaType);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey) as string;
        }

        try {
            // Prepare the prompt based on the framework and media type
            const systemPrompt = this.getSystemPrompt(framework, mediaType, frameworkName);
            const userPrompt = this.getUserPrompt(content, mediaType, frameworkName);

            // Prepare the request
            const request: OpenAIRequest = {
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 1000,
                temperature: 0.7
            };

            // Call the OpenAI API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(request)
            });

            // Parse the response
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
            }

            const data = await response.json() as OpenAIResponse;
            const analysisText = data.choices[0]?.message?.content || 'Analysis could not be generated.';

            // Cache the result
            this.cache.set(cacheKey, analysisText);

            return analysisText;
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            throw error;
        }
    }

    /**
     * Get the system prompt for a specific framework and media type
     */
    private getSystemPrompt(framework: string, mediaType: string, frameworkName: string): string {
        return `You are an expert in ${frameworkName} analysis. 
Your task is to analyze ${mediaType} content from a ${frameworkName} perspective.
Provide a detailed, insightful analysis that demonstrates deep understanding of ${frameworkName} concepts and methodology.
Your analysis should be approximately 6-8 sentences long, well-structured, and focused on the most relevant aspects of ${frameworkName} theory.
Use specific terminology and concepts from ${frameworkName} in your analysis.
Do not include phrases like "From a ${frameworkName} perspective" or similar introductory phrases.
Focus on providing substantive analysis rather than meta-commentary about the analysis itself.`;
    }

    /**
     * Get the user prompt for a specific content and media type
     */
    private getUserPrompt(content: string, mediaType: string, frameworkName: string): string {
        const contentPreview = content.length > 1000 
            ? content.substring(0, 1000) + '...' 
            : content;
            
        return `Analyze the following ${mediaType} content using ${frameworkName} theory and methodology:

${contentPreview}

Provide a detailed analysis that applies key concepts from ${frameworkName}.`;
    }

    /**
     * Clear the cache
     */
    clearCache() {
        this.cache.clear();
    }
}
