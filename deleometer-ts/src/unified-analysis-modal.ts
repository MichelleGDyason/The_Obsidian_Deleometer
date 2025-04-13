import { App, Modal, Notice, TFile } from 'obsidian';
import { MEDIA_TYPES } from './constants';
import DeleometerPlugin from './main';
import { AnalysisResultsModal } from './analysis-results-modal';

interface FileInfo {
    file: TFile;
    mediaType: string;
}

export class UnifiedAnalysisModal extends Modal {
    plugin: DeleometerPlugin;
    selectedFile: FileInfo | null = null;
    selectedFiles: FileInfo[] = [];
    selectedFrameworks: string[] = [];
    isBatchMode: boolean = false;
    updateSelectedFilesList: () => void;
    
    constructor(app: App, plugin: DeleometerPlugin) {
        super(app);
        this.plugin = plugin;
        this.selectedFrameworks = Object.keys(plugin.settings.enabledFrameworks)
            .filter(key => plugin.settings.enabledFrameworks[key]);
        this.updateSelectedFilesList = () => {}; // Will be defined in onOpen
    }
    
    onOpen() {
        const { contentEl } = this;
        
        contentEl.createEl('h2', { text: 'Theoretical Analysis' });
        
        // Analysis Mode Selection
        const modeSelection = contentEl.createEl('div', { cls: 'deleometer-mode-selection' });
        
        const singleModeRadio = modeSelection.createEl('input', { 
            type: 'radio', 
            attr: { name: 'analysis-mode', id: 'single-mode', checked: true } 
        });
        modeSelection.createEl('label', { 
            text: 'Single File Analysis', 
            attr: { for: 'single-mode' } 
        });
        
        modeSelection.createEl('span', { text: ' | ' });
        
        const batchModeRadio = modeSelection.createEl('input', { 
            type: 'radio', 
            attr: { name: 'analysis-mode', id: 'batch-mode' } 
        });
        modeSelection.createEl('label', { 
            text: 'Batch Analysis', 
            attr: { for: 'batch-mode' } 
        });
        
        // Content selection container
        const contentSelectionContainer = contentEl.createEl('div', { cls: 'deleometer-content-selection-container' });
        
        // Single file selection (initially visible)
        const singleFileSelection = contentSelectionContainer.createEl('div', { cls: 'deleometer-single-file-selection' });
        
        // Option for current file
        const currentFileOption = singleFileSelection.createEl('div', { cls: 'deleometer-option' });
        const currentFileRadio = currentFileOption.createEl('input', { 
            type: 'radio', 
            attr: { name: 'content-source', id: 'current-file', checked: true } 
        });
        currentFileOption.createEl('label', { 
            text: 'Current file/note', 
            attr: { for: 'current-file' } 
        });
        
        // Option for selecting a file
        const selectFileOption = singleFileSelection.createEl('div', { cls: 'deleometer-option' });
        const selectFileRadio = selectFileOption.createEl('input', { 
            type: 'radio', 
            attr: { name: 'content-source', id: 'select-file' } 
        });
        selectFileOption.createEl('label', { 
            text: 'Select a file', 
            attr: { for: 'select-file' } 
        });
        
        // File browser button (initially hidden)
        const fileBrowserButton = singleFileSelection.createEl('button', { 
            text: 'Browse Files',
            cls: 'deleometer-file-browser-button'
        });
        fileBrowserButton.style.display = 'none';
        
        // Selected file display
        const selectedFileDisplay = singleFileSelection.createEl('div', { 
            cls: 'deleometer-selected-file-display' 
        });
        selectedFileDisplay.style.display = 'none';
        
        // Batch file selection (initially hidden)
        const batchFileSelection = contentSelectionContainer.createEl('div', { 
            cls: 'deleometer-batch-file-selection' 
        });
        batchFileSelection.style.display = 'none';
        
        // Batch file selection button
        const batchFileBrowserButton = batchFileSelection.createEl('button', { 
            text: 'Select Files for Analysis',
            cls: 'deleometer-batch-file-browser-button'
        });
        
        // Selected files display
        const selectedFilesDisplay = batchFileSelection.createEl('div', { 
            cls: 'deleometer-selected-files-display' 
        });
        const selectedFilesList = selectedFilesDisplay.createEl('ul', { 
            cls: 'deleometer-selected-files-list' 
        });
        selectedFilesList.createEl('li', { text: 'No files selected' });
        
        // Framework selection section
        const frameworkSelection = contentEl.createEl('div', { cls: 'deleometer-framework-selection' });
        frameworkSelection.createEl('h3', { text: 'Framework Selection' });
        
        // Select All/None buttons
        const frameworkSelectionButtons = frameworkSelection.createEl('div', { 
            cls: 'deleometer-framework-selection-buttons' 
        });
        
        const selectAllButton = frameworkSelectionButtons.createEl('button', { 
            text: 'Select All',
            cls: 'deleometer-select-all-button'
        });
        
        const selectNoneButton = frameworkSelectionButtons.createEl('button', { 
            text: 'Select None',
            cls: 'deleometer-select-none-button'
        });
        
        // Create a checkbox for each framework
        const frameworkList = frameworkSelection.createEl('div', { cls: 'deleometer-framework-list' });
        
        const frameworkCheckboxes: Record<string, HTMLInputElement> = {};
        
        Object.keys(this.plugin.settings.enabledFrameworks).forEach(frameworkId => {
            if (this.plugin.settings.enabledFrameworks[frameworkId]) {
                const frameworkItem = frameworkList.createEl('div', { cls: 'deleometer-framework-item' });
                const checkbox = frameworkItem.createEl('input', { type: 'checkbox' });
                checkbox.type = 'checkbox';
                checkbox.id = `framework-${frameworkId}`;
                checkbox.checked = true; // All frameworks selected by default
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        if (!this.selectedFrameworks.includes(frameworkId)) {
                            this.selectedFrameworks.push(frameworkId);
                        }
                    } else {
                        this.selectedFrameworks = this.selectedFrameworks.filter(id => id !== frameworkId);
                    }
                });
                
                frameworkItem.createEl('label', { 
                    text: this.plugin.analysisEngine.getFrameworkName(frameworkId),
                    attr: { for: `framework-${frameworkId}` }
                });
                
                frameworkCheckboxes[frameworkId] = checkbox;
            }
        });
        
        // Select All button functionality
        selectAllButton.addEventListener('click', () => {
            Object.keys(frameworkCheckboxes).forEach(frameworkId => {
                frameworkCheckboxes[frameworkId].checked = true;
                if (!this.selectedFrameworks.includes(frameworkId)) {
                    this.selectedFrameworks.push(frameworkId);
                }
            });
        });
        
        // Select None button functionality
        selectNoneButton.addEventListener('click', () => {
            Object.keys(frameworkCheckboxes).forEach(frameworkId => {
                frameworkCheckboxes[frameworkId].checked = false;
            });
            this.selectedFrameworks = [];
        });
        
        // Analysis options
        const analysisOptions = contentEl.createEl('div', { cls: 'deleometer-analysis-options' });
        analysisOptions.createEl('h3', { text: 'Analysis Options' });
        
        // Analysis depth
        const depthSelection = analysisOptions.createEl('div', { cls: 'deleometer-depth-selection' });
        depthSelection.createEl('label', { text: 'Analysis Depth:' });
        const depthSelect = depthSelection.createEl('select');
        
        const depthOptions = [
            { value: 'brief', text: 'Brief' },
            { value: 'standard', text: 'Standard' },
            { value: 'detailed', text: 'Detailed' }
        ];
        
        depthOptions.forEach(option => {
            const optionEl = depthSelect.createEl('option', { 
                text: option.text, 
                attr: { value: option.value } 
            });
            if (option.value === this.plugin.settings.analysisDepth) {
                optionEl.selected = true;
            }
        });
        
        depthSelect.addEventListener('change', async () => {
            this.plugin.settings.analysisDepth = depthSelect.value;
            await this.plugin.saveSettings();
        });
        
        // Export options (only visible in batch mode)
        const exportOptions = contentEl.createEl('div', { cls: 'deleometer-export-options' });
        exportOptions.style.display = 'none';
        exportOptions.createEl('h3', { text: 'Export Options' });
        
        const exportFormat = exportOptions.createEl('div', { cls: 'deleometer-export-format' });
        exportFormat.createEl('label', { text: 'Export Format:' });
        const formatSelect = exportFormat.createEl('select');
        formatSelect.createEl('option', { text: 'Markdown', attr: { value: 'markdown', selected: true } });
        formatSelect.createEl('option', { text: 'HTML', attr: { value: 'html' } });
        
        // Auto-open exported files
        const autoOpenOption = exportOptions.createEl('div', { cls: 'deleometer-auto-open-option' });
        const autoOpenCheckbox = autoOpenOption.createEl('input', { 
            type: 'checkbox',
            attr: { id: 'auto-open-files' }
        });
        autoOpenCheckbox.checked = this.plugin.settings.autoOpenExportedFiles;
        autoOpenOption.createEl('label', { 
            text: 'Automatically open exported files',
            attr: { for: 'auto-open-files' }
        });
        
        autoOpenCheckbox.addEventListener('change', async () => {
            this.plugin.settings.autoOpenExportedFiles = autoOpenCheckbox.checked;
            await this.plugin.saveSettings();
        });
        
        // Buttons
        const buttonContainer = contentEl.createEl('div', { cls: 'deleometer-buttons' });
        
        const analyzeButton = buttonContainer.createEl('button', { text: 'Analyze' });
        analyzeButton.addEventListener('click', () => {
            this.close();
            this.performAnalysis(singleModeRadio.checked, currentFileRadio.checked, formatSelect.value);
        });
        
        const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelButton.addEventListener('click', () => {
            this.close();
        });
        
        // Event listeners for mode switching
        singleModeRadio.addEventListener('change', () => {
            if (singleModeRadio.checked) {
                this.isBatchMode = false;
                singleFileSelection.style.display = 'block';
                batchFileSelection.style.display = 'none';
                exportOptions.style.display = 'none';
            }
        });
        
        batchModeRadio.addEventListener('change', () => {
            if (batchModeRadio.checked) {
                this.isBatchMode = true;
                singleFileSelection.style.display = 'none';
                batchFileSelection.style.display = 'block';
                exportOptions.style.display = 'block';
            }
        });
        
        // Event listeners for file selection
        selectFileRadio.addEventListener('change', () => {
            if (selectFileRadio.checked) {
                fileBrowserButton.style.display = 'block';
            } else {
                fileBrowserButton.style.display = 'none';
                selectedFileDisplay.style.display = 'none';
            }
        });
        
        // File browser button functionality
        fileBrowserButton.addEventListener('click', () => {
            this.openFileBrowser(selectedFileDisplay);
        });
        
        // Batch file browser button functionality
        batchFileBrowserButton.addEventListener('click', () => {
            this.openBatchFileBrowser(selectedFilesList);
        });
    }
    
    // Open Obsidian's file browser for single file selection
    openFileBrowser(selectedFileDisplay: HTMLElement) {
        const fileExplorer = this.app.workspace.getLeavesOfType('file-explorer')[0];
        if (!fileExplorer) {
            new Notice('File explorer not found');
            return;
        }
        
        // Create a temporary event handler for file clicks
        const fileClickHandler = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && target.classList.contains('nav-file-title')) {
                const filePath = target.getAttribute('data-path');
                if (filePath) {
                    const file = this.app.vault.getAbstractFileByPath(filePath);
                    if (file instanceof TFile) {
                        this.selectedFile = {
                            file: file,
                            mediaType: this.getMediaType(file)
                        };
                        
                        // Update the selected file display
                        selectedFileDisplay.empty();
                        selectedFileDisplay.style.display = 'block';
                        selectedFileDisplay.createEl('div', { 
                            text: `Selected: ${file.name}`,
                            cls: 'deleometer-selected-file'
                        });
                        
                        // Remove the event listener
                        document.removeEventListener('click', fileClickHandler, true);
                    }
                }
            }
        };
        
        // Add the event listener
        document.addEventListener('click', fileClickHandler, true);
        
        // Show a notice to guide the user
        new Notice('Click on a file in the explorer to select it');
    }
    
    // Open Obsidian's file browser for batch file selection
    openBatchFileBrowser(selectedFilesList: HTMLElement) {
        const fileExplorer = this.app.workspace.getLeavesOfType('file-explorer')[0];
        if (!fileExplorer) {
            new Notice('File explorer not found');
            return;
        }
        
        // Create a temporary event handler for file clicks
        const fileClickHandler = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && target.classList.contains('nav-file-title')) {
                const filePath = target.getAttribute('data-path');
                if (filePath) {
                    const file = this.app.vault.getAbstractFileByPath(filePath);
                    if (file instanceof TFile) {
                        // Check if file is already selected
                        const isAlreadySelected = this.selectedFiles.some(f => f.file.path === file.path);
                        
                        if (!isAlreadySelected) {
                            this.selectedFiles.push({
                                file: file,
                                mediaType: this.getMediaType(file)
                            });
                            
                            // Update the selected files list
                            this.updateSelectedFilesList(selectedFilesList);
                        }
                    }
                }
            }
        };
        
        // Add the event listener
        document.addEventListener('click', fileClickHandler, true);
        
        // Show a notice to guide the user
        new Notice('Click on files in the explorer to select them. Click "Done" when finished.');
        
        // Add a "Done" button to the modal
        const doneButton = this.contentEl.createEl('button', {
            text: 'Done Selecting Files',
            cls: 'deleometer-done-selecting-button'
        });
        
        doneButton.addEventListener('click', () => {
            // Remove the event listener and the button
            document.removeEventListener('click', fileClickHandler, true);
            doneButton.remove();
        });
    }
    
    // Update the selected files list
    updateSelectedFilesList(selectedFilesList: HTMLElement) {
        selectedFilesList.empty();
        
        if (this.selectedFiles.length === 0) {
            selectedFilesList.createEl('li', { text: 'No files selected' });
        } else {
            this.selectedFiles.forEach(fileInfo => {
                const item = selectedFilesList.createEl('li');
                item.createEl('span', { text: fileInfo.file.name });
                const removeButton = item.createEl('button', { 
                    text: 'Remove', 
                    cls: 'deleometer-remove-file' 
                });
                removeButton.addEventListener('click', () => {
                    this.selectedFiles = this.selectedFiles.filter(f => f.file.path !== fileInfo.file.path);
                    this.updateSelectedFilesList(selectedFilesList);
                });
            });
        }
    }
    
    // Get media type based on file extension
    getMediaType(file: TFile): string {
        if (file.extension === 'md') {
            return MEDIA_TYPES.TEXT;
        } else if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'].includes(file.extension.toLowerCase())) {
            return MEDIA_TYPES.IMAGE;
        } else if (['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(file.extension.toLowerCase())) {
            return MEDIA_TYPES.AUDIO;
        } else if (['mp4', 'webm', 'ogv', 'mov', 'avi'].includes(file.extension.toLowerCase())) {
            return MEDIA_TYPES.FILM;
        } else {
            return MEDIA_TYPES.TEXT; // Default to text
        }
    }
    
    // Perform the analysis based on selected options
    async performAnalysis(isSingleMode: boolean, useCurrentFile: boolean, exportFormat: string) {
        try {
            if (isSingleMode) {
                // Single file analysis
                let file: TFile;
                let mediaType: string;
                let content: string | TFile;
                
                if (useCurrentFile) {
                    // Get the current file
                    const activeFile = this.app.workspace.getActiveFile();
                    if (!activeFile) {
                        new Notice('No file is currently open');
                        return;
                    }
                    
                    file = activeFile;
                    mediaType = this.getMediaType(file);
                } else {
                    // Use the selected file
                    if (!this.selectedFile) {
                        new Notice('No file selected');
                        return;
                    }
                    
                    file = this.selectedFile.file;
                    mediaType = this.selectedFile.mediaType;
                }
                
                // Get content based on media type
                if (mediaType === MEDIA_TYPES.TEXT) {
                    content = await this.app.vault.read(file);
                } else {
                    content = file;
                }
                
                // Check if any frameworks are selected
                if (this.selectedFrameworks.length === 0) {
                    new Notice('No frameworks selected');
                    return;
                }
                
                // Perform the analysis
                const result = await this.plugin.analysisEngine.analyzeContent(
                    content, 
                    mediaType, 
                    this.selectedFrameworks
                );
                
                // Show the analysis results
                const modal = new AnalysisResultsModal(this.app, result, file.name, this.plugin);
                modal.open();
                
            } else {
                // Batch analysis
                if (this.selectedFiles.length === 0) {
                    new Notice('No files selected for batch analysis');
                    return;
                }
                
                // Check if any frameworks are selected
                if (this.selectedFrameworks.length === 0) {
                    new Notice('No frameworks selected');
                    return;
                }
                
                // Show loading notice
                new Notice(`Analyzing ${this.selectedFiles.length} files...`);
                
                // Analyze each file
                const results = [];
                for (const fileInfo of this.selectedFiles) {
                    let content: string | TFile;
                    if (fileInfo.mediaType === MEDIA_TYPES.TEXT) {
                        content = await this.app.vault.read(fileInfo.file);
                    } else {
                        content = fileInfo.file;
                    }
                    
                    const result = await this.plugin.analysisEngine.analyzeContent(
                        content, 
                        fileInfo.mediaType, 
                        this.selectedFrameworks
                    );
                    
                    results.push({
                        fileName: fileInfo.file.name,
                        result: result
                    });
                }
                
                // Export the results
                let exportedFilePath: string | null = null;
                if (exportFormat === 'markdown') {
                    exportedFilePath = await this.exportBatchResultsAsMarkdown(results);
                } else {
                    exportedFilePath = await this.exportBatchResultsAsHtml(results);
                }
                
                // Open the exported file if auto-open is enabled
                if (this.plugin.settings.autoOpenExportedFiles && exportedFilePath) {
                    const exportedFile = this.app.vault.getAbstractFileByPath(exportedFilePath);
                    if (exportedFile instanceof TFile) {
                        this.app.workspace.getLeaf().openFile(exportedFile);
                    }
                }
            }
        } catch (error) {
            console.error('Analysis error:', error);
            new Notice(`Analysis failed: ${(error as Error).message}`);
        }
    }
    
    // Export batch analysis results as Markdown
    async exportBatchResultsAsMarkdown(results: Array<{fileName: string, result: any}>): Promise<string | null> {
        try {
            let markdown = `# Batch Analysis Results\n\n`;
            markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
            markdown += `## Overview\n\n`;
            markdown += `- **Files Analyzed**: ${results.length}\n`;
            markdown += `- **Frameworks Used**: ${this.selectedFrameworks.map(id => this.plugin.analysisEngine.getFrameworkName(id)).join(', ')}\n\n`;
            
            // Add results for each file
            results.forEach(({ fileName, result }) => {
                markdown += `## ${result.mediaType.charAt(0).toUpperCase() + result.mediaType.slice(1)} Analysis: ${fileName}\n\n`;
                
                // Summary
                markdown += `### Summary\n\n${result.summary}\n\n`;
                
                // Framework analyses
                markdown += `### Theoretical Frameworks\n\n`;
                
                Object.keys(result.frameworkAnalyses).forEach(frameworkId => {
                    const frameworkName = this.plugin.analysisEngine.getFrameworkName(frameworkId);
                    markdown += `#### ${frameworkName}\n\n${result.frameworkAnalyses[frameworkId]}\n\n`;
                });
                
                // Recommendations
                markdown += `### Recommendations\n\n`;
                result.recommendations.forEach((rec: string) => {
                    markdown += `- ${rec}\n`;
                });
                
                markdown += `\n---\n\n`;
            });
            
            // Create the file
            const fileName = `batch_analysis_${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
            await this.app.vault.create(fileName, markdown);
            new Notice(`Batch analysis exported as ${fileName}`);
            
            return fileName;
        } catch (error) {
            console.error('Export error:', error);
            new Notice('Export failed: ' + (error as Error).message);
            return null;
        }
    }
    
    // Export batch analysis results as HTML
    async exportBatchResultsAsHtml(results: Array<{fileName: string, result: any}>): Promise<string | null> {
        try {
            let html = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Batch Analysis Results</title>\n<style>\n`;
            
            // Add CSS
            html += `body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }\n`;
            html += `h1, h2, h3, h4 { margin-top: 1.5em; margin-bottom: 0.5em; }\n`;
            html += `.file-analysis { margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }\n`;
            html += `.framework { margin-bottom: 20px; padding: 15px; border-left: 4px solid #5c7cfa; background-color: #f8f9fa; border-radius: 4px; }\n`;
            html += `.recommendations { margin-top: 20px; }\n`;
            html += `.recommendations ul { padding-left: 20px; }\n`;
            html += `.overview { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 30px; }\n`;
            html += `.footer { margin-top: 40px; font-size: 0.8em; color: #888; border-top: 1px solid #eee; padding-top: 10px; }\n`;
            html += `</style>\n</head>\n<body>\n`;
            
            // Add content
            html += `<h1>Batch Analysis Results</h1>\n`;
            html += `<p><em>Generated on ${new Date().toLocaleString()}</em></p>\n`;
            
            // Overview
            html += `<div class="overview">\n<h2>Overview</h2>\n`;
            html += `<p><strong>Files Analyzed</strong>: ${results.length}</p>\n`;
            html += `<p><strong>Frameworks Used</strong>: ${this.selectedFrameworks.map(id => this.plugin.analysisEngine.getFrameworkName(id)).join(', ')}</p>\n`;
            html += `</div>\n`;
            
            // Add results for each file
            results.forEach(({ fileName, result }) => {
                html += `<div class="file-analysis">\n`;
                html += `<h2>${result.mediaType.charAt(0).toUpperCase() + result.mediaType.slice(1)} Analysis: ${fileName}</h2>\n`;
                
                // Summary
                html += `<h3>Summary</h3>\n<p>${result.summary}</p>\n`;
                
                // Framework analyses
                html += `<h3>Theoretical Frameworks</h3>\n`;
                
                Object.keys(result.frameworkAnalyses).forEach(frameworkId => {
                    const frameworkName = this.plugin.analysisEngine.getFrameworkName(frameworkId);
                    html += `<div class="framework">\n<h4>${frameworkName}</h4>\n<p>${result.frameworkAnalyses[frameworkId]}</p>\n</div>\n`;
                });
                
                // Recommendations
                html += `<div class="recommendations">\n<h3>Recommendations</h3>\n<ul>\n`;
                result.recommendations.forEach((rec: string) => {
                    html += `<li>${rec}</li>\n`;
                });
                html += `</ul>\n</div>\n`;
                
                html += `</div>\n`;
            });
            
            // Add footer
            html += `<div class="footer">Generated by Deleometer on ${new Date().toLocaleString()}</div>\n`;
            
            html += `</body>\n</html>`;
            
            // Create the file
            const fileName = `batch_analysis_${new Date().toISOString().replace(/[:.]/g, '-')}.html`;
            await this.app.vault.create(fileName, html);
            new Notice(`Batch analysis exported as ${fileName}`);
            
            return fileName;
        } catch (error) {
            console.error('Export error:', error);
            new Notice('Export failed: ' + (error as Error).message);
            return null;
        }
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
