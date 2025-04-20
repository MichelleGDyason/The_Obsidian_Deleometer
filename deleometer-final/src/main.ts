import { App, Plugin, TFile, Notice } from 'obsidian';
import { DEFAULT_SETTINGS, DeleometerSettings, MEDIA_TYPES } from './constants';
import { AnalysisEngine, AnalysisResult } from './analysis-engine';
import { DeleometerSettingTab } from './settings-tab';
import { UnifiedAnalysisModal } from './unified-analysis-modal';
import { OpenAIService } from './services/openai-service';
import { __awaiter } from './tslib';

export default class DeleometerPlugin extends Plugin {
    settings: DeleometerSettings;
    analysisEngine: AnalysisEngine;
    openaiService: OpenAIService | null = null;

    onload(): Promise<void> {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading Deleometer plugin');

            // Load settings
            yield this.loadSettings();

            // Initialize analysis engine
            this.analysisEngine = new AnalysisEngine(this.app, this.settings);

            // Initialize OpenAI service if enabled
            if (this.settings.enableOpenAI) {
                this.openaiService = new OpenAIService(this.settings);
            }

            // Check if we need to reset the monthly usage counter
            this.checkMonthlyReset();

            // Add ribbon icon
            const ribbonIconEl = this.addRibbonIcon('leaf', 'Deleometer', (_: MouseEvent) => {
                // Called when the user clicks the icon.
                this.analyzeCurrentFile();
            });

            // Specify a tooltip for the ribbon icon
            ribbonIconEl.addClass('deleometer-ribbon-class');

            // Add command to analyze current file
            this.addCommand({
                id: 'analyze-current-file',
                name: 'Analyze Current File',
                callback: () => {
                    this.analyzeCurrentFile();
                }
            });

            // Add command to analyze selected text
            this.addCommand({
                id: 'analyze-selected-text',
                name: 'Analyze Selected Text',
                editorCallback: (editor: any, _: any) => {
                    const selectedText = editor.getSelection();
                    if (selectedText) {
                        this.analyzeContent(selectedText, MEDIA_TYPES.TEXT);
                    } else {
                        new Notice('No text selected');
                    }
                }
            });

            // Add settings tab
            this.addSettingTab(new DeleometerSettingTab(this.app, this));

            // Add command to open the unified analysis modal
            this.addCommand({
                id: 'open-unified-analysis',
                name: 'Open Unified Analysis',
                callback: () => {
                    this.showUnifiedAnalysisModal();
                }
            });
        });
    }

    onunload(): void {
        console.log('Unloading Deleometer plugin');
    }

    loadSettings(): Promise<void> {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.loadData() as Partial<DeleometerSettings>;
            this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
        });
    }

    saveSettings(): Promise<void> {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);

            // Update the analysis engine with new settings
            this.analysisEngine.updateConfig(this.settings);

            // Update OpenAI service if needed
            if (this.settings.enableOpenAI) {
                if (this.openaiService) {
                    this.openaiService.updateConfig(this.settings);
                } else {
                    this.openaiService = new OpenAIService(this.settings);
                }
            } else {
                this.openaiService = null;
            }
        });
    }

    // Check if we need to reset the monthly usage counter
    checkMonthlyReset(): void {
        const now = Date.now();
        const lastReset = this.settings.openaiLastReset;
        const oneMonthMs = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

        // If it's been more than a month since the last reset, reset the counter
        if (now - lastReset > oneMonthMs) {
            this.settings.openaiUsageCount = 0;
            this.settings.openaiLastReset = now;
            this.saveSettings();
        }
    }

    // Analyze the current active file
    analyzeCurrentFile(): Promise<void> {
        return __awaiter(this, void 0, void 0, function* () {
            const activeFile = this.app.workspace.getActiveFile();

            if (!activeFile) {
                // No active file
                new Notice('No active file to analyze');
                return;
            }

            // Determine media type based on file extension
            const mediaType = this.getMediaTypeFromFile(activeFile);

            if (mediaType === MEDIA_TYPES.TEXT) {
                // For text files, get the content
                const content = yield this.app.vault.read(activeFile) as string;
                this.analyzeContent(content, mediaType, activeFile);
            } else {
                // For other media types, pass the file directly
                this.analyzeContent(activeFile, mediaType);
            }
        });
    }

    // Determine media type from file extension
    getMediaTypeFromFile(file: TFile): string {
        const extension = file.extension.toLowerCase();

        if (['md', 'txt', 'text'].includes(extension)) {
            return MEDIA_TYPES.TEXT;
        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
            return MEDIA_TYPES.IMAGE;
        } else if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
            return MEDIA_TYPES.AUDIO;
        } else if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
            return MEDIA_TYPES.FILM;
        } else {
            // Default to text for unknown types
            return MEDIA_TYPES.TEXT;
        }
    }

    // Analyze content with the analysis engine
    analyzeContent(content: string | TFile, mediaType: string, file?: TFile): Promise<void> {
        return __awaiter(this, void 0, void 0, function* () {
            // Get enabled frameworks from settings
            const enabledFrameworks = Object.entries(this.settings.enabledFrameworks)
                .filter(([_, enabled]) => enabled)
                .map(([framework, _]) => framework);

            if (enabledFrameworks.length === 0) {
                new Notice('No analysis frameworks are enabled. Please enable at least one framework in settings.');
                return;
            }

            try {
                // Show loading notice
                new Notice('Analyzing content...');

                // Analyze the content
                const result = this.analysisEngine.analyzeContent(content, mediaType, enabledFrameworks);

                // Display results
                this.displayAnalysisResults(result, file);
            } catch (error) {
                console.error('Error analyzing content:', error);
                new Notice('Error analyzing content. Check console for details.');
            }
        });
    }

    // Display analysis results
    displayAnalysisResults(result: AnalysisResult, file?: TFile): void {
        // Create a markdown string with the analysis results
        let markdown = `# Deleometer Analysis\n\n`;

        // Add file name if available
        if (result.fileName) {
            markdown += `**File:** ${result.fileName}\n\n`;
        } else if (file) {
            markdown += `**File:** ${file.path}\n\n`;
        }

        // Add media type
        markdown += `**Media Type:** ${result.mediaType}\n\n`;

        // Add summary
        markdown += `## Summary\n\n${result.summary}\n\n`;

        // Add framework analyses
        markdown += `## Framework Analyses\n\n`;

        for (const [framework, analysis] of Object.entries(result.frameworkAnalyses)) {
            const frameworkName = this.analysisEngine.getFrameworkName(framework);
            markdown += `### ${frameworkName}\n\n${analysis}\n\n`;
        }

        // Add recommendations if available
        if (result.recommendations && result.recommendations.length > 0) {
            markdown += `## Recommendations\n\n`;

            for (const recommendation of result.recommendations) {
                markdown += `- ${recommendation}\n`;
            }
        }

        // Create a new leaf to display the results
        const leaf = this.app.workspace.getLeaf(true);

        // Set the leaf view to markdown
        leaf.setViewState({
            type: 'markdown',
            state: {
                mode: 'preview',
                source: markdown
            }
        });
    }

    // Show the unified analysis modal
    showUnifiedAnalysisModal(): void {
        const modal = new UnifiedAnalysisModal(this.app, this);
        modal.open();
    }
}
