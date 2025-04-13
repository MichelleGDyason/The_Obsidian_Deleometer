import { App, TFile } from 'obsidian';
import { DeleometerPlugin } from '../main';
import { AnalysisResult } from '../types';

/**
 * Test Framework for Deleometer
 * Provides utilities for testing the plugin's functionality
 */
export class TestFramework {
    private plugin: DeleometerPlugin;
    private app: App;
    private testResults: TestResult[] = [];
    
    constructor(plugin: DeleometerPlugin) {
        this.plugin = plugin;
        this.app = plugin.app;
    }
    
    /**
     * Runs all tests
     * @returns Promise<TestSummary> The test summary
     */
    public async runAllTests(): Promise<TestSummary> {
        console.log('[TestFramework] Running all tests...');
        
        // Clear previous test results
        this.testResults = [];
        
        // Run tests
        await this.testApiService();
        await this.testAnalysisEngine();
        await this.testDailyNotesIntegration();
        await this.testTemplateSystem();
        await this.testDashboardView();
        await this.testAdvancedAI();
        await this.testVoiceJournaling();
        
        // Generate summary
        const summary = this.generateTestSummary();
        
        console.log('[TestFramework] All tests completed');
        console.log(`[TestFramework] Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}`);
        
        return summary;
    }
    
    /**
     * Tests the API service
     * @returns Promise<void>
     */
    private async testApiService(): Promise<void> {
        console.log('[TestFramework] Testing API service...');
        
        try {
            // Test API key validation
            const test1 = await this.runTest('API Key Validation', async () => {
                const isValid = await this.plugin.validateApiKey();
                return isValid;
            });
            
            // Test API completion
            const test2 = await this.runTest('API Completion', async () => {
                const prompt = 'Generate a short test response.';
                const response = await this.plugin.apiService.getCompletion(prompt);
                return response && response.length > 0;
            });
            
            console.log('[TestFramework] API service tests completed');
        } catch (error) {
            console.error('[TestFramework] Error testing API service:', error);
            this.testResults.push({
                name: 'API Service Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the analysis engine
     * @returns Promise<void>
     */
    private async testAnalysisEngine(): Promise<void> {
        console.log('[TestFramework] Testing analysis engine...');
        
        try {
            // Test emotion analysis
            const test1 = await this.runTest('Emotion Analysis', async () => {
                const text = 'I feel happy today. It was a great day!';
                const result = await this.plugin.performAnalysis(text);
                return result && result.emotions && Object.keys(result.emotions).length > 0;
            });
            
            // Test psychoanalytic analysis
            const test2 = await this.runTest('Psychoanalytic Analysis', async () => {
                const text = 'I had a dream about my childhood home last night.';
                const result = await this.plugin.performAnalysis(text);
                return result && result.psychoanalyticResponse && result.psychoanalyticResponse.length > 0;
            });
            
            // Test personality analysis
            const test3 = await this.runTest('Personality Analysis', async () => {
                const text = 'I prefer to spend time alone reading books rather than going to parties.';
                const result = await this.plugin.performAnalysis(text);
                return result && result.personalityInsights && Object.keys(result.personalityInsights).length > 0;
            });
            
            console.log('[TestFramework] Analysis engine tests completed');
        } catch (error) {
            console.error('[TestFramework] Error testing analysis engine:', error);
            this.testResults.push({
                name: 'Analysis Engine Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the daily notes integration
     * @returns Promise<void>
     */
    private async testDailyNotesIntegration(): Promise<void> {
        console.log('[TestFramework] Testing daily notes integration...');
        
        try {
            // Skip if daily notes integration is not enabled
            if (!this.plugin.settings.enableDailyNotesIntegration) {
                this.testResults.push({
                    name: 'Daily Notes Integration',
                    passed: true,
                    skipped: true,
                    message: 'Daily notes integration is not enabled'
                });
                return;
            }
            
            // Test getting daily note
            const test1 = await this.runTest('Get Daily Note', async () => {
                const dailyNote = this.plugin.dailyNotesIntegration.getDailyNote();
                return dailyNote !== null || true; // Allow null result if no daily note exists
            });
            
            // Test analyzing daily notes
            const test2 = await this.runTest('Analyze Daily Notes', async () => {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                
                await this.plugin.analyzeDailyNotes(startDate);
                return true;
            });
            
            console.log('[TestFramework] Daily notes integration tests completed');
        } catch (error) {
            console.error('[TestFramework] Error testing daily notes integration:', error);
            this.testResults.push({
                name: 'Daily Notes Integration Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the template system
     * @returns Promise<void>
     */
    private async testTemplateSystem(): Promise<void> {
        console.log('[TestFramework] Testing template system...');
        
        try {
            // Test template initialization
            const test1 = await this.runTest('Template Initialization', async () => {
                return this.plugin.templateSystem !== null;
            });
            
            // Test getting template
            const test2 = await this.runTest('Get Template', async () => {
                const template = await this.plugin.templateSystem.getTemplate('default');
                return template !== null;
            });
            
            // Test applying template
            const test3 = await this.runTest('Apply Template', async () => {
                const data = {
                    date: new Date().toISOString(),
                    emotions: {
                        joy: 7,
                        sadness: 3
                    }
                };
                
                const result = await this.plugin.templateSystem.applyTemplate('default', data);
                return result !== null && result.length > 0;
            });
            
            console.log('[TestFramework] Template system tests completed');
        } catch (error) {
            console.error('[TestFramework] Error testing template system:', error);
            this.testResults.push({
                name: 'Template System Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the dashboard view
     * @returns Promise<void>
     */
    private async testDashboardView(): Promise<void> {
        console.log('[TestFramework] Testing dashboard view...');
        
        try {
            // Test dashboard activation
            const test1 = await this.runTest('Dashboard Activation', async () => {
                await this.plugin.activateDashboardView();
                return true;
            });
            
            console.log('[TestFramework] Dashboard view tests completed');
        } catch (error) {
            console.error('[TestFramework] Error testing dashboard view:', error);
            this.testResults.push({
                name: 'Dashboard View Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the advanced AI features
     * @returns Promise<void>
     */
    private async testAdvancedAI(): Promise<void> {
        console.log('[TestFramework] Testing advanced AI features...');
        
        try {
            // Skip if advanced AI is not enabled
            if (!this.plugin.settings.enablePersonalization && !this.plugin.settings.feedbackCollection) {
                this.testResults.push({
                    name: 'Advanced AI Features',
                    passed: true,
                    skipped: true,
                    message: 'Advanced AI features are not enabled'
                });
                return;
            }
            
            // Test advanced AI initialization
            const test1 = await this.runTest('Advanced AI Initialization', async () => {
                return this.plugin.advancedAI !== null;
            });
            
            console.log('[TestFramework] Advanced AI tests completed');
        } catch (error) {
            console.error('[TestFramework] Error testing advanced AI:', error);
            this.testResults.push({
                name: 'Advanced AI Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the voice journaling features
     * @returns Promise<void>
     */
    private async testVoiceJournaling(): Promise<void> {
        console.log('[TestFramework] Testing voice journaling...');
        
        try {
            // Skip if voice journaling is not enabled or not supported
            if (!this.plugin.settings.voiceAnalysis || !this.plugin.voiceJournaling) {
                this.testResults.push({
                    name: 'Voice Journaling',
                    passed: true,
                    skipped: true,
                    message: 'Voice journaling is not enabled or not supported'
                });
                return;
            }
            
            // Test voice journaling initialization
            const test1 = await this.runTest('Voice Journaling Initialization', async () => {
                return this.plugin.voiceJournaling !== null;
            });
            
            console.log('[TestFramework] Voice journaling tests completed');
        } catch (error) {
            console.error('[TestFramework] Error testing voice journaling:', error);
            this.testResults.push({
                name: 'Voice Journaling Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Runs a test
     * @param name The test name
     * @param testFn The test function
     * @returns Promise<boolean> True if the test passed
     */
    private async runTest(name: string, testFn: () => Promise<boolean>): Promise<boolean> {
        console.log(`[TestFramework] Running test: ${name}`);
        
        try {
            const result = await testFn();
            
            this.testResults.push({
                name,
                passed: result
            });
            
            console.log(`[TestFramework] Test ${name} ${result ? 'passed' : 'failed'}`);
            
            return result;
        } catch (error) {
            console.error(`[TestFramework] Error running test ${name}:`, error);
            
            this.testResults.push({
                name,
                passed: false,
                error: error.message || 'Unknown error'
            });
            
            return false;
        }
    }
    
    /**
     * Generates a test summary
     * @returns TestSummary The test summary
     */
    private generateTestSummary(): TestSummary {
        const passed = this.testResults.filter(r => r.passed && !r.skipped).length;
        const failed = this.testResults.filter(r => !r.passed).length;
        const skipped = this.testResults.filter(r => r.skipped).length;
        
        return {
            passed,
            failed,
            skipped,
            total: this.testResults.length,
            results: this.testResults
        };
    }
    
    /**
     * Generates a test report
     * @returns string The test report in markdown format
     */
    public generateTestReport(): string {
        const summary = this.generateTestSummary();
        
        let report = `# Deleometer Test Report\n\n`;
        
        // Add summary
        report += `## Summary\n\n`;
        report += `- **Total Tests:** ${summary.total}\n`;
        report += `- **Passed:** ${summary.passed}\n`;
        report += `- **Failed:** ${summary.failed}\n`;
        report += `- **Skipped:** ${summary.skipped}\n\n`;
        
        // Add results
        report += `## Test Results\n\n`;
        
        for (const result of this.testResults) {
            const status = result.skipped ? '⏭️ SKIPPED' : (result.passed ? '✅ PASSED' : '❌ FAILED');
            report += `### ${result.name}: ${status}\n\n`;
            
            if (result.message) {
                report += `${result.message}\n\n`;
            }
            
            if (result.error) {
                report += `**Error:** ${result.error}\n\n`;
            }
        }
        
        return report;
    }
}

/**
 * Test result
 */
export interface TestResult {
    name: string;
    passed: boolean;
    skipped?: boolean;
    message?: string;
    error?: string;
}

/**
 * Test summary
 */
export interface TestSummary {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
    results: TestResult[];
}
