# Deleometer Developer Guide

This guide provides information for developers who want to contribute to the Deleometer plugin or understand its architecture.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Key Components](#key-components)
4. [Development Setup](#development-setup)
5. [Building the Plugin](#building-the-plugin)
6. [Testing](#testing)
7. [Contributing](#contributing)

## Architecture Overview

Deleometer is built as an Obsidian plugin using TypeScript. It follows a modular architecture with the following key components:

1. **Main Plugin Class**: Handles plugin initialization, commands, and settings
2. **NLP Engine**: Processes journal entries and extracts insights
3. **Visualization**: Renders charts and visualizations
4. **Dashboard**: Provides an interactive view of analysis data
5. **Template System**: Manages templates for different analysis types
6. **Daily Notes Integration**: Integrates with Obsidian's daily notes plugin

The plugin uses OpenAI's API for natural language processing and Chart.js for data visualization.

## Project Structure

```
deleometer/
├── main.ts                 # Main plugin class
├── manifest.json           # Plugin manifest
├── styles.css              # CSS styles
├── apiService.ts           # API service for OpenAI integration
├── dashboardView.ts        # Dashboard view
├── dailyNotesIntegration.ts # Daily notes integration
├── freudianAnalysis.ts     # Freudian analysis module
├── journalAnalysisModal.ts # Analysis modal
├── loadingIndicator.ts     # Loading indicator component
├── nlpEngine.ts            # NLP engine
├── personalityAnalysis.ts  # Personality analysis module
├── templateSystem.ts       # Template system
├── types.ts                # TypeScript interfaces
├── visualization.ts        # Visualization utilities
├── docs/                   # Documentation
├── types/                  # TypeScript type definitions
└── node_modules/           # Dependencies
```

## Key Components

### Main Plugin Class (main.ts)

The main plugin class (`DeleometerPlugin`) extends Obsidian's `Plugin` class and handles:
- Plugin initialization and cleanup
- Command registration
- Settings management
- Event handling

### NLP Engine (nlpEngine.ts)

The NLP engine processes journal entries and extracts insights:
- Emotion detection
- Psychoanalytic interpretation
- Personality analysis

### Visualization (visualization.ts)

The visualization module renders charts and visualizations:
- Emotion charts
- Personality trait charts
- Sentiment analysis

### Dashboard (dashboardView.ts)

The dashboard provides an interactive view of analysis data:
- Time-based filtering
- Emotion filtering
- Data export

### Template System (templateSystem.ts)

The template system manages templates for different analysis types:
- Template parsing
- Variable substitution
- Conditional logic

### Daily Notes Integration (dailyNotesIntegration.ts)

The daily notes integration module integrates with Obsidian's daily notes plugin:
- Daily note detection
- Batch analysis
- YAML frontmatter integration

## Development Setup

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Obsidian (for testing)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/deleometer.git
   cd deleometer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a development vault in Obsidian:
   - Create a new vault in Obsidian
   - Enable developer mode in Obsidian settings
   - Create a `.obsidian/plugins/deleometer` folder in the vault
   - Symlink your development files to this folder

4. Configure TypeScript:
   - Ensure `tsconfig.json` is properly configured
   - Add type definitions for Obsidian API

## Building the Plugin

### Development Build
```bash
npm run dev
```

This will:
- Compile TypeScript files
- Watch for changes
- Rebuild on file changes

### Production Build
```bash
npm run build
```

This will:
- Compile TypeScript files
- Minify the output
- Create a production-ready build

## Testing

### Manual Testing
1. Build the plugin
2. Load it in Obsidian
3. Test each feature manually

### Automated Testing
Currently, the plugin does not have automated tests. Contributions in this area are welcome!

## Contributing

### Code Style
- Follow the existing code style
- Use TypeScript features appropriately
- Document your code with JSDoc comments

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

### Documentation
- Update documentation for new features
- Add JSDoc comments to new functions and classes
- Update the README.md file if necessary

## API Reference

### DeleometerPlugin

The main plugin class that extends Obsidian's `Plugin` class.

```typescript
class DeleometerPlugin extends Plugin {
  // Properties
  settings: DeleometerAIJournalSettings;
  
  // Methods
  async onload(): Promise<void>;
  async onunload(): Promise<void>;
  async loadSettings(): Promise<void>;
  async saveSettings(): Promise<void>;
  async analyzeJournalEntry(content?: string): Promise<AnalysisResult>;
  async performAnalysis(text: string): Promise<AnalysisResult>;
  // ... other methods
}
```

### ApiService

Handles API calls to OpenAI and other providers.

```typescript
class ApiService {
  // Methods
  constructor(settings: ApiServiceSettings);
  async validateApiKey(): Promise<boolean>;
  async getCompletion(prompt: string, options?: any): Promise<any>;
  // ... other methods
}
```

### DashboardView

Provides an interactive view of analysis data.

```typescript
class DashboardView extends ItemView {
  // Methods
  constructor(leaf: WorkspaceLeaf, plugin: DeleometerPlugin);
  getViewType(): string;
  getDisplayText(): string;
  getIcon(): string;
  async onOpen(): Promise<void>;
  // ... other methods
}
```

### TemplateSystem

Manages templates for different analysis types.

```typescript
class TemplateSystem {
  // Methods
  constructor(app: App, templatesFolder: string);
  async initialize(): Promise<void>;
  async saveTemplate(name: string, content: string): Promise<void>;
  async getTemplate(name: string): Promise<string | null>;
  async applyTemplate(templateName: string, data: Record<string, any>): Promise<string | null>;
  // ... other methods
}
```

### DailyNotesIntegration

Integrates with Obsidian's daily notes plugin.

```typescript
class DailyNotesIntegration {
  // Methods
  constructor(app: App);
  getDailyNote(date?: Date): TFile | null;
  async addAnalysisToFrontmatter(file: TFile, analysis: AnalysisResult): Promise<void>;
  async getDailyNotesInRange(startDate: Date, endDate?: Date): Promise<TFile[]>;
  async analyzeAllDailyNotes(startDate: Date, endDate?: Date, analyzeCallback: Function): Promise<void>;
  // ... other methods
}
```
