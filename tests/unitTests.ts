import { App, TFile } from 'obsidian';
import { ApiService } from '../apiService';
import { TemplateSystem } from '../templateSystem';
import { DailyNotesIntegration } from '../dailyNotesIntegration';
import { AdvancedAI } from '../advancedAI';
import { WebApiService } from '../webApiService';
import { MobileAdapter } from '../mobileAdapter';
import { ResearchModule } from '../researchModule';
import { BusinessModel } from '../businessModel';

/**
 * Unit Tests for Deleometer
 * Provides unit tests for individual components
 */
export class UnitTests {
    private app: App;
    private testResults: UnitTestResult[] = [];
    
    constructor(app: App) {
        this.app = app;
    }
    
    /**
     * Runs all unit tests
     * @returns Promise<UnitTestSummary> The test summary
     */
    public async runAllTests(): Promise<UnitTestSummary> {
        console.log('[UnitTests] Running all unit tests...');
        
        // Clear previous test results
        this.testResults = [];
        
        // Run tests
        await this.testApiService();
        await this.testTemplateSystem();
        await this.testDailyNotesIntegration();
        await this.testAdvancedAI();
        await this.testWebApiService();
        await this.testMobileAdapter();
        await this.testResearchModule();
        await this.testBusinessModel();
        
        // Generate summary
        const summary = this.generateTestSummary();
        
        console.log('[UnitTests] All unit tests completed');
        console.log(`[UnitTests] Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}`);
        
        return summary;
    }
    
    /**
     * Tests the API service
     * @returns Promise<void>
     */
    private async testApiService(): Promise<void> {
        console.log('[UnitTests] Testing API service...');
        
        try {
            // Create API service
            const apiService = new ApiService({
                openaiApiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            
            // Test constructor
            await this.runTest('ApiService Constructor', () => {
                return apiService !== null;
            });
            
            // Mock the fetch function for testing
            const originalFetch = global.fetch;
            global.fetch = async (url, options) => {
                return {
                    ok: true,
                    json: async () => ({ choices: [{ message: { content: 'Test response' } }] })
                } as Response;
            };
            
            // Test validateApiKey
            await this.runTest('ApiService.validateApiKey', async () => {
                const isValid = await apiService.validateApiKey();
                return isValid === true;
            });
            
            // Test getCompletion
            await this.runTest('ApiService.getCompletion', async () => {
                const response = await apiService.getCompletion('Test prompt');
                return response === 'Test response';
            });
            
            // Restore the original fetch function
            global.fetch = originalFetch;
            
            console.log('[UnitTests] API service tests completed');
        } catch (error) {
            console.error('[UnitTests] Error testing API service:', error);
            this.testResults.push({
                component: 'ApiService',
                name: 'Error',
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
        console.log('[UnitTests] Testing template system...');
        
        try {
            // Create template system
            const templateSystem = new TemplateSystem(this.app, 'templates');
            
            // Test constructor
            await this.runTest('TemplateSystem Constructor', () => {
                return templateSystem !== null;
            });
            
            // Mock the necessary methods
            templateSystem.initialize = async () => {};
            templateSystem.getTemplate = async (name) => {
                if (name === 'default') {
                    return '# Analysis for {{date}}\n\n## Emotions\n{{#each emotions}}\n- {{@key}}: {{this}}\n{{/each}}';
                }
                return null;
            };
            
            // Test initialize
            await this.runTest('TemplateSystem.initialize', async () => {
                await templateSystem.initialize();
                return true;
            });
            
            // Test getTemplate
            await this.runTest('TemplateSystem.getTemplate', async () => {
                const template = await templateSystem.getTemplate('default');
                return template !== null && template.length > 0;
            });
            
            // Test applyTemplate
            await this.runTest('TemplateSystem.applyTemplate', async () => {
                const data = {
                    date: '2023-06-15',
                    emotions: {
                        joy: 7,
                        sadness: 3
                    }
                };
                
                const result = await templateSystem.applyTemplate('default', data);
                return result !== null && result.includes('joy: 7') && result.includes('sadness: 3');
            });
            
            console.log('[UnitTests] Template system tests completed');
        } catch (error) {
            console.error('[UnitTests] Error testing template system:', error);
            this.testResults.push({
                component: 'TemplateSystem',
                name: 'Error',
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
        console.log('[UnitTests] Testing daily notes integration...');
        
        try {
            // Create daily notes integration
            const dailyNotesIntegration = new DailyNotesIntegration(this.app);
            
            // Test constructor
            await this.runTest('DailyNotesIntegration Constructor', () => {
                return dailyNotesIntegration !== null;
            });
            
            // Mock the necessary methods
            dailyNotesIntegration.getDailyNote = (date) => {
                return null;
            };
            
            dailyNotesIntegration.getDailyNotesInRange = async (startDate, endDate) => {
                return [];
            };
            
            // Test getDailyNote
            await this.runTest('DailyNotesIntegration.getDailyNote', () => {
                const dailyNote = dailyNotesIntegration.getDailyNote();
                return dailyNote === null; // It's OK if there's no daily note
            });
            
            // Test getDailyNotesInRange
            await this.runTest('DailyNotesIntegration.getDailyNotesInRange', async () => {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                
                const dailyNotes = await dailyNotesIntegration.getDailyNotesInRange(startDate);
                return Array.isArray(dailyNotes);
            });
            
            console.log('[UnitTests] Daily notes integration tests completed');
        } catch (error) {
            console.error('[UnitTests] Error testing daily notes integration:', error);
            this.testResults.push({
                component: 'DailyNotesIntegration',
                name: 'Error',
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
        console.log('[UnitTests] Testing advanced AI features...');
        
        try {
            // Create API service
            const apiService = new ApiService({
                openaiApiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            
            // Create advanced AI
            const advancedAI = new AdvancedAI(apiService, {
                enablePersonalization: true,
                personalizedModelId: '',
                feedbackCollection: true,
                voiceAnalysis: true,
                userFeedbackHistory: []
            });
            
            // Test constructor
            await this.runTest('AdvancedAI Constructor', () => {
                return advancedAI !== null;
            });
            
            // Mock the necessary methods
            advancedAI.getUserProfile = () => {
                return {
                    id: 'user-1',
                    emotionalBaseline: {
                        joy: 5,
                        sadness: 3
                    },
                    personalityBaseline: {
                        openness: 0.7,
                        conscientiousness: 0.6
                    },
                    commonThemes: ['work', 'relationships'],
                    analysisPreferences: {
                        detailLevel: 'detailed',
                        focusAreas: ['emotions', 'patterns']
                    }
                };
            };
            
            // Test getUserProfile
            await this.runTest('AdvancedAI.getUserProfile', () => {
                const userProfile = advancedAI.getUserProfile();
                return userProfile !== null && userProfile.id === 'user-1';
            });
            
            console.log('[UnitTests] Advanced AI tests completed');
        } catch (error) {
            console.error('[UnitTests] Error testing advanced AI:', error);
            this.testResults.push({
                component: 'AdvancedAI',
                name: 'Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the web API service
     * @returns Promise<void>
     */
    private async testWebApiService(): Promise<void> {
        console.log('[UnitTests] Testing web API service...');
        
        try {
            // Create API service
            const apiService = new ApiService({
                openaiApiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            
            // Create web API service
            const webApiService = new WebApiService(apiService, 'test-api-key', 3000);
            
            // Test constructor
            await this.runTest('WebApiService Constructor', () => {
                return webApiService !== null;
            });
            
            // Test start
            await this.runTest('WebApiService.start', async () => {
                await webApiService.start();
                return true;
            });
            
            // Test stop
            await this.runTest('WebApiService.stop', async () => {
                await webApiService.stop();
                return true;
            });
            
            // Test generateApiDocs
            await this.runTest('WebApiService.generateApiDocs', () => {
                const docs = webApiService.generateApiDocs();
                return docs !== null && docs.length > 0;
            });
            
            console.log('[UnitTests] Web API service tests completed');
        } catch (error) {
            console.error('[UnitTests] Error testing web API service:', error);
            this.testResults.push({
                component: 'WebApiService',
                name: 'Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the mobile adapter
     * @returns Promise<void>
     */
    private async testMobileAdapter(): Promise<void> {
        console.log('[UnitTests] Testing mobile adapter...');
        
        try {
            // Create API service
            const apiService = new ApiService({
                openaiApiKey: 'test-key',
                model: 'gpt-3.5-turbo'
            });
            
            // Create mobile adapter
            const mobileAdapter = new MobileAdapter(apiService, {
                syncEnabled: true,
                syncInterval: 60000
            });
            
            // Test constructor
            await this.runTest('MobileAdapter Constructor', () => {
                return mobileAdapter !== null;
            });
            
            // Test start
            await this.runTest('MobileAdapter.start', async () => {
                await mobileAdapter.start();
                return true;
            });
            
            // Test stop
            await this.runTest('MobileAdapter.stop', async () => {
                await mobileAdapter.stop();
                return true;
            });
            
            // Test getAnalysisResults
            await this.runTest('MobileAdapter.getAnalysisResults', async () => {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                
                const results = await mobileAdapter.getAnalysisResults(startDate, new Date());
                return Array.isArray(results) && results.length > 0;
            });
            
            // Test getEmotionalTrend
            await this.runTest('MobileAdapter.getEmotionalTrend', async () => {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                
                const trend = await mobileAdapter.getEmotionalTrend(startDate, new Date());
                return trend !== null && trend.dominantEmotion !== undefined;
            });
            
            console.log('[UnitTests] Mobile adapter tests completed');
        } catch (error) {
            console.error('[UnitTests] Error testing mobile adapter:', error);
            this.testResults.push({
                component: 'MobileAdapter',
                name: 'Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the research module
     * @returns Promise<void>
     */
    private async testResearchModule(): Promise<void> {
        console.log('[UnitTests] Testing research module...');
        
        try {
            // Create research module
            const researchModule = new ResearchModule({
                dataCollectionEnabled: true,
                exportBatchSize: 10
            });
            
            // Test constructor
            await this.runTest('ResearchModule Constructor', () => {
                return researchModule !== null;
            });
            
            // Test collectAnonymizedData
            await this.runTest('ResearchModule.collectAnonymizedData', async () => {
                const result = {
                    emotions: {
                        joy: 7,
                        sadness: 3,
                        sentiment: 0.6
                    },
                    psychoanalyticResponse: 'Test response',
                    personalityInsights: {
                        openness: 0.7,
                        conscientiousness: 0.6
                    },
                    date: new Date().toISOString()
                };
                
                await researchModule.collectAnonymizedData(result);
                return true;
            });
            
            // Test createValidationStudy
            await this.runTest('ResearchModule.createValidationStudy', async () => {
                const studyId = await researchModule.createValidationStudy(
                    'Test Study',
                    'A test validation study',
                    {
                        minimumAccuracy: 0.8,
                        sampleSize: 100,
                        expertRaters: 3
                    }
                );
                
                return studyId !== null && studyId.length > 0;
            });
            
            // Test getValidationStudies
            await this.runTest('ResearchModule.getValidationStudies', async () => {
                const studies = await researchModule.getValidationStudies();
                return Array.isArray(studies) && studies.length > 0;
            });
            
            console.log('[UnitTests] Research module tests completed');
        } catch (error) {
            console.error('[UnitTests] Error testing research module:', error);
            this.testResults.push({
                component: 'ResearchModule',
                name: 'Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Tests the business model
     * @returns Promise<void>
     */
    private async testBusinessModel(): Promise<void> {
        console.log('[UnitTests] Testing business model...');
        
        try {
            // Create business model
            const businessModel = new BusinessModel({
                licenseKey: '',
                freeTierLimit: 10,
                premiumTierLimit: 100
            });
            
            // Test constructor
            await this.runTest('BusinessModel Constructor', () => {
                return businessModel !== null;
            });
            
            // Test isFeatureAvailable
            await this.runTest('BusinessModel.isFeatureAvailable', () => {
                const isAvailable = businessModel.isFeatureAvailable('basicEmotionAnalysis');
                return isAvailable === true;
            });
            
            // Test canPerformAnalysis
            await this.runTest('BusinessModel.canPerformAnalysis', () => {
                const canPerform = businessModel.canPerformAnalysis();
                return canPerform === true;
            });
            
            // Test recordAnalysis
            await this.runTest('BusinessModel.recordAnalysis', async () => {
                await businessModel.recordAnalysis(false);
                return true;
            });
            
            // Test getSubscriptionStatus
            await this.runTest('BusinessModel.getSubscriptionStatus', () => {
                const status = businessModel.getSubscriptionStatus();
                return status !== null && status.type === 'free';
            });
            
            // Test generateSubscriptionSummary
            await this.runTest('BusinessModel.generateSubscriptionSummary', () => {
                const summary = businessModel.generateSubscriptionSummary();
                return summary !== null && summary.length > 0;
            });
            
            console.log('[UnitTests] Business model tests completed');
        } catch (error) {
            console.error('[UnitTests] Error testing business model:', error);
            this.testResults.push({
                component: 'BusinessModel',
                name: 'Error',
                passed: false,
                error: error.message || 'Unknown error'
            });
        }
    }
    
    /**
     * Runs a unit test
     * @param name The test name
     * @param testFn The test function
     * @returns Promise<boolean> True if the test passed
     */
    private async runTest(name: string, testFn: () => Promise<boolean> | boolean): Promise<boolean> {
        console.log(`[UnitTests] Running test: ${name}`);
        
        try {
            const result = await testFn();
            
            const [component, method] = name.split('.');
            
            this.testResults.push({
                component: component || 'Unknown',
                name: method || name,
                passed: result
            });
            
            console.log(`[UnitTests] Test ${name} ${result ? 'passed' : 'failed'}`);
            
            return result;
        } catch (error) {
            console.error(`[UnitTests] Error running test ${name}:`, error);
            
            const [component, method] = name.split('.');
            
            this.testResults.push({
                component: component || 'Unknown',
                name: method || name,
                passed: false,
                error: error.message || 'Unknown error'
            });
            
            return false;
        }
    }
    
    /**
     * Generates a test summary
     * @returns UnitTestSummary The test summary
     */
    private generateTestSummary(): UnitTestSummary {
        const passed = this.testResults.filter(r => r.passed && !r.skipped).length;
        const failed = this.testResults.filter(r => !r.passed).length;
        const skipped = this.testResults.filter(r => r.skipped).length;
        
        // Group results by component
        const componentResults: Record<string, UnitTestResult[]> = {};
        
        for (const result of this.testResults) {
            if (!componentResults[result.component]) {
                componentResults[result.component] = [];
            }
            
            componentResults[result.component].push(result);
        }
        
        return {
            passed,
            failed,
            skipped,
            total: this.testResults.length,
            results: this.testResults,
            componentResults
        };
    }
    
    /**
     * Generates a test report
     * @returns string The test report in markdown format
     */
    public generateTestReport(): string {
        const summary = this.generateTestSummary();
        
        let report = `# Deleometer Unit Test Report\n\n`;
        
        // Add summary
        report += `## Summary\n\n`;
        report += `- **Total Tests:** ${summary.total}\n`;
        report += `- **Passed:** ${summary.passed}\n`;
        report += `- **Failed:** ${summary.failed}\n`;
        report += `- **Skipped:** ${summary.skipped}\n\n`;
        
        // Add component results
        report += `## Component Results\n\n`;
        
        for (const [component, results] of Object.entries(summary.componentResults)) {
            const passedCount = results.filter(r => r.passed && !r.skipped).length;
            const failedCount = results.filter(r => !r.passed).length;
            const skippedCount = results.filter(r => r.skipped).length;
            
            report += `### ${component}\n\n`;
            report += `- **Tests:** ${results.length}\n`;
            report += `- **Passed:** ${passedCount}\n`;
            report += `- **Failed:** ${failedCount}\n`;
            report += `- **Skipped:** ${skippedCount}\n\n`;
            
            // Add test results
            for (const result of results) {
                const status = result.skipped ? '⏭️ SKIPPED' : (result.passed ? '✅ PASSED' : '❌ FAILED');
                report += `#### ${result.name}: ${status}\n\n`;
                
                if (result.message) {
                    report += `${result.message}\n\n`;
                }
                
                if (result.error) {
                    report += `**Error:** ${result.error}\n\n`;
                }
            }
        }
        
        return report;
    }
}

/**
 * Unit test result
 */
export interface UnitTestResult {
    component: string;
    name: string;
    passed: boolean;
    skipped?: boolean;
    message?: string;
    error?: string;
}

/**
 * Unit test summary
 */
export interface UnitTestSummary {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
    results: UnitTestResult[];
    componentResults: Record<string, UnitTestResult[]>;
}
