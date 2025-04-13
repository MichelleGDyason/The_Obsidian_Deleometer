import { AnalysisResult } from './types';

/**
 * Research Module for Deleometer
 * Provides tools for validating analysis methods and collecting anonymized research data
 */
export class ResearchModule {
    private settings: ResearchModuleSettings;
    private dataCollectionEnabled: boolean;
    private anonymizedData: AnonymizedEntry[] = [];
    private validationStudies: ValidationStudy[] = [];
    
    constructor(settings: ResearchModuleSettings) {
        this.settings = settings;
        this.dataCollectionEnabled = settings.dataCollectionEnabled;
    }
    
    /**
     * Collects anonymized data from an analysis result
     * @param result The analysis result
     * @param metadata Optional metadata
     * @returns Promise<void>
     */
    public async collectAnonymizedData(result: AnalysisResult, metadata: Record<string, any> = {}): Promise<void> {
        if (!this.dataCollectionEnabled) {
            return;
        }
        
        try {
            // Create anonymized entry
            const entry: AnonymizedEntry = {
                id: `entry-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                timestamp: new Date().toISOString(),
                emotionDistribution: this.anonymizeEmotions(result.emotions),
                personalityDistribution: this.anonymizePersonality(result.personalityInsights),
                metadata: this.anonymizeMetadata(metadata)
            };
            
            // Add to anonymized data
            this.anonymizedData.push(entry);
            
            // If we've reached the batch size, export the data
            if (this.anonymizedData.length >= this.settings.exportBatchSize) {
                await this.exportAnonymizedData();
            }
        } catch (error) {
            console.error('[ResearchModule] Error collecting anonymized data:', error);
        }
    }
    
    /**
     * Anonymizes emotions
     * @param emotions The emotions to anonymize
     * @returns Record<string, number> The anonymized emotions
     */
    private anonymizeEmotions(emotions: Record<string, number> | undefined): Record<string, number> {
        if (!emotions) {
            return {};
        }
        
        // Create a copy of the emotions
        const anonymized: Record<string, number> = {};
        
        // Copy only the emotion values, not the sentiment
        for (const [emotion, value] of Object.entries(emotions)) {
            if (emotion !== 'sentiment') {
                anonymized[emotion] = value;
            }
        }
        
        // Add sentiment as a separate value
        if (emotions.sentiment !== undefined) {
            anonymized.sentiment = emotions.sentiment;
        }
        
        return anonymized;
    }
    
    /**
     * Anonymizes personality insights
     * @param personality The personality insights to anonymize
     * @returns Record<string, number> The anonymized personality insights
     */
    private anonymizePersonality(personality: Record<string, number> | undefined): Record<string, number> {
        if (!personality) {
            return {};
        }
        
        // Create a copy of the personality insights
        const anonymized: Record<string, number> = {};
        
        // Copy only the Big Five traits
        const bigFiveTraits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
        
        for (const trait of bigFiveTraits) {
            if (personality[trait] !== undefined) {
                anonymized[trait] = personality[trait];
            }
        }
        
        return anonymized;
    }
    
    /**
     * Anonymizes metadata
     * @param metadata The metadata to anonymize
     * @returns Record<string, any> The anonymized metadata
     */
    private anonymizeMetadata(metadata: Record<string, any>): Record<string, any> {
        // Create a copy of the metadata
        const anonymized: Record<string, any> = {};
        
        // Copy only the allowed metadata fields
        const allowedFields = ['journalLength', 'analysisTime', 'deviceType', 'appVersion'];
        
        for (const field of allowedFields) {
            if (metadata[field] !== undefined) {
                anonymized[field] = metadata[field];
            }
        }
        
        return anonymized;
    }
    
    /**
     * Exports anonymized data
     * @returns Promise<void>
     */
    private async exportAnonymizedData(): Promise<void> {
        if (this.anonymizedData.length === 0) {
            return;
        }
        
        try {
            console.log(`[ResearchModule] Exporting ${this.anonymizedData.length} anonymized entries`);
            
            // In a real implementation, we would send the data to a research server
            // For now, we'll just log it
            console.log('[ResearchModule] Anonymized data:', JSON.stringify(this.anonymizedData));
            
            // Clear the anonymized data
            this.anonymizedData = [];
        } catch (error) {
            console.error('[ResearchModule] Error exporting anonymized data:', error);
        }
    }
    
    /**
     * Creates a validation study
     * @param name The study name
     * @param description The study description
     * @param validationCriteria The validation criteria
     * @returns Promise<string> The study ID
     */
    public async createValidationStudy(
        name: string,
        description: string,
        validationCriteria: ValidationCriteria
    ): Promise<string> {
        try {
            // Create study ID
            const studyId = `study-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            
            // Create validation study
            const study: ValidationStudy = {
                id: studyId,
                name,
                description,
                createdAt: new Date().toISOString(),
                status: 'active',
                validationCriteria,
                results: {
                    totalEntries: 0,
                    validatedEntries: 0,
                    accuracy: {
                        emotions: 0,
                        personality: 0,
                        overall: 0
                    },
                    recommendations: []
                }
            };
            
            // Add to validation studies
            this.validationStudies.push(study);
            
            console.log(`[ResearchModule] Created validation study: ${studyId}`);
            
            return studyId;
        } catch (error) {
            console.error('[ResearchModule] Error creating validation study:', error);
            throw new Error(`Failed to create validation study: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Validates an analysis result against a validation study
     * @param studyId The study ID
     * @param result The analysis result
     * @param expertRating The expert rating
     * @returns Promise<ValidationResult> The validation result
     */
    public async validateAnalysisResult(
        studyId: string,
        result: AnalysisResult,
        expertRating: ExpertRating
    ): Promise<ValidationResult> {
        try {
            // Find the validation study
            const study = this.validationStudies.find(s => s.id === studyId);
            
            if (!study) {
                throw new Error(`Validation study not found: ${studyId}`);
            }
            
            // Calculate accuracy
            const emotionAccuracy = this.calculateEmotionAccuracy(result.emotions, expertRating.emotions);
            const personalityAccuracy = this.calculatePersonalityAccuracy(result.personalityInsights, expertRating.personality);
            const overallAccuracy = (emotionAccuracy + personalityAccuracy) / 2;
            
            // Create validation result
            const validationResult: ValidationResult = {
                studyId,
                timestamp: new Date().toISOString(),
                accuracy: {
                    emotions: emotionAccuracy,
                    personality: personalityAccuracy,
                    overall: overallAccuracy
                },
                discrepancies: this.findDiscrepancies(result, expertRating),
                recommendations: this.generateRecommendations(result, expertRating)
            };
            
            // Update study results
            study.results.totalEntries++;
            study.results.validatedEntries++;
            
            // Update accuracy (running average)
            const prevTotal = study.results.validatedEntries - 1;
            study.results.accuracy.emotions = (study.results.accuracy.emotions * prevTotal + emotionAccuracy) / study.results.validatedEntries;
            study.results.accuracy.personality = (study.results.accuracy.personality * prevTotal + personalityAccuracy) / study.results.validatedEntries;
            study.results.accuracy.overall = (study.results.accuracy.overall * prevTotal + overallAccuracy) / study.results.validatedEntries;
            
            // Add recommendations
            for (const recommendation of validationResult.recommendations) {
                if (!study.results.recommendations.includes(recommendation)) {
                    study.results.recommendations.push(recommendation);
                }
            }
            
            console.log(`[ResearchModule] Validated analysis result for study ${studyId}`);
            
            return validationResult;
        } catch (error) {
            console.error('[ResearchModule] Error validating analysis result:', error);
            throw new Error(`Failed to validate analysis result: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Calculates emotion accuracy
     * @param emotions The emotions to validate
     * @param expertEmotions The expert emotions
     * @returns number The accuracy (0-1)
     */
    private calculateEmotionAccuracy(
        emotions: Record<string, number> | undefined,
        expertEmotions: Record<string, number>
    ): number {
        if (!emotions) {
            return 0;
        }
        
        // Calculate the mean absolute error
        let totalError = 0;
        let count = 0;
        
        for (const [emotion, expertValue] of Object.entries(expertEmotions)) {
            if (emotion !== 'sentiment' && emotions[emotion] !== undefined) {
                // Normalize values to 0-1 range
                const normalizedValue = emotions[emotion] / 10;
                const normalizedExpertValue = expertValue / 10;
                
                // Calculate absolute error
                const error = Math.abs(normalizedValue - normalizedExpertValue);
                
                totalError += error;
                count++;
            }
        }
        
        if (count === 0) {
            return 0;
        }
        
        // Calculate mean absolute error
        const meanAbsoluteError = totalError / count;
        
        // Convert to accuracy (1 - error)
        return 1 - meanAbsoluteError;
    }
    
    /**
     * Calculates personality accuracy
     * @param personality The personality insights to validate
     * @param expertPersonality The expert personality insights
     * @returns number The accuracy (0-1)
     */
    private calculatePersonalityAccuracy(
        personality: Record<string, number> | undefined,
        expertPersonality: Record<string, number>
    ): number {
        if (!personality) {
            return 0;
        }
        
        // Calculate the mean absolute error
        let totalError = 0;
        let count = 0;
        
        for (const [trait, expertValue] of Object.entries(expertPersonality)) {
            if (personality[trait] !== undefined) {
                // Calculate absolute error
                const error = Math.abs(personality[trait] - expertValue);
                
                totalError += error;
                count++;
            }
        }
        
        if (count === 0) {
            return 0;
        }
        
        // Calculate mean absolute error
        const meanAbsoluteError = totalError / count;
        
        // Convert to accuracy (1 - error)
        return 1 - meanAbsoluteError;
    }
    
    /**
     * Finds discrepancies between the analysis result and expert rating
     * @param result The analysis result
     * @param expertRating The expert rating
     * @returns Discrepancy[] The discrepancies
     */
    private findDiscrepancies(result: AnalysisResult, expertRating: ExpertRating): Discrepancy[] {
        const discrepancies: Discrepancy[] = [];
        
        // Check emotions
        if (result.emotions) {
            for (const [emotion, expertValue] of Object.entries(expertRating.emotions)) {
                if (emotion !== 'sentiment' && result.emotions[emotion] !== undefined) {
                    // Normalize values to 0-1 range
                    const normalizedValue = result.emotions[emotion] / 10;
                    const normalizedExpertValue = expertValue / 10;
                    
                    // Calculate absolute error
                    const error = Math.abs(normalizedValue - normalizedExpertValue);
                    
                    // If error is significant, add discrepancy
                    if (error > 0.2) {
                        discrepancies.push({
                            type: 'emotion',
                            name: emotion,
                            aiValue: result.emotions[emotion],
                            expertValue,
                            error
                        });
                    }
                }
            }
        }
        
        // Check personality
        if (result.personalityInsights) {
            for (const [trait, expertValue] of Object.entries(expertRating.personality)) {
                if (result.personalityInsights[trait] !== undefined) {
                    // Calculate absolute error
                    const error = Math.abs(result.personalityInsights[trait] - expertValue);
                    
                    // If error is significant, add discrepancy
                    if (error > 0.2) {
                        discrepancies.push({
                            type: 'personality',
                            name: trait,
                            aiValue: result.personalityInsights[trait],
                            expertValue,
                            error
                        });
                    }
                }
            }
        }
        
        return discrepancies;
    }
    
    /**
     * Generates recommendations based on discrepancies
     * @param result The analysis result
     * @param expertRating The expert rating
     * @returns string[] The recommendations
     */
    private generateRecommendations(result: AnalysisResult, expertRating: ExpertRating): string[] {
        const recommendations: string[] = [];
        
        // Find discrepancies
        const discrepancies = this.findDiscrepancies(result, expertRating);
        
        // Generate recommendations based on discrepancies
        if (discrepancies.length > 0) {
            // Group discrepancies by type
            const emotionDiscrepancies = discrepancies.filter(d => d.type === 'emotion');
            const personalityDiscrepancies = discrepancies.filter(d => d.type === 'personality');
            
            // Add recommendations for emotion discrepancies
            if (emotionDiscrepancies.length > 0) {
                const emotionNames = emotionDiscrepancies.map(d => d.name).join(', ');
                recommendations.push(`Improve emotion detection for: ${emotionNames}`);
            }
            
            // Add recommendations for personality discrepancies
            if (personalityDiscrepancies.length > 0) {
                const traitNames = personalityDiscrepancies.map(d => d.name).join(', ');
                recommendations.push(`Improve personality assessment for: ${traitNames}`);
            }
            
            // Add general recommendations
            if (discrepancies.length > 3) {
                recommendations.push('Consider refining the overall analysis algorithm');
            }
        }
        
        return recommendations;
    }
    
    /**
     * Gets validation study results
     * @param studyId The study ID
     * @returns Promise<ValidationStudyResults> The validation study results
     */
    public async getValidationStudyResults(studyId: string): Promise<ValidationStudyResults> {
        try {
            // Find the validation study
            const study = this.validationStudies.find(s => s.id === studyId);
            
            if (!study) {
                throw new Error(`Validation study not found: ${studyId}`);
            }
            
            return study.results;
        } catch (error) {
            console.error('[ResearchModule] Error getting validation study results:', error);
            throw new Error(`Failed to get validation study results: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Gets all validation studies
     * @returns Promise<ValidationStudy[]> The validation studies
     */
    public async getValidationStudies(): Promise<ValidationStudy[]> {
        return this.validationStudies;
    }
    
    /**
     * Updates the research module settings
     * @param settings The new settings
     */
    public updateSettings(settings: ResearchModuleSettings): void {
        const dataCollectionEnabledChanged = this.dataCollectionEnabled !== settings.dataCollectionEnabled;
        
        this.settings = settings;
        this.dataCollectionEnabled = settings.dataCollectionEnabled;
        
        // If data collection was enabled, export any pending data
        if (dataCollectionEnabledChanged && this.dataCollectionEnabled && this.anonymizedData.length > 0) {
            this.exportAnonymizedData();
        }
    }
    
    /**
     * Generates a research report
     * @param studyId The study ID
     * @returns Promise<string> The research report in markdown format
     */
    public async generateResearchReport(studyId: string): Promise<string> {
        try {
            // Find the validation study
            const study = this.validationStudies.find(s => s.id === studyId);
            
            if (!study) {
                throw new Error(`Validation study not found: ${studyId}`);
            }
            
            // Generate report
            return `# Deleometer Validation Study Report

## Study Information

- **Name**: ${study.name}
- **Description**: ${study.description}
- **Created**: ${new Date(study.createdAt).toLocaleDateString()}
- **Status**: ${study.status}

## Validation Criteria

- **Minimum Accuracy**: ${study.validationCriteria.minimumAccuracy * 100}%
- **Sample Size**: ${study.validationCriteria.sampleSize}
- **Expert Raters**: ${study.validationCriteria.expertRaters}

## Results

### Overall Statistics

- **Total Entries**: ${study.results.totalEntries}
- **Validated Entries**: ${study.results.validatedEntries}
- **Overall Accuracy**: ${(study.results.accuracy.overall * 100).toFixed(2)}%

### Accuracy by Category

- **Emotion Detection**: ${(study.results.accuracy.emotions * 100).toFixed(2)}%
- **Personality Assessment**: ${(study.results.accuracy.personality * 100).toFixed(2)}%

### Recommendations

${study.results.recommendations.map(r => `- ${r}`).join('\n')}

## Conclusion

${this.generateConclusion(study)}

## Next Steps

${this.generateNextSteps(study)}
`;
        } catch (error) {
            console.error('[ResearchModule] Error generating research report:', error);
            throw new Error(`Failed to generate research report: ${error.message || 'Unknown error'}`);
        }
    }
    
    /**
     * Generates a conclusion for a research report
     * @param study The validation study
     * @returns string The conclusion
     */
    private generateConclusion(study: ValidationStudy): string {
        const { accuracy, totalEntries, validatedEntries } = study.results;
        const { minimumAccuracy } = study.validationCriteria;
        
        if (accuracy.overall >= minimumAccuracy) {
            return `The Deleometer analysis system has met the minimum accuracy threshold of ${minimumAccuracy * 100}% with an overall accuracy of ${(accuracy.overall * 100).toFixed(2)}%. The system demonstrates strong performance in ${accuracy.emotions > accuracy.personality ? 'emotion detection' : 'personality assessment'}.`;
        } else {
            return `The Deleometer analysis system has not yet met the minimum accuracy threshold of ${minimumAccuracy * 100}%, with a current overall accuracy of ${(accuracy.overall * 100).toFixed(2)}%. Further refinement is needed, particularly in ${accuracy.emotions < accuracy.personality ? 'emotion detection' : 'personality assessment'}.`;
        }
    }
    
    /**
     * Generates next steps for a research report
     * @param study The validation study
     * @returns string The next steps
     */
    private generateNextSteps(study: ValidationStudy): string {
        const { accuracy, totalEntries, validatedEntries, recommendations } = study.results;
        const { minimumAccuracy, sampleSize } = study.validationCriteria;
        
        const steps = [];
        
        // Check if we need more samples
        if (validatedEntries < sampleSize) {
            steps.push(`Collect additional samples (${validatedEntries}/${sampleSize} collected so far)`);
        }
        
        // Check if we need to improve accuracy
        if (accuracy.overall < minimumAccuracy) {
            steps.push(`Improve overall accuracy from ${(accuracy.overall * 100).toFixed(2)}% to at least ${minimumAccuracy * 100}%`);
            
            // Add specific improvement areas
            if (accuracy.emotions < minimumAccuracy) {
                steps.push(`Enhance emotion detection algorithms`);
            }
            
            if (accuracy.personality < minimumAccuracy) {
                steps.push(`Refine personality assessment methods`);
            }
        }
        
        // Add recommendations
        if (recommendations.length > 0) {
            steps.push(`Address specific recommendations from the validation study`);
        }
        
        // If everything looks good
        if (steps.length === 0) {
            steps.push(`Proceed to the next phase of validation with a larger sample size`);
            steps.push(`Consider publishing the validation results`);
        }
        
        return steps.map(s => `1. ${s}`).join('\n');
    }
}

/**
 * Research module settings
 */
export interface ResearchModuleSettings {
    dataCollectionEnabled: boolean;
    exportBatchSize: number;
}

/**
 * Anonymized entry
 */
interface AnonymizedEntry {
    id: string;
    timestamp: string;
    emotionDistribution: Record<string, number>;
    personalityDistribution: Record<string, number>;
    metadata: Record<string, any>;
}

/**
 * Validation study
 */
export interface ValidationStudy {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    status: 'active' | 'completed' | 'abandoned';
    validationCriteria: ValidationCriteria;
    results: ValidationStudyResults;
}

/**
 * Validation criteria
 */
export interface ValidationCriteria {
    minimumAccuracy: number;
    sampleSize: number;
    expertRaters: number;
}

/**
 * Validation study results
 */
export interface ValidationStudyResults {
    totalEntries: number;
    validatedEntries: number;
    accuracy: {
        emotions: number;
        personality: number;
        overall: number;
    };
    recommendations: string[];
}

/**
 * Expert rating
 */
export interface ExpertRating {
    emotions: Record<string, number>;
    personality: Record<string, number>;
    notes: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
    studyId: string;
    timestamp: string;
    accuracy: {
        emotions: number;
        personality: number;
        overall: number;
    };
    discrepancies: Discrepancy[];
    recommendations: string[];
}

/**
 * Discrepancy
 */
export interface Discrepancy {
    type: 'emotion' | 'personality';
    name: string;
    aiValue: number;
    expertValue: number;
    error: number;
}
