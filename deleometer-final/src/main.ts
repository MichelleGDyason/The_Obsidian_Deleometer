import { App, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { DEFAULT_SETTINGS, DeleometerSettings, FRAMEWORKS, MEDIA_TYPES } from './constants';
import { AnalysisEngine, AnalysisResult } from './analysis-engine';
import { DeleometerSettingTab } from './settings-tab';

export default class DeleometerPlugin extends Plugin {
    settings: DeleometerSettings;
    analysisEngine: AnalysisEngine;

    async onload() {
        console.log('Loading Deleometer plugin');

        // Load settings
        await this.loadSettings();

        // Initialize analysis engine
        this.analysisEngine = new AnalysisEngine(this.app, this.settings);

        // Add ribbon icon
        const ribbonIconEl = this.addRibbonIcon('leaf', 'Deleometer', (evt: MouseEvent) => {
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
            editorCallback: (editor, view) => {
                const selectedText = editor.getSelection();
                if (selectedText) {
                    this.analyzeContent(selectedText, MEDIA_TYPES.TEXT);
                }
            }
        });

        // Add settings tab
        this.addSettingTab(new DeleometerSettingTab(this.app, this));
    }

    onunload() {
        console.log('Unloading Deleometer plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    // Analyze the current active file
    async analyzeCurrentFile() {
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
            const content = await this.app.vault.read(activeFile);
            this.analyzeContent(content, mediaType, activeFile);
        } else {
            // For other media types, pass the file directly
            this.analyzeContent(activeFile, mediaType);
        }
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
    async analyzeContent(content: string | TFile, mediaType: string, file?: TFile) {
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
    }

    // Display analysis results
    displayAnalysisResults(result: AnalysisResult, file?: TFile) {
        // Create a markdown string with the analysis results
        let markdown = `# Deleometer Analysis\n\n`;
        
        // Add file name if available
        if (result.fileName) {
            markdown += `**File:** ${result.fileName}\n\n`;
        }
        
        // Add summary
        markdown += `## Summary\n${result.summary}\n\n`;
        
        // Add framework analyses
        markdown += `## Framework Analyses\n\n`;
        
        for (const [framework, analysis] of Object.entries(result.frameworkAnalyses)) {
            const frameworkName = this.analysisEngine.getFrameworkName(framework);
            markdown += `### ${frameworkName}\n`;
            
            if (typeof analysis === 'string') {
                markdown += `${analysis}\n\n`;
            } else {
                // Handle specialized framework results
                markdown += `${analysis.summary}\n\n`;
                
                // Add additional details for specialized frameworks
                if ('rhizomaticConnections' in analysis) {
                    // Deleuzian analysis
                    markdown += `**Rhizomatic Connections:** ${analysis.rhizomaticConnections.join(', ')}\n`;
                    markdown += `**Assemblages:** ${analysis.assemblages.join(', ')}\n`;
                    markdown += `**Deterritorializations:** ${analysis.deterritorializations.join(', ')}\n`;
                    markdown += `**Body Without Organs:** ${analysis.bodyWithoutOrgans}\n\n`;
                } else if ('sexualDifference' in analysis) {
                    // Irigarayian analysis
                    markdown += `**Sexual Difference:** ${analysis.sexualDifference.join(', ')}\n`;
                    markdown += `**Feminine Speaking:** ${analysis.feminineSpeaking.join(', ')}\n`;
                    markdown += `**Fluid Logic:** ${analysis.fluidLogic.join(', ')}\n`;
                    markdown += `**Mimesis:** ${analysis.mimesis.join(', ')}\n\n`;
                }
            }
        }
        
        // Add recommendations
        markdown += `## Recommendations\n\n`;
        result.recommendations.forEach(recommendation => {
            markdown += `- ${recommendation}\n`;
        });
        
        // Create a new leaf to display the results
        const leaf = this.app.workspace.getLeaf('split');
        leaf.openMarkdown(markdown, {
            state: {
                mode: 'preview'
            }
        });
    }
}

// Helper function to display notices
function Notice(message: string) {
    const notice = new (window as any).Notice(message, 5000);
    return notice;
}
