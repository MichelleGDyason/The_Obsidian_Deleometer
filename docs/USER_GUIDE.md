# Deleometer User Guide

This guide provides detailed instructions for using the Deleometer plugin for Obsidian.

## Table of Contents
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Basic Usage](#basic-usage)
4. [Dashboard](#dashboard)
5. [Templates](#templates)
6. [Daily Notes Integration](#daily-notes-integration)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)

## Installation

1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click "Browse" and search for "Deleometer"
4. Install the plugin and enable it

Alternatively, you can manually install the plugin:
1. Download the latest release from the GitHub repository
2. Extract the files to your Obsidian plugins folder
3. Enable the plugin in Obsidian settings

## Configuration

### API Settings
1. Open Obsidian Settings
2. Go to the Deleometer settings tab
3. Enter your OpenAI API key
4. Select your preferred AI provider (OpenAI, Claude, or Local)
5. Choose the AI model to use (e.g., GPT-4)

### Analysis Options
1. Enable or disable emotional analysis
2. Enable or disable psychoanalytic insights
3. Enable or disable personality analysis
4. Enable or disable schizoanalysis (experimental)

### Template Settings
1. Set the templates folder path
2. Choose the default template
3. Customize template variables

### Dashboard Settings
1. Set the default time range for the dashboard
2. Configure chart options

## Basic Usage

### Analyzing a Journal Entry
1. Open or create a journal entry
2. Write your thoughts, feelings, and experiences
3. Use one of the following methods to analyze:
   - Use the command palette (Ctrl/Cmd+P) and select "Analyze Journal Entry"
   - Click the Deleometer icon in the status bar
   - Use the keyboard shortcut (if configured)
4. Wait for the analysis to complete
5. View the results in the analysis modal

### Understanding Analysis Results
The analysis modal has three tabs:
1. **Emotions**: Shows detected emotions and their intensity
2. **Psychoanalysis**: Provides psychoanalytic insights
3. **Personality**: Shows personality traits based on the Big Five model

### Exporting Analysis Results
1. Click the "Export Analysis" button in the analysis modal
2. The analysis will be saved as a markdown file in your vault
3. The file will include all analysis results in a formatted document

## Dashboard

### Opening the Dashboard
1. Use the command palette and select "Open Emotional Insights Dashboard"
2. Alternatively, click the "Open Dashboard" button in the settings

### Using the Dashboard
1. Select a time range (7 days, 30 days, 90 days, or all time)
2. Choose an emotion to track or select "All Emotions"
3. View the chart showing emotional patterns over time
4. Read the insights below the chart

### Exporting Dashboard Data
1. Click the "Export Dashboard Data" button
2. The data will be saved as a CSV file
3. You can open this file in spreadsheet software for further analysis

## Templates

### Using Templates
1. Go to the Deleometer settings tab
2. Select a template from the dropdown menu
3. The template will be used for new analyses

### Creating Custom Templates
1. Navigate to the templates folder in your vault
2. Create a new markdown file
3. Use the template syntax to define variables and logic
4. Save the file with a descriptive name

### Template Syntax
- `{{variable}}`: Inserts a variable value
- `{{date:format}}`: Inserts the current date in the specified format
- `{{#if condition}}...{{/if}}`: Conditional block
- `{{#each array}}...{{/each}}`: Loop through an array

## Daily Notes Integration

### Setting Up Integration
1. Enable daily notes integration in the settings
2. Choose a template for daily notes
3. Optionally enable auto-analysis

### Analyzing Daily Notes
1. Go to the Deleometer settings tab
2. Click one of the "Analyze" buttons:
   - "Last 7 Days": Analyzes notes from the past week
   - "Last 30 Days": Analyzes notes from the past month
   - "All Time": Analyzes all daily notes
3. Wait for the analysis to complete
4. View the results in the dashboard

### Using Analysis in Daily Notes
1. Analysis results are added to the YAML frontmatter
2. You can use these results in Dataview queries
3. You can create custom templates that use the analysis data

## Advanced Features

### Custom Analysis Frameworks
1. Create a new template with custom analysis prompts
2. Use the template for specific types of analysis
3. Share your templates with the community

### YAML Frontmatter Integration
1. Enable daily notes integration
2. Analyze your daily notes
3. The analysis results will be added to the YAML frontmatter
4. Use these results in Dataview queries

### Data Visualization
1. Use the dashboard to visualize emotional patterns
2. Export the data for use in external tools
3. Create custom visualizations using the exported data

## Troubleshooting

### API Key Issues
- Ensure your OpenAI API key is correct
- Check that your API key has sufficient credits
- Try regenerating your API key

### Analysis Errors
- Ensure your journal entry has sufficient content (at least 100 words)
- Check your internet connection
- Try again later if you encounter rate limits

### Dashboard Issues
- Ensure you have analyzed journal entries
- Check that Chart.js is loading correctly
- Try a different time range

### Template Issues
- Check the template syntax for errors
- Ensure the template file is in the correct folder
- Try using a default template to see if the issue persists

### Daily Notes Integration Issues
- Ensure the daily notes plugin is installed and configured
- Check the path to your daily notes folder
- Try analyzing a single note to see if the issue persists
