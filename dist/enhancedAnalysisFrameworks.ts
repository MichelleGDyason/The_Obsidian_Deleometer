/**
 * Enhanced Analysis Frameworks for Deleometer
 * Provides deeper analysis using Freudian, Lacanian, Deleuzian, and Irigarayian theories
 * with actionable next steps recommendations
 */

import { ApiService } from './apiService';
import { UserProfile, RecurringPattern, EdgeCase } from './userProfileSystem';
import { IrigarayianAnalysis, IrigarayianAnalysisResult } from './irigarayianAnalysis';
import { NextStepsRecommendation, NextStepsResult } from './nextStepsRecommendation';
import { JungianAnalysis, JungianAnalysisResult } from './jungianAnalysis';
import { AttachmentAnalysis, AttachmentAnalysisResult } from './attachmentAnalysis';
import { PositiveAnalysis, PositiveAnalysisResult } from './positiveAnalysis';
import { NarrativeAnalysis, NarrativeAnalysisResult } from './narrativeAnalysis';
import { PhenomenologicalAnalysis, PhenomenologicalAnalysisResult } from './phenomenologicalAnalysis';
import { ExistentialistAnalysis, ExistentialistAnalysisResult } from './existentialistAnalysis';
import { FeministAnalysis, FeministAnalysisResult } from './feministAnalysis';
import { CriticalAnalysis, CriticalAnalysisResult } from './criticalAnalysis';
import { PosthumanistAnalysis, PosthumanistAnalysisResult } from './posthumanistAnalysis';
import { BuddhistAnalysis, BuddhistAnalysisResult } from './buddhistAnalysis';
import { ExistentialPsychologyAnalysis, ExistentialPsychologyAnalysisResult } from './existentialPsychologyAnalysis';
import { GestaltAnalysis, GestaltAnalysisResult } from './gestaltAnalysis';
import { TranspersonalAnalysis, TranspersonalAnalysisResult } from './transpersonalAnalysis';
import { CognitiveBehavioralAnalysis, CognitiveBehavioralAnalysisResult } from './cognitiveBehavioralAnalysis';
import { HermeneuticsAnalysis, HermeneuticsAnalysisResult } from './hermeneuticsAnalysis';
import { StoicismAnalysis, StoicismAnalysisResult } from './stoicismAnalysis';
import { NietzscheanAnalysis, NietzscheanAnalysisResult } from './nietzscheanAnalysis';
import { PsychiatryAnalysis, PsychiatryAnalysisResult } from './psychiatryAnalysis';

/**
 * Enhanced Analysis Result
 */
export interface EnhancedAnalysisResult {
  // Basic analysis results
  emotions: Record<string, number>;
  sentiment: number;

  // Metadata
  date: string;
  detailLevel: 'basic' | 'detailed' | 'comprehensive';
  frameworks: ('freudian' | 'lacanian' | 'deleuzian' | 'irigarayian' | 'jungian' | 'attachment' | 'positive' | 'narrative' | 'phenomenological' | 'existentialist' | 'feminist' | 'critical' | 'posthumanist' | 'buddhist' | 'existential-psychology' | 'gestalt' | 'transpersonal' | 'cognitive-behavioral' | 'hermeneutics' | 'stoicism' | 'nietzschean' | 'psychiatry')[];

  // Freudian analysis
  freudianAnalysis: {
    idEgoSuperego: {
      id: string;
      ego: string;
      superego: string;
    };
    defenseMechanisms: string[];
    unconsciousDesires: string[];
    interpretation: string;
    complexes: string[];
    transference: string;
    resistance: string;
  };

  // Lacanian analysis
  lacanianAnalysis: {
    symbolicOrder: string;
    imaginaryOrder: string;
    realOrder: string;
    desireStructures: string;
    signifiers: string[];
    jouissance: string;
    lack: string;
    bigOther: string;
    mirrorStage: string;
  };

  // Deleuzian analysis
  deleuzianAnalysis: {
    rhizomaticPatterns: string;
    deterritorialization: string;
    reterritorialization: string;
    linesOfFlight: string[];
    desireMachines: string;
    bodyWithoutOrgans: string;
    multiplicity: string;
    nomadism: string;
    smoothStriated: string;
  };

  // Detected patterns and edge cases
  detectedPatterns: Partial<RecurringPattern>[];
  detectedEdgeCases: Partial<EdgeCase>[];
  detectedThemes: string[];

  // Personalized insights
  personalizedInsights: string;

  // Irigarayian analysis (optional)
  irigarayianAnalysis?: IrigarayianAnalysisResult;

  // Next steps recommendations (optional)
  nextStepsRecommendations?: NextStepsResult;

  // Jungian analysis (optional)
  jungianAnalysis?: JungianAnalysisResult;

  // Attachment analysis (optional)
  attachmentAnalysis?: AttachmentAnalysisResult;

  // Positive psychology analysis (optional)
  positiveAnalysis?: PositiveAnalysisResult;

  // Narrative analysis (optional)
  narrativeAnalysis?: NarrativeAnalysisResult;

  // Phenomenological analysis (optional)
  phenomenologicalAnalysis?: PhenomenologicalAnalysisResult;

  // Existentialist analysis (optional)
  existentialistAnalysis?: ExistentialistAnalysisResult;

  // Feminist analysis (optional)
  feministAnalysis?: FeministAnalysisResult;

  // Critical analysis (optional)
  criticalAnalysis?: CriticalAnalysisResult;

  // Posthumanist analysis (optional)
  posthumanistAnalysis?: PosthumanistAnalysisResult;

  // Buddhist analysis (optional)
  buddhistAnalysis?: BuddhistAnalysisResult;

  // Existential Psychology analysis (optional)
  existentialPsychologyAnalysis?: ExistentialPsychologyAnalysisResult;

  // Gestalt analysis (optional)
  gestaltAnalysis?: GestaltAnalysisResult;

  // Transpersonal analysis (optional)
  transpersonalAnalysis?: TranspersonalAnalysisResult;

  // Cognitive-Behavioral analysis (optional)
  cognitiveBehavioralAnalysis?: CognitiveBehavioralAnalysisResult;

  // Hermeneutics analysis (optional)
  hermeneuticsAnalysis?: HermeneuticsAnalysisResult;

  // Stoicism analysis (optional)
  stoicismAnalysis?: StoicismAnalysisResult;

  // Nietzschean analysis (optional)
  nietzscheanAnalysis?: NietzscheanAnalysisResult;

  // Psychiatry analysis (optional)
  psychiatryAnalysis?: PsychiatryAnalysisResult;

  // Metadata
  date: string;
  analysisVersion: string;
}

/**
 * Enhanced Analysis Frameworks class
 */
export class EnhancedAnalysisFrameworks {
  private apiService: ApiService;
  private irigarayianAnalysis: IrigarayianAnalysis;
  private nextStepsRecommendation: NextStepsRecommendation;
  private jungianAnalysis: JungianAnalysis;
  private attachmentAnalysis: AttachmentAnalysis;
  private positiveAnalysis: PositiveAnalysis;
  private narrativeAnalysis: NarrativeAnalysis;
  private phenomenologicalAnalysis: PhenomenologicalAnalysis;
  private existentialistAnalysis: ExistentialistAnalysis;
  private feministAnalysis: FeministAnalysis;
  private criticalAnalysis: CriticalAnalysis;
  private posthumanistAnalysis: PosthumanistAnalysis;
  private buddhistAnalysis: BuddhistAnalysis;
  private existentialPsychologyAnalysis: ExistentialPsychologyAnalysis;
  private gestaltAnalysis: GestaltAnalysis;
  private transpersonalAnalysis: TranspersonalAnalysis;
  private cognitiveBehavioralAnalysis: CognitiveBehavioralAnalysis;
  private hermeneuticsAnalysis: HermeneuticsAnalysis;
  private stoicismAnalysis: StoicismAnalysis;
  private nietzscheanAnalysis: NietzscheanAnalysis;
  private psychiatryAnalysis: PsychiatryAnalysis;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
    this.irigarayianAnalysis = new IrigarayianAnalysis(apiService);
    this.nextStepsRecommendation = new NextStepsRecommendation(apiService);
    this.jungianAnalysis = new JungianAnalysis(apiService);
    this.attachmentAnalysis = new AttachmentAnalysis(apiService);
    this.positiveAnalysis = new PositiveAnalysis(apiService);
    this.narrativeAnalysis = new NarrativeAnalysis(apiService);
    this.phenomenologicalAnalysis = new PhenomenologicalAnalysis(apiService);
    this.existentialistAnalysis = new ExistentialistAnalysis(apiService);
    this.feministAnalysis = new FeministAnalysis(apiService);
    this.criticalAnalysis = new CriticalAnalysis(apiService);
    this.posthumanistAnalysis = new PosthumanistAnalysis(apiService);
    this.buddhistAnalysis = new BuddhistAnalysis(apiService);
    this.existentialPsychologyAnalysis = new ExistentialPsychologyAnalysis(apiService);
    this.gestaltAnalysis = new GestaltAnalysis(apiService);
    this.transpersonalAnalysis = new TranspersonalAnalysis(apiService);
    this.cognitiveBehavioralAnalysis = new CognitiveBehavioralAnalysis(apiService);
    this.hermeneuticsAnalysis = new HermeneuticsAnalysis(apiService);
    this.stoicismAnalysis = new StoicismAnalysis(apiService);
    this.nietzscheanAnalysis = new NietzscheanAnalysis(apiService);
    this.psychiatryAnalysis = new PsychiatryAnalysis(apiService);
  }

  /**
   * Performs an enhanced analysis of text
   * @param text The text to analyze
   * @param userProfile The user profile
   * @returns Promise<EnhancedAnalysisResult> The analysis result
   */
  public async analyzeText(text: string, userProfile: UserProfile | null, options?: {
    includeIrigarayian?: boolean;
    includeNextSteps?: boolean;
    includeJungian?: boolean;
    includeAttachment?: boolean;
    includePositive?: boolean;
    includeNarrative?: boolean;
    includePhenomenological?: boolean;
    includeExistentialist?: boolean;
    includeFeminist?: boolean;
    includeCritical?: boolean;
    includePosthumanist?: boolean;
    includeBuddhist?: boolean;
    includeExistentialPsychology?: boolean;
    includeGestalt?: boolean;
    includeTranspersonal?: boolean;
    includeCognitiveBehavioral?: boolean;
    includeHermeneutics?: boolean;
    includeStoicism?: boolean;
    includeNietzschean?: boolean;
    includePsychiatry?: boolean;
  }): Promise<EnhancedAnalysisResult> {
    try {
      // Create a personalized prompt based on the user profile
      const prompt = this.createPersonalizedPrompt(text, userProfile);

      // Get completion from the API
      const response = await this.apiService.getCompletion(prompt, {
        responseFormat: 'json_object'
      });

      // Parse the response
      const result = this.parseResponse(response);

      // Add Irigarayian analysis if requested
      if (options?.includeIrigarayian) {
        const irigarayianResult = await this.irigarayianAnalysis.analyzeText(text, userProfile);
        result.irigarayianAnalysis = irigarayianResult;

        // Add Irigarayian to frameworks list
        if (!result.frameworks.includes('irigarayian')) {
          result.frameworks.push('irigarayian');
        }
      }

      // Add next steps recommendations if requested
      if (options?.includeNextSteps) {
        const nextStepsResult = await this.nextStepsRecommendation.generateRecommendations(
          text,
          result,
          result.irigarayianAnalysis || null,
          userProfile
        );
        result.nextStepsRecommendations = nextStepsResult;
      }

      // Add Jungian analysis if requested
      if (options?.includeJungian) {
        const jungianResult = await this.jungianAnalysis.analyzeText(text, userProfile);
        result.jungianAnalysis = jungianResult;

        // Add Jungian to frameworks list
        if (!result.frameworks.includes('jungian')) {
          result.frameworks.push('jungian');
        }
      }

      // Add Attachment analysis if requested
      if (options?.includeAttachment) {
        const attachmentResult = await this.attachmentAnalysis.analyzeText(text, userProfile);
        result.attachmentAnalysis = attachmentResult;

        // Add Attachment to frameworks list
        if (!result.frameworks.includes('attachment')) {
          result.frameworks.push('attachment');
        }
      }

      // Add Positive psychology analysis if requested
      if (options?.includePositive) {
        const positiveResult = await this.positiveAnalysis.analyzeText(text, userProfile);
        result.positiveAnalysis = positiveResult;

        // Add Positive to frameworks list
        if (!result.frameworks.includes('positive')) {
          result.frameworks.push('positive');
        }
      }

      // Add Narrative analysis if requested
      if (options?.includeNarrative) {
        const narrativeResult = await this.narrativeAnalysis.analyzeText(text, userProfile);
        result.narrativeAnalysis = narrativeResult;

        // Add Narrative to frameworks list
        if (!result.frameworks.includes('narrative')) {
          result.frameworks.push('narrative');
        }
      }

      // Add Phenomenological analysis if requested
      if (options?.includePhenomenological) {
        const phenomenologicalResult = await this.phenomenologicalAnalysis.analyzeText(text, userProfile);
        result.phenomenologicalAnalysis = phenomenologicalResult;

        // Add Phenomenological to frameworks list
        if (!result.frameworks.includes('phenomenological')) {
          result.frameworks.push('phenomenological');
        }
      }

      // Add Existentialist analysis if requested
      if (options?.includeExistentialist) {
        const existentialistResult = await this.existentialistAnalysis.analyzeText(text, userProfile);
        result.existentialistAnalysis = existentialistResult;

        // Add Existentialist to frameworks list
        if (!result.frameworks.includes('existentialist')) {
          result.frameworks.push('existentialist');
        }
      }

      // Add Feminist analysis if requested
      if (options?.includeFeminist) {
        const feministResult = await this.feministAnalysis.analyzeText(text, userProfile);
        result.feministAnalysis = feministResult;

        // Add Feminist to frameworks list
        if (!result.frameworks.includes('feminist')) {
          result.frameworks.push('feminist');
        }
      }

      // Add Critical analysis if requested
      if (options?.includeCritical) {
        const criticalResult = await this.criticalAnalysis.analyzeText(text, userProfile);
        result.criticalAnalysis = criticalResult;

        // Add Critical to frameworks list
        if (!result.frameworks.includes('critical')) {
          result.frameworks.push('critical');
        }
      }

      // Add Posthumanist analysis if requested
      if (options?.includePosthumanist) {
        const posthumanistResult = await this.posthumanistAnalysis.analyzeText(text, userProfile);
        result.posthumanistAnalysis = posthumanistResult;

        // Add Posthumanist to frameworks list
        if (!result.frameworks.includes('posthumanist')) {
          result.frameworks.push('posthumanist');
        }
      }

      // Add Buddhist analysis if requested
      if (options?.includeBuddhist) {
        const buddhistResult = await this.buddhistAnalysis.analyzeText(text, userProfile);
        result.buddhistAnalysis = buddhistResult;

        // Add Buddhist to frameworks list
        if (!result.frameworks.includes('buddhist')) {
          result.frameworks.push('buddhist');
        }
      }

      // Add Existential Psychology analysis if requested
      if (options?.includeExistentialPsychology) {
        const existentialPsychologyResult = await this.existentialPsychologyAnalysis.analyzeText(text, userProfile);
        result.existentialPsychologyAnalysis = existentialPsychologyResult;

        // Add Existential Psychology to frameworks list
        if (!result.frameworks.includes('existential-psychology')) {
          result.frameworks.push('existential-psychology');
        }
      }

      // Add Gestalt analysis if requested
      if (options?.includeGestalt) {
        const gestaltResult = await this.gestaltAnalysis.analyzeText(text, userProfile);
        result.gestaltAnalysis = gestaltResult;

        // Add Gestalt to frameworks list
        if (!result.frameworks.includes('gestalt')) {
          result.frameworks.push('gestalt');
        }
      }

      // Add Transpersonal analysis if requested
      if (options?.includeTranspersonal) {
        const transpersonalResult = await this.transpersonalAnalysis.analyzeText(text, userProfile);
        result.transpersonalAnalysis = transpersonalResult;

        // Add Transpersonal to frameworks list
        if (!result.frameworks.includes('transpersonal')) {
          result.frameworks.push('transpersonal');
        }
      }

      // Add Cognitive-Behavioral analysis if requested
      if (options?.includeCognitiveBehavioral) {
        const cognitiveBehavioralResult = await this.cognitiveBehavioralAnalysis.analyzeText(text, userProfile);
        result.cognitiveBehavioralAnalysis = cognitiveBehavioralResult;

        // Add Cognitive-Behavioral to frameworks list
        if (!result.frameworks.includes('cognitive-behavioral')) {
          result.frameworks.push('cognitive-behavioral');
        }
      }

      // Add Hermeneutics analysis if requested
      if (options?.includeHermeneutics) {
        const hermeneuticsResult = await this.hermeneuticsAnalysis.analyzeText(text, userProfile);
        result.hermeneuticsAnalysis = hermeneuticsResult;

        // Add Hermeneutics to frameworks list
        if (!result.frameworks.includes('hermeneutics')) {
          result.frameworks.push('hermeneutics');
        }
      }

      // Add Stoicism analysis if requested
      if (options?.includeStoicism) {
        const stoicismResult = await this.stoicismAnalysis.analyzeText(text, userProfile);
        result.stoicismAnalysis = stoicismResult;

        // Add Stoicism to frameworks list
        if (!result.frameworks.includes('stoicism')) {
          result.frameworks.push('stoicism');
        }
      }

      // Add Nietzschean analysis if requested
      if (options?.includeNietzschean) {
        const nietzscheanResult = await this.nietzscheanAnalysis.analyzeText(text, userProfile);
        result.nietzscheanAnalysis = nietzscheanResult;

        // Add Nietzschean to frameworks list
        if (!result.frameworks.includes('nietzschean')) {
          result.frameworks.push('nietzschean');
        }
      }

      // Add Psychiatry analysis if requested
      if (options?.includePsychiatry) {
        const psychiatryResult = await this.psychiatryAnalysis.analyzeText(text, userProfile);
        result.psychiatryAnalysis = psychiatryResult;

        // Add Psychiatry to frameworks list
        if (!result.frameworks.includes('psychiatry')) {
          result.frameworks.push('psychiatry');
        }
      }

      return result;
    } catch (error) {
      console.error('Error in enhanced analysis:', error);
      throw new Error(`Enhanced analysis failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Creates a personalized prompt based on the user profile
   * @param text The text to analyze
   * @param userProfile The user profile
   * @returns string The personalized prompt
   */
  private createPersonalizedPrompt(text: string, userProfile: UserProfile | null): string {
    let prompt = `Analyze the following journal entry using Freudian psychoanalysis, Lacanian psychoanalysis, and Deleuzian schizoanalysis. Provide deep, nuanced insights that go beyond surface-level analysis.

Journal Entry:
${text}

`;

    // Add user profile information if available
    if (userProfile) {
      prompt += `\nUser Profile Information:
- Emotional Baseline: ${JSON.stringify(userProfile.emotionalBaseline)}
- Personality Baseline: ${JSON.stringify(userProfile.personalityBaseline)}
- Common Themes: ${userProfile.commonThemes.join(', ')}
- Recurring Patterns: ${userProfile.recurringPatterns.length} patterns identified
- Edge Cases: ${userProfile.edgeCases.length} edge cases detected
- Analysis Preferences: Detail Level: ${userProfile.analysisPreferences.detailLevel}, Focus Areas: ${userProfile.analysisPreferences.focusAreas.join(', ')}
`;

      // Add information about recurring patterns
      if (userProfile.recurringPatterns.length > 0) {
        prompt += '\nRecurring Patterns:\n';
        for (const pattern of userProfile.recurringPatterns.slice(0, 3)) { // Limit to 3 patterns
          prompt += `- ${pattern.name}: ${pattern.description} (${pattern.occurrences} occurrences)\n`;
        }
      }

      // Add information about edge cases
      if (userProfile.edgeCases.length > 0) {
        prompt += '\nPrevious Edge Cases:\n';
        for (const edgeCase of userProfile.edgeCases.slice(0, 3)) { // Limit to 3 edge cases
          prompt += `- ${edgeCase.description}\n`;
        }
      }
    }

    prompt += `\nProvide a comprehensive analysis with the following components:

1. Emotional Analysis:
   - Identify and quantify emotions (joy, sadness, anger, fear, surprise) on a scale of 0-10
   - Calculate overall sentiment (-1 to 1)

2. Freudian Analysis:
   - Id/Ego/Superego dynamics
   - Defense mechanisms
   - Unconscious desires
   - Interpretation
   - Complexes
   - Transference
   - Resistance

3. Lacanian Analysis:
   - Symbolic Order
   - Imaginary Order
   - Real Order
   - Desire structures
   - Signifiers
   - Jouissance
   - Lack
   - Big Other
   - Mirror Stage

4. Deleuzian Analysis:
   - Rhizomatic patterns
   - Deterritorialization
   - Reterritorialization
   - Lines of flight
   - Desire-machines
   - Body without Organs
   - Multiplicity
   - Nomadism
   - Smooth/Striated spaces

5. Pattern Detection:
   - Identify recurring patterns
   - Detect potential edge cases
   - Extract themes

6. Personalized Insights:
   - Provide tailored insights based on the user's profile and history

Format the response as a JSON object with the following structure:
{
  "emotions": { "joy": number, "sadness": number, "anger": number, "fear": number, "surprise": number },
  "sentiment": number,

  "freudianAnalysis": {
    "idEgoSuperego": { "id": string, "ego": string, "superego": string },
    "defenseMechanisms": string[],
    "unconsciousDesires": string[],
    "interpretation": string,
    "complexes": string[],
    "transference": string,
    "resistance": string
  },

  "lacanianAnalysis": {
    "symbolicOrder": string,
    "imaginaryOrder": string,
    "realOrder": string,
    "desireStructures": string,
    "signifiers": string[],
    "jouissance": string,
    "lack": string,
    "bigOther": string,
    "mirrorStage": string
  },

  "deleuzianAnalysis": {
    "rhizomaticPatterns": string,
    "deterritorialization": string,
    "reterritorialization": string,
    "linesOfFlight": string[],
    "desireMachines": string,
    "bodyWithoutOrgans": string,
    "multiplicity": string,
    "nomadism": string,
    "smoothStriated": string
  },

  "detectedPatterns": [
    { "name": string, "description": string, "theoreticalFramework": string, "theoreticalConcepts": string[] }
  ],

  "detectedEdgeCases": [
    { "description": string, "context": string, "resolution": string, "theoreticalFramework": string, "theoreticalConcepts": string[] }
  ],

  "detectedThemes": string[],

  "personalizedInsights": string
}

Be extremely thorough and nuanced in your analysis. Look for subtle patterns and connections. Apply the theoretical frameworks in a sophisticated way that demonstrates deep understanding of the theories. Tailor the analysis to this specific user based on their profile information.`;

    return prompt;
  }

  /**
   * Parses the API response into an EnhancedAnalysisResult
   * @param response The API response
   * @returns EnhancedAnalysisResult The analysis result
   */
  private parseResponse(response: any): EnhancedAnalysisResult {
    // Ensure we have a valid response
    if (!response) {
      throw new Error('Invalid response from API');
    }

    // Create a default result
    const result: EnhancedAnalysisResult = {
      emotions: response.emotions || {},
      sentiment: response.sentiment || 0,

      freudianAnalysis: response.freudianAnalysis || {
        idEgoSuperego: { id: '', ego: '', superego: '' },
        defenseMechanisms: [],
        unconsciousDesires: [],
        interpretation: '',
        complexes: [],
        transference: '',
        resistance: ''
      },

      lacanianAnalysis: response.lacanianAnalysis || {
        symbolicOrder: '',
        imaginaryOrder: '',
        realOrder: '',
        desireStructures: '',
        signifiers: [],
        jouissance: '',
        lack: '',
        bigOther: '',
        mirrorStage: ''
      },

      deleuzianAnalysis: response.deleuzianAnalysis || {
        rhizomaticPatterns: '',
        deterritorialization: '',
        reterritorialization: '',
        linesOfFlight: [],
        desireMachines: '',
        bodyWithoutOrgans: '',
        multiplicity: '',
        nomadism: '',
        smoothStriated: ''
      },

      detectedPatterns: response.detectedPatterns || [],
      detectedEdgeCases: response.detectedEdgeCases || [],
      detectedThemes: response.detectedThemes || [],

      personalizedInsights: response.personalizedInsights || '',

      date: new Date().toISOString(),
      analysisVersion: '2.0.0'
    };

    return result;
  }

  /**
   * Generates a summary of the analysis
   * @param result The analysis result
   * @returns string The summary
   */
  public generateSummary(result: EnhancedAnalysisResult): string {
    let summary = `# Analysis Summary\n\n`;

    // Add emotional analysis
    summary += `## Emotional Analysis\n\n`;
    for (const [emotion, value] of Object.entries(result.emotions)) {
      summary += `- ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${value}/10\n`;
    }
    summary += `- Overall Sentiment: ${result.sentiment.toFixed(2)}\n\n`;

    // Add Freudian analysis
    summary += `## Freudian Analysis\n\n`;
    summary += `### Id/Ego/Superego\n`;
    summary += `- **Id**: ${result.freudianAnalysis.idEgoSuperego.id}\n`;
    summary += `- **Ego**: ${result.freudianAnalysis.idEgoSuperego.ego}\n`;
    summary += `- **Superego**: ${result.freudianAnalysis.idEgoSuperego.superego}\n\n`;

    summary += `### Defense Mechanisms\n`;
    for (const mechanism of result.freudianAnalysis.defenseMechanisms) {
      summary += `- ${mechanism}\n`;
    }
    summary += `\n`;

    summary += `### Interpretation\n${result.freudianAnalysis.interpretation}\n\n`;

    // Add Lacanian analysis
    summary += `## Lacanian Analysis\n\n`;
    summary += `### Symbolic Order\n${result.lacanianAnalysis.symbolicOrder}\n\n`;
    summary += `### Desire Structures\n${result.lacanianAnalysis.desireStructures}\n\n`;
    summary += `### Signifiers\n`;
    for (const signifier of result.lacanianAnalysis.signifiers) {
      summary += `- ${signifier}\n`;
    }
    summary += `\n`;

    // Add Deleuzian analysis
    summary += `## Deleuzian Analysis\n\n`;
    summary += `### Rhizomatic Patterns\n${result.deleuzianAnalysis.rhizomaticPatterns}\n\n`;
    summary += `### Deterritorialization\n${result.deleuzianAnalysis.deterritorialization}\n\n`;
    summary += `### Lines of Flight\n`;
    for (const line of result.deleuzianAnalysis.linesOfFlight) {
      summary += `- ${line}\n`;
    }
    summary += `\n`;

    // Add detected patterns
    summary += `## Detected Patterns\n\n`;
    for (const pattern of result.detectedPatterns) {
      summary += `### ${pattern.name}\n`;
      summary += `${pattern.description}\n\n`;
    }

    // Add personalized insights
    summary += `## Personalized Insights\n\n`;
    summary += `${result.personalizedInsights}\n\n`;

    // Add Jungian analysis if available
    if (result.jungianAnalysis) {
      summary += `## Jungian Analysis\n\n`;
      summary += `### Archetypes\n`;
      summary += `- **Persona**: ${result.jungianAnalysis.archetypes.persona}\n`;
      summary += `- **Shadow**: ${result.jungianAnalysis.archetypes.shadow}\n`;
      summary += `- **Self**: ${result.jungianAnalysis.archetypes.self}\n\n`;

      summary += `### Individuation\n${result.jungianAnalysis.individuation.currentStage}\n\n`;

      summary += `### Key Symbols\n`;
      for (const symbol of result.jungianAnalysis.keySymbols) {
        summary += `- ${symbol}\n`;
      }
      summary += `\n`;
    }

    // Add Attachment analysis if available
    if (result.attachmentAnalysis) {
      summary += `## Attachment Analysis\n\n`;
      summary += `### Attachment Style\n`;
      summary += `- **Primary Style**: ${result.attachmentAnalysis.attachmentStyle.primaryStyle}\n`;
      if (result.attachmentAnalysis.attachmentStyle.secondaryStyle) {
        summary += `- **Secondary Style**: ${result.attachmentAnalysis.attachmentStyle.secondaryStyle}\n`;
      }
      summary += `- **Description**: ${result.attachmentAnalysis.attachmentStyle.styleDescription}\n\n`;

      summary += `### Internal Working Models\n${result.attachmentAnalysis.internalWorkingModels.selfModel}\n\n`;

      summary += `### Key Attachment Indicators\n`;
      for (const indicator of result.attachmentAnalysis.keyAttachmentIndicators) {
        summary += `- ${indicator}\n`;
      }
      summary += `\n`;
    }

    // Add Positive psychology analysis if available
    if (result.positiveAnalysis) {
      summary += `## Positive Psychology Analysis\n\n`;
      summary += `### Character Strengths\n`;
      summary += `**Top Strengths**:\n`;
      for (const strength of result.positiveAnalysis.characterStrengths.topStrengths) {
        summary += `- ${strength}\n`;
      }
      summary += `\n`;

      summary += `### PERMA Model\n`;
      summary += `- **Positive Emotions**: ${result.positiveAnalysis.permaModel.positiveEmotions}\n`;
      summary += `- **Engagement**: ${result.positiveAnalysis.permaModel.engagement}\n`;
      summary += `- **Relationships**: ${result.positiveAnalysis.permaModel.relationships}\n`;
      summary += `- **Meaning**: ${result.positiveAnalysis.permaModel.meaning}\n`;
      summary += `- **Accomplishment**: ${result.positiveAnalysis.permaModel.accomplishment}\n\n`;

      summary += `### Well-Being Recommendations\n`;
      for (const recommendation of result.positiveAnalysis.wellBeingRecommendations) {
        summary += `- ${recommendation}\n`;
      }
      summary += `\n`;
    }

    // Add other frameworks as needed...
    // For brevity, we'll just add a few key ones and mention the rest

    // Add Buddhist analysis if available
    if (result.buddhistAnalysis) {
      summary += `## Buddhist Philosophy Analysis\n\n`;
      summary += `### Four Noble Truths\n`;
      summary += `- **Suffering Presence**: ${result.buddhistAnalysis.fourNobleTruths.sufferingPresence}\n`;
      summary += `- **Path Analysis**: ${result.buddhistAnalysis.fourNobleTruths.pathAnalysis}\n\n`;

      summary += `### Mindfulness and Awareness\n${result.buddhistAnalysis.mindfulnessAndAwareness.presentMomentAwareness}\n\n`;

      summary += `### Buddhist Recommendations\n`;
      for (const recommendation of result.buddhistAnalysis.buddhistRecommendations) {
        summary += `- ${recommendation}\n`;
      }
      summary += `\n`;
    }

    // Add a note about other frameworks
    if (result.frameworks.length > 5) {
      summary += `## Additional Frameworks\n\n`;
      summary += `This analysis also includes insights from the following frameworks:\n`;

      const shownFrameworks = ['freudian', 'lacanian', 'deleuzian', 'jungian', 'buddhist'];
      const additionalFrameworks = result.frameworks.filter(f => !shownFrameworks.includes(f));

      for (const framework of additionalFrameworks) {
        summary += `- ${framework.charAt(0).toUpperCase() + framework.slice(1)}\n`;
      }
      summary += `\nFor complete details on these frameworks, please view the full analysis.\n\n`;
    }

    return summary;
  }
}
