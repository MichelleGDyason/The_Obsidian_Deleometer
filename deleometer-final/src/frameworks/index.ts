import { DeleuzianAnalysis, DeleuzianAnalysisResult } from './deleuzian';
import { IrigarayianAnalysis, IrigarayianAnalysisResult } from './irigarayian';
import { TackticalAnalysis, TackticalAnalysisResult } from './tacktical';
import { FreudianAnalysis, FreudianAnalysisResult } from './freudian';
import { LacanianAnalysis, LacanianAnalysisResult } from './lacanian';
import { JungianAnalysis, JungianAnalysisResult } from './jungian';
import { AttachmentAnalysis, AttachmentAnalysisResult } from './attachment';
import { PositiveAnalysis, PositiveAnalysisResult } from './positive';
import { NarrativeAnalysis, NarrativeAnalysisResult } from './narrative';
import { PhenomenologyAnalysis, PhenomenologyAnalysisResult } from './phenomenology';

export {
    DeleuzianAnalysis,
    DeleuzianAnalysisResult,
    IrigarayianAnalysis,
    IrigarayianAnalysisResult,
    TackticalAnalysis,
    TackticalAnalysisResult,
    FreudianAnalysis,
    FreudianAnalysisResult,
    LacanianAnalysis,
    LacanianAnalysisResult,
    JungianAnalysis,
    JungianAnalysisResult,
    AttachmentAnalysis,
    AttachmentAnalysisResult,
    PositiveAnalysis,
    PositiveAnalysisResult,
    NarrativeAnalysis,
    NarrativeAnalysisResult,
    PhenomenologyAnalysis,
    PhenomenologyAnalysisResult
};

// Framework factory to get the appropriate analysis class
export function getFrameworkAnalysis(frameworkId: string): any {
    switch (frameworkId) {
        case 'deleuzian':
            return new DeleuzianAnalysis();
        case 'irigarayian':
            return new IrigarayianAnalysis();
        case 'tacktical':
            return new TackticalAnalysis();
        case 'freudian':
            return new FreudianAnalysis();
        case 'lacanian':
            return new LacanianAnalysis();
        case 'jungian':
            return new JungianAnalysis();
        case 'attachment':
            return new AttachmentAnalysis();
        case 'positive':
            return new PositiveAnalysis();
        case 'narrative':
            return new NarrativeAnalysis();
        case 'phenomenology':
            return new PhenomenologyAnalysis();
        // Add cases for other frameworks as they are implemented
        default:
            throw new Error(`Framework not implemented: ${frameworkId}`);
    }
}
