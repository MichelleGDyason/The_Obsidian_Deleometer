import { App, Modal, Setting, TFile, Notice, ButtonComponent } from 'obsidian';
import { ArtisticAnalysis, ArtisticAnalysisOptions, ArtisticAnalysisResult } from './artisticAnalysis';
import { LoadingIndicator } from './loadingIndicator';
import { SecurityService } from './securityService';
import { UserProfileSystem } from './userProfileSystem';
import { ApiService } from './apiService';
import { LocalProcessingService } from './localProcessingService';
import { ComparativeAnalysisView, COMPARATIVE_VIEW_TYPE } from './comparativeAnalysisView';

/**
 * Simple modal for comparative analysis of multiple files
 */
export class SimpleComparativeAnalysisModal extends Modal {
    private files: TFile[] = [];
    private options: ArtisticAnalysisOptions = {};
    private artisticAnalysis: ArtisticAnalysis;
    private loadingIndicator: LoadingIndicator;
    
    constructor(
        app: App,
        artisticAnalysis: ArtisticAnalysis
    ) {
        super(app);
        this.artisticAnalysis = artisticAnalysis;
        this.loadingIndicator = new LoadingIndicator();
        
        // Default options
        this.options = {
            includeTacktical: true,
            includeFreudian: true,
            includeLacanian: true,
            includeDeleuzian: true,
            includeIrigarayian: true,
            detailLevel: 'detailed',
            includeRecommendations: true
        };
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-comparative-analysis-modal');
        
        contentEl.createEl('h2', { text: 'Comparative Analysis' });
        
        // File selection
        const fileSelectionSection = contentEl.createDiv('deleometer-section');
        fileSelectionSection.createEl('h3', { text: 'Select Files to Compare' });
        
        // File selection instructions
        fileSelectionSection.createEl('p', { 
            text: 'Select at least two files to compare. You can select files of different types (text, image, audio, film).'
        });
        
        // File selection button
        const fileSelectionButton = new ButtonComponent(fileSelectionSection)
            .setButtonText('Select Files')
            .onClick(async () => {
                // Open file selector
                const fileSelector = await this.openFileSelector();
                if (fileSelector && fileSelector.length > 0) {
                    this.files = fileSelector;
                    this.updateFileList();
                }
            });
        
        // File list container
        const fileListContainer = fileSelectionSection.createDiv('deleometer-file-list');
        fileListContainer.createEl('p', { text: 'No files selected. Click "Select Files" to choose files for comparison.' });
        
        // Framework selection
        const frameworkSection = contentEl.createDiv('deleometer-section');
        frameworkSection.createEl('h3', { text: 'Select Frameworks' });
        
        // Core frameworks
        new Setting(frameworkSection)
            .setName('Tacktical Methodology')
            .addToggle(toggle => {
                toggle.setValue(true)
                    .onChange(value => {
                        this.options.includeTacktical = value;
                    });
            });
            
        new Setting(frameworkSection)
            .setName('Freudian Psychoanalysis')
            .addToggle(toggle => {
                toggle.setValue(true)
                    .onChange(value => {
                        this.options.includeFreudian = value;
                    });
            });
            
        new Setting(frameworkSection)
            .setName('Lacanian Psychoanalysis')
            .addToggle(toggle => {
                toggle.setValue(true)
                    .onChange(value => {
                        this.options.includeLacanian = value;
                    });
            });
            
        new Setting(frameworkSection)
            .setName('Deleuzian Schizoanalysis')
            .addToggle(toggle => {
                toggle.setValue(true)
                    .onChange(value => {
                        this.options.includeDeleuzian = value;
                    });
            });
            
        new Setting(frameworkSection)
            .setName('Irigarayian Feminist Theory')
            .addToggle(toggle => {
                toggle.setValue(true)
                    .onChange(value => {
                        this.options.includeIrigarayian = value;
                    });
            });
        
        // Additional frameworks dropdown
        new Setting(frameworkSection)
            .setName('Additional Frameworks')
            .setDesc('Select additional theoretical frameworks to include')
            .addDropdown(dropdown => {
                dropdown
                    .addOption('none', 'None')
                    .addOption('jungian', 'Jungian Analytical Psychology')
                    .addOption('attachment', 'Attachment Theory')
                    .addOption('positive', 'Positive Psychology')
                    .addOption('narrative', 'Narrative Psychology')
                    .addOption('buddhist', 'Buddhist Philosophy')
                    .setValue('none')
                    .onChange(value => {
                        // Reset all additional frameworks
                        this.options.includeJungian = false;
                        this.options.includeAttachment = false;
                        this.options.includePositive = false;
                        this.options.includeNarrative = false;
                        this.options.includeBuddhist = false;
                        
                        // Set the selected framework
                        if (value !== 'none') {
                            this.options['include' + value.charAt(0).toUpperCase() + value.slice(1)] = true;
                        }
                    });
            });
        
        // Analysis options
        const optionsSection = contentEl.createDiv('deleometer-section');
        optionsSection.createEl('h3', { text: 'Analysis Options' });
        
        new Setting(optionsSection)
            .setName('Detail Level')
            .setDesc('Choose the level of detail for the analysis')
            .addDropdown(dropdown => {
                dropdown
                    .addOption('basic', 'Basic')
                    .addOption('detailed', 'Detailed')
                    .addOption('comprehensive', 'Comprehensive')
                    .setValue('detailed')
                    .onChange(value => {
                        this.options.detailLevel = value as 'basic' | 'detailed' | 'comprehensive';
                    });
            });
            
        new Setting(optionsSection)
            .setName('Include Recommendations')
            .setDesc('Include personalized recommendations in the analysis')
            .addToggle(toggle => {
                toggle
                    .setValue(true)
                    .onChange(value => {
                        this.options.includeRecommendations = value;
                    });
            });
        
        // Buttons
        const buttonsContainer = contentEl.createDiv('deleometer-modal-buttons');
        
        new ButtonComponent(buttonsContainer)
            .setButtonText('Cancel')
            .onClick(() => {
                this.close();
            });
            
        new ButtonComponent(buttonsContainer)
            .setButtonText('Analyze')
            .setCta()
            .onClick(() => {
                this.runComparativeAnalysis();
            });
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
    
    /**
     * Open a file selector dialog
     */
    private async openFileSelector(): Promise<TFile[] | null> {
        return new Promise((resolve) => {
            const selectedFiles: TFile[] = [];
            
            // Create a modal for file selection
            const modal = new Modal(this.app);
            modal.titleEl.setText('Select Files');
            modal.contentEl.addClass('deleometer-file-selector');
            
            // Get all files in the vault
            const allFiles = this.app.vault.getFiles();
            
            // Create file list
            const fileList = modal.contentEl.createDiv('deleometer-file-list');
            
            allFiles.forEach(file => {
                const fileItem = fileList.createDiv('deleometer-file-item');
                
                const checkbox = fileItem.createEl('input', {
                    type: 'checkbox',
                    cls: 'deleometer-file-checkbox'
                });
                
                fileItem.createSpan({ 
                    text: file.path,
                    cls: 'deleometer-file-path'
                });
                
                // Add event listener
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        selectedFiles.push(file);
                    } else {
                        const index = selectedFiles.findIndex(f => f.path === file.path);
                        if (index !== -1) {
                            selectedFiles.splice(index, 1);
                        }
                    }
                });
            });
            
            // Add buttons
            const buttonsContainer = modal.contentEl.createDiv('deleometer-modal-buttons');
            
            new ButtonComponent(buttonsContainer)
                .setButtonText('Cancel')
                .onClick(() => {
                    modal.close();
                    resolve(null);
                });
                
            new ButtonComponent(buttonsContainer)
                .setButtonText('Select')
                .setCta()
                .onClick(() => {
                    modal.close();
                    resolve(selectedFiles);
                });
            
            modal.open();
        });
    }
    
    /**
     * Update the file list display
     */
    private updateFileList() {
        const fileListContainer = this.contentEl.querySelector('.deleometer-file-list');
        if (!fileListContainer) return;
        
        fileListContainer.empty();
        
        if (this.files.length === 0) {
            fileListContainer.createEl('p', { text: 'No files selected. Click "Select Files" to choose files for comparison.' });
            return;
        }
        
        const fileList = fileListContainer.createEl('ul', { cls: 'deleometer-selected-files' });
        
        this.files.forEach((file, index) => {
            const fileItem = fileList.createEl('li', { cls: 'deleometer-file-item' });
            
            fileItem.createSpan({ text: file.path, cls: 'deleometer-file-path' });
            
            const removeButton = fileItem.createEl('button', { 
                cls: 'deleometer-remove-file',
                text: '×'
            });
            
            removeButton.addEventListener('click', () => {
                this.files.splice(index, 1);
                this.updateFileList();
            });
        });
    }
    
    /**
     * Run the comparative analysis
     */
    private async runComparativeAnalysis() {
        if (this.files.length < 2) {
            new Notice('Please select at least two files for comparison');
            return;
        }
        
        // Check if at least one framework is selected
        const hasFramework = Object.entries(this.options).some(([key, value]) => {
            return key.startsWith('include') && key !== 'includeRecommendations' && value === true;
        });
        
        if (!hasFramework) {
            new Notice('Please select at least one theoretical framework');
            return;
        }
        
        try {
            // Show loading indicator
            this.loadingIndicator.show(this.contentEl, 'Analyzing files...');
            
            // Analyze each file
            const results: ArtisticAnalysisResult[] = [];
            let completedCount = 0;
            
            for (const file of this.files) {
                try {
                    let result: ArtisticAnalysisResult;
                    
                    // Update loading message
                    this.loadingIndicator.updateMessage(`Analyzing ${file.name} (${completedCount + 1}/${this.files.length})...`);
                    
                    if (this.artisticAnalysis.isImageFile(file)) {
                        result = await this.artisticAnalysis.analyzeImage(file, '', this.options);
                    } else if (this.artisticAnalysis.isAudioFile(file)) {
                        result = await this.artisticAnalysis.analyzeAudio(file, '', this.options);
                    } else if (this.artisticAnalysis.isFilmFile(file)) {
                        result = await this.artisticAnalysis.analyzeFilm(file, '', this.options);
                    } else if (file.extension === 'md' || file.extension === 'txt') {
                        result = await this.artisticAnalysis.analyzeText(file, undefined, this.options);
                    } else {
                        // Skip unsupported files
                        continue;
                    }
                    
                    results.push(result);
                    completedCount++;
                } catch (error) {
                    console.error(`Error analyzing file ${file.path}:`, error);
                    new Notice(`Error analyzing ${file.name}: ${error.message}`);
                }
            }
            
            // Hide loading indicator
            this.loadingIndicator.hide();
            
            if (results.length < 2) {
                new Notice('Not enough files were successfully analyzed for comparison');
                return;
            }
            
            // Close this modal
            this.close();
            
            // Try to open the comparative analysis view
            try {
                const leaf = this.app.workspace.getLeaf();
                await leaf.setViewState({
                    type: COMPARATIVE_VIEW_TYPE,
                    state: { results }
                });
            } catch (error) {
                // If the view is not registered, show results in a simple modal
                this.showSimpleResults(results);
            }
        } catch (error) {
            console.error('Error running comparative analysis:', error);
            new Notice(`Error running comparative analysis: ${error.message}`);
            this.loadingIndicator.hide();
        }
    }
    
    /**
     * Show simple results in a modal
     */
    private showSimpleResults(results: ArtisticAnalysisResult[]) {
        const modal = new Modal(this.app);
        modal.titleEl.setText('Comparative Analysis Results');
        modal.contentEl.addClass('deleometer-simple-results');
        
        // Create a simple table for comparison
        const table = modal.contentEl.createEl('table', { cls: 'deleometer-comparison-table' });
        
        // Table header
        const thead = table.createEl('thead');
        const headerRow = thead.createEl('tr');
        headerRow.createEl('th', { text: 'Aspect' });
        
        results.forEach(result => {
            headerRow.createEl('th', { text: result.fileName });
        });
        
        // Table body
        const tbody = table.createEl('tbody');
        
        // Media type row
        const typeRow = tbody.createEl('tr');
        typeRow.createEl('td', { text: 'Media Type' });
        
        results.forEach(result => {
            typeRow.createEl('td', { text: result.mediaType });
        });
        
        // Summary row
        const summaryRow = tbody.createEl('tr');
        summaryRow.createEl('td', { text: 'Summary' });
        
        results.forEach(result => {
            summaryRow.createEl('td', { text: result.summary });
        });
        
        // Frameworks row
        const frameworksRow = tbody.createEl('tr');
        frameworksRow.createEl('td', { text: 'Frameworks Used' });
        
        results.forEach(result => {
            const cell = frameworksRow.createEl('td');
            const frameworks = [];
            
            if (result.tackticalAnalysis) frameworks.push('Tacktical');
            if (result.freudianAnalysis) frameworks.push('Freudian');
            if (result.lacanianAnalysis) frameworks.push('Lacanian');
            if (result.deleuzianAnalysis) frameworks.push('Deleuzian');
            if (result.irigarayianAnalysis) frameworks.push('Irigarayian');
            if (result.jungianAnalysis) frameworks.push('Jungian');
            if (result.attachmentAnalysis) frameworks.push('Attachment');
            if (result.positiveAnalysis) frameworks.push('Positive');
            if (result.narrativeAnalysis) frameworks.push('Narrative');
            if (result.buddhistAnalysis) frameworks.push('Buddhist');
            
            cell.setText(frameworks.join(', '));
        });
        
        // Add close button
        const buttonsContainer = modal.contentEl.createDiv('deleometer-modal-buttons');
        
        new ButtonComponent(buttonsContainer)
            .setButtonText('Close')
            .setCta()
            .onClick(() => {
                modal.close();
            });
        
        modal.open();
    }
}
