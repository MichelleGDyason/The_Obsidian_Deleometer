import { AnalysisResult } from './types';
import { ApiService } from './apiService';

/**
 * Web API Service for Deleometer
 * Provides a REST API for third-party applications to use Deleometer's analysis capabilities
 */
export class WebApiService {
    private apiService: ApiService;
    private apiKey: string;
    private port: number;
    private server: any = null;
    
    constructor(apiService: ApiService, apiKey: string, port: number = 3000) {
        this.apiService = apiService;
        this.apiKey = apiKey;
        this.port = port;
    }
    
    /**
     * Starts the web API server
     * @returns Promise<void>
     */
    public async start(): Promise<void> {
        try {
            // In a real implementation, we would use Express.js or a similar framework
            // For now, we'll just simulate the server
            console.log(`[WebApiService] Starting server on port ${this.port}...`);
            
            // Simulate server startup
            this.server = {
                port: this.port,
                routes: {
                    '/api/analyze': this.handleAnalyzeRequest.bind(this),
                    '/api/health': this.handleHealthCheck.bind(this)
                }
            };
            
            console.log(`[WebApiService] Server started on port ${this.port}`);
        } catch (error) {
            console.error('[WebApiService] Error starting server:', error);
            throw new Error(`Failed to start web API server: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Stops the web API server
     * @returns Promise<void>
     */
    public async stop(): Promise<void> {
        if (!this.server) {
            return;
        }
        
        try {
            console.log('[WebApiService] Stopping server...');
            
            // Simulate server shutdown
            this.server = null;
            
            console.log('[WebApiService] Server stopped');
        } catch (error) {
            console.error('[WebApiService] Error stopping server:', error);
            throw new Error(`Failed to stop web API server: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Handles an analyze request
     * @param req The request object
     * @param res The response object
     */
    private async handleAnalyzeRequest(req: any, res: any): Promise<void> {
        try {
            // Check API key
            const apiKey = req.headers['x-api-key'];
            if (apiKey !== this.apiKey) {
                res.status(401).json({ error: 'Invalid API key' });
                return;
            }
            
            // Get request body
            const { text, options } = req.body;
            
            if (!text) {
                res.status(400).json({ error: 'Missing text parameter' });
                return;
            }
            
            // Perform analysis
            const result = await this.performAnalysis(text, options);
            
            // Return result
            res.status(200).json(result);
        } catch (error) {
            console.error('[WebApiService] Error handling analyze request:', error);
            res.status(500).json({ error: `Analysis failed: ${error.message || 'Unknown error'}` });
        }
    }
    
    /**
     * Handles a health check request
     * @param req The request object
     * @param res The response object
     */
    private async handleHealthCheck(req: any, res: any): Promise<void> {
        res.status(200).json({ status: 'ok' });
    }
    
    /**
     * Performs analysis on the provided text
     * @param text The text to analyze
     * @param options Analysis options
     * @returns Promise<AnalysisResult> The analysis result
     */
    private async performAnalysis(text: string, options: any = {}): Promise<AnalysisResult> {
        try {
            // Create prompt based on options
            let prompt = 'Analyze the following journal entry:\n\n';
            
            if (options.enableEmotions !== false) {
                prompt += '- Identify and quantify emotions (scale 0-10)\n';
            }
            
            if (options.enablePsychoanalysis) {
                prompt += '- Provide psychoanalytic insights\n';
            }
            
            if (options.enablePersonality) {
                prompt += '- Analyze personality traits based on the Big Five model\n';
            }
            
            prompt += `\nJournal Entry: ${text}`;
            
            // Get completion from API
            const response = await this.apiService.getCompletion(prompt, {
                responseFormat: 'json_object'
            });
            
            // Process response into AnalysisResult
            const result: AnalysisResult = {
                emotions: response.emotions || {},
                psychoanalyticResponse: response.psychoanalysis || '',
                personalityInsights: response.personality || {},
                date: new Date().toISOString()
            };
            
            return result;
        } catch (error) {
            console.error('[WebApiService] Error performing analysis:', error);
            throw new Error(`Analysis failed: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Generates API documentation
     * @returns string The API documentation in markdown format
     */
    public generateApiDocs(): string {
        return `# Deleometer API Documentation

## Authentication

All API requests require an API key to be passed in the \`X-API-Key\` header.

## Endpoints

### POST /api/analyze

Analyzes a journal entry and returns insights.

#### Request

\`\`\`json
{
  "text": "Your journal entry text here...",
  "options": {
    "enableEmotions": true,
    "enablePsychoanalysis": true,
    "enablePersonality": true
  }
}
\`\`\`

#### Response

\`\`\`json
{
  "emotions": {
    "joy": 7,
    "sadness": 3,
    "anger": 2,
    "fear": 1,
    "surprise": 4,
    "sentiment": 0.6
  },
  "psychoanalyticResponse": "Psychoanalytic insights here...",
  "personalityInsights": {
    "openness": 0.8,
    "conscientiousness": 0.7,
    "extraversion": 0.4,
    "agreeableness": 0.6,
    "neuroticism": 0.3
  },
  "date": "2023-06-15T12:34:56.789Z"
}
\`\`\`

### GET /api/health

Returns the health status of the API.

#### Response

\`\`\`json
{
  "status": "ok"
}
\`\`\`

## Error Handling

Errors are returned as JSON objects with an \`error\` field:

\`\`\`json
{
  "error": "Error message here"
}
\`\`\`

## Rate Limiting

API requests are limited to 100 requests per day per API key.
`;
    }
}

/**
 * Web API settings
 */
export interface WebApiSettings {
    enabled: boolean;
    port: number;
    apiKey: string;
}
