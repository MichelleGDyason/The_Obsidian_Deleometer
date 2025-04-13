import { App, Modal, Setting, TFolder, TFile, Notice } from 'obsidian';
import { AnalysisScope, AnalysisOptions } from './analysisScope';
import { EnhancedAnalysisVisualization } from './enhancedAnalysisVisualization';

/**
 * Modal for selecting analysis scope and options
 */
export class AnalysisScopeModal extends Modal {
    private analysisScope: AnalysisScope;
    private visualization: EnhancedAnalysisVisualization;
    private options: AnalysisOptions = {};
    private scope: 'note' | 'file' | 'folder' | 'vault' = 'note';
    private target: string = '';
    private selectedFiles: string[] = [];
    private selectedFolders: string[] = [];
    private multipleSelectionEnabled: boolean = false;

    constructor(app: App, analysisScope: AnalysisScope, visualization: EnhancedAnalysisVisualization) {
        super(app);
        this.analysisScope = analysisScope;
        this.visualization = visualization;
    }

    onOpen() {
        const { contentEl } = this;

        // Add title
        contentEl.createEl('h2', { text: 'Analysis Scope' });

        // Add scope selector
        new Setting(contentEl)
            .setName('Scope')
            .setDesc('Select what to analyze')
            .addDropdown(dropdown => {
                dropdown.addOption('note', 'Current Note');
                dropdown.addOption('file', 'Specific File');
                dropdown.addOption('folder', 'Folder');
                dropdown.addOption('vault', 'Entire Vault');

                dropdown.setValue(this.scope);

                dropdown.onChange(value => {
                    this.scope = value as 'note' | 'file' | 'folder' | 'vault';
                    this.updateTargetSelector();
                });
            });

        // Add multiple selection toggle
        if (this.scope === 'file' || this.scope === 'folder') {
            new Setting(contentEl)
                .setName('Multiple Selection')
                .setDesc('Enable selecting multiple files or folders')
                .addToggle(toggle => {
                    toggle.setValue(this.multipleSelectionEnabled);

                    toggle.onChange(value => {
                        this.multipleSelectionEnabled = value;
                        this.updateTargetSelector();
                    });
                });
        }

        // Add target selector container
        const targetContainer = contentEl.createDiv({ cls: 'analysis-target-container' });

        // Add frameworks section
        contentEl.createEl('h3', { text: 'Frameworks' });

        const frameworksContainer = contentEl.createDiv({ cls: 'analysis-frameworks-container' });

        // Add traditional frameworks
        this.addFrameworkOption(frameworksContainer, 'includeFreudian', 'Freudian Psychoanalysis');
        this.addFrameworkOption(frameworksContainer, 'includeLacanian', 'Lacanian Psychoanalysis');
        this.addFrameworkOption(frameworksContainer, 'includeDeleuzian', 'Deleuzian Schizoanalysis');
        this.addFrameworkOption(frameworksContainer, 'includeIrigarayian', 'Irigarayian Psychoanalysis');

        // Add depth psychology frameworks
        this.addFrameworkOption(frameworksContainer, 'includeJungian', 'Jungian Analytical Psychology');
        this.addFrameworkOption(frameworksContainer, 'includeExistentialPsychology', 'Existential Psychology');
        this.addFrameworkOption(frameworksContainer, 'includeGestalt', 'Gestalt Psychology');
        this.addFrameworkOption(frameworksContainer, 'includeTranspersonal', 'Transpersonal Psychology');

        // Add contemporary frameworks
        this.addFrameworkOption(frameworksContainer, 'includeAttachment', 'Attachment Theory');
        this.addFrameworkOption(frameworksContainer, 'includePositive', 'Positive Psychology');
        this.addFrameworkOption(frameworksContainer, 'includeNarrative', 'Narrative Psychology');
        this.addFrameworkOption(frameworksContainer, 'includeCognitiveBehavioral', 'Cognitive-Behavioral');

        // Add philosophical frameworks
        this.addFrameworkOption(frameworksContainer, 'includePhenomenological', 'Phenomenology');
        this.addFrameworkOption(frameworksContainer, 'includeExistentialist', 'Existentialism');
        this.addFrameworkOption(frameworksContainer, 'includeHermeneutics', 'Hermeneutics');
        this.addFrameworkOption(frameworksContainer, 'includeStoicism', 'Stoicism');
        this.addFrameworkOption(frameworksContainer, 'includeNietzschean', 'Nietzschean Insights');

        // Add critical frameworks
        this.addFrameworkOption(frameworksContainer, 'includeFeminist', 'Feminist Philosophy');
        this.addFrameworkOption(frameworksContainer, 'includeCritical', 'Critical Theory');
        this.addFrameworkOption(frameworksContainer, 'includePosthumanist', 'Posthumanism');

        // Add spiritual frameworks
        this.addFrameworkOption(frameworksContainer, 'includeBuddhist', 'Buddhist Philosophy');

        // Add clinical frameworks
        this.addFrameworkOption(frameworksContainer, 'includePsychiatry', 'Psychiatry');

        // Add next steps option
        this.addFrameworkOption(contentEl, 'includeNextSteps', 'Include Next Steps Recommendations');

        // Add detail level selector
        new Setting(contentEl)
            .setName('Detail Level')
            .setDesc('Select the level of detail for the analysis')
            .addDropdown(dropdown => {
                dropdown.addOption('basic', 'Basic');
                dropdown.addOption('detailed', 'Detailed');
                dropdown.addOption('comprehensive', 'Comprehensive');

                dropdown.setValue(this.options.detailLevel || 'detailed');

                dropdown.onChange(value => {
                    this.options.detailLevel = value as 'basic' | 'detailed' | 'comprehensive';
                });
            });

        // Add analyze button
        const analyzeButton = contentEl.createEl('button', {
            text: 'Analyze',
            cls: 'analyze-button'
        });

        analyzeButton.addEventListener('click', () => {
            this.analyze();
        });

        // Initialize target selector
        this.updateTargetSelector();

        // Add CSS
        this.addStyles();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    /**
     * Update the target selector based on the selected scope
     */
    private updateTargetSelector() {
        const { contentEl } = this;

        // Clear existing target selector
        const targetContainer = contentEl.querySelector('.analysis-target-container');
        if (targetContainer) {
            targetContainer.empty();

            switch (this.scope) {
                case 'note':
                    // No target selector needed for current note
                    break;

                case 'file':
                    this.createFileSelector(targetContainer);
                    break;

                case 'folder':
                    this.createFolderSelector(targetContainer);
                    break;

                case 'vault':
                    // Add max entries selector for vault
                    new Setting(targetContainer)
                        .setName('Max Entries')
                        .setDesc('Maximum number of entries to analyze')
                        .addSlider(slider => {
                            slider.setLimits(5, 50, 5);
                            slider.setValue(this.options.maxEntries || 20);
                            slider.setDynamicTooltip();

                            slider.onChange(value => {
                                this.options.maxEntries = value;
                            });
                        });
                    break;
            }
        }
    }

    /**
     * Create a file selector
     * @param container The container to add the selector to
     */
    private createFileSelector(container: HTMLElement) {
        if (this.multipleSelectionEnabled) {
            // Create a heading for the file selector
            container.createEl('h3', { text: 'Select Files' });

            // Get all markdown files
            const files = this.app.vault.getMarkdownFiles();

            // Create a container for the file checkboxes
            const filesContainer = container.createDiv({ cls: 'files-container' });

            // Add a checkbox for each file
            for (const file of files) {
                const fileCheckbox = new Setting(filesContainer)
                    .setName(file.path)
                    .addToggle(toggle => {
                        toggle.setValue(this.selectedFiles.includes(file.path));

                        toggle.onChange(value => {
                            if (value) {
                                // Add the file to the selected files
                                if (!this.selectedFiles.includes(file.path)) {
                                    this.selectedFiles.push(file.path);
                                }
                            } else {
                                // Remove the file from the selected files
                                this.selectedFiles = this.selectedFiles.filter(f => f !== file.path);
                            }
                        });
                    });
            }

            // Add a search box to filter files
            new Setting(container)
                .setName('Search')
                .setDesc('Filter files by name')
                .addText(text => {
                    text.setPlaceholder('Search files...');

                    text.onChange(value => {
                        // Get all file settings
                        const fileSettings = filesContainer.querySelectorAll('.setting');

                        // Show/hide files based on search
                        fileSettings.forEach(setting => {
                            const nameEl = setting.querySelector('.setting-name');
                            if (nameEl) {
                                const name = nameEl.textContent || '';

                                if (name.toLowerCase().includes(value.toLowerCase())) {
                                    setting.style.display = 'flex';
                                } else {
                                    setting.style.display = 'none';
                                }
                            }
                        });
                    });
                });

            // Add a button to select all visible files
            const selectAllButton = container.createEl('button', { text: 'Select All Visible' });
            selectAllButton.addEventListener('click', () => {
                // Get all visible file settings
                const fileSettings = filesContainer.querySelectorAll('.setting');

                fileSettings.forEach(setting => {
                    if (setting.style.display !== 'none') {
                        const nameEl = setting.querySelector('.setting-name');
                        const toggleEl = setting.querySelector('.checkbox-container');

                        if (nameEl && toggleEl) {
                            const name = nameEl.textContent || '';
                            const toggle = toggleEl.querySelector('input');

                            if (toggle) {
                                toggle.checked = true;

                                // Add the file to the selected files
                                if (!this.selectedFiles.includes(name)) {
                                    this.selectedFiles.push(name);
                                }
                            }
                        }
                    }
                });
            });

            // Add a button to deselect all files
            const deselectAllButton = container.createEl('button', { text: 'Deselect All' });
            deselectAllButton.addEventListener('click', () => {
                // Get all file settings
                const fileSettings = filesContainer.querySelectorAll('.setting');

                fileSettings.forEach(setting => {
                    const toggleEl = setting.querySelector('.checkbox-container');

                    if (toggleEl) {
                        const toggle = toggleEl.querySelector('input');

                        if (toggle) {
                            toggle.checked = false;
                        }
                    }
                });

                // Clear selected files
                this.selectedFiles = [];
            });
        } else {
            // Single file selection
            const fileSelector = new Setting(container)
                .setName('File')
                .setDesc('Select a file to analyze')
                .addDropdown(dropdown => {
                    // Get all markdown files
                    const files = this.app.vault.getMarkdownFiles();

                    // Add options for each file
                    for (const file of files) {
                        dropdown.addOption(file.path, file.path);
                    }

                    dropdown.onChange(value => {
                        this.target = value;
                    });
                });
        }
    }

    /**
     * Create a folder selector
     * @param container The container to add the selector to
     */
    private createFolderSelector(container: HTMLElement) {
        if (this.multipleSelectionEnabled) {
            // Create a heading for the folder selector
            container.createEl('h3', { text: 'Select Folders' });

            // Get all folders
            const folders: TFolder[] = [];

            // Recursive function to get all folders
            const getFolders = (folder: TFolder) => {
                folders.push(folder);

                for (const child of folder.children) {
                    if (child instanceof TFolder) {
                        getFolders(child);
                    }
                }
            };

            // Get all folders starting from the root
            getFolders(this.app.vault.getRoot());

            // Create a container for the folder checkboxes
            const foldersContainer = container.createDiv({ cls: 'folders-container' });

            // Add a checkbox for each folder
            for (const folder of folders) {
                const folderCheckbox = new Setting(foldersContainer)
                    .setName(folder.path)
                    .addToggle(toggle => {
                        toggle.setValue(this.selectedFolders.includes(folder.path));

                        toggle.onChange(value => {
                            if (value) {
                                // Add the folder to the selected folders
                                if (!this.selectedFolders.includes(folder.path)) {
                                    this.selectedFolders.push(folder.path);
                                }
                            } else {
                                // Remove the folder from the selected folders
                                this.selectedFolders = this.selectedFolders.filter(f => f !== folder.path);
                            }
                        });
                    });
            }

            // Add a search box to filter folders
            new Setting(container)
                .setName('Search')
                .setDesc('Filter folders by name')
                .addText(text => {
                    text.setPlaceholder('Search folders...');

                    text.onChange(value => {
                        // Get all folder settings
                        const folderSettings = foldersContainer.querySelectorAll('.setting');

                        // Show/hide folders based on search
                        folderSettings.forEach(setting => {
                            const nameEl = setting.querySelector('.setting-name');
                            if (nameEl) {
                                const name = nameEl.textContent || '';

                                if (name.toLowerCase().includes(value.toLowerCase())) {
                                    setting.style.display = 'flex';
                                } else {
                                    setting.style.display = 'none';
                                }
                            }
                        });
                    });
                });

            // Add a button to select all visible folders
            const selectAllButton = container.createEl('button', { text: 'Select All Visible' });
            selectAllButton.addEventListener('click', () => {
                // Get all visible folder settings
                const folderSettings = foldersContainer.querySelectorAll('.setting');

                folderSettings.forEach(setting => {
                    if (setting.style.display !== 'none') {
                        const nameEl = setting.querySelector('.setting-name');
                        const toggleEl = setting.querySelector('.checkbox-container');

                        if (nameEl && toggleEl) {
                            const name = nameEl.textContent || '';
                            const toggle = toggleEl.querySelector('input');

                            if (toggle) {
                                toggle.checked = true;

                                // Add the folder to the selected folders
                                if (!this.selectedFolders.includes(name)) {
                                    this.selectedFolders.push(name);
                                }
                            }
                        }
                    }
                });
            });

            // Add a button to deselect all folders
            const deselectAllButton = container.createEl('button', { text: 'Deselect All' });
            deselectAllButton.addEventListener('click', () => {
                // Get all folder settings
                const folderSettings = foldersContainer.querySelectorAll('.setting');

                folderSettings.forEach(setting => {
                    const toggleEl = setting.querySelector('.checkbox-container');

                    if (toggleEl) {
                        const toggle = toggleEl.querySelector('input');

                        if (toggle) {
                            toggle.checked = false;
                        }
                    }
                });

                // Clear selected folders
                this.selectedFolders = [];
            });
        } else {
            // Single folder selection
            const folderSelector = new Setting(container)
                .setName('Folder')
                .setDesc('Select a folder to analyze')
                .addDropdown(dropdown => {
                    // Get all folders
                    const folders: TFolder[] = [];

                    // Recursive function to get all folders
                    const getFolders = (folder: TFolder) => {
                        folders.push(folder);

                        for (const child of folder.children) {
                            if (child instanceof TFolder) {
                                getFolders(child);
                            }
                        }
                    };

                    // Get all folders starting from the root
                    getFolders(this.app.vault.getRoot());

                    // Add options for each folder
                    for (const folder of folders) {
                        dropdown.addOption(folder.path, folder.path);
                    }

                    dropdown.onChange(value => {
                        this.target = value;
                    });
                });
        }

        // Add max entries selector
        new Setting(container)
            .setName('Max Entries')
            .setDesc('Maximum number of entries to analyze')
            .addSlider(slider => {
                slider.setLimits(5, 30, 5);
                slider.setValue(this.options.maxEntries || 10);
                slider.setDynamicTooltip();

                slider.onChange(value => {
                    this.options.maxEntries = value;
                });
            });
    }

    /**
     * Add a framework option
     * @param container The container to add the option to
     * @param optionKey The key in the options object
     * @param displayName The display name for the option
     */
    private addFrameworkOption(container: HTMLElement, optionKey: string, displayName: string) {
        new Setting(container)
            .setName(displayName)
            .addToggle(toggle => {
                toggle.setValue(this.options[optionKey] || false);

                toggle.onChange(value => {
                    this.options[optionKey] = value;
                });
            });
    }

    /**
     * Analyze the selected scope
     */
    private async analyze() {
        try {
            new Notice('Analysis started...');

            // Create progress container
            const { contentEl } = this;
            const progressContainer = contentEl.createDiv({ cls: 'analysis-progress-container' });
            progressContainer.createEl('h3', { text: 'Analysis Progress' });

            // Create progress bar
            this.renderProgressBar(progressContainer, 0);

            let result;

            // Perform the analysis based on the scope and selection mode
            if (this.multipleSelectionEnabled) {
                if (this.scope === 'file' && this.selectedFiles.length > 0) {
                    // Analyze multiple files with progress updates
                    const totalFiles = this.selectedFiles.length;
                    let processedFiles = 0;

                    // Update progress function
                    const updateProgress = () => {
                        processedFiles++;
                        const progress = processedFiles / totalFiles;
                        this.updateProgressBar(progressContainer, progress);
                    };

                    // Analyze multiple files
                    result = await this.analysisScope.analyzeMultipleFiles(
                        this.selectedFiles,
                        this.options,
                        updateProgress
                    );
                } else if (this.scope === 'folder' && this.selectedFolders.length > 0) {
                    // Analyze multiple folders with progress updates
                    const totalFolders = this.selectedFolders.length;
                    let processedFolders = 0;

                    // Update progress function
                    const updateProgress = () => {
                        processedFolders++;
                        const progress = processedFolders / totalFolders;
                        this.updateProgressBar(progressContainer, progress);
                    };

                    // Analyze multiple folders
                    result = await this.analysisScope.analyzeMultipleFolders(
                        this.selectedFolders,
                        this.options,
                        updateProgress
                    );
                } else {
                    throw new Error('No files or folders selected');
                }
            } else {
                // Analyze single target with simulated progress
                const simulateProgress = async () => {
                    for (let i = 1; i <= 10; i++) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                        this.updateProgressBar(progressContainer, i / 10);
                    }
                };

                // Start progress simulation
                simulateProgress();

                // Analyze single target
                result = await this.analysisScope.analyze(this.scope, this.target, this.options);
            }

            // Update progress to complete
            this.updateProgressBar(progressContainer, 1);

            // Visualize the result
            this.visualization.visualizeResult(result);

            // Close the modal
            this.close();

            new Notice('Analysis complete!');
        } catch (error) {
            console.error('Error analyzing:', error);
            new Notice(`Error: ${error.message}`);
        }
    }

    /**
     * Render a progress bar
     * @param container The container to add the progress bar to
     * @param progress The progress value (0-1)
     */
    private renderProgressBar(container: HTMLElement, progress: number): void {
        const progressBarContainer = container.createDiv({ cls: 'deleometer-progress-container' });
        const progressBar = progressBarContainer.createDiv({ cls: 'deleometer-progress-bar' });
        progressBar.style.width = `${progress * 100}%`;

        // Add progress percentage text
        const progressText = progressBarContainer.createDiv({ cls: 'deleometer-progress-text' });
        progressText.setText(`${Math.round(progress * 100)}%`);

        // Add animation
        progressBar.addClass('deleometer-progress-animate');
    }

    /**
     * Update an existing progress bar
     * @param container The container with the progress bar
     * @param progress The new progress value (0-1)
     */
    private updateProgressBar(container: HTMLElement, progress: number): void {
        const progressBarContainer = container.querySelector('.deleometer-progress-container');
        if (progressBarContainer) {
            const progressBar = progressBarContainer.querySelector('.deleometer-progress-bar');
            const progressText = progressBarContainer.querySelector('.deleometer-progress-text');

            if (progressBar) {
                progressBar.style.width = `${progress * 100}%`;
            }

            if (progressText) {
                progressText.textContent = `${Math.round(progress * 100)}%`;
            }
        }
    }
    /**
     * Add CSS styles for the modal
     */
    private addStyles() {
        const { contentEl } = this;

        // Add a style element
        const style = contentEl.createEl('style');
        style.textContent = `
            .analysis-frameworks-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 20px;
            }

            .analyze-button {
                display: block;
                width: 100%;
                padding: 10px;
                margin-top: 20px;
                background-color: var(--interactive-accent);
                color: var(--text-on-accent);
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1.1em;
            }

            .analyze-button:hover {
                background-color: var(--interactive-accent-hover);
            }

            .analysis-progress-container {
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .deleometer-progress-container {
                width: 100%;
                height: 20px;
                background-color: var(--background-secondary);
                border-radius: 10px;
                overflow: hidden;
                margin-top: 10px;
                position: relative;
            }

            .deleometer-progress-bar {
                height: 100%;
                background-color: var(--interactive-accent);
                border-radius: 10px;
                transition: width 0.3s ease;
            }

            .deleometer-progress-text {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-on-accent);
                font-weight: bold;
                text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            }

            .deleometer-progress-animate {
                background-image: linear-gradient(
                    45deg,
                    rgba(255, 255, 255, 0.15) 25%,
                    transparent 25%,
                    transparent 50%,
                    rgba(255, 255, 255, 0.15) 50%,
                    rgba(255, 255, 255, 0.15) 75%,
                    transparent 75%,
                    transparent
                );
                background-size: 1rem 1rem;
                animation: deleometer-progress-animation 1s linear infinite;
            }

            @keyframes deleometer-progress-animation {
                0% {
                    background-position: 0 0;
                }
                100% {
                    background-position: 1rem 0;
                }
            }
        `;
    }
}
