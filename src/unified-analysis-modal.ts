import { App, Modal, Setting, Notice } from 'obsidian';
import { FRAMEWORKS, MEDIA_TYPES } from './constants';
import DeleometerPlugin from './main';

export class UnifiedAnalysisModal {
    app: App;
    plugin: DeleometerPlugin;
    selectedFrameworks: string[] = [];
    selectedMediaType: string = MEDIA_TYPES.TEXT;
    content: string = '';
    file: any = null;
    modal: any;
    contentEl: HTMLElement;
    
    constructor(app: App, plugin: DeleometerPlugin) {
        this.app = app;
        this.plugin = plugin;
        this.modal = new Modal(app);
        this.contentEl = this.modal.contentEl;
        
        // Initialize with enabled frameworks from settings
        this.selectedFrameworks = Object.entries(this.plugin.settings.enabledFrameworks)
            .filter(([_, enabled]) => enabled)
            .map(([framework, _]) => framework);
    }
    
    open() {
        this.modal.open();
        this.onOpen();
    }
    
    close() {
        this.onClose();
        this.modal.close();
    }
    
    onOpen() {
        this.contentEl.empty();
        
        this.contentEl.createEl('h2', { text: 'Theoretical Analysis' });
        
        // Media type selection
        new Setting(this.contentEl)
            .setName('Media Type')
            .setDesc('Select the type of content to analyze')
            .addDropdown(dropdown => {
                dropdown
                    .addOption(MEDIA_TYPES.TEXT, 'Text')
                    .addOption(MEDIA_TYPES.IMAGE, 'Image')
                    .addOption(MEDIA_TYPES.AUDIO, 'Audio')
                    .addOption(MEDIA_TYPES.FILM, 'Film/Video')
                    .setValue(this.selectedMediaType)
                    .onChange(value => {
                        this.selectedMediaType = value;
                    });
            });
        
        // Framework selection
        const frameworksContainer = this.contentEl.createDiv({ cls: 'deleometer-frameworks' });
        frameworksContainer.createEl('h3', { text: 'Select Frameworks' });
        
        // Create a checkbox for each framework
        Object.keys(FRAMEWORKS).forEach(key => {
            const frameworkId = FRAMEWORKS[key as keyof typeof FRAMEWORKS];
            const frameworkName = this.plugin.analysisEngine.getFrameworkName(frameworkId);
            
            new Setting(frameworksContainer)
                .setName(frameworkName)
                .addToggle(toggle => {
                    toggle
                        .setValue(this.selectedFrameworks.includes(frameworkId))
                        .onChange(value => {
                            if (value) {
                                // Add to selected frameworks
                                if (!this.selectedFrameworks.includes(frameworkId)) {
                                    this.selectedFrameworks.push(frameworkId);
                                }
                            } else {
                                // Remove from selected frameworks
                                this.selectedFrameworks = this.selectedFrameworks.filter(id => id !== frameworkId);
                            }
                        });
                });
        });
        
        // Add buttons
        const buttonContainer = this.contentEl.createDiv({ cls: 'deleometer-buttons' });
        
        // Select All button
        buttonContainer.createEl('button', { text: 'Select All' })
            .addEventListener('click', () => {
                this.selectedFrameworks = Object.keys(FRAMEWORKS).map(key => FRAMEWORKS[key as keyof typeof FRAMEWORKS]);
                this.close();
                this.open();
            });
        
        // Deselect All button
        buttonContainer.createEl('button', { text: 'Deselect All' })
            .addEventListener('click', () => {
                this.selectedFrameworks = [];
                this.close();
                this.open();
            });
        
        // Analyze button
        buttonContainer.createEl('button', { text: 'Analyze', cls: 'mod-cta' })
            .addEventListener('click', () => {
                this.analyze();
            });
    }
    
    onClose() {
        this.contentEl.empty();
    }
    
    // Analyze the current content
    analyze() {
        if (this.selectedFrameworks.length === 0) {
            // Show error if no frameworks selected
            new Notice('Please select at least one framework for analysis.');
            return;
        }
        
        try {
            // Get the active file or editor content
            const activeFile = this.app.workspace.getActiveFile();
            
            if (this.selectedMediaType === MEDIA_TYPES.TEXT) {
                // For text, get the content from the editor
                const activeLeaf = this.app.workspace.activeLeaf;
                const editor = activeLeaf?.view?.sourceMode?.cmEditor;
                
                if (editor) {
                    const content = editor.getValue();
                    this.close();
                    this.plugin.analyzeContent(content, MEDIA_TYPES.TEXT);
                } else if (activeFile) {
                    // If no editor but there's an active file, use the file
                    this.close();
                    this.plugin.analyzeContent(activeFile, this.selectedMediaType);
                } else {
                    new Notice('No content to analyze. Please open a file or enter text.');
                }
            } else {
                // For other media types, we need a file
                if (activeFile) {
                    // Check if the file type matches the selected media type
                    const fileExtension = activeFile.extension.toLowerCase();
                    const isValidFile = this.isValidFileForMediaType(fileExtension, this.selectedMediaType);
                    
                    if (isValidFile) {
                        this.close();
                        this.plugin.analyzeContent(activeFile, this.selectedMediaType);
                    } else {
                        new Notice(`The current file is not a valid ${this.selectedMediaType} file.`);
                    }
                } else {
                    new Notice(`Please open a ${this.selectedMediaType} file to analyze.`);
                }
            }
        } catch (error) {
            console.error('Error in analyze:', error);
            new Notice('An error occurred during analysis. Check the console for details.');
        }
    }
    
    // Check if a file extension is valid for the selected media type
    isValidFileForMediaType(extension: string, mediaType: string): boolean {
        switch (mediaType) {
            case MEDIA_TYPES.IMAGE:
                return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension);
            case MEDIA_TYPES.AUDIO:
                return ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(extension);
            case MEDIA_TYPES.FILM:
                return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension);
            case MEDIA_TYPES.TEXT:
                return ['md', 'txt', 'html', 'css', 'js', 'ts', 'json'].includes(extension);
            default:
                return false;
        }
    }
}
