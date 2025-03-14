import { Plugin, Notice, TFile, moment } from 'obsidian';
import { BigFiveAnalyzer } from './analyzers/bigFive';
import { OpenAI } from 'openai';

export default class AIJournalPlugin extends Plugin {
  private openai: OpenAI;
  private bigFiveAnalyzer: BigFiveAnalyzer;

  async onload() {
    // Initialize OpenAI
    this.openai = new OpenAI({
      apiKey: this.settings.openaiKey,
      dangerouslyAllowBrowser: true,
    });

    // Add "Analyze Entry" button to ribbon
    this.addRibbonIcon('brain-circuit', 'Analyze Journal', async () => {
      const activeFile = this.app.workspace.getActiveFile();
      if (activeFile) {
        const text = await this.app.vault.read(activeFile);
        const analysis = await this.analyzeEntry(text);
        new Notice(`AI Insights: ${analysis.summary}`);
      }
    });

    // Schedule daily reminders
    this.registerInterval(
      window.setInterval(() => this.sendReminder(), 1000 * 60 * 60) // Every hour
    );
  }

  private async analyzeEntry(text: string): Promise<AnalysisResult> {
    // Lacanian/schizoanalysis prompt
    const prompt = `
      Analyze this journal entry from a Lacanian and schizoanalytic perspective.
      Identify emotional patterns and Big Five traits. Format as JSON:
      {
        "summary": "1-2 sentence reflection",
        "bigFive": { "openness": 0-1, "neuroticism": 0-1 },
        "goals": ["Maslow-aligned goal"]
      }
      Journal: ${text}
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);
  }

  private sendReminder() {
    if (moment().hour() === 20) { // 8 PM
      new Notice('🌙 Time for your evening reflection!');
    }
  }
}