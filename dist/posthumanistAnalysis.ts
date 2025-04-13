import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Posthumanist analysis
 */
export interface PosthumanistAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Human/nonhuman relations
    humanNonhumanRelations: {
        morethanhumanWorld: string;
        speciesEntanglement: string;
        nonhumanAgency: string;
        anthropocentrism: string;
    };
    
    // Technology relations
    technologyRelations: {
        technologicalEmbodiment: string;
        cyborgSubjectivity: string;
        technogenesis: string;
        digitalEntanglement: string[];
    };
    
    // Distributed agency
    distributedAgency: {
        agentialAssemblages: string;
        materialAgency: string;
        distributedCognition: string;
        emergentProperties: string[];
    };
    
    // Ontological boundaries
    ontologicalBoundaries: {
        boundaryDissolution: string;
        hybridIdentities: string[];
        natureculture: string;
        boundaryMaking: string;
    };
    
    // Ethical considerations
    ethicalConsiderations: {
        posthumanEthics: string;
        multispeciesJustice: string;
        technologicalEthics: string;
        futureResponsibilities: string[];
    };
    
    // Affective dimensions
    affectiveDimensions: {
        morethanhumanAffect: string;
        technologicalAffect: string;
        affectiveCapacities: string;
        atmosphericAttunement: string;
    };
    
    // Posthumanist recommendations
    posthumanistRecommendations: string[];
}

/**
 * Provides analysis using Posthumanism
 */
export class PosthumanistAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Posthumanism
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<PosthumanistAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        return analysisResult as PosthumanistAnalysisResult;
    }
    
    /**
     * Create a personalization context based on user profile
     * @param userProfile The user profile
     */
    private createPersonalizationContext(userProfile: UserProfile | null): string {
        if (!userProfile) {
            return '';
        }
        
        let context = '### User Profile Context\n';
        
        // Add emotional baseline
        if (Object.keys(userProfile.emotionalBaseline).length > 0) {
            context += 'Emotional baseline: ';
            const emotions = Object.entries(userProfile.emotionalBaseline)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([emotion, value]) => `${emotion} (${value.toFixed(1)})`);
            context += emotions.join(', ') + '.\n';
        }
        
        // Add common themes
        if (userProfile.commonThemes.length > 0) {
            context += 'Common themes: ' + userProfile.commonThemes.slice(0, 10).join(', ') + '.\n';
        }
        
        // Add recurring patterns
        if (userProfile.recurringPatterns.length > 0) {
            context += 'Recurring patterns: ';
            const patterns = userProfile.recurringPatterns
                .slice(0, 5)
                .map(p => `${p.pattern} (frequency: ${p.frequency})`);
            context += patterns.join(', ') + '.\n';
        }
        
        return context;
    }
    
    /**
     * Create an analysis prompt
     * @param text The text to analyze
     * @param personalizationContext The personalization context
     */
    private createAnalysisPrompt(text: string, personalizationContext: string): string {
        const prompt = `
            # Posthumanist Analysis

            Analyze the following journal entry using Posthumanism (Haraway, Braidotti, Barad, Hayles, etc.).
            Focus on human/nonhuman relations, technology relations, distributed agency, ontological boundaries, ethical considerations, and affective dimensions.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall posthumanist interpretation",
                
                "humanNonhumanRelations": {
                    "morethanhumanWorld": "Analysis of more-than-human world relations",
                    "speciesEntanglement": "Analysis of entanglement with other species",
                    "nonhumanAgency": "Analysis of nonhuman agency recognition",
                    "anthropocentrism": "Analysis of anthropocentric tendencies"
                },
                
                "technologyRelations": {
                    "technologicalEmbodiment": "Analysis of technological embodiment",
                    "cyborgSubjectivity": "Analysis of cyborg subjectivity",
                    "technogenesis": "Analysis of co-evolution with technology",
                    "digitalEntanglement": ["List", "of", "digital", "entanglements"]
                },
                
                "distributedAgency": {
                    "agentialAssemblages": "Analysis of agential assemblages",
                    "materialAgency": "Analysis of material agency",
                    "distributedCognition": "Analysis of distributed cognition",
                    "emergentProperties": ["List", "of", "emergent", "properties"]
                },
                
                "ontologicalBoundaries": {
                    "boundaryDissolution": "Analysis of boundary dissolution",
                    "hybridIdentities": ["List", "of", "hybrid", "identities"],
                    "natureculture": "Analysis of natureculture entanglement",
                    "boundaryMaking": "Analysis of boundary-making practices"
                },
                
                "ethicalConsiderations": {
                    "posthumanEthics": "Analysis of posthuman ethical stance",
                    "multispeciesJustice": "Analysis of multispecies justice concerns",
                    "technologicalEthics": "Analysis of technological ethics",
                    "futureResponsibilities": ["List", "of", "future", "responsibilities"]
                },
                
                "affectiveDimensions": {
                    "morethanhumanAffect": "Analysis of more-than-human affective relations",
                    "technologicalAffect": "Analysis of technological affective relations",
                    "affectiveCapacities": "Analysis of affective capacities",
                    "atmosphericAttunement": "Analysis of atmospheric attunement"
                },
                
                "posthumanistRecommendations": ["List", "of", "posthumanist", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
