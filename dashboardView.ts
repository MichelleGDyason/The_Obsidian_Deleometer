import { ItemView, WorkspaceLeaf, Notice } from 'obsidian';
import { AnalysisResult } from './types';
import { DeleometerPlugin } from './main';

export const DASHBOARD_VIEW_TYPE = 'deleometer-dashboard-view';

export class DashboardView extends ItemView {
    private plugin: DeleometerPlugin;
    private contentEl: HTMLElement;
    private chartContainer: HTMLElement;
    private timeRangeSelector: HTMLSelectElement;
    private emotionSelector: HTMLSelectElement;
    private chartCanvas: HTMLCanvasElement;
    private chart: any; // Will hold the Chart.js instance

    constructor(leaf: WorkspaceLeaf, plugin: DeleometerPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return DASHBOARD_VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'Deleometer Dashboard';
    }

    getIcon(): string {
        return 'bar-chart';
    }

    async onOpen(): Promise<void> {
        this.contentEl = this.containerEl.children[1];
        this.contentEl.empty();
        this.contentEl.addClass('deleometer-dashboard');

        this.renderDashboard();
    }

    private renderDashboard(): void {
        // Create dashboard header
        const headerEl = this.contentEl.createEl('div', { cls: 'deleometer-dashboard-header' });
        headerEl.createEl('h2', { text: 'Emotional Insights Dashboard' });
        
        // Create controls section
        const controlsEl = this.contentEl.createEl('div', { cls: 'deleometer-dashboard-controls' });
        
        // Time range selector
        const timeRangeContainer = controlsEl.createEl('div', { cls: 'deleometer-control-group' });
        timeRangeContainer.createEl('label', { text: 'Time Range:', attr: { for: 'time-range' } });
        this.timeRangeSelector = timeRangeContainer.createEl('select', { cls: 'dropdown', attr: { id: 'time-range' } });
        
        // Add time range options
        const timeRanges = [
            { value: '7d', text: 'Last 7 Days' },
            { value: '30d', text: 'Last 30 Days' },
            { value: '90d', text: 'Last 90 Days' },
            { value: 'all', text: 'All Time' }
        ];
        
        timeRanges.forEach(range => {
            const option = this.timeRangeSelector.createEl('option', { 
                text: range.text,
                attr: { value: range.value }
            });
            
            if (range.value === '30d') {
                option.selected = true;
            }
        });
        
        // Emotion selector
        const emotionContainer = controlsEl.createEl('div', { cls: 'deleometer-control-group' });
        emotionContainer.createEl('label', { text: 'Emotion:', attr: { for: 'emotion-select' } });
        this.emotionSelector = emotionContainer.createEl('select', { cls: 'dropdown', attr: { id: 'emotion-select' } });
        
        // Add emotion options (will be populated dynamically)
        const defaultEmotions = [
            { value: 'all', text: 'All Emotions' },
            { value: 'joy', text: 'Joy' },
            { value: 'sadness', text: 'Sadness' },
            { value: 'anger', text: 'Anger' },
            { value: 'fear', text: 'Fear' },
            { value: 'surprise', text: 'Surprise' },
            { value: 'sentiment', text: 'Overall Sentiment' }
        ];
        
        defaultEmotions.forEach(emotion => {
            this.emotionSelector.createEl('option', { 
                text: emotion.text,
                attr: { value: emotion.value }
            });
        });
        
        // Add event listeners to controls
        this.timeRangeSelector.addEventListener('change', () => this.updateChart());
        this.emotionSelector.addEventListener('change', () => this.updateChart());
        
        // Create chart container
        this.chartContainer = this.contentEl.createEl('div', { cls: 'deleometer-chart-container' });
        
        // Create canvas for chart
        this.chartCanvas = this.chartContainer.createEl('canvas', { 
            cls: 'deleometer-chart-canvas',
            attr: { width: '800', height: '400' }
        });
        
        // Create insights section
        const insightsEl = this.contentEl.createEl('div', { cls: 'deleometer-dashboard-insights' });
        insightsEl.createEl('h3', { text: 'Emotional Insights' });
        insightsEl.createEl('div', { cls: 'deleometer-insights-content' });
        
        // Create export button
        const exportBtn = this.contentEl.createEl('button', { 
            cls: 'mod-cta deleometer-export-btn',
            text: 'Export Dashboard Data'
        });
        
        exportBtn.addEventListener('click', () => this.exportDashboardData());
        
        // Load and render the chart
        this.loadChartJsLibrary().then(() => {
            this.updateChart();
        }).catch(error => {
            console.error('Failed to load Chart.js:', error);
            new Notice('Failed to load Chart.js library. Dashboard visualization is unavailable.');
            this.chartContainer.createEl('p', { 
                cls: 'deleometer-error',
                text: 'Failed to load visualization library. Please check your internet connection.'
            });
        });
    }
    
    private async loadChartJsLibrary(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Check if Chart.js is already loaded
                if (window.Chart) {
                    resolve();
                    return;
                }
                
                // Create script element to load Chart.js
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
                script.onload = () => resolve();
                script.onerror = () => reject(new Error('Failed to load Chart.js'));
                document.head.appendChild(script);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    private updateChart(): void {
        // Get selected time range and emotion
        const timeRange = this.timeRangeSelector.value;
        const selectedEmotion = this.emotionSelector.value;
        
        // Get filtered analysis history
        const filteredHistory = this.getFilteredHistory(timeRange);
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create new chart
        if (selectedEmotion === 'all') {
            this.createMultiLineChart(filteredHistory);
        } else {
            this.createSingleLineChart(filteredHistory, selectedEmotion);
        }
        
        // Update insights
        this.updateInsights(filteredHistory, selectedEmotion);
    }
    
    private getFilteredHistory(timeRange: string): AnalysisResult[] {
        const history = this.plugin.settings.analysisHistory;
        
        if (timeRange === 'all' || history.length === 0) {
            return history;
        }
        
        const now = new Date();
        let daysToSubtract = 30; // Default to 30 days
        
        if (timeRange === '7d') daysToSubtract = 7;
        else if (timeRange === '90d') daysToSubtract = 90;
        
        const cutoffDate = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
        
        return history.filter(entry => new Date(entry.date) >= cutoffDate);
    }
    
    private createMultiLineChart(history: AnalysisResult[]): void {
        if (history.length === 0) {
            this.showNoDataMessage();
            return;
        }
        
        // Get all unique emotions across all entries
        const allEmotions = new Set<string>();
        history.forEach(entry => {
            if (entry.emotions) {
                Object.keys(entry.emotions).forEach(emotion => {
                    if (emotion !== 'sentiment') {
                        allEmotions.add(emotion);
                    }
                });
            }
        });
        
        // Prepare data for chart
        const labels = history.map(entry => new Date(entry.date).toLocaleDateString());
        const datasets = Array.from(allEmotions).map(emotion => {
            // Generate a consistent color for each emotion
            const color = this.getColorForEmotion(emotion);
            
            return {
                label: this.capitalizeFirstLetter(emotion),
                data: history.map(entry => entry.emotions?.[emotion] || 0),
                borderColor: color,
                backgroundColor: this.hexToRgba(color, 0.1),
                tension: 0.4
            };
        });
        
        // Create chart
        this.chart = new window.Chart(this.chartCanvas, {
            type: 'line',
            data: {
                labels,
                datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Intensity'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Emotional Patterns Over Time'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                }
            }
        });
    }
    
    private createSingleLineChart(history: AnalysisResult[], emotion: string): void {
        if (history.length === 0) {
            this.showNoDataMessage();
            return;
        }
        
        // Prepare data for chart
        const labels = history.map(entry => new Date(entry.date).toLocaleDateString());
        const data = history.map(entry => {
            if (emotion === 'sentiment') {
                return entry.emotions?.sentiment || 0;
            }
            return entry.emotions?.[emotion] || 0;
        });
        
        const color = this.getColorForEmotion(emotion);
        
        // Create chart
        this.chart = new window.Chart(this.chartCanvas, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: emotion === 'sentiment' ? 'Overall Sentiment' : this.capitalizeFirstLetter(emotion),
                    data,
                    borderColor: color,
                    backgroundColor: this.hexToRgba(color, 0.1),
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: emotion !== 'sentiment',
                        title: {
                            display: true,
                            text: emotion === 'sentiment' ? 'Sentiment (-1 to 1)' : 'Intensity'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `${emotion === 'sentiment' ? 'Overall Sentiment' : this.capitalizeFirstLetter(emotion)} Over Time`
                    }
                }
            }
        });
    }
    
    private updateInsights(history: AnalysisResult[], selectedEmotion: string): void {
        const insightsContent = this.contentEl.querySelector('.deleometer-insights-content');
        if (!insightsContent) return;
        
        insightsContent.empty();
        
        if (history.length === 0) {
            insightsContent.createEl('p', { text: 'No data available for insights.' });
            return;
        }
        
        // Generate insights based on the data
        if (selectedEmotion === 'all') {
            this.generateOverallInsights(history, insightsContent);
        } else {
            this.generateEmotionInsights(history, selectedEmotion, insightsContent);
        }
    }
    
    private generateOverallInsights(history: AnalysisResult[], container: HTMLElement): void {
        // Get all emotions
        const allEmotions = new Set<string>();
        history.forEach(entry => {
            if (entry.emotions) {
                Object.keys(entry.emotions).forEach(emotion => {
                    if (emotion !== 'sentiment') {
                        allEmotions.add(emotion);
                    }
                });
            }
        });
        
        // Calculate average for each emotion
        const emotionAverages = Array.from(allEmotions).map(emotion => {
            const values = history
                .filter(entry => entry.emotions && entry.emotions[emotion] !== undefined)
                .map(entry => entry.emotions[emotion]);
            
            const average = values.length > 0 
                ? values.reduce((sum, val) => sum + val, 0) / values.length 
                : 0;
            
            return { emotion, average };
        });
        
        // Sort by average (descending)
        emotionAverages.sort((a, b) => b.average - a.average);
        
        // Get dominant emotion
        const dominantEmotion = emotionAverages.length > 0 ? emotionAverages[0].emotion : null;
        
        // Calculate overall sentiment trend
        const sentimentValues = history
            .filter(entry => entry.emotions && entry.emotions.sentiment !== undefined)
            .map(entry => entry.emotions.sentiment);
        
        let sentimentTrend = 'neutral';
        if (sentimentValues.length > 0) {
            const avgSentiment = sentimentValues.reduce((sum, val) => sum + val, 0) / sentimentValues.length;
            sentimentTrend = avgSentiment > 0.2 ? 'positive' : (avgSentiment < -0.2 ? 'negative' : 'neutral');
        }
        
        // Create insights
        container.createEl('p', { 
            text: `Based on your journal entries, your dominant emotion is ${dominantEmotion ? this.capitalizeFirstLetter(dominantEmotion) : 'unknown'}.`
        });
        
        container.createEl('p', { 
            text: `Your overall emotional tone tends to be ${sentimentTrend}.`
        });
        
        // Create emotion breakdown
        const breakdownEl = container.createEl('div', { cls: 'deleometer-emotion-breakdown' });
        breakdownEl.createEl('h4', { text: 'Emotion Breakdown' });
        
        const breakdownList = breakdownEl.createEl('ul');
        emotionAverages.slice(0, 5).forEach(({ emotion, average }) => {
            breakdownList.createEl('li', { 
                text: `${this.capitalizeFirstLetter(emotion)}: ${average.toFixed(2)}`
            });
        });
    }
    
    private generateEmotionInsights(history: AnalysisResult[], emotion: string, container: HTMLElement): void {
        // Get values for the selected emotion
        const values = history
            .filter(entry => entry.emotions && entry.emotions[emotion] !== undefined)
            .map(entry => ({ 
                value: entry.emotions[emotion],
                date: new Date(entry.date)
            }));
        
        if (values.length === 0) {
            container.createEl('p', { text: `No data available for ${emotion}.` });
            return;
        }
        
        // Sort by date (ascending)
        values.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        // Calculate average
        const average = values.reduce((sum, { value }) => sum + value, 0) / values.length;
        
        // Calculate trend (increasing, decreasing, or stable)
        let trend = 'stable';
        if (values.length >= 3) {
            // Simple linear regression to determine trend
            const n = values.length;
            const xMean = (n - 1) / 2; // 0, 1, 2, ..., n-1
            const yMean = average;
            
            let numerator = 0;
            let denominator = 0;
            
            for (let i = 0; i < n; i++) {
                const x = i - xMean;
                const y = values[i].value - yMean;
                numerator += x * y;
                denominator += x * x;
            }
            
            const slope = denominator !== 0 ? numerator / denominator : 0;
            
            if (slope > 0.1) trend = 'increasing';
            else if (slope < -0.1) trend = 'decreasing';
        }
        
        // Find highest and lowest points
        const highest = values.reduce((max, current) => current.value > max.value ? current : max, values[0]);
        const lowest = values.reduce((min, current) => current.value < min.value ? current : min, values[0]);
        
        // Create insights
        if (emotion === 'sentiment') {
            container.createEl('p', { 
                text: `Your overall sentiment has been ${average > 0.2 ? 'positive' : (average < -0.2 ? 'negative' : 'neutral')} on average.`
            });
            
            container.createEl('p', { 
                text: `Your sentiment is ${trend} over time.`
            });
            
            container.createEl('p', { 
                text: `Your most positive entry was on ${highest.date.toLocaleDateString()}.`
            });
            
            container.createEl('p', { 
                text: `Your most negative entry was on ${lowest.date.toLocaleDateString()}.`
            });
        } else {
            container.createEl('p', { 
                text: `Your ${emotion} levels have been ${average > 5 ? 'high' : (average < 3 ? 'low' : 'moderate')} on average.`
            });
            
            container.createEl('p', { 
                text: `Your ${emotion} is ${trend} over time.`
            });
            
            container.createEl('p', { 
                text: `Your highest ${emotion} was on ${highest.date.toLocaleDateString()}.`
            });
            
            container.createEl('p', { 
                text: `Your lowest ${emotion} was on ${lowest.date.toLocaleDateString()}.`
            });
        }
    }
    
    private showNoDataMessage(): void {
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        
        // Show no data message
        this.chartContainer.empty();
        this.chartContainer.createEl('p', { 
            cls: 'deleometer-no-data',
            text: 'No data available for the selected time range.'
        });
    }
    
    private exportDashboardData(): void {
        const history = this.plugin.settings.analysisHistory;
        
        if (history.length === 0) {
            new Notice('No data available to export.');
            return;
        }
        
        // Create CSV content
        let csvContent = 'Date,';
        
        // Get all unique emotions
        const allEmotions = new Set<string>();
        history.forEach(entry => {
            if (entry.emotions) {
                Object.keys(entry.emotions).forEach(emotion => {
                    allEmotions.add(emotion);
                });
            }
        });
        
        // Add headers
        csvContent += Array.from(allEmotions).join(',') + '\n';
        
        // Add data rows
        history.forEach(entry => {
            const date = new Date(entry.date).toISOString().split('T')[0];
            csvContent += date + ',';
            
            // Add emotion values
            csvContent += Array.from(allEmotions).map(emotion => {
                return entry.emotions?.[emotion] !== undefined ? entry.emotions[emotion] : '';
            }).join(',') + '\n';
        });
        
        // Create file name
        const fileName = `Deleometer_Dashboard_Export_${new Date().toISOString().split('T')[0]}.csv`;
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        new Notice(`Dashboard data exported to ${fileName}`);
    }
    
    private getColorForEmotion(emotion: string): string {
        // Map of emotions to colors
        const colorMap: Record<string, string> = {
            joy: '#FFD700', // Gold
            happiness: '#FFA500', // Orange
            sadness: '#4682B4', // Steel Blue
            anger: '#DC143C', // Crimson
            fear: '#800080', // Purple
            surprise: '#FF8C00', // Dark Orange
            disgust: '#006400', // Dark Green
            anticipation: '#FF69B4', // Hot Pink
            trust: '#20B2AA', // Light Sea Green
            sentiment: '#4169E1', // Royal Blue
        };
        
        // Return mapped color or generate one based on the emotion name
        return colorMap[emotion] || this.stringToColor(emotion);
    }
    
    private stringToColor(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        
        return color;
    }
    
    private hexToRgba(hex: string, alpha: number): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// Add Chart.js type definition for TypeScript
declare global {
    interface Window {
        Chart: any;
    }
}
