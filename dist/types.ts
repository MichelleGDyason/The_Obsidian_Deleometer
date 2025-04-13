export interface FreudianConcept {
  name: string;
  description: string;
  examples: string[];
}

export interface DefenseMechanism {
  name: string;
  description: string;
  examples: string[];
}

export interface EmotionData {
  [key: string]: number;
}

export interface PersonalityTrait {
  [key: string]: number;
}

export interface AnalysisResult {
  emotions: EmotionData;
  psychoanalyticResponse: string;
  personalityInsights: PersonalityTrait;
  date: string;
}
