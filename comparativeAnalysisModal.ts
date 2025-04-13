import { App, Modal, Setting, TFile, Notice, ButtonComponent } from 'obsidian';
import { ArtisticAnalysis, ArtisticAnalysisOptions, ArtisticAnalysisResult } from './artisticAnalysis';
import { LoadingIndicator } from './loadingIndicator';
import { SecurityService } from './securityService';
import { UserProfileSystem } from './userProfileSystem';
import { ApiService } from './apiService';
import { LocalProcessingService } from './localProcessingService';
import { ComparativeAnalysisView } from './comparativeAnalysisView';

/**
 * Modal for comparative analysis of multiple files
 */
export class ComparativeAnalysisModal extends Modal {
    private files: TFile[] = [];
    private options: ArtisticAnalysisOptions = {};
    private artisticAnalysis: ArtisticAnalysis;
    private loadingIndicator: LoadingIndicator;
    private securityService: SecurityService;
    private userProfileSystem: UserProfileSystem;
    private apiService: ApiService;
    private localProcessingService: LocalProcessingService | null;
    
    constructor(
        app: App,
        securityService: SecurityService,
        userProfileSystem: UserProfileSystem,
        apiService: ApiService,
        localProcessingService: LocalProcessingService | null = null
    ) {
        super(app);
        this.securityService = securityService;
        this.userProfileSystem = userProfileSystem;
        this.apiService = apiService;
        this.localProcessingService = localProcessingService;
        
        this.artisticAnalysis = new ArtisticAnalysis(
            app,
            apiService,
            userProfileSystem,
            securityService,
            localProcessingService || undefined
        );
        
        this.loadingIndicator = new LoadingIndicator();
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-comparative-analysis-modal');
        
        contentEl.createEl('h2', { text: 'Comparative Analysis' });
        
        // File selection
        const fileSelectionSection = contentEl.createDiv('deleometer-section');
        fileSelectionSection.createEl('h3', { text: 'Select Files to Compare' });
        
        const fileSelectionContainer = fileSelectionSection.createDiv('deleometer-file-selection');
        
        // Add file button
        const addFileButton = new ButtonComponent(fileSelectionContainer)
            .setButtonText('Add Files')
            .onClick(async () => {
                // Open file selector
                const fileSelector = new FileSelectorModal(this.app, (selectedFiles) => {
                    if (selectedFiles && selectedFiles.length > 0) {
                        this.files = [...this.files, ...selectedFiles];
                        this.updateFileList();
                    }
                });
                fileSelector.open();
            });
        
        // File list container
        const fileListContainer = fileSelectionContainer.createDiv('deleometer-file-list');
        fileListContainer.createEl('p', { text: 'No files selected. Click "Add Files" to select files for comparison.' });
        
        // Framework selection
        const frameworkSection = contentEl.createDiv('deleometer-section');
        frameworkSection.createEl('h3', { text: 'Select Frameworks' });
        
        // Core frameworks
        this.addFrameworkToggle(frameworkSection, 'includeTacktical', 'Tacktical Methodology (Bufardeci)', true);
        this.addFrameworkToggle(frameworkSection, 'includeFreudian', 'Freudian Psychoanalysis', true);
        this.addFrameworkToggle(frameworkSection, 'includeLacanian', 'Lacanian Psychoanalysis', true);
        this.addFrameworkToggle(frameworkSection, 'includeDeleuzian', 'Deleuzian Schizoanalysis', true);
        this.addFrameworkToggle(frameworkSection, 'includeIrigarayian', 'Irigarayian Feminist Theory', true);
        
        // Additional frameworks
        const additionalFrameworksContainer = frameworkSection.createDiv('deleometer-additional-frameworks');
        additionalFrameworksContainer.createEl('h4', { text: 'Additional Frameworks' });
        
        const frameworksGrid = additionalFrameworksContainer.createDiv('deleometer-frameworks-grid');
        
        // Psychological frameworks
        const psychFrameworks = frameworksGrid.createDiv('deleometer-framework-column');
        psychFrameworks.createEl('h5', { text: 'Psychological' });
        this.addFrameworkToggle(psychFrameworks, 'includeJungian', 'Jungian Analytical Psychology');
        this.addFrameworkToggle(psychFrameworks, 'includeAttachment', 'Attachment Theory');
        this.addFrameworkToggle(psychFrameworks, 'includePositive', 'Positive Psychology');
        this.addFrameworkToggle(psychFrameworks, 'includeNarrative', 'Narrative Psychology');
        this.addFrameworkToggle(psychFrameworks, 'includeExistentialPsychology', 'Existential Psychology');
        this.addFrameworkToggle(psychFrameworks, 'includeGestalt', 'Gestalt Psychology');
        this.addFrameworkToggle(psychFrameworks, 'includeTranspersonal', 'Transpersonal Psychology');
        this.addFrameworkToggle(psychFrameworks, 'includeCognitiveBehavioral', 'Cognitive Behavioral');
        this.addFrameworkToggle(psychFrameworks, 'includePsychiatry', 'Psychiatric Concepts');
        
        // Philosophical frameworks
        const philFrameworks = frameworksGrid.createDiv('deleometer-framework-column');
        philFrameworks.createEl('h5', { text: 'Philosophical' });
        this.addFrameworkToggle(philFrameworks, 'includePhenomenological', 'Phenomenology');
        this.addFrameworkToggle(philFrameworks, 'includeExistentialist', 'Existentialism');
        this.addFrameworkToggle(philFrameworks, 'includeFeminist', 'Feminist Theory');
        this.addFrameworkToggle(philFrameworks, 'includeCritical', 'Critical Theory');
        this.addFrameworkToggle(philFrameworks, 'includePosthumanist', 'Posthumanism');
        this.addFrameworkToggle(philFrameworks, 'includeBuddhist', 'Buddhist Philosophy');
        this.addFrameworkToggle(philFrameworks, 'includeHermeneutics', 'Hermeneutics');
        this.addFrameworkToggle(philFrameworks, 'includeStoicism', 'Stoicism');
        this.addFrameworkToggle(philFrameworks, 'includeNietzschean', 'Nietzschean Philosophy');
        
        // Framework selection buttons
        const frameworkButtonsContainer = frameworkSection.createDiv('deleometer-framework-buttons');
        
        new ButtonComponent(frameworkButtonsContainer)
            .setButtonText('Select All')
            .onClick(() => {
                this.selectAllFrameworks(true);
            });
            
        new ButtonComponent(frameworkButtonsContainer)
            .setButtonText('Select None')
            .onClick(() => {
                this.selectAllFrameworks(false);
            });
            
        new ButtonComponent(frameworkButtonsContainer)
            .setButtonText('Core Frameworks Only')
            .onClick(() => {
                this.selectCoreFrameworks();
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
            
        // Initialize options
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
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
    
    /**
     * Update the file list display
     */
    private updateFileList() {
        const fileListContainer = this.contentEl.querySelector('.deleometer-file-list');
        if (!fileListContainer) return;
        
        fileListContainer.empty();
        
        if (this.files.length === 0) {
            fileListContainer.createEl('p', { text: 'No files selected. Click "Add Files" to select files for comparison.' });
            return;
        }
        
        const fileList = fileListContainer.createEl('ul', { cls: 'deleometer-selected-files' });
        
        this.files.forEach((file, index) => {
            const fileItem = fileList.createEl('li', { cls: 'deleometer-file-item' });
            
            fileItem.createSpan({ text: file.name, cls: 'deleometer-file-name' });
            
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
     * Add a framework toggle setting
     */
    private addFrameworkToggle(container: HTMLElement, optionKey: string, displayName: string, defaultValue: boolean = false) {
        new Setting(container)
            .setName(displayName)
            .addToggle(toggle => {
                toggle
                    .setValue(defaultValue)
                    .onChange(value => {
                        this.options[optionKey] = value;
                    });
            });
    }
    
    /**
     * Select or deselect all frameworks
     */
    private selectAllFrameworks(selected: boolean) {
        // Update all toggles
        this.contentEl.querySelectorAll('.setting-item').forEach(item => {
            const toggle = item.querySelector('.checkbox-container') as HTMLElement;
            if (toggle) {
                // Check if toggle is not already in the desired state
                const isChecked = toggle.classList.contains('is-enabled');
                if (isChecked !== selected) {
                    toggle.click(); // Simulate click to change state
                }
            }
        });
        
        // Update options
        const frameworkKeys = [
            'includeTacktical', 'includeFreudian', 'includeLacanian', 'includeDeleuzian', 'includeIrigarayian',
            'includeJungian', 'includeAttachment', 'includePositive', 'includeNarrative', 'includePhenomenological',
            'includeExistentialist', 'includeFeminist', 'includeCritical', 'includePosthumanist', 'includeBuddhist',
            'includeExistentialPsychology', 'includeGestalt', 'includeTranspersonal', 'includeCognitiveBehavioral',
            'includeHermeneutics', 'includeStoicism', 'includeNietzschean', 'includePsychiatry'
        ];
        
        frameworkKeys.forEach(key => {
            this.options[key] = selected;
        });
    }
    
    /**
     * Select only core frameworks
     */
    private selectCoreFrameworks() {
        // First deselect all
        this.selectAllFrameworks(false);
        
        // Then select core frameworks
        const coreFrameworks = [
            'includeTacktical', 'includeFreudian', 'includeLacanian', 'includeDeleuzian', 'includeIrigarayian'
        ];
        
        coreFrameworks.forEach(key => {
            this.options[key] = true;
            
            // Find and update the toggle
            this.contentEl.querySelectorAll('.setting-item').forEach(item => {
                const name = item.querySelector('.setting-item-name')?.textContent;
                const toggle = item.querySelector('.checkbox-container') as HTMLElement;
                
                if (toggle && name) {
                    const frameworkMap = {
                        'includeTacktical': 'Tacktical Methodology',
                        'includeFreudian': 'Freudian Psychoanalysis',
                        'includeLacanian': 'Lacanian Psychoanalysis',
                        'includeDeleuzian': 'Deleuzian Schizoanalysis',
                        'includeIrigarayian': 'Irigarayian Feminist Theory'
                    };
                    
                    if (name.includes(frameworkMap[key])) {
                        const isChecked = toggle.classList.contains('is-enabled');
                        if (!isChecked) {
                            toggle.click(); // Simulate click to change state
                        }
                    }
                }
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
            
            // Open comparative analysis view
            const leaf = this.app.workspace.getLeaf();
            await leaf.setViewState({
                type: 'comparative-analysis',
                state: { results }
            });
            
            // If the view wasn't registered yet, show results in a modal instead
            if (!leaf.view || leaf.view.getViewType() !== 'comparative-analysis') {
                new ComparativeAnalysisResultModal(this.app, results).open();
            }
        } catch (error) {
            console.error('Error running comparative analysis:', error);
            new Notice(`Error running comparative analysis: ${error.message}`);
            this.loadingIndicator.hide();
        }
    }
}

/**
 * Modal for selecting files
 */
class FileSelectorModal extends Modal {
    private files: TFile[] = [];
    private callback: (files: TFile[]) => void;
    
    constructor(app: App, callback: (files: TFile[]) => void) {
        super(app);
        this.callback = callback;
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-file-selector-modal');
        
        contentEl.createEl('h2', { text: 'Select Files' });
        
        // File type filter
        const filterContainer = contentEl.createDiv('deleometer-filter-container');
        filterContainer.createEl('span', { text: 'Filter by type: ' });
        
        const filterOptions = [
            { value: 'all', label: 'All' },
            { value: 'text', label: 'Text' },
            { value: 'image', label: 'Images' },
            { value: 'audio', label: 'Audio' },
            { value: 'film', label: 'Film' }
        ];
        
        const filterSelect = filterContainer.createEl('select', { cls: 'dropdown' });
        filterOptions.forEach(option => {
            filterSelect.createEl('option', {
                text: option.label,
                value: option.value
            });
        });
        
        filterSelect.addEventListener('change', () => {
            this.updateFileList(filterSelect.value);
        });
        
        // File list
        const fileListContainer = contentEl.createDiv('deleometer-file-list-container');
        
        // Buttons
        const buttonsContainer = contentEl.createDiv('deleometer-modal-buttons');
        
        new ButtonComponent(buttonsContainer)
            .setButtonText('Cancel')
            .onClick(() => {
                this.close();
            });
            
        new ButtonComponent(buttonsContainer)
            .setButtonText('Select')
            .setCta()
            .onClick(() => {
                this.close();
                this.callback(this.files);
            });
        
        // Initialize file list
        this.updateFileList('all');
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
    
    /**
     * Update the file list based on the selected filter
     */
    private updateFileList(filter: string) {
        const fileListContainer = this.contentEl.querySelector('.deleometer-file-list-container');
        if (!fileListContainer) return;
        
        fileListContainer.empty();
        
        // Get all files in the vault
        const allFiles = this.app.vault.getFiles();
        
        // Filter files based on the selected filter
        let filteredFiles: TFile[] = [];
        
        if (filter === 'all') {
            filteredFiles = allFiles;
        } else if (filter === 'text') {
            filteredFiles = allFiles.filter(file => file.extension === 'md' || file.extension === 'txt');
        } else if (filter === 'image') {
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
            filteredFiles = allFiles.filter(file => imageExtensions.includes(file.extension.toLowerCase()));
        } else if (filter === 'audio') {
            const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'];
            filteredFiles = allFiles.filter(file => audioExtensions.includes(file.extension.toLowerCase()));
        } else if (filter === 'film') {
            const filmExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'];
            filteredFiles = allFiles.filter(file => filmExtensions.includes(file.extension.toLowerCase()));
        }
        
        // Create file list
        const fileList = fileListContainer.createEl('div', { cls: 'deleometer-file-selector-list' });
        
        if (filteredFiles.length === 0) {
            fileList.createEl('p', { text: 'No files found' });
            return;
        }
        
        // Group files by folder
        const filesByFolder: Record<string, TFile[]> = {};
        
        filteredFiles.forEach(file => {
            const folderPath = file.parent?.path || '';
            if (!filesByFolder[folderPath]) {
                filesByFolder[folderPath] = [];
            }
            filesByFolder[folderPath].push(file);
        });
        
        // Create folder groups
        Object.entries(filesByFolder).sort(([a], [b]) => a.localeCompare(b)).forEach(([folderPath, files]) => {
            const folderGroup = fileList.createDiv('deleometer-folder-group');
            
            // Folder header
            const folderHeader = folderGroup.createDiv('deleometer-folder-header');
            folderHeader.createEl('span', { 
                text: folderPath || 'Root',
                cls: 'deleometer-folder-name'
            });
            
            // File items
            const fileItems = folderGroup.createDiv('deleometer-file-items');
            
            files.sort((a, b) => a.name.localeCompare(b.name)).forEach(file => {
                const fileItem = fileItems.createDiv('deleometer-file-item');
                
                const checkbox = fileItem.createEl('input', {
                    type: 'checkbox',
                    cls: 'deleometer-file-checkbox'
                });
                
                fileItem.createSpan({ 
                    text: file.name,
                    cls: 'deleometer-file-name'
                });
                
                // Set initial state
                checkbox.checked = this.files.some(f => f.path === file.path);
                
                // Add event listener
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        if (!this.files.some(f => f.path === file.path)) {
                            this.files.push(file);
                        }
                    } else {
                        this.files = this.files.filter(f => f.path !== file.path);
                    }
                });
            });
        });
    }
}

/**
 * Modal for displaying comparative analysis results
 * This is a fallback if the view is not registered
 */
class ComparativeAnalysisResultModal extends Modal {
    private results: ArtisticAnalysisResult[];
    
    constructor(app: App, results: ArtisticAnalysisResult[]) {
        super(app);
        this.results = results;
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-comparative-analysis-result-modal');
        
        contentEl.createEl('h2', { text: 'Comparative Analysis Results' });
        
        // Create a simplified version of the comparative analysis view
        const resultsContainer = contentEl.createDiv('deleometer-comparative-results');
        
        // File names
        const fileNamesContainer = resultsContainer.createDiv('deleometer-file-names');
        this.results.forEach(result => {
            fileNamesContainer.createEl('div', { 
                text: result.fileName,
                cls: 'deleometer-file-name'
            });
        });
        
        // Summaries
        const summariesContainer = resultsContainer.createDiv('deleometer-summaries');
        summariesContainer.createEl('h3', { text: 'Summaries' });
        
        this.results.forEach(result => {
            const summaryCard = summariesContainer.createDiv('deleometer-summary-card');
            summaryCard.createEl('h4', { text: result.fileName });
            summaryCard.createEl('p', { text: result.summary });
        });
        
        // Common themes
        const commonThemesContainer = resultsContainer.createDiv('deleometer-common-themes');
        commonThemesContainer.createEl('h3', { text: 'Common Themes' });
        
        // This is a simplified version - in the real view, we would do more sophisticated analysis
        commonThemesContainer.createEl('p', { 
            text: 'For a more detailed comparative analysis, please use the Comparative Analysis View.'
        });
        
        // Buttons
        const buttonsContainer = contentEl.createDiv('deleometer-modal-buttons');
        
        new ButtonComponent(buttonsContainer)
            .setButtonText('Close')
            .setCta()
            .onClick(() => {
                this.close();
            });
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
