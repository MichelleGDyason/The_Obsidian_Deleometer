import { App, TFile, TFolder, Vault } from 'obsidian';
import { EnhancedAnalysisFrameworks } from './enhancedAnalysisFrameworks';
import { UserProfileSystem } from './userProfileSystem';
import { EnhancedAnalysisResult } from './enhancedAnalysisFrameworks';

/**
 * Represents the scope of analysis
 */
export type AnalysisScope = 'note' | 'file' | 'folder' | 'vault';

/**
 * Represents analysis options
 */
export interface AnalysisOptions {
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
    includeNextSteps?: boolean;
    detailLevel?: 'basic' | 'detailed' | 'comprehensive';
    maxEntries?: number; // For folder and vault analysis
    dateRange?: {
        start: Date;
        end: Date;
    };
    searchTerm?: string; // For filtering content
}

/**
 * Represents the result of a multi-entry analysis
 */
export interface MultiEntryAnalysisResult {
    individualResults: {
        path: string;
        result: EnhancedAnalysisResult;
    }[];
    aggregateResult: EnhancedAnalysisResult;
    metadata: {
        totalEntries: number;
        analyzedEntries: number;
        dateRange: {
            start: Date;
            end: Date;
        };
        searchTerm?: string;
    };
}

/**
 * Provides functionality to analyze different scopes of content
 */
export class AnalysisScope {
    /**
     * Analyze multiple files
     * @param filePaths Array of file paths to analyze
     * @param options Analysis options
     * @returns Promise<MultiEntryAnalysisResult> The analysis result
     */
    public async analyzeMultipleFiles(
        filePaths: string[],
        options: AnalysisOptions = {},
        progressCallback?: () => void
    ): Promise<MultiEntryAnalysisResult> {
        try {
            // Get the user profile
            const userProfile = this.userProfileSystem.getUserProfile();

            // Analyze each file
            const results = await Promise.all(
                filePaths.map(async (filePath) => {
                    try {
                        const file = this.app.vault.getAbstractFileByPath(filePath);

                        if (!file || !(file instanceof TFile)) {
                            return {
                                path: filePath,
                                result: null,
                                error: `File not found: ${filePath}`
                            };
                        }

                        const content = await this.app.vault.read(file);
                        const result = await this.enhancedAnalysisFrameworks.analyzeText(content, userProfile, options);

                        // Call progress callback if provided
                        if (progressCallback) {
                            progressCallback();
                        }

                        return {
                            path: filePath,
                            result: result,
                            error: null
                        };
                    } catch (error) {
                        console.error(`Error analyzing file ${filePath}:`, error);

                        // Call progress callback even on error
                        if (progressCallback) {
                            progressCallback();
                        }

                        return {
                            path: filePath,
                            result: null,
                            error: error.message
                        };
                    }
                })
            );

            // Filter out failed analyses
            const successfulResults = results.filter(result => result.result !== null);

            // Create the aggregate result
            const aggregateResult = this.createAggregateResult(successfulResults.map(r => r.result));

            // Create the metadata
            const metadata = {
                totalEntries: filePaths.length,
                analyzedEntries: successfulResults.length,
                dateRange: this.getDateRangeFromResults(successfulResults.map(r => r.result)),
                searchTerm: ''
            };

            return {
                individualResults: results,
                aggregateResult: aggregateResult,
                metadata: metadata
            };
        } catch (error) {
            console.error('Error analyzing multiple files:', error);
            throw error;
        }
    }

    /**
     * Analyze multiple folders
     * @param folderPaths Array of folder paths to analyze
     * @param options Analysis options
     * @returns Promise<MultiEntryAnalysisResult> The analysis result
     */
    public async analyzeMultipleFolders(
        folderPaths: string[],
        options: AnalysisOptions = {},
        progressCallback?: () => void
    ): Promise<MultiEntryAnalysisResult> {
        try {
            // Get all files from all folders
            const allFiles: TFile[] = [];

            for (const folderPath of folderPaths) {
                const folder = this.app.vault.getAbstractFileByPath(folderPath);

                if (!folder || !(folder instanceof TFolder)) {
                    console.warn(`Folder not found: ${folderPath}`);
                    continue;
                }

                const filesInFolder = this.getMarkdownFilesInFolder(folder);
                allFiles.push(...filesInFolder);
            }

            // Limit the number of files to analyze
            const maxEntries = options.maxEntries || 30;
            const filesToAnalyze = allFiles.slice(0, maxEntries);

            // Analyze the files
            return await this.analyzeMultipleFiles(
                filesToAnalyze.map(file => file.path),
                options,
                progressCallback
            );
        } catch (error) {
            console.error('Error analyzing multiple folders:', error);
            throw error;
        }
    }

    /**
     * Create an aggregate result from multiple individual results
     * @param results Array of individual results
     * @returns EnhancedAnalysisResult The aggregate result
     */
    private createAggregateResult(results: EnhancedAnalysisResult[]): EnhancedAnalysisResult {
        if (results.length === 0) {
            throw new Error('No results to aggregate');
        }

        // Start with a copy of the first result
        const aggregateResult = { ...results[0] };

        // Update the date to the current date
        aggregateResult.date = new Date().toISOString();

        // Update the detail level
        aggregateResult.detailLevel = 'comprehensive';

        // Combine frameworks from all results
        const frameworks = new Set<string>();
        results.forEach(result => {
            result.frameworks.forEach(framework => frameworks.add(framework));
        });
        aggregateResult.frameworks = Array.from(frameworks) as any;

        // Combine emotions from all results
        if (aggregateResult.emotions) {
            const emotions: Record<string, number> = {};
            let totalSentiment = 0;

            results.forEach(result => {
                if (result.emotions) {
                    Object.entries(result.emotions).forEach(([emotion, value]) => {
                        if (emotion === 'sentiment') {
                            totalSentiment += value as number;
                        } else {
                            emotions[emotion] = (emotions[emotion] || 0) + (value as number);
                        }
                    });
                }
            });

            // Average the emotions
            Object.keys(emotions).forEach(emotion => {
                emotions[emotion] = emotions[emotion] / results.length;
            });

            // Average the sentiment
            emotions.sentiment = totalSentiment / results.length;

            aggregateResult.emotions = emotions;
        }

        return aggregateResult;
    }

    /**
     * Get the date range from multiple results
     * @param results Array of individual results
     * @returns Object with start and end dates
     */
    private getDateRangeFromResults(results: EnhancedAnalysisResult[]): { start: Date; end: Date } {
        if (results.length === 0) {
            return {
                start: new Date(),
                end: new Date()
            };
        }

        // Get all dates from the results
        const dates = results.map(result => new Date(result.date));

        // Sort the dates
        dates.sort((a, b) => a.getTime() - b.getTime());

        return {
            start: dates[0],
            end: dates[dates.length - 1]
        };
    }
    private app: App;
    private enhancedAnalysisFrameworks: EnhancedAnalysisFrameworks;
    private userProfileSystem: UserProfileSystem;

    constructor(
        app: App,
        enhancedAnalysisFrameworks: EnhancedAnalysisFrameworks,
        userProfileSystem: UserProfileSystem
    ) {
        this.app = app;
        this.enhancedAnalysisFrameworks = enhancedAnalysisFrameworks;
        this.userProfileSystem = userProfileSystem;
    }

    /**
     * Analyze content based on scope
     * @param scope The scope of analysis
     * @param target The target (path, file, folder, or vault)
     * @param options Analysis options
     */
    async analyze(
        scope: AnalysisScope,
        target: string | TFile | TFolder | Vault,
        options: AnalysisOptions = {}
    ): Promise<EnhancedAnalysisResult | MultiEntryAnalysisResult> {
        switch (scope) {
            case 'note':
                return this.analyzeNote(target as string, options);
            case 'file':
                return this.analyzeFile(target as string | TFile, options);
            case 'folder':
                return this.analyzeFolder(target as string | TFolder, options);
            case 'vault':
                return this.analyzeVault(options);
            default:
                throw new Error(`Invalid analysis scope: ${scope}`);
        }
    }

    /**
     * Analyze a note (active editor content)
     * @param notePath The path to the note
     * @param options Analysis options
     */
    private async analyzeNote(
        notePath: string,
        options: AnalysisOptions = {}
    ): Promise<EnhancedAnalysisResult> {
        // Get the active editor
        const activeView = this.app.workspace.getActiveViewOfType(this.app.workspace.getActiveViewType());
        if (!activeView) {
            throw new Error('No active view');
        }

        // Get the editor content
        const editor = activeView.editor;
        if (!editor) {
            throw new Error('No active editor');
        }

        const content = editor.getValue();
        if (!content) {
            throw new Error('No content to analyze');
        }

        // Get the user profile
        const userProfile = this.userProfileSystem.getUserProfile();

        // Analyze the content
        const result = await this.enhancedAnalysisFrameworks.analyzeText(content, userProfile, this.convertOptions(options));

        return result;
    }

    /**
     * Analyze a file
     * @param filePathOrFile The path to the file or the file object
     * @param options Analysis options
     */
    private async analyzeFile(
        filePathOrFile: string | TFile,
        options: AnalysisOptions = {}
    ): Promise<EnhancedAnalysisResult> {
        // Get the file
        let file: TFile;
        if (typeof filePathOrFile === 'string') {
            const maybeFile = this.app.vault.getAbstractFileByPath(filePathOrFile);
            if (!maybeFile || !(maybeFile instanceof TFile)) {
                throw new Error(`File not found: ${filePathOrFile}`);
            }
            file = maybeFile;
        } else {
            file = filePathOrFile;
        }

        // Read the file content
        const content = await this.app.vault.read(file);
        if (!content) {
            throw new Error('No content to analyze');
        }

        // Get the user profile
        const userProfile = this.userProfileSystem.getUserProfile();

        // Analyze the content
        const result = await this.enhancedAnalysisFrameworks.analyzeText(content, userProfile, this.convertOptions(options));

        return result;
    }

    /**
     * Analyze a folder
     * @param folderPathOrFolder The path to the folder or the folder object
     * @param options Analysis options
     */
    private async analyzeFolder(
        folderPathOrFolder: string | TFolder,
        options: AnalysisOptions = {}
    ): Promise<MultiEntryAnalysisResult> {
        // Get the folder
        let folder: TFolder;
        if (typeof folderPathOrFolder === 'string') {
            const maybeFolder = this.app.vault.getAbstractFileByPath(folderPathOrFolder);
            if (!maybeFolder || !(maybeFolder instanceof TFolder)) {
                throw new Error(`Folder not found: ${folderPathOrFolder}`);
            }
            folder = maybeFolder;
        } else {
            folder = folderPathOrFolder;
        }

        // Get all markdown files in the folder
        const files = this.getMarkdownFiles(folder);

        // Filter files based on options
        const filteredFiles = this.filterFiles(files, options);

        // Limit the number of files to analyze
        const maxEntries = options.maxEntries || 10;
        const filesToAnalyze = filteredFiles.slice(0, maxEntries);

        // Analyze each file
        const individualResults = await Promise.all(
            filesToAnalyze.map(async (file) => {
                const result = await this.analyzeFile(file, options);
                return {
                    path: file.path,
                    result
                };
            })
        );

        // Create aggregate result
        const aggregateResult = this.createAggregateResult(individualResults.map(r => r.result));

        // Create metadata
        const metadata = {
            totalEntries: filteredFiles.length,
            analyzedEntries: filesToAnalyze.length,
            dateRange: this.getDateRangeFromFiles(filesToAnalyze),
            searchTerm: options.searchTerm
        };

        return {
            individualResults,
            aggregateResult,
            metadata
        };
    }

    /**
     * Analyze the entire vault
     * @param options Analysis options
     */
    private async analyzeVault(
        options: AnalysisOptions = {}
    ): Promise<MultiEntryAnalysisResult> {
        // Get all markdown files in the vault
        const files = this.app.vault.getMarkdownFiles();

        // Filter files based on options
        const filteredFiles = this.filterFiles(files, options);

        // Limit the number of files to analyze
        const maxEntries = options.maxEntries || 20;
        const filesToAnalyze = filteredFiles.slice(0, maxEntries);

        // Analyze each file
        const individualResults = await Promise.all(
            filesToAnalyze.map(async (file) => {
                const result = await this.analyzeFile(file, options);
                return {
                    path: file.path,
                    result
                };
            })
        );

        // Create aggregate result
        const aggregateResult = this.createAggregateResult(individualResults.map(r => r.result));

        // Create metadata
        const metadata = {
            totalEntries: filteredFiles.length,
            analyzedEntries: filesToAnalyze.length,
            dateRange: this.getDateRangeFromFiles(filesToAnalyze),
            searchTerm: options.searchTerm
        };

        return {
            individualResults,
            aggregateResult,
            metadata
        };
    }

    /**
     * Get all markdown files in a folder
     * @param folder The folder
     */
    private getMarkdownFiles(folder: TFolder): TFile[] {
        const files: TFile[] = [];

        // Recursive function to get all files
        const getFiles = (folder: TFolder) => {
            for (const child of folder.children) {
                if (child instanceof TFile && child.extension === 'md') {
                    files.push(child);
                } else if (child instanceof TFolder) {
                    getFiles(child);
                }
            }
        };

        getFiles(folder);
        return files;
    }

    /**
     * Filter files based on options
     * @param files The files to filter
     * @param options Analysis options
     */
    private filterFiles(files: TFile[], options: AnalysisOptions): TFile[] {
        let filteredFiles = [...files];

        // Filter by date range
        if (options.dateRange) {
            filteredFiles = filteredFiles.filter(file => {
                const stat = this.app.vault.getFileCache(file);
                if (!stat) return false;

                const fileDate = new Date(stat.mtime);
                return fileDate >= options.dateRange!.start && fileDate <= options.dateRange!.end;
            });
        }

        // Filter by search term
        if (options.searchTerm) {
            filteredFiles = filteredFiles.filter(async (file) => {
                const content = await this.app.vault.read(file);
                return content.toLowerCase().includes(options.searchTerm!.toLowerCase());
            });
        }

        // Sort by date (newest first)
        filteredFiles.sort((a, b) => {
            const statA = this.app.vault.getFileCache(a);
            const statB = this.app.vault.getFileCache(b);
            if (!statA || !statB) return 0;
            return statB.mtime - statA.mtime;
        });

        return filteredFiles;
    }

    /**
     * Get date range from files
     * @param files The files
     */
    private getDateRangeFromFiles(files: TFile[]): { start: Date; end: Date } {
        let start = new Date();
        let end = new Date(0);

        for (const file of files) {
            const stat = this.app.vault.getFileCache(file);
            if (!stat) continue;

            const fileDate = new Date(stat.mtime);
            if (fileDate < start) {
                start = fileDate;
            }
            if (fileDate > end) {
                end = fileDate;
            }
        }

        return { start, end };
    }

    /**
     * Create an aggregate result from individual results
     * @param results The individual results
     */
    private createAggregateResult(results: EnhancedAnalysisResult[]): EnhancedAnalysisResult {
        // This is a simplified aggregation - in a real implementation,
        // you would want to do more sophisticated aggregation of the analysis results

        // For now, we'll just create a basic summary
        const aggregate: EnhancedAnalysisResult = {
            emotions: {
                joy: 0,
                sadness: 0,
                anger: 0,
                fear: 0,
                surprise: 0,
                sentiment: 0
            },
            personalizedInsights: "Aggregate analysis of multiple entries.",
            date: new Date().toISOString(),
            detailLevel: 'detailed',
            frameworks: [],
            analysisVersion: "1.0"
        };

        // Average the emotions
        for (const result of results) {
            aggregate.emotions.joy += result.emotions.joy / results.length;
            aggregate.emotions.sadness += result.emotions.sadness / results.length;
            aggregate.emotions.anger += result.emotions.anger / results.length;
            aggregate.emotions.fear += result.emotions.fear / results.length;
            aggregate.emotions.surprise += result.emotions.surprise / results.length;
            aggregate.emotions.sentiment += result.emotions.sentiment / results.length;

            // Collect all frameworks
            for (const framework of result.frameworks) {
                if (!aggregate.frameworks.includes(framework)) {
                    aggregate.frameworks.push(framework);
                }
            }
        }

        // Generate personalized insights
        aggregate.personalizedInsights = `This aggregate analysis covers ${results.length} entries. The overall emotional tone shows ${this.getTopEmotions(aggregate.emotions)} as the dominant emotions. Common themes across entries include ${this.getCommonThemes(results)}.`;

        return aggregate;
    }

    /**
     * Get top emotions from emotions object
     * @param emotions The emotions object
     */
    private getTopEmotions(emotions: any): string {
        const emotionEntries = Object.entries(emotions)
            .filter(([key]) => key !== 'sentiment')
            .sort(([, a], [, b]) => (b as number) - (a as number));

        const topEmotions = emotionEntries.slice(0, 2).map(([key]) => key);
        return topEmotions.join(' and ');
    }

    /**
     * Get common themes from results
     * @param results The analysis results
     */
    private getCommonThemes(results: EnhancedAnalysisResult[]): string {
        // This is a placeholder - in a real implementation,
        // you would extract actual themes from the analysis results
        return "personal growth, relationships, and daily reflections";
    }

    /**
     * Convert analysis options to framework options
     * @param options Analysis options
     */
    private convertOptions(options: AnalysisOptions): any {
        return {
            includeFreudian: options.includeFreudian,
            includeLacanian: options.includeLacanian,
            includeDeleuzian: options.includeDeleuzian,
            includeIrigarayian: options.includeIrigarayian,
            includeJungian: options.includeJungian,
            includeAttachment: options.includeAttachment,
            includePositive: options.includePositive,
            includeNarrative: options.includeNarrative,
            includePhenomenological: options.includePhenomenological,
            includeExistentialist: options.includeExistentialist,
            includeFeminist: options.includeFeminist,
            includeCritical: options.includeCritical,
            includePosthumanist: options.includePosthumanist,
            includeBuddhist: options.includeBuddhist,
            includeExistentialPsychology: options.includeExistentialPsychology,
            includeGestalt: options.includeGestalt,
            includeTranspersonal: options.includeTranspersonal,
            includeCognitiveBehavioral: options.includeCognitiveBehavioral,
            includeHermeneutics: options.includeHermeneutics,
            includeStoicism: options.includeStoicism,
            includeNietzschean: options.includeNietzschean,
            includePsychiatry: options.includePsychiatry,
            includeNextSteps: options.includeNextSteps,
            detailLevel: options.detailLevel || 'detailed'
        };
    }
}
