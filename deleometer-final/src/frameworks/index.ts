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
import { ExistentialAnalysis, ExistentialAnalysisResult } from './existential';
import { FeministAnalysis, FeministAnalysisResult } from './feminist';
import { CriticalAnalysis, CriticalAnalysisResult } from './critical';
import { PosthumanismAnalysis, PosthumanismAnalysisResult } from './posthumanism';
import { BuddhistAnalysis, BuddhistAnalysisResult } from './buddhist';
import { NietzscheanAnalysis, NietzscheanAnalysisResult } from './nietzschean';
import { GestaltAnalysis, GestaltAnalysisResult } from './gestalt';
import { TranspersonalAnalysis, TranspersonalAnalysisResult } from './transpersonal';
import { CbtAnalysis, CbtAnalysisResult } from './cbt';
import { HermeneuticsAnalysis, HermeneuticsAnalysisResult } from './hermeneutics';
import { StoicismAnalysis, StoicismAnalysisResult } from './stoicism';
import { PsychiatryAnalysis, PsychiatryAnalysisResult } from './psychiatry';
import { EpicureanAnalysis, EpicureanAnalysisResult } from './epicurean';

// Export classes
export {
    DeleuzianAnalysis,
    IrigarayianAnalysis,
    TackticalAnalysis,
    FreudianAnalysis,
    LacanianAnalysis,
    JungianAnalysis,
    AttachmentAnalysis,
    PositiveAnalysis,
    NarrativeAnalysis,
    PhenomenologyAnalysis,
    ExistentialAnalysis,
    FeministAnalysis,
    CriticalAnalysis,
    PosthumanismAnalysis,
    BuddhistAnalysis,
    NietzscheanAnalysis,
    GestaltAnalysis,
    TranspersonalAnalysis,
    CbtAnalysis,
    HermeneuticsAnalysis,
    StoicismAnalysis,
    PsychiatryAnalysis,
    EpicureanAnalysis
};

// Export interfaces
export type {
    DeleuzianAnalysisResult,
    IrigarayianAnalysisResult,
    TackticalAnalysisResult,
    FreudianAnalysisResult,
    LacanianAnalysisResult,
    JungianAnalysisResult,
    AttachmentAnalysisResult,
    PositiveAnalysisResult,
    NarrativeAnalysisResult,
    PhenomenologyAnalysisResult,
    ExistentialAnalysisResult,
    FeministAnalysisResult,
    CriticalAnalysisResult,
    PosthumanismAnalysisResult,
    BuddhistAnalysisResult,
    NietzscheanAnalysisResult,
    GestaltAnalysisResult,
    TranspersonalAnalysisResult,
    CbtAnalysisResult,
    HermeneuticsAnalysisResult,
    StoicismAnalysisResult,
    PsychiatryAnalysisResult,
    EpicureanAnalysisResult
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
        case 'existential':
            return new ExistentialAnalysis();
        case 'feminist':
            return new FeministAnalysis();
        case 'critical':
            return new CriticalAnalysis();
        case 'posthumanism':
            return new PosthumanismAnalysis();
        case 'buddhist':
            return new BuddhistAnalysis();
        case 'nietzschean':
            return new NietzscheanAnalysis();
        case 'gestalt':
            return new GestaltAnalysis();
        case 'transpersonal':
            return new TranspersonalAnalysis();
        case 'cbt':
            return new CbtAnalysis();
        case 'hermeneutics':
            return new HermeneuticsAnalysis();
        case 'stoicism':
            return new StoicismAnalysis();
        case 'psychiatry':
            return new PsychiatryAnalysis();
        case 'epicurean':
            return new EpicureanAnalysis();
        default:
            throw new Error(`Framework not implemented: ${frameworkId}`);
    }
}
