// Constants for framework IDs
export const FRAMEWORKS = {
    TACKTICAL: 'tacktical',
    FREUDIAN: 'freudian',
    LACANIAN: 'lacanian',
    DELEUZIAN: 'deleuzian',
    IRIGARAYIAN: 'irigarayian',
    JUNGIAN: 'jungian',
    ATTACHMENT: 'attachment',
    POSITIVE: 'positive',
    NARRATIVE: 'narrative',
    PHENOMENOLOGY: 'phenomenology',
    EXISTENTIAL: 'existential',
    FEMINIST: 'feminist',
    CRITICAL: 'critical',
    POSTHUMANISM: 'posthumanism',
    BUDDHIST: 'buddhist',
    NIETZSCHEAN: 'nietzschean',
    GESTALT: 'gestalt',
    TRANSPERSONAL: 'transpersonal',
    CBT: 'cbt',
    HERMENEUTICS: 'hermeneutics',
    STOICISM: 'stoicism',
    PSYCHIATRY: 'psychiatry',
    EPICUREAN: 'epicurean'
};

// Constants for media types
export const MEDIA_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    AUDIO: 'audio',
    FILM: 'film'
};

// Tier options
export enum AnalysisTier {
    FREE = 'free',
    PREMIUM = 'premium'
}

// OpenAI model options
export enum OpenAIModel {
    GPT_3_5 = 'gpt-3.5-turbo',
    GPT_4 = 'gpt-4'
}

// Interface for plugin settings
export interface DeleometerSettings {
    enabledFrameworks: Record<string, boolean>;
    analysisDepth: 'brief' | 'standard' | 'detailed';
    enableJournalingPrompts: boolean;
    autoOpenExportedFiles: boolean;
    analysisTier: AnalysisTier;
    enableOpenAI: boolean;
    openaiApiKey: string;
    openaiModel: OpenAIModel;
    openaiUsageLimit: number;
    openaiUsageCount: number;
    openaiLastReset: number; // Timestamp
}

// Default plugin settings
export const DEFAULT_SETTINGS: DeleometerSettings = {
    enabledFrameworks: {
        [FRAMEWORKS.TACKTICAL]: true,
        [FRAMEWORKS.FREUDIAN]: true,
        [FRAMEWORKS.LACANIAN]: true,
        [FRAMEWORKS.DELEUZIAN]: true,
        [FRAMEWORKS.IRIGARAYIAN]: true,
        [FRAMEWORKS.JUNGIAN]: true,
        [FRAMEWORKS.ATTACHMENT]: true,
        [FRAMEWORKS.POSITIVE]: true,
        [FRAMEWORKS.NARRATIVE]: true,
        [FRAMEWORKS.PHENOMENOLOGY]: true,
        [FRAMEWORKS.EXISTENTIAL]: true,
        [FRAMEWORKS.FEMINIST]: true,
        [FRAMEWORKS.CRITICAL]: true,
        [FRAMEWORKS.POSTHUMANISM]: true,
        [FRAMEWORKS.BUDDHIST]: true,
        [FRAMEWORKS.NIETZSCHEAN]: true,
        [FRAMEWORKS.GESTALT]: true,
        [FRAMEWORKS.TRANSPERSONAL]: true,
        [FRAMEWORKS.CBT]: true,
        [FRAMEWORKS.HERMENEUTICS]: true,
        [FRAMEWORKS.STOICISM]: true,
        [FRAMEWORKS.PSYCHIATRY]: true,
        [FRAMEWORKS.EPICUREAN]: true
    },
    analysisDepth: 'standard',
    enableJournalingPrompts: true,
    autoOpenExportedFiles: true,
    analysisTier: AnalysisTier.FREE,
    enableOpenAI: false,
    openaiApiKey: '',
    openaiModel: OpenAIModel.GPT_3_5,
    openaiUsageLimit: 50, // Default limit of 50 analyses per month
    openaiUsageCount: 0,
    openaiLastReset: Date.now()
};
