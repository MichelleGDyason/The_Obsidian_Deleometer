import { ApiService } from './apiService';
import { UserProfile } from './userProfileSystem';

/**
 * Represents the result of a Psychiatry analysis
 */
export interface PsychiatryAnalysisResult {
    // Core analysis
    interpretation: string;
    
    // Mental status
    mentalStatus: {
        appearance: string;
        behavior: string;
        cognition: string;
        mood: string;
        affect: string;
        thoughtProcess: string;
        thoughtContent: string;
        perception: string;
        insight: string;
        judgment: string;
        statusAnalysis: string;
    };
    
    // Symptom patterns
    symptomPatterns: {
        moodSymptoms: string[];
        anxietySymptoms: string[];
        psychoticSymptoms: string[];
        cognitiveSymptoms: string[];
        behavioralSymptoms: string[];
        somaticSymptoms: string[];
        symptomAnalysis: string;
    };
    
    // Diagnostic considerations
    diagnosticConsiderations: {
        primaryConsiderations: string[];
        differentialDiagnosis: string[];
        comorbidities: string[];
        diagnosticAnalysis: string;
    };
    
    // Biopsychosocial factors
    biopsychosocialFactors: {
        biologicalFactors: string[];
        psychologicalFactors: string[];
        socialFactors: string[];
        factorsAnalysis: string;
    };
    
    // Treatment implications
    treatmentImplications: {
        psychotherapeuticApproaches: string[];
        psychopharmacologicalOptions: string[];
        lifestyleInterventions: string[];
        treatmentAnalysis: string;
    };
    
    // Prognosis and course
    prognosisAndCourse: {
        prognosticFactors: string[];
        courseTrajectory: string;
        recoveryPotential: string;
        prognosisAnalysis: string;
    };
    
    // Psychiatric recommendations
    psychiatricRecommendations: string[];
    
    // Disclaimer
    disclaimer: string;
}

/**
 * Provides analysis using Psychiatry
 */
export class PsychiatryAnalysis {
    private apiService: ApiService;
    
    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }
    
    /**
     * Analyze text using Psychiatry
     * @param text The text to analyze
     * @param userProfile The user profile for personalization
     */
    async analyzeText(text: string, userProfile: UserProfile | null): Promise<PsychiatryAnalysisResult> {
        // Create personalization context
        const personalizationContext = this.createPersonalizationContext(userProfile);
        
        // Create the prompt
        const prompt = this.createAnalysisPrompt(text, personalizationContext);
        
        // Get the analysis
        const analysisResult = await this.apiService.getCompletion(prompt, { responseFormat: 'json_object' });
        
        // Add disclaimer
        analysisResult.disclaimer = "IMPORTANT: This analysis is for educational purposes only and does not constitute a clinical diagnosis or medical advice. A proper psychiatric assessment requires in-person evaluation by a qualified mental health professional. If you're experiencing mental health concerns, please consult with a licensed healthcare provider.";
        
        return analysisResult as PsychiatryAnalysisResult;
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
            # Psychiatry Analysis

            Analyze the following journal entry using psychiatric concepts and frameworks.
            Focus on mental status, symptom patterns, diagnostic considerations, biopsychosocial factors, treatment implications, and prognosis and course.
            
            IMPORTANT: This is for educational purposes only. Provide a thoughtful analysis but emphasize that this is not a clinical diagnosis, which would require in-person assessment by a qualified mental health professional.
            
            ${personalizationContext}
            
            Return a JSON object with the following structure:
            
            {
                "interpretation": "Overall psychiatric interpretation",
                
                "mentalStatus": {
                    "appearance": "Analysis of appearance and behavior",
                    "behavior": "Analysis of behavior",
                    "cognition": "Analysis of cognition",
                    "mood": "Analysis of mood",
                    "affect": "Analysis of affect",
                    "thoughtProcess": "Analysis of thought process",
                    "thoughtContent": "Analysis of thought content",
                    "perception": "Analysis of perception",
                    "insight": "Analysis of insight",
                    "judgment": "Analysis of judgment",
                    "statusAnalysis": "Analysis of mental status"
                },
                
                "symptomPatterns": {
                    "moodSymptoms": ["List", "of", "mood", "symptoms"],
                    "anxietySymptoms": ["List", "of", "anxiety", "symptoms"],
                    "psychoticSymptoms": ["List", "of", "psychotic", "symptoms"],
                    "cognitiveSymptoms": ["List", "of", "cognitive", "symptoms"],
                    "behavioralSymptoms": ["List", "of", "behavioral", "symptoms"],
                    "somaticSymptoms": ["List", "of", "somatic", "symptoms"],
                    "symptomAnalysis": "Analysis of symptom patterns"
                },
                
                "diagnosticConsiderations": {
                    "primaryConsiderations": ["List", "of", "primary", "considerations"],
                    "differentialDiagnosis": ["List", "of", "differential", "diagnoses"],
                    "comorbidities": ["List", "of", "potential", "comorbidities"],
                    "diagnosticAnalysis": "Analysis of diagnostic considerations"
                },
                
                "biopsychosocialFactors": {
                    "biologicalFactors": ["List", "of", "biological", "factors"],
                    "psychologicalFactors": ["List", "of", "psychological", "factors"],
                    "socialFactors": ["List", "of", "social", "factors"],
                    "factorsAnalysis": "Analysis of biopsychosocial factors"
                },
                
                "treatmentImplications": {
                    "psychotherapeuticApproaches": ["List", "of", "psychotherapeutic", "approaches"],
                    "psychopharmacologicalOptions": ["List", "of", "psychopharmacological", "options"],
                    "lifestyleInterventions": ["List", "of", "lifestyle", "interventions"],
                    "treatmentAnalysis": "Analysis of treatment implications"
                },
                
                "prognosisAndCourse": {
                    "prognosticFactors": ["List", "of", "prognostic", "factors"],
                    "courseTrajectory": "Analysis of course trajectory",
                    "recoveryPotential": "Analysis of recovery potential",
                    "prognosisAnalysis": "Analysis of prognosis and course"
                },
                
                "psychiatricRecommendations": ["List", "of", "psychiatric", "recommendations"]
            }
            
            Journal Entry:
            ${text}
        `;
        
        return prompt;
    }
}
