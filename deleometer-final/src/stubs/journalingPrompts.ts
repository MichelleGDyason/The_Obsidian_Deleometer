// Stub file for journalingPrompts.ts
import { ApiService } from './apiService';

export class JournalingPrompts {
    apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    async getPrompt(category?: string): Promise<string> {
        console.log(`JournalingPrompts.getPrompt(${category}) called but not implemented`);
        return "What insights did you gain today that surprised you?";
    }
    
    async getPromptCategories(): Promise<string[]> {
        console.log("JournalingPrompts.getPromptCategories() called but not implemented");
        return ["reflection", "growth", "creativity", "relationships", "goals"];
    }
}
