/**
 * User Profile System for Deleometer
 * Tracks user patterns over time and enables personalized analysis
 */

import { App, TFile } from 'obsidian';
import { AnalysisResult } from './types';

/**
 * User Profile interface
 */
export interface UserProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  
  // Emotional baseline (average emotional states)
  emotionalBaseline: Record<string, number>;
  
  // Personality baseline
  personalityBaseline: Record<string, number>;
  
  // Common themes and topics
  commonThemes: string[];
  
  // Recurring patterns
  recurringPatterns: RecurringPattern[];
  
  // Edge cases detected
  edgeCases: EdgeCase[];
  
  // Analysis history (references to analysis results)
  analysisHistory: string[]; // IDs or dates of analyses
  
  // User preferences for analysis
  analysisPreferences: {
    detailLevel: 'basic' | 'detailed' | 'comprehensive';
    focusAreas: ('emotions' | 'patterns' | 'unconscious' | 'desires' | 'rhizomes')[];
    theoreticalFrameworks: ('freudian' | 'lacanian' | 'deleuzian')[];
  };
  
  // Feedback history
  feedbackHistory: FeedbackEntry[];
}

/**
 * Recurring Pattern interface
 */
export interface RecurringPattern {
  id: string;
  name: string;
  description: string;
  occurrences: number;
  firstDetectedAt: string;
  lastDetectedAt: string;
  associatedEmotions: Record<string, number>;
  theoreticalFramework: 'freudian' | 'lacanian' | 'deleuzian' | 'multiple';
  theoreticalConcepts: string[];
}

/**
 * Edge Case interface
 */
export interface EdgeCase {
  id: string;
  description: string;
  detectedAt: string;
  context: string;
  resolution: string;
  theoreticalFramework: 'freudian' | 'lacanian' | 'deleuzian' | 'multiple';
  theoreticalConcepts: string[];
}

/**
 * Feedback Entry interface
 */
export interface FeedbackEntry {
  id: string;
  analysisId: string;
  timestamp: string;
  rating: number; // 1-5
  comments: string;
  helpful: boolean;
  insightful: boolean;
  accurate: boolean;
}

/**
 * User Profile System class
 */
export class UserProfileSystem {
  private app: App;
  private userProfile: UserProfile | null = null;
  private profilePath: string = 'deleometer_user_profile.json';
  
  constructor(app: App) {
    this.app = app;
  }
  
  /**
   * Initializes the user profile system
   */
  public async initialize(): Promise<void> {
    try {
      await this.loadUserProfile();
    } catch (error) {
      console.error('Error initializing user profile system:', error);
      // Create a new profile if one doesn't exist
      await this.createNewProfile();
    }
  }
  
  /**
   * Loads the user profile from disk
   */
  private async loadUserProfile(): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(this.profilePath);
    
    if (file instanceof TFile) {
      const content = await this.app.vault.read(file);
      this.userProfile = JSON.parse(content);
      console.log('User profile loaded');
    } else {
      throw new Error('User profile not found');
    }
  }
  
  /**
   * Creates a new user profile
   */
  private async createNewProfile(): Promise<void> {
    this.userProfile = {
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emotionalBaseline: {
        joy: 5,
        sadness: 5,
        anger: 5,
        fear: 5,
        surprise: 5,
        sentiment: 0
      },
      personalityBaseline: {
        openness: 0.5,
        conscientiousness: 0.5,
        extraversion: 0.5,
        agreeableness: 0.5,
        neuroticism: 0.5
      },
      commonThemes: [],
      recurringPatterns: [],
      edgeCases: [],
      analysisHistory: [],
      analysisPreferences: {
        detailLevel: 'detailed',
        focusAreas: ['emotions', 'patterns', 'unconscious'],
        theoreticalFrameworks: ['freudian', 'lacanian', 'deleuzian']
      },
      feedbackHistory: []
    };
    
    await this.saveUserProfile();
    console.log('New user profile created');
  }
  
  /**
   * Saves the user profile to disk
   */
  private async saveUserProfile(): Promise<void> {
    if (!this.userProfile) {
      throw new Error('No user profile to save');
    }
    
    this.userProfile.updatedAt = new Date().toISOString();
    
    const content = JSON.stringify(this.userProfile, null, 2);
    
    const file = this.app.vault.getAbstractFileByPath(this.profilePath);
    
    if (file instanceof TFile) {
      await this.app.vault.modify(file, content);
    } else {
      await this.app.vault.create(this.profilePath, content);
    }
    
    console.log('User profile saved');
  }
  
  /**
   * Gets the user profile
   */
  public getUserProfile(): UserProfile | null {
    return this.userProfile;
  }
  
  /**
   * Updates the user profile with a new analysis result
   * @param result The analysis result
   */
  public async updateWithAnalysisResult(result: AnalysisResult): Promise<void> {
    if (!this.userProfile) {
      throw new Error('User profile not initialized');
    }
    
    // Update emotional baseline
    if (result.emotions) {
      for (const [emotion, value] of Object.entries(result.emotions)) {
        if (typeof value === 'number') {
          if (this.userProfile.emotionalBaseline[emotion] === undefined) {
            this.userProfile.emotionalBaseline[emotion] = value;
          } else {
            // Weighted average (90% old, 10% new)
            this.userProfile.emotionalBaseline[emotion] = 
              this.userProfile.emotionalBaseline[emotion] * 0.9 + value * 0.1;
          }
        }
      }
    }
    
    // Update personality baseline
    if (result.personalityInsights) {
      for (const [trait, value] of Object.entries(result.personalityInsights)) {
        if (typeof value === 'number') {
          if (this.userProfile.personalityBaseline[trait] === undefined) {
            this.userProfile.personalityBaseline[trait] = value;
          } else {
            // Weighted average (90% old, 10% new)
            this.userProfile.personalityBaseline[trait] = 
              this.userProfile.personalityBaseline[trait] * 0.9 + value * 0.1;
          }
        }
      }
    }
    
    // Add to analysis history
    this.userProfile.analysisHistory.push(result.date);
    
    // Detect and update themes
    if (result.detectedThemes) {
      for (const theme of result.detectedThemes) {
        if (!this.userProfile.commonThemes.includes(theme)) {
          this.userProfile.commonThemes.push(theme);
        }
      }
    }
    
    // Detect and update patterns
    if (result.detectedPatterns) {
      for (const pattern of result.detectedPatterns) {
        const existingPattern = this.userProfile.recurringPatterns.find(p => p.id === pattern.id);
        
        if (existingPattern) {
          // Update existing pattern
          existingPattern.occurrences += 1;
          existingPattern.lastDetectedAt = result.date;
          
          // Update associated emotions
          if (pattern.associatedEmotions) {
            for (const [emotion, value] of Object.entries(pattern.associatedEmotions)) {
              if (typeof value === 'number') {
                if (existingPattern.associatedEmotions[emotion] === undefined) {
                  existingPattern.associatedEmotions[emotion] = value;
                } else {
                  // Weighted average (90% old, 10% new)
                  existingPattern.associatedEmotions[emotion] = 
                    existingPattern.associatedEmotions[emotion] * 0.9 + value * 0.1;
                }
              }
            }
          }
        } else {
          // Add new pattern
          this.userProfile.recurringPatterns.push({
            id: pattern.id,
            name: pattern.name,
            description: pattern.description,
            occurrences: 1,
            firstDetectedAt: result.date,
            lastDetectedAt: result.date,
            associatedEmotions: pattern.associatedEmotions || {},
            theoreticalFramework: pattern.theoreticalFramework || 'multiple',
            theoreticalConcepts: pattern.theoreticalConcepts || []
          });
        }
      }
    }
    
    // Detect and update edge cases
    if (result.detectedEdgeCases) {
      for (const edgeCase of result.detectedEdgeCases) {
        this.userProfile.edgeCases.push({
          id: `edge_${Date.now()}_${this.userProfile.edgeCases.length}`,
          description: edgeCase.description,
          detectedAt: result.date,
          context: edgeCase.context || '',
          resolution: edgeCase.resolution || '',
          theoreticalFramework: edgeCase.theoreticalFramework || 'multiple',
          theoreticalConcepts: edgeCase.theoreticalConcepts || []
        });
      }
    }
    
    await this.saveUserProfile();
  }
  
  /**
   * Adds user feedback for an analysis
   * @param analysisId The analysis ID
   * @param feedback The feedback
   */
  public async addFeedback(analysisId: string, feedback: Omit<FeedbackEntry, 'id' | 'analysisId' | 'timestamp'>): Promise<void> {
    if (!this.userProfile) {
      throw new Error('User profile not initialized');
    }
    
    this.userProfile.feedbackHistory.push({
      id: `feedback_${Date.now()}`,
      analysisId,
      timestamp: new Date().toISOString(),
      ...feedback
    });
    
    await this.saveUserProfile();
  }
  
  /**
   * Gets analysis preferences for the current user
   */
  public getAnalysisPreferences(): UserProfile['analysisPreferences'] | null {
    if (!this.userProfile) {
      return null;
    }
    
    return this.userProfile.analysisPreferences;
  }
  
  /**
   * Updates analysis preferences
   * @param preferences The new preferences
   */
  public async updateAnalysisPreferences(preferences: Partial<UserProfile['analysisPreferences']>): Promise<void> {
    if (!this.userProfile) {
      throw new Error('User profile not initialized');
    }
    
    this.userProfile.analysisPreferences = {
      ...this.userProfile.analysisPreferences,
      ...preferences
    };
    
    await this.saveUserProfile();
  }
  
  /**
   * Gets recurring patterns for the user
   */
  public getRecurringPatterns(): RecurringPattern[] {
    if (!this.userProfile) {
      return [];
    }
    
    return this.userProfile.recurringPatterns;
  }
  
  /**
   * Gets edge cases for the user
   */
  public getEdgeCases(): EdgeCase[] {
    if (!this.userProfile) {
      return [];
    }
    
    return this.userProfile.edgeCases;
  }
  
  /**
   * Gets common themes for the user
   */
  public getCommonThemes(): string[] {
    if (!this.userProfile) {
      return [];
    }
    
    return this.userProfile.commonThemes;
  }
  
  /**
   * Gets emotional baseline for the user
   */
  public getEmotionalBaseline(): Record<string, number> {
    if (!this.userProfile) {
      return {};
    }
    
    return this.userProfile.emotionalBaseline;
  }
  
  /**
   * Gets personality baseline for the user
   */
  public getPersonalityBaseline(): Record<string, number> {
    if (!this.userProfile) {
      return {};
    }
    
    return this.userProfile.personalityBaseline;
  }
}
