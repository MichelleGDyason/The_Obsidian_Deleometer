import { App, TFile } from 'obsidian';
import { FRAMEWORKS, MEDIA_TYPES, DeleometerSettings } from './constants';
import { getFrameworkAnalysis } from './frameworks/index';

export interface AnalysisResult {
    mediaType: string;
    summary: string;
    frameworkAnalyses: Record<string, any>; // Can be string or any framework-specific result type
    recommendations: string[];
    fileName?: string;
}

export class AnalysisEngine {
    app: App;
    settings: DeleometerSettings;

    constructor(app: App, settings: DeleometerSettings) {
        this.app = app;
        this.settings = settings;
    }

    // Analyze any content based on its type
    analyzeContent(content: string | TFile, mediaType: string, frameworks: string[]): AnalysisResult {
        try {
            // Check if mediaType is valid
            let isValidMediaType = false;
            for (const type in MEDIA_TYPES) {
                if (MEDIA_TYPES[type as keyof typeof MEDIA_TYPES] === mediaType) {
                    isValidMediaType = true;
                    break;
                }
            }

            if (!isValidMediaType) {
                console.warn(`Unsupported media type: ${mediaType}`);
                return {
                    mediaType,
                    summary: `Unsupported media type: ${mediaType}`,
                    frameworkAnalyses: {},
                    recommendations: []
                };
            }

            // Process based on media type
            switch (mediaType) {
                case MEDIA_TYPES.TEXT:
                    const contentStr = typeof content === 'string' ? content : content.path;
                    return this.analyzeText(contentStr, frameworks);
                case MEDIA_TYPES.IMAGE:
                    return this.analyzeImage(content as TFile, frameworks);
                case MEDIA_TYPES.AUDIO:
                    return this.analyzeAudio(content as TFile, frameworks);
                case MEDIA_TYPES.FILM:
                    return this.analyzeFilm(content as TFile, frameworks);
                default:
                    // This should never happen due to the validation above
                    throw new Error(`Unsupported media type: ${mediaType}`);
            }
        } catch (error) {
            console.error(`Error in analyzeContent:`, error);
            // Return a basic result in case of error
            return {
                mediaType: mediaType,
                summary: `Analysis could not be completed due to an error.`,
                frameworkAnalyses: {},
                recommendations: ["Try analyzing a different file or content."],
                fileName: typeof content !== 'string' ? content.path : undefined
            };
        }
    }





    // Analyze text content
    analyzeText(content: string, frameworks: string[]): AnalysisResult {
        const result: AnalysisResult = {
            mediaType: MEDIA_TYPES.TEXT,
            summary: this.generateTextSummary(content),
            frameworkAnalyses: {},
            recommendations: []
        };

        // Generate analysis for each framework
        for (const framework of frameworks) {
            try {
                // Try to get a specialized framework analyzer
                try {
                    const frameworkAnalyzer = getFrameworkAnalysis(framework);
                    result.frameworkAnalyses[framework] = frameworkAnalyzer.analyzeContent(content, MEDIA_TYPES.TEXT);
                } catch (e) {
                    // Fall back to generic analysis if specialized framework not available
                    result.frameworkAnalyses[framework] = this.generateFrameworkAnalysis(content, framework, MEDIA_TYPES.TEXT);
                }
            } catch (error) {
                console.error(`Error analyzing with framework ${framework}:`, error);
                result.frameworkAnalyses[framework] = this.generateFrameworkAnalysis(content, framework, MEDIA_TYPES.TEXT);
            }
        }

        // Generate recommendations
        result.recommendations = this.generateRecommendations(result.frameworkAnalyses);

        return result;
    }

    // Analyze image content
    analyzeImage(file: TFile, frameworks: string[]): AnalysisResult {
        const result: AnalysisResult = {
            mediaType: MEDIA_TYPES.IMAGE,
            fileName: file.path,
            summary: `This image (${file.path}) contains visual elements that can be analyzed through multiple theoretical frameworks.`,
            frameworkAnalyses: {},
            recommendations: []
        };

        // Generate analysis for each framework
        for (const framework of frameworks) {
            try {
                // Try to get a specialized framework analyzer
                try {
                    const frameworkAnalyzer = getFrameworkAnalysis(framework);
                    result.frameworkAnalyses[framework] = frameworkAnalyzer.analyzeContent(file, MEDIA_TYPES.IMAGE);
                } catch (e) {
                    // Fall back to generic analysis if specialized framework not available
                    result.frameworkAnalyses[framework] = this.generateFrameworkAnalysis(file.path, framework, MEDIA_TYPES.IMAGE);
                }
            } catch (error) {
                console.error(`Error analyzing with framework ${framework}:`, error);
                result.frameworkAnalyses[framework] = this.generateFrameworkAnalysis(file.path, framework, MEDIA_TYPES.IMAGE);
            }
        }

        // Generate recommendations
        result.recommendations = this.generateRecommendations(result.frameworkAnalyses);

        return result;
    }

    // Analyze audio content
    analyzeAudio(file: TFile, frameworks: string[]): AnalysisResult {
        const result: AnalysisResult = {
            mediaType: MEDIA_TYPES.AUDIO,
            fileName: file.path,
            summary: `This audio file (${file.path}) contains sonic elements that can be analyzed through multiple theoretical frameworks.`,
            frameworkAnalyses: {},
            recommendations: []
        };

        // Generate analysis for each framework
        for (const framework of frameworks) {
            try {
                // Try to get a specialized framework analyzer
                try {
                    const frameworkAnalyzer = getFrameworkAnalysis(framework);
                    result.frameworkAnalyses[framework] = frameworkAnalyzer.analyzeContent(file, MEDIA_TYPES.AUDIO);
                } catch (e) {
                    // Fall back to generic analysis if specialized framework not available
                    result.frameworkAnalyses[framework] = this.generateFrameworkAnalysis(file.path, framework, MEDIA_TYPES.AUDIO);
                }
            } catch (error) {
                console.error(`Error analyzing with framework ${framework}:`, error);
                result.frameworkAnalyses[framework] = this.generateFrameworkAnalysis(file.path, framework, MEDIA_TYPES.AUDIO);
            }
        }

        // Generate recommendations
        result.recommendations = this.generateRecommendations(result.frameworkAnalyses);

        return result;
    }

    // Analyze film content
    analyzeFilm(file: TFile, frameworks: string[]): AnalysisResult {
        const result: AnalysisResult = {
            mediaType: MEDIA_TYPES.FILM,
            fileName: file.path,
            summary: `This film/video (${file.path}) contains visual and narrative elements that can be analyzed through multiple theoretical frameworks.`,
            frameworkAnalyses: {},
            recommendations: []
        };

        // Generate analysis for each framework
        for (const framework of frameworks) {
            try {
                // Try to get a specialized framework analyzer
                try {
                    const frameworkAnalyzer = getFrameworkAnalysis(framework);
                    result.frameworkAnalyses[framework] = frameworkAnalyzer.analyzeContent(file, MEDIA_TYPES.FILM);
                } catch (e) {
                    // Fall back to generic analysis if specialized framework not available
                    result.frameworkAnalyses[framework] = this.generateFrameworkAnalysis(file.path, framework, MEDIA_TYPES.FILM);
                }
            } catch (error) {
                console.error(`Error analyzing with framework ${framework}:`, error);
                result.frameworkAnalyses[framework] = this.generateFrameworkAnalysis(file.path, framework, MEDIA_TYPES.FILM);
            }
        }

        // Generate recommendations
        result.recommendations = this.generateRecommendations(result.frameworkAnalyses);

        return result;
    }



    // Generate a summary of text content with more specific analysis
    generateTextSummary(content: string): string {
        // Extract key themes and patterns from the content
        const themes = this.extractThemes(content);
        const emotionalTone = this.analyzeEmotionalTone(content);
        const narrativeStructure = this.analyzeNarrativeStructure(content);

        // Generate a more specific summary based on the content
        return `This text contains themes of ${themes.join(', ')}, with a predominantly ${emotionalTone} emotional tone. The writing suggests ${narrativeStructure}, revealing a nuanced exploration of personal experience and reflection.`;
    }

    // Extract key themes from text content
    extractThemes(content: string): string[] {
        const themePatterns: Record<string, RegExp> = {
            reflection: /reflect|contemplat|introspect|think about|ponder|consider/i,
            identity: /who I am|identity|self|authentic|true self/i,
            relationships: /relationship|connect|friend|family|partner|love|intimacy/i,
            transition: /change|transition|shift|transform|evolve|growth|develop/i,
            creativity: /creat|art|express|imagin|inspir|vision|idea/i,
            purpose: /purpose|meaning|significance|direction|goal|aim|mission/i,
            conflict: /conflict|tension|struggle|challenge|difficult|problem|obstacle/i,
            healing: /heal|recover|overcome|process|integrat|accept|reconcile/i
        };

        // Identify themes present in the content
        const presentThemes: string[] = [];
        Object.keys(themePatterns).forEach(theme => {
            const pattern = themePatterns[theme];
            if (pattern.test(content)) {
                presentThemes.push(theme);
            }
        });

        // Return identified themes or defaults if none found
        return presentThemes.length > 0 ? presentThemes : ['reflection', 'introspection', 'self-awareness'];
    }

    // Analyze the emotional tone of text content
    analyzeEmotionalTone(content: string): string {
        const tonePatterns: Record<string, RegExp> = {
            reflective: /reflect|contemplat|ponder|think|consider/i,
            melancholic: /sad|depress|melanchol|down|blue|despair|grief/i,
            hopeful: /hope|optimis|look forward|anticipat|excit|eager/i,
            anxious: /anxi|worry|concern|stress|tension|nervous|fear/i,
            content: /content|satisf|peace|calm|serene|tranquil|happy/i,
            frustrated: /frustrat|annoy|irritat|exasperat|anger|resent/i,
            grateful: /gratitude|thankful|appreciat|grateful|blessed/i,
            ambivalent: /ambivalen|conflict|mixed|unsure|uncertain/i
        };

        // Count occurrences of each tone
        const toneCounts: Record<string, number> = {};
        Object.keys(tonePatterns).forEach(tone => {
            const pattern = tonePatterns[tone];
            const matches = content.match(pattern) || [];
            toneCounts[tone] = matches.length;
        });

        // Find the dominant tone
        let dominantTone = 'reflective'; // Default
        let maxCount = 0;

        Object.keys(toneCounts).forEach(tone => {
            const count = toneCounts[tone];
            if (count > maxCount) {
                maxCount = count;
                dominantTone = tone;
            }
        });

        return dominantTone;
    }

    // Analyze the narrative structure of text content
    analyzeNarrativeStructure(content: string): string {
        // Check for different narrative patterns
        const isPastFocused = /was|were|had|did|went|came|thought|felt/i.test(content);
        const isFutureFocused = /will|going to|plan|future|soon|tomorrow|next/i.test(content);
        const isQuestionFocused = /\?|wonder|question|curious|how|why|what if/i.test(content);
        const isDialogueHeavy = /said|asked|replied|answered|spoke|talked/i.test(content);

        // Determine the dominant structure
        if (isPastFocused && isFutureFocused) {
            return "a reflective examination of past experiences in relation to future aspirations";
        } else if (isPastFocused) {
            return "a retrospective exploration of past experiences and their significance";
        } else if (isFutureFocused) {
            return "a forward-looking contemplation of possibilities and intentions";
        } else if (isQuestionFocused) {
            return "an inquiry-based exploration of questions and uncertainties";
        } else if (isDialogueHeavy) {
            return "a dialogical engagement with different perspectives or voices";
        } else {
            return "a present-centered reflection on current experiences and insights";
        }
    }

    // Generate analysis for a specific framework
    generateFrameworkAnalysis(contentPath: string, framework: string, mediaType: string): string {
        // Use contentPath to personalize the analysis if needed
        const fileName = contentPath.split('/').pop() || contentPath;
        // In a real implementation, this would use AI or templates to generate framework-specific analysis
        // For now, we'll use predefined analyses based on the framework and media type

        const analyses: Record<string, Record<string, string>> = {
            [FRAMEWORKS.FREUDIAN]: {
                [MEDIA_TYPES.TEXT]: "From a Freudian perspective, this content reveals underlying psychological dynamics and unconscious processes. There are suggestions of repressed desires finding expression through symbolic representation and displacement. The formal elements of the work can be interpreted as manifestations of primary process thinking, where logical constraints are loosened in favor of associative connections. Recurring motifs suggest the return of the repressed, with unresolved psychic material seeking acknowledgment. The tension between structure and expression mirrors the ego's mediation between the demands of the id and superego. The work engages with universal psychological conflicts related to desire, prohibition, and sublimation.",
                [MEDIA_TYPES.IMAGE]: "This image can be analyzed through a Freudian lens to reveal unconscious symbolic content. Visual elements may represent displaced desires, condensed meanings, or symbolic fulfillment of unconscious wishes. The composition suggests tensions between conscious intention and unconscious expression. Color choices and spatial relationships may indicate psychosexual themes or conflicts. The image potentially functions as a dream-like expression where primary process thinking is evident. The viewer's response to the image may involve projection of their own unconscious material.",
                [MEDIA_TYPES.AUDIO]: "From a Freudian perspective, this audio piece reveals underlying psychological dynamics through its sonic elements. Rhythmic patterns may represent the tension between id impulses and superego constraints. Tonal qualities can be interpreted as expressions of libidinal energy or repressed emotional content. The structure of the piece mirrors psychological defense mechanisms such as sublimation or displacement. Recurring motifs suggest the return of repressed material seeking acknowledgment. The emotional response evoked in the listener may indicate transference or projection of unconscious material. The piece engages with universal psychological conflicts through its auditory symbolism.",
                [MEDIA_TYPES.FILM]: "This film can be analyzed through a Freudian lens to reveal unconscious symbolic content and psychological dynamics. Visual imagery and narrative elements may represent displaced desires or condensed meanings. Character relationships often mirror psychosexual developmental stages or conflicts. The film's structure suggests tensions between conscious intention and unconscious expression. Recurring visual motifs may indicate the return of repressed material seeking acknowledgment. Editing techniques and visual transitions can be interpreted as analogous to dream-work mechanisms. The viewer's emotional response may involve projection of their own unconscious material."
            },
            [FRAMEWORKS.LACANIAN]: {
                [MEDIA_TYPES.TEXT]: "A Lacanian reading of this text reveals the interplay between the Symbolic, Imaginary, and Real orders. The language demonstrates how the subject positions themselves within the symbolic order while grappling with the Real. There are moments where the text approaches the Real—that which resists symbolization—before retreating into symbolic structures. The writing reveals the fundamental split in subjectivity and the impossibility of wholeness that drives desire. Signifiers in the text form chains of meaning that point to an absent center, illustrating Lacan's concept that desire always operates through metonymic displacement. The text demonstrates how language both constructs and alienates the subject, creating a gap between the subject of the statement and the subject of enunciation.",
                [MEDIA_TYPES.IMAGE]: "This image can be analyzed through a Lacanian framework to reveal the interplay between the Symbolic, Imaginary, and Real orders. Visual elements function as signifiers in a chain of meaning that points to an absent center. The image potentially operates as a screen upon which fantasies are projected, revealing the structure of desire as lack. Compositional elements may demonstrate the gaze as object a—the unattainable object-cause of desire. The image potentially disrupts the Imaginary order by introducing elements of the Real that resist symbolization. The viewer's relationship to the image reveals the fundamental split in subjectivity. The visual language creates a gap between what is represented and what remains unrepresentable.",
                [MEDIA_TYPES.AUDIO]: "A Lacanian analysis of this audio piece reveals the interplay between the Symbolic, Imaginary, and Real orders through sonic elements. Sound functions as a signifier in chains of meaning that point to an absent center. Rhythmic and tonal patterns demonstrate the structure of desire as lack, always moving metonymically from one signifier to another. Moments of dissonance or silence may represent irruptions of the Real—that which resists symbolization. The listener's experience reveals the fundamental split in subjectivity when engaging with the piece. The audio creates a gap between what is heard and what remains beyond representation. The piece potentially functions as object a—the unattainable object-cause of desire—in its ability to evoke but never satisfy.",
                [MEDIA_TYPES.FILM]: "This film can be analyzed through a Lacanian framework to reveal the interplay between the Symbolic, Imaginary, and Real orders. Visual and narrative elements function as signifiers in chains of meaning that point to an absent center. The film potentially operates as a screen upon which fantasies are projected, revealing the structure of desire as lack. Character relationships demonstrate the mirror stage and the formation of the ego through identification. The gaze operates as object a—the unattainable object-cause of desire—in the visual language of the film. Moments of narrative disruption may represent irruptions of the Real that resist symbolization. The viewer's relationship to the film reveals the fundamental split in subjectivity."
            },
            // Add analyses for other frameworks and media types
        };

        // Adjust analysis depth based on settings
        let analysisText = analyses[framework]?.[mediaType];

        if (!analysisText) {
            // Generate a generic analysis if a specific one is not found
            analysisText = `This ${mediaType} "${fileName}" can be analyzed through the lens of ${this.getFrameworkName(framework)} to reveal insights about its structure, content, and meaning. The analysis would consider the specific theoretical concepts and methodologies of this framework to interpret the work's significance and implications. Multiple elements of the ${mediaType} demonstrate principles central to this theoretical approach. The relationship between form and content reveals deeper patterns that align with key concepts from this framework. This analysis opens up new perspectives on how the ${mediaType} functions within broader cultural and psychological contexts. The ${mediaType}'s impact can be understood through this framework's unique interpretive lens.`;
        }

        // Adjust analysis based on depth setting
        switch (this.settings.analysisDepth) {
            case 'brief':
                // Return first two sentences
                return analysisText.split('. ').slice(0, 2).join('. ') + '.';
            case 'detailed':
                // Return the full analysis plus additional detail
                return analysisText + ` Further exploration of this ${mediaType} through the ${this.getFrameworkName(framework)} framework would reveal additional layers of meaning and significance, particularly in relation to the specific cultural and historical contexts in which it was created and is being interpreted. The theoretical concepts provide a rich vocabulary for articulating the complex dynamics at play in this work.`;
            case 'standard':
            default:
                // Return the full analysis as is
                return analysisText;
        }
    }

    // Generate recommendations based on analyses
    generateRecommendations(frameworkAnalyses: Record<string, any>): string[] {
        // Generate general recommendations
        const recommendations = [
            "Reflect on recurring patterns and themes that emerged across different theoretical frameworks.",
            "Consider how different perspectives offer complementary insights into the same content.",
            "Explore the relationship between form and content in your creative expression."
        ];

        // Add framework-specific recommendations
        const frameworkRecommendations: Record<string, string[]> = {
            [FRAMEWORKS.DELEUZIAN]: [
                "Explore how Deleuzian concepts of rhizomes and assemblages might inform your creative practice.",
                "Consider how lines of flight in your work could open up new possibilities for expression."
            ],
            [FRAMEWORKS.IRIGARAYIAN]: [
                "Reflect on how Irigaray's concept of sexual difference might inform your understanding of subjectivity.",
                "Consider how fluid logic and non-linear expression could enrich your creative work."
            ],
            [FRAMEWORKS.FREUDIAN]: [
                "Consider how unconscious processes might be influencing your creative work.",
                "Explore the symbolic representations of desire in your content."
            ],
            [FRAMEWORKS.LACANIAN]: [
                "Reflect on how language structures your experience and creative expression.",
                "Consider the role of desire and lack in your work."
            ],
            [FRAMEWORKS.JUNGIAN]: [
                "Explore archetypal patterns in your creative work.",
                "Consider how collective unconscious symbols appear in your content."
            ],
            [FRAMEWORKS.EXISTENTIAL]: [
                "Reflect on themes of freedom, choice, and authenticity in your work.",
                "Consider how your creative practice contributes to meaning-making."
            ],
            [FRAMEWORKS.EPICUREAN]: [
                "Consider how your work relates to the pursuit of tranquility and freedom from disturbance.",
                "Explore the role of pleasure and natural desires in your creative expression."
            ]
            // Additional framework recommendations can be added here
        };

        // Add relevant framework-specific recommendations
        Object.keys(frameworkAnalyses).forEach(framework => {
            if (framework in frameworkRecommendations) {
                recommendations.push(...frameworkRecommendations[framework]);
            }
        });

        return recommendations;
    }

    // Get the display name for a framework ID
    getFrameworkName(frameworkId: string): string {
        const names: Record<string, string> = {
            [FRAMEWORKS.TACKTICAL]: 'Tacktical Methodology',
            [FRAMEWORKS.FREUDIAN]: 'Freudian Psychoanalysis',
            [FRAMEWORKS.LACANIAN]: 'Lacanian Psychoanalysis',
            [FRAMEWORKS.DELEUZIAN]: 'Deleuzian Schizoanalysis',
            [FRAMEWORKS.IRIGARAYIAN]: 'Irigarayian Feminist Theory',
            [FRAMEWORKS.JUNGIAN]: 'Jungian Analytical Psychology',
            [FRAMEWORKS.ATTACHMENT]: 'Attachment Theory',
            [FRAMEWORKS.POSITIVE]: 'Positive Psychology',
            [FRAMEWORKS.NARRATIVE]: 'Narrative Psychology',
            [FRAMEWORKS.PHENOMENOLOGY]: 'Phenomenology',
            [FRAMEWORKS.EXISTENTIAL]: 'Existential Psychology',
            [FRAMEWORKS.FEMINIST]: 'Feminist Theory',
            [FRAMEWORKS.CRITICAL]: 'Critical Theory',
            [FRAMEWORKS.POSTHUMANISM]: 'Posthumanism',
            [FRAMEWORKS.BUDDHIST]: 'Buddhist Psychology',
            [FRAMEWORKS.NIETZSCHEAN]: 'Nietzschean Philosophy',
            [FRAMEWORKS.GESTALT]: 'Gestalt Psychology',
            [FRAMEWORKS.TRANSPERSONAL]: 'Transpersonal Psychology',
            [FRAMEWORKS.CBT]: 'Cognitive Behavioral Therapy',
            [FRAMEWORKS.HERMENEUTICS]: 'Hermeneutics',
            [FRAMEWORKS.STOICISM]: 'Stoicism',
            [FRAMEWORKS.PSYCHIATRY]: 'Psychiatry',
            [FRAMEWORKS.EPICUREAN]: 'Epicurean Philosophy'
        };

        return names[frameworkId] || frameworkId;
    }
}
