import { EnhancedAnalysisResult } from './enhancedAnalysisFrameworks';
import { IrigarayianAnalysisResult } from './irigarayianAnalysis';
import { NextStepsResult, RecommendedAction } from './nextStepsRecommendation';

/**
 * Visualization options for enhanced analysis
 */
export interface EnhancedAnalysisVisualizationOptions {
    showFreudian: boolean;
    showLacanian: boolean;
    showDeleuzian: boolean;
    showIrigarayian: boolean;
    showPersonalized: boolean;
    showNextSteps: boolean;
    detailLevel: 'basic' | 'detailed' | 'comprehensive';
}

/**
 * Provides visualization for enhanced analysis results
 */
export class EnhancedAnalysisVisualization {
    /**
     * Generate HTML for enhanced analysis result
     * @param result The enhanced analysis result
     * @param options Visualization options
     * @returns HTML string
     */
    static generateHtml(result: EnhancedAnalysisResult, options: EnhancedAnalysisVisualizationOptions): string {
        let html = '<div class="deleometer-enhanced-analysis">';

        // Add emotions visualization
        html += this.generateEmotionsHtml(result);

        // Add Freudian analysis visualization
        if (options.showFreudian && result.freudianAnalysis) {
            html += this.generateFreudianHtml(result, options.detailLevel);
        }

        // Add Lacanian analysis visualization
        if (options.showLacanian && result.lacanianAnalysis) {
            html += this.generateLacanianHtml(result, options.detailLevel);
        }

        // Add Deleuzian analysis visualization
        if (options.showDeleuzian && result.deleuzianAnalysis) {
            html += this.generateDeleuzianHtml(result, options.detailLevel);
        }

        // Add Irigarayian analysis visualization
        if (options.showIrigarayian && result.irigarayianAnalysis) {
            html += this.generateIrigarayianHtml(result.irigarayianAnalysis, options.detailLevel);
        }

        // Add personalized insights
        if (options.showPersonalized && result.personalizedInsights) {
            html += `
                <div class="deleometer-personalized-insights">
                    <h3>Personalized Insights</h3>
                    <p>${result.personalizedInsights}</p>
                </div>
            `;
        }

        // Add next steps recommendations
        if (options.showNextSteps && result.nextStepsRecommendations) {
            html += this.generateNextStepsHtml(result.nextStepsRecommendations);
        }

        html += '</div>';
        return html;
    }

    /**
     * Generate HTML for emotions visualization
     * @param result The enhanced analysis result
     * @returns HTML string
     */
    private static generateEmotionsHtml(result: EnhancedAnalysisResult): string {
        if (!result.emotions) {
            return '';
        }

        const emotions = Object.entries(result.emotions)
            .filter(([key]) => key !== 'sentiment')
            .sort(([, a], [, b]) => (b as number) - (a as number));

        let html = `
            <div class="deleometer-emotions">
                <h3>Emotional Analysis</h3>
                <div class="deleometer-emotion-bars">
        `;

        for (const [emotion, value] of emotions) {
            const percentage = Math.round((value as number) * 10);
            html += `
                <div class="deleometer-emotion-bar">
                    <div class="deleometer-emotion-label">${emotion}</div>
                    <div class="deleometer-emotion-value-container">
                        <div class="deleometer-emotion-value" style="width: ${percentage}%"></div>
                    </div>
                    <div class="deleometer-emotion-number">${value}</div>
                </div>
            `;
        }

        html += `
                </div>
                <div class="deleometer-sentiment">
                    <span>Overall Sentiment: </span>
                    <span class="deleometer-sentiment-value">${result.emotions.sentiment.toFixed(2)}</span>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Generate HTML for Freudian analysis visualization
     * @param result The enhanced analysis result
     * @param detailLevel The detail level
     * @returns HTML string
     */
    private static generateFreudianHtml(result: EnhancedAnalysisResult, detailLevel: 'basic' | 'detailed' | 'comprehensive'): string {
        const freudian = result.freudianAnalysis;

        let html = `
            <div class="deleometer-freudian">
                <h3>Freudian Analysis</h3>
                <div class="deleometer-freudian-interpretation">
                    <p>${freudian.interpretation}</p>
                </div>
        `;

        if (detailLevel !== 'basic') {
            html += `
                <div class="deleometer-freudian-id-ego-superego">
                    <h4>Id/Ego/Superego</h4>
                    <div class="deleometer-freudian-triangle">
                        <div class="deleometer-freudian-superego">
                            <h5>Superego</h5>
                            <p>${freudian.idEgoSuperego.superego}</p>
                        </div>
                        <div class="deleometer-freudian-ego">
                            <h5>Ego</h5>
                            <p>${freudian.idEgoSuperego.ego}</p>
                        </div>
                        <div class="deleometer-freudian-id">
                            <h5>Id</h5>
                            <p>${freudian.idEgoSuperego.id}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        if (detailLevel === 'comprehensive') {
            html += `
                <div class="deleometer-freudian-defense-mechanisms">
                    <h4>Defense Mechanisms</h4>
                    <ul>
                        ${freudian.defenseMechanisms.map(mechanism => `<li>${mechanism}</li>`).join('')}
                    </ul>
                </div>

                <div class="deleometer-freudian-unconscious-desires">
                    <h4>Unconscious Desires</h4>
                    <ul>
                        ${freudian.unconsciousDesires.map(desire => `<li>${desire}</li>`).join('')}
                    </ul>
                </div>

                <div class="deleometer-freudian-complexes">
                    <h4>Complexes</h4>
                    <ul>
                        ${freudian.complexes.map(complex => `<li>${complex}</li>`).join('')}
                    </ul>
                </div>

                <div class="deleometer-freudian-transference">
                    <h4>Transference</h4>
                    <p>${freudian.transference}</p>
                </div>

                <div class="deleometer-freudian-resistance">
                    <h4>Resistance</h4>
                    <p>${freudian.resistance}</p>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Generate HTML for Lacanian analysis visualization
     * @param result The enhanced analysis result
     * @param detailLevel The detail level
     * @returns HTML string
     */
    private static generateLacanianHtml(result: EnhancedAnalysisResult, detailLevel: 'basic' | 'detailed' | 'comprehensive'): string {
        const lacanian = result.lacanianAnalysis;

        let html = `
            <div class="deleometer-lacanian">
                <h3>Lacanian Analysis</h3>
        `;

        if (detailLevel !== 'basic') {
            html += `
                <div class="deleometer-lacanian-orders">
                    <div class="deleometer-lacanian-symbolic">
                        <h4>Symbolic Order</h4>
                        <p>${lacanian.symbolicOrder}</p>
                    </div>
                    <div class="deleometer-lacanian-imaginary">
                        <h4>Imaginary Order</h4>
                        <p>${lacanian.imaginaryOrder}</p>
                    </div>
                    <div class="deleometer-lacanian-real">
                        <h4>Real Order</h4>
                        <p>${lacanian.realOrder}</p>
                    </div>
                </div>

                <div class="deleometer-lacanian-desire">
                    <h4>Desire Structures</h4>
                    <p>${lacanian.desireStructures}</p>
                </div>

                <div class="deleometer-lacanian-signifiers">
                    <h4>Key Signifiers</h4>
                    <div class="deleometer-lacanian-signifier-cloud">
                        ${lacanian.signifiers.map(signifier => `<span class="deleometer-lacanian-signifier">${signifier}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        if (detailLevel === 'comprehensive') {
            html += `
                <div class="deleometer-lacanian-jouissance">
                    <h4>Jouissance</h4>
                    <p>${lacanian.jouissance}</p>
                </div>

                <div class="deleometer-lacanian-lack">
                    <h4>Lack</h4>
                    <p>${lacanian.lack}</p>
                </div>

                <div class="deleometer-lacanian-big-other">
                    <h4>Big Other</h4>
                    <p>${lacanian.bigOther}</p>
                </div>

                <div class="deleometer-lacanian-mirror-stage">
                    <h4>Mirror Stage</h4>
                    <p>${lacanian.mirrorStage}</p>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Generate HTML for Deleuzian analysis visualization
     * @param result The enhanced analysis result
     * @param detailLevel The detail level
     * @returns HTML string
     */
    private static generateDeleuzianHtml(result: EnhancedAnalysisResult, detailLevel: 'basic' | 'detailed' | 'comprehensive'): string {
        const deleuzian = result.deleuzianAnalysis;

        let html = `
            <div class="deleometer-deleuzian">
                <h3>Deleuzian Analysis</h3>

                <div class="deleometer-deleuzian-rhizomatic">
                    <h4>Rhizomatic Patterns</h4>
                    <p>${deleuzian.rhizomaticPatterns}</p>
                </div>
        `;

        if (detailLevel !== 'basic') {
            html += `
                <div class="deleometer-deleuzian-deterritorialization">
                    <h4>Deterritorialization</h4>
                    <p>${deleuzian.deterritorialization}</p>
                </div>

                <div class="deleometer-deleuzian-reterritorialization">
                    <h4>Reterritorialization</h4>
                    <p>${deleuzian.reterritorialization}</p>
                </div>

                <div class="deleometer-deleuzian-lines-of-flight">
                    <h4>Lines of Flight</h4>
                    <ul>
                        ${deleuzian.linesOfFlight.map(line => `<li>${line}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        if (detailLevel === 'comprehensive') {
            html += `
                <div class="deleometer-deleuzian-desire-machines">
                    <h4>Desire-Machines</h4>
                    <p>${deleuzian.desireMachines}</p>
                </div>

                <div class="deleometer-deleuzian-body-without-organs">
                    <h4>Body Without Organs</h4>
                    <p>${deleuzian.bodyWithoutOrgans}</p>
                </div>

                <div class="deleometer-deleuzian-multiplicity">
                    <h4>Multiplicity</h4>
                    <p>${deleuzian.multiplicity}</p>
                </div>

                <div class="deleometer-deleuzian-nomadism">
                    <h4>Nomadism</h4>
                    <p>${deleuzian.nomadism}</p>
                </div>

                <div class="deleometer-deleuzian-smooth-striated">
                    <h4>Smooth/Striated Spaces</h4>
                    <p>${deleuzian.smoothStriated}</p>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Generate CSS for enhanced analysis visualization
     * @returns CSS string
     */
    /**
     * Generate HTML for Irigarayian analysis visualization
     * @param result The Irigarayian analysis result
     * @param detailLevel The detail level
     * @returns HTML string
     */
    private static generateIrigarayianHtml(result: IrigarayianAnalysisResult, detailLevel: 'basic' | 'detailed' | 'comprehensive'): string {
        let html = `
            <div class="deleometer-irigarayian">
                <h3>Irigarayian Analysis</h3>

                <div class="deleometer-irigarayian-interpretation">
                    <p>${result.interpretation}</p>
                </div>
        `;

        if (detailLevel !== 'basic') {
            html += `
                <div class="deleometer-irigarayian-sexual-difference">
                    <h4>Sexual Difference</h4>
                    <div class="deleometer-irigarayian-phallocentrism">
                        <h5>Phallocentrism</h5>
                        <p>${result.sexualDifference.phallocentrism}</p>
                    </div>
                    <div class="deleometer-irigarayian-feminine-speaking">
                        <h5>Feminine Speaking</h5>
                        <p>${result.sexualDifference.feminineSpeaking}</p>
                    </div>
                    <div class="deleometer-irigarayian-mimesis">
                        <h5>Mimesis</h5>
                        <p>${result.sexualDifference.mimesis}</p>
                    </div>
                </div>

                <div class="deleometer-irigarayian-feminine-subjectivity">
                    <h4>Feminine Subjectivity</h4>
                    <div class="deleometer-irigarayian-fluid-identity">
                        <h5>Fluid Identity</h5>
                        <p>${result.feminineSubjectivity.fluidIdentity}</p>
                    </div>
                    <div class="deleometer-irigarayian-embodied-knowledge">
                        <h5>Embodied Knowledge</h5>
                        <p>${result.feminineSubjectivity.embodiedKnowledge}</p>
                    </div>
                    <div class="deleometer-irigarayian-relationality">
                        <h5>Relationality</h5>
                        <p>${result.feminineSubjectivity.relationality}</p>
                    </div>
                </div>
            `;
        }

        if (detailLevel === 'comprehensive') {
            html += `
                <div class="deleometer-irigarayian-language">
                    <h4>Language and Discourse</h4>
                    <div class="deleometer-irigarayian-speaking-as-woman">
                        <h5>Speaking as Woman</h5>
                        <p>${result.languageAndDiscourse.speakingAsWoman}</p>
                    </div>
                    <div class="deleometer-irigarayian-disruptive-syntax">
                        <h5>Disruptive Syntax</h5>
                        <p>${result.languageAndDiscourse.disruptiveSyntax}</p>
                    </div>
                    <div class="deleometer-irigarayian-poetic-language">
                        <h5>Poetic Language</h5>
                        <p>${result.languageAndDiscourse.poeticLanguage}</p>
                    </div>
                    <div class="deleometer-irigarayian-silences">
                        <h5>Silences and Gaps</h5>
                        <p>${result.languageAndDiscourse.silencesAndGaps}</p>
                    </div>
                </div>

                <div class="deleometer-irigarayian-ethics">
                    <h4>Ethics of Difference</h4>
                    <div class="deleometer-irigarayian-intersubjectivity">
                        <h5>Intersubjectivity</h5>
                        <p>${result.ethicsOfDifference.intersubjectivity}</p>
                    </div>
                    <div class="deleometer-irigarayian-wonderment">
                        <h5>Wonderment</h5>
                        <p>${result.ethicsOfDifference.wonderment}</p>
                    </div>
                    <div class="deleometer-irigarayian-mutual-respect">
                        <h5>Mutual Respect</h5>
                        <p>${result.ethicsOfDifference.mutualRespect}</p>
                    </div>
                </div>

                <div class="deleometer-irigarayian-concepts">
                    <h4>Key Concepts</h4>
                    <div class="deleometer-irigarayian-concept-cloud">
                        ${result.keyConcepts.map(concept => `<span class="deleometer-irigarayian-concept">${concept}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Generate HTML for next steps recommendations
     * @param result The next steps result
     * @returns HTML string
     */
    private static generateNextStepsHtml(result: NextStepsResult): string {
        let html = `
            <div class="deleometer-next-steps">
                <h3>Next Steps Recommendations</h3>

                <div class="deleometer-next-steps-summary">
                    <p>${result.summary}</p>
                </div>
        `;

        // Add identified goals
        if (result.identifiedGoals.explicit.length > 0 || result.identifiedGoals.implicit.length > 0) {
            html += `
                <div class="deleometer-next-steps-goals">
                    <h4>Identified Goals</h4>
            `;

            if (result.identifiedGoals.explicit.length > 0) {
                html += `
                    <div class="deleometer-next-steps-explicit-goals">
                        <h5>Explicit Goals</h5>
                        <ul>
                            ${result.identifiedGoals.explicit.map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            if (result.identifiedGoals.implicit.length > 0) {
                html += `
                    <div class="deleometer-next-steps-implicit-goals">
                        <h5>Implicit Goals</h5>
                        <ul>
                            ${result.identifiedGoals.implicit.map(goal => `<li>${goal}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            html += '</div>';
        }

        // Add recommended actions
        if (result.recommendedActions.length > 0) {
            html += `
                <div class="deleometer-next-steps-actions">
                    <h4>Recommended Actions</h4>
            `;

            for (const action of result.recommendedActions) {
                html += `
                    <div class="deleometer-next-steps-action deleometer-next-steps-action-${action.difficulty} deleometer-next-steps-action-${action.timeframe} deleometer-next-steps-action-${action.category}">
                        <h5>${action.title}</h5>
                        <div class="deleometer-next-steps-action-meta">
                            <span class="deleometer-next-steps-action-difficulty">${action.difficulty}</span>
                            <span class="deleometer-next-steps-action-timeframe">${action.timeframe}</span>
                            <span class="deleometer-next-steps-action-category">${action.category}</span>
                        </div>
                        <p>${action.description}</p>
                        <p class="deleometer-next-steps-action-rationale"><strong>Why:</strong> ${action.rationale}</p>
                    </div>
                `;
            }

            html += '</div>';
        }

        // Add happiness insights
        if (result.happinessInsights) {
            html += `
                <div class="deleometer-next-steps-happiness">
                    <h4>Happiness Insights</h4>

                    <div class="deleometer-next-steps-happiness-definition">
                        <h5>Your Definition of Happiness</h5>
                        <p>${result.happinessInsights.personalDefinition}</p>
                    </div>
            `;

            if (result.happinessInsights.currentFactors.length > 0) {
                html += `
                    <div class="deleometer-next-steps-happiness-current">
                        <h5>Current Factors Contributing to Happiness</h5>
                        <ul>
                            ${result.happinessInsights.currentFactors.map(factor => `<li>${factor}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            if (result.happinessInsights.potentialFactors.length > 0) {
                html += `
                    <div class="deleometer-next-steps-happiness-potential">
                        <h5>Potential Factors to Increase Happiness</h5>
                        <ul>
                            ${result.happinessInsights.potentialFactors.map(factor => `<li>${factor}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            html += '</div>';
        }

        // Add long-term vision
        if (result.longTermVision) {
            html += `
                <div class="deleometer-next-steps-vision">
                    <h4>Long-Term Vision</h4>
                    <p>${result.longTermVision}</p>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    static generateCss(): string {
        return `
            .deleometer-enhanced-analysis {
                font-family: 'Inter', sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: var(--background-primary);
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            .deleometer-enhanced-analysis h3 {
                font-size: 1.5em;
                margin-top: 30px;
                margin-bottom: 15px;
                color: var(--text-normal);
                border-bottom: 1px solid var(--background-modifier-border);
                padding-bottom: 5px;
            }

            .deleometer-enhanced-analysis h4 {
                font-size: 1.2em;
                margin-top: 20px;
                margin-bottom: 10px;
                color: var(--text-normal);
            }

            .deleometer-enhanced-analysis h5 {
                font-size: 1em;
                margin-top: 15px;
                margin-bottom: 5px;
                color: var(--text-normal);
                font-weight: bold;
            }

            .deleometer-enhanced-analysis p {
                margin-bottom: 15px;
                line-height: 1.6;
                color: var(--text-normal);
            }

            .deleometer-enhanced-analysis ul {
                margin-left: 20px;
                margin-bottom: 15px;
            }

            .deleometer-enhanced-analysis li {
                margin-bottom: 5px;
                line-height: 1.4;
                color: var(--text-normal);
            }

            /* Emotions visualization */
            .deleometer-emotions {
                margin-bottom: 30px;
            }

            .deleometer-emotion-bars {
                margin-top: 15px;
            }

            .deleometer-emotion-bar {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }

            .deleometer-emotion-label {
                width: 100px;
                text-align: right;
                padding-right: 10px;
                font-weight: 500;
                color: var(--text-normal);
            }

            .deleometer-emotion-value-container {
                flex-grow: 1;
                height: 20px;
                background-color: var(--background-modifier-border);
                border-radius: 4px;
                overflow: hidden;
            }

            .deleometer-emotion-value {
                height: 100%;
                background-color: var(--interactive-accent);
                border-radius: 4px;
            }

            .deleometer-emotion-number {
                width: 30px;
                text-align: right;
                padding-left: 10px;
                font-weight: 500;
                color: var(--text-normal);
            }

            .deleometer-sentiment {
                margin-top: 15px;
                text-align: right;
                font-weight: 500;
                color: var(--text-normal);
            }

            .deleometer-sentiment-value {
                color: var(--interactive-accent);
            }

            /* Freudian visualization */
            .deleometer-freudian {
                margin-bottom: 30px;
            }

            .deleometer-freudian-triangle {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .deleometer-freudian-superego {
                width: 80%;
                padding: 15px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
                margin-bottom: 10px;
            }

            .deleometer-freudian-ego {
                width: 80%;
                padding: 15px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
                margin-bottom: 10px;
            }

            .deleometer-freudian-id {
                width: 80%;
                padding: 15px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
            }

            /* Lacanian visualization */
            .deleometer-lacanian {
                margin-bottom: 30px;
            }

            .deleometer-lacanian-orders {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .deleometer-lacanian-symbolic,
            .deleometer-lacanian-imaginary,
            .deleometer-lacanian-real {
                flex: 1;
                min-width: 200px;
                padding: 15px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
            }

            .deleometer-lacanian-signifier-cloud {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 15px;
            }

            .deleometer-lacanian-signifier {
                padding: 5px 10px;
                background-color: var(--interactive-accent);
                color: var(--text-on-accent);
                border-radius: 15px;
                font-size: 0.9em;
            }

            /* Deleuzian visualization */
            .deleometer-deleuzian {
                margin-bottom: 30px;
            }

            /* Irigarayian visualization */
            .deleometer-irigarayian {
                margin-bottom: 30px;
            }

            .deleometer-irigarayian-sexual-difference,
            .deleometer-irigarayian-feminine-subjectivity,
            .deleometer-irigarayian-language,
            .deleometer-irigarayian-ethics {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .deleometer-irigarayian-phallocentrism,
            .deleometer-irigarayian-feminine-speaking,
            .deleometer-irigarayian-mimesis,
            .deleometer-irigarayian-fluid-identity,
            .deleometer-irigarayian-embodied-knowledge,
            .deleometer-irigarayian-relationality,
            .deleometer-irigarayian-speaking-as-woman,
            .deleometer-irigarayian-disruptive-syntax,
            .deleometer-irigarayian-poetic-language,
            .deleometer-irigarayian-silences,
            .deleometer-irigarayian-intersubjectivity,
            .deleometer-irigarayian-wonderment,
            .deleometer-irigarayian-mutual-respect {
                flex: 1;
                min-width: 200px;
                padding: 15px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
            }

            .deleometer-irigarayian-concept-cloud {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 15px;
            }

            .deleometer-irigarayian-concept {
                padding: 5px 10px;
                background-color: var(--interactive-accent);
                color: var(--text-on-accent);
                border-radius: 15px;
                font-size: 0.9em;
            }

            /* Next Steps visualization */
            .deleometer-next-steps {
                margin-bottom: 30px;
            }

            .deleometer-next-steps-goals,
            .deleometer-next-steps-actions,
            .deleometer-next-steps-happiness,
            .deleometer-next-steps-vision {
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .deleometer-next-steps-action {
                padding: 15px;
                margin-bottom: 15px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
                border-left: 4px solid var(--interactive-accent);
            }

            .deleometer-next-steps-action-meta {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }

            .deleometer-next-steps-action-difficulty,
            .deleometer-next-steps-action-timeframe,
            .deleometer-next-steps-action-category {
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                font-weight: 500;
            }

            .deleometer-next-steps-action-easy {
                border-left-color: #4CAF50;
            }

            .deleometer-next-steps-action-moderate {
                border-left-color: #FFC107;
            }

            .deleometer-next-steps-action-challenging {
                border-left-color: #F44336;
            }

            .deleometer-next-steps-action-difficulty {
                background-color: var(--background-modifier-border);
                color: var(--text-normal);
            }

            .deleometer-next-steps-action-timeframe {
                background-color: var(--background-modifier-border);
                color: var(--text-normal);
            }

            .deleometer-next-steps-action-category {
                background-color: var(--interactive-accent);
                color: var(--text-on-accent);
            }

            .deleometer-next-steps-action-rationale {
                font-style: italic;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid var(--background-modifier-border);
            }

            .deleometer-next-steps-happiness-definition,
            .deleometer-next-steps-happiness-current,
            .deleometer-next-steps-happiness-potential {
                padding: 15px;
                margin-bottom: 15px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
            }

            .deleometer-next-steps-happiness-definition {
                border-left: 4px solid #9C27B0;
            }

            .deleometer-next-steps-happiness-current {
                border-left: 4px solid #4CAF50;
            }

            .deleometer-next-steps-happiness-potential {
                border-left: 4px solid #2196F3;
            }

            .deleometer-next-steps-vision {
                padding: 15px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
                border-left: 4px solid #9C27B0;
            }

            /* Personalized insights */
            .deleometer-personalized-insights {
                margin-top: 30px;
                padding: 20px;
                background-color: var(--background-modifier-hover);
                border-radius: 8px;
                border-left: 4px solid var(--interactive-accent);
            }
        `;
    }
}
