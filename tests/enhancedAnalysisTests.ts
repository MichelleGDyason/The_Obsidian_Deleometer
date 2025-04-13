import { App, Notice } from 'obsidian';
import { EnhancedAnalysisFrameworks } from '../enhancedAnalysisFrameworks';
import { UserProfileSystem } from '../userProfileSystem';
import { AdaptiveLearningSystem } from '../adaptiveLearningSystem';
import { ApiService } from '../apiService';
import { IrigarayianAnalysis } from '../irigarayianAnalysis';
import { NextStepsRecommendation } from '../nextStepsRecommendation';

/**
 * Tests for the enhanced analysis features
 */
export class EnhancedAnalysisTests {
    private app: App;
    private apiService: ApiService;
    private userProfileSystem: UserProfileSystem;
    private enhancedAnalysisFrameworks: EnhancedAnalysisFrameworks;
    private adaptiveLearningSystem: AdaptiveLearningSystem;
    private irigarayianAnalysis: IrigarayianAnalysis;
    private nextStepsRecommendation: NextStepsRecommendation;

    constructor(app: App, apiService: ApiService) {
        this.app = app;
        this.apiService = apiService;
        this.userProfileSystem = new UserProfileSystem(app);
        this.enhancedAnalysisFrameworks = new EnhancedAnalysisFrameworks(apiService);
        this.adaptiveLearningSystem = new AdaptiveLearningSystem(app, this.userProfileSystem.getUserProfile(), apiService);
        this.irigarayianAnalysis = new IrigarayianAnalysis(apiService);
        this.nextStepsRecommendation = new NextStepsRecommendation(apiService);
    }

    /**
     * Run all enhanced analysis tests
     */
    async runAllTests(): Promise<void> {
        try {
            new Notice('Running enhanced analysis tests...');

            await this.testUserProfileSystem();
            await this.testEnhancedAnalysisFrameworks();
            await this.testAdaptiveLearningSystem();
            await this.testIrigarayianAnalysis();
            await this.testNextStepsRecommendation();

            new Notice('✅ All enhanced analysis tests passed!');
        } catch (error) {
            console.error('Error running enhanced analysis tests:', error);
            new Notice('❌ Enhanced analysis tests failed: ' + error.message);
        }
    }

    /**
     * Test the user profile system
     */
    private async testUserProfileSystem(): Promise<void> {
        try {
            // Initialize the user profile system
            await this.userProfileSystem.initialize();

            // Get the user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Verify the user profile has the expected properties
            if (!userProfile.emotionalBaseline) {
                throw new Error('User profile missing emotionalBaseline');
            }

            if (!userProfile.personalityBaseline) {
                throw new Error('User profile missing personalityBaseline');
            }

            if (!Array.isArray(userProfile.commonThemes)) {
                throw new Error('User profile commonThemes is not an array');
            }

            if (!Array.isArray(userProfile.recurringPatterns)) {
                throw new Error('User profile recurringPatterns is not an array');
            }

            if (!userProfile.preferences) {
                throw new Error('User profile missing preferences');
            }

            // Create a test analysis result
            const testResult = {
                emotions: {
                    joy: 7,
                    sadness: 3,
                    anger: 2,
                    fear: 1,
                    surprise: 4,
                    sentiment: 0.6
                },
                psychoanalyticResponse: 'Test psychoanalytic response',
                personalityInsights: {
                    openness: 0.8,
                    conscientiousness: 0.7,
                    extraversion: 0.6,
                    agreeableness: 0.9,
                    neuroticism: 0.3
                },
                date: new Date().toISOString()
            };

            // Update the user profile with the test result
            await this.userProfileSystem.updateWithAnalysisResult(testResult);

            // Verify the user profile was updated
            const updatedProfile = this.userProfileSystem.getUserProfile();

            if (!updatedProfile.emotionalBaseline.joy) {
                throw new Error('User profile not updated with emotions');
            }

            if (!updatedProfile.personalityBaseline.openness) {
                throw new Error('User profile not updated with personality traits');
            }

            new Notice('✅ User profile system tests passed!');
        } catch (error) {
            console.error('Error testing user profile system:', error);
            throw new Error('User profile system tests failed: ' + error.message);
        }
    }

    /**
     * Test the enhanced analysis frameworks
     */
    private async testEnhancedAnalysisFrameworks(): Promise<void> {
        try {
            // Get the user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Create a test journal entry
            const testEntry = `
                Today I felt a mix of emotions. I was happy about my progress on the project,
                but also anxious about the upcoming deadline. I found myself thinking about
                patterns from my childhood, how I always felt the need to prove myself.

                I'm trying to break free from these old patterns and create new ways of being.
                Sometimes I feel like I'm making progress, other times I feel stuck in the same loops.

                I had a dream last night about being in a maze, trying to find my way out.
                Each time I thought I found the exit, it led to another part of the maze.

                I wonder what this all means for my future and my relationships.
            `;

            // Analyze the test entry
            const result = await this.enhancedAnalysisFrameworks.analyzeText(testEntry, userProfile);

            // Verify the result has the expected properties
            if (!result.emotions) {
                throw new Error('Analysis result missing emotions');
            }

            if (!result.freudianAnalysis) {
                throw new Error('Analysis result missing freudianAnalysis');
            }

            if (!result.lacanianAnalysis) {
                throw new Error('Analysis result missing lacanianAnalysis');
            }

            if (!result.deleuzianAnalysis) {
                throw new Error('Analysis result missing deleuzianAnalysis');
            }

            if (!result.personalizedInsights) {
                throw new Error('Analysis result missing personalizedInsights');
            }

            new Notice('✅ Enhanced analysis frameworks tests passed!');
        } catch (error) {
            console.error('Error testing enhanced analysis frameworks:', error);
            throw new Error('Enhanced analysis frameworks tests failed: ' + error.message);
        }
    }

    /**
     * Test the adaptive learning system
     */
    private async testAdaptiveLearningSystem(): Promise<void> {
        try {
            // Get the user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Create a test analysis result
            const testResult = {
                emotions: {
                    joy: 7,
                    sadness: 3,
                    anger: 2,
                    fear: 1,
                    surprise: 4,
                    sentiment: 0.6
                },
                freudianAnalysis: {
                    interpretation: 'Test Freudian interpretation',
                    idEgoSuperego: {
                        id: 'Test id analysis',
                        ego: 'Test ego analysis',
                        superego: 'Test superego analysis'
                    },
                    defenseMechanisms: ['rationalization', 'projection'],
                    unconsciousDesires: ['recognition', 'freedom'],
                    complexes: ['achievement complex'],
                    transference: 'Test transference analysis',
                    resistance: 'Test resistance analysis'
                },
                lacanianAnalysis: {
                    symbolicOrder: 'Test symbolic order analysis',
                    imaginaryOrder: 'Test imaginary order analysis',
                    realOrder: 'Test real order analysis',
                    desireStructures: 'Test desire structures analysis',
                    signifiers: ['success', 'creativity', 'obligation'],
                    jouissance: 'Test jouissance analysis',
                    lack: 'Test lack analysis',
                    bigOther: 'Test big Other analysis',
                    mirrorStage: 'Test mirror stage analysis'
                },
                deleuzianAnalysis: {
                    rhizomaticPatterns: 'Test rhizomatic patterns analysis',
                    deterritorialization: 'Test deterritorialization analysis',
                    reterritorialization: 'Test reterritorialization analysis',
                    linesOfFlight: ['creative experimentation', 'redefining success'],
                    desireMachines: 'Test desire-machines analysis',
                    bodyWithoutOrgans: 'Test body without organs analysis',
                    multiplicity: 'Test multiplicity analysis',
                    nomadism: 'Test nomadism analysis',
                    smoothStriated: 'Test smooth/striated spaces analysis'
                },
                personalizedInsights: 'Test personalized insights',
                date: new Date().toISOString(),
                detailLevel: 'detailed' as 'basic' | 'detailed' | 'comprehensive',
                frameworks: ['freudian', 'lacanian', 'deleuzian'] as ('freudian' | 'lacanian' | 'deleuzian' | 'irigarayian')[]
            };

            // Apply adaptive learning
            await this.adaptiveLearningSystem.enhanceAnalysisResult(testResult, userProfile);

            // Verify the result was enhanced
            if (!testResult.personalizedInsights.includes('Pattern Recognition') &&
                !testResult.personalizedInsights.includes('Edge Case Adaptation') &&
                !testResult.personalizedInsights.includes('Framework Optimization')) {
                throw new Error('Adaptive learning did not enhance the analysis result');
            }

            new Notice('✅ Adaptive learning system tests passed!');
        } catch (error) {
            console.error('Error testing adaptive learning system:', error);
            throw new Error('Adaptive learning system tests failed: ' + error.message);
        }
    }

    /**
     * Test the Irigarayian analysis
     */
    private async testIrigarayianAnalysis(): Promise<void> {
        try {
            // Get the user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Create a test journal entry
            const testEntry = `
                Today I found myself reflecting on the fluid nature of my identity and how it shifts
                in different contexts. I notice that I express myself differently depending on who I'm with,
                yet there's something consistent beneath these variations. I'm curious about the spaces
                between defined roles and categories, and how meaning emerges from relationship rather than
                fixed definitions. My body seems to know things my mind hasn't yet articulated.
            `;

            // Analyze the test entry
            const result = await this.irigarayianAnalysis.analyzeText(testEntry, userProfile);

            // Verify the result has the expected properties
            if (!result.interpretation) {
                throw new Error('Irigarayian analysis result missing interpretation');
            }

            if (!result.sexualDifference || !result.sexualDifference.feminineSpeaking) {
                throw new Error('Irigarayian analysis result missing sexualDifference.feminineSpeaking');
            }

            if (!result.feminineSubjectivity || !result.feminineSubjectivity.fluidIdentity) {
                throw new Error('Irigarayian analysis result missing feminineSubjectivity.fluidIdentity');
            }

            if (!result.languageAndDiscourse || !result.languageAndDiscourse.speakingAsWoman) {
                throw new Error('Irigarayian analysis result missing languageAndDiscourse.speakingAsWoman');
            }

            if (!result.ethicsOfDifference || !result.ethicsOfDifference.intersubjectivity) {
                throw new Error('Irigarayian analysis result missing ethicsOfDifference.intersubjectivity');
            }

            if (!Array.isArray(result.keyConcepts) || result.keyConcepts.length === 0) {
                throw new Error('Irigarayian analysis result missing keyConcepts array');
            }

            if (!Array.isArray(result.thoughtPatterns) || result.thoughtPatterns.length === 0) {
                throw new Error('Irigarayian analysis result missing thoughtPatterns array');
            }

            new Notice('✅ Irigarayian analysis tests passed!');
        } catch (error) {
            console.error('Error testing Irigarayian analysis:', error);
            throw new Error('Irigarayian analysis tests failed: ' + error.message);
        }
    }

    /**
     * Test the next steps recommendation
     */
    private async testNextStepsRecommendation(): Promise<void> {
        try {
            // Get the user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Create a test journal entry
            const testEntry = `
                I've been feeling stuck lately in my creative projects. I want to make more time for them,
                but work and other responsibilities keep getting in the way. I know that when I'm creating,
                I feel most alive and connected to myself. I need to find a better balance and maybe connect
                with others who share similar interests. I wonder what practical steps I could take to move
                forward without neglecting my other responsibilities.
            `;

            // Create a test enhanced analysis result
            const enhancedResult = {
                emotions: {
                    joy: 4,
                    sadness: 6,
                    anger: 3,
                    fear: 2,
                    surprise: 1,
                    sentiment: 0.3
                },
                freudianAnalysis: {
                    interpretation: 'Test Freudian interpretation',
                    idEgoSuperego: {
                        id: 'Desires creative expression',
                        ego: 'Balancing responsibilities',
                        superego: 'Feeling obligated to prioritize work'
                    },
                    defenseMechanisms: ['rationalization'],
                    unconsciousDesires: ['freedom', 'recognition'],
                    complexes: ['achievement complex'],
                    transference: 'Test transference analysis',
                    resistance: 'Test resistance analysis'
                },
                lacanianAnalysis: {
                    symbolicOrder: 'Test symbolic order analysis',
                    imaginaryOrder: 'Test imaginary order analysis',
                    realOrder: 'Test real order analysis',
                    desireStructures: 'Test desire structures analysis',
                    signifiers: ['stuck', 'balance', 'alive'],
                    jouissance: 'Test jouissance analysis',
                    lack: 'Test lack analysis',
                    bigOther: 'Test big Other analysis',
                    mirrorStage: 'Test mirror stage analysis'
                },
                deleuzianAnalysis: {
                    rhizomaticPatterns: 'Test rhizomatic patterns analysis',
                    deterritorialization: 'Test deterritorialization analysis',
                    reterritorialization: 'Test reterritorialization analysis',
                    linesOfFlight: ['creative projects', 'connection with others'],
                    desireMachines: 'Test desire-machines analysis',
                    bodyWithoutOrgans: 'Test body without organs analysis',
                    multiplicity: 'Test multiplicity analysis',
                    nomadism: 'Test nomadism analysis',
                    smoothStriated: 'Test smooth/striated spaces analysis'
                },
                personalizedInsights: 'Test personalized insights',
                date: new Date().toISOString(),
                detailLevel: 'detailed' as 'basic' | 'detailed' | 'comprehensive',
                frameworks: ['freudian', 'lacanian', 'deleuzian'] as ('freudian' | 'lacanian' | 'deleuzian' | 'irigarayian')[]
            };

            // Create a test Irigarayian analysis result
            const irigarayianResult = {
                interpretation: 'Test Irigarayian interpretation',
                sexualDifference: {
                    phallocentrism: 'Test phallocentrism analysis',
                    feminineSpeaking: 'Test feminine speaking analysis',
                    mimesis: 'Test mimesis analysis'
                },
                feminineSubjectivity: {
                    fluidIdentity: 'Test fluid identity analysis',
                    embodiedKnowledge: 'Test embodied knowledge analysis',
                    relationality: 'Test relationality analysis'
                },
                languageAndDiscourse: {
                    speakingAsWoman: 'Test speaking as woman analysis',
                    disruptiveSyntax: 'Test disruptive syntax analysis',
                    poeticLanguage: 'Test poetic language analysis',
                    silencesAndGaps: 'Test silences and gaps analysis'
                },
                ethicsOfDifference: {
                    intersubjectivity: 'Test intersubjectivity analysis',
                    wonderment: 'Test wonderment analysis',
                    mutualRespect: 'Test mutual respect analysis'
                },
                keyConcepts: ['fluid identity', 'embodied knowledge'],
                thoughtPatterns: ['relational thinking', 'non-binary perspective']
            };

            // Generate next steps recommendations
            const result = await this.nextStepsRecommendation.generateRecommendations(
                testEntry,
                enhancedResult,
                irigarayianResult,
                userProfile
            );

            // Verify the result has the expected properties
            if (!result.summary) {
                throw new Error('Next steps result missing summary');
            }

            if (!result.identifiedGoals || !Array.isArray(result.identifiedGoals.explicit)) {
                throw new Error('Next steps result missing identifiedGoals.explicit array');
            }

            if (!Array.isArray(result.recommendedActions) || result.recommendedActions.length === 0) {
                throw new Error('Next steps result missing recommendedActions array');
            }

            const firstAction = result.recommendedActions[0];
            if (!firstAction.title || !firstAction.description || !firstAction.rationale ||
                !firstAction.difficulty || !firstAction.timeframe || !firstAction.category) {
                throw new Error('Next steps result has incomplete recommendedAction');
            }

            if (!result.potentialObstacles || !Array.isArray(result.potentialObstacles.internal)) {
                throw new Error('Next steps result missing potentialObstacles.internal array');
            }

            if (!result.resourcesAndSupport || !Array.isArray(result.resourcesAndSupport.existingStrengths)) {
                throw new Error('Next steps result missing resourcesAndSupport.existingStrengths array');
            }

            if (!result.longTermVision) {
                throw new Error('Next steps result missing longTermVision');
            }

            if (!result.happinessInsights || !result.happinessInsights.personalDefinition) {
                throw new Error('Next steps result missing happinessInsights.personalDefinition');
            }

            new Notice('✅ Next steps recommendation tests passed!');
        } catch (error) {
            console.error('Error testing next steps recommendation:', error);
            throw new Error('Next steps recommendation tests failed: ' + error.message);
        }
    }
}
