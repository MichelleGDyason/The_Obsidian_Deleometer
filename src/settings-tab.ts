import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import { FRAMEWORKS, AnalysisTier, OpenAIModel } from './constants';
import DeleometerPlugin from './main';

export class DeleometerSettingTab extends PluginSettingTab {
    plugin: DeleometerPlugin;

    constructor(app: App, plugin: DeleometerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        // @ts-ignore: containerEl is inherited from PluginSettingTab
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
                    this.plugin.settings.analysisDepth = value as 'brief' | 'standard' | 'detailed';
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

        // OpenAI Integration section
        containerEl.createEl('h3', {text: 'OpenAI Integration'});
        containerEl.createEl('p', {text: 'Configure OpenAI integration for enhanced analysis.'});

        // Analysis tier selection
        new Setting(containerEl)
            .setName('Analysis Tier')
            .setDesc('Select your analysis tier')
            .addDropdown(dropdown => dropdown
                .addOption(AnalysisTier.FREE, 'Free (Predefined Analyses)')
                .addOption(AnalysisTier.PREMIUM, 'Premium (OpenAI-Powered)')
                .setValue(this.plugin.settings.analysisTier)
                .onChange(async (value) => {
                    this.plugin.settings.analysisTier = value as AnalysisTier;

                    // If switching to premium, make sure OpenAI is enabled
                    if (value === AnalysisTier.PREMIUM) {
                        this.plugin.settings.enableOpenAI = true;

                        // Check if API key is configured
                        if (!this.plugin.settings.openaiApiKey) {
                            new Notice('Please enter your OpenAI API key to use the Premium tier');
                        }
                    }

                    await this.plugin.saveSettings();
                }));

        // Enable OpenAI toggle
        new Setting(containerEl)
            .setName('Enable OpenAI')
            .setDesc('Use OpenAI for enhanced analysis (requires API key)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableOpenAI)
                .onChange(async (value) => {
                    this.plugin.settings.enableOpenAI = value;

                    // If disabling OpenAI, switch to free tier
                    if (!value && this.plugin.settings.analysisTier === AnalysisTier.PREMIUM) {
                        this.plugin.settings.analysisTier = AnalysisTier.FREE;
                        new Notice('Switched to Free tier as OpenAI integration was disabled');
                    }

                    await this.plugin.saveSettings();
                }));

        // OpenAI API Key
        new Setting(containerEl)
            .setName('OpenAI API Key')
            .setDesc('Your OpenAI API key (stored locally)')
            .addText(text => text
                .setPlaceholder('sk-...')
                .setValue(this.plugin.settings.openaiApiKey)
                .onChanged(async (value: string) => {
                    this.plugin.settings.openaiApiKey = value;
                    await this.plugin.saveSettings();

                    // Update the OpenAI service configuration
                    if (this.plugin.openaiService) {
                        this.plugin.openaiService.updateConfig(this.plugin.settings);
                    }
                }));

        // OpenAI Model selection
        new Setting(containerEl)
            .setName('OpenAI Model')
            .setDesc('Select which OpenAI model to use')
            .addDropdown(dropdown => dropdown
                .addOption(OpenAIModel.GPT_3_5, 'GPT-3.5 Turbo (Faster, cheaper)')
                .addOption(OpenAIModel.GPT_4, 'GPT-4 (More advanced, more expensive)')
                .setValue(this.plugin.settings.openaiModel)
                .onChange(async (value) => {
                    this.plugin.settings.openaiModel = value as OpenAIModel;
                    await this.plugin.saveSettings();

                    // Update the OpenAI service configuration
                    if (this.plugin.openaiService) {
                        this.plugin.openaiService.updateConfig(this.plugin.settings);
                    }
                }));

        // Usage limit
        new Setting(containerEl)
            .setName('Monthly Usage Limit')
            .setDesc('Maximum number of OpenAI analyses per month')
            .addSlider(slider => slider
                .setLimits(10, 500, 10)
                .setValue(this.plugin.settings.openaiUsageLimit)
                .onChange(async (value) => {
                    this.plugin.settings.openaiUsageLimit = value;
                    await this.plugin.saveSettings();
                }));

        // Usage statistics
        const usageCount = this.plugin.settings.openaiUsageCount;
        const usageLimit = this.plugin.settings.openaiUsageLimit;
        const usagePercent = Math.round((usageCount / usageLimit) * 100);

        new Setting(containerEl)
            .setName('Usage Statistics')
            .setDesc(`You've used ${usageCount}/${usageLimit} analyses this month (${usagePercent}%)`)
            .addButton(button => button
                .setButtonText('Reset Usage Counter')
                .onClick(async () => {
                    this.plugin.settings.openaiUsageCount = 0;
                    this.plugin.settings.openaiLastReset = Date.now();
                    await this.plugin.saveSettings();
                    new Notice('Usage counter has been reset');
                    this.display(); // Refresh the settings tab
                }));
    }
}
