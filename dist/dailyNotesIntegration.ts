import { App, TFile, Notice, moment } from 'obsidian';
import { AnalysisResult } from './types';

/**
 * Integration with Obsidian's daily notes plugin
 * Provides functionality for analyzing daily notes and adding metadata
 */
export class DailyNotesIntegration {
    private app: App;
    
    constructor(app: App) {
        this.app = app;
    }
    
    /**
     * Gets the daily note for the specified date
     * @param date The date to get the daily note for (defaults to today)
     * @returns The daily note file or null if not found
     */
    public getDailyNote(date: Date = new Date()): TFile | null {
        // Try to detect daily notes plugin settings
        const dailyNotesSettings = this.getDailyNotesSettings();
        
        if (!dailyNotesSettings) {
            new Notice('Daily notes plugin not found or not configured.');
            return null;
        }
        
        const { format, folder } = dailyNotesSettings;
        const formattedDate = moment(date).format(format);
        const folderPath = folder ? `${folder}/` : '';
        const filePath = `${folderPath}${formattedDate}.md`;
        
        const file = this.app.vault.getAbstractFileByPath(filePath);
        
        if (!file || !(file instanceof TFile)) {
            return null;
        }
        
        return file;
    }
    
    /**
     * Gets the daily notes plugin settings
     * @returns The daily notes settings or null if not found
     */
    private getDailyNotesSettings(): { format: string, folder: string } | null {
        // Try to get settings from the daily notes plugin
        // @ts-ignore - Accessing internal API
        const dailyNotesPlugin = this.app.plugins.getPlugin('daily-notes');
        
        if (dailyNotesPlugin) {
            // @ts-ignore - Accessing internal API
            const settings = dailyNotesPlugin.options || {};
            return {
                format: settings.format || 'YYYY-MM-DD',
                folder: settings.folder || ''
            };
        }
        
        // Try to get settings from the periodic notes plugin
        // @ts-ignore - Accessing internal API
        const periodicNotesPlugin = this.app.plugins.getPlugin('periodic-notes');
        
        if (periodicNotesPlugin) {
            // @ts-ignore - Accessing internal API
            const settings = periodicNotesPlugin.settings?.daily || {};
            return {
                format: settings.format || 'YYYY-MM-DD',
                folder: settings.folder || ''
            };
        }
        
        // If no plugin is found, use default settings
        return {
            format: 'YYYY-MM-DD',
            folder: 'Daily'
        };
    }
    
    /**
     * Adds analysis results to the daily note's YAML frontmatter
     * @param file The daily note file
     * @param analysis The analysis results
     */
    public async addAnalysisToFrontmatter(file: TFile, analysis: AnalysisResult): Promise<void> {
        try {
            // Read the file content
            const content = await this.app.vault.read(file);
            
            // Check if the file has frontmatter
            const hasFrontmatter = content.startsWith('---');
            
            // Create the analysis YAML
            const analysisYaml = this.createAnalysisYaml(analysis);
            
            let newContent: string;
            
            if (hasFrontmatter) {
                // Find the end of the frontmatter
                const frontmatterEndIndex = content.indexOf('---', 3);
                
                if (frontmatterEndIndex !== -1) {
                    // Insert the analysis before the end of the frontmatter
                    newContent = 
                        content.substring(0, frontmatterEndIndex) + 
                        analysisYaml + 
                        content.substring(frontmatterEndIndex);
                } else {
                    // Invalid frontmatter, add a new one
                    newContent = `---\n${analysisYaml}---\n${content.substring(3)}`;
                }
            } else {
                // Add new frontmatter with the analysis
                newContent = `---\n${analysisYaml}---\n\n${content}`;
            }
            
            // Write the updated content back to the file
            await this.app.vault.modify(file, newContent);
            
            new Notice('Analysis added to daily note frontmatter.');
        } catch (error) {
            console.error('Error adding analysis to frontmatter:', error);
            new Notice('Failed to add analysis to frontmatter.');
        }
    }
    
    /**
     * Creates YAML frontmatter for the analysis results
     * @param analysis The analysis results
     * @returns The YAML frontmatter string
     */
    private createAnalysisYaml(analysis: AnalysisResult): string {
        const { emotions, personalityInsights } = analysis;
        
        // Format emotions for YAML
        let yaml = 'deleometer:\n';
        
        // Add date
        yaml += `  date: ${new Date(analysis.date).toISOString()}\n`;
        
        // Add emotions
        if (emotions) {
            yaml += '  emotions:\n';
            
            // Add each emotion
            Object.entries(emotions).forEach(([emotion, value]) => {
                if (emotion !== 'sentiment') {
                    yaml += `    ${emotion}: ${value}\n`;
                }
            });
            
            // Add sentiment separately
            if (emotions.sentiment !== undefined) {
                yaml += `  sentiment: ${emotions.sentiment}\n`;
            }
        }
        
        // Add personality insights
        if (personalityInsights) {
            yaml += '  personality:\n';
            
            // Add each trait
            Object.entries(personalityInsights).forEach(([trait, value]) => {
                yaml += `    ${trait}: ${value}\n`;
            });
        }
        
        return yaml;
    }
    
    /**
     * Gets all daily notes within a date range
     * @param startDate The start date
     * @param endDate The end date (defaults to today)
     * @returns Array of daily note files
     */
    public async getDailyNotesInRange(startDate: Date, endDate: Date = new Date()): Promise<TFile[]> {
        const dailyNotes: TFile[] = [];
        const dailyNotesSettings = this.getDailyNotesSettings();
        
        if (!dailyNotesSettings) {
            return dailyNotes;
        }
        
        const { format, folder } = dailyNotesSettings;
        const folderPath = folder ? `${folder}/` : '';
        
        // Get all files in the daily notes folder
        const files = this.app.vault.getMarkdownFiles().filter(file => {
            return file.path.startsWith(folderPath);
        });
        
        // Filter files by date
        for (const file of files) {
            try {
                // Extract date from filename
                const filename = file.basename;
                const date = moment(filename, format);
                
                // Check if date is valid and within range
                if (date.isValid() && 
                    date.isSameOrAfter(moment(startDate), 'day') && 
                    date.isSameOrBefore(moment(endDate), 'day')) {
                    dailyNotes.push(file);
                }
            } catch (error) {
                // Skip files that don't match the format
                continue;
            }
        }
        
        // Sort by date (newest first)
        dailyNotes.sort((a, b) => {
            const dateA = moment(a.basename, format);
            const dateB = moment(b.basename, format);
            return dateB.valueOf() - dateA.valueOf();
        });
        
        return dailyNotes;
    }
    
    /**
     * Creates a template for a daily note with analysis sections
     * @returns The template content
     */
    public createDailyNoteTemplate(): string {
        return `---
deleometer:
  template: true
---

# {{date:YYYY-MM-DD}}

## Morning Reflection
<!-- Write about your intentions for the day, your mood, and any dreams -->

## Daily Log
<!-- Record events, thoughts, and observations throughout the day -->

## Evening Reflection
<!-- Reflect on your day, emotions, and insights -->

## Emotional Analysis
<!-- This section will be filled by the Deleometer plugin -->

`;
    }
    
    /**
     * Analyzes all daily notes in a date range
     * @param startDate The start date
     * @param endDate The end date (defaults to today)
     * @param analyzeCallback The callback function to analyze a note
     */
    public async analyzeAllDailyNotes(
        startDate: Date, 
        endDate: Date = new Date(),
        analyzeCallback: (content: string) => Promise<AnalysisResult>
    ): Promise<void> {
        try {
            // Get all daily notes in the range
            const dailyNotes = await this.getDailyNotesInRange(startDate, endDate);
            
            if (dailyNotes.length === 0) {
                new Notice('No daily notes found in the specified range.');
                return;
            }
            
            new Notice(`Analyzing ${dailyNotes.length} daily notes...`);
            
            // Analyze each note
            for (let i = 0; i < dailyNotes.length; i++) {
                const file = dailyNotes[i];
                const content = await this.app.vault.read(file);
                
                // Update progress
                new Notice(`Analyzing note ${i + 1}/${dailyNotes.length}: ${file.basename}`);
                
                // Analyze the content
                const analysis = await analyzeCallback(content);
                
                // Add the analysis to the frontmatter
                await this.addAnalysisToFrontmatter(file, analysis);
            }
            
            new Notice(`Analysis complete for ${dailyNotes.length} daily notes.`);
        } catch (error) {
            console.error('Error analyzing daily notes:', error);
            new Notice('Failed to analyze daily notes.');
        }
    }
}
