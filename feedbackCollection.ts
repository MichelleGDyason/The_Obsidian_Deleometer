import { App, Modal, Notice, setIcon } from 'obsidian';
import { AdvancedAI } from './advancedAI';
import { AnalysisResult } from './types';

/**
 * Modal for collecting user feedback on analysis results
 */
export class FeedbackModal extends Modal {
    private advancedAI: AdvancedAI;
    private analysisResult: AnalysisResult;
    private analysisId: string;
    
    constructor(app: App, advancedAI: AdvancedAI, analysisResult: AnalysisResult) {
        super(app);
        this.advancedAI = advancedAI;
        this.analysisResult = analysisResult;
        this.analysisId = `analysis-${Date.now()}`;
    }
    
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-feedback-modal');
        
        // Create header
        const headerEl = contentEl.createEl('div', { cls: 'deleometer-modal-header' });
        headerEl.createEl('h2', { text: 'Analysis Feedback' });
        
        // Create description
        contentEl.createEl('p', { 
            cls: 'deleometer-feedback-description',
            text: 'Your feedback helps improve the analysis quality and personalize future insights. All feedback is stored locally and used only to improve your experience.'
        });
        
        // Create rating section
        const ratingEl = contentEl.createEl('div', { cls: 'deleometer-rating-container' });
        ratingEl.createEl('h3', { text: 'How accurate was this analysis?' });
        
        const starsEl = ratingEl.createEl('div', { cls: 'deleometer-stars' });
        const stars: HTMLElement[] = [];
        
        for (let i = 1; i <= 5; i++) {
            const starEl = starsEl.createEl('div', { cls: 'deleometer-star' });
            setIcon(starEl, 'star');
            starEl.dataset.value = i.toString();
            stars.push(starEl);
            
            // Add hover effect
            starEl.addEventListener('mouseover', () => {
                for (let j = 0; j < stars.length; j++) {
                    if (j < i) {
                        stars[j].addClass('hovered');
                    } else {
                        stars[j].removeClass('hovered');
                    }
                }
            });
            
            // Remove hover effect
            starEl.addEventListener('mouseout', () => {
                for (const star of stars) {
                    star.removeClass('hovered');
                }
            });
            
            // Add click handler
            starEl.addEventListener('click', () => {
                for (let j = 0; j < stars.length; j++) {
                    if (j < i) {
                        stars[j].addClass('selected');
                    } else {
                        stars[j].removeClass('selected');
                    }
                }
                
                // Store rating
                this.rating = i;
            });
        }
        
        // Create comments section
        const commentsEl = contentEl.createEl('div', { cls: 'deleometer-comments-container' });
        commentsEl.createEl('h3', { text: 'Additional Comments (Optional)' });
        
        this.commentsInput = commentsEl.createEl('textarea', {
            cls: 'deleometer-comments-input',
            attr: {
                placeholder: 'Share any additional feedback about the analysis...',
                rows: '4'
            }
        });
        
        // Create corrections section
        const correctionsEl = contentEl.createEl('div', { cls: 'deleometer-corrections-container' });
        correctionsEl.createEl('h3', { text: 'Corrections (Optional)' });
        correctionsEl.createEl('p', { 
            cls: 'deleometer-corrections-description',
            text: 'If you feel any emotions or personality traits were incorrectly assessed, you can adjust them below.'
        });
        
        // Create emotions corrections
        if (this.analysisResult.emotions) {
            const emotionsEl = correctionsEl.createEl('div', { cls: 'deleometer-corrections-section' });
            emotionsEl.createEl('h4', { text: 'Emotions' });
            
            const emotionsGrid = emotionsEl.createEl('div', { cls: 'deleometer-corrections-grid' });
            
            Object.entries(this.analysisResult.emotions).forEach(([emotion, value]) => {
                if (emotion !== 'sentiment') {
                    const emotionRow = emotionsGrid.createEl('div', { cls: 'deleometer-correction-row' });
                    
                    emotionRow.createEl('div', { 
                        cls: 'deleometer-correction-label',
                        text: this.capitalizeFirstLetter(emotion)
                    });
                    
                    const sliderContainer = emotionRow.createEl('div', { cls: 'deleometer-slider-container' });
                    
                    const slider = sliderContainer.createEl('input', {
                        cls: 'deleometer-slider',
                        attr: {
                            type: 'range',
                            min: '0',
                            max: '10',
                            step: '1',
                            value: value.toString()
                        }
                    });
                    
                    const valueDisplay = sliderContainer.createEl('div', { 
                        cls: 'deleometer-slider-value',
                        text: value.toString()
                    });
                    
                    // Update value display when slider changes
                    slider.addEventListener('input', () => {
                        valueDisplay.textContent = slider.value;
                        
                        // Store correction
                        if (!this.emotionCorrections) {
                            this.emotionCorrections = {};
                        }
                        this.emotionCorrections[emotion] = parseFloat(slider.value);
                    });
                }
            });
        }
        
        // Create personality corrections
        if (this.analysisResult.personalityInsights) {
            const personalityEl = correctionsEl.createEl('div', { cls: 'deleometer-corrections-section' });
            personalityEl.createEl('h4', { text: 'Personality Traits' });
            
            const personalityGrid = personalityEl.createEl('div', { cls: 'deleometer-corrections-grid' });
            
            Object.entries(this.analysisResult.personalityInsights).forEach(([trait, value]) => {
                const traitRow = personalityGrid.createEl('div', { cls: 'deleometer-correction-row' });
                
                traitRow.createEl('div', { 
                    cls: 'deleometer-correction-label',
                    text: this.capitalizeFirstLetter(trait)
                });
                
                const sliderContainer = traitRow.createEl('div', { cls: 'deleometer-slider-container' });
                
                const slider = sliderContainer.createEl('input', {
                    cls: 'deleometer-slider',
                    attr: {
                        type: 'range',
                        min: '0',
                        max: '1',
                        step: '0.1',
                        value: value.toString()
                    }
                });
                
                const valueDisplay = sliderContainer.createEl('div', { 
                    cls: 'deleometer-slider-value',
                    text: value.toString()
                });
                
                // Update value display when slider changes
                slider.addEventListener('input', () => {
                    valueDisplay.textContent = slider.value;
                    
                    // Store correction
                    if (!this.personalityCorrections) {
                        this.personalityCorrections = {};
                    }
                    this.personalityCorrections[trait] = parseFloat(slider.value);
                });
            });
        }
        
        // Create buttons
        const buttonsEl = contentEl.createEl('div', { cls: 'deleometer-modal-buttons' });
        const cancelBtn = buttonsEl.createEl('button', { text: 'Cancel' });
        const submitBtn = buttonsEl.createEl('button', { cls: 'mod-cta', text: 'Submit Feedback' });
        
        // Add event listeners
        cancelBtn.addEventListener('click', () => {
            this.close();
        });
        
        submitBtn.addEventListener('click', () => {
            this.submitFeedback();
        });
    }
    
    private rating: number = 0;
    private commentsInput: HTMLTextAreaElement | null = null;
    private emotionCorrections: Record<string, number> | null = null;
    private personalityCorrections: Record<string, number> | null = null;
    
    /**
     * Submits the feedback
     */
    private async submitFeedback(): Promise<void> {
        if (this.rating === 0) {
            new Notice('Please provide a rating before submitting feedback.');
            return;
        }
        
        try {
            await this.advancedAI.collectFeedback(
                this.analysisId,
                this.rating,
                this.commentsInput?.value || '',
                {
                    emotions: this.emotionCorrections || undefined,
                    personality: this.personalityCorrections || undefined
                }
            );
            
            this.close();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            new Notice('Failed to submit feedback.');
        }
    }
    
    /**
     * Capitalizes the first letter of a string
     * @param string The string to capitalize
     * @returns The capitalized string
     */
    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
