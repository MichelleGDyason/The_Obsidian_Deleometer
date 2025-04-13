/**
 ** The Deleometer AI Journal Plugin (Enhanced Version with History, Settings & Export)
 * Features: Deep Emotional Analysis, Psychoanalytic Insights, Personality-Based Reflections, Goal Tracking, Analysis History, Export Option
 */

import { Plugin, Notice, Setting, PluginSettingTab, App } from 'obsidian';
// Import core modules
import { JournalAnalysisModal } from './journalAnalysisModal';
import { FreudianAnalyzer } from './freudianAnalysis';
import { ApiService } from './apiService';
import { LoadingIndicator } from './loadingIndicator';
import { AnalysisResult } from './types';
import { DashboardView, DASHBOARD_VIEW_TYPE } from './dashboardView';
import { DailyNotesIntegration } from './dailyNotesIntegration';
import { TemplateSystem } from './templateSystem';
import { AdvancedAI } from './advancedAI';
import { VoiceJournaling } from './voiceJournaling';
import { FeedbackModal } from './feedbackCollection';
import { WebApiService } from './webApiService';
import { MobileAdapter } from './mobileAdapter';
import { ResearchModule } from './researchModule';
import { BusinessModel } from './businessModel';
import { TestRunner } from './tests/testRunner';
import { UserProfileSystem } from './userProfileSystem';
import { EnhancedAnalysisFrameworks } from './enhancedAnalysisFrameworks';
import { AdaptiveLearningSystem } from './adaptiveLearningSystem';
import { JournalingPrompts } from './journalingPrompts';
import { JournalingPromptsModal } from './journalingPromptsView';
import { AdaptiveJournalingPrompts } from './adaptiveJournalingPrompts';
import { AnalysisScope } from './analysisScope';
import { AnalysisScopeModal } from './analysisScopeView';
import { EnhancedAnalysisVisualization } from './enhancedAnalysisVisualization';
import { TackticalMethodology } from './tackticalMethodology';
import { ArtisticAnalysis } from './artisticAnalysis';
import { ComparativeAnalysisView, COMPARATIVE_VIEW_TYPE } from './comparativeAnalysisView';
import { SimpleComparativeAnalysisModal } from './simpleComparativeAnalysisModal';
import { SecurityService, SecurityLevel, SecurityOptions } from './securityService';
import { LocalProcessingService, LocalProcessingOptions } from './localProcessingService';
import { SecuritySettingsTab } from './securitySettingsView';

interface DeleometerAIJournalSettings {
    // Analysis options
    enableEmotions: boolean;
    enablePsychoanalysis: boolean;
    enablePersonality: boolean;
    enableSchizoanalysis: boolean;

    // API settings
    openaiApiKey: string;
    provider: 'openai' | 'claude' | 'local';
    model: string;

    // History and data
    analysisHistory: Array<AnalysisResult>;

    // Daily notes integration
    enableDailyNotesIntegration: boolean;
    autoAnalyzeDailyNotes: boolean;
    dailyNotesTemplate: string;

    // Template settings
    templatesFolder: string;
    defaultTemplate: string;

    // Dashboard settings
    defaultDashboardTimeRange: '7d' | '30d' | '90d' | 'all';

    // Advanced AI settings
    enablePersonalization: boolean;
    personalizedModelId: string;
    feedbackCollection: boolean;
    voiceAnalysis: boolean;
    userFeedbackHistory: any[];

    // Web API settings
    webApiEnabled: boolean;
    webApiPort: number;
    webApiKey: string;

    // Mobile adapter settings
    mobileAdapterEnabled: boolean;
    mobileSyncInterval: number;

    // Research module settings
    dataCollectionEnabled: boolean;
    exportBatchSize: number;

    // Business model settings
    licenseKey: string;
    freeTierLimit: number;
    premiumTierLimit: number;

    // Enhanced analysis settings
    enableEnhancedAnalysis: boolean;
    enableUserProfiling: boolean;
    enableAdaptiveLearning: boolean;
    enableIrigarayianAnalysis: boolean;
    enableNextStepsRecommendations: boolean;
    detailLevel: 'basic' | 'detailed' | 'comprehensive';
    focusAreas: string[];
    theoreticalFrameworks: ('freudian' | 'lacanian' | 'deleuzian' | 'irigarayian')[];
    nextStepsCategories: ('emotional' | 'cognitive' | 'behavioral' | 'relational' | 'spiritual' | 'creative')[];

    // Security settings
    securityLevel: SecurityLevel;
    enableEncryption: boolean;
    localProcessingOnly: boolean;
    enableAuditLog: boolean;
    passwordProtection: boolean;
    encryptionPassword?: string;
    autoLockTimeout: number;
    secureDeleteEnabled: boolean;

    // Local processing settings
    useLocalModels: boolean;
    modelPath: string;
    maxTokens: number;
    enableBatching: boolean;
    batchSize: number;
    lowResourceMode: boolean;

    // New frameworks
    enableJungian: boolean;
    enableAttachment: boolean;
    enablePositive: boolean;
    enableNarrative: boolean;
    enablePhenomenological: boolean;
    enableExistentialist: boolean;
    enableFeminist: boolean;
    enableCritical: boolean;
    enablePosthumanist: boolean;
    enableBuddhist: boolean;
    enableExistentialPsychology: boolean;
    enableGestalt: boolean;
    enableTranspersonal: boolean;
    enableCognitiveBehavioral: boolean;
    enableHermeneutics: boolean;
    enableStoicism: boolean;
    enableNietzschean: boolean;
    enablePsychiatry: boolean;

    // Analysis scope
    enableAnalysisScope: boolean;
    defaultAnalysisScope: 'note' | 'file' | 'folder' | 'vault';
    maxAnalysisEntries: number;

    // Journaling prompts
    enableJournalingPrompts: boolean;
    enableAdaptiveJournalingPrompts: boolean;
    defaultPromptCategory: string;

    // Artistic analysis
    enableArtisticAnalysis: boolean;
    enableTackticalMethodology: boolean;
    maxMediaFileSize: number;
}

export default class DeleometerPlugin extends Plugin {
    settings: DeleometerAIJournalSettings;
    debouncedAnalyzeJournalEntry: () => void;
    private statusBar: HTMLElement & {
        setText: (text: string) => void;
        onClickEvent: (callback: () => void) => void;
    };
    private apiService: ApiService;
    private loadingIndicator: LoadingIndicator;
    private dailyNotesIntegration: DailyNotesIntegration;
    private templateSystem: TemplateSystem;
    private advancedAI: AdvancedAI | null = null;
    private voiceJournaling: VoiceJournaling | null = null;
    private webApiService: WebApiService | null = null;
    private mobileAdapter: MobileAdapter | null = null;
    private researchModule: ResearchModule | null = null;
    private businessModel: BusinessModel | null = null;
    private testRunner: TestRunner | null = null;
    private userProfileSystem: UserProfileSystem | null = null;
    private enhancedAnalysisFrameworks: EnhancedAnalysisFrameworks | null = null;
    private adaptiveLearningSystem: AdaptiveLearningSystem | null = null;
    private journalingPrompts: JournalingPrompts | null = null;
    private adaptiveJournalingPrompts: AdaptiveJournalingPrompts | null = null;
    private analysisScope: AnalysisScope | null = null;
    private enhancedAnalysisVisualization: EnhancedAnalysisVisualization | null = null;
    private tackticalMethodology: TackticalMethodology | null = null;
    private artisticAnalysis: ArtisticAnalysis | null = null;
    private securityService: SecurityService | null = null;
    private localProcessingService: LocalProcessingService | null = null;

    // Register the dashboard view type
    registerViews() {
        this.registerView(
            DASHBOARD_VIEW_TYPE,
            (leaf) => new DashboardView(leaf, this)
        );

        // Register comparative analysis view
        this.registerView(
            COMPARATIVE_VIEW_TYPE,
            (leaf) => new ComparativeAnalysisView(leaf)
        );
    }

    // Function to activate the dashboard view
    async activateDashboardView() {
        const { workspace } = this.app;

        // If the view is already open, focus on it
        const existingLeaves = workspace.getLeavesOfType(DASHBOARD_VIEW_TYPE);
        if (existingLeaves.length > 0) {
            workspace.revealLeaf(existingLeaves[0]);
            return;
        }

        // Otherwise, create a new leaf and open the dashboard view
        const leaf = workspace.getLeaf('tab');
        await leaf.setViewState({
            type: DASHBOARD_VIEW_TYPE,
            active: true
        });

        // Focus on the new leaf
        workspace.revealLeaf(leaf);
    }

    async onload() {
        console.log('The Deleometer AI Journal Plugin Loaded');
        await this.loadSettings();

        // Initialize API service
        this.apiService = new ApiService({
            openaiApiKey: this.settings.openaiApiKey,
            provider: this.settings.provider || 'openai',
            model: this.settings.model || 'gpt-4'
        });

        // Validate API key on load
        this.validateApiKey();

        this.debouncedAnalyzeJournalEntry = this.debounce(this.analyzeJournalEntry.bind(this), 300);

        // Add status bar item
        const statusBarEl = this.addStatusBarItem();
        statusBarEl.style.cursor = 'pointer';

        // Add custom methods to the status bar element
        const statusBar = statusBarEl as typeof statusBarEl & {
            setText: (text: string) => void;
            onClickEvent: (callback: () => void) => void;
        };

        // Implement setText method
        statusBar.setText = (text: string) => {
            statusBarEl.setText(text);
        };

        // Implement onClickEvent method
        statusBar.onClickEvent = (callback: () => void) => {
            statusBarEl.addEventListener('click', callback);
        };

        // Store the enhanced status bar
        this.statusBar = statusBar;

        // Set initial text and click handler
        this.statusBar.setText('🛋️ Deleometer Ready');
        this.statusBar.onClickEvent(() => {
            this.runFreudianAnalysis();
        });

        // Create loading indicator in status bar
        const statusBarContainer = document.querySelector('.status-bar-item.plugin-deleometer');
        if (statusBarContainer) {
            this.loadingIndicator = new LoadingIndicator(statusBarContainer as HTMLElement);
        }

        // Initialize daily notes integration
        this.dailyNotesIntegration = new DailyNotesIntegration(this.app);

        // Initialize template system
        this.templateSystem = new TemplateSystem(this.app, this.settings.templatesFolder);
        await this.templateSystem.initialize();

        // Initialize Advanced AI features
        if (this.settings.enablePersonalization || this.settings.feedbackCollection) {
            this.advancedAI = new AdvancedAI(this.apiService, {
                enablePersonalization: this.settings.enablePersonalization,
                personalizedModelId: this.settings.personalizedModelId,
                feedbackCollection: this.settings.feedbackCollection,
                voiceAnalysis: this.settings.voiceAnalysis,
                userFeedbackHistory: this.settings.userFeedbackHistory
            });
        }

        // Initialize Voice Journaling
        if (this.settings.voiceAnalysis && VoiceJournaling.isSupported() && this.advancedAI) {
            this.voiceJournaling = new VoiceJournaling(this.app, this.advancedAI);

            // Add voice journaling command
            this.addCommand({
                id: 'start-voice-journaling',
                name: 'Start Voice Journaling',
                callback: () => {
                    if (this.voiceJournaling) {
                        this.voiceJournaling.toggleRecording();
                    } else {
                        new Notice('Voice journaling is not available.');
                    }
                }
            });
        }

        // Initialize Web API Service
        if (this.settings.webApiEnabled) {
            this.webApiService = new WebApiService(this.apiService, this.settings.webApiKey, this.settings.webApiPort);

            // Start the web API server
            this.webApiService.start().catch(error => {
                console.error('Error starting web API server:', error);
                new Notice('Failed to start web API server. Check the console for details.');
            });
        }

        // Initialize Mobile Adapter
        if (this.settings.mobileAdapterEnabled) {
            this.mobileAdapter = new MobileAdapter(this.apiService, {
                syncEnabled: this.settings.mobileAdapterEnabled,
                syncInterval: this.settings.mobileSyncInterval
            });

            // Start the mobile adapter
            this.mobileAdapter.start().catch(error => {
                console.error('Error starting mobile adapter:', error);
                new Notice('Failed to start mobile adapter. Check the console for details.');
            });
        }

        // Initialize Research Module
        this.researchModule = new ResearchModule({
            dataCollectionEnabled: this.settings.dataCollectionEnabled,
            exportBatchSize: this.settings.exportBatchSize
        });

        // Initialize Business Model
        this.businessModel = new BusinessModel({
            licenseKey: this.settings.licenseKey,
            freeTierLimit: this.settings.freeTierLimit,
            premiumTierLimit: this.settings.premiumTierLimit
        });

        // Initialize Test Runner
        this.testRunner = new TestRunner(this);

        // Initialize User Profile System if enabled
        if (this.settings.enableUserProfiling) {
            this.userProfileSystem = new UserProfileSystem(this.app);
            await this.userProfileSystem.initialize();

            // Initialize Enhanced Analysis Frameworks if enabled
            if (this.settings.enableEnhancedAnalysis) {
                this.enhancedAnalysisFrameworks = new EnhancedAnalysisFrameworks(this.apiService);
                this.enhancedAnalysisVisualization = new EnhancedAnalysisVisualization();

                // Initialize Analysis Scope
                try {
                    // Use type assertion to avoid TypeScript errors
                    // @ts-ignore - Ignore the TypeScript error about AnalysisScope being a type
                    this.analysisScope = new AnalysisScope(
                        this.app,
                        this.enhancedAnalysisFrameworks,
                        this.userProfileSystem
                    );
                } catch (error) {
                    console.error('Error initializing AnalysisScope:', error);
                }

                // Initialize Adaptive Learning System if enabled
                if (this.settings.enableAdaptiveLearning) {
                    this.adaptiveLearningSystem = new AdaptiveLearningSystem(
                        this.app,
                        this.userProfileSystem,
                        this.apiService
                    );
                }
            }
        }

        // Initialize Journaling Prompts
        this.journalingPrompts = new JournalingPrompts(this.apiService);

        // Initialize Adaptive Journaling Prompts if enabled
        if (this.settings.enableAdaptiveJournalingPrompts && this.userProfileSystem && this.enhancedAnalysisFrameworks) {
            try {
                this.adaptiveJournalingPrompts = new AdaptiveJournalingPrompts(
                    this.app,
                    this.userProfileSystem,
                    this.enhancedAnalysisFrameworks,
                    this.journalingPrompts
                );
            } catch (error) {
                console.error('Error initializing Adaptive Journaling Prompts:', error);
            }
        }

        // Initialize Tacktical Methodology if enabled
        if (this.settings.enableTackticalMethodology) {
            try {
                this.tackticalMethodology = new TackticalMethodology(this.apiService);
            } catch (error) {
                console.error('Error initializing Tacktical Methodology:', error);
            }
        }

        // Initialize Security Service
        try {
            this.securityService = new SecurityService(this.app, {
                securityLevel: this.settings.securityLevel || SecurityLevel.STANDARD,
                enableEncryption: this.settings.enableEncryption || false,
                localProcessingOnly: this.settings.localProcessingOnly || false,
                enableAuditLog: this.settings.enableAuditLog || true,
                passwordProtection: this.settings.passwordProtection || false,
                encryptionPassword: this.settings.encryptionPassword,
                autoLockTimeout: this.settings.autoLockTimeout || 0,
                secureDeleteEnabled: this.settings.secureDeleteEnabled || false
            });
        } catch (error) {
            console.error('Error initializing Security Service:', error);
        }

        // Initialize Local Processing Service if enabled
        if (this.settings.localProcessingOnly && this.securityService) {
            try {
                this.localProcessingService = new LocalProcessingService(
                    this.app,
                    this.securityService,
                    {
                        useLocalModels: this.settings.useLocalModels || true,
                        modelPath: this.settings.modelPath || '.obsidian/plugins/deleometer/models',
                        maxTokens: this.settings.maxTokens || 1000,
                        enableBatching: this.settings.enableBatching || false,
                        batchSize: this.settings.batchSize || 5,
                        lowResourceMode: this.settings.lowResourceMode || false
                    }
                );

                // Initialize local models
                this.localProcessingService.initialize();
            } catch (error) {
                console.error('Error initializing Local Processing Service:', error);
            }
        }

        // Initialize Artistic Analysis if enabled
        if (this.settings.enableArtisticAnalysis && this.userProfileSystem) {
            try {
                // Only initialize if security service is available
                if (this.securityService) {
                    this.artisticAnalysis = new ArtisticAnalysis(
                        this.app,
                        this.apiService,
                        this.userProfileSystem,
                        this.securityService,
                        this.localProcessingService || undefined
                    );
                } else {
                    console.error('Cannot initialize Artistic Analysis: Security Service not available');
                }
            } catch (error) {
                console.error('Error initializing Artistic Analysis:', error);
            }
        }

        // Add test command
        this.addCommand({
            id: 'run-tests',
            name: 'Run Tests',
            callback: () => {
                if (this.testRunner) {
                    this.testRunner.runAllTests();
                } else {
                    new Notice('Test runner is not available.');
                }
            }
        });

        // Register dashboard view
        this.registerViews();

        // Register settings tab
        this.addSettingTab(new JournalSettingsTab(this.app, this));

        // Register security settings tab if security service is available
        if (this.securityService) {
            this.addSettingTab(new SecuritySettingsTab(
                this.app,
                this,
                this.securityService,
                this.localProcessingService
            ));
        }

        this.addCommand({
            id: 'freudian-analysis',
            name: 'Run Freudian Analysis',
            callback: () => {
                const activeFile = this.app.workspace.getActiveFile();
                if (activeFile) {
                    this.app.vault.read(activeFile).then(content => {
                        new FreudianAnalyzer(this.app).analyzeEntry(content);
                    });
                }
            }
        });

        this.addCommand({
            id: 'analyze-journal',
            name: 'Analyze Journal Entry',
            callback: () => {
                this.debouncedAnalyzeJournalEntry();
            }
        });

        this.addCommand({
            id: 'open-journal-analysis-view',
            name: 'Open Journal Analysis View',
            callback: () => {
                this.openJournalAnalysisView();
            }
        });

        this.addCommand({
            id: 'open-dashboard-view',
            name: 'Open Emotional Insights Dashboard',
            callback: () => {
                this.activateDashboardView();
            }
        });

        // Add commands for new features
        this.addCommand({
            id: 'open-journaling-prompts',
            name: 'Open Journaling Prompts',
            callback: () => {
                if (this.journalingPrompts && this.settings.enableJournalingPrompts) {
                    try {
                        // Create a modal with undefined for userProfileSystem if it's not available
                        // We need to cast to any to avoid TypeScript errors
                        const modal = new (JournalingPromptsModal as any)(
                            this.app,
                            this.journalingPrompts,
                            this.userProfileSystem
                        );
                        modal.open();
                    } catch (error) {
                        console.error('Error opening journaling prompts modal:', error);
                        new Notice('Error opening journaling prompts modal');
                    }
                } else {
                    new Notice('Journaling prompts are not available. Make sure they are enabled in settings.');
                }
            }
        });

        this.addCommand({
            id: 'analyze-scope',
            name: 'Analyze Content (Note/File/Folder/Vault)',
            callback: () => {
                if (this.analysisScope && this.enhancedAnalysisVisualization && this.settings.enableAnalysisScope) {
                    new AnalysisScopeModal(
                        this.app,
                        this.analysisScope,
                        this.enhancedAnalysisVisualization
                    ).open();
                } else {
                    new Notice('Analysis scope is not available. Make sure it is enabled in settings.');
                }
            }
        });

        // Add command for comparative analysis
        this.addCommand({
            id: 'comparative-analysis',
            name: 'Comparative Analysis',
            callback: () => {
                if (this.artisticAnalysis && this.settings.enableArtisticAnalysis) {
                    new SimpleComparativeAnalysisModal(
                        this.app,
                        this.artisticAnalysis
                    ).open();
                } else {
                    new Notice('Comparative analysis is not available. Make sure artistic analysis is enabled in settings.');
                }
            }
        });
    }

    async onunload() {
        console.log('Unloading Deleometer plugin');

        // Stop the web API server
        if (this.webApiService) {
            await this.webApiService.stop().catch(error => {
                console.error('Error stopping web API server:', error);
            });
        }

        // Stop the mobile adapter
        if (this.mobileAdapter) {
            await this.mobileAdapter.stop().catch(error => {
                console.error('Error stopping mobile adapter:', error);
            });
        }
    }

    private async runFreudianAnalysis() {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile) {
            this.statusBar.setText('🔮 Analyzing...');
            const content = await this.app.vault.read(activeFile);
            await new FreudianAnalyzer(this.app).analyzeEntry(content);
            this.statusBar.setText('🛋️ Freudian Ready');
        }
    }

    debounce(func: (...args: any[]) => void, wait: number) {
        let timeout: number;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => func(...args), wait);
        };
    }

    async analyzeJournalEntry(content?: string): Promise<AnalysisResult> {
        // If no content is provided, get it from the active editor
        if (!content) {
            const editor = this.getActiveEditor();
            if (!editor) throw new Error('No active editor found');

            content = this.getEditorText(editor);
            if (!content) throw new Error('No text found in editor');
        }

        try {
            const result = await this.performAnalysis(content);
            this.saveAnalysisResult(result);

            // Only open the modal if this was triggered directly by the user (not by batch processing)
            if (arguments.length === 0) {
                new JournalAnalysisModal(this.app, result).open();

                // Show feedback modal if feedback collection is enabled
                if (this.settings.feedbackCollection && this.advancedAI) {
                    // Wait a bit to let the user review the analysis first
                    setTimeout(() => {
                        if (this.advancedAI) {
                            new FeedbackModal(this.app, this.advancedAI, result).open();
                        }
                    }, 5000);
                }
            }

            return result;
        } catch (error) {
            console.error('Error analyzing journal entry:', error);
            new Notice('Failed to analyze journal entry. Check the console for details.');
            throw error;
        }
    }

    getActiveEditor() {
        const editor = this.app.workspace.activeLeaf?.view?.editor;
        if (!editor) {
            new Notice('No active editor found. Please open a journal entry.');
        }
        return editor;
    }

    getEditorText(editor: any) {
        const text = editor.getValue().trim();
        if (!text) {
            new Notice('Journal entry is empty. Please write something first.');
        }
        return text;
    }

    async validateApiKey() {
        if (!this.settings.openaiApiKey) {
            new Notice('OpenAI API key is not set. Please add it in the settings.');
            return false;
        }

        try {
            const isValid = await this.apiService.validateApiKey();
            if (isValid) {
                this.statusBar.setText('✅ API Key Valid');
                setTimeout(() => {
                    this.statusBar.setText('🛋️ Deleometer Ready');
                }, 2000);
                return true;
            } else {
                this.statusBar.setText('❌ Invalid API Key');
                new Notice('Invalid OpenAI API key. Please check your settings.');
                return false;
            }
        } catch (error) {
            console.error('Error validating API key:', error);
            this.statusBar.setText('❌ API Error');
            new Notice('Error validating API key. Please check your internet connection.');
            return false;
        }
    }

    async performAnalysis(text: string) {
        if (!await this.validateApiKey()) {
            throw new Error('Invalid API key');
        }

        // Show loading indicator
        this.statusBar.setText('🔮 Analyzing...');
        if (this.loadingIndicator) {
            this.loadingIndicator.show('Analyzing journal entry...');
        }

        try {
            // Check if enhanced analysis is enabled
            if (this.settings.enableEnhancedAnalysis && this.enhancedAnalysisFrameworks) {
                // Get user profile if available
                const userProfile = this.userProfileSystem ? this.userProfileSystem.getUserProfile() : null;

                // Perform enhanced analysis
                const enhancedResult = await this.enhancedAnalysisFrameworks.analyzeText(text, userProfile, {
                    includeIrigarayian: this.settings.enableIrigarayianAnalysis,
                    includeNextSteps: this.settings.enableNextStepsRecommendations
                });

                // Apply adaptive learning if enabled
                if (this.settings.enableAdaptiveLearning && this.adaptiveLearningSystem && userProfile) {
                    await this.adaptiveLearningSystem.enhanceAnalysisResult(enhancedResult, userProfile);
                }

                // Update user profile with analysis result if enabled
                if (this.settings.enableUserProfiling && this.userProfileSystem) {
                    // Convert to AnalysisResult format
                    const analysisResult = {
                        emotions: enhancedResult.emotions,
                        psychoanalyticResponse: this.formatEnhancedAnalysisForDisplay(enhancedResult),
                        personalityInsights: {},
                        date: enhancedResult.date
                    };
                    await this.userProfileSystem.updateWithAnalysisResult(analysisResult);
                }

                // Hide loading indicator
                this.statusBar.setText('🛋️ Deleometer Ready');
                if (this.loadingIndicator) {
                    this.loadingIndicator.hide();
                }

                // Convert enhanced result to standard format
                // Convert enhanced result to standard format
                const standardResult = {
                    emotions: enhancedResult.emotions,
                    psychoanalyticResponse: this.formatEnhancedAnalysisForDisplay(enhancedResult),
                    personalityInsights: {},
                    date: enhancedResult.date,
                    enhancedAnalysis: enhancedResult // Include the full enhanced analysis
                };

                return standardResult;
            } else {
                // Perform standard analysis
                // Prepare prompts
                const emotionsPrompt = `
                    Analyze the emotional content of this journal entry.
                    Identify the primary emotions expressed and their intensity.
                    Return as JSON with emotion names as keys and intensity values (0-10).
                    Include an overall sentiment score from -1 to 1.

                    Journal Entry:
                    ${text}
                `;

                const psychoanalysisPrompt = `
                    Provide psychoanalytic insights for this journal entry.
                    Use concepts from Freud, Lacan, and other psychoanalytic thinkers.
                    Focus on unconscious patterns, defense mechanisms, and symbolic meanings.

                    Journal Entry:
                    ${text}
                `;

                const personalityPrompt = `
                    Analyze this journal entry through the lens of personality psychology.
                    Identify traits based on the Big Five model (openness, conscientiousness, extraversion, agreeableness, neuroticism).
                    Return as JSON with trait names as keys and values from 0-1.

                    Journal Entry:
                    ${text}
                `;

                // Perform analysis in parallel
                const [emotions, psychoanalyticResponse, personalityInsights] = await Promise.all([
                    this.settings.enableEmotions ? this.apiService.getCompletion(emotionsPrompt, { responseFormat: 'json_object' }) : null,
                    this.settings.enablePsychoanalysis ? this.apiService.getCompletion(psychoanalysisPrompt) : null,
                    this.settings.enablePersonality ? this.apiService.getCompletion(personalityPrompt, { responseFormat: 'json_object' }) : null
                ]);

                // Hide loading indicator
                this.statusBar.setText('🛋️ Deleometer Ready');
                if (this.loadingIndicator) {
                    this.loadingIndicator.hide();
                }

                return { emotions, psychoanalyticResponse, personalityInsights, date: new Date().toISOString() };
            }
        } catch (error) {
            // Hide loading indicator on error
            this.statusBar.setText('❌ Analysis Failed');
            if (this.loadingIndicator) {
                this.loadingIndicator.hide();
            }

            console.error('Error in performAnalysis:', error);
            throw error;
        }
    }

    /**
     * Formats enhanced analysis for display
     * @param enhancedResult The enhanced analysis result
     * @returns string The formatted analysis
     */
    private formatEnhancedAnalysisForDisplay(enhancedResult: any): string {
        let formattedAnalysis = '';

        // Add Freudian analysis
        if (enhancedResult.freudianAnalysis) {
            formattedAnalysis += '## Freudian Analysis\n\n';

            if (enhancedResult.freudianAnalysis.interpretation) {
                formattedAnalysis += enhancedResult.freudianAnalysis.interpretation + '\n\n';
            }

            if (enhancedResult.freudianAnalysis.idEgoSuperego) {
                formattedAnalysis += '### Id/Ego/Superego\n';
                formattedAnalysis += '- **Id**: ' + enhancedResult.freudianAnalysis.idEgoSuperego.id + '\n';
                formattedAnalysis += '- **Ego**: ' + enhancedResult.freudianAnalysis.idEgoSuperego.ego + '\n';
                formattedAnalysis += '- **Superego**: ' + enhancedResult.freudianAnalysis.idEgoSuperego.superego + '\n\n';
            }

            if (enhancedResult.freudianAnalysis.defenseMechanisms && enhancedResult.freudianAnalysis.defenseMechanisms.length > 0) {
                formattedAnalysis += '### Defense Mechanisms\n';
                for (const mechanism of enhancedResult.freudianAnalysis.defenseMechanisms) {
                    formattedAnalysis += '- ' + mechanism + '\n';
                }
                formattedAnalysis += '\n';
            }
        }

        // Add Lacanian analysis
        if (enhancedResult.lacanianAnalysis) {
            formattedAnalysis += '## Lacanian Analysis\n\n';

            if (enhancedResult.lacanianAnalysis.symbolicOrder) {
                formattedAnalysis += '### Symbolic Order\n' + enhancedResult.lacanianAnalysis.symbolicOrder + '\n\n';
            }

            if (enhancedResult.lacanianAnalysis.imaginaryOrder) {
                formattedAnalysis += '### Imaginary Order\n' + enhancedResult.lacanianAnalysis.imaginaryOrder + '\n\n';
            }

            if (enhancedResult.lacanianAnalysis.desireStructures) {
                formattedAnalysis += '### Desire Structures\n' + enhancedResult.lacanianAnalysis.desireStructures + '\n\n';
            }
        }

        // Add Deleuzian analysis
        if (enhancedResult.deleuzianAnalysis) {
            formattedAnalysis += '## Deleuzian Analysis\n\n';

            if (enhancedResult.deleuzianAnalysis.rhizomaticPatterns) {
                formattedAnalysis += '### Rhizomatic Patterns\n' + enhancedResult.deleuzianAnalysis.rhizomaticPatterns + '\n\n';
            }

            if (enhancedResult.deleuzianAnalysis.deterritorialization) {
                formattedAnalysis += '### Deterritorialization\n' + enhancedResult.deleuzianAnalysis.deterritorialization + '\n\n';
            }

            if (enhancedResult.deleuzianAnalysis.linesOfFlight && enhancedResult.deleuzianAnalysis.linesOfFlight.length > 0) {
                formattedAnalysis += '### Lines of Flight\n';
                for (const line of enhancedResult.deleuzianAnalysis.linesOfFlight) {
                    formattedAnalysis += '- ' + line + '\n';
                }
                formattedAnalysis += '\n';
            }
        }

        // Add personalized insights
        if (enhancedResult.personalizedInsights) {
            formattedAnalysis += '## Personalized Insights\n\n' + enhancedResult.personalizedInsights + '\n\n';
        }

        // Add Irigarayian analysis
        if (enhancedResult.irigarayianAnalysis) {
            formattedAnalysis += '## Irigarayian Analysis\n\n';

            if (enhancedResult.irigarayianAnalysis.interpretation) {
                formattedAnalysis += enhancedResult.irigarayianAnalysis.interpretation + '\n\n';
            }

            if (enhancedResult.irigarayianAnalysis.sexualDifference) {
                formattedAnalysis += '### Sexual Difference\n';
                if (enhancedResult.irigarayianAnalysis.sexualDifference.feminineSpeaking) {
                    formattedAnalysis += '**Feminine Speaking**: ' + enhancedResult.irigarayianAnalysis.sexualDifference.feminineSpeaking + '\n\n';
                }
                if (enhancedResult.irigarayianAnalysis.sexualDifference.mimesis) {
                    formattedAnalysis += '**Mimesis**: ' + enhancedResult.irigarayianAnalysis.sexualDifference.mimesis + '\n\n';
                }
            }

            if (enhancedResult.irigarayianAnalysis.feminineSubjectivity) {
                formattedAnalysis += '### Feminine Subjectivity\n';
                if (enhancedResult.irigarayianAnalysis.feminineSubjectivity.fluidIdentity) {
                    formattedAnalysis += '**Fluid Identity**: ' + enhancedResult.irigarayianAnalysis.feminineSubjectivity.fluidIdentity + '\n\n';
                }
                if (enhancedResult.irigarayianAnalysis.feminineSubjectivity.embodiedKnowledge) {
                    formattedAnalysis += '**Embodied Knowledge**: ' + enhancedResult.irigarayianAnalysis.feminineSubjectivity.embodiedKnowledge + '\n\n';
                }
            }
        }

        // Add next steps recommendations
        if (enhancedResult.nextStepsRecommendations) {
            formattedAnalysis += '## Next Steps Recommendations\n\n';

            if (enhancedResult.nextStepsRecommendations.summary) {
                formattedAnalysis += enhancedResult.nextStepsRecommendations.summary + '\n\n';
            }

            if (enhancedResult.nextStepsRecommendations.recommendedActions && enhancedResult.nextStepsRecommendations.recommendedActions.length > 0) {
                formattedAnalysis += '### Recommended Actions\n';
                for (const action of enhancedResult.nextStepsRecommendations.recommendedActions) {
                    formattedAnalysis += '#### ' + action.title + ' (' + action.difficulty + ', ' + action.timeframe + ')\n';
                    formattedAnalysis += action.description + '\n\n';
                    formattedAnalysis += '**Why**: ' + action.rationale + '\n\n';
                }
            }

            if (enhancedResult.nextStepsRecommendations.happinessInsights) {
                formattedAnalysis += '### Happiness Insights\n';
                if (enhancedResult.nextStepsRecommendations.happinessInsights.personalDefinition) {
                    formattedAnalysis += '**Your Definition of Happiness**: ' + enhancedResult.nextStepsRecommendations.happinessInsights.personalDefinition + '\n\n';
                }
            }
        }

        return formattedAnalysis;
    }

    async saveAnalysisResult(result: any) {
        this.settings.analysisHistory.push(result);
        await this.saveSettings();
    }

    openJournalAnalysisView() {
        const leaf = this.app.workspace.getLeaf(true);
        leaf.setViewState({
            type: 'markdown',
            state: { content: '# AI Deep Self Discovery Journaling\nStart writing your journal entry here...' }
        });
    }

    /**
     * Analyzes all daily notes in a date range
     * @param startDate The start date
     * @param endDate The end date (defaults to today)
     */
    async analyzeDailyNotes(startDate: Date, endDate: Date = new Date()): Promise<void> {
        if (!this.dailyNotesIntegration) {
            new Notice('Daily notes integration not initialized.');
            return;
        }

        // Show loading indicator
        if (this.loadingIndicator) {
            this.loadingIndicator.show('Analyzing daily notes...');
        }

        try {
            // Analyze all daily notes in the range
            await this.dailyNotesIntegration.analyzeAllDailyNotes(
                startDate,
                endDate,
                async (content: string) => {
                    // Analyze the content
                    return await this.analyzeJournalEntry(content);
                }
            );

            // Hide loading indicator
            if (this.loadingIndicator) {
                this.loadingIndicator.hide();
            }

            new Notice('Daily notes analysis complete.');
        } catch (error) {
            console.error('Error analyzing daily notes:', error);

            // Hide loading indicator
            if (this.loadingIndicator) {
                this.loadingIndicator.hide();
            }

            new Notice('Failed to analyze daily notes.');
        }
    }

    async loadSettings() {
        this.settings = Object.assign({
            // Analysis options
            enableEmotions: true,
            enablePsychoanalysis: true,
            enablePersonality: true,
            enableSchizoanalysis: false,

            // API settings
            openaiApiKey: '',
            provider: 'openai',
            model: 'gpt-4',

            // History and data
            analysisHistory: [],

            // Daily notes integration
            enableDailyNotesIntegration: false,
            autoAnalyzeDailyNotes: false,
            dailyNotesTemplate: 'default',

            // Template settings
            templatesFolder: 'templates/deleometer',
            defaultTemplate: 'journal',

            // Dashboard settings
            defaultDashboardTimeRange: '30d',

            // Advanced AI settings
            enablePersonalization: false,
            personalizedModelId: '',
            feedbackCollection: false,
            voiceAnalysis: false,
            userFeedbackHistory: [],

            // Web API settings
            webApiEnabled: false,
            webApiPort: 3000,
            webApiKey: '',

            // Mobile adapter settings
            mobileAdapterEnabled: false,
            mobileSyncInterval: 60000,

            // Research module settings
            dataCollectionEnabled: false,
            exportBatchSize: 10,

            // Business model settings
            licenseKey: '',
            freeTierLimit: 10,
            premiumTierLimit: 100,

            // Enhanced analysis settings
            enableEnhancedAnalysis: true,
            enableUserProfiling: true,
            enableAdaptiveLearning: true,
            enableIrigarayianAnalysis: true,
            enableNextStepsRecommendations: true,
            detailLevel: 'detailed',
            focusAreas: ['emotions', 'patterns', 'unconscious', 'desires', 'rhizomes'],
            theoreticalFrameworks: ['freudian', 'lacanian', 'deleuzian', 'irigarayian'],
            nextStepsCategories: ['emotional', 'cognitive', 'behavioral', 'relational', 'spiritual', 'creative'],

            // New frameworks
            enableJungian: false,
            enableAttachment: false,
            enablePositive: false,
            enableNarrative: false,
            enablePhenomenological: false,
            enableExistentialist: false,
            enableFeminist: false,
            enableCritical: false,
            enablePosthumanist: false,
            enableBuddhist: false,
            enableExistentialPsychology: false,
            enableGestalt: false,
            enableTranspersonal: false,
            enableCognitiveBehavioral: false,
            enableHermeneutics: false,
            enableStoicism: false,
            enableNietzschean: false,
            enablePsychiatry: false,

            // Analysis scope
            enableAnalysisScope: false,
            defaultAnalysisScope: 'note',
            maxAnalysisEntries: 20,

            // Journaling prompts
            enableJournalingPrompts: false,
            defaultPromptCategory: 'all'
        }, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    exportAnalysisHistory() {
        if (!this.settings.analysisHistory.length) {
            new Notice('No analysis history to export.');
            return;
        }

        const content = this.settings.analysisHistory.map(this.formatAnalysisEntry).join('\n');

        const fileName = `AI_Journal_Analysis_${new Date().toISOString().slice(0, 10)}.md`;
        this.app.vault.create(fileName, content).then(() => {
            new Notice(`Analysis history exported to ${fileName}`);
        }).catch(error => {
            console.error('Error exporting analysis history:', error);
            new Notice('Failed to export analysis history.');
        });
    }

    formatAnalysisEntry(entry: any): string {
        return `### Analysis from ${new Date(entry.date).toLocaleString()}\n\n` +
            (entry.emotions ? `**Emotional Analysis:**\n${JSON.stringify(entry.emotions, null, 2)}\n\n` : '') +
            (entry.psychoanalyticResponse ? `**Psychoanalytic Insights:**\n${entry.psychoanalyticResponse}\n\n` : '') +
            (entry.personalityInsights ? `**Personality Insights:**\n${JSON.stringify(entry.personalityInsights, null, 2)}\n\n` : '') +
            '---\n';
    }

    // This method is already implemented above
}

/**
 * Settings tab for customizing analysis options
 */
class JournalSettingsTab extends PluginSettingTab {
    plugin: DeleometerPlugin;

    constructor(app: App, plugin: DeleometerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'AI Journal Settings' });

        // API Settings Section
        containerEl.createEl('h3', { text: 'API Settings' });

        new Setting(containerEl)
            .setName('OpenAI API Key')
            .setDesc('Enter your OpenAI API key. Required for all analysis features.')
            .addText(text => text
                .setPlaceholder('sk-...')
                .setValue(this.plugin.settings.openaiApiKey)
                .onChange(async (value) => {
                    this.plugin.settings.openaiApiKey = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('AI Model')
            .setDesc('Select the AI model to use for analysis.')
            .addDropdown(dropdown => dropdown
                .addOption('gpt-4', 'GPT-4 (Best quality)')
                .addOption('gpt-3.5-turbo', 'GPT-3.5 Turbo (Faster)')
                .setValue(this.plugin.settings.model)
                .onChange(async (value) => {
                    this.plugin.settings.model = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Validate API Key')
            .setDesc('Test your API key to ensure it works correctly.')
            .addButton(button => button
                .setButtonText('Test Connection')
                .onClick(async () => {
                    await this.plugin.validateApiKey();
                }));

        // Analysis Features Section
        containerEl.createEl('h3', { text: 'Analysis Features' });

        new Setting(containerEl)
            .setName('Enable Emotional Analysis')
            .setDesc('Toggle AI-powered emotion detection.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableEmotions)
                .onChange(async (value: boolean) => {
                    this.plugin.settings.enableEmotions = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Psychoanalysis')
            .setDesc('Toggle AI-powered psychoanalytic insights.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enablePsychoanalysis)
                .onChange(async (value) => {
                    this.plugin.settings.enablePsychoanalysis = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Personality Analysis')
            .setDesc('Toggle AI-powered personality insights.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enablePersonality)
                .onChange(async (value) => {
                    this.plugin.settings.enablePersonality = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Schizoanalysis')
            .setDesc('Toggle AI-powered Deleuzian schizoanalysis (experimental).')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableSchizoanalysis)
                .onChange(async (value) => {
                    this.plugin.settings.enableSchizoanalysis = value;
                    await this.plugin.saveSettings();
                }));

        // Enhanced Analysis Features
        containerEl.createEl('h3', { text: 'Enhanced Analysis Features' });

        new Setting(containerEl)
            .setName('Enable Analysis Scope')
            .setDesc('Enable analyzing notes, files, folders, and vaults beyond daily notes.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableAnalysisScope)
                .onChange(async (value) => {
                    this.plugin.settings.enableAnalysisScope = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Journaling Prompts')
            .setDesc('Enable journaling prompts to inspire your writing.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableJournalingPrompts)
                .onChange(async (value) => {
                    this.plugin.settings.enableJournalingPrompts = value;
                    await this.plugin.saveSettings();
                }));

        // Daily Notes Integration Section
        containerEl.createEl('h3', { text: 'Daily Notes Integration' });

        new Setting(containerEl)
            .setName('Enable Daily Notes Integration')
            .setDesc('Integrate with Obsidian\'s daily notes plugin.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableDailyNotesIntegration)
                .onChange(async (value) => {
                    this.plugin.settings.enableDailyNotesIntegration = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Auto-Analyze Daily Notes')
            .setDesc('Automatically analyze daily notes when they are created or modified.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.autoAnalyzeDailyNotes)
                .onChange(async (value) => {
                    this.plugin.settings.autoAnalyzeDailyNotes = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Daily Notes Template')
            .setDesc('Template to use for daily notes.')
            .addDropdown(dropdown => {
                dropdown.addOption('default', 'Default')
                dropdown.addOption('journal', 'Journal')
                dropdown.addOption('psychoanalysis', 'Psychoanalysis')
                dropdown.addOption('personality', 'Personality')
                dropdown.setValue(this.plugin.settings.dailyNotesTemplate)
                dropdown.onChange(async (value) => {
                    this.plugin.settings.dailyNotesTemplate = value;
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Analyze Daily Notes')
            .setDesc('Analyze all daily notes in a date range.')
            .addButton(button => button.setButtonText('Last 7 Days')
                .onClick(() => {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - 7);
                    this.plugin.analyzeDailyNotes(startDate);
                }))
            .addButton(button => button.setButtonText('Last 30 Days')
                .onClick(() => {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - 30);
                    this.plugin.analyzeDailyNotes(startDate);
                }))
            .addButton(button => button.setButtonText('All Time')
                .onClick(() => {
                    // Use a date far in the past
                    const startDate = new Date(2000, 0, 1);
                    this.plugin.analyzeDailyNotes(startDate);
                }));

        // Template Settings Section
        containerEl.createEl('h3', { text: 'Template Settings' });

        new Setting(containerEl)
            .setName('Templates Folder')
            .setDesc('Folder to store templates in.')
            .addText(text => text
                .setPlaceholder('templates/deleometer')
                .setValue(this.plugin.settings.templatesFolder)
                .onChange(async (value) => {
                    this.plugin.settings.templatesFolder = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default Template')
            .setDesc('Default template to use for new analyses.')
            .addDropdown(dropdown => {
                dropdown.addOption('journal', 'Journal')
                dropdown.addOption('psychoanalysis', 'Psychoanalysis')
                dropdown.addOption('personality', 'Personality')
                dropdown.setValue(this.plugin.settings.defaultTemplate)
                dropdown.onChange(async (value) => {
                    this.plugin.settings.defaultTemplate = value;
                    await this.plugin.saveSettings();
                });
            });

        // Dashboard Settings Section
        containerEl.createEl('h3', { text: 'Dashboard Settings' });

        new Setting(containerEl)
            .setName('Default Time Range')
            .setDesc('Default time range to show in the dashboard.')
            .addDropdown(dropdown => {
                dropdown.addOption('7d', 'Last 7 Days')
                dropdown.addOption('30d', 'Last 30 Days')
                dropdown.addOption('90d', 'Last 90 Days')
                dropdown.addOption('all', 'All Time')
                dropdown.setValue(this.plugin.settings.defaultDashboardTimeRange)
                dropdown.onChange(async (value) => {
                    this.plugin.settings.defaultDashboardTimeRange = value as '7d' | '30d' | '90d' | 'all';
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Emotional Insights Dashboard')
            .setDesc('View interactive charts and insights from your journal entries.')
            .addButton(button => button.setButtonText('Open Dashboard')
                .setCta()
                .onClick(() => {
                    this.plugin.activateDashboardView();
                }));

        // Advanced AI Features Section
        containerEl.createEl('h3', { text: 'Advanced AI Features' });

        new Setting(containerEl)
            .setName('Enable Personalization')
            .setDesc('Enable AI personalization based on your journaling patterns.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enablePersonalization)
                .onChange(async (value) => {
                    this.plugin.settings.enablePersonalization = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Feedback Collection')
            .setDesc('Allow the plugin to collect your feedback on analysis results to improve future analyses.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.feedbackCollection)
                .onChange(async (value) => {
                    this.plugin.settings.feedbackCollection = value;
                    await this.plugin.saveSettings();
                }));

        if (VoiceJournaling.isSupported()) {
            new Setting(containerEl)
                .setName('Enable Voice Journaling')
                .setDesc('Enable voice recording and transcription for journal entries.')
                .addToggle(toggle => toggle.setValue(this.plugin.settings.voiceAnalysis)
                    .onChange(async (value) => {
                        this.plugin.settings.voiceAnalysis = value;
                        await this.plugin.saveSettings();
                    }));
        }

        // Web API Settings Section
        containerEl.createEl('h3', { text: 'Web API Settings' });

        new Setting(containerEl)
            .setName('Enable Web API')
            .setDesc('Enable the web API for third-party applications.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.webApiEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.webApiEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Web API Port')
            .setDesc('The port to use for the web API server.')
            .addText(text => text
                .setPlaceholder('3000')
                .setValue(this.plugin.settings.webApiPort.toString())
                .onChange(async (value) => {
                    const port = parseInt(value);
                    if (!isNaN(port) && port > 0 && port < 65536) {
                        this.plugin.settings.webApiPort = port;
                        await this.plugin.saveSettings();
                    }
                }));

        new Setting(containerEl)
            .setName('Web API Key')
            .setDesc('The API key for authenticating third-party applications.')
            .addText(text => text
                .setPlaceholder('Generate a secure API key')
                .setValue(this.plugin.settings.webApiKey)
                .onChange(async (value) => {
                    this.plugin.settings.webApiKey = value;
                    await this.plugin.saveSettings();
                }));

        // Mobile Adapter Settings Section
        containerEl.createEl('h3', { text: 'Mobile Adapter Settings' });

        new Setting(containerEl)
            .setName('Enable Mobile Adapter')
            .setDesc('Enable the mobile adapter for syncing with mobile apps.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.mobileAdapterEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.mobileAdapterEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Sync Interval')
            .setDesc('The interval (in milliseconds) for syncing with mobile apps.')
            .addText(text => text
                .setPlaceholder('60000')
                .setValue(this.plugin.settings.mobileSyncInterval.toString())
                .onChange(async (value) => {
                    const interval = parseInt(value);
                    if (!isNaN(interval) && interval > 0) {
                        this.plugin.settings.mobileSyncInterval = interval;
                        await this.plugin.saveSettings();
                    }
                }));

        // Research Module Settings Section
        containerEl.createEl('h3', { text: 'Research Module Settings' });

        new Setting(containerEl)
            .setName('Enable Data Collection')
            .setDesc('Enable anonymous data collection for research purposes.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.dataCollectionEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.dataCollectionEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Export Batch Size')
            .setDesc('The number of entries to export in a batch.')
            .addText(text => text
                .setPlaceholder('10')
                .setValue(this.plugin.settings.exportBatchSize.toString())
                .onChange(async (value) => {
                    const batchSize = parseInt(value);
                    if (!isNaN(batchSize) && batchSize > 0) {
                        this.plugin.settings.exportBatchSize = batchSize;
                        await this.plugin.saveSettings();
                    }
                }));

        // Business Model Settings Section
        containerEl.createEl('h3', { text: 'License Settings' });

        new Setting(containerEl)
            .setName('License Key')
            .setDesc('Enter your license key to unlock premium features.')
            .addText(text => text
                .setPlaceholder('Enter license key')
                .setValue(this.plugin.settings.licenseKey)
                .onChange(async (value) => {
                    this.plugin.settings.licenseKey = value;
                    await this.plugin.saveSettings();
                }));

        // Enhanced Analysis Settings Section
        containerEl.createEl('h3', { text: 'Enhanced Analysis Settings' });

        new Setting(containerEl)
            .setName('Enable Enhanced Analysis')
            .setDesc('Enable deep analysis using Freudian, Lacanian, Deleuzian, and Irigarayian frameworks.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableEnhancedAnalysis)
                .onChange(async (value) => {
                    this.plugin.settings.enableEnhancedAnalysis = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable User Profiling')
            .setDesc('Enable user profiling to personalize analysis based on your patterns.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableUserProfiling)
                .onChange(async (value) => {
                    this.plugin.settings.enableUserProfiling = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Adaptive Learning')
            .setDesc('Enable adaptive learning to improve analysis over time.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableAdaptiveLearning)
                .onChange(async (value) => {
                    this.plugin.settings.enableAdaptiveLearning = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Irigarayian Analysis')
            .setDesc('Enable analysis using Luce Irigaray\'s theoretical framework.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableIrigarayianAnalysis)
                .onChange(async (value) => {
                    this.plugin.settings.enableIrigarayianAnalysis = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Tacktical Methodology')
            .setDesc('Enable analysis using Louisa Bufardeci\'s Tacktical Methodology.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableTackticalMethodology)
                .onChange(async (value) => {
                    this.plugin.settings.enableTackticalMethodology = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Artistic Analysis')
            .setDesc('Enable analysis of visual art and music files.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableArtisticAnalysis)
                .onChange(async (value) => {
                    this.plugin.settings.enableArtisticAnalysis = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Adaptive Journaling Prompts')
            .setDesc('Enable adaptive journaling prompts that learn from your writing patterns.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableAdaptiveJournalingPrompts)
                .onChange(async (value) => {
                    this.plugin.settings.enableAdaptiveJournalingPrompts = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Next Steps Recommendations')
            .setDesc('Enable personalized recommendations for next steps based on analysis.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableNextStepsRecommendations)
                .onChange(async (value) => {
                    this.plugin.settings.enableNextStepsRecommendations = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Next Steps Categories')
            .setDesc('Select which categories of next steps to include in recommendations.')
            .addDropdown(dropdown => {
                dropdown.addOption('all', 'All Categories')
                dropdown.addOption('emotional', 'Emotional Only')
                dropdown.addOption('cognitive', 'Cognitive Only')
                dropdown.addOption('behavioral', 'Behavioral Only')
                dropdown.addOption('relational', 'Relational Only')
                dropdown.addOption('spiritual', 'Spiritual Only')
                dropdown.addOption('creative', 'Creative Only')
                dropdown.setValue(this.plugin.settings.nextStepsCategories.length === 6 ? 'all' : this.plugin.settings.nextStepsCategories[0] || 'all')
                dropdown.onChange(async (value) => {
                    if (value === 'all') {
                        this.plugin.settings.nextStepsCategories = ['emotional', 'cognitive', 'behavioral', 'relational', 'spiritual', 'creative'];
                    } else {
                        this.plugin.settings.nextStepsCategories = [value as 'emotional' | 'cognitive' | 'behavioral' | 'relational' | 'spiritual' | 'creative'];
                    }
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Detail Level')
            .setDesc('Set the level of detail for analysis.')
            .addDropdown(dropdown => {
                dropdown.addOption('basic', 'Basic')
                dropdown.addOption('detailed', 'Detailed')
                dropdown.addOption('comprehensive', 'Comprehensive')
                dropdown.setValue(this.plugin.settings.detailLevel)
                dropdown.onChange(async (value) => {
                    this.plugin.settings.detailLevel = value as 'basic' | 'detailed' | 'comprehensive';
                    await this.plugin.saveSettings();
                });
            });

        new Setting(containerEl)
            .setName('Theoretical Frameworks')
            .setDesc('Select which theoretical frameworks to use for analysis.')
            .addDropdown(dropdown => {
                dropdown.addOption('all', 'All Frameworks')
                dropdown.addOption('freudian', 'Freudian Only')
                dropdown.addOption('lacanian', 'Lacanian Only')
                dropdown.addOption('deleuzian', 'Deleuzian Only')
                dropdown.addOption('irigarayian', 'Irigarayian Only')
                dropdown.setValue(this.plugin.settings.theoreticalFrameworks.length === 4 ? 'all' : this.plugin.settings.theoreticalFrameworks[0] || 'all')
                dropdown.onChange(async (value) => {
                    if (value === 'all') {
                        this.plugin.settings.theoreticalFrameworks = ['freudian', 'lacanian', 'deleuzian', 'irigarayian'];
                    } else {
                        this.plugin.settings.theoreticalFrameworks = [value as 'freudian' | 'lacanian' | 'deleuzian' | 'irigarayian'];
                    }
                    await this.plugin.saveSettings();
                });
            });

        // Testing Section
        containerEl.createEl('h3', { text: 'Testing' });

        new Setting(containerEl)
            .setName('Run Tests')
            .setDesc('Run tests to verify the plugin is working correctly.')
            .addButton(button => button.setButtonText('Run Tests')
                .onClick(() => {
                    // Create a new test runner and run tests
                    const testRunner = new TestRunner(this.plugin);
                    testRunner.runAllTests();
                }));

        // History Management Section
        containerEl.createEl('h3', { text: 'History Management' });

        new Setting(containerEl)
            .setName('Export Analysis History')
            .setDesc('Save past analyses as a markdown file.')
            .addButton(button => button.setButtonText('Export')
                .setCta()
                .onClick(() => {
                    this.plugin.exportAnalysisHistory();
                }));

        new Setting(containerEl)
            .setName('Clear Analysis History')
            .setDesc('Erase all previous AI analyses.')
            .addButton(button => button.setButtonText('Clear')
                .setWarning()
                .onClick(async () => {
                    const confirmed = confirm('Are you sure you want to clear the analysis history? This action cannot be undone.');
                    if (confirmed) {
                        this.plugin.settings.analysisHistory = [];
                        await this.plugin.saveSettings();
                        new Notice('Analysis history cleared.');
                    }
                }));
    }
}
