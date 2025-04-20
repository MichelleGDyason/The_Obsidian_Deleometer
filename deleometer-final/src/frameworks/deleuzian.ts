import { TFile } from 'obsidian';
import { MEDIA_TYPES } from '../constants';

export interface DeleuzianAnalysisResult {
    rhizomaticConnections: string[];
    assemblages: string[];
    deterritorializations: string[];
    lines: {
        molar: string[];
        molecular: string[];
        flight: string[];
    };
    desiring: {
        machines: string[];
        productions: string[];
    };
    bodyWithoutOrgans: string;
    summary: string;
}

export class DeleuzianAnalysis {
    /**
     * Analyze content using Deleuzian schizoanalysis
     */
    analyzeContent(content: string | TFile, mediaType: string): DeleuzianAnalysisResult {
        switch (mediaType) {
            case MEDIA_TYPES.TEXT:
                return this.analyzeText(content as string);
            case MEDIA_TYPES.IMAGE:
                return this.analyzeImage(content as TFile);
            case MEDIA_TYPES.AUDIO:
                return this.analyzeAudio(content as TFile);
            case MEDIA_TYPES.FILM:
                return this.analyzeFilm(content as TFile);
            default:
                throw new Error(`Unsupported media type for Deleuzian analysis: ${mediaType}`);
        }
    }
    
    /**
     * Analyze text content using Deleuzian concepts
     */
    private analyzeText(text: string): DeleuzianAnalysisResult {
        // Extract key patterns and themes
        const themes = this.extractThemes(text);
        const emotionalPatterns = this.analyzeEmotionalPatterns(text);
        const narrativeStructure = this.analyzeNarrativeStructure(text);
        
        // Identify rhizomatic connections
        const rhizomaticConnections = this.identifyRhizomaticConnections(text, themes);
        
        // Identify assemblages
        const assemblages = this.identifyAssemblages(text, themes, emotionalPatterns);
        
        // Identify deterritorializations
        const deterritorializations = this.identifyDeterritorializations(text);
        
        // Analyze lines (molar, molecular, flight)
        const lines = this.analyzeLines(text);
        
        // Analyze desiring-production
        const desiring = this.analyzeDesiring(text);
        
        // Identify the body without organs
        const bodyWithoutOrgans = this.identifyBodyWithoutOrgans(text, narrativeStructure);
        
        // Generate summary
        const summary = this.generateSummary(
            rhizomaticConnections, 
            assemblages, 
            deterritorializations, 
            lines, 
            desiring, 
            bodyWithoutOrgans
        );
        
        return {
            rhizomaticConnections,
            assemblages,
            deterritorializations,
            lines,
            desiring,
            bodyWithoutOrgans,
            summary
        };
    }
    
    /**
     * Analyze image content using Deleuzian concepts
     */
    private analyzeImage(file: TFile): DeleuzianAnalysisResult {
        // For images, we'll create a placeholder analysis based on the filename
        // In a real implementation, this would analyze the actual image content
        const fileName = file.name;
        
        const rhizomaticConnections = [
            "Visual elements form non-hierarchical connections across the image plane",
            "Color relationships create unexpected pathways of association",
            "Formal elements connect to cultural and historical references"
        ];
        
        const assemblages = [
            "The image functions as an assemblage of visual elements, cultural codes, and viewer perception",
            "Technical components (medium, format, technique) form a material assemblage",
            "Representational elements combine with abstract qualities in a visual assemblage"
        ];
        
        const deterritorializations = [
            "The image deterritorializes conventional visual language through its formal innovations",
            "Representational elements are deterritorialized through their contextual placement",
            "The viewing experience deterritorializes habitual modes of perception"
        ];
        
        const lines = {
            molar: [
                "Recognizable forms and conventional compositional structures",
                "Cultural codes and established visual language"
            ],
            molecular: [
                "Subtle variations in tone, texture, and color",
                "Micro-movements and tensions within the composition"
            ],
            flight: [
                "Elements that escape categorization or fixed meaning",
                "Visual components that suggest movement beyond the frame"
            ]
        };
        
        const desiring = {
            machines: [
                "The technical apparatus of image creation",
                "The perceptual mechanisms of viewing",
                "The cultural machinery of image circulation"
            ],
            productions: [
                "Production of visual intensity and affect",
                "Production of meaning through visual juxtaposition",
                "Production of new perceptual possibilities"
            ]
        };
        
        const bodyWithoutOrgans = "The image as a surface of intensities, prior to organization into fixed meaning";
        
        const summary = `This image (${fileName}) functions as a visual assemblage that generates multiple rhizomatic connections. It operates through the interplay of molar structures and molecular variations, with lines of flight that open toward new perceptual possibilities. The image can be understood as a body without organs—a surface of visual intensities that resists fixed organization. Through its visual deterritorializations, it produces new affective and conceptual potentials that exceed conventional categorization.`;
        
        return {
            rhizomaticConnections,
            assemblages,
            deterritorializations,
            lines,
            desiring,
            bodyWithoutOrgans,
            summary
        };
    }
    
    /**
     * Analyze audio content using Deleuzian concepts
     */
    private analyzeAudio(file: TFile): DeleuzianAnalysisResult {
        // For audio, we'll create a placeholder analysis based on the filename
        // In a real implementation, this would analyze the actual audio content
        const fileName = file.name;
        
        const rhizomaticConnections = [
            "Sonic elements form non-hierarchical networks of relation",
            "Timbral qualities create unexpected connections across different moments",
            "Rhythmic patterns establish temporal rhizomes"
        ];
        
        const assemblages = [
            "The audio functions as a sonic assemblage of frequencies, rhythms, and timbres",
            "Technical components (recording, mixing, playback) form a technological assemblage",
            "Cultural references and sonic signifiers create a semiotic assemblage"
        ];
        
        const deterritorializations = [
            "Sound deterritorializes spatial perception through its immersive qualities",
            "Temporal experience is deterritorialized through rhythmic variations",
            "Familiar sonic elements are deterritorialized through processing and contextualization"
        ];
        
        const lines = {
            molar: [
                "Recognizable musical structures and conventional forms",
                "Established sonic languages and genre conventions"
            ],
            molecular: [
                "Micro-variations in timbre, pitch, and rhythm",
                "Subtle modulations and textural shifts"
            ],
            flight: [
                "Sonic elements that escape categorization or fixed meaning",
                "Moments that break from established patterns and open new possibilities"
            ]
        };
        
        const desiring = {
            machines: [
                "The technical apparatus of sound production and reproduction",
                "The physiological mechanisms of hearing",
                "The cultural machinery of musical categorization"
            ],
            productions: [
                "Production of affective intensities through sound",
                "Production of temporal experience through rhythm and duration",
                "Production of new listening modalities"
            ]
        };
        
        const bodyWithoutOrgans = "The sonic continuum as a field of intensities, prior to organization into fixed structures";
        
        const summary = `This audio piece (${fileName}) functions as a sonic assemblage that generates multiple rhizomatic connections through its temporal unfolding. It operates through the interplay of molar structures and molecular variations, with lines of flight that open toward new listening experiences. The piece can be understood as a sonic body without organs—a field of auditory intensities that resists fixed organization. Through its sonic deterritorializations, it produces new affective and temporal potentials that exceed conventional categorization.`;
        
        return {
            rhizomaticConnections,
            assemblages,
            deterritorializations,
            lines,
            desiring,
            bodyWithoutOrgans,
            summary
        };
    }
    
    /**
     * Analyze film content using Deleuzian concepts
     */
    private analyzeFilm(file: TFile): DeleuzianAnalysisResult {
        // For film, we'll create a placeholder analysis based on the filename
        // In a real implementation, this would analyze the actual film content
        const fileName = file.name;
        
        const rhizomaticConnections = [
            "Visual and sonic elements form non-hierarchical networks across the duration",
            "Temporal connections create unexpected pathways between different moments",
            "Narrative and formal elements establish rhizomatic relationships"
        ];
        
        const assemblages = [
            "The film functions as a time-image assemblage of visual, sonic, and narrative elements",
            "Technical components (camera, editing, sound) form a cinematic assemblage",
            "Cultural references and cinematic language create a semiotic assemblage"
        ];
        
        const deterritorializations = [
            "Cinema deterritorializes spatial and temporal perception",
            "Montage deterritorializes linear temporality through juxtaposition",
            "The frame deterritorializes the visual field through selection and composition"
        ];
        
        const lines = {
            molar: [
                "Recognizable narrative structures and conventional cinematic language",
                "Established genres and representational codes"
            ],
            molecular: [
                "Micro-movements within the frame and subtle rhythmic variations",
                "Affective modulations and atmospheric shifts"
            ],
            flight: [
                "Moments that escape narrative or representational logic",
                "Elements that open toward virtual potentials beyond the actual film"
            ]
        };
        
        const desiring = {
            machines: [
                "The technical apparatus of film production and projection",
                "The perceptual mechanisms of audio-visual processing",
                "The cultural machinery of cinematic reception"
            ],
            productions: [
                "Production of movement-images and time-images",
                "Production of affective intensities through audio-visual means",
                "Production of new perceptual and conceptual possibilities"
            ]
        };
        
        const bodyWithoutOrgans = "The film as a plane of audio-visual intensities, prior to organization into fixed meaning";
        
        const summary = `This film (${fileName}) functions as a cinematic assemblage that generates multiple rhizomatic connections through its temporal unfolding. It operates through the interplay of movement-images and time-images, with lines of flight that open toward new perceptual possibilities. The film can be understood as an audio-visual body without organs—a plane of intensities that resists fixed organization. Through its cinematic deterritorializations, it produces new affective, temporal, and conceptual potentials that exceed conventional categorization.`;
        
        return {
            rhizomaticConnections,
            assemblages,
            deterritorializations,
            lines,
            desiring,
            bodyWithoutOrgans,
            summary
        };
    }
    
    /**
     * Extract themes from text content
     */
    private extractThemes(text: string): string[] {
        // In a real implementation, this would use NLP or other techniques
        // For now, we'll use a simplified approach with keyword matching
        
        const themePatterns: Record<string, RegExp> = {
            desire: /desire|want|wish|crave|yearn|long/i,
            becoming: /becom|transform|chang|evolv|shift|transition/i,
            multiplicity: /multipl|many|various|diverse|different|heterogeneous/i,
            intensity: /intens|strong|powerful|force|energy|vibrant/i,
            flow: /flow|stream|current|movement|flux|continuous/i,
            connection: /connect|relation|link|join|associate|bind/i,
            assemblage: /assembl|gather|collect|arrange|combine|composition/i,
            territory: /territor|space|place|area|region|domain/i,
            machine: /machine|mechanism|apparatus|device|system|function/i,
            rhizome: /rhizome|network|web|mesh|interconnect|root/i
        };
        
        // Identify themes present in the text
        const presentThemes: string[] = [];
        for (const [theme, pattern] of Object.entries(themePatterns)) {
            if (pattern.test(text)) {
                presentThemes.push(theme);
            }
        }
        
        // Return identified themes or defaults if none found
        return presentThemes.length > 0 ? presentThemes : ['desire', 'becoming', 'multiplicity'];
    }
    
    /**
     * Analyze emotional patterns in text
     */
    private analyzeEmotionalPatterns(text: string): string[] {
        // In a real implementation, this would use sentiment analysis
        // For now, we'll use a simplified approach
        
        const patterns: string[] = [];
        
        if (/joy|happy|delight|excite|content|satisf/i.test(text)) {
            patterns.push("flows of joyful affects that increase capacity for action");
        }
        
        if (/sad|depress|melanchol|despair|grief|sorrow/i.test(text)) {
            patterns.push("reactive forces that diminish potential connections");
        }
        
        if (/anger|rage|frustrat|irritat|annoy|resent/i.test(text)) {
            patterns.push("intensive flows redirected through reactive channels");
        }
        
        if (/fear|anxi|worry|concern|dread|terror/i.test(text)) {
            patterns.push("territorializing affects that limit lines of flight");
        }
        
        if (/love|affection|care|compassion|kindness/i.test(text)) {
            patterns.push("connective flows that form new assemblages");
        }
        
        if (/confus|uncertain|ambivalen|unclear|perplex/i.test(text)) {
            patterns.push("deterritorializing forces opening to new possibilities");
        }
        
        // Return identified patterns or a default
        return patterns.length > 0 ? patterns : ["complex affective flows with varying intensities"];
    }
    
    /**
     * Analyze narrative structure in text
     */
    private analyzeNarrativeStructure(text: string): string {
        // Check for different narrative patterns from a Deleuzian perspective
        
        if (/progress|develop|grow|advance|improve/i.test(text)) {
            return "arborescent structure with linear progression";
        }
        
        if (/connect|link|relation|network|web/i.test(text)) {
            return "rhizomatic structure with multiple entry and exit points";
        }
        
        if (/cycle|return|repeat|again|back/i.test(text)) {
            return "circular structure with eternal return of difference";
        }
        
        if (/fragment|piece|section|part|segment/i.test(text)) {
            return "fragmented structure with plateaus of intensity";
        }
        
        if (/layer|level|strata|plane|dimension/i.test(text)) {
            return "stratified structure with different planes of consistency";
        }
        
        // Default
        return "complex assemblage with multiple structural elements";
    }
    
    /**
     * Identify rhizomatic connections in text
     */
    private identifyRhizomaticConnections(text: string, themes: string[]): string[] {
        const connections: string[] = [];
        
        // Generate connections based on identified themes
        if (themes.includes('desire')) {
            connections.push("Flows of desire connect multiple elements without hierarchical organization");
        }
        
        if (themes.includes('becoming')) {
            connections.push("Processes of becoming establish connections between heterogeneous elements");
        }
        
        if (themes.includes('multiplicity')) {
            connections.push("Multiplicities form through non-hierarchical connections between singular elements");
        }
        
        if (themes.includes('flow')) {
            connections.push("Flows of intensity create pathways between different states and experiences");
        }
        
        if (themes.includes('connection')) {
            connections.push("Connective syntheses establish relations between disparate elements");
        }
        
        if (themes.includes('rhizome')) {
            connections.push("Rhizomatic structures link any point to any other point without fixed order");
        }
        
        // Add general rhizomatic connections
        connections.push("Multiple entry and exit points create a map rather than a tracing");
        connections.push("Heterogeneous elements connect without subordination to a unifying structure");
        
        return connections;
    }
    
    /**
     * Identify assemblages in text
     */
    private identifyAssemblages(text: string, themes: string[], emotionalPatterns: string[]): string[] {
        const assemblages: string[] = [];
        
        // Generate assemblages based on identified themes
        if (themes.includes('assemblage')) {
            assemblages.push("Heterogeneous elements form assemblages with emergent properties");
        }
        
        if (themes.includes('machine')) {
            assemblages.push("Machinic assemblages connect bodies, actions, and passions");
        }
        
        if (themes.includes('territory')) {
            assemblages.push("Territorial assemblages establish temporary stability through coding");
        }
        
        // Generate assemblages based on emotional patterns
        if (emotionalPatterns.some(pattern => pattern.includes("joyful"))) {
            assemblages.push("Joyful assemblages increase capacity for action and connection");
        }
        
        if (emotionalPatterns.some(pattern => pattern.includes("reactive"))) {
            assemblages.push("Reactive assemblages restrict flows and limit connections");
        }
        
        // Add general assemblages
        assemblages.push("Content and expression form a double articulation within assemblages");
        assemblages.push("Social, material, and semiotic elements combine in functional assemblages");
        
        return assemblages;
    }
    
    /**
     * Identify deterritorializations in text
     */
    private identifyDeterritorializations(text: string): string[] {
        const deterritorializations: string[] = [];
        
        // Check for patterns of deterritorialization
        if (/change|transform|shift|alter|modify/i.test(text)) {
            deterritorializations.push("Transformative processes deterritorialize fixed identities");
        }
        
        if (/break|disrupt|interrupt|disturb|destabilize/i.test(text)) {
            deterritorializations.push("Disruptive elements deterritorialize established patterns");
        }
        
        if (/escape|flee|avoid|evade|elude/i.test(text)) {
            deterritorializations.push("Lines of flight deterritorialize through escape from fixed structures");
        }
        
        if (/question|challenge|doubt|contest|dispute/i.test(text)) {
            deterritorializations.push("Critical questioning deterritorializes accepted meanings");
        }
        
        if (/create|invent|imagine|generate|produce/i.test(text)) {
            deterritorializations.push("Creative processes deterritorialize through production of the new");
        }
        
        // Add general deterritorializations
        deterritorializations.push("Relative deterritorializations open new connections while maintaining some structure");
        deterritorializations.push("Absolute deterritorializations open onto the plane of immanence");
        
        return deterritorializations;
    }
    
    /**
     * Analyze lines (molar, molecular, flight) in text
     */
    private analyzeLines(text: string): { molar: string[], molecular: string[], flight: string[] } {
        const molar: string[] = [];
        const molecular: string[] = [];
        const flight: string[] = [];
        
        // Identify molar lines
        if (/structure|system|organization|institution|rule|law/i.test(text)) {
            molar.push("Structured systems establish molar lines through rigid segmentation");
        }
        
        if (/identity|category|classification|type|group/i.test(text)) {
            molar.push("Categorical identities form through molar lines of rigid segmentarity");
        }
        
        if (/should|must|have to|need to|require/i.test(text)) {
            molar.push("Normative imperatives establish molar lines of obligation");
        }
        
        // Identify molecular lines
        if (/subtle|slight|minor|small|little/i.test(text)) {
            molecular.push("Subtle variations create molecular lines of supple segmentarity");
        }
        
        if (/flow|flux|shift|drift|slide/i.test(text)) {
            molecular.push("Flowing movements establish molecular lines between segments");
        }
        
        if (/ambiguous|unclear|uncertain|indistinct/i.test(text)) {
            molecular.push("Ambiguous elements form molecular lines that destabilize fixed categories");
        }
        
        // Identify lines of flight
        if (/escape|break|rupture|crack|split/i.test(text)) {
            flight.push("Ruptures create lines of flight that escape established patterns");
        }
        
        if (/create|invent|new|novel|original/i.test(text)) {
            flight.push("Creative innovations establish lines of flight toward new possibilities");
        }
        
        if (/transform|metamorphosis|becoming|change/i.test(text)) {
            flight.push("Transformative becomings trace lines of flight beyond fixed identities");
        }
        
        // Add general lines
        molar.push("Binary oppositions establish molar lines of rigid segmentarity");
        molecular.push("Micropolitical processes operate through molecular lines");
        flight.push("Lines of flight open onto the plane of consistency");
        
        return { molar, molecular, flight };
    }
    
    /**
     * Analyze desiring-production in text
     */
    private analyzeDesiring(text: string): { machines: string[], productions: string[] } {
        const machines: string[] = [];
        const productions: string[] = [];
        
        // Identify desiring-machines
        if (/connect|link|join|attach|couple/i.test(text)) {
            machines.push("Connective syntheses operate through coupling of partial objects");
        }
        
        if (/record|register|inscribe|mark|trace/i.test(text)) {
            machines.push("Disjunctive syntheses record and distribute flows on the body without organs");
        }
        
        if (/consume|use|utilize|employ|experience/i.test(text)) {
            machines.push("Conjunctive syntheses consume intensities as states of becoming");
        }
        
        // Identify productions
        if (/produce|create|generate|make|form/i.test(text)) {
            productions.push("Productive syntheses generate real effects through desiring-production");
        }
        
        if (/transform|convert|change|alter|modify/i.test(text)) {
            productions.push("Transformative processes produce new connections and possibilities");
        }
        
        if (/intensify|strengthen|amplify|increase/i.test(text)) {
            productions.push("Intensive productions amplify affective capacities");
        }
        
        // Add general desiring elements
        machines.push("Desiring-machines function through breaks and flows");
        machines.push("Social machines organize flows of desire through coding");
        productions.push("Desire produces the real through machinic processes");
        productions.push("Production occurs through connection, disjunction, and conjunction");
        
        return { machines, productions };
    }
    
    /**
     * Identify the body without organs in text
     */
    private identifyBodyWithoutOrgans(text: string, narrativeStructure: string): string {
        // Generate a description of the BwO based on the text and narrative structure
        
        if (narrativeStructure.includes("arborescent")) {
            return "The text moves toward a body without organs that resists hierarchical organization, seeking to dismantle the arborescent structure in favor of a plane of consistency.";
        }
        
        if (narrativeStructure.includes("rhizomatic")) {
            return "The text functions as a body without organs—a plane of consistency where intensities circulate and distribute without hierarchical organization, enabling rhizomatic connections.";
        }
        
        if (narrativeStructure.includes("circular")) {
            return "The circular structure forms a body without organs where the eternal return produces difference rather than identity, creating a plane of immanence.";
        }
        
        if (narrativeStructure.includes("fragmented")) {
            return "The fragmented structure creates a body without organs composed of plateaus—regions of continuous intensity that communicate with one another across the plane of consistency.";
        }
        
        if (narrativeStructure.includes("stratified")) {
            return "Beneath the stratified structure lies a body without organs—a destratified plane of consistency that enables deterritorialization and new connections.";
        }
        
        // Default
        return "The text contains a virtual body without organs—an unformed, unorganized plane of consistency where intensities pass and circulate, enabling becomings and transformations.";
    }
    
    /**
     * Generate a summary of the Deleuzian analysis
     */
    private generateSummary(
        rhizomaticConnections: string[],
        assemblages: string[],
        deterritorializations: string[],
        lines: { molar: string[], molecular: string[], flight: string[] },
        desiring: { machines: string[], productions: string[] },
        bodyWithoutOrgans: string
    ): string {
        return `From a Deleuzian perspective, this content operates through rhizomatic connections that link heterogeneous elements without hierarchical organization. It functions as an assemblage where content and expression form a double articulation. The text exhibits processes of deterritorialization that open new possibilities while maintaining some structural coherence. It operates through the interplay of molar lines (rigid segmentarity), molecular lines (supple segmentarity), and lines of flight that escape established patterns. Desiring-production functions through connective, disjunctive, and conjunctive syntheses, generating real effects. ${bodyWithoutOrgans} Through these processes, the content produces new affective intensities and conceptual possibilities that exceed conventional categorization.`;
    }
}
