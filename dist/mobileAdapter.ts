import { AnalysisResult } from './types';
import { ApiService } from './apiService';

/**
 * Mobile Adapter for Deleometer
 * Provides a bridge between the Deleometer core and mobile applications
 */
export class MobileAdapter {
    private apiService: ApiService;
    private syncEnabled: boolean;
    private syncInterval: number;
    private syncTimer: NodeJS.Timeout | null = null;
    private pendingEntries: MobileJournalEntry[] = [];
    
    constructor(apiService: ApiService, settings: MobileAdapterSettings) {
        this.apiService = apiService;
        this.syncEnabled = settings.syncEnabled;
        this.syncInterval = settings.syncInterval;
    }
    
    /**
     * Starts the mobile adapter
     * @returns Promise<void>
     */
    public async start(): Promise<void> {
        if (this.syncEnabled) {
            this.startSyncTimer();
        }
    }
    
    /**
     * Stops the mobile adapter
     * @returns Promise<void>
     */
    public async stop(): Promise<void> {
        this.stopSyncTimer();
    }
    
    /**
     * Starts the sync timer
     */
    private startSyncTimer(): void {
        if (this.syncTimer) {
            return;
        }
        
        console.log(`[MobileAdapter] Starting sync timer (interval: ${this.syncInterval}ms)`);
        
        this.syncTimer = setInterval(() => {
            this.syncPendingEntries();
        }, this.syncInterval);
    }
    
    /**
     * Stops the sync timer
     */
    private stopSyncTimer(): void {
        if (!this.syncTimer) {
            return;
        }
        
        console.log('[MobileAdapter] Stopping sync timer');
        
        clearInterval(this.syncTimer);
        this.syncTimer = null;
    }
    
    /**
     * Syncs pending entries
     */
    private async syncPendingEntries(): Promise<void> {
        if (this.pendingEntries.length === 0) {
            return;
        }
        
        console.log(`[MobileAdapter] Syncing ${this.pendingEntries.length} pending entries`);
        
        try {
            // Process each pending entry
            const entriesToProcess = [...this.pendingEntries];
            this.pendingEntries = [];
            
            for (const entry of entriesToProcess) {
                try {
                    // Analyze the entry
                    const result = await this.analyzeEntry(entry.text);
                    
                    // Save the result
                    await this.saveAnalysisResult(entry.id, result);
                    
                    console.log(`[MobileAdapter] Successfully synced entry ${entry.id}`);
                } catch (error) {
                    console.error(`[MobileAdapter] Error syncing entry ${entry.id}:`, error);
                    
                    // Add back to pending entries
                    this.pendingEntries.push(entry);
                }
            }
        } catch (error) {
            console.error('[MobileAdapter] Error syncing pending entries:', error);
        }
    }
    
    /**
     * Adds a journal entry to be analyzed
     * @param id The entry ID
     * @param text The entry text
     * @param analyze Whether to analyze the entry immediately
     * @returns Promise<AnalysisResult | null> The analysis result if analyze is true, null otherwise
     */
    public async addJournalEntry(id: string, text: string, analyze: boolean = false): Promise<AnalysisResult | null> {
        if (analyze) {
            // Analyze immediately
            const result = await this.analyzeEntry(text);
            await this.saveAnalysisResult(id, result);
            return result;
        } else {
            // Add to pending entries
            this.pendingEntries.push({ id, text });
            return null;
        }
    }
    
    /**
     * Analyzes a journal entry
     * @param text The entry text
     * @returns Promise<AnalysisResult> The analysis result
     */
    private async analyzeEntry(text: string): Promise<AnalysisResult> {
        try {
            // Create prompt
            const prompt = `
                Analyze this journal entry and provide:
                1. Emotional analysis (quantify emotions on a scale of 0-10)
                2. Psychoanalytic insights
                3. Personality traits based on the Big Five model
                
                Format the response as JSON with these keys:
                - emotions: object with emotion names and values
                - psychoanalysis: string with psychoanalytic insights
                - personality: object with personality trait names and values
                
                Journal Entry: ${text}
            `;
            
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
            console.error('[MobileAdapter] Error analyzing entry:', error);
            throw new Error(`Analysis failed: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Saves an analysis result
     * @param id The entry ID
     * @param result The analysis result
     * @returns Promise<void>
     */
    private async saveAnalysisResult(id: string, result: AnalysisResult): Promise<void> {
        // In a real implementation, we would save the result to a database or file
        console.log(`[MobileAdapter] Saving analysis result for entry ${id}`);
    }
    
    /**
     * Gets analysis results for a date range
     * @param startDate The start date
     * @param endDate The end date
     * @returns Promise<MobileAnalysisResult[]> The analysis results
     */
    public async getAnalysisResults(startDate: Date, endDate: Date): Promise<MobileAnalysisResult[]> {
        // In a real implementation, we would fetch results from a database or file
        console.log(`[MobileAdapter] Getting analysis results from ${startDate.toISOString()} to ${endDate.toISOString()}`);
        
        // Return mock data
        return [
            {
                id: 'entry-1',
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                emotions: {
                    joy: 7,
                    sadness: 3,
                    anger: 2,
                    fear: 1,
                    surprise: 4,
                    sentiment: 0.6
                },
                summary: 'Feeling generally positive with some underlying concerns.'
            },
            {
                id: 'entry-2',
                date: new Date().toISOString(), // Today
                emotions: {
                    joy: 5,
                    sadness: 4,
                    anger: 3,
                    fear: 2,
                    surprise: 3,
                    sentiment: 0.3
                },
                summary: 'Mixed emotions with a slight negative trend.'
            }
        ];
    }
    
    /**
     * Gets the emotional trend for a date range
     * @param startDate The start date
     * @param endDate The end date
     * @returns Promise<EmotionalTrend> The emotional trend
     */
    public async getEmotionalTrend(startDate: Date, endDate: Date): Promise<EmotionalTrend> {
        // In a real implementation, we would calculate this from actual data
        console.log(`[MobileAdapter] Getting emotional trend from ${startDate.toISOString()} to ${endDate.toISOString()}`);
        
        // Return mock data
        return {
            overallSentiment: 0.45,
            dominantEmotion: 'joy',
            emotionChanges: {
                joy: 0.2,
                sadness: -0.1,
                anger: -0.3,
                fear: -0.2,
                surprise: 0.1
            },
            recommendation: 'Your joy has been increasing while negative emotions are decreasing. Consider activities that further boost positive emotions.'
        };
    }
    
    /**
     * Updates the mobile adapter settings
     * @param settings The new settings
     */
    public updateSettings(settings: MobileAdapterSettings): void {
        const syncEnabledChanged = this.syncEnabled !== settings.syncEnabled;
        const syncIntervalChanged = this.syncInterval !== settings.syncInterval;
        
        this.syncEnabled = settings.syncEnabled;
        this.syncInterval = settings.syncInterval;
        
        // Restart sync timer if needed
        if (syncEnabledChanged || syncIntervalChanged) {
            this.stopSyncTimer();
            
            if (this.syncEnabled) {
                this.startSyncTimer();
            }
        }
    }
}

/**
 * Mobile adapter settings
 */
export interface MobileAdapterSettings {
    syncEnabled: boolean;
    syncInterval: number;
}

/**
 * Mobile journal entry
 */
interface MobileJournalEntry {
    id: string;
    text: string;
}

/**
 * Mobile analysis result
 */
export interface MobileAnalysisResult {
    id: string;
    date: string;
    emotions: Record<string, number>;
    summary: string;
}

/**
 * Emotional trend
 */
export interface EmotionalTrend {
    overallSentiment: number;
    dominantEmotion: string;
    emotionChanges: Record<string, number>;
    recommendation: string;
}
