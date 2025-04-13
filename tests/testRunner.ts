import { App, Modal, Notice } from 'obsidian';
import { DeleometerPlugin } from '../main';
import { TestFramework, TestSummary } from './testFramework';
import { UnitTests, UnitTestSummary } from './unitTests';
import { EnhancedAnalysisTests } from './enhancedAnalysisTests';
import { AnalysisScopeTest } from './analysisScopeTest';
import { JournalingPromptsTest } from './journalingPromptsTest';

/**
 * Test Runner for Deleometer
 * Provides a UI for running tests and viewing results
 */
export class TestRunner {
    private plugin: DeleometerPlugin;
    private app: App;
    private testFramework: TestFramework;
    private unitTests: UnitTests;
    private enhancedAnalysisTests: EnhancedAnalysisTests;
    private analysisScopeTest: AnalysisScopeTest;
    private journalingPromptsTest: JournalingPromptsTest;

    constructor(plugin: DeleometerPlugin) {
        this.plugin = plugin;
        this.app = plugin.app;
        this.testFramework = new TestFramework(plugin);
        this.unitTests = new UnitTests(this.app);
        this.enhancedAnalysisTests = new EnhancedAnalysisTests(this.app, plugin.apiService);
        this.analysisScopeTest = new AnalysisScopeTest(this.app);
        this.journalingPromptsTest = new JournalingPromptsTest(this.app);
    }

    /**
     * Runs all tests
     * @returns Promise<void>
     */
    public async runAllTests(): Promise<void> {
        try {
            new Notice('Running Deleometer tests...');

            // Run integration tests
            const integrationResults = await this.testFramework.runAllTests();

            // Run unit tests
            const unitResults = await this.unitTests.runAllTests();

            // Run enhanced analysis tests
            await this.enhancedAnalysisTests.runAllTests();

            // Run analysis scope tests
            await this.analysisScopeTest.runTests();

            // Run journaling prompts tests
            await this.journalingPromptsTest.runTests();

            // Show results
            new TestResultsModal(this.app, integrationResults, unitResults).open();
        } catch (error) {
            console.error('[TestRunner] Error running tests:', error);
            new Notice(`Error running tests: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Runs integration tests only
     * @returns Promise<void>
     */
    public async runIntegrationTests(): Promise<void> {
        try {
            new Notice('Running Deleometer integration tests...');

            // Run integration tests
            const integrationResults = await this.testFramework.runAllTests();

            // Show results
            new TestResultsModal(this.app, integrationResults, null).open();
        } catch (error) {
            console.error('[TestRunner] Error running integration tests:', error);
            new Notice(`Error running integration tests: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Runs unit tests only
     * @returns Promise<void>
     */
    public async runUnitTests(): Promise<void> {
        try {
            new Notice('Running Deleometer unit tests...');

            // Run unit tests
            const unitResults = await this.unitTests.runAllTests();

            // Show results
            new TestResultsModal(this.app, null, unitResults).open();
        } catch (error) {
            console.error('[TestRunner] Error running unit tests:', error);
            new Notice(`Error running unit tests: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Generates a test report
     * @returns Promise<string> The test report in markdown format
     */
    public async generateTestReport(): Promise<string> {
        try {
            // Run all tests
            const integrationResults = await this.testFramework.runAllTests();
            const unitResults = await this.unitTests.runAllTests();

            // Generate report
            let report = `# Deleometer Test Report\n\n`;
            report += `Generated: ${new Date().toLocaleString()}\n\n`;

            // Add integration test results
            report += `## Integration Tests\n\n`;
            report += `- **Total Tests:** ${integrationResults.total}\n`;
            report += `- **Passed:** ${integrationResults.passed}\n`;
            report += `- **Failed:** ${integrationResults.failed}\n`;
            report += `- **Skipped:** ${integrationResults.skipped}\n\n`;

            // Add unit test results
            report += `## Unit Tests\n\n`;
            report += `- **Total Tests:** ${unitResults.total}\n`;
            report += `- **Passed:** ${unitResults.passed}\n`;
            report += `- **Failed:** ${unitResults.failed}\n`;
            report += `- **Skipped:** ${unitResults.skipped}\n\n`;

            // Add detailed reports
            report += `## Detailed Integration Test Results\n\n`;
            report += this.testFramework.generateTestReport();

            report += `\n\n## Detailed Unit Test Results\n\n`;
            report += this.unitTests.generateTestReport();

            return report;
        } catch (error) {
            console.error('[TestRunner] Error generating test report:', error);
            throw new Error(`Failed to generate test report: ${error.message || 'Unknown error'}`);
        }
    }

    /**
     * Saves a test report to a file
     * @returns Promise<void>
     */
    public async saveTestReport(): Promise<void> {
        try {
            new Notice('Generating Deleometer test report...');

            // Generate report
            const report = await this.generateTestReport();

            // Save to file
            const fileName = `Deleometer_Test_Report_${new Date().toISOString().slice(0, 10)}.md`;
            await this.app.vault.create(fileName, report);

            new Notice(`Test report saved as ${fileName}`);

            // Open the file
            const file = this.app.vault.getAbstractFileByPath(fileName);
            if (file) {
                const leaf = this.app.workspace.getLeaf(false);
                await leaf.openFile(file as any);
            }
        } catch (error) {
            console.error('[TestRunner] Error saving test report:', error);
            new Notice(`Error saving test report: ${error.message || 'Unknown error'}`);
        }
    }
}

/**
 * Modal for displaying test results
 */
export class TestResultsModal extends Modal {
    private integrationResults: TestSummary | null;
    private unitResults: UnitTestSummary | null;

    constructor(app: App, integrationResults: TestSummary | null, unitResults: UnitTestSummary | null) {
        super(app);
        this.integrationResults = integrationResults;
        this.unitResults = unitResults;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass('deleometer-test-results-modal');

        // Create header
        const headerEl = contentEl.createEl('div', { cls: 'deleometer-modal-header' });
        headerEl.createEl('h2', { text: 'Deleometer Test Results' });

        // Create tabs
        const tabsEl = contentEl.createEl('div', { cls: 'deleometer-tabs' });
        const integrationTabEl = tabsEl.createEl('div', { cls: 'deleometer-tab', text: 'Integration Tests' });
        const unitTabEl = tabsEl.createEl('div', { cls: 'deleometer-tab', text: 'Unit Tests' });

        // Create content containers
        const integrationContentEl = contentEl.createEl('div', { cls: 'deleometer-tab-content' });
        const unitContentEl = contentEl.createEl('div', { cls: 'deleometer-tab-content' });

        // Hide unit content initially
        unitContentEl.style.display = 'none';

        // Add tab click handlers
        integrationTabEl.addEventListener('click', () => {
            integrationTabEl.addClass('active');
            unitTabEl.removeClass('active');
            integrationContentEl.style.display = 'block';
            unitContentEl.style.display = 'none';
        });

        unitTabEl.addEventListener('click', () => {
            unitTabEl.addClass('active');
            integrationTabEl.removeClass('active');
            unitContentEl.style.display = 'block';
            integrationContentEl.style.display = 'none';
        });

        // Set initial active tab
        if (this.integrationResults) {
            integrationTabEl.addClass('active');
        } else if (this.unitResults) {
            unitTabEl.addClass('active');
            integrationContentEl.style.display = 'none';
            unitContentEl.style.display = 'block';
        }

        // Add integration test results
        if (this.integrationResults) {
            this.renderIntegrationResults(integrationContentEl);
        } else {
            integrationContentEl.createEl('p', { text: 'No integration tests were run.' });
        }

        // Add unit test results
        if (this.unitResults) {
            this.renderUnitResults(unitContentEl);
        } else {
            unitContentEl.createEl('p', { text: 'No unit tests were run.' });
        }

        // Add buttons
        const buttonsEl = contentEl.createEl('div', { cls: 'deleometer-modal-buttons' });
        const closeBtn = buttonsEl.createEl('button', { text: 'Close' });

        closeBtn.addEventListener('click', () => {
            this.close();
        });
    }

    /**
     * Renders integration test results
     * @param containerEl The container element
     */
    private renderIntegrationResults(containerEl: HTMLElement): void {
        if (!this.integrationResults) {
            return;
        }

        const { passed, failed, skipped, total, results } = this.integrationResults;

        // Add summary
        const summaryEl = containerEl.createEl('div', { cls: 'deleometer-test-summary' });

        const totalEl = summaryEl.createEl('div', { cls: 'deleometer-test-stat' });
        totalEl.createEl('div', { cls: 'deleometer-test-stat-value', text: total.toString() });
        totalEl.createEl('div', { cls: 'deleometer-test-stat-label', text: 'Total' });

        const passedEl = summaryEl.createEl('div', { cls: 'deleometer-test-stat deleometer-test-passed' });
        passedEl.createEl('div', { cls: 'deleometer-test-stat-value', text: passed.toString() });
        passedEl.createEl('div', { cls: 'deleometer-test-stat-label', text: 'Passed' });

        const failedEl = summaryEl.createEl('div', { cls: 'deleometer-test-stat deleometer-test-failed' });
        failedEl.createEl('div', { cls: 'deleometer-test-stat-value', text: failed.toString() });
        failedEl.createEl('div', { cls: 'deleometer-test-stat-label', text: 'Failed' });

        const skippedEl = summaryEl.createEl('div', { cls: 'deleometer-test-stat deleometer-test-skipped' });
        skippedEl.createEl('div', { cls: 'deleometer-test-stat-value', text: skipped.toString() });
        skippedEl.createEl('div', { cls: 'deleometer-test-stat-label', text: 'Skipped' });

        // Add results
        const resultsEl = containerEl.createEl('div', { cls: 'deleometer-test-results' });

        for (const result of results) {
            const resultEl = resultsEl.createEl('div', { cls: 'deleometer-test-result' });

            const statusEl = resultEl.createEl('div', { cls: 'deleometer-test-result-status' });
            if (result.skipped) {
                statusEl.setText('⏭️');
                statusEl.addClass('deleometer-test-skipped');
            } else if (result.passed) {
                statusEl.setText('✅');
                statusEl.addClass('deleometer-test-passed');
            } else {
                statusEl.setText('❌');
                statusEl.addClass('deleometer-test-failed');
            }

            const nameEl = resultEl.createEl('div', { cls: 'deleometer-test-result-name', text: result.name });

            // Add details if available
            if (result.message || result.error) {
                const detailsEl = resultEl.createEl('div', { cls: 'deleometer-test-result-details' });

                if (result.message) {
                    detailsEl.createEl('div', { cls: 'deleometer-test-result-message', text: result.message });
                }

                if (result.error) {
                    detailsEl.createEl('div', { cls: 'deleometer-test-result-error', text: `Error: ${result.error}` });
                }
            }
        }
    }

    /**
     * Renders unit test results
     * @param containerEl The container element
     */
    private renderUnitResults(containerEl: HTMLElement): void {
        if (!this.unitResults) {
            return;
        }

        const { passed, failed, skipped, total, componentResults } = this.unitResults;

        // Add summary
        const summaryEl = containerEl.createEl('div', { cls: 'deleometer-test-summary' });

        const totalEl = summaryEl.createEl('div', { cls: 'deleometer-test-stat' });
        totalEl.createEl('div', { cls: 'deleometer-test-stat-value', text: total.toString() });
        totalEl.createEl('div', { cls: 'deleometer-test-stat-label', text: 'Total' });

        const passedEl = summaryEl.createEl('div', { cls: 'deleometer-test-stat deleometer-test-passed' });
        passedEl.createEl('div', { cls: 'deleometer-test-stat-value', text: passed.toString() });
        passedEl.createEl('div', { cls: 'deleometer-test-stat-label', text: 'Passed' });

        const failedEl = summaryEl.createEl('div', { cls: 'deleometer-test-stat deleometer-test-failed' });
        failedEl.createEl('div', { cls: 'deleometer-test-stat-value', text: failed.toString() });
        failedEl.createEl('div', { cls: 'deleometer-test-stat-label', text: 'Failed' });

        const skippedEl = summaryEl.createEl('div', { cls: 'deleometer-test-stat deleometer-test-skipped' });
        skippedEl.createEl('div', { cls: 'deleometer-test-stat-value', text: skipped.toString() });
        skippedEl.createEl('div', { cls: 'deleometer-test-stat-label', text: 'Skipped' });

        // Add component results
        const componentsEl = containerEl.createEl('div', { cls: 'deleometer-test-components' });

        for (const [component, results] of Object.entries(componentResults)) {
            const componentEl = componentsEl.createEl('div', { cls: 'deleometer-test-component' });

            // Add component header
            const headerEl = componentEl.createEl('div', { cls: 'deleometer-test-component-header' });
            headerEl.createEl('h3', { text: component });

            // Add component stats
            const passedCount = results.filter(r => r.passed && !r.skipped).length;
            const failedCount = results.filter(r => !r.passed).length;
            const skippedCount = results.filter(r => r.skipped).length;

            const statsEl = headerEl.createEl('div', { cls: 'deleometer-test-component-stats' });
            statsEl.createEl('span', { cls: 'deleometer-test-passed', text: `${passedCount} passed` });
            statsEl.createEl('span', { cls: 'deleometer-test-failed', text: `${failedCount} failed` });
            statsEl.createEl('span', { cls: 'deleometer-test-skipped', text: `${skippedCount} skipped` });

            // Add component results
            const resultsEl = componentEl.createEl('div', { cls: 'deleometer-test-results' });

            for (const result of results) {
                const resultEl = resultsEl.createEl('div', { cls: 'deleometer-test-result' });

                const statusEl = resultEl.createEl('div', { cls: 'deleometer-test-result-status' });
                if (result.skipped) {
                    statusEl.setText('⏭️');
                    statusEl.addClass('deleometer-test-skipped');
                } else if (result.passed) {
                    statusEl.setText('✅');
                    statusEl.addClass('deleometer-test-passed');
                } else {
                    statusEl.setText('❌');
                    statusEl.addClass('deleometer-test-failed');
                }

                const nameEl = resultEl.createEl('div', { cls: 'deleometer-test-result-name', text: result.name });

                // Add details if available
                if (result.message || result.error) {
                    const detailsEl = resultEl.createEl('div', { cls: 'deleometer-test-result-details' });

                    if (result.message) {
                        detailsEl.createEl('div', { cls: 'deleometer-test-result-message', text: result.message });
                    }

                    if (result.error) {
                        detailsEl.createEl('div', { cls: 'deleometer-test-result-error', text: `Error: ${result.error}` });
                    }
                }
            }
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
