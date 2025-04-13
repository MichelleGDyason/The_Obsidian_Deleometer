# Deleometer: AI-Powered Journal Analysis for Obsidian

Deleometer is an Obsidian plugin that uses AI to analyze your journal entries, providing insights into your emotions, personality traits, and psychological patterns.

## Features

### Emotional Analysis
- Detect and quantify emotions in your journal entries
- Track emotional patterns over time
- Visualize emotional data with interactive charts

### Psychological Insights
- Get Freudian psychoanalytic interpretations
- Understand your personality traits based on the Big Five model
- Receive insights into your psychological patterns

### Data Visualization
- Interactive dashboard for tracking emotional patterns
- Filter by time range and emotion type
- Export data for external analysis

### Obsidian Integration
- Seamless integration with Obsidian's daily notes
- Add analysis results to YAML frontmatter
- Batch analyze multiple journal entries

### Template System
- Customizable templates for different analysis types
- Template variables and conditional logic
- Share templates with the community

## Getting Started

### Installation
1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click "Browse" and search for "Deleometer"
4. Install the plugin and enable it

### Configuration
1. Open Obsidian Settings
2. Go to the Deleometer settings tab
3. Enter your OpenAI API key
4. Configure analysis options
5. Set up daily notes integration (optional)

### Basic Usage
1. Open or create a journal entry
2. Write your thoughts, feelings, and experiences
3. Use the command palette (Ctrl/Cmd+P) and select "Analyze Journal Entry"
4. View the analysis results in the modal

### Dashboard
1. Use the command palette and select "Open Emotional Insights Dashboard"
2. View your emotional patterns over time
3. Filter by time range and emotion type
4. Export data for external analysis

### Templates
1. Go to the Deleometer settings tab
2. Configure template settings
3. Use templates for different analysis types
4. Create custom templates (advanced)

## API Integration

Deleometer uses OpenAI's GPT models for analysis. You'll need an OpenAI API key to use the plugin.

1. Sign up at [OpenAI](https://openai.com/)
2. Create an API key
3. Enter the key in the Deleometer settings

## Daily Notes Integration

Deleometer can integrate with Obsidian's daily notes plugin:

1. Enable daily notes integration in the settings
2. Choose a template for daily notes
3. Optionally enable auto-analysis
4. Use the "Analyze Daily Notes" button to analyze past entries

## Advanced Features

### Custom Templates
Create custom templates in the templates folder:
- Use `{{variable}}` syntax for variables
- Use `{{#if condition}}...{{/if}}` for conditional blocks
- Use `{{#each array}}...{{/each}}` for loops

### YAML Frontmatter
Deleometer can add analysis results to YAML frontmatter:
```yaml
---
deleometer:
  date: 2023-06-15T12:34:56.789Z
  emotions:
    joy: 7
    sadness: 3
    anger: 2
  sentiment: 0.6
  personality:
    openness: 0.8
    conscientiousness: 0.7
    extraversion: 0.4
    agreeableness: 0.6
    neuroticism: 0.3
---
```

### Data Export
Export your analysis data:
- CSV format for spreadsheet analysis
- Markdown format for documentation
- JSON format for programmatic use

## Troubleshooting

### API Key Issues
- Ensure your OpenAI API key is correct
- Check that your API key has sufficient credits
- Try regenerating your API key

### Analysis Errors
- Ensure your journal entry has sufficient content
- Check your internet connection
- Try again later if you encounter rate limits

### Dashboard Issues
- Ensure you have analyzed journal entries
- Check that Chart.js is loading correctly
- Try a different time range

## Privacy

Deleometer respects your privacy:
- Your journal entries are only sent to OpenAI for analysis
- Analysis results are stored locally in your Obsidian vault
- No data is shared with third parties

## Roadmap

See the [roadmap.md](../roadmap.md) file for planned features and improvements.

## Contributing

Contributions are welcome! See the [CONTRIBUTING.md](../CONTRIBUTING.md) file for guidelines.

## License

This plugin is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
