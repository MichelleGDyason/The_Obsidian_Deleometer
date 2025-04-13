import { App, Modal, Setting, MarkdownView, Notice } from 'obsidian';
import { JournalingPrompts, JournalingPrompt, PromptCategory } from './journalingPrompts';
import { UserProfileSystem } from './userProfileSystem';

/**
 * Modal for displaying journaling prompts
 */
export class JournalingPromptsModal extends Modal {
    private journalingPrompts: JournalingPrompts;
    private userProfileSystem: UserProfileSystem;
    private category?: PromptCategory;
    private prompts: JournalingPrompt[] = [];
    private selectedPrompt?: JournalingPrompt;
    
    constructor(
        app: App, 
        journalingPrompts: JournalingPrompts,
        userProfileSystem: UserProfileSystem,
        category?: PromptCategory
    ) {
        super(app);
        this.journalingPrompts = journalingPrompts;
        this.userProfileSystem = userProfileSystem;
        this.category = category;
    }
    
    async onOpen() {
        const { contentEl } = this;
        
        // Add title
        contentEl.createEl('h2', { text: 'Journaling Prompts' });
        
        // Add category selector
        const categorySelector = new Setting(contentEl)
            .setName('Category')
            .setDesc('Select a category of prompts')
            .addDropdown(dropdown => {
                dropdown.addOption('all', 'All Categories');
                dropdown.addOption('self-reflection', 'Self-Reflection');
                dropdown.addOption('emotional-awareness', 'Emotional Awareness');
                dropdown.addOption('personal-growth', 'Personal Growth');
                dropdown.addOption('creativity', 'Creativity');
                dropdown.addOption('relationships', 'Relationships');
                dropdown.addOption('gratitude', 'Gratitude');
                dropdown.addOption('goals', 'Goals');
                dropdown.addOption('challenges', 'Challenges');
                dropdown.addOption('mindfulness', 'Mindfulness');
                dropdown.addOption('values', 'Values');
                dropdown.addOption('dreams', 'Dreams');
                dropdown.addOption('memories', 'Memories');
                dropdown.addOption('identity', 'Identity');
                dropdown.addOption('healing', 'Healing');
                dropdown.addOption('spirituality', 'Spirituality');
                
                if (this.category) {
                    dropdown.setValue(this.category);
                }
                
                dropdown.onChange(async (value) => {
                    this.category = value === 'all' ? undefined : value as PromptCategory;
                    await this.loadPrompts();
                    this.renderPrompts();
                });
            });
        
        // Add container for prompts
        const promptsContainer = contentEl.createDiv({ cls: 'journaling-prompts-container' });
        
        // Add button container
        const buttonContainer = contentEl.createDiv({ cls: 'journaling-prompts-buttons' });
        
        // Add "Use Selected Prompt" button
        const usePromptButton = buttonContainer.createEl('button', { text: 'Use Selected Prompt' });
        usePromptButton.addEventListener('click', () => {
            if (this.selectedPrompt) {
                this.usePrompt(this.selectedPrompt);
            } else {
                new Notice('Please select a prompt first');
            }
        });
        
        // Add "Refresh Prompts" button
        const refreshButton = buttonContainer.createEl('button', { text: 'Refresh Prompts' });
        refreshButton.addEventListener('click', async () => {
            await this.loadPrompts();
            this.renderPrompts();
        });
        
        // Add CSS
        this.addStyles();
        
        // Load and render prompts
        await this.loadPrompts();
        this.renderPrompts();
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
    
    /**
     * Load prompts from the journaling prompts service
     */
    private async loadPrompts() {
        const userProfile = this.userProfileSystem.getUserProfile();
        const promptSet = await this.journalingPrompts.getPrompts(this.category, userProfile, 10);
        this.prompts = promptSet.prompts;
        
        // If there's a recommended prompt, select it by default
        if (promptSet.recommendedPrompt) {
            this.selectedPrompt = promptSet.recommendedPrompt;
        } else if (this.prompts.length > 0) {
            this.selectedPrompt = this.prompts[0];
        }
    }
    
    /**
     * Render prompts in the modal
     */
    private renderPrompts() {
        const { contentEl } = this;
        
        // Clear existing prompts
        const promptsContainer = contentEl.querySelector('.journaling-prompts-container');
        if (promptsContainer) {
            promptsContainer.empty();
            
            // Add prompts
            for (const prompt of this.prompts) {
                const promptEl = this.createPromptElement(prompt, promptsContainer);
                
                // Select the prompt if it's the selected one
                if (this.selectedPrompt && this.selectedPrompt.prompt === prompt.prompt) {
                    promptEl.addClass('selected');
                }
            }
        }
    }
    
    /**
     * Create a prompt element
     * @param prompt The prompt
     * @param container The container to add the prompt to
     */
    private createPromptElement(prompt: JournalingPrompt, container: HTMLElement): HTMLElement {
        const promptEl = container.createDiv({ cls: 'journaling-prompt' });
        
        // Add prompt text
        promptEl.createEl('p', { text: prompt.prompt, cls: 'prompt-text' });
        
        // Add prompt metadata
        const metadataEl = promptEl.createDiv({ cls: 'prompt-metadata' });
        
        // Add category
        metadataEl.createSpan({ text: prompt.category, cls: 'prompt-category' });
        
        // Add difficulty
        metadataEl.createSpan({ text: prompt.difficulty, cls: `prompt-difficulty prompt-difficulty-${prompt.difficulty}` });
        
        // Add time estimate
        metadataEl.createSpan({ text: `${prompt.timeEstimate} min`, cls: 'prompt-time' });
        
        // Add frameworks
        if (prompt.frameworks && prompt.frameworks.length > 0) {
            const frameworksEl = promptEl.createDiv({ cls: 'prompt-frameworks' });
            frameworksEl.createSpan({ text: 'Frameworks: ', cls: 'prompt-frameworks-label' });
            
            for (const framework of prompt.frameworks) {
                frameworksEl.createSpan({ text: framework, cls: 'prompt-framework' });
            }
        }
        
        // Add follow-up prompts
        if (prompt.followUpPrompts && prompt.followUpPrompts.length > 0) {
            const followUpsEl = promptEl.createDiv({ cls: 'prompt-follow-ups' });
            followUpsEl.createEl('p', { text: 'Follow-up prompts:', cls: 'prompt-follow-ups-label' });
            
            const followUpsList = followUpsEl.createEl('ul', { cls: 'prompt-follow-ups-list' });
            for (const followUp of prompt.followUpPrompts) {
                followUpsList.createEl('li', { text: followUp });
            }
        }
        
        // Add click handler
        promptEl.addEventListener('click', () => {
            // Remove selected class from all prompts
            const selectedPrompts = container.querySelectorAll('.journaling-prompt.selected');
            selectedPrompts.forEach(el => el.removeClass('selected'));
            
            // Add selected class to this prompt
            promptEl.addClass('selected');
            
            // Set selected prompt
            this.selectedPrompt = prompt;
        });
        
        return promptEl;
    }
    
    /**
     * Use the selected prompt
     * @param prompt The prompt to use
     */
    private usePrompt(prompt: JournalingPrompt) {
        // Get the active editor
        const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!activeView) {
            new Notice('No active editor');
            return;
        }
        
        const editor = activeView.editor;
        
        // Create the prompt text
        const promptText = `## ${prompt.prompt}\n\n`;
        
        // Insert the prompt at the cursor position
        const cursor = editor.getCursor();
        editor.replaceRange(promptText, cursor);
        
        // Set the cursor after the prompt
        editor.setCursor({
            line: cursor.line + 2,
            ch: 0
        });
        
        // Close the modal
        this.close();
        
        // Show a notice
        new Notice('Prompt inserted');
    }
    
    /**
     * Add CSS styles for the modal
     */
    private addStyles() {
        const { contentEl } = this;
        
        // Add a style element
        const style = contentEl.createEl('style');
        style.textContent = `
            .journaling-prompts-container {
                max-height: 400px;
                overflow-y: auto;
                margin: 20px 0;
            }
            
            .journaling-prompt {
                padding: 15px;
                margin-bottom: 15px;
                background-color: var(--background-secondary);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .journaling-prompt:hover {
                background-color: var(--background-secondary-alt);
            }
            
            .journaling-prompt.selected {
                border-left: 4px solid var(--interactive-accent);
                background-color: var(--background-secondary-alt);
            }
            
            .prompt-text {
                font-size: 1.1em;
                margin-bottom: 10px;
            }
            
            .prompt-metadata {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            
            .prompt-category,
            .prompt-difficulty,
            .prompt-time {
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                background-color: var(--background-modifier-border);
            }
            
            .prompt-difficulty-beginner {
                background-color: #4CAF50;
                color: white;
            }
            
            .prompt-difficulty-intermediate {
                background-color: #FFC107;
                color: black;
            }
            
            .prompt-difficulty-advanced {
                background-color: #F44336;
                color: white;
            }
            
            .prompt-frameworks {
                margin-bottom: 10px;
            }
            
            .prompt-framework {
                display: inline-block;
                padding: 3px 8px;
                margin-right: 5px;
                margin-bottom: 5px;
                border-radius: 12px;
                font-size: 0.8em;
                background-color: var(--interactive-accent);
                color: var(--text-on-accent);
            }
            
            .prompt-follow-ups {
                margin-top: 10px;
                padding: 10px;
                background-color: var(--background-primary);
                border-radius: 8px;
            }
            
            .prompt-follow-ups-label {
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .prompt-follow-ups-list {
                margin: 0;
                padding-left: 20px;
            }
            
            .journaling-prompts-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            
            .journaling-prompts-buttons button {
                padding: 8px 16px;
                background-color: var(--interactive-accent);
                color: var(--text-on-accent);
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .journaling-prompts-buttons button:hover {
                background-color: var(--interactive-accent-hover);
            }
        `;
    }
}
