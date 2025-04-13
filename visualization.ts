/**
 * Visualization module for the Deleometer plugin
 * Provides chart rendering functionality for emotional analysis
 */

import { EmotionData, PersonalityTrait } from './types';

export function renderEmotionChart(container: HTMLElement, emotions: EmotionData): void {
    // Clear container
    container.empty();
    container.addClass('deleometer-chart');

    // Filter out sentiment if present
    const emotionEntries = Object.entries(emotions)
        .filter(([key]) => key !== 'sentiment');

    // Sort emotions by value (descending)
    emotionEntries.sort((a, b) => b[1] - a[1]);

    // Calculate max value for scaling
    const maxValue = Math.max(...emotionEntries.map(([_, value]) => value));

    // Create chart
    const chartEl = container.createEl('div', { cls: 'deleometer-emotion-chart' });

    // Create bars
    emotionEntries.forEach(([emotion, value]) => {
        const barContainer = chartEl.createEl('div', { cls: 'deleometer-emotion-bar-container' });

        // Label
        barContainer.createEl('div', {
            cls: 'deleometer-emotion-label',
            text: capitalizeFirstLetter(emotion)
        });

        // Bar
        const barEl = barContainer.createEl('div', { cls: 'deleometer-emotion-bar' });
        const barFill = barEl.createEl('div', { cls: `deleometer-emotion-bar-fill ${emotion.toLowerCase()}` });

        // Set width based on value relative to max
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        barFill.style.width = `${percentage}%`;

        // Value
        barContainer.createEl('div', {
            cls: 'deleometer-emotion-value',
            text: value.toString()
        });
    });

    // If no emotions found
    if (emotionEntries.length === 0) {
        container.createEl('p', {
            cls: 'deleometer-no-data',
            text: 'No emotion data available'
        });
    }
}

export function renderPersonalityChart(container: HTMLElement, traits: PersonalityTrait): void {
    // Clear container
    container.empty();
    container.addClass('deleometer-personality-chart-container');

    const chartEl = container.createEl('div', { cls: 'deleometer-personality-chart' });

    // Create radar chart (simplified version)
    const traitEntries = Object.entries(traits);

    if (traitEntries.length === 0) {
        container.createEl('p', {
            cls: 'deleometer-no-data',
            text: 'No personality data available'
        });
        return;
    }

    // Create trait bars
    traitEntries.forEach(([trait, value]) => {
        const traitContainer = chartEl.createEl('div', { cls: 'deleometer-trait-container' });

        // Label
        traitContainer.createEl('div', {
            cls: 'deleometer-trait-label',
            text: capitalizeFirstLetter(trait)
        });

        // Bar container
        const barContainer = traitContainer.createEl('div', { cls: 'deleometer-trait-bar-container' });

        // Bar fill
        const barFill = barContainer.createEl('div', { cls: 'deleometer-trait-bar-fill' });

        // Normalize value between 0-100%
        const normalizedValue = typeof value === 'number' ? value : 0;
        const percentage = Math.min(normalizedValue * 10, 100);
        barFill.style.width = `${percentage}%`;

        // Value
        traitContainer.createEl('div', {
            cls: 'deleometer-trait-value',
            text: normalizedValue.toFixed(1)
        });
    });
}

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
