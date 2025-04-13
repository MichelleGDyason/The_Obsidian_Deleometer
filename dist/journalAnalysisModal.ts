import { App, Modal, setIcon } from 'obsidian';
import { renderEmotionChart, renderPersonalityChart } from './visualization';
import { AnalysisResult } from './types';

export class JournalAnalysisModal extends Modal {
    constructor(app: App, private result: AnalysisResult) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-analysis-modal');

        // Header
        const headerEl = contentEl.createEl('div', { cls: 'deleometer-modal-header' });
        headerEl.createEl('h2', { text: 'Journal Analysis' });

        const dateText = new Date(this.result.date).toLocaleString();
        headerEl.createEl('div', { cls: 'deleometer-date', text: dateText });

        // Create tabs
        const tabsEl = contentEl.createEl('div', { cls: 'deleometer-tabs' });
        const emotionsTab = tabsEl.createEl('div', { cls: 'deleometer-tab active', text: 'Emotions' });
        const psychoanalysisTab = tabsEl.createEl('div', { cls: 'deleometer-tab', text: 'Psychoanalysis' });
        const personalityTab = tabsEl.createEl('div', { cls: 'deleometer-tab', text: 'Personality' });

        // Create content containers
        const contentContainerEl = contentEl.createEl('div', { cls: 'deleometer-tab-content' });

        // Emotions content
        const emotionsContent = contentContainerEl.createEl('div', { cls: 'deleometer-tab-pane active' });
        this.renderEmotionsTab(emotionsContent);

        // Psychoanalysis content
        const psychoanalysisContent = contentContainerEl.createEl('div', { cls: 'deleometer-tab-pane' });
        this.renderPsychoanalysisTab(psychoanalysisContent);

        // Personality content
        const personalityContent = contentContainerEl.createEl('div', { cls: 'deleometer-tab-pane' });
        this.renderPersonalityTab(personalityContent);

        // Set up tab switching
        emotionsTab.addEventListener('click', () => this.switchTab(emotionsTab, emotionsContent));
        psychoanalysisTab.addEventListener('click', () => this.switchTab(psychoanalysisTab, psychoanalysisContent));
        personalityTab.addEventListener('click', () => this.switchTab(personalityTab, personalityContent));

        // Footer with export button
        const footerEl = contentEl.createEl('div', { cls: 'deleometer-modal-footer' });
        const exportBtn = footerEl.createEl('button', { cls: 'mod-cta', text: 'Export Analysis' });
        exportBtn.addEventListener('click', () => {
            this.exportAnalysis();
            this.close();
        });
    }

    private switchTab(tab: HTMLElement, content: HTMLElement) {
        // Remove active class from all tabs and content
        this.contentEl.querySelectorAll('.deleometer-tab').forEach(el => el.removeClass('active'));
        this.contentEl.querySelectorAll('.deleometer-tab-pane').forEach(el => el.removeClass('active'));

        // Add active class to selected tab and content
        tab.addClass('active');
        content.addClass('active');
    }

    private renderEmotionsTab(containerEl: HTMLElement) {
        if (!this.result.emotions) {
            containerEl.createEl('p', { text: 'No emotional analysis available.' });
            return;
        }

        // Create chart container
        const chartContainer = containerEl.createEl('div', { cls: 'deleometer-chart-container' });

        // Render emotion chart
        renderEmotionChart(chartContainer, this.result.emotions);

        // Display raw emotion data
        const emotionDataEl = containerEl.createEl('div', { cls: 'deleometer-emotion-data' });
        emotionDataEl.createEl('h3', { text: 'Emotion Details' });

        const emotionList = emotionDataEl.createEl('ul', { cls: 'deleometer-emotion-list' });

        Object.entries(this.result.emotions).forEach(([emotion, value]) => {
            if (emotion !== 'sentiment') {
                const listItem = emotionList.createEl('li');
                listItem.createEl('span', { cls: 'deleometer-emotion-name', text: this.capitalizeFirstLetter(emotion) });
                listItem.createEl('span', { cls: 'deleometer-emotion-value', text: `${value}` });
            }
        });

        // Overall sentiment
        if (this.result.emotions.sentiment !== undefined) {
            const sentimentEl = containerEl.createEl('div', { cls: 'deleometer-sentiment' });
            sentimentEl.createEl('h3', { text: 'Overall Sentiment' });

            const sentimentValue = this.result.emotions.sentiment;
            const sentimentText = sentimentValue > 0.2 ? 'Positive' :
                                 sentimentValue < -0.2 ? 'Negative' : 'Neutral';

            const sentimentIndicator = sentimentEl.createEl('div', { cls: 'deleometer-sentiment-indicator' });
            sentimentIndicator.createEl('span', {
                cls: `deleometer-sentiment-value ${sentimentText.toLowerCase()}`,
                text: sentimentText
            });
        }
    }

    private renderPsychoanalysisTab(containerEl: HTMLElement) {
        if (!this.result.psychoanalyticResponse) {
            containerEl.createEl('p', { text: 'No psychoanalytic insights available.' });
            return;
        }

        const insightsEl = containerEl.createEl('div', { cls: 'deleometer-insights' });

        // Add icon
        const iconEl = insightsEl.createEl('div', { cls: 'deleometer-insights-icon' });
        setIcon(iconEl, 'brain');

        // Add content
        const contentEl = insightsEl.createEl('div', { cls: 'deleometer-insights-content' });

        // Split by paragraphs and create elements
        const paragraphs = this.result.psychoanalyticResponse.split('\n\n');
        paragraphs.forEach(paragraph => {
            if (paragraph.trim()) {
                contentEl.createEl('p', { text: paragraph.trim() });
            }
        });
    }

    private renderPersonalityTab(containerEl: HTMLElement) {
        if (!this.result.personalityInsights) {
            containerEl.createEl('p', { text: 'No personality insights available.' });
            return;
        }

        const personalityEl = containerEl.createEl('div', { cls: 'deleometer-personality' });
        personalityEl.createEl('h3', { text: 'Personality Traits' });

        // Create personality chart container
        const chartContainer = personalityEl.createEl('div', { cls: 'deleometer-personality-chart-container' });

        // Render personality chart
        renderPersonalityChart(chartContainer, this.result.personalityInsights);

        // Add description
        const descEl = personalityEl.createEl('div', { cls: 'deleometer-personality-description' });
        descEl.createEl('h4', { text: 'Big Five Personality Traits' });
        descEl.createEl('p', { text: 'The Big Five personality traits represent the most widely accepted model of personality in psychology. These traits are:' });

        const traitsList = descEl.createEl('ul');
        traitsList.createEl('li', { text: 'Openness: Reflects curiosity, creativity, and preference for variety.' });
        traitsList.createEl('li', { text: 'Conscientiousness: Reflects organization, thoroughness, and reliability.' });
        traitsList.createEl('li', { text: 'Extraversion: Reflects sociability, assertiveness, and emotional expressiveness.' });
        traitsList.createEl('li', { text: 'Agreeableness: Reflects kindness, cooperation, and trustworthiness.' });
        traitsList.createEl('li', { text: 'Neuroticism: Reflects emotional instability, anxiety, and moodiness.' });
    }

    private exportAnalysis() {
        // Create markdown content
        const content = this.formatAnalysisForExport();

        // Create file name
        const fileName = `Journal_Analysis_${new Date().toISOString().slice(0, 10)}.md`;

        // Save to vault
        this.app.vault.create(fileName, content)
            .then(() => {
                // Success notification is handled by the main plugin
            })
            .catch(error => {
                console.error('Error exporting analysis:', error);
            });
    }

    private formatAnalysisForExport(): string {
        const date = new Date(this.result.date).toLocaleString();

        let content = `# Journal Analysis - ${date}\n\n`;

        if (this.result.emotions) {
            content += `## Emotional Analysis\n\n`;
            Object.entries(this.result.emotions).forEach(([emotion, value]) => {
                if (emotion !== 'sentiment') {
                    content += `- **${this.capitalizeFirstLetter(emotion)}**: ${value}\n`;
                }
            });

            if (this.result.emotions.sentiment !== undefined) {
                const sentimentValue = this.result.emotions.sentiment;
                const sentimentText = sentimentValue > 0.2 ? 'Positive' :
                                     sentimentValue < -0.2 ? 'Negative' : 'Neutral';
                content += `\n**Overall Sentiment**: ${sentimentText} (${sentimentValue})\n`;
            }

            content += '\n';
        }

        if (this.result.psychoanalyticResponse) {
            content += `## Psychoanalytic Insights\n\n${this.result.psychoanalyticResponse}\n\n`;
        }

        if (this.result.personalityInsights) {
            content += `## Personality Insights\n\n`;
            Object.entries(this.result.personalityInsights).forEach(([trait, value]) => {
                content += `- **${this.capitalizeFirstLetter(trait)}**: ${value}\n`;
            });
            content += '\n';
        }

        return content;
    }

    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
