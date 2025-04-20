import { MEDIA_TYPES } from '../constants';

// Interface for predefined analyses
export interface PredefinedAnalyses {
    [mediaType: string]: string;
}

// Import predefined analyses
import { deleuzianAnalyses } from './deleuzian';
import { irigarayianAnalyses } from './irigarayian';
import { freudianAnalyses } from './freudian';
import { lacanianAnalyses } from './lacanian';
import { epicureanAnalyses } from './epicurean';
import { attachmentAnalyses } from './attachment';
import { buddhistAnalyses } from './buddhist';
import { cbtAnalyses } from './cbt';
import { criticalAnalyses } from './critical';
import { existentialAnalyses } from './existential';
import { feministAnalyses } from './feminist';
import { gestaltAnalyses } from './gestalt';
import { hermeneuticsAnalyses } from './hermeneutics';
import { jungianAnalyses } from './jungian';
import { narrativeAnalyses } from './narrative';
import { nietzscheanAnalyses } from './nietzschean';
import { phenomenologyAnalyses } from './phenomenology';
import { positiveAnalyses } from './positive';
import { posthumanismAnalyses } from './posthumanism';
import { psychiatryAnalyses } from './psychiatry';
import { stoicismAnalyses } from './stoicism';
import { tackticalAnalyses } from './tacktical';
import { transpersonalAnalyses } from './transpersonal';

// Map of framework IDs to predefined analyses
export const predefinedAnalyses: Record<string, PredefinedAnalyses> = {
    'deleuzian': deleuzianAnalyses,
    'irigarayian': irigarayianAnalyses,
    'freudian': freudianAnalyses,
    'lacanian': lacanianAnalyses,
    'epicurean': epicureanAnalyses,
    'attachment': attachmentAnalyses,
    'buddhist': buddhistAnalyses,
    'cbt': cbtAnalyses,
    'critical': criticalAnalyses,
    'existential': existentialAnalyses,
    'feminist': feministAnalyses,
    'gestalt': gestaltAnalyses,
    'hermeneutics': hermeneuticsAnalyses,
    'jungian': jungianAnalyses,
    'narrative': narrativeAnalyses,
    'nietzschean': nietzscheanAnalyses,
    'phenomenology': phenomenologyAnalyses,
    'positive': positiveAnalyses,
    'posthumanism': posthumanismAnalyses,
    'psychiatry': psychiatryAnalyses,
    'stoicism': stoicismAnalyses,
    'tacktical': tackticalAnalyses,
    'transpersonal': transpersonalAnalyses
};

/**
 * Get a predefined analysis for a framework and media type
 * @param frameworkId The ID of the framework
 * @param mediaType The media type
 * @returns The predefined analysis text, or undefined if not found
 */
export function getPredefinedAnalysis(frameworkId: string, mediaType: string): string | undefined {
    return predefinedAnalyses[frameworkId]?.[mediaType];
}

/**
 * Check if a framework has predefined analyses
 * @param frameworkId The ID of the framework
 * @returns True if the framework has predefined analyses, false otherwise
 */
export function hasPredefinedAnalyses(frameworkId: string): boolean {
    return frameworkId in predefinedAnalyses;
}

/**
 * Generate a generic analysis for a framework and media type
 * @param frameworkId The ID of the framework
 * @param mediaType The media type
 * @param fileName The name of the file being analyzed
 * @param frameworkName The display name of the framework
 * @returns A generic analysis text
 */
export function generateGenericAnalysis(
    frameworkId: string,
    mediaType: string,
    fileName: string,
    frameworkName: string
): string {
    return `This ${mediaType} "${fileName}" can be analyzed through the lens of ${frameworkName} to reveal insights about its structure, content, and meaning. The analysis would consider the specific theoretical concepts and methodologies of this framework to interpret the work's significance and implications. Multiple elements of the ${mediaType} demonstrate principles central to this theoretical approach. The relationship between form and content reveals deeper patterns that align with key concepts from this framework. This analysis opens up new perspectives on how the ${mediaType} functions within broader cultural and psychological contexts. The ${mediaType}'s impact can be understood through this framework's unique interpretive lens.`;
}
