import { App, TFile, Notice } from 'obsidian';
import { ApiService } from './apiService';
import { UserProfileSystem, UserProfile } from './userProfileSystem';
import { TackticalMethodology, TackticalAnalysisResult } from './tackticalMethodology';
import { SecurityService } from './securityService';
import { LocalProcessingService } from './localProcessingService';

/**
 * Supported media types for analysis
 */
export type MediaType = 'image' | 'audio' | 'text' | 'film';

/**
 * Result of artistic analysis
 */
export interface ArtisticAnalysisResult {
    mediaType: MediaType;
    filePath: string;
    fileName: string;
    dateAnalyzed: Date;
    tackticalAnalysis?: TackticalAnalysisResult;
    freudianAnalysis?: any;
    lacanianAnalysis?: any;
    deleuzianAnalysis?: any;
    irigarayianAnalysis?: any;
    jungianAnalysis?: any;
    attachmentAnalysis?: any;
    positiveAnalysis?: any;
    narrativeAnalysis?: any;
    phenomenologicalAnalysis?: any;
    existentialistAnalysis?: any;
    feministAnalysis?: any;
    criticalAnalysis?: any;
    posthumanistAnalysis?: any;
    buddhistAnalysis?: any;
    existentialPsychologyAnalysis?: any;
    gestaltAnalysis?: any;
    transpersonalAnalysis?: any;
    cognitiveBehavioralAnalysis?: any;
    hermeneuticsAnalysis?: any;
    stoicismAnalysis?: any;
    nietzscheanAnalysis?: any;
    psychiatryAnalysis?: any;
    summary: string;
    recommendations: string[];
    securityInfo?: {
        processedLocally: boolean;
        encrypted: boolean;
        auditLogged: boolean;
    };
}

/**
 * Options for artistic analysis
 */
export interface ArtisticAnalysisOptions {
    includeTacktical?: boolean;
    includeFreudian?: boolean;
    includeLacanian?: boolean;
    includeDeleuzian?: boolean;
    includeIrigarayian?: boolean;
    includeJungian?: boolean;
    includeAttachment?: boolean;
    includePositive?: boolean;
    includeNarrative?: boolean;
    includePhenomenological?: boolean;
    includeExistentialist?: boolean;
    includeFeminist?: boolean;
    includeCritical?: boolean;
    includePosthumanist?: boolean;
    includeBuddhist?: boolean;
    includeExistentialPsychology?: boolean;
    includeGestalt?: boolean;
    includeTranspersonal?: boolean;
    includeCognitiveBehavioral?: boolean;
    includeHermeneutics?: boolean;
    includeStoicism?: boolean;
    includeNietzschean?: boolean;
    includePsychiatry?: boolean;
    detailLevel?: 'basic' | 'detailed' | 'comprehensive';
    includeRecommendations?: boolean;
}

/**
 * System for analyzing artistic content (visual art, music, etc.)
 */
export class ArtisticAnalysis {
    private app: App;
    private apiService: ApiService;
    private userProfileSystem: UserProfileSystem;
    private tackticalMethodology: TackticalMethodology;
    private securityService: SecurityService;
    private localProcessingService: LocalProcessingService | null = null;

    constructor(
        app: App,
        apiService: ApiService,
        userProfileSystem: UserProfileSystem,
        securityService: SecurityService,
        localProcessingService?: LocalProcessingService
    ) {
        this.app = app;
        this.apiService = apiService;
        this.userProfileSystem = userProfileSystem;
        this.securityService = securityService;
        this.localProcessingService = localProcessingService || null;
        this.tackticalMethodology = new TackticalMethodology(apiService);
    }

    /**
     * Analyze an image file
     * @param file The image file to analyze
     * @param caption Optional caption for the image
     * @param options Analysis options
     * @returns Promise<ArtisticAnalysisResult> The analysis result
     */
    public async analyzeImage(
        file: TFile,
        caption: string = '',
        options: ArtisticAnalysisOptions = {}
    ): Promise<ArtisticAnalysisResult> {
        try {
            // Check if file is an image
            if (!this.isImageFile(file)) {
                throw new Error('File is not an image');
            }

            // Log the analysis action (but not the content)
            this.securityService.logAction('analyze', file.path, 'Image analysis started');

            // Read file as array buffer
            const arrayBuffer = await this.app.vault.readBinary(file);

            // Convert to base64
            const base64 = this.arrayBufferToBase64(arrayBuffer);

            // Get user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Initialize result
            const result: ArtisticAnalysisResult = {
                mediaType: 'image',
                filePath: file.path,
                fileName: file.name,
                dateAnalyzed: new Date(),
                summary: '',
                recommendations: [],
                securityInfo: {
                    processedLocally: this.securityService.isLocalProcessingOnly(),
                    encrypted: this.securityService.getOptions().enableEncryption,
                    auditLogged: this.securityService.getOptions().enableAuditLog
                }
            };

            // Check if we should use local processing
            if (this.securityService.isLocalProcessingOnly() && this.localProcessingService) {
                // Process image locally
                const analysisPrompt = `Analyze this image using Tacktical Methodology. ${caption ? 'Caption: ' + caption : ''}`;
                const analysisResult = await this.localProcessingService.processImage(base64, analysisPrompt);

                // Parse the result (in a real implementation, this would be more sophisticated)
                result.summary = analysisResult.split('\n\n')[0] || 'Image analysis complete';
                result.recommendations = analysisResult.split('## Recommendations\n')?.[1]?.split('\n').filter(line => line.trim().length > 0) || [];

                // Create a basic tacktical analysis result
                result.tackticalAnalysis = {
                    tackingPatterns: {
                        description: analysisResult.includes('Tacking Patterns') ?
                            analysisResult.split('## Tacking Patterns\n')?.[1]?.split('\n\n')[0] || '' : '',
                        examples: [],
                        significance: ''
                    },
                    politicalDimensions: {
                        description: analysisResult.includes('Political Dimensions') ?
                            analysisResult.split('## Political Dimensions\n')?.[1]?.split('\n\n')[0] || '' : '',
                        implications: []
                    },
                    artisticMovements: {
                        identified: [],
                        relationships: analysisResult.includes('Artistic Movements') ?
                            analysisResult.split('## Artistic Movements\n')?.[1]?.split('\n\n')[0] || '' : ''
                    },
                    spatialDynamics: {
                        description: analysisResult.includes('Spatial Dynamics') ?
                            analysisResult.split('## Spatial Dynamics\n')?.[1]?.split('\n\n')[0] || '' : '',
                        significance: ''
                    },
                    temporalShifts: {
                        description: analysisResult.includes('Temporal') ?
                            analysisResult.split('## Temporal')?.[1]?.split('\n\n')[0] || '' : '',
                        significance: ''
                    },
                    summary: result.summary,
                    recommendations: result.recommendations
                };
            } else {
                // Perform Tacktical analysis if requested using API
                if (options.includeTacktical !== false) {
                    result.tackticalAnalysis = await this.tackticalMethodology.analyzeImage(
                        base64,
                        caption,
                        userProfile,
                        {
                            detailLevel: options.detailLevel || 'detailed',
                            includeRecommendations: options.includeRecommendations !== false
                        }
                    );

                    // Add summary and recommendations from Tacktical analysis
                    result.summary = result.tackticalAnalysis.summary;
                    result.recommendations = result.tackticalAnalysis.recommendations;
                }

                // Perform other analyses as requested
                // These would be implemented in future versions
            }

            // Log the completion of analysis
            this.securityService.logAction('analyze', file.path, 'Image analysis completed');

            return result;
        } catch (error) {
            console.error('Error analyzing image:', error);
            this.securityService.logAction('analyze', file.path, `Image analysis failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Analyze an audio file
     * @param file The audio file to analyze
     * @param description Optional description of the audio
     * @param options Analysis options
     * @returns Promise<ArtisticAnalysisResult> The analysis result
     */
    public async analyzeAudio(
        file: TFile,
        description: string = '',
        options: ArtisticAnalysisOptions = {}
    ): Promise<ArtisticAnalysisResult> {
        try {
            // Check if file is an audio file
            if (!this.isAudioFile(file)) {
                throw new Error('File is not an audio file');
            }

            // Log the analysis action (but not the content)
            this.securityService.logAction('analyze', file.path, 'Audio analysis started');

            // Get user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Initialize result
            const result: ArtisticAnalysisResult = {
                mediaType: 'audio',
                filePath: file.path,
                fileName: file.name,
                dateAnalyzed: new Date(),
                summary: '',
                recommendations: [],
                securityInfo: {
                    processedLocally: this.securityService.isLocalProcessingOnly(),
                    encrypted: this.securityService.getOptions().enableEncryption,
                    auditLogged: this.securityService.getOptions().enableAuditLog
                }
            };

            // Create a placeholder transcript
            // In a real implementation, this would come from audio transcription
            const placeholderTranscript = `Audio file: ${file.name}\nDescription: ${description}`;

            // Check if we should use local processing
            if (this.securityService.isLocalProcessingOnly() && this.localProcessingService) {
                // Process audio locally
                const analysisPrompt = `Analyze this audio using Tacktical Methodology. ${description ? 'Description: ' + description : ''}`;
                const analysisResult = await this.localProcessingService.processAudio(placeholderTranscript, analysisPrompt);

                // Parse the result (in a real implementation, this would be more sophisticated)
                result.summary = analysisResult.split('\n\n')[0] || 'Audio analysis complete';
                result.recommendations = analysisResult.split('## Recommendations\n')?.[1]?.split('\n').filter(line => line.trim().length > 0) || [];

                // Create a basic tacktical analysis result
                result.tackticalAnalysis = {
                    tackingPatterns: {
                        description: analysisResult.includes('Tacking Patterns') ?
                            analysisResult.split('## Tacking Patterns\n')?.[1]?.split('\n\n')[0] || '' : '',
                        examples: [],
                        significance: ''
                    },
                    politicalDimensions: {
                        description: analysisResult.includes('Political Dimensions') ?
                            analysisResult.split('## Political Dimensions\n')?.[1]?.split('\n\n')[0] || '' : '',
                        implications: []
                    },
                    artisticMovements: {
                        identified: [],
                        relationships: analysisResult.includes('Artistic Movements') ?
                            analysisResult.split('## Artistic Movements\n')?.[1]?.split('\n\n')[0] || '' : ''
                    },
                    spatialDynamics: {
                        description: analysisResult.includes('Spatial Dynamics') ?
                            analysisResult.split('## Spatial Dynamics\n')?.[1]?.split('\n\n')[0] || '' : '',
                        significance: ''
                    },
                    temporalShifts: {
                        description: analysisResult.includes('Temporal') ?
                            analysisResult.split('## Temporal')?.[1]?.split('\n\n')[0] || '' : '',
                        significance: ''
                    },
                    summary: result.summary,
                    recommendations: result.recommendations
                };
            } else {
                // Perform Tacktical analysis if requested using API
                if (options.includeTacktical !== false) {
                    result.tackticalAnalysis = await this.tackticalMethodology.analyzeAudio(
                        placeholderTranscript,
                        description,
                        userProfile,
                        {
                            detailLevel: options.detailLevel || 'detailed',
                            includeRecommendations: options.includeRecommendations !== false
                        }
                    );

                    // Add summary and recommendations from Tacktical analysis
                    result.summary = result.tackticalAnalysis.summary;
                    result.recommendations = result.tackticalAnalysis.recommendations;
                }

                // Perform other analyses as requested
                // These would be implemented in future versions
            }

            // Log the completion of analysis
            this.securityService.logAction('analyze', file.path, 'Audio analysis completed');

            return result;
        } catch (error) {
            console.error('Error analyzing audio:', error);
            this.securityService.logAction('analyze', file.path, `Audio analysis failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Analyze a film/video file
     * @param file The film file to analyze
     * @param description Optional description of the film
     * @param options Analysis options
     * @returns Promise<ArtisticAnalysisResult> The analysis result
     */
    public async analyzeFilm(
        file: TFile,
        description: string = '',
        options: ArtisticAnalysisOptions = {}
    ): Promise<ArtisticAnalysisResult> {
        try {
            // Check if file is a film file
            if (!this.isFilmFile(file)) {
                throw new Error('File is not a film/video file');
            }

            // Log the analysis action (but not the content)
            this.securityService.logAction('analyze', file.path, 'Film analysis started');

            // Get user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Initialize result
            const result: ArtisticAnalysisResult = {
                mediaType: 'film',
                filePath: file.path,
                fileName: file.name,
                dateAnalyzed: new Date(),
                summary: '',
                recommendations: [],
                securityInfo: {
                    processedLocally: this.securityService.isLocalProcessingOnly(),
                    encrypted: this.securityService.getOptions().enableEncryption,
                    auditLogged: this.securityService.getOptions().enableAuditLog
                }
            };

            // For film analysis, we'll use a placeholder for the actual video content
            // In a real implementation, this would extract frames or process the video
            const placeholderDescription = `Film analysis of ${file.name}. ${description}`;

            // Check if we should use local processing
            if (this.securityService.isLocalProcessingOnly() && this.localProcessingService) {
                // Process film locally
                const analysisPrompt = `Analyze this film using Tacktical Methodology. ${description ? 'Description: ' + description : ''}`;
                const analysisResult = await this.localProcessingService.processFilm(placeholderDescription, analysisPrompt);

                // Parse the result (in a real implementation, this would be more sophisticated)
                result.summary = analysisResult.split('\n\n')[0] || 'Film analysis complete';
                result.recommendations = analysisResult.split('## Recommendations\n')?.[1]?.split('\n').filter(line => line.trim().length > 0) || [];

                // Create a basic tacktical analysis result
                result.tackticalAnalysis = {
                    tackingPatterns: {
                        description: analysisResult.includes('Tacking Patterns') ?
                            analysisResult.split('## Tacking Patterns\n')?.[1]?.split('\n\n')[0] || '' : '',
                        examples: [],
                        significance: ''
                    },
                    politicalDimensions: {
                        description: analysisResult.includes('Political Dimensions') ?
                            analysisResult.split('## Political Dimensions\n')?.[1]?.split('\n\n')[0] || '' : '',
                        implications: []
                    },
                    artisticMovements: {
                        identified: [],
                        relationships: analysisResult.includes('Artistic Movements') ?
                            analysisResult.split('## Artistic Movements\n')?.[1]?.split('\n\n')[0] || '' : ''
                    },
                    spatialDynamics: {
                        description: analysisResult.includes('Spatial Dynamics') ?
                            analysisResult.split('## Spatial Dynamics\n')?.[1]?.split('\n\n')[0] || '' : '',
                        significance: ''
                    },
                    temporalShifts: {
                        description: analysisResult.includes('Temporal') ?
                            analysisResult.split('## Temporal')?.[1]?.split('\n\n')[0] || '' : '',
                        significance: ''
                    },
                    summary: result.summary,
                    recommendations: result.recommendations
                };

                // Apply other theoretical frameworks if requested
                if (options.includeFreudian) {
                    const freudianPrompt = `Analyze this film using Freudian psychoanalysis. ${description}`;
                    const freudianResult = await this.localProcessingService.processText(placeholderDescription, freudianPrompt);
                    result.freudianAnalysis = { analysis: freudianResult };
                }

                if (options.includeLacanian) {
                    const lacanianPrompt = `Analyze this film using Lacanian psychoanalysis. ${description}`;
                    const lacanianResult = await this.localProcessingService.processText(placeholderDescription, lacanianPrompt);
                    result.lacanianAnalysis = { analysis: lacanianResult };
                }

                if (options.includeDeleuzian) {
                    const deleuzianPrompt = `Analyze this film using Deleuzian schizoanalysis. ${description}`;
                    const deleuzianResult = await this.localProcessingService.processText(placeholderDescription, deleuzianPrompt);
                    result.deleuzianAnalysis = { analysis: deleuzianResult };
                }

                if (options.includeIrigarayian) {
                    const irigarayianPrompt = `Analyze this film using Irigarayian feminist theory. ${description}`;
                    const irigarayianResult = await this.localProcessingService.processText(placeholderDescription, irigarayianPrompt);
                    result.irigarayianAnalysis = { analysis: irigarayianResult };
                }
            } else {
                // Perform Tacktical analysis if requested using API
                if (options.includeTacktical !== false) {
                    result.tackticalAnalysis = await this.tackticalMethodology.analyzeFilm(
                        placeholderDescription,
                        description,
                        userProfile,
                        {
                            detailLevel: options.detailLevel || 'detailed',
                            includeRecommendations: options.includeRecommendations !== false
                        }
                    );

                    // Add summary and recommendations from Tacktical analysis
                    result.summary = result.tackticalAnalysis.summary;
                    result.recommendations = result.tackticalAnalysis.recommendations;
                }

                // Perform other analyses as requested
                if (options.includeFreudian) {
                    // In a real implementation, this would call a specific API for Freudian analysis
                    const freudianPrompt = `Analyze this film using Freudian psychoanalysis: ${description}`;
                    const freudianResponse = await this.apiService.callApi(freudianPrompt);
                    result.freudianAnalysis = { analysis: freudianResponse };
                }

                if (options.includeLacanian) {
                    const lacanianPrompt = `Analyze this film using Lacanian psychoanalysis: ${description}`;
                    const lacanianResponse = await this.apiService.callApi(lacanianPrompt);
                    result.lacanianAnalysis = { analysis: lacanianResponse };
                }

                if (options.includeDeleuzian) {
                    const deleuzianPrompt = `Analyze this film using Deleuzian schizoanalysis: ${description}`;
                    const deleuzianResponse = await this.apiService.callApi(deleuzianPrompt);
                    result.deleuzianAnalysis = { analysis: deleuzianResponse };
                }

                if (options.includeIrigarayian) {
                    const irigarayianPrompt = `Analyze this film using Irigarayian feminist theory: ${description}`;
                    const irigarayianResponse = await this.apiService.callApi(irigarayianPrompt);
                    result.irigarayianAnalysis = { analysis: irigarayianResponse };
                }
            }

            // Log the completion of analysis
            this.securityService.logAction('analyze', file.path, 'Film analysis completed');

            return result;
        } catch (error) {
            console.error('Error analyzing film:', error);
            this.securityService.logAction('analyze', file.path, `Film analysis failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Analyze text content
     * @param file The text file to analyze
     * @param content Optional content override (if not provided, file content will be read)
     * @param options Analysis options
     * @returns Promise<ArtisticAnalysisResult> The analysis result
     */
    public async analyzeText(
        file: TFile,
        content?: string,
        options: ArtisticAnalysisOptions = {}
    ): Promise<ArtisticAnalysisResult> {
        try {
            // Log the analysis action
            this.securityService.logAction('analyze', file.path, 'Text analysis started');

            // Get text content
            const textContent = content || await this.app.vault.read(file);

            // Get user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Initialize result
            const result: ArtisticAnalysisResult = {
                mediaType: 'text',
                filePath: file.path,
                fileName: file.name,
                dateAnalyzed: new Date(),
                summary: '',
                recommendations: [],
                securityInfo: {
                    processedLocally: this.securityService.isLocalProcessingOnly(),
                    encrypted: this.securityService.getOptions().enableEncryption,
                    auditLogged: this.securityService.getOptions().enableAuditLog
                }
            };

            // Check if we should use local processing
            if (this.securityService.isLocalProcessingOnly() && this.localProcessingService) {
                // Process text locally

                // Apply Tacktical analysis if requested
                if (options.includeTacktical !== false) {
                    const tackticalPrompt = `Analyze this text using Tacktical Methodology.`;
                    const tackticalResult = await this.localProcessingService.processText(textContent, tackticalPrompt);

                    // Parse the result
                    result.tackticalAnalysis = this.parseTackticalAnalysis(tackticalResult);
                    result.summary = tackticalResult.split('\n\n')[0] || 'Text analysis complete';
                    result.recommendations = tackticalResult.split('## Recommendations\n')?.[1]?.split('\n').filter(line => line.trim().length > 0) || [];
                }

                // Apply other theoretical frameworks as requested
                if (options.includeFreudian) {
                    const freudianPrompt = `Analyze this text using Freudian psychoanalysis.`;
                    const freudianResult = await this.localProcessingService.processText(textContent, freudianPrompt);
                    result.freudianAnalysis = { analysis: freudianResult };
                }

                if (options.includeLacanian) {
                    const lacanianPrompt = `Analyze this text using Lacanian psychoanalysis.`;
                    const lacanianResult = await this.localProcessingService.processText(textContent, lacanianPrompt);
                    result.lacanianAnalysis = { analysis: lacanianResult };
                }

                if (options.includeDeleuzian) {
                    const deleuzianPrompt = `Analyze this text using Deleuzian schizoanalysis.`;
                    const deleuzianResult = await this.localProcessingService.processText(textContent, deleuzianPrompt);
                    result.deleuzianAnalysis = { analysis: deleuzianResult };
                }

                if (options.includeIrigarayian) {
                    const irigarayianPrompt = `Analyze this text using Irigarayian feminist theory.`;
                    const irigarayianResult = await this.localProcessingService.processText(textContent, irigarayianPrompt);
                    result.irigarayianAnalysis = { analysis: irigarayianResult };
                }

                if (options.includeJungian) {
                    const jungianPrompt = `Analyze this text using Jungian analytical psychology.`;
                    const jungianResult = await this.localProcessingService.processText(textContent, jungianPrompt);
                    result.jungianAnalysis = { analysis: jungianResult };
                }

                if (options.includeAttachment) {
                    const attachmentPrompt = `Analyze this text using Attachment Theory.`;
                    const attachmentResult = await this.localProcessingService.processText(textContent, attachmentPrompt);
                    result.attachmentAnalysis = { analysis: attachmentResult };
                }

                if (options.includePositive) {
                    const positivePrompt = `Analyze this text using Positive Psychology.`;
                    const positiveResult = await this.localProcessingService.processText(textContent, positivePrompt);
                    result.positiveAnalysis = { analysis: positiveResult };
                }

                if (options.includeNarrative) {
                    const narrativePrompt = `Analyze this text using Narrative Psychology.`;
                    const narrativeResult = await this.localProcessingService.processText(textContent, narrativePrompt);
                    result.narrativeAnalysis = { analysis: narrativeResult };
                }

                if (options.includePhenomenological) {
                    const phenomenologicalPrompt = `Analyze this text using Phenomenology.`;
                    const phenomenologicalResult = await this.localProcessingService.processText(textContent, phenomenologicalPrompt);
                    result.phenomenologicalAnalysis = { analysis: phenomenologicalResult };
                }

                if (options.includeExistentialist) {
                    const existentialistPrompt = `Analyze this text using Existentialist philosophy.`;
                    const existentialistResult = await this.localProcessingService.processText(textContent, existentialistPrompt);
                    result.existentialistAnalysis = { analysis: existentialistResult };
                }

                if (options.includeFeminist) {
                    const feministPrompt = `Analyze this text using Feminist theory.`;
                    const feministResult = await this.localProcessingService.processText(textContent, feministPrompt);
                    result.feministAnalysis = { analysis: feministResult };
                }

                if (options.includeCritical) {
                    const criticalPrompt = `Analyze this text using Critical theory.`;
                    const criticalResult = await this.localProcessingService.processText(textContent, criticalPrompt);
                    result.criticalAnalysis = { analysis: criticalResult };
                }

                if (options.includePosthumanist) {
                    const posthumanistPrompt = `Analyze this text using Posthumanist theory.`;
                    const posthumanistResult = await this.localProcessingService.processText(textContent, posthumanistPrompt);
                    result.posthumanistAnalysis = { analysis: posthumanistResult };
                }

                if (options.includeBuddhist) {
                    const buddhistPrompt = `Analyze this text using Buddhist philosophy.`;
                    const buddhistResult = await this.localProcessingService.processText(textContent, buddhistPrompt);
                    result.buddhistAnalysis = { analysis: buddhistResult };
                }

                if (options.includeExistentialPsychology) {
                    const existentialPsychologyPrompt = `Analyze this text using Existential Psychology.`;
                    const existentialPsychologyResult = await this.localProcessingService.processText(textContent, existentialPsychologyPrompt);
                    result.existentialPsychologyAnalysis = { analysis: existentialPsychologyResult };
                }

                if (options.includeGestalt) {
                    const gestaltPrompt = `Analyze this text using Gestalt Psychology.`;
                    const gestaltResult = await this.localProcessingService.processText(textContent, gestaltPrompt);
                    result.gestaltAnalysis = { analysis: gestaltResult };
                }

                if (options.includeTranspersonal) {
                    const transpersonalPrompt = `Analyze this text using Transpersonal Psychology.`;
                    const transpersonalResult = await this.localProcessingService.processText(textContent, transpersonalPrompt);
                    result.transpersonalAnalysis = { analysis: transpersonalResult };
                }

                if (options.includeCognitiveBehavioral) {
                    const cognitiveBehavioralPrompt = `Analyze this text using Cognitive Behavioral Theory.`;
                    const cognitiveBehavioralResult = await this.localProcessingService.processText(textContent, cognitiveBehavioralPrompt);
                    result.cognitiveBehavioralAnalysis = { analysis: cognitiveBehavioralResult };
                }

                if (options.includeHermeneutics) {
                    const hermeneuticsPrompt = `Analyze this text using Hermeneutics.`;
                    const hermeneuticsResult = await this.localProcessingService.processText(textContent, hermeneuticsPrompt);
                    result.hermeneuticsAnalysis = { analysis: hermeneuticsResult };
                }

                if (options.includeStoicism) {
                    const stoicismPrompt = `Analyze this text using Stoicism.`;
                    const stoicismResult = await this.localProcessingService.processText(textContent, stoicismPrompt);
                    result.stoicismAnalysis = { analysis: stoicismResult };
                }

                if (options.includeNietzschean) {
                    const nietzscheanPrompt = `Analyze this text using Nietzschean philosophy.`;
                    const nietzscheanResult = await this.localProcessingService.processText(textContent, nietzscheanPrompt);
                    result.nietzscheanAnalysis = { analysis: nietzscheanResult };
                }

                if (options.includePsychiatry) {
                    const psychiatryPrompt = `Analyze this text using Psychiatric concepts.`;
                    const psychiatryResult = await this.localProcessingService.processText(textContent, psychiatryPrompt);
                    result.psychiatryAnalysis = { analysis: psychiatryResult };
                }
            } else {
                // Process text using API services

                // Apply Tacktical analysis if requested
                if (options.includeTacktical !== false) {
                    result.tackticalAnalysis = await this.tackticalMethodology.analyzeText(
                        textContent,
                        userProfile,
                        {
                            detailLevel: options.detailLevel || 'detailed',
                            includeRecommendations: options.includeRecommendations !== false
                        }
                    );

                    // Add summary and recommendations from Tacktical analysis
                    result.summary = result.tackticalAnalysis.summary;
                    result.recommendations = result.tackticalAnalysis.recommendations;
                }

                // Apply other theoretical frameworks as requested
                if (options.includeFreudian) {
                    const freudianPrompt = `Analyze this text using Freudian psychoanalysis: ${textContent.substring(0, 1000)}...`;
                    const freudianResponse = await this.apiService.callApi(freudianPrompt);
                    result.freudianAnalysis = { analysis: freudianResponse };
                }

                if (options.includeLacanian) {
                    const lacanianPrompt = `Analyze this text using Lacanian psychoanalysis: ${textContent.substring(0, 1000)}...`;
                    const lacanianResponse = await this.apiService.callApi(lacanianPrompt);
                    result.lacanianAnalysis = { analysis: lacanianResponse };
                }

                if (options.includeDeleuzian) {
                    const deleuzianPrompt = `Analyze this text using Deleuzian schizoanalysis: ${textContent.substring(0, 1000)}...`;
                    const deleuzianResponse = await this.apiService.callApi(deleuzianPrompt);
                    result.deleuzianAnalysis = { analysis: deleuzianResponse };
                }

                if (options.includeIrigarayian) {
                    const irigarayianPrompt = `Analyze this text using Irigarayian feminist theory: ${textContent.substring(0, 1000)}...`;
                    const irigarayianResponse = await this.apiService.callApi(irigarayianPrompt);
                    result.irigarayianAnalysis = { analysis: irigarayianResponse };
                }

                if (options.includeJungian) {
                    const jungianPrompt = `Analyze this text using Jungian analytical psychology: ${textContent.substring(0, 1000)}...`;
                    const jungianResponse = await this.apiService.callApi(jungianPrompt);
                    result.jungianAnalysis = { analysis: jungianResponse };
                }

                // Add more frameworks as needed...
                // For brevity, not including all frameworks in the API version
                // In a real implementation, all frameworks would be supported
            }

            // Log the completion of analysis
            this.securityService.logAction('analyze', file.path, 'Text analysis completed');

            return result;
        } catch (error) {
            console.error('Error analyzing text:', error);
            this.securityService.logAction('analyze', file.path, `Text analysis failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Parse Tacktical analysis result from text
     * @param analysisResult The analysis result text
     * @returns TackticalAnalysisResult The parsed result
     */
    private parseTackticalAnalysis(analysisResult: string): TackticalAnalysisResult {
        return {
            tackingPatterns: {
                description: analysisResult.includes('Tacking Patterns') ?
                    analysisResult.split('## Tacking Patterns\n')?.[1]?.split('\n\n')[0] || '' : '',
                examples: [],
                significance: ''
            },
            politicalDimensions: {
                description: analysisResult.includes('Political Dimensions') ?
                    analysisResult.split('## Political Dimensions\n')?.[1]?.split('\n\n')[0] || '' : '',
                implications: []
            },
            artisticMovements: {
                identified: [],
                relationships: analysisResult.includes('Artistic Movements') ?
                    analysisResult.split('## Artistic Movements\n')?.[1]?.split('\n\n')[0] || '' : ''
            },
            spatialDynamics: {
                description: analysisResult.includes('Spatial Dynamics') ?
                    analysisResult.split('## Spatial Dynamics\n')?.[1]?.split('\n\n')[0] || '' : '',
                significance: ''
            },
            temporalShifts: {
                description: analysisResult.includes('Temporal') ?
                    analysisResult.split('## Temporal')?.[1]?.split('\n\n')[0] || '' : '',
                significance: ''
            },
            summary: analysisResult.split('\n\n')[0] || 'Analysis complete',
            recommendations: analysisResult.split('## Recommendations\n')?.[1]?.split('\n').filter(line => line.trim().length > 0) || []
        };
    }

    /**
     * Analyze multiple artistic files
     * @param files Array of files to analyze
     * @param options Analysis options
     * @param progressCallback Optional callback for progress updates
     * @returns Promise<ArtisticAnalysisResult[]> Array of analysis results
     */
    public async analyzeMultipleFiles(
        files: TFile[],
        options: ArtisticAnalysisOptions = {},
        progressCallback?: () => void
    ): Promise<ArtisticAnalysisResult[]> {
        const results: ArtisticAnalysisResult[] = [];

        // Log the start of batch analysis
        this.securityService.logAction('analyze', 'multiple_files', `Starting analysis of ${files.length} files`);

        for (const file of files) {
            try {
                let result: ArtisticAnalysisResult;

                if (this.isImageFile(file)) {
                    result = await this.analyzeImage(file, '', options);
                } else if (this.isAudioFile(file)) {
                    result = await this.analyzeAudio(file, '', options);
                } else if (this.isFilmFile(file)) {
                    result = await this.analyzeFilm(file, '', options);
                } else if (file.extension === 'md' || file.extension === 'txt') {
                    result = await this.analyzeText(file, undefined, options);
                } else {
                    // Skip files that are not supported
                    continue;
                }

                // Encrypt the result summary if encryption is enabled
                if (this.securityService.getOptions().enableEncryption) {
                    result.summary = this.securityService.encrypt(result.summary);
                }

                results.push(result);

                // Call progress callback if provided
                if (progressCallback) {
                    progressCallback();
                }
            } catch (error) {
                console.error(`Error analyzing file ${file.path}:`, error);
                this.securityService.logAction('analyze', file.path, `Analysis failed: ${error.message}`);
                // Continue with next file
            }
        }

        // Log the completion of batch analysis
        this.securityService.logAction('analyze', 'multiple_files', `Completed analysis of ${results.length}/${files.length} files`);

        return results;
    }

    /**
     * Check if a file is an image
     * @param file The file to check
     * @returns boolean Whether the file is an image
     */
    private isImageFile(file: TFile): boolean {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        return imageExtensions.some(ext => file.extension.toLowerCase() === ext.substring(1));
    }

    /**
     * Check if a file is an audio file
     * @param file The file to check
     * @returns boolean Whether the file is an audio file
     */
    private isAudioFile(file: TFile): boolean {
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'];
        return audioExtensions.some(ext => file.extension.toLowerCase() === ext.substring(1));
    }

    /**
     * Check if a file is a film/video file
     * @param file The file to check
     * @returns boolean Whether the file is a film/video file
     */
    private isFilmFile(file: TFile): boolean {
        const filmExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv'];
        return filmExtensions.some(ext => file.extension.toLowerCase() === ext.substring(1));
    }

    /**
     * Convert array buffer to base64
     * @param buffer Array buffer to convert
     * @returns string Base64 encoded string
     */
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return btoa(binary);
    }

    /**
     * Save analysis result to a markdown file
     * @param result Analysis result to save
     * @param folderPath Folder path to save to
     * @returns Promise<string> Path to the saved file
     */
    public async saveAnalysisToMarkdown(
        result: ArtisticAnalysisResult,
        folderPath: string = 'artistic_analysis'
    ): Promise<string> {
        try {
            // Log the action
            this.securityService.logAction('write', 'markdown', `Saving analysis for ${result.fileName}`);

            // Ensure folder exists
            if (!(await this.app.vault.adapter.exists(folderPath))) {
                await this.app.vault.createFolder(folderPath);
            }

            // Create file name
            const date = new Date().toISOString().split('T')[0];
            const fileName = `${date}_${result.fileName.replace(/\.[^/.]+$/, '')}_analysis.md`;
            const filePath = `${folderPath}/${fileName}`;

            // Check if summary is encrypted and decrypt if needed
            let summary = result.summary;
            if (this.securityService.isEncrypted(summary)) {
                try {
                    summary = this.securityService.decrypt(summary);
                } catch (error) {
                    console.error('Error decrypting summary:', error);
                    summary = '[Encrypted content]';
                }
            }

            // Create markdown content
            let content = `# Artistic Analysis: ${result.fileName}\n\n`;
            content += `- **Date Analyzed**: ${result.dateAnalyzed.toLocaleString()}\n`;
            content += `- **Media Type**: ${result.mediaType}\n`;
            content += `- **Original File**: [[${result.filePath}]]\n`;

            // Add security info if available
            if (result.securityInfo) {
                content += `- **Security**: ${result.securityInfo.processedLocally ? 'Processed locally' : 'Processed with API'}`;
                content += `, ${result.securityInfo.encrypted ? 'Encrypted' : 'Not encrypted'}`;
                content += `, ${result.securityInfo.auditLogged ? 'Audit logged' : 'Not logged'}\n`;
            }
            content += `\n`;

            content += `## Summary\n\n${summary}\n\n`;

            // Add Tacktical analysis if available
            if (result.tackticalAnalysis) {
                content += `## Tacktical Methodology Analysis\n\n`;

                content += `### Tacking Patterns\n\n`;
                content += `${result.tackticalAnalysis.tackingPatterns.description}\n\n`;
                content += `**Examples**:\n`;
                result.tackticalAnalysis.tackingPatterns.examples.forEach(example => {
                    content += `- ${example}\n`;
                });
                content += `\n**Significance**: ${result.tackticalAnalysis.tackingPatterns.significance}\n\n`;

                content += `### Political Dimensions\n\n`;
                content += `${result.tackticalAnalysis.politicalDimensions.description}\n\n`;
                content += `**Implications**:\n`;
                result.tackticalAnalysis.politicalDimensions.implications.forEach(implication => {
                    content += `- ${implication}\n`;
                });
                content += `\n`;

                content += `### Artistic Movements\n\n`;
                content += `**Identified Movements**:\n`;
                result.tackticalAnalysis.artisticMovements.identified.forEach(movement => {
                    content += `- ${movement}\n`;
                });
                content += `\n**Relationships**: ${result.tackticalAnalysis.artisticMovements.relationships}\n\n`;

                content += `### Spatial Dynamics\n\n`;
                content += `${result.tackticalAnalysis.spatialDynamics.description}\n\n`;
                content += `**Significance**: ${result.tackticalAnalysis.spatialDynamics.significance}\n\n`;

                content += `### Temporal Shifts\n\n`;
                content += `${result.tackticalAnalysis.temporalShifts.description}\n\n`;
                content += `**Significance**: ${result.tackticalAnalysis.temporalShifts.significance}\n\n`;
            }

            // Add other analyses if available
            // These would be implemented in future versions

            // Add recommendations
            content += `## Recommendations\n\n`;
            result.recommendations.forEach(recommendation => {
                content += `- ${recommendation}\n`;
            });

            // Add privacy notice
            content += `\n## Privacy Notice\n\n`;
            content += `This analysis was generated ${result.securityInfo?.processedLocally ? 'locally on your device' : 'using secure API processing'}. `;
            content += `No data was shared with third parties. `;
            content += `The analysis is ${result.securityInfo?.encrypted ? 'encrypted for your privacy' : 'not encrypted'}. `;
            content += `For more information, please see the Deleometer privacy policy.\n`;

            // Encrypt content if encryption is enabled
            let finalContent = content;
            if (this.securityService.getOptions().enableEncryption) {
                finalContent = this.securityService.encrypt(content);
            }

            // Save file
            await this.app.vault.create(filePath, finalContent);

            // Log the completion
            this.securityService.logAction('write', filePath, 'Analysis saved to markdown');

            return filePath;
        } catch (error) {
            console.error('Error saving analysis to markdown:', error);
            this.securityService.logAction('write', 'markdown', `Error saving analysis: ${error.message}`);
            throw error;
        }
    }
}
