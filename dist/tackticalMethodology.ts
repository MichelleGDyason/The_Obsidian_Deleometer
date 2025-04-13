import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Tacktical Methodology analysis
 */
export interface TackticalAnalysisResult {
    // Core concepts from Bufardeci's theory
    tackingPatterns: {
        description: string;
        examples: string[];
        significance: string;
    };
    politicalDimensions: {
        description: string;
        implications: string[];
    };
    artisticMovements: {
        identified: string[];
        relationships: string;
    };
    spatialDynamics: {
        description: string;
        significance: string;
    };
    temporalShifts: {
        description: string;
        significance: string;
    };

    // Overall analysis
    summary: string;
    recommendations: string[];
}

/**
 * Options for Tacktical Methodology analysis
 */
export interface TackticalAnalysisOptions {
    detailLevel?: 'basic' | 'detailed' | 'comprehensive';
    focusAreas?: ('political' | 'artistic' | 'spatial' | 'temporal')[];
    includeRecommendations?: boolean;
}

/**
 * Implementation of Bufardeci's Tacktical Methodology for analyzing artistic work
 * Based on: Bufardeci, Louisa. 2025. Tacking and a Tacktical Methodology: Moving towards a Different Politics for Art. BRILL.
 */
export class TackticalMethodology {
    private apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    /**
     * Analyze text using Bufardeci's Tacktical Methodology
     * @param text The text to analyze
     * @param userProfile Optional user profile for personalization
     * @param options Analysis options
     * @returns Promise<TackticalAnalysisResult> The analysis result
     */
    public async analyzeText(
        text: string,
        userProfile?: UserProfile,
        options: TackticalAnalysisOptions = {}
    ): Promise<TackticalAnalysisResult> {
        // Default options
        const detailLevel = options.detailLevel || 'detailed';
        const focusAreas = options.focusAreas || ['political', 'artistic', 'spatial', 'temporal'];
        const includeRecommendations = options.includeRecommendations !== false;

        // Create prompt for API
        const prompt = this.createAnalysisPrompt(text, userProfile, detailLevel, focusAreas, includeRecommendations);

        // Call API
        const response = await this.apiService.callApi(prompt);

        // Parse response
        return this.parseAnalysisResponse(response);
    }

    /**
     * Analyze an image using Bufardeci's Tacktical Methodology
     * @param imageData Base64 encoded image data
     * @param caption Optional caption or description of the image
     * @param userProfile Optional user profile for personalization
     * @param options Analysis options
     * @returns Promise<TackticalAnalysisResult> The analysis result
     */
    public async analyzeImage(
        imageData: string,
        caption: string = '',
        userProfile?: UserProfile,
        options: TackticalAnalysisOptions = {}
    ): Promise<TackticalAnalysisResult> {
        // Default options
        const detailLevel = options.detailLevel || 'detailed';
        const focusAreas = options.focusAreas || ['political', 'artistic', 'spatial', 'temporal'];
        const includeRecommendations = options.includeRecommendations !== false;

        // Create prompt for API
        const prompt = this.createImageAnalysisPrompt(caption, userProfile, detailLevel, focusAreas, includeRecommendations);

        // Call API with image
        const response = await this.apiService.callApiWithImage(prompt, imageData);

        // Parse response
        return this.parseAnalysisResponse(response);
    }

    /**
     * Analyze audio using Bufardeci's Tacktical Methodology
     * @param audioTranscript Transcript of the audio
     * @param description Optional description of the audio
     * @param userProfile Optional user profile for personalization
     * @param options Analysis options
     * @returns Promise<TackticalAnalysisResult> The analysis result
     */
    public async analyzeAudio(
        audioTranscript: string,
        description: string = '',
        userProfile?: UserProfile,
        options: TackticalAnalysisOptions = {}
    ): Promise<TackticalAnalysisResult> {
        // Default options
        const detailLevel = options.detailLevel || 'detailed';
        const focusAreas = options.focusAreas || ['political', 'artistic', 'spatial', 'temporal'];
        const includeRecommendations = options.includeRecommendations !== false;

        // Create prompt for API
        const prompt = this.createAudioAnalysisPrompt(audioTranscript, description, userProfile, detailLevel, focusAreas, includeRecommendations);

        // Call API
        const response = await this.apiService.callApi(prompt);

        // Parse response
        return this.parseAnalysisResponse(response);
    }

    /**
     * Create analysis prompt for text
     */
    private createAnalysisPrompt(
        text: string,
        userProfile?: UserProfile,
        detailLevel: 'basic' | 'detailed' | 'comprehensive' = 'detailed',
        focusAreas: ('political' | 'artistic' | 'spatial' | 'temporal')[] = ['political', 'artistic', 'spatial', 'temporal'],
        includeRecommendations: boolean = true
    ): string {
        // Create base prompt
        let prompt = `Analyze the following text using Louisa Bufardeci's Tacktical Methodology from her 2025 work "Tacking and a Tacktical Methodology: Moving towards a Different Politics for Art" (BRILL).

The methodology focuses on:
1. Identifying "tacking" patterns - movements between different positions, perspectives, or approaches
2. Analyzing the political dimensions of artistic expression
3. Examining spatial and temporal dynamics
4. Considering how the work relates to broader artistic movements

Text to analyze:
"""
${text}
"""

Please provide a ${detailLevel} analysis focusing on the following areas: ${focusAreas.join(', ')}.
`;

        // Add user profile context if available
        if (userProfile) {
            prompt += `\n\nConsider that this user has shown interest in: ${userProfile.interests?.join(', ') || 'various topics'}.`;

            if (userProfile.artisticPreferences) {
                prompt += `\nTheir artistic preferences include: ${userProfile.artisticPreferences.join(', ')}.`;
            }
        }

        // Add request for recommendations if needed
        if (includeRecommendations) {
            prompt += `\n\nPlease include specific recommendations for how the author might develop their work further using Bufardeci's tacktical approach.`;
        }

        // Add output format instructions
        prompt += `\n\nFormat your response as a JSON object with the following structure:
{
  "tackingPatterns": {
    "description": "Description of tacking patterns identified",
    "examples": ["Example 1", "Example 2"],
    "significance": "Significance of these patterns"
  },
  "politicalDimensions": {
    "description": "Description of political dimensions",
    "implications": ["Implication 1", "Implication 2"]
  },
  "artisticMovements": {
    "identified": ["Movement 1", "Movement 2"],
    "relationships": "Description of relationships to these movements"
  },
  "spatialDynamics": {
    "description": "Description of spatial dynamics",
    "significance": "Significance of spatial elements"
  },
  "temporalShifts": {
    "description": "Description of temporal shifts",
    "significance": "Significance of temporal elements"
  },
  "summary": "Overall summary of the analysis",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

        return prompt;
    }

    /**
     * Create analysis prompt for image
     */
    private createImageAnalysisPrompt(
        caption: string,
        userProfile?: UserProfile,
        detailLevel: 'basic' | 'detailed' | 'comprehensive' = 'detailed',
        focusAreas: ('political' | 'artistic' | 'spatial' | 'temporal')[] = ['political', 'artistic', 'spatial', 'temporal'],
        includeRecommendations: boolean = true
    ): string {
        // Create base prompt
        let prompt = `Analyze the provided image using Louisa Bufardeci's Tacktical Methodology from her 2025 work "Tacking and a Tacktical Methodology: Moving towards a Different Politics for Art" (BRILL).

The methodology focuses on:
1. Identifying "tacking" patterns - movements between different positions, perspectives, or approaches in visual composition
2. Analyzing the political dimensions of visual expression
3. Examining spatial and temporal dynamics in visual art
4. Considering how the work relates to broader artistic movements

`;

        // Add caption if available
        if (caption) {
            prompt += `Image caption/description: "${caption}"\n\n`;
        }

        prompt += `Please provide a ${detailLevel} analysis focusing on the following areas: ${focusAreas.join(', ')}.`;

        // Add user profile context if available
        if (userProfile) {
            prompt += `\n\nConsider that this user has shown interest in: ${userProfile.interests?.join(', ') || 'various topics'}.`;

            if (userProfile.artisticPreferences) {
                prompt += `\nTheir artistic preferences include: ${userProfile.artisticPreferences.join(', ')}.`;
            }
        }

        // Add request for recommendations if needed
        if (includeRecommendations) {
            prompt += `\n\nPlease include specific recommendations for how the artist might develop their work further using Bufardeci's tacktical approach.`;
        }

        // Add output format instructions
        prompt += `\n\nFormat your response as a JSON object with the following structure:
{
  "tackingPatterns": {
    "description": "Description of visual tacking patterns identified",
    "examples": ["Example 1", "Example 2"],
    "significance": "Significance of these patterns"
  },
  "politicalDimensions": {
    "description": "Description of political dimensions in the visual work",
    "implications": ["Implication 1", "Implication 2"]
  },
  "artisticMovements": {
    "identified": ["Movement 1", "Movement 2"],
    "relationships": "Description of relationships to these movements"
  },
  "spatialDynamics": {
    "description": "Description of spatial dynamics in the image",
    "significance": "Significance of spatial elements"
  },
  "temporalShifts": {
    "description": "Description of temporal elements in the static image",
    "significance": "Significance of temporal elements"
  },
  "summary": "Overall summary of the visual analysis",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

        return prompt;
    }

    /**
     * Analyze film using Bufardeci's Tacktical Methodology
     * @param filmDescription Description of the film content
     * @param additionalInfo Optional additional information about the film
     * @param userProfile Optional user profile for personalization
     * @param options Analysis options
     * @returns Promise<TackticalAnalysisResult> The analysis result
     */
    public async analyzeFilm(
        filmDescription: string,
        additionalInfo: string = '',
        userProfile?: UserProfile,
        options: TackticalAnalysisOptions = {}
    ): Promise<TackticalAnalysisResult> {
        // Default options
        const detailLevel = options.detailLevel || 'detailed';
        const focusAreas = options.focusAreas || ['political', 'artistic', 'spatial', 'temporal'];
        const includeRecommendations = options.includeRecommendations !== false;

        // Create prompt for API
        const prompt = this.createFilmAnalysisPrompt(filmDescription, additionalInfo, userProfile, detailLevel, focusAreas, includeRecommendations);

        // Call API
        const response = await this.apiService.callApi(prompt);

        // Parse response
        return this.parseAnalysisResponse(response);
    }

    /**
     * Create analysis prompt for audio
     */
    private createAudioAnalysisPrompt(
        audioTranscript: string,
        description: string,
        userProfile?: UserProfile,
        detailLevel: 'basic' | 'detailed' | 'comprehensive' = 'detailed',
        focusAreas: ('political' | 'artistic' | 'spatial' | 'temporal')[] = ['political', 'artistic', 'spatial', 'temporal'],
        includeRecommendations: boolean = true
    ): string {
        // Create base prompt
        let prompt = `Analyze the following audio content using Louisa Bufardeci's Tacktical Methodology from her 2025 work "Tacking and a Tacktical Methodology: Moving towards a Different Politics for Art" (BRILL).

The methodology focuses on:
1. Identifying "tacking" patterns - movements between different positions, perspectives, or approaches in sonic composition
2. Analyzing the political dimensions of sonic expression
3. Examining spatial and temporal dynamics in sound
4. Considering how the work relates to broader artistic movements

`;

        // Add description if available
        if (description) {
            prompt += `Audio description: "${description}"\n\n`;
        }

        // Add transcript
        prompt += `Audio transcript/content:
"""
${audioTranscript}
"""

Please provide a ${detailLevel} analysis focusing on the following areas: ${focusAreas.join(', ')}.`;

        // Add user profile context if available
        if (userProfile) {
            prompt += `\n\nConsider that this user has shown interest in: ${userProfile.interests?.join(', ') || 'various topics'}.`;

            if (userProfile.artisticPreferences) {
                prompt += `\nTheir artistic preferences include: ${userProfile.artisticPreferences.join(', ')}.`;
            }
        }

        // Add request for recommendations if needed
        if (includeRecommendations) {
            prompt += `\n\nPlease include specific recommendations for how the artist might develop their sonic work further using Bufardeci's tacktical approach.`;
        }

        // Add output format instructions
        prompt += `\n\nFormat your response as a JSON object with the following structure:
{
  "tackingPatterns": {
    "description": "Description of sonic tacking patterns identified",
    "examples": ["Example 1", "Example 2"],
    "significance": "Significance of these patterns"
  },
  "politicalDimensions": {
    "description": "Description of political dimensions in the sonic work",
    "implications": ["Implication 1", "Implication 2"]
  },
  "artisticMovements": {
    "identified": ["Movement 1", "Movement 2"],
    "relationships": "Description of relationships to these movements"
  },
  "spatialDynamics": {
    "description": "Description of spatial dynamics in the audio",
    "significance": "Significance of spatial elements"
  },
  "temporalShifts": {
    "description": "Description of temporal shifts in the audio",
    "significance": "Significance of temporal elements"
  },
  "summary": "Overall summary of the sonic analysis",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

        return prompt;
    }

    /**
     * Create analysis prompt for film
     */
    private createFilmAnalysisPrompt(
        filmDescription: string,
        additionalInfo: string,
        userProfile?: UserProfile,
        detailLevel: 'basic' | 'detailed' | 'comprehensive' = 'detailed',
        focusAreas: ('political' | 'artistic' | 'spatial' | 'temporal')[] = ['political', 'artistic', 'spatial', 'temporal'],
        includeRecommendations: boolean = true
    ): string {
        // Create base prompt
        let prompt = `Analyze the following film using Louisa Bufardeci's Tacktical Methodology from her 2025 work "Tacking and a Tacktical Methodology: Moving towards a Different Politics for Art" (BRILL).

The methodology focuses on:
1. Tacking patterns - movements between different positions, perspectives, or approaches
2. Political dimensions - engagement with power relations and social structures
3. Artistic movements - relationships to historical and contemporary art practices
4. Spatial dynamics - organization and experience of space
5. Temporal shifts - organization and experience of time

Film description: ${filmDescription}
${additionalInfo ? `Additional information: ${additionalInfo}` : ''}

Please provide a ${detailLevel} analysis focusing on ${focusAreas.join(', ')}.
${includeRecommendations ? 'Include recommendations for further exploration.' : ''}`;

        // Add user profile context if available
        if (userProfile) {
            prompt += `\n\nConsider that this user has shown interest in: ${userProfile.interests?.join(', ') || 'various topics'}.`;

            if (userProfile.artisticPreferences) {
                prompt += `\nTheir artistic preferences include: ${userProfile.artisticPreferences.join(', ')}.`;
            }
        }

        // Add output format instructions
        prompt += `\n\nPlease format your response as a JSON object with the following structure:
{
  "tackingPatterns": {
    "description": "Description of tacking patterns in the film",
    "examples": ["Example 1", "Example 2"],
    "significance": "Significance of these patterns"
  },
  "politicalDimensions": {
    "description": "Description of political dimensions",
    "implications": ["Implication 1", "Implication 2"]
  },
  "artisticMovements": {
    "identified": ["Movement 1", "Movement 2"],
    "relationships": "Description of relationships between movements"
  },
  "spatialDynamics": {
    "description": "Description of spatial dynamics",
    "significance": "Significance of spatial organization"
  },
  "temporalShifts": {
    "description": "Description of temporal shifts",
    "significance": "Significance of temporal organization"
  },
  "summary": "Overall summary of the film analysis",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

        return prompt;
    }

    /**
     * Parse analysis response from API
     * @param response API response
     * @returns TackticalAnalysisResult
     */
    private parseAnalysisResponse(response: string): TackticalAnalysisResult {
        try {
            // Try to parse as JSON
            return JSON.parse(response);
        } catch (error) {
            // If parsing fails, extract information manually
            console.error('Error parsing Tacktical analysis response:', error);

            // Create default result
            const result: TackticalAnalysisResult = {
                tackingPatterns: {
                    description: this.extractSection(response, 'tacking patterns', 'description'),
                    examples: this.extractList(response, 'examples'),
                    significance: this.extractSection(response, 'significance')
                },
                politicalDimensions: {
                    description: this.extractSection(response, 'political dimensions', 'description'),
                    implications: this.extractList(response, 'implications')
                },
                artisticMovements: {
                    identified: this.extractList(response, 'movements', 'identified'),
                    relationships: this.extractSection(response, 'relationships')
                },
                spatialDynamics: {
                    description: this.extractSection(response, 'spatial dynamics', 'description'),
                    significance: this.extractSection(response, 'spatial', 'significance')
                },
                temporalShifts: {
                    description: this.extractSection(response, 'temporal shifts', 'description'),
                    significance: this.extractSection(response, 'temporal', 'significance')
                },
                summary: this.extractSection(response, 'summary'),
                recommendations: this.extractList(response, 'recommendations')
            };

            return result;
        }
    }

    /**
     * Extract a section from text
     * @param text Text to extract from
     * @param sectionName Name of the section
     * @param subSectionName Optional subsection name
     * @returns Extracted text
     */
    private extractSection(text: string, sectionName: string, subSectionName?: string): string {
        const sectionRegex = new RegExp(`${sectionName}[:\\s]+(.*?)(?=\\n\\n|$)`, 'is');
        const subSectionRegex = subSectionName ?
            new RegExp(`${subSectionName}[:\\s]+(.*?)(?=\\n\\n|$)`, 'is') : null;

        let match;

        if (subSectionRegex) {
            match = text.match(subSectionRegex);
        }

        if (!match) {
            match = text.match(sectionRegex);
        }

        return match ? match[1].trim() : 'Not provided';
    }

    /**
     * Extract a list from text
     * @param text Text to extract from
     * @param listName Name of the list
     * @param subListName Optional sublist name
     * @returns Extracted list
     */
    private extractList(text: string, listName: string, subListName?: string): string[] {
        const listRegex = new RegExp(`${listName}[:\\s]+(.*?)(?=\\n\\n|$)`, 'is');
        const subListRegex = subListName ?
            new RegExp(`${subListName}[:\\s]+(.*?)(?=\\n\\n|$)`, 'is') : null;

        let match;

        if (subListRegex) {
            match = text.match(subListRegex);
        }

        if (!match) {
            match = text.match(listRegex);
        }

        if (!match) return ['Not provided'];

        // Extract items from list
        const listText = match[1];
        const items = listText.split(/\n-|\n\d+\.|\s*,\s*/).map(item => item.trim()).filter(item => item);

        return items.length > 0 ? items : ['Not provided'];
    }
}
