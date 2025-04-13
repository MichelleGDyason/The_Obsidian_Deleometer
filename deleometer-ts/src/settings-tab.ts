import { App, PluginSettingTab, Setting } from 'obsidian';
import { FRAMEWORKS } from './constants';
import DeleometerPlugin from './main';

export class DeleometerSettingTab extends PluginSettingTab {
    plugin: DeleometerPlugin;
    
    constructor(app: App, plugin: DeleometerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    
    display(): void {
        const {containerEl} = this;
        containerEl.empty();
        
        containerEl.createEl('h2', {text: 'Deleometer Settings'});
        
        // Framework selection section
        containerEl.createEl('h3', {text: 'Theoretical Frameworks'});
        containerEl.createEl('p', {text: 'Enable or disable theoretical frameworks for analysis.'});
        
        // Create a toggle for each framework
        Object.keys(FRAMEWORKS).forEach(key => {
            const frameworkId = FRAMEWORKS[key as keyof typeof FRAMEWORKS];
            const frameworkName = this.plugin.analysisEngine.getFrameworkName(frameworkId);
            
            new Setting(containerEl)
                .setName(frameworkName)
                .setDesc(`Enable ${frameworkName} for analysis`)
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.enabledFrameworks[frameworkId])
                    .onChange(async (value) => {
                        this.plugin.settings.enabledFrameworks[frameworkId] = value;
                        await this.plugin.saveSettings();
                    }));
        });
        
        // Analysis options section
        containerEl.createEl('h3', {text: 'Analysis Options'});
        
        new Setting(containerEl)
            .setName('Analysis Depth')
            .setDesc('How detailed should the analysis be?')
            .addDropdown(dropdown => dropdown
                .addOption('brief', 'Brief')
                .addOption('standard', 'Standard')
                .addOption('detailed', 'Detailed')
                .setValue(this.plugin.settings.analysisDepth)
                .onChange(async (value) => {
                    this.plugin.settings.analysisDepth = value;
                    await this.plugin.saveSettings();
                }));
        
        // Journaling prompts option
        new Setting(containerEl)
            .setName('Journaling Prompts')
            .setDesc('Enable personalized journaling prompts based on analysis')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableJournalingPrompts)
                .onChange(async (value) => {
                    this.plugin.settings.enableJournalingPrompts = value;
                    await this.plugin.saveSettings();
                }));
        
        // Auto-open exported files option
        new Setting(containerEl)
            .setName('Auto-open Exported Files')
            .setDesc('Automatically open files after exporting analysis results')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoOpenExportedFiles)
                .onChange(async (value) => {
                    this.plugin.settings.autoOpenExportedFiles = value;
                    await this.plugin.saveSettings();
                }));
    }
}
