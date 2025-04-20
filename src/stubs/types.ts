// Stub file for types.ts

export interface AnalysisResult {
    id?: string;
    date?: string;
    content?: string;
    emotions?: Record<string, number>;
    psychoanalysis?: string;
    personality?: string;
    schizoanalysis?: string;
    recommendations?: string[];
    metadata?: Record<string, any>;
}
