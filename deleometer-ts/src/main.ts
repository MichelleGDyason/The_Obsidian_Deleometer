import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, DeleometerSettings } from './constants';
import { AnalysisEngine } from './analysis-engine';
import { UnifiedAnalysisModal } from './unified-analysis-modal';
import { DeleometerSettingTab } from './settings-tab';

export default class DeleometerPlugin extends Plugin {
    settings: DeleometerSettings;
    analysisEngine: AnalysisEngine;
    
    async onload() {
        console.log('Loading Deleometer plugin');
        
        // Load settings
        await this.loadSettings();
        
        // Initialize the analysis engine
        this.analysisEngine = new AnalysisEngine(this.app, this.settings);
        
        // Add the unified Theoretical Analysis command
        this.addCommand({
            id: 'theoretical-analysis',
            name: 'Theoretical Analysis',
            callback: () => {
                this.showUnifiedAnalysisModal();
            }
        });
        
        // Add settings tab
        this.addSettingTab(new DeleometerSettingTab(this.app, this));
        
        // Add ribbon icon (leaf)
        this.addRibbonIcon('leaf', 'Deleometer', () => {
            this.showUnifiedAnalysisModal();
        });
    }
    
    onunload() {
        console.log('Unloading Deleometer plugin');
    }
    
    // Show the unified analysis modal
    showUnifiedAnalysisModal() {
        const modal = new UnifiedAnalysisModal(this.app, this);
        modal.open();
    }
    
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    
    async saveSettings() {
        await this.saveData(this.settings);
    }
}
