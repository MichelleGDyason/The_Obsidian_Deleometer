import { App } from 'obsidian';
import { JournalingPrompts, PromptCategory } from '../journalingPrompts';
import { ApiService } from '../apiService';
import { UserProfileSystem } from '../userProfileSystem';

/**
 * Test class for JournalingPrompts
 */
export class JournalingPromptsTest {
    private app: App;
    private journalingPrompts: JournalingPrompts;
    private apiService: ApiService;
    private userProfileSystem: UserProfileSystem;
    
    constructor(app: App) {
        this.app = app;
        this.apiService = new ApiService();
        this.journalingPrompts = new JournalingPrompts(this.apiService);
        this.userProfileSystem = new UserProfileSystem(this.app);
    }
    
    /**
     * Run all tests
     */
    public async runTests(): Promise<void> {
        console.log('Running JournalingPrompts tests...');
        
        try {
            await this.testGetPrompts();
            await this.testGetPromptsWithCategory();
            await this.testGetPromptsWithUserProfile();
            
            console.log('All JournalingPrompts tests passed!');
        } catch (error) {
            console.error('JournalingPrompts tests failed:', error);
        }
    }
    
    /**
     * Test getting prompts
     */
    private async testGetPrompts(): Promise<void> {
        console.log('Testing get prompts...');
        
        try {
            // Get prompts
            const promptSet = await this.journalingPrompts.getPrompts();
            
            // Check that the prompt set is not null
            if (!promptSet) {
                throw new Error('Prompt set is null');
            }
            
            // Check that the prompt set has prompts
            if (!promptSet.prompts || promptSet.prompts.length === 0) {
                throw new Error('Prompt set has no prompts');
            }
            
            console.log('Get prompts test passed!');
        } catch (error) {
            console.error('Get prompts test failed:', error);
            throw error;
        }
    }
    
    /**
     * Test getting prompts with a category
     */
    private async testGetPromptsWithCategory(): Promise<void> {
        console.log('Testing get prompts with category...');
        
        try {
            // Get prompts with a category
            const category: PromptCategory = 'self-reflection';
            const promptSet = await this.journalingPrompts.getPrompts(category);
            
            // Check that the prompt set is not null
            if (!promptSet) {
                throw new Error('Prompt set is null');
            }
            
            // Check that the prompt set has prompts
            if (!promptSet.prompts || promptSet.prompts.length === 0) {
                throw new Error('Prompt set has no prompts');
            }
            
            // Check that all prompts have the correct category
            const invalidPrompts = promptSet.prompts.filter(prompt => prompt.category !== category);
            if (invalidPrompts.length > 0) {
                throw new Error(`${invalidPrompts.length} prompts have incorrect category`);
            }
            
            console.log('Get prompts with category test passed!');
        } catch (error) {
            console.error('Get prompts with category test failed:', error);
            throw error;
        }
    }
    
    /**
     * Test getting prompts with a user profile
     */
    private async testGetPromptsWithUserProfile(): Promise<void> {
        console.log('Testing get prompts with user profile...');
        
        try {
            // Initialize the user profile system
            await this.userProfileSystem.initialize();
            
            // Get the user profile
            const userProfile = this.userProfileSystem.getUserProfile();
            
            // Get prompts with a user profile
            const promptSet = await this.journalingPrompts.getPrompts(undefined, userProfile);
            
            // Check that the prompt set is not null
            if (!promptSet) {
                throw new Error('Prompt set is null');
            }
            
            // Check that the prompt set has prompts
            if (!promptSet.prompts || promptSet.prompts.length === 0) {
                throw new Error('Prompt set has no prompts');
            }
            
            // Check that the prompt set has a recommended prompt if the user profile is not null
            if (userProfile && !promptSet.recommendedPrompt) {
                throw new Error('Prompt set has no recommended prompt');
            }
            
            console.log('Get prompts with user profile test passed!');
        } catch (error) {
            console.error('Get prompts with user profile test failed:', error);
            throw error;
        }
    }
}
