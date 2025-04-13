'use strict';

var obsidian = require('obsidian');

// Constants for media types (must match the ones in main.js)
const MEDIA_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    AUDIO: 'audio',
    FILM: 'film'
};

// Modal for displaying analysis results
class AnalysisResultsModal extends obsidian.Modal {
    constructor(app, result, fileName, plugin) {
        super(app);
        this.result = result;
        this.fileName = fileName;
        this.plugin = plugin;
    }
    
    onOpen() {
        const { contentEl } = this;
        
        // Set modal title based on media type
        let title;
        switch (this.result.mediaType) {
            case MEDIA_TYPES.TEXT:
                title = 'Text Analysis';
                break;
            case MEDIA_TYPES.IMAGE:
                title = 'Image Analysis';
                break;
            case MEDIA_TYPES.AUDIO:
                title = 'Audio Analysis';
                break;
            case MEDIA_TYPES.FILM:
                title = 'Film Analysis';
                break;
            default:
                title = 'Analysis Results';
        }
        
        contentEl.createEl('h2', { text: `${title}: ${this.fileName}` });
        
        // Summary section
        const summary = contentEl.createEl('div', { cls: 'deleometer-summary' });
        summary.createEl('h3', { text: 'Summary' });
        summary.createEl('p', { text: this.result.summary });
        
        // Framework analyses
        const frameworks = contentEl.createEl('div', { cls: 'deleometer-frameworks' });
        frameworks.createEl('h3', { text: 'Theoretical Frameworks' });
        
        Object.keys(this.result.frameworkAnalyses).forEach(frameworkId => {
            const framework = frameworks.createEl('div', { cls: 'deleometer-framework' });
            framework.createEl('h4', { text: this.plugin.analysisEngine.getFrameworkName(frameworkId) });
            framework.createEl('p', { text: this.result.frameworkAnalyses[frameworkId] });
        });
        
        // Recommendations
        const recommendations = contentEl.createEl('div', { cls: 'deleometer-recommendations' });
        recommendations.createEl('h3', { text: 'Recommendations' });
        const recList = recommendations.createEl('ul');
        this.result.recommendations.forEach(rec => {
            recList.createEl('li', { text: rec });
        });
        
        // Export options
        const exportSection = contentEl.createEl('div', { cls: 'deleometer-export' });
        exportSection.createEl('h3', { text: 'Export Options' });
        
        const exportButtons = exportSection.createEl('div', { cls: 'deleometer-export-buttons' });
        
        // Export as Markdown
        const exportMarkdownButton = exportButtons.createEl('button', { text: 'Export as Markdown' });
        exportMarkdownButton.addEventListener('click', () => {
            this.exportAsMarkdown();
        });
        
        // Export as HTML
        const exportHtmlButton = exportButtons.createEl('button', { text: 'Export as HTML' });
        exportHtmlButton.addEventListener('click', () => {
            this.exportAsHtml();
        });
        
        // Close button
        const buttonContainer = contentEl.createEl('div', { cls: 'deleometer-buttons' });
        const closeButton = buttonContainer.createEl('button', { text: 'Close' });
        closeButton.addEventListener('click', () => {
            this.close();
        });
    }
    
    // Export analysis as Markdown
    async exportAsMarkdown() {
        try {
            const markdown = this.generateMarkdown();
            const fileName = `${this.fileName.replace(/\.[^/.]+$/, '')}_analysis.md`;
            await this.app.vault.create(fileName, markdown);
            new obsidian.Notice(`Analysis exported as ${fileName}`);
            
            // Auto-open the file if enabled in settings
            if (this.plugin.settings.autoOpenExportedFiles) {
                const exportedFile = this.app.vault.getAbstractFileByPath(fileName);
                if (exportedFile) {
                    this.app.workspace.getLeaf().openFile(exportedFile);
                }
            }
        } catch (error) {
            console.error('Export error:', error);
            new obsidian.Notice('Export failed: ' + error.message);
        }
    }
    
    // Export analysis as HTML
    async exportAsHtml() {
        try {
            const html = this.generateHtml();
            const fileName = `${this.fileName.replace(/\.[^/.]+$/, '')}_analysis.html`;
            await this.app.vault.create(fileName, html);
            new obsidian.Notice(`Analysis exported as ${fileName}`);
            
            // Auto-open the file if enabled in settings
            if (this.plugin.settings.autoOpenExportedFiles) {
                const exportedFile = this.app.vault.getAbstractFileByPath(fileName);
                if (exportedFile) {
                    this.app.workspace.getLeaf().openFile(exportedFile);
                }
            }
        } catch (error) {
            console.error('Export error:', error);
            new obsidian.Notice('Export failed: ' + error.message);
        }
    }
    
    // Generate Markdown representation of the analysis
    generateMarkdown() {
        let markdown = `# ${this.result.mediaType.charAt(0).toUpperCase() + this.result.mediaType.slice(1)} Analysis: ${this.fileName}\n\n`;
        
        // Summary
        markdown += `## Summary\n\n${this.result.summary}\n\n`;
        
        // Framework analyses
        markdown += `## Theoretical Frameworks\n\n`;
        
        Object.keys(this.result.frameworkAnalyses).forEach(frameworkId => {
            const frameworkName = this.plugin.analysisEngine.getFrameworkName(frameworkId);
            markdown += `### ${frameworkName}\n\n${this.result.frameworkAnalyses[frameworkId]}\n\n`;
        });
        
        // Recommendations
        markdown += `## Recommendations\n\n`;
        this.result.recommendations.forEach(rec => {
            markdown += `- ${rec}\n`;
        });
        
        // Add metadata
        markdown += `\n---\nGenerated by Deleometer on ${new Date().toLocaleString()}\n`;
        
        return markdown;
    }
    
    // Generate HTML representation of the analysis
    generateHtml() {
        let html = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>${this.result.mediaType.charAt(0).toUpperCase() + this.result.mediaType.slice(1)} Analysis: ${this.fileName}</title>\n<style>\n`;
        
        // Add CSS
        html += `body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }\n`;
        html += `h1, h2, h3, h4 { margin-top: 1.5em; margin-bottom: 0.5em; }\n`;
        html += `.framework { margin-bottom: 20px; padding: 15px; border-left: 4px solid #5c7cfa; background-color: #f8f9fa; border-radius: 4px; }\n`;
        html += `.recommendations { margin-top: 30px; }\n`;
        html += `.recommendations ul { padding-left: 20px; }\n`;
        html += `.footer { margin-top: 40px; font-size: 0.8em; color: #888; border-top: 1px solid #eee; padding-top: 10px; }\n`;
        html += `</style>\n</head>\n<body>\n`;
        
        // Add content
        html += `<h1>${this.result.mediaType.charAt(0).toUpperCase() + this.result.mediaType.slice(1)} Analysis: ${this.fileName}</h1>\n`;
        
        // Summary
        html += `<h2>Summary</h2>\n<p>${this.result.summary}</p>\n`;
        
        // Framework analyses
        html += `<h2>Theoretical Frameworks</h2>\n`;
        
        Object.keys(this.result.frameworkAnalyses).forEach(frameworkId => {
            const frameworkName = this.plugin.analysisEngine.getFrameworkName(frameworkId);
            html += `<div class="framework">\n<h3>${frameworkName}</h3>\n<p>${this.result.frameworkAnalyses[frameworkId]}</p>\n</div>\n`;
        });
        
        // Recommendations
        html += `<div class="recommendations">\n<h2>Recommendations</h2>\n<ul>\n`;
        this.result.recommendations.forEach(rec => {
            html += `<li>${rec}</li>\n`;
        });
        html += `</ul>\n</div>\n`;
        
        // Add footer
        html += `<div class="footer">Generated by Deleometer on ${new Date().toLocaleString()}</div>\n`;
        
        html += `</body>\n</html>`;
        
        return html;
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

module.exports = { AnalysisResultsModal };
