import { App, TFile, TFolder } from 'obsidian';
import { AnalysisScope } from '../analysisScope';
import { EnhancedAnalysisFrameworks } from '../enhancedAnalysisFrameworks';
import { UserProfileSystem } from '../userProfileSystem';
import { ApiService } from '../apiService';

/**
 * Test class for AnalysisScope
 */
export class AnalysisScopeTest {
    private app: App;
    private analysisScope: AnalysisScope;
    private enhancedAnalysisFrameworks: EnhancedAnalysisFrameworks;
    private userProfileSystem: UserProfileSystem;
    private apiService: ApiService;
    
    constructor(app: App) {
        this.app = app;
        this.apiService = new ApiService();
        this.enhancedAnalysisFrameworks = new EnhancedAnalysisFrameworks(this.apiService);
        this.userProfileSystem = new UserProfileSystem(this.app);
        this.analysisScope = new AnalysisScope(
            this.app,
            this.enhancedAnalysisFrameworks,
            this.userProfileSystem
        );
    }
    
    /**
     * Run all tests
     */
    public async runTests(): Promise<void> {
        console.log('Running AnalysisScope tests...');
        
        try {
            await this.testAnalyzeCurrentNote();
            await this.testAnalyzeFile();
            await this.testAnalyzeFolder();
            await this.testAnalyzeMultipleFiles();
            await this.testAnalyzeMultipleFolders();
            
            console.log('All AnalysisScope tests passed!');
        } catch (error) {
            console.error('AnalysisScope tests failed:', error);
        }
    }
    
    /**
     * Test analyzing the current note
     */
    private async testAnalyzeCurrentNote(): Promise<void> {
        console.log('Testing analyze current note...');
        
        try {
            // Get the active file
            const activeFile = this.app.workspace.getActiveFile();
            
            if (!activeFile) {
                console.warn('No active file, skipping test');
                return;
            }
            
            // Analyze the current note
            const result = await this.analysisScope.analyze('note', '', {
                includeFreudian: true,
                detailLevel: 'basic'
            });
            
            // Check that the result is not null
            if (!result) {
                throw new Error('Result is null');
            }
            
            console.log('Analyze current note test passed!');
        } catch (error) {
            console.error('Analyze current note test failed:', error);
            throw error;
        }
    }
    
    /**
     * Test analyzing a specific file
     */
    private async testAnalyzeFile(): Promise<void> {
        console.log('Testing analyze file...');
        
        try {
            // Get a markdown file
            const files = this.app.vault.getMarkdownFiles();
            
            if (files.length === 0) {
                console.warn('No markdown files, skipping test');
                return;
            }
            
            // Analyze the file
            const result = await this.analysisScope.analyze('file', files[0].path, {
                includeFreudian: true,
                detailLevel: 'basic'
            });
            
            // Check that the result is not null
            if (!result) {
                throw new Error('Result is null');
            }
            
            console.log('Analyze file test passed!');
        } catch (error) {
            console.error('Analyze file test failed:', error);
            throw error;
        }
    }
    
    /**
     * Test analyzing a folder
     */
    private async testAnalyzeFolder(): Promise<void> {
        console.log('Testing analyze folder...');
        
        try {
            // Get the root folder
            const rootFolder = this.app.vault.getRoot();
            
            // Analyze the folder
            const result = await this.analysisScope.analyze('folder', rootFolder.path, {
                includeFreudian: true,
                detailLevel: 'basic',
                maxEntries: 5
            });
            
            // Check that the result is not null
            if (!result) {
                throw new Error('Result is null');
            }
            
            console.log('Analyze folder test passed!');
        } catch (error) {
            console.error('Analyze folder test failed:', error);
            throw error;
        }
    }
    
    /**
     * Test analyzing multiple files
     */
    private async testAnalyzeMultipleFiles(): Promise<void> {
        console.log('Testing analyze multiple files...');
        
        try {
            // Get markdown files
            const files = this.app.vault.getMarkdownFiles();
            
            if (files.length < 2) {
                console.warn('Not enough markdown files, skipping test');
                return;
            }
            
            // Get the first two files
            const filePaths = files.slice(0, 2).map(file => file.path);
            
            // Analyze the files
            const result = await this.analysisScope.analyzeMultipleFiles(filePaths, {
                includeFreudian: true,
                detailLevel: 'basic'
            });
            
            // Check that the result is not null
            if (!result) {
                throw new Error('Result is null');
            }
            
            // Check that the result has the correct number of individual results
            if (result.individualResults.length !== filePaths.length) {
                throw new Error(`Expected ${filePaths.length} individual results, got ${result.individualResults.length}`);
            }
            
            console.log('Analyze multiple files test passed!');
        } catch (error) {
            console.error('Analyze multiple files test failed:', error);
            throw error;
        }
    }
    
    /**
     * Test analyzing multiple folders
     */
    private async testAnalyzeMultipleFolders(): Promise<void> {
        console.log('Testing analyze multiple folders...');
        
        try {
            // Get all folders
            const rootFolder = this.app.vault.getRoot();
            const folders: TFolder[] = [];
            
            // Get the first level folders
            rootFolder.children.forEach(child => {
                if (child instanceof TFolder) {
                    folders.push(child);
                }
            });
            
            if (folders.length < 2) {
                console.warn('Not enough folders, skipping test');
                return;
            }
            
            // Get the first two folders
            const folderPaths = folders.slice(0, 2).map(folder => folder.path);
            
            // Analyze the folders
            const result = await this.analysisScope.analyzeMultipleFolders(folderPaths, {
                includeFreudian: true,
                detailLevel: 'basic',
                maxEntries: 5
            });
            
            // Check that the result is not null
            if (!result) {
                throw new Error('Result is null');
            }
            
            console.log('Analyze multiple folders test passed!');
        } catch (error) {
            console.error('Analyze multiple folders test failed:', error);
            throw error;
        }
    }
}
