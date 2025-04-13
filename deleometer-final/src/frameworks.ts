import { MEDIA_TYPES } from './constants';

// Deleuzian analysis result interface
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

// Irigarayian analysis result interface
export interface IrigarayianAnalysisResult {
    sexualDifference: string[];
    feminineSpeaking: string[];
    mimesis: string[];
    fluidLogic: string[];
    mucousExchange: string[];
    divineFeminine: string[];
    ethicalRelation: string[];
    summary: string;
}

// Deleuzian analysis class
export class DeleuzianAnalysis {
    // Rhizomatic connections concepts
    private rhizomes: string[] = [
        "Non-hierarchical connections",
        "Multiple entry points",
        "Heterogeneous elements",
        "Asignifying ruptures",
        "Cartography and decalcomania"
    ];
    
    // Assemblage concepts
    private assemblages: string[] = [
        "Machinic assemblages",
        "Collective assemblages of enunciation",
        "Territorial assemblages",
        "Bodies without organs",
        "Strata and destratification"
    ];
    
    // Deterritorialization concepts
    private deterritorializations: string[] = [
        "Lines of flight",
        "Movements beyond fixed territories",
        "Creative deterritorializations",
        "Nomadic movements",
        "Smooth vs. striated spaces"
    ];
    
    // Lines concepts
    private lines = {
        molar: ["Rigid segmentarity", "Binary oppositions", "State apparatus"],
        molecular: ["Supple segmentarity", "Micropolitical processes", "Minor science"],
        flight: ["Escape from established patterns", "Creative becomings", "Nomadic thought"]
    };
    
    // Desire concepts
    private desiring = {
        machines: ["Connective syntheses", "Disjunctive syntheses", "Conjunctive syntheses"],
        productions: ["Production of the real", "Production of intensities", "Production of recordings"]
    };
    
    // Body without organs concepts
    private bwoDescriptions: string[] = [
        "A plane of consistency where intensities circulate",
        "A surface of intensities before stratification",
        "The unformed, unorganized, non-productive body",
        "The full egg before the extension of the organism",
        "The field of immanence of desire"
    ];
    
    // Analyze content with Deleuzian framework
    analyzeContent(content: string | any, mediaType: string): DeleuzianAnalysisResult {
        // Get random elements from each concept array
        const rhizomaticConnections = this.getRandomElements(this.rhizomes, 2);
        const assemblageElements = this.getRandomElements(this.assemblages, 2);
        const deterElements = this.getRandomElements(this.deterritorializations, 2);
        const molarLines = this.getRandomElements(this.lines.molar, 1);
        const molecularLines = this.getRandomElements(this.lines.molecular, 1);
        const flightLines = this.getRandomElements(this.lines.flight, 1);
        const desiringMachines = this.getRandomElements(this.desiring.machines, 1);
        const desiringProductions = this.getRandomElements(this.desiring.productions, 1);
        const bwo = this.getRandomElements(this.bwoDescriptions, 1)[0];
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From a Deleuzian perspective, this text operates through rhizomatic connections that link heterogeneous elements without hierarchical organization. It functions as an assemblage where content and expression form a double articulation.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image can be analyzed through Deleuzian concepts of rhizomes and assemblages, revealing connections and flows that escape fixed categorization.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "This audio piece creates a sonic assemblage that deterritorializes spatial perception through its immersive qualities.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film can be analyzed through Deleuzian concepts of time-image and movement-image, creating a rhizomatic structure across its duration.";
        }
        
        // Return structured analysis
        return {
            rhizomaticConnections,
            assemblages: assemblageElements,
            deterritorializations: deterElements,
            lines: {
                molar: molarLines,
                molecular: molecularLines,
                flight: flightLines
            },
            desiring: {
                machines: desiringMachines,
                productions: desiringProductions
            },
            bodyWithoutOrgans: bwo,
            summary
        };
    }
    
    // Helper method to get random elements from an array
    private getRandomElements(array: string[], count: number): string[] {
        const result: string[] = [];
        const arrayCopy = [...array];
        
        for (let i = 0; i < count && arrayCopy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * arrayCopy.length);
            result.push(arrayCopy[randomIndex]);
            arrayCopy.splice(randomIndex, 1);
        }
        
        return result;
    }
}

// Irigarayian analysis class
export class IrigarayianAnalysis {
    // Sexual difference concepts
    private sexualDifference: string[] = [
        "Irreducible difference",
        "Positive difference",
        "Sexual difference as constitutive",
        "Beyond binary opposition",
        "Difference not as lack"
    ];
    
    // Feminine speaking concepts
    private feminineSpeaking: string[] = [
        "Non-linear syntax",
        "Fluid expression",
        "Speaking (as) woman",
        "Parler-femme",
        "Disruptive language"
    ];
    
    // Mimesis concepts
    private mimesis: string[] = [
        "Strategic repetition",
        "Subversive mimicry",
        "Mimesis as resistance",
        "Productive mimesis",
        "Mimetic excess"
    ];
    
    // Fluid logic concepts
    private fluidLogic: string[] = [
        "Resistance to fixed categories",
        "Flowing connections",
        "Multiplicity over unity",
        "Mucous as metaphor",
        "Fluidity of meaning"
    ];
    
    // Mucous exchange concepts
    private mucousExchange: string[] = [
        "Embodied relationality",
        "Tactile engagement",
        "Permeable boundaries",
        "Mucous as mediating threshold",
        "Fluid exchange"
    ];
    
    // Divine feminine concepts
    private divineFeminine: string[] = [
        "Horizontal transcendence",
        "Embodied spirituality",
        "Female divine",
        "Sensible transcendental",
        "Divine becoming"
    ];
    
    // Ethical relation concepts
    private ethicalRelation: string[] = [
        "Recognition of otherness",
        "Intersubjective encounter",
        "Ethics of sexual difference",
        "Wonder as ethical stance",
        "Respecting irreducibility"
    ];
    
    // Analyze content with Irigarayian framework
    analyzeContent(content: string | any, mediaType: string): IrigarayianAnalysisResult {
        // Get random elements from each concept array
        const sexDiffElements = this.getRandomElements(this.sexualDifference, 2);
        const femSpeakElements = this.getRandomElements(this.feminineSpeaking, 2);
        const mimesisElements = this.getRandomElements(this.mimesis, 2);
        const fluidElements = this.getRandomElements(this.fluidLogic, 2);
        const mucousElements = this.getRandomElements(this.mucousExchange, 2);
        const divineElements = this.getRandomElements(this.divineFeminine, 2);
        const ethicalElements = this.getRandomElements(this.ethicalRelation, 2);
        
        // Generate summary based on media type
        let summary = "";
        if (mediaType === MEDIA_TYPES.TEXT) {
            summary = "From an Irigarayian perspective, this content engages with sexual difference as irreducible and constitutive of human experience. It speaks in the feminine through a syntax that disrupts the subject-predicate logic of phallogocentric discourse.";
        } else if (mediaType === MEDIA_TYPES.IMAGE) {
            summary = "This image engages with Irigarayian concepts of sexual difference through its visual language, challenging phallogocentric representation.";
        } else if (mediaType === MEDIA_TYPES.AUDIO) {
            summary = "This audio piece engages with Irigarayian concepts of feminine speaking through its sonic qualities, creating a fluid sonic syntax.";
        } else if (mediaType === MEDIA_TYPES.FILM) {
            summary = "This film engages with Irigarayian concepts of sexual difference through its visual and narrative language, creating space for feminine becoming.";
        }
        
        // Return structured analysis
        return {
            sexualDifference: sexDiffElements,
            feminineSpeaking: femSpeakElements,
            mimesis: mimesisElements,
            fluidLogic: fluidElements,
            mucousExchange: mucousElements,
            divineFeminine: divineElements,
            ethicalRelation: ethicalElements,
            summary
        };
    }
    
    // Helper method to get random elements from an array
    private getRandomElements(array: string[], count: number): string[] {
        const result: string[] = [];
        const arrayCopy = [...array];
        
        for (let i = 0; i < count && arrayCopy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * arrayCopy.length);
            result.push(arrayCopy[randomIndex]);
            arrayCopy.splice(randomIndex, 1);
        }
        
        return result;
    }
}
