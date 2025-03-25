/**
 ** The Deleometer AI Journal Plugin (Enhanced Version with History, Settings & Export)
 * Features: Deep Emotional Analysis, Psychoanalytic Insights, Personality-Based Reflections, Goal Tracking, Analysis History, Export Option
 */

import { Plugin, Modal, Notice, Setting } from 'obsidian';
import { analyzeEmotions, generatePsychoanalyticResponse } from './nlpEngine';
import { renderEmotionChart } from './visualization';
import { getPersonalityProfile } from './personalityAnalysis';
import { JournalAnalysisModal } from './journalAnalysisModal';

interface DeleometerAIJournalSettings {
    enableEmotions: boolean;
    enablePsychoanalysis: boolean;
    enablePersonality: boolean;
    analysisHistory: Array<any>;
}

debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: number;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => func(...args), wait);
    };
}

export default class DeleometerAIJournalPlugin extends Plugin {
    settings: DeleometerAIJournalSettings;

    async onload() {
        console.log('The Deleometer AI Journal Plugin Loaded');
        await this.loadSettings();
        this.debouncedAnalyzeJournalEntry = this.debounce(this.analyzeJournalEntry.bind(this), 300);

        this.addCommand({
            id: 'analyze-journal',
            name: 'Analyze Journal Entry',
            callback: () => {
                this.debouncedAnalyzeJournalEntry();
            }
        });

        this.addCommand({
            id: 'open-journal-analysis-view',
            name: 'Open Journal Analysis View',
            callback: () => {
                this.openJournalAnalysisView();
            }
    async analyzeJournalEntry() {
        const editor = this.getActiveEditor();
        if (!editor) return;

        const text = this.getEditorText(editor);
        if (!text) return;

        try {
            const result = await this.performAnalysis(text);
            this.saveAnalysisResult(result);
            new JournalAnalysisModal(this.app, result).open();
        } catch (error) {
            console.error('Error analyzing journal entry:', error);
            new Notice('Failed to analyze journal entry. Check the console for details.');
        }
    }

    getActiveEditor() {
        const editor = this.app.workspace.activeLeaf?.view?.editor;
        if (!editor) {
            new Notice('No active editor found. Please open a journal entry.');
        }
        return editor;
    }

    getEditorText(editor: any) {
        const text = editor.getValue().trim();
        if (!text) {
            new Notice('Journal entry is empty. Please write something first.');
        }
            this.settings.analysisHistory = [...this.settings.analysisHistory, result];
    }

    async performAnalysis(text: string) {
        const emotions = this.settings.enableEmotions ? await analyzeEmotions(text) : null;
        const psychoanalyticResponse = this.settings.enablePsychoanalysis ? await generatePsychoanalyticResponse(text) : null;
        const personalityInsights = this.settings.enablePersonality ? await getPersonalityProfile(text) : null;
        return { emotions, psychoanalyticResponse, personalityInsights, date: new Date().toISOString() };
    }

    async saveAnalysisResult(result: any) {
        this.settings.analysisHistory.push(result);
        await this.saveSettings();
    }
            
            const result = { emotions, psychoanalyticResponse, personalityInsights, date: new Date().toISOString() };
            this.settings.analysisHistory.push(result);
            await this.saveSettings();
            
            new JournalAnalysisModal(this.app, result).open();
        } catch (error) {
            console.error('Error analyzing journal entry:', error);
            new Notice('Failed to analyze journal entry. Check the console for details.');
        }
    }
    
    openJournalAnalysisView() {
        const leaf = this.app.workspace.getLeaf(true);
        leaf.setViewState({
            type: 'markdown',
            state: { content: '# AI Deep Self Discovery Journaling\nStart writing your journal entry here...' }
        });
    }
    
    async loadSettings() {
        this.settings = Object.assign({
            enableEmotions: true,
            enablePsychoanalysis: true,
            enablePersonality: true,
    exportAnalysisHistory() {
        if (!this.settings.analysisHistory.length) {
            new Notice('No analysis history to export.');
            return;
        }
        
        const content = this.settings.analysisHistory.map(this.formatAnalysisEntry).join('\n');
        
        const fileName = `AI_Journal_Analysis_${new Date().toISOString().slice(0, 10)}.md`;
        this.app.vault.create(fileName, content).then(() => {
            new Notice(`Analysis history exported to ${fileName}`);
        }).catch(error => {
            console.error('Error exporting analysis history:', error);
            new Notice('Failed to export analysis history.');
        });
    }
    
    formatAnalysisEntry(entry: any): string {
        return `### Analysis from ${new Date(entry.date).toLocaleString()}\n\n` +
            (entry.emotions ? `**Emotional Analysis:**\n${JSON.stringify(entry.emotions, null, 2)}\n\n` : '') +
            (entry.psychoanalyticResponse ? `**Psychoanalytic Insights:**\n${entry.psychoanalyticResponse}\n\n` : '') +
            (entry.personalityInsights ? `**Personality Insights:**\n${JSON.stringify(entry.personalityInsights, null, 2)}\n\n` : '') +
            '---\n';
    }
        const fileName = `AI_Journal_Analysis_${new Date().toISOString().slice(0, 10)}.md`;
            console.error('Error exporting analysis history:', error);
            new Notice(`Failed to export analysis history: ${error.message}`);
        }).catch(error => {
            console.error('Error exporting analysis history:', error);
            new Notice('Failed to export analysis history.');
        });
    }

    onunload() {
        console.log('The Deleometer AI Journal Plugin Unloaded');
    }
}

/**
 * Settings tab for customizing analysis options
 */
class JournalSettingsTab extends PluginSettingTab {
    plugin: DeleometerAIJournalPlugin;

    constructor(app: App, plugin: DeleometerAIJournalPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'AI Journal Settings' });

        new Setting(containerEl)
            .setName('Enable Emotional Analysis')
            .setDesc('Toggle AI-powered emotion detection.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enableEmotions)
                .onChange(async (value: boolean) => {
                    this.plugin.settings.enableEmotions = value;
                    await this.plugin.saveSettings();
                }));
        
        new Setting(containerEl)
            .setName('Enable Psychoanalysis')
            .setDesc('Toggle AI-powered psychoanalytic insights.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enablePsychoanalysis)
                .onChange(async (value) => {
                    this.plugin.settings.enablePsychoanalysis = value;
                    await this.plugin.saveSettings();
                }));
        
        new Setting(containerEl)
            .setName('Enable Personality Analysis')
            .setDesc('Toggle AI-powered personality insights.')
            .addToggle(toggle => toggle.setValue(this.plugin.settings.enablePersonality)
                .onChange(async (value) => {
                    this.plugin.settings.enablePersonality = value;
                    await this.plugin.saveSettings();
                }));
        
        new Setting(containerEl)
            .setName('Export Analysis History')
            .setDesc('Save past analyses as a markdown file.')
            .addButton(button => button.setButtonText('Export')
                .setCta()
                .onClick(() => {
                    this.plugin.exportAnalysisHistory();
                }));
        
        new Setting(containerEl)
            .setName('Clear Analysis History')
            .setDesc('Erase all previous AI analyses.')
            .addButton(button => button.setButtonText('Clear')
                .setWarning()
                .onClick(async () => {
                    const confirmed = confirm('Are you sure you want to clear the analysis history? This action cannot be undone.');
                    if (confirmed) {
                        this.plugin.settings.analysisHistory = [];
                        await this.plugin.saveSettings();
                        new Notice('Analysis history cleared.');
                    }
                }));
    }
}
