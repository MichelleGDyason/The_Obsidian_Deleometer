/**
 * Adaptive Learning System for Deleometer
 * Improves analysis over time based on user feedback and patterns
 */

import { App } from 'obsidian';
import { UserProfileSystem, UserProfile, FeedbackEntry } from './userProfileSystem';
import { EnhancedAnalysisResult } from './enhancedAnalysisFrameworks';
import { ApiService } from './apiService';

/**
 * Learning Strategy interface
 */
export interface LearningStrategy {
  id: string;
  name: string;
  description: string;
  weight: number;
  lastUpdated: string;
  parameters: Record<string, any>;
}

/**
 * Adaptive Learning System class
 */
export class AdaptiveLearningSystem {
  private app: App;
  private userProfileSystem: UserProfileSystem;
  private apiService: ApiService;
  private learningStrategies: LearningStrategy[] = [];
  
  constructor(app: App, userProfileSystem: UserProfileSystem, apiService: ApiService) {
    this.app = app;
    this.userProfileSystem = userProfileSystem;
    this.apiService = apiService;
    
    // Initialize learning strategies
    this.initializeLearningStrategies();
  }
  
  /**
   * Initializes learning strategies
   */
  private initializeLearningStrategies(): void {
    this.learningStrategies = [
      {
        id: 'feedback_based',
        name: 'Feedback-Based Learning',
        description: 'Adjusts analysis based on user feedback',
        weight: 1.0,
        lastUpdated: new Date().toISOString(),
        parameters: {
          feedbackWeight: 0.8,
          minFeedbackSamples: 3,
          learningRate: 0.1
        }
      },
      {
        id: 'pattern_recognition',
        name: 'Pattern Recognition',
        description: 'Identifies and learns from recurring patterns',
        weight: 0.8,
        lastUpdated: new Date().toISOString(),
        parameters: {
          patternThreshold: 3,
          patternConfidence: 0.7,
          maxPatterns: 10
        }
      },
      {
        id: 'edge_case_adaptation',
        name: 'Edge Case Adaptation',
        description: 'Adapts to unusual or edge cases',
        weight: 0.6,
        lastUpdated: new Date().toISOString(),
        parameters: {
          edgeCaseThreshold: 0.9,
          adaptationRate: 0.2,
          maxEdgeCases: 5
        }
      },
      {
        id: 'theoretical_framework_optimization',
        name: 'Theoretical Framework Optimization',
        description: 'Optimizes the use of theoretical frameworks based on effectiveness',
        weight: 0.7,
        lastUpdated: new Date().toISOString(),
        parameters: {
          frameworkWeights: {
            freudian: 1.0,
            lacanian: 1.0,
            deleuzian: 1.0
          },
          optimizationRate: 0.05,
          minSamplesPerFramework: 5
        }
      }
    ];
  }
  
  /**
   * Processes feedback to improve future analyses
   * @param analysisId The analysis ID
   * @param feedback The feedback
   * @param userProfile The user profile
   */
  public async processFeedback(analysisId: string, feedback: Omit<FeedbackEntry, 'id' | 'analysisId' | 'timestamp'>, userProfile: UserProfile): Promise<void> {
    console.log(`[AdaptiveLearningSystem] Processing feedback for analysis ${analysisId}`);
    
    // Apply feedback-based learning
    await this.applyFeedbackBasedLearning(feedback, userProfile);
    
    // Update learning strategy weights based on feedback
    this.updateLearningStrategyWeights(feedback);
    
    console.log(`[AdaptiveLearningSystem] Feedback processed`);
  }
  
  /**
   * Applies feedback-based learning
   * @param feedback The feedback
   * @param userProfile The user profile
   */
  private async applyFeedbackBasedLearning(feedback: Omit<FeedbackEntry, 'id' | 'analysisId' | 'timestamp'>, userProfile: UserProfile): Promise<void> {
    const feedbackStrategy = this.learningStrategies.find(s => s.id === 'feedback_based');
    
    if (!feedbackStrategy) {
      return;
    }
    
    // Get all feedback
    const allFeedback = userProfile.feedbackHistory;
    
    if (allFeedback.length < feedbackStrategy.parameters.minFeedbackSamples) {
      console.log(`[AdaptiveLearningSystem] Not enough feedback samples (${allFeedback.length}/${feedbackStrategy.parameters.minFeedbackSamples})`);
      return;
    }
    
    // Calculate average ratings
    const averageRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
    const helpfulRatio = allFeedback.filter(f => f.helpful).length / allFeedback.length;
    const insightfulRatio = allFeedback.filter(f => f.insightful).length / allFeedback.length;
    const accurateRatio = allFeedback.filter(f => f.accurate).length / allFeedback.length;
    
    console.log(`[AdaptiveLearningSystem] Feedback metrics: Rating=${averageRating.toFixed(2)}, Helpful=${helpfulRatio.toFixed(2)}, Insightful=${insightfulRatio.toFixed(2)}, Accurate=${accurateRatio.toFixed(2)}`);
    
    // Adjust analysis preferences based on feedback
    const preferences = userProfile.analysisPreferences;
    
    // If accuracy is low, increase detail level
    if (accurateRatio < 0.6 && preferences.detailLevel !== 'comprehensive') {
      if (preferences.detailLevel === 'basic') {
        preferences.detailLevel = 'detailed';
      } else if (preferences.detailLevel === 'detailed') {
        preferences.detailLevel = 'comprehensive';
      }
    }
    
    // If helpfulness is low, adjust focus areas
    if (helpfulRatio < 0.6) {
      // Add missing focus areas
      const allFocusAreas: ('emotions' | 'patterns' | 'unconscious' | 'desires' | 'rhizomes')[] = ['emotions', 'patterns', 'unconscious', 'desires', 'rhizomes'];
      
      for (const area of allFocusAreas) {
        if (!preferences.focusAreas.includes(area)) {
          preferences.focusAreas.push(area);
        }
      }
    }
    
    // Update preferences
    await this.userProfileSystem.updateAnalysisPreferences(preferences);
  }
  
  /**
   * Updates learning strategy weights based on feedback
   * @param feedback The feedback
   */
  private updateLearningStrategyWeights(feedback: Omit<FeedbackEntry, 'id' | 'analysisId' | 'timestamp'>): void {
    // Normalize weights
    const totalWeight = this.learningStrategies.reduce((sum, s) => sum + s.weight, 0);
    
    for (const strategy of this.learningStrategies) {
      strategy.weight = strategy.weight / totalWeight;
    }
    
    // Adjust weights based on feedback
    const feedbackQuality = (feedback.rating / 5 + (feedback.helpful ? 1 : 0) + (feedback.insightful ? 1 : 0) + (feedback.accurate ? 1 : 0)) / 4;
    
    // If feedback is good, increase weights of active strategies
    // If feedback is poor, decrease weights of active strategies
    const adjustment = (feedbackQuality - 0.5) * 0.1;
    
    for (const strategy of this.learningStrategies) {
      strategy.weight = Math.max(0.1, Math.min(1.0, strategy.weight + adjustment));
      strategy.lastUpdated = new Date().toISOString();
    }
    
    // Normalize weights again
    const newTotalWeight = this.learningStrategies.reduce((sum, s) => sum + s.weight, 0);
    
    for (const strategy of this.learningStrategies) {
      strategy.weight = strategy.weight / newTotalWeight;
    }
  }
  
  /**
   * Enhances an analysis result using adaptive learning
   * @param result The analysis result
   * @param userProfile The user profile
   * @returns Promise<EnhancedAnalysisResult> The enhanced result
   */
  public async enhanceAnalysisResult(result: EnhancedAnalysisResult, userProfile: UserProfile): Promise<EnhancedAnalysisResult> {
    console.log(`[AdaptiveLearningSystem] Enhancing analysis result`);
    
    // Apply pattern recognition
    await this.applyPatternRecognition(result, userProfile);
    
    // Apply edge case adaptation
    await this.applyEdgeCaseAdaptation(result, userProfile);
    
    // Apply theoretical framework optimization
    await this.applyTheoreticalFrameworkOptimization(result, userProfile);
    
    console.log(`[AdaptiveLearningSystem] Analysis result enhanced`);
    
    return result;
  }
  
  /**
   * Applies pattern recognition to enhance analysis
   * @param result The analysis result
   * @param userProfile The user profile
   */
  private async applyPatternRecognition(result: EnhancedAnalysisResult, userProfile: UserProfile): Promise<void> {
    const patternStrategy = this.learningStrategies.find(s => s.id === 'pattern_recognition');
    
    if (!patternStrategy) {
      return;
    }
    
    // Get recurring patterns
    const recurringPatterns = userProfile.recurringPatterns;
    
    if (recurringPatterns.length === 0) {
      return;
    }
    
    // Check if any recurring patterns are present in the current analysis
    for (const pattern of recurringPatterns) {
      if (pattern.occurrences >= patternStrategy.parameters.patternThreshold) {
        // Check if this pattern is already detected
        const isDetected = result.detectedPatterns.some(p => p.name === pattern.name);
        
        if (!isDetected) {
          // Check if the pattern might be present in the current analysis
          // This would normally involve more sophisticated pattern matching
          // For now, we'll use a simple check based on theoretical concepts
          
          const patternConcepts = pattern.theoreticalConcepts;
          
          let conceptsPresent = 0;
          
          // Check Freudian concepts
          if (pattern.theoreticalFramework === 'freudian' || pattern.theoreticalFramework === 'multiple') {
            for (const concept of patternConcepts) {
              if (result.freudianAnalysis.interpretation.includes(concept)) {
                conceptsPresent++;
              }
            }
          }
          
          // Check Lacanian concepts
          if (pattern.theoreticalFramework === 'lacanian' || pattern.theoreticalFramework === 'multiple') {
            for (const concept of patternConcepts) {
              if (result.lacanianAnalysis.symbolicOrder.includes(concept) || 
                  result.lacanianAnalysis.imaginaryOrder.includes(concept) ||
                  result.lacanianAnalysis.realOrder.includes(concept)) {
                conceptsPresent++;
              }
            }
          }
          
          // Check Deleuzian concepts
          if (pattern.theoreticalFramework === 'deleuzian' || pattern.theoreticalFramework === 'multiple') {
            for (const concept of patternConcepts) {
              if (result.deleuzianAnalysis.rhizomaticPatterns.includes(concept) ||
                  result.deleuzianAnalysis.deterritorialization.includes(concept) ||
                  result.deleuzianAnalysis.reterritorialization.includes(concept)) {
                conceptsPresent++;
              }
            }
          }
          
          // If enough concepts are present, add the pattern
          const confidence = conceptsPresent / patternConcepts.length;
          
          if (confidence >= patternStrategy.parameters.patternConfidence) {
            result.detectedPatterns.push({
              id: pattern.id,
              name: pattern.name,
              description: pattern.description,
              theoreticalFramework: pattern.theoreticalFramework,
              theoreticalConcepts: pattern.theoreticalConcepts
            });
            
            // Add to personalized insights
            result.personalizedInsights += `\n\nI've noticed a recurring pattern in your entries: ${pattern.name}. ${pattern.description}`;
          }
        }
      }
    }
    
    // Limit the number of detected patterns
    if (result.detectedPatterns.length > patternStrategy.parameters.maxPatterns) {
      result.detectedPatterns = result.detectedPatterns.slice(0, patternStrategy.parameters.maxPatterns);
    }
  }
  
  /**
   * Applies edge case adaptation to enhance analysis
   * @param result The analysis result
   * @param userProfile The user profile
   */
  private async applyEdgeCaseAdaptation(result: EnhancedAnalysisResult, userProfile: UserProfile): Promise<void> {
    const edgeCaseStrategy = this.learningStrategies.find(s => s.id === 'edge_case_adaptation');
    
    if (!edgeCaseStrategy) {
      return;
    }
    
    // Get edge cases
    const edgeCases = userProfile.edgeCases;
    
    if (edgeCases.length === 0) {
      return;
    }
    
    // Check for potential new edge cases
    // This would normally involve more sophisticated anomaly detection
    // For now, we'll use a simple check based on emotional extremes
    
    const emotions = result.emotions;
    const emotionalBaseline = userProfile.emotionalBaseline;
    
    for (const [emotion, value] of Object.entries(emotions)) {
      if (typeof value === 'number' && emotionalBaseline[emotion] !== undefined) {
        const baseline = emotionalBaseline[emotion];
        const deviation = Math.abs(value - baseline);
        
        // If the emotion is significantly different from the baseline
        if (deviation >= edgeCaseStrategy.parameters.edgeCaseThreshold * 10) {
          // Check if this is a new edge case
          const isNewEdgeCase = !edgeCases.some(e => 
            e.description.includes(emotion) && 
            Math.abs(parseFloat(e.description.split(':')[1]) - value) < 2
          );
          
          if (isNewEdgeCase) {
            // Add a new edge case
            const edgeCase: Partial<EdgeCase> = {
              description: `Extreme ${emotion}: ${value}`,
              context: `The ${emotion} level is significantly ${value > baseline ? 'higher' : 'lower'} than your baseline of ${baseline.toFixed(1)}.`,
              resolution: `This could indicate a significant emotional event or shift.`,
              theoreticalFramework: 'multiple',
              theoreticalConcepts: ['emotional extremes', 'affective intensity', 'psychological significance']
            };
            
            result.detectedEdgeCases.push(edgeCase);
            
            // Add to personalized insights
            result.personalizedInsights += `\n\nI've detected an unusual pattern: your ${emotion} level (${value}) is significantly ${value > baseline ? 'higher' : 'lower'} than your typical baseline (${baseline.toFixed(1)}). This might indicate a significant emotional event or shift.`;
          }
        }
      }
    }
    
    // Limit the number of detected edge cases
    if (result.detectedEdgeCases.length > edgeCaseStrategy.parameters.maxEdgeCases) {
      result.detectedEdgeCases = result.detectedEdgeCases.slice(0, edgeCaseStrategy.parameters.maxEdgeCases);
    }
  }
  
  /**
   * Applies theoretical framework optimization to enhance analysis
   * @param result The analysis result
   * @param userProfile The user profile
   */
  private async applyTheoreticalFrameworkOptimization(result: EnhancedAnalysisResult, userProfile: UserProfile): Promise<void> {
    const frameworkStrategy = this.learningStrategies.find(s => s.id === 'theoretical_framework_optimization');
    
    if (!frameworkStrategy) {
      return;
    }
    
    // Get feedback history
    const feedbackHistory = userProfile.feedbackHistory;
    
    if (feedbackHistory.length < frameworkStrategy.parameters.minSamplesPerFramework) {
      return;
    }
    
    // Calculate framework effectiveness based on feedback
    const frameworkFeedback: Record<string, { count: number, rating: number, helpful: number, insightful: number, accurate: number }> = {
      freudian: { count: 0, rating: 0, helpful: 0, insightful: 0, accurate: 0 },
      lacanian: { count: 0, rating: 0, helpful: 0, insightful: 0, accurate: 0 },
      deleuzian: { count: 0, rating: 0, helpful: 0, insightful: 0, accurate: 0 }
    };
    
    // This would normally involve analyzing past analyses to determine which frameworks were used
    // For now, we'll assume equal distribution
    for (const feedback of feedbackHistory) {
      for (const framework of Object.keys(frameworkFeedback)) {
        frameworkFeedback[framework].count++;
        frameworkFeedback[framework].rating += feedback.rating;
        frameworkFeedback[framework].helpful += feedback.helpful ? 1 : 0;
        frameworkFeedback[framework].insightful += feedback.insightful ? 1 : 0;
        frameworkFeedback[framework].accurate += feedback.accurate ? 1 : 0;
      }
    }
    
    // Calculate effectiveness scores
    const frameworkEffectiveness: Record<string, number> = {};
    
    for (const [framework, data] of Object.entries(frameworkFeedback)) {
      if (data.count > 0) {
        const averageRating = data.rating / data.count;
        const helpfulRatio = data.helpful / data.count;
        const insightfulRatio = data.insightful / data.count;
        const accurateRatio = data.accurate / data.count;
        
        frameworkEffectiveness[framework] = (averageRating / 5 + helpfulRatio + insightfulRatio + accurateRatio) / 4;
      }
    }
    
    // Update framework weights
    const frameworkWeights = frameworkStrategy.parameters.frameworkWeights;
    
    for (const [framework, effectiveness] of Object.entries(frameworkEffectiveness)) {
      if (frameworkWeights[framework] !== undefined) {
        // Adjust weight based on effectiveness
        const adjustment = (effectiveness - 0.5) * frameworkStrategy.parameters.optimizationRate;
        frameworkWeights[framework] = Math.max(0.1, Math.min(1.0, frameworkWeights[framework] + adjustment));
      }
    }
    
    // Normalize weights
    const totalWeight = Object.values(frameworkWeights).reduce((sum, w) => sum + w, 0);
    
    for (const framework of Object.keys(frameworkWeights)) {
      frameworkWeights[framework] = frameworkWeights[framework] / totalWeight;
    }
    
    // Apply framework weights to personalized insights
    const freudianWeight = frameworkWeights.freudian;
    const lacanianWeight = frameworkWeights.lacanian;
    const deleuzianWeight = frameworkWeights.deleuzian;
    
    // Add framework-specific insights based on weights
    let frameworkInsights = '\n\nBased on your feedback and preferences, I\'ve tailored this analysis to emphasize:';
    
    if (freudianWeight >= 0.4) {
      frameworkInsights += `\n- Freudian concepts: ${result.freudianAnalysis.interpretation.split('.')[0]}.`;
    }
    
    if (lacanianWeight >= 0.4) {
      frameworkInsights += `\n- Lacanian concepts: ${result.lacanianAnalysis.symbolicOrder.split('.')[0]}.`;
    }
    
    if (deleuzianWeight >= 0.4) {
      frameworkInsights += `\n- Deleuzian concepts: ${result.deleuzianAnalysis.rhizomaticPatterns.split('.')[0]}.`;
    }
    
    result.personalizedInsights += frameworkInsights;
  }
  
  /**
   * Gets learning strategies
   * @returns LearningStrategy[] The learning strategies
   */
  public getLearningStrategies(): LearningStrategy[] {
    return this.learningStrategies;
  }
  
  /**
   * Updates a learning strategy
   * @param strategyId The strategy ID
   * @param updates The updates
   */
  public updateLearningStrategy(strategyId: string, updates: Partial<LearningStrategy>): void {
    const strategy = this.learningStrategies.find(s => s.id === strategyId);
    
    if (!strategy) {
      throw new Error(`Learning strategy with ID ${strategyId} not found`);
    }
    
    // Update strategy
    Object.assign(strategy, updates);
    strategy.lastUpdated = new Date().toISOString();
  }
}
