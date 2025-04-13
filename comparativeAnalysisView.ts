import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import { ArtisticAnalysisResult } from './artisticAnalysis';

export const COMPARATIVE_VIEW_TYPE = 'comparative-analysis';

/**
 * View for displaying comparative analysis results
 */
export class ComparativeAnalysisView extends ItemView {
    private results: ArtisticAnalysisResult[] = [];

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return COMPARATIVE_VIEW_TYPE;
    }

    getDisplayText(): string {
        return 'Comparative Analysis';
    }

    getIcon(): string {
        return 'lucide-git-compare';
    }

    async setState(state: any) {
        if (state && state.results) {
            this.results = state.results;
            this.render();
        }
    }

    async onOpen() {
        this.render();
    }

    async onClose() {
        // Clean up
        this.contentEl.empty();
    }

    private render() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-comparative-view');

        // Header
        contentEl.createEl('h2', { text: 'Comparative Analysis' });

        if (this.results.length < 2) {
            contentEl.createEl('p', { text: 'Not enough results for comparison. Please analyze at least two items.' });
            return;
        }

        // Create tabs for different comparison views
        const tabsContainer = contentEl.createDiv('deleometer-tabs');
        const tabContents = contentEl.createDiv('deleometer-tab-contents');

        // Create tabs
        const overviewTab = tabsContainer.createDiv({ cls: 'deleometer-tab active', text: 'Overview' });
        const sideBySideTab = tabsContainer.createDiv({ cls: 'deleometer-tab', text: 'Side by Side' });
        const themesTab = tabsContainer.createDiv({ cls: 'deleometer-tab', text: 'Common Themes' });
        const frameworksTab = tabsContainer.createDiv({ cls: 'deleometer-tab', text: 'Frameworks' });

        // Create tab content containers
        const overviewContent = tabContents.createDiv({ cls: 'deleometer-tab-content active', attr: { 'data-tab': 'overview' } });
        const sideBySideContent = tabContents.createDiv({ cls: 'deleometer-tab-content', attr: { 'data-tab': 'side-by-side' } });
        const themesContent = tabContents.createDiv({ cls: 'deleometer-tab-content', attr: { 'data-tab': 'themes' } });
        const frameworksContent = tabContents.createDiv({ cls: 'deleometer-tab-content', attr: { 'data-tab': 'frameworks' } });

        // Add tab click handlers
        [overviewTab, sideBySideTab, themesTab, frameworksTab].forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabsContainer.querySelectorAll('.deleometer-tab').forEach(t => t.removeClass('active'));
                tab.addClass('active');

                // Update active content
                tabContents.querySelectorAll('.deleometer-tab-content').forEach(c => c.removeClass('active'));
                const tabName = tab.textContent?.toLowerCase().replace(' ', '-');
                tabContents.querySelector(`.deleometer-tab-content[data-tab="${tabName}"]`)?.addClass('active');
            });
        });

        // Render overview tab
        this.renderOverviewTab(overviewContent);

        // Render side by side tab
        this.renderSideBySideTab(sideBySideContent);

        // Render themes tab
        this.renderThemesTab(themesContent);

        // Render frameworks tab
        this.renderFrameworksTab(frameworksContent);
    }

    private renderOverviewTab(container: HTMLElement) {
        container.createEl('h3', { text: 'Analysis Overview' });

        // Create summary cards for each result
        const cardsContainer = container.createDiv('deleometer-cards-container');

        this.results.forEach(result => {
            const card = cardsContainer.createDiv('deleometer-card');
            
            // Card header
            const cardHeader = card.createDiv('deleometer-card-header');
            cardHeader.createEl('h4', { text: result.fileName });
            cardHeader.createSpan({ 
                text: this.getMediaTypeLabel(result.mediaType),
                cls: `deleometer-media-type ${result.mediaType}`
            });

            // Card content
            const cardContent = card.createDiv('deleometer-card-content');
            cardContent.createEl('p', { text: result.summary });

            // Card footer
            const cardFooter = card.createDiv('deleometer-card-footer');
            
            // Show frameworks used
            const frameworks = this.getUsedFrameworks(result);
            if (frameworks.length > 0) {
                const frameworksList = cardFooter.createDiv('deleometer-frameworks-list');
                frameworks.forEach(framework => {
                    frameworksList.createSpan({ 
                        text: framework,
                        cls: 'deleometer-framework-tag'
                    });
                });
            }
        });
    }

    private renderSideBySideTab(container: HTMLElement) {
        container.createEl('h3', { text: 'Side by Side Comparison' });

        // Create a table for side-by-side comparison
        const table = container.createEl('table', { cls: 'deleometer-comparison-table' });
        
        // Table header
        const thead = table.createEl('thead');
        const headerRow = thead.createEl('tr');
        headerRow.createEl('th', { text: 'Aspect' });
        
        this.results.forEach(result => {
            headerRow.createEl('th', { text: result.fileName });
        });

        // Table body
        const tbody = table.createEl('tbody');
        
        // Summary row
        const summaryRow = tbody.createEl('tr');
        summaryRow.createEl('td', { text: 'Summary' });
        
        this.results.forEach(result => {
            summaryRow.createEl('td', { text: result.summary });
        });

        // Recommendations row
        const recommendationsRow = tbody.createEl('tr');
        recommendationsRow.createEl('td', { text: 'Recommendations' });
        
        this.results.forEach(result => {
            const cell = recommendationsRow.createEl('td');
            
            if (result.recommendations && result.recommendations.length > 0) {
                const list = cell.createEl('ul');
                result.recommendations.forEach(recommendation => {
                    list.createEl('li', { text: recommendation });
                });
            } else {
                cell.setText('No recommendations');
            }
        });

        // Add rows for each framework that's present in at least one result
        const allFrameworks = this.getAllFrameworks();
        
        allFrameworks.forEach(framework => {
            const frameworkRow = tbody.createEl('tr');
            frameworkRow.createEl('td', { text: framework });
            
            this.results.forEach(result => {
                const cell = frameworkRow.createEl('td');
                
                if (result[framework + 'Analysis']) {
                    cell.setText('Analysis available');
                } else {
                    cell.setText('Not analyzed');
                }
            });
        });
    }

    private renderThemesTab(container: HTMLElement) {
        container.createEl('h3', { text: 'Common Themes and Patterns' });

        // This would be more sophisticated in a real implementation
        // For now, we'll just show a simple placeholder
        
        container.createEl('p', { 
            text: 'This tab would analyze common themes, patterns, and connections across the analyzed items.'
        });

        // Create a placeholder visualization
        const vizContainer = container.createDiv('deleometer-visualization-container');
        vizContainer.createEl('h4', { text: 'Theme Visualization' });
        
        const placeholderViz = vizContainer.createDiv('deleometer-placeholder-viz');
        placeholderViz.createEl('p', { 
            text: 'A visualization of common themes would appear here.'
        });
    }

    private renderFrameworksTab(container: HTMLElement) {
        container.createEl('h3', { text: 'Framework Analysis' });

        // Create a section for each framework that's present in at least one result
        const allFrameworks = this.getAllFrameworks();
        
        if (allFrameworks.length === 0) {
            container.createEl('p', { text: 'No theoretical frameworks were applied in the analysis.' });
            return;
        }

        allFrameworks.forEach(framework => {
            const frameworkSection = container.createDiv('deleometer-framework-section');
            frameworkSection.createEl('h4', { text: this.getFrameworkDisplayName(framework) });
            
            // Count how many results have this framework
            const resultsWithFramework = this.results.filter(result => result[framework + 'Analysis']);
            
            if (resultsWithFramework.length === 0) {
                frameworkSection.createEl('p', { text: 'No items were analyzed with this framework.' });
                return;
            }

            frameworkSection.createEl('p', { 
                text: `${resultsWithFramework.length} of ${this.results.length} items were analyzed with this framework.`
            });

            // In a real implementation, we would show more detailed framework-specific analysis here
        });
    }

    private getMediaTypeLabel(mediaType: string): string {
        switch (mediaType) {
            case 'text': return 'Text';
            case 'image': return 'Image';
            case 'audio': return 'Audio';
            case 'film': return 'Film';
            default: return 'Unknown';
        }
    }

    private getUsedFrameworks(result: ArtisticAnalysisResult): string[] {
        const frameworks = [];
        
        if (result.tackticalAnalysis) frameworks.push('Tacktical');
        if (result.freudianAnalysis) frameworks.push('Freudian');
        if (result.lacanianAnalysis) frameworks.push('Lacanian');
        if (result.deleuzianAnalysis) frameworks.push('Deleuzian');
        if (result.irigarayianAnalysis) frameworks.push('Irigarayian');
        if (result.jungianAnalysis) frameworks.push('Jungian');
        if (result.attachmentAnalysis) frameworks.push('Attachment');
        if (result.positiveAnalysis) frameworks.push('Positive');
        if (result.narrativeAnalysis) frameworks.push('Narrative');
        if (result.phenomenologicalAnalysis) frameworks.push('Phenomenological');
        if (result.existentialistAnalysis) frameworks.push('Existentialist');
        if (result.feministAnalysis) frameworks.push('Feminist');
        if (result.criticalAnalysis) frameworks.push('Critical');
        if (result.posthumanistAnalysis) frameworks.push('Posthumanist');
        if (result.buddhistAnalysis) frameworks.push('Buddhist');
        
        return frameworks;
    }

    private getAllFrameworks(): string[] {
        const frameworksSet = new Set<string>();
        
        this.results.forEach(result => {
            if (result.tackticalAnalysis) frameworksSet.add('tacktical');
            if (result.freudianAnalysis) frameworksSet.add('freudian');
            if (result.lacanianAnalysis) frameworksSet.add('lacanian');
            if (result.deleuzianAnalysis) frameworksSet.add('deleuzian');
            if (result.irigarayianAnalysis) frameworksSet.add('irigarayian');
            if (result.jungianAnalysis) frameworksSet.add('jungian');
            if (result.attachmentAnalysis) frameworksSet.add('attachment');
            if (result.positiveAnalysis) frameworksSet.add('positive');
            if (result.narrativeAnalysis) frameworksSet.add('narrative');
            if (result.phenomenologicalAnalysis) frameworksSet.add('phenomenological');
            if (result.existentialistAnalysis) frameworksSet.add('existentialist');
            if (result.feministAnalysis) frameworksSet.add('feminist');
            if (result.criticalAnalysis) frameworksSet.add('critical');
            if (result.posthumanistAnalysis) frameworksSet.add('posthumanist');
            if (result.buddhistAnalysis) frameworksSet.add('buddhist');
        });
        
        return Array.from(frameworksSet);
    }

    private getFrameworkDisplayName(framework: string): string {
        const displayNames: Record<string, string> = {
            'tacktical': 'Tacktical Methodology',
            'freudian': 'Freudian Psychoanalysis',
            'lacanian': 'Lacanian Psychoanalysis',
            'deleuzian': 'Deleuzian Schizoanalysis',
            'irigarayian': 'Irigarayian Feminist Theory',
            'jungian': 'Jungian Analytical Psychology',
            'attachment': 'Attachment Theory',
            'positive': 'Positive Psychology',
            'narrative': 'Narrative Psychology',
            'phenomenological': 'Phenomenology',
            'existentialist': 'Existentialism',
            'feminist': 'Feminist Theory',
            'critical': 'Critical Theory',
            'posthumanist': 'Posthumanism',
            'buddhist': 'Buddhist Philosophy'
        };
        
        return displayNames[framework] || framework.charAt(0).toUpperCase() + framework.slice(1);
    }
}
