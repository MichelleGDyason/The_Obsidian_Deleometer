import { App, TFile, Notice, normalizePath } from 'obsidian';

/**
 * Template system for the Deleometer plugin
 * Provides functionality for creating and using templates
 */
export class TemplateSystem {
    private app: App;
    private templatesFolder: string;
    
    constructor(app: App, templatesFolder: string = 'templates/deleometer') {
        this.app = app;
        this.templatesFolder = templatesFolder;
    }
    
    /**
     * Initializes the template system
     * Creates the templates folder if it doesn't exist
     */
    public async initialize(): Promise<void> {
        // Create templates folder if it doesn't exist
        const folderPath = normalizePath(this.templatesFolder);
        const folder = this.app.vault.getAbstractFileByPath(folderPath);
        
        if (!folder) {
            try {
                await this.app.vault.createFolder(folderPath);
                
                // Create default templates
                await this.createDefaultTemplates();
                
                new Notice('Deleometer templates folder created.');
            } catch (error) {
                console.error('Error creating templates folder:', error);
                new Notice('Failed to create templates folder.');
            }
        }
    }
    
    /**
     * Creates default templates
     */
    private async createDefaultTemplates(): Promise<void> {
        // Create journal template
        await this.saveTemplate('journal', this.getJournalTemplate());
        
        // Create psychoanalysis template
        await this.saveTemplate('psychoanalysis', this.getPsychoanalysisTemplate());
        
        // Create personality template
        await this.saveTemplate('personality', this.getPersonalityTemplate());
    }
    
    /**
     * Saves a template to the templates folder
     * @param name The template name
     * @param content The template content
     */
    public async saveTemplate(name: string, content: string): Promise<void> {
        const filePath = normalizePath(`${this.templatesFolder}/${name}.md`);
        
        try {
            await this.app.vault.create(filePath, content);
        } catch (error) {
            console.error(`Error saving template ${name}:`, error);
            new Notice(`Failed to save template ${name}.`);
        }
    }
    
    /**
     * Gets a template by name
     * @param name The template name
     * @returns The template content or null if not found
     */
    public async getTemplate(name: string): Promise<string | null> {
        const filePath = normalizePath(`${this.templatesFolder}/${name}.md`);
        const file = this.app.vault.getAbstractFileByPath(filePath);
        
        if (!file || !(file instanceof TFile)) {
            return null;
        }
        
        try {
            return await this.app.vault.read(file);
        } catch (error) {
            console.error(`Error reading template ${name}:`, error);
            return null;
        }
    }
    
    /**
     * Gets all available templates
     * @returns Array of template names
     */
    public async getTemplateNames(): Promise<string[]> {
        const folderPath = normalizePath(this.templatesFolder);
        const folder = this.app.vault.getAbstractFileByPath(folderPath);
        
        if (!folder) {
            return [];
        }
        
        // @ts-ignore - folder.children is not in the type definitions
        const files = folder.children || [];
        
        return files
            .filter((file: any) => file instanceof TFile && file.extension === 'md')
            .map((file: TFile) => file.basename);
    }
    
    /**
     * Applies a template to content
     * @param templateName The template name
     * @param data The data to apply to the template
     * @returns The processed content
     */
    public async applyTemplate(templateName: string, data: Record<string, any>): Promise<string | null> {
        const template = await this.getTemplate(templateName);
        
        if (!template) {
            return null;
        }
        
        // Replace variables in the template
        let content = template;
        
        // Replace simple variables
        Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                const regex = new RegExp(`{{${key}}}`, 'g');
                content = content.replace(regex, String(value));
            }
        });
        
        // Replace date variables
        content = this.replaceDateVariables(content);
        
        // Replace conditional blocks
        content = this.replaceConditionalBlocks(content, data);
        
        // Replace loops
        content = this.replaceLoops(content, data);
        
        return content;
    }
    
    /**
     * Replaces date variables in a template
     * @param content The template content
     * @returns The processed content
     */
    private replaceDateVariables(content: string): string {
        const dateRegex = /{{date:([^}]+)}}/g;
        
        return content.replace(dateRegex, (match, format) => {
            try {
                // @ts-ignore - moment is available in Obsidian
                return window.moment().format(format);
            } catch (error) {
                console.error('Error formatting date:', error);
                return match;
            }
        });
    }
    
    /**
     * Replaces conditional blocks in a template
     * @param content The template content
     * @param data The data to apply to the template
     * @returns The processed content
     */
    private replaceConditionalBlocks(content: string, data: Record<string, any>): string {
        const conditionalRegex = /{{#if ([^}]+)}}([\s\S]*?){{\/if}}/g;
        
        return content.replace(conditionalRegex, (match, condition, block) => {
            try {
                // Simple condition evaluation
                const parts = condition.split(' ');
                
                if (parts.length === 1) {
                    // Simple existence check
                    const value = this.getNestedValue(data, parts[0]);
                    return value ? block : '';
                } else if (parts.length === 3) {
                    // Comparison
                    const left = this.getNestedValue(data, parts[0]);
                    const operator = parts[1];
                    const right = parts[2].startsWith('"') ? 
                        parts[2].slice(1, -1) : // String literal
                        this.getNestedValue(data, parts[2]); // Variable
                    
                    switch (operator) {
                        case '==': return left == right ? block : '';
                        case '!=': return left != right ? block : '';
                        case '>': return left > right ? block : '';
                        case '<': return left < right ? block : '';
                        case '>=': return left >= right ? block : '';
                        case '<=': return left <= right ? block : '';
                        default: return match;
                    }
                }
                
                return match;
            } catch (error) {
                console.error('Error evaluating condition:', error);
                return match;
            }
        });
    }
    
    /**
     * Replaces loops in a template
     * @param content The template content
     * @param data The data to apply to the template
     * @returns The processed content
     */
    private replaceLoops(content: string, data: Record<string, any>): string {
        const loopRegex = /{{#each ([^}]+)}}([\s\S]*?){{\/each}}/g;
        
        return content.replace(loopRegex, (match, arrayName, block) => {
            try {
                const array = this.getNestedValue(data, arrayName);
                
                if (!Array.isArray(array)) {
                    return match;
                }
                
                return array.map(item => {
                    let itemBlock = block;
                    
                    if (typeof item === 'object') {
                        // Replace object properties
                        Object.entries(item).forEach(([key, value]) => {
                            const regex = new RegExp(`{{this.${key}}}`, 'g');
                            itemBlock = itemBlock.replace(regex, String(value));
                        });
                    } else {
                        // Replace simple value
                        itemBlock = itemBlock.replace(/{{this}}/g, String(item));
                    }
                    
                    return itemBlock;
                }).join('');
            } catch (error) {
                console.error('Error processing loop:', error);
                return match;
            }
        });
    }
    
    /**
     * Gets a nested value from an object
     * @param obj The object
     * @param path The path to the value (e.g. 'user.name')
     * @returns The value or undefined if not found
     */
    private getNestedValue(obj: Record<string, any>, path: string): any {
        return path.split('.').reduce((prev, curr) => {
            return prev && prev[curr] !== undefined ? prev[curr] : undefined;
        }, obj);
    }
    
    /**
     * Gets the default journal template
     * @returns The template content
     */
    private getJournalTemplate(): string {
        return `---
deleometer_template: journal
---

# Journal Entry - {{date:YYYY-MM-DD}}

## Morning Reflection
<!-- Write about your intentions for the day, your mood, and any dreams -->

## Daily Log
<!-- Record events, thoughts, and observations throughout the day -->

## Evening Reflection
<!-- Reflect on your day, emotions, and insights -->

## Emotional Analysis
{{#if emotions}}
### Emotions
{{#each emotions}}
- **{{this.name}}**: {{this.value}}
{{/each}}

### Overall Sentiment: {{sentiment}}
{{/if}}

{{#if psychoanalyticResponse}}
## Psychoanalytic Insights
{{psychoanalyticResponse}}
{{/if}}

{{#if personalityInsights}}
## Personality Insights
{{#each personalityInsights}}
- **{{this.trait}}**: {{this.value}}
{{/each}}
{{/if}}
`;
    }
    
    /**
     * Gets the default psychoanalysis template
     * @returns The template content
     */
    private getPsychoanalysisTemplate(): string {
        return `---
deleometer_template: psychoanalysis
---

# Psychoanalytic Insights - {{date:YYYY-MM-DD}}

## Freudian Analysis
{{#if freudianAnalysis}}
### Id, Ego, Superego
- **Id**: {{freudianAnalysis.id}}
- **Ego**: {{freudianAnalysis.ego}}
- **Superego**: {{freudianAnalysis.superego}}

### Defense Mechanisms
{{#each freudianAnalysis.defenseMechanisms}}
- {{this}}
{{/each}}

### Interpretation
{{freudianAnalysis.interpretation}}
{{/if}}

## Lacanian Analysis
{{#if lacanianAnalysis}}
{{lacanianAnalysis}}
{{/if}}

## Jungian Analysis
{{#if jungianAnalysis}}
### Archetypes
{{#each jungianAnalysis.archetypes}}
- **{{this.name}}**: {{this.description}}
{{/each}}

### Shadow Elements
{{#each jungianAnalysis.shadowElements}}
- {{this}}
{{/each}}

### Individuation Process
{{jungianAnalysis.individuation}}
{{/if}}
`;
    }
    
    /**
     * Gets the default personality template
     * @returns The template content
     */
    private getPersonalityTemplate(): string {
        return `---
deleometer_template: personality
---

# Personality Profile - {{date:YYYY-MM-DD}}

## Big Five Personality Traits
{{#if personalityInsights}}
### Trait Breakdown
- **Openness**: {{personalityInsights.openness}} - {{#if personalityInsights.openness >= 0.7}}High{{else}}{{#if personalityInsights.openness <= 0.3}}Low{{else}}Moderate{{/if}}{{/if}}
- **Conscientiousness**: {{personalityInsights.conscientiousness}} - {{#if personalityInsights.conscientiousness >= 0.7}}High{{else}}{{#if personalityInsights.conscientiousness <= 0.3}}Low{{else}}Moderate{{/if}}{{/if}}
- **Extraversion**: {{personalityInsights.extraversion}} - {{#if personalityInsights.extraversion >= 0.7}}High{{else}}{{#if personalityInsights.extraversion <= 0.3}}Low{{else}}Moderate{{/if}}{{/if}}
- **Agreeableness**: {{personalityInsights.agreeableness}} - {{#if personalityInsights.agreeableness >= 0.7}}High{{else}}{{#if personalityInsights.agreeableness <= 0.3}}Low{{else}}Moderate{{/if}}{{/if}}
- **Neuroticism**: {{personalityInsights.neuroticism}} - {{#if personalityInsights.neuroticism >= 0.7}}High{{else}}{{#if personalityInsights.neuroticism <= 0.3}}Low{{else}}Moderate{{/if}}{{/if}}

### Personality Summary
{{#if personalityInsights.openness >= 0.7}}
You show high openness to experience, indicating curiosity, creativity, and a preference for variety and intellectual stimulation.
{{/if}}

{{#if personalityInsights.conscientiousness >= 0.7}}
You demonstrate high conscientiousness, suggesting you are organized, responsible, and self-disciplined.
{{/if}}

{{#if personalityInsights.extraversion >= 0.7}}
You exhibit high extraversion, indicating sociability, assertiveness, and a preference for social interaction.
{{/if}}

{{#if personalityInsights.agreeableness >= 0.7}}
You display high agreeableness, suggesting you are cooperative, compassionate, and considerate of others.
{{/if}}

{{#if personalityInsights.neuroticism >= 0.7}}
You show high neuroticism, indicating a tendency toward negative emotions, anxiety, and emotional reactivity.
{{/if}}
{{/if}}

## Strengths and Growth Areas
{{#if personalityInsights}}
### Strengths
{{#if personalityInsights.openness >= 0.7}}
- Creative thinking and innovation
- Intellectual curiosity
- Appreciation for art, beauty, and ideas
{{/if}}

{{#if personalityInsights.conscientiousness >= 0.7}}
- Organization and planning
- Reliability and dependability
- Goal-oriented focus
{{/if}}

{{#if personalityInsights.extraversion >= 0.7}}
- Social networking and relationship building
- Enthusiasm and positive energy
- Leadership potential
{{/if}}

{{#if personalityInsights.agreeableness >= 0.7}}
- Empathy and compassion
- Teamwork and cooperation
- Conflict resolution
{{/if}}

{{#if personalityInsights.neuroticism <= 0.3}}
- Emotional stability
- Stress resilience
- Optimistic outlook
{{/if}}

### Growth Areas
{{#if personalityInsights.openness <= 0.3}}
- Exploring new ideas and perspectives
- Embracing change and uncertainty
- Developing creative thinking
{{/if}}

{{#if personalityInsights.conscientiousness <= 0.3}}
- Improving organization and planning
- Developing self-discipline
- Setting and achieving goals
{{/if}}

{{#if personalityInsights.extraversion <= 0.3}}
- Building social connections
- Asserting yourself in group settings
- Finding energy in social interactions
{{/if}}

{{#if personalityInsights.agreeableness <= 0.3}}
- Developing empathy and compassion
- Improving teamwork and cooperation
- Finding balance between assertiveness and cooperation
{{/if}}

{{#if personalityInsights.neuroticism >= 0.7}}
- Managing stress and anxiety
- Developing emotional resilience
- Cultivating a more positive outlook
{{/if}}
{{/if}}
`;
    }
}
